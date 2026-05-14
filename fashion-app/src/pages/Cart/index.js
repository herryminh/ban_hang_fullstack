import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Cart.module.scss';
import classNames from 'classnames/bind';
import images from '~/assets/images';
import { AuthContext } from '~/context/AuthContext';
import cartApi from '~/api/cartApi';
import orderApi from '~/api/oderApi'; // Đã sửa lỗi chính tả: oderApi -> orderApi
import { toast } from 'react-toastify';

const cx = classNames.bind(styles);
const BASE_URL = 'http://localhost:3001';

const Cart = () => {
    const { user, loading } = useContext(AuthContext);
    const [isProcessing, setIsProcessing] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const [cartItems, setCartItems] = useState([]);
    const [fetching, setFetching] = useState(true);
    const [shippingData, setShippingData] = useState({
        fullName: '',
        phone: '',
        address: '',
        paymentMethod: 'cod',
        customerNote: '',
    });

    // --- 1. Lấy dữ liệu giỏ hàng ---
    const fetchCart = useCallback(async () => {
        if (!user || !user._id) return;

        try {
            setFetching(true);
            const res = await cartApi.getMyCart(user._id, user.token);
            // Lưu ý: formattedData phụ thuộc vào cấu trúc trả về của API bạn
            const formattedData = res.data.map((doc) => ({
                ...doc.items[0],
                cartDocId: doc._id,
            }));
            setCartItems(formattedData);
        } catch (error) {
            console.error('Lỗi fetch giỏ hàng:', error);
        } finally {
            setFetching(false);
        }
    }, [user]);

    useEffect(() => {
        if (!loading) {
            if (!user) {
                navigate('/login', { state: { from: location.pathname }, replace: true });
            } else {
                fetchCart();
            }
        }
    }, [user, loading, navigate, location.pathname, fetchCart]);

    // --- 2. Xóa sản phẩm ---
    const handleRemoveItem = async (cartDocId) => {
        if (!window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;
        try {
            await cartApi.removeFromCart(cartDocId, user.token);
            fetchCart();
            window.dispatchEvent(new Event('cartUpdated'));
        } catch (error) {
            alert('Lỗi khi xóa sản phẩm');
        }
    };

    // --- 3. Cập nhật số lượng ---
    const handleUpdateQuantity = async (cartDocId, currentQty, adjustment) => {
        const newQty = currentQty + adjustment;
        if (newQty < 1) return;

        try {
            await cartApi.updateQuantity(cartDocId, newQty, user.token);
            fetchCart();
            window.dispatchEvent(new Event('cartUpdated'));
        } catch (error) {
            console.error('Lỗi cập nhật số lượng:', error);
        }
    };

    const handleInputChange = (e) => {
        setShippingData({ ...shippingData, [e.target.name]: e.target.value });
    };

    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    // --- 4. Xử lý đặt hàng ---
    const handleCheckout = async () => {
        const { fullName, phone, address, customerNote } = shippingData;

        // 1. Validate
        if (!fullName.trim() || !phone.trim() || !address.trim()) {
            toast.warn('Vui lòng nhập đầy đủ thông tin giao hàng!');
            return;
        }
        if (cartItems.length === 0) {
            toast.error('Giỏ hàng trống!');
            return;
        }
        if (!window.confirm('Bạn xác nhận muốn đặt đơn hàng này?')) return;

        try {
            setIsProcessing(true);

            const orderPayload = {
                userId: user._id,
                customerName: fullName,
                phone: phone,
                address: address,
                customerNote: customerNote,
                items: cartItems.map((item) => ({
                    productId: item.productId,
                    variantId: item.variantId,
                    sku: item.sku,
                    name: item.name,
                    color: item.color,
                    size: item.size,
                    quantity: item.quantity,
                    price: item.price,
                    image: item.image,
                })),
                totalAmount: totalPrice,
                paymentMethod: shippingData.paymentMethod,
            };

            // 2. Gọi API tạo đơn hàng
            const resOrder = await orderApi.createOrder(orderPayload, user.token);
            console.log('Kết quả tạo đơn hàng:', resOrder); // Log để kiểm tra cấu trúc data

            // Kiểm tra điều kiện thoáng hơn: chỉ cần resOrder có tồn tại
            if (resOrder) {
                // 1. Hiển thị thông báo thành công (Toast này nằm ở App.js nên chuyển trang nó vẫn hiện)
                toast.success('🎉 Đặt hàng thành công!');

                try {
                    // 2. Xóa sạch giỏ hàng trong Database
                    await cartApi.clearCart(user._id, user.token);
                } catch (err) {
                    console.error('Lỗi khi xóa giỏ hàng:', err);
                }

                // 3. Cập nhật số lượng trên Header (Badge)
                window.dispatchEvent(new Event('cartUpdated'));

                // 4. CHUYỂN TRANG LUÔN
                // Không gọi setCartItems([]) nữa để tránh hiện màn hình "Giỏ hàng trống"
                navigate('/', { replace: true });
            }
        } catch (error) {
            console.error('Lỗi quy trình đặt hàng:', error);
            const errorMsg = error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại sau.';
            toast.error('Lỗi đặt hàng: ' + errorMsg);
        } finally {
            setIsProcessing(false);
        }
    };

    if (loading || fetching) return <div className={cx('loading')}>Đang tải giỏ hàng...</div>;

    return (
        <div className={cx('cart-wrapper')}>
            <h2 className={cx('title')}>Giỏ hàng của bạn</h2>

            {cartItems.length > 0 ? (
                <div className={cx('main-content')}>
                    <div className={cx('cart-list')}>
                        {cartItems.map((item) => {
                            const imageUrl = item.image
                                ? item.image.startsWith('http')
                                    ? item.image
                                    : `${BASE_URL}${item.image}`
                                : images.noImage;

                            return (
                                <div key={item.cartDocId} className={cx('cart-item')}>
                                    <div className={cx('image-container')}>
                                        <img src={imageUrl} alt={item.name} className={cx('item-image')} />
                                    </div>

                                    <div className={cx('item-info')}>
                                        <span className={cx('item-name')}>{item.name}</span>
                                        <span className={cx('item-desc')}>
                                            Phân loại: {item.color} / {item.size}
                                        </span>
                                        <div className={cx('item-price')}>{item.price.toLocaleString()}₫</div>

                                        <div className={cx('quantity-control')}>
                                            <button
                                                onClick={() => handleUpdateQuantity(item.cartDocId, item.quantity, -1)}
                                            >
                                                -
                                            </button>
                                            <span className={cx('qty-value')}>{item.quantity}</span>
                                            <button
                                                onClick={() => handleUpdateQuantity(item.cartDocId, item.quantity, 1)}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        className={cx('remove-btn')}
                                        onClick={() => handleRemoveItem(item.cartDocId)}
                                    >
                                        Xoá
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    <div className={cx('checkout-section')}>
                        <div className={cx('shipping-form')}>
                            <h3>Thông tin giao hàng</h3>
                            <input
                                name="fullName"
                                placeholder="Họ và tên"
                                value={shippingData.fullName}
                                onChange={handleInputChange}
                            />
                            <input
                                name="phone"
                                placeholder="Số điện thoại"
                                value={shippingData.phone}
                                onChange={handleInputChange}
                            />
                            <textarea
                                name="address"
                                placeholder="Địa chỉ nhận hàng"
                                value={shippingData.address}
                                onChange={handleInputChange}
                            />
                            <textarea
                                name="customerNote"
                                className={cx('note-input')}
                                placeholder="Ghi chú cho đơn hàng (ví dụ: giao giờ hành chính, gọi trước khi giao...)"
                                value={shippingData.customerNote}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className={cx('payment-methods')}>
                            <h3>Phương thức thanh toán</h3>
                            <label>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="cod"
                                    checked={shippingData.paymentMethod === 'cod'}
                                    onChange={handleInputChange}
                                />{' '}
                                COD
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="banking"
                                    checked={shippingData.paymentMethod === 'banking'}
                                    onChange={handleInputChange}
                                />{' '}
                                Chuyển khoản
                            </label>
                        </div>

                        <div className={cx('footer-summary')}>
                            <div className={cx('summary')}>
                                <span>Tổng cộng:</span>
                                <span className={cx('total-amount')}>{totalPrice.toLocaleString()}₫</span>
                            </div>
                            <button className={cx('checkout-btn')} onClick={handleCheckout} disabled={isProcessing}>
                                {isProcessing ? 'ĐANG XỬ LÝ...' : 'XÁC NHẬN ĐẶT HÀNG'}
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className={cx('empty-container')}>
                    <p>Giỏ hàng trống</p>
                    <button onClick={() => navigate('/')}>MUA SẮM NGAY</button>
                </div>
            )}
        </div>
    );
};

export default Cart;
