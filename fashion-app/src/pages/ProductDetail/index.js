import { useParams } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import classNames from 'classnames/bind';
import styles from './ProductDetail.module.scss';
import productApi from '~/api/productApi';
import images from '~/assets/images';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeartCircleBolt, faArrowRightLong, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '~/context/AuthContext';
import cartApi from '~/api/cartApi';

const cx = classNames.bind(styles);
const BASE_URL = 'http://localhost:3001';

function ProductDetail() {
    const { slug } = useParams();
    const [product, setProduct] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await productApi.getBySlug(slug);
                const productData = res.data;
                setProduct(productData);
                if (productData?.variants?.length > 0) {
                    setSelectedVariant(productData.variants[0]);
                }
            } catch (error) {
                console.error('Lỗi fetch product:', error);
            }
        };
        fetchProduct();
    }, [slug]);

    if (!product || !selectedVariant) return <div className={cx('loading')}>Đang tải...</div>;

    // --- LOGIC TÍNH GIÁ HIỂN THỊ (THEO DATA MỚI) ---
    // Ưu tiên giá của variant, nếu không có lấy basePrice của product
    const currentPrice = selectedVariant.price || product.basePrice || 0;

    const variantImages =
        selectedVariant.images?.length > 0
            ? selectedVariant.images.map((img) => (img.startsWith('http') ? img : `${BASE_URL}${img}`))
            : [images.noImage];

    const handleSelectColor = (vId) => {
        const found = product.variants.find((v) => v._id === vId);
        setSelectedVariant(found);
        setSelectedSize(''); // Reset size khi đổi màu
        setQuantity(1); // Reset số lượng
    };

    const updateQuantity = (type) => {
        if (type === 'plus') setQuantity((prev) => prev + 1);
        else if (type === 'minus' && quantity > 1) setQuantity((prev) => prev - 1);
    };

    // --- LOGIC THÊM VÀO GIỎ HÀNG (KHỚP VỚI JSON DATA) ---
    const handleAddToCart = async () => {
        if (!selectedSize) {
            alert('Vui lòng chọn Kích cỡ!');
            return;
        }

        // Theo JSON của bạn, SKU nằm trực tiếp trong selectedVariant
        const currentSku = selectedVariant.sku || 'N/A';

        const cartItem = {
            userId: user?._id, // Truyền ID user để backend lưu đúng người
            productId: product._id,
            variantId: selectedVariant._id,
            name: product.name,
            color: selectedVariant.color,
            size: selectedSize,
            sku: currentSku, // Lấy SKU từ variant
            price: currentPrice, // Đã bao gồm logic fallback basePrice ở trên
            image: selectedVariant.images?.[0] || '',
            quantity: quantity,
        };

        try {
            const res = await cartApi.addToCart(cartItem, user?.token);
            console.log('Phản hồi từ Server:', res.data); // Sử dụng biến res ở đây
            alert('Thêm vào giỏ hàng thành công!');
            window.dispatchEvent(new Event('cartUpdated'));
        } catch (err) {
            console.error('Lỗi:', err);
        }
    };

    return (
        <div className={cx('container')}>
            <div className={cx('productWrapper')}>
                <div className={cx('imageGrid')}>
                    {variantImages.map((url, index) => (
                        <div key={index} className={cx('imageItem')}>
                            <img src={url} alt={product.name} />
                        </div>
                    ))}
                </div>

                <div className={cx('infoColumn')}>
                    <div className={cx('header')}>
                        <h1 className={cx('name')}>{product.name}</h1>
                        <p className={cx('brand')}>
                            Thương hiệu: <strong>{product.brand}</strong>
                        </p>
                    </div>

                    {/* HIỂN THỊ GIÁ THEO LOGIC FALLBACK */}
                    <p className={cx('price')}>{currentPrice.toLocaleString()} ₫</p>

                    <div className={cx('section')}>
                        <p className={cx('sectionTitle')}>
                            MÀU SẮC: <span>{selectedVariant.color}</span>
                        </p>
                        <div className={cx('optionGrid')}>
                            {product.variants.map((v) => (
                                <button
                                    key={v._id}
                                    className={cx('optionBtn', { active: selectedVariant._id === v._id })}
                                    onClick={() => handleSelectColor(v._id)}
                                >
                                    {v.color}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={cx('section')}>
                        <p className={cx('sectionTitle')}>
                            KÍCH CỠ: <span>{selectedSize || 'Chưa chọn'}</span>
                        </p>
                        <div className={cx('optionGrid')}>
                            {selectedVariant.size.map((s, index) => {
                                // Lấy tên size (key) từ object {"S": 10}
                                const sizeName = Object.keys(s)[0];
                                const stock = s[sizeName];

                                return (
                                    <button
                                        key={index}
                                        disabled={stock <= 0} // Vô hiệu hóa nếu hết hàng
                                        className={cx('optionBtn', {
                                            active: selectedSize === sizeName,
                                            outOfStock: stock <= 0,
                                        })}
                                        onClick={() => setSelectedSize(sizeName)}
                                    >
                                        {sizeName}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className={cx('section')}>
                        <p className={cx('sectionTitle')}>SỐ LƯỢNG</p>
                        <div className={cx('quantitySelector')}>
                            <button onClick={() => updateQuantity('minus')}>
                                <FontAwesomeIcon icon={faMinus} />
                            </button>
                            <input type="text" value={quantity} readOnly />
                            <button onClick={() => updateQuantity('plus')}>
                                <FontAwesomeIcon icon={faPlus} />
                            </button>
                        </div>
                    </div>

                    <div className={cx('description')}>
                        <p className={cx('sectionTitle')}>MÔ TẢ</p>
                        <span className={cx('text')}>{product.description}</span>
                    </div>

                    <div className={cx('actions')}>
                        <button className={cx('addToCart')} onClick={handleAddToCart}>
                            <span>THÊM VÀO GIỎ HÀNG</span>
                            <FontAwesomeIcon icon={faArrowRightLong} />
                        </button>
                        <button className={cx('wishlist')}>
                            <FontAwesomeIcon icon={faHeartCircleBolt} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;
