import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './ProductModel.module.scss';
import { IoClose, IoAdd, IoTrashOutline } from 'react-icons/io5'; // Cài react-icons nếu chưa có
import categoryApi from '~/api/categoryApi';
const cx = classNames.bind(styles);
const BASE_URL = 'http://localhost:3001';

function ProductModal({ isOpen, onClose, product, onSave }) {
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        category: '',
        basePrice: '',
        variants: [{ color: '', price: '', size: [{ 38: 0 }], images: [] }],
    });

    useEffect(() => {
        if (product) {
            setFormData(product);
        } else {
            setFormData({
                name: '',
                brand: '',
                category: '',
                basePrice: '',
                variants: [{ color: '', price: '', size: [{ Size: 1 }], images: [] }],
            });
        }
    }, [product, isOpen]);

    // --- VARIANT LOGIC ---
    const addVariant = () => {
        setFormData({
            ...formData,
            variants: [...formData.variants, { color: '', price: '', size: [{ Size: 1 }], images: [] }],
        });
    };

    const removeVariant = (vIdx) => {
        const newVariants = formData.variants.filter((_, i) => i !== vIdx);
        setFormData({ ...formData, variants: newVariants });
    };

    const handleVariantChange = (vIdx, field, value) => {
        const newVariants = [...formData.variants];
        newVariants[vIdx][field] = value;
        setFormData({ ...formData, variants: newVariants });
    };

    // --- SIZE LOGIC ---
    const addSize = (vIdx) => {
        const newVariants = [...formData.variants];
        // Giày thì mặc định số, túi thì để text
        const defaultSize = formData.category.toLowerCase().includes('giày') ? '39' : 'Size';
        newVariants[vIdx].size.push({ [defaultSize]: 0 });
        setFormData({ ...formData, variants: newVariants });
    };

    const removeSize = (vIdx, sIdx) => {
        const newVariants = [...formData.variants];
        newVariants[vIdx].size.splice(sIdx, 1);
        setFormData({ ...formData, variants: newVariants });
    };
    // Hàm thêm ảnh mới vào danh sách chờ
    const handleAddNewImages = (vIdx, files) => {
        const newVariants = [...formData.variants];
        const currentNewFiles = newVariants[vIdx].newImages ? Array.from(newVariants[vIdx].newImages) : [];

        // Gộp ảnh cũ đã chọn và ảnh mới vừa chọn
        const updatedFiles = [...currentNewFiles, ...Array.from(files)];

        newVariants[vIdx].newImages = updatedFiles;
        setFormData({ ...formData, variants: newVariants });
    };

    // Hàm xóa ảnh CŨ (ảnh đã nằm trên database)
    const handleRemoveExistingImage = (vIdx, imgIdx) => {
        const newVariants = [...formData.variants];
        // Xóa URL ảnh khỏi mảng images
        newVariants[vIdx].images.splice(imgIdx, 1);
        setFormData({ ...formData, variants: newVariants });
    };

    // Hàm xóa ảnh MỚI (ảnh vừa chọn nhầm từ máy tính)
    const handleRemoveNewImage = (vIdx, imgIdx) => {
        const newVariants = [...formData.variants];
        const currentNewFiles = Array.from(newVariants[vIdx].newImages);
        currentNewFiles.splice(imgIdx, 1);

        newVariants[vIdx].newImages = currentNewFiles;
        setFormData({ ...formData, variants: newVariants });
    };
    const handleSizeChange = (vIdx, sIdx, newKey, value) => {
        const newVariants = [...formData.variants];
        newVariants[vIdx].size[sIdx] = { [newKey]: Number(value) };
        setFormData({ ...formData, variants: newVariants });
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // ✅ đúng API
                const res = await categoryApi.getCategories();
                setCategories(res.data);
            } catch (err) {
                console.error('Không lấy được danh mục', err);
            }
        };

        if (isOpen) fetchCategories();
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className={cx('modalOverlay')}>
            <div className={cx('modalContent')}>
                <div className={cx('modalHeader')}>
                    <h2>{product ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
                    <button className={cx('btnClose')} onClick={onClose}>
                        <IoClose />
                    </button>
                </div>

                <div className={cx('modalBody')}>
                    {/* THÔNG TIN CHUNG */}
                    <div className={cx('sectionTitle')}>Thông tin cơ bản</div>
                    <div className={cx('mainGrid')}>
                        <div className={cx('inputGroup')}>
                            <label>Tên sản phẩm</label>
                            <input
                                placeholder="Ví dụ: Giày Sneaker AF1"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className={cx('inputGroup')}>
                            <label>Thương hiệu</label>
                            <input
                                placeholder="Nike, Adidas..."
                                value={formData.brand}
                                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                            />
                        </div>
                        <div className={cx('inputGroup')}>
                            <label>Danh mục</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className={cx('selectCategory')}
                            >
                                <option value="">-- Chọn danh mục --</option>
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat.name}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className={cx('inputGroup')}>
                            <label>Giá gốc (₫)</label>
                            <input
                                type="number"
                                placeholder="0"
                                value={formData.basePrice}
                                onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* DANH SÁCH BIẾN THỂ */}
                    <div className={cx('sectionTitle')}>Các phiên bản màu sắc & Size</div>
                    <div className={cx('variantList')}>
                        {formData.variants.map((v, vIdx) => (
                            <div key={vIdx} className={cx('variantCard')}>
                                <div className={cx('variantCardHeader')}>
                                    <span>Màu sắc #{vIdx + 1}</span>
                                    {formData.variants.length > 1 && (
                                        <button className={cx('btnDeleteV')} onClick={() => removeVariant(vIdx)}>
                                            <IoTrashOutline /> Xóa màu
                                        </button>
                                    )}
                                </div>

                                <div className={cx('variantMainInputs')}>
                                    <div className={cx('inputGroup')}>
                                        <label>Tên màu</label>
                                        <input
                                            placeholder="Đen, Trắng, Blue..."
                                            value={v.color}
                                            onChange={(e) => handleVariantChange(vIdx, 'color', e.target.value)}
                                        />
                                    </div>
                                    <div className={cx('inputGroup')}>
                                        <label>Giá riêng (nếu có)</label>
                                        <input
                                            type="number"
                                            placeholder="Mặc định theo giá gốc"
                                            value={v.price}
                                            onChange={(e) => handleVariantChange(vIdx, 'price', e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* SIZE AREA */}
                                <div className={cx('sizeArea')}>
                                    <label>Quản lý Size & Tồn kho</label>
                                    <div className={cx('sizeGrid')}>
                                        {v.size.map((s, sIdx) => {
                                            const sName = Object.keys(s)[0];
                                            const sQty = Object.values(s)[0];
                                            return (
                                                <div key={sIdx} className={cx('sizeBox')}>
                                                    <input
                                                        className={cx('sName')}
                                                        value={sName}
                                                        onChange={(e) =>
                                                            handleSizeChange(vIdx, sIdx, e.target.value, sQty)
                                                        }
                                                        placeholder="Size"
                                                    />
                                                    <input
                                                        className={cx('sQty')}
                                                        type="number"
                                                        value={sQty}
                                                        onChange={(e) =>
                                                            handleSizeChange(vIdx, sIdx, sName, e.target.value)
                                                        }
                                                        placeholder="Số lượng"
                                                    />
                                                    <button
                                                        className={cx('btnRemoveSize')}
                                                        onClick={() => removeSize(vIdx, sIdx)}
                                                    >
                                                        <IoClose />
                                                    </button>
                                                </div>
                                            );
                                        })}
                                        <button className={cx('btnAddSize')} onClick={() => addSize(vIdx)}>
                                            <IoAdd /> Thêm Size
                                        </button>
                                    </div>
                                </div>

                                <div className={cx('imageArea')}>
                                    <label>Hình ảnh biến thể</label>
                                    {/* Khu vực hiển thị ảnh đã có */}
                                    <div className={cx('imageGallery')}>
                                        {/* 1. HIỂN THỊ ẢNH CŨ (Từ Server) */}
                                        {v.images &&
                                            v.images.map((imgUrl, imgIdx) => (
                                                <div key={`old-${imgIdx}`} className={cx('imageThumb')}>
                                                    <img src={`${BASE_URL}${imgUrl}`} alt="product" />
                                                    <button
                                                        type="button"
                                                        className={cx('btnRemoveImg')}
                                                        onClick={() => handleRemoveExistingImage(vIdx, imgIdx)}
                                                    >
                                                        &times;
                                                    </button>
                                                </div>
                                            ))}

                                        {/* 2. HIỂN THỊ ẢNH MỚI CHUẨN BỊ UPLOAD (Preview) */}
                                        {v.newImages &&
                                            Array.from(v.newImages).map((file, imgIdx) => (
                                                <div key={`new-${imgIdx}`} className={cx('imageThumb', 'new')}>
                                                    <img src={URL.createObjectURL(file)} alt="preview" />
                                                    <button
                                                        type="button"
                                                        className={cx('btnRemoveImg')}
                                                        onClick={() => handleRemoveNewImage(vIdx, imgIdx)}
                                                    >
                                                        &times;
                                                    </button>
                                                    <span className={cx('badgeNew')}>Mới</span>
                                                </div>
                                            ))}

                                        {/* Nút chọn thêm ảnh */}
                                        <label className={cx('btnAddImg')}>
                                            <input
                                                type="file"
                                                multiple
                                                hidden
                                                onChange={(e) => handleAddNewImages(vIdx, e.target.files)}
                                            />
                                            <span>+ Thêm ảnh</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className={cx('btnCustomAddV')} onClick={addVariant}>
                        <IoAdd /> Thêm màu sắc mới
                    </button>
                </div>

                <div className={cx('modalFooter')}>
                    <button className={cx('btnCancel')} onClick={onClose}>
                        Hủy bỏ
                    </button>
                    <button className={cx('btnSave')} onClick={() => onSave(formData)}>
                        Lưu sản phẩm ngay
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProductModal;
