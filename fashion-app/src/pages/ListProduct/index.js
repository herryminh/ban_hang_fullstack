import { useEffect, useState, Fragment } from 'react';
import classNames from 'classnames/bind';
import styles from './ListProduct.module.scss';
import productApi from '~/api/productApi';
import ProductModal from '../ProductModel';

const cx = classNames.bind(styles);
const BASE_URL = 'http://localhost:3001';

function ListProduct() {
    const [products, setProducts] = useState([]);
    const [expandedRows, setExpandedRows] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Hàm Xóa
    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
            try {
                await productApi.deleteProduct(id);
                setProducts(products.filter((p) => p._id !== id));
            } catch (err) {
                alert('Xóa thất bại');
            }
        }
    };

    // Hàm Mở Modal để Sửa
    const handleEdit = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    // Hàm Lưu (Gộp cả Thêm và Sửa)
    const handleSave = async (formData) => {
        try {
            // 1. UPDATE PRODUCT (KHÔNG ĐỘNG VARIANT)
            await productApi.updateProduct(formData._id, {
                name: formData.name,
                brand: formData.brand,
                category: formData.category,
                basePrice: formData.basePrice,
            });

            // 2. XỬ LÝ VARIANT
            const variantPromises = [];

            formData.variants.forEach((variant) => {
                const fd = new FormData();
                fd.append('productId', formData._id);
                fd.append('color', variant.color);
                fd.append('price', variant.price || formData.basePrice);
                fd.append('size', JSON.stringify(variant.size));

                // Ảnh mới
                if (variant.newImages?.length) {
                    variant.newImages.forEach((file) => {
                        fd.append('images', file);
                    });
                }

                // ✅ VARIANT CŨ → UPDATE
                if (variant._id) {
                    variantPromises.push(productApi.updateVariant(variant._id, fd));
                }

                // 🆕 VARIANT MỚI → CREATE
                if (!variant._id) {
                    variantPromises.push(productApi.createVariant(fd));
                }
            });

            await Promise.all(variantPromises);

            alert('Lưu sản phẩm & biến thể thành công');
        } catch (err) {
            console.error(err);
            alert('Lỗi khi lưu dữ liệu');
        }
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await productApi.getProducts();
                const data = Array.isArray(res.data) ? res.data : res.data.data || [];
                setProducts(data);
            } catch (err) {
                console.error('Fetch products failed:', err);
            }
        };
        fetchProducts();
    }, []);

    const toggleRow = (id) => {
        setExpandedRows((prev) => (prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]));
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>
                <div className={cx('titleGroup')}>
                    <h2>Quản lý kho hàng</h2>
                    <p>Hiển thị chi tiết biến thể và tồn kho hệ thống</p>
                </div>
                <button
                    className={cx('btnAdd')}
                    onClick={() => {
                        setSelectedProduct(null);
                        setIsModalOpen(true);
                    }}
                >
                    + Thêm sản phẩm
                </button>
            </div>

            <div className={cx('tableWrapper')}>
                <table className={cx('table')}>
                    <thead>
                        <tr>
                            <th width="50"></th>
                            <th width="90">Ảnh chính</th>
                            <th>Thông tin sản phẩm</th>
                            <th>Thương hiệu</th>
                            <th>Giá gốc</th>
                            <th>Kho</th>
                            <th className={cx('textRight')}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => {
                            const isExpanded = expandedRows.includes(product._id);
                            const mainImg = product.variants?.[0]?.images?.[0];

                            return (
                                <Fragment key={product._id}>
                                    <tr className={cx('mainRow', { isExpanded })}>
                                        <td className={cx('textCenter')}>
                                            <button className={cx('btnToggle')} onClick={() => toggleRow(product._id)}>
                                                <span className={cx('arrow', { active: isExpanded })}>▶</span>
                                            </button>
                                        </td>
                                        <td>
                                            <div className={cx('mainImgBox')}>
                                                <img src={mainImg ? `${BASE_URL}${mainImg}` : ''} alt="" />
                                            </div>
                                        </td>
                                        <td>
                                            <div className={cx('name')}>{product.name}</div>
                                            <div className={cx('category')}>{product.category}</div>
                                        </td>
                                        <td>
                                            <span className={cx('brand')}>{product.brand}</span>
                                        </td>
                                        <td className={cx('price')}>{product.basePrice?.toLocaleString()}₫</td>
                                        <td>{product.variants?.length || 0} loại</td>
                                        <td className={cx('textRight')}>
                                            {/* Nút Sửa: Truyền toàn bộ đối tượng 'product' vào để Modal có dữ liệu cũ */}
                                            <button className={cx('btnAction')} onClick={() => handleEdit(product)}>
                                                Sửa
                                            </button>

                                            {/* Nút Xóa: Truyền ID để biết chính xác cần xóa sản phẩm nào */}
                                            <button
                                                className={cx('btnAction', 'delete')}
                                                onClick={() => handleDelete(product._id)}
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>

                                    {/* BIẾN THỂ XẾP DỌC */}
                                    {isExpanded && (
                                        <tr className={cx('expandRow')}>
                                            <td colSpan="7">
                                                <div className={cx('variantContainer')}>
                                                    <div className={cx('vHeader')}>Phiên bản chi tiết</div>

                                                    <div className={cx('vVerticalList')}>
                                                        {product.variants.map((v) => (
                                                            <div key={v._id} className={cx('vItem')}>
                                                                {/* Gallery ảnh lớn hơn, trượt ngang */}
                                                                <div className={cx('vGallery')}>
                                                                    {v.images?.map((img, i) => (
                                                                        <div key={i} className={cx('vImgFrame')}>
                                                                            <img src={`${BASE_URL}${img}`} alt="" />
                                                                        </div>
                                                                    ))}
                                                                </div>

                                                                {/* Thông tin chi tiết bên cạnh */}
                                                                <div className={cx('vDetails')}>
                                                                    <div className={cx('vInfoMain')}>
                                                                        <div className={cx('vColor')}>
                                                                            Màu: <strong>{v.color}</strong>
                                                                        </div>
                                                                        <div className={cx('vSku')}>SKU: {v.sku}</div>
                                                                        <div className={cx('vPrice')}>
                                                                            {v.price.toLocaleString()}₫
                                                                        </div>
                                                                    </div>

                                                                    <div className={cx('vInventory')}>
                                                                        {v.size.map((sObj, idx) => {
                                                                            const sName = Object.keys(sObj)[0];
                                                                            const sQty = Object.values(sObj)[0];
                                                                            return (
                                                                                <div
                                                                                    key={idx}
                                                                                    className={cx('sizeBadge')}
                                                                                >
                                                                                    <span className={cx('sLabel')}>
                                                                                        {sName}
                                                                                    </span>
                                                                                    <span className={cx('sCount')}>
                                                                                        {sQty}
                                                                                    </span>
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <ProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                product={selectedProduct}
                onSave={handleSave}
            />
        </div>
    );
}

export default ListProduct;
