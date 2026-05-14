import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import style from './CategoryManager.module.scss'; // hoặc SCSS nếu bạn dùng
import categoryApi from '~/api/categoryApi';
import Button from '~/compopnents/Buttons';
const cx = classNames.bind(style);
function CategoryManager() {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    // Lấy danh sách categorys
    const fetchCategories = async () => {
        try {
            const res = await categoryApi.getCategories();
            const data = Array.isArray(res.data) ? res.data : res.data.data || [];
            setCategories(data);
        } catch (err) {
            console.error('Fetch categories failed:', err);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Tạo category mới
    const handleCreate = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        try {
            setLoading(true);
            await categoryApi.createCategory({ name });
            setName('');
            fetchCategories(); // reload list
        } catch (err) {
            console.error('Create category failed:', err);
        } finally {
            setLoading(false);
        }
    };

    // Xoá category
    const handleDelete = async (id) => {
        const ok = window.confirm('Bạn có chắc muốn xoá category này không?');
        if (!ok) return;

        try {
            await categoryApi.deleteCategory(id);
            setCategories((prev) => prev.filter((c) => c._id !== id && c.id !== id));
        } catch (err) {
            console.error('Delete category failed:', err);
        }
    };
    // CategoryManager.js
    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>
                <h2>📦 Quản lý danh mục</h2>
                <p>Thêm, sửa hoặc xoá các loại sản phẩm trong hệ thống</p>
            </div>

            <div className={cx('container')}>
                {/* LEFT: List */}
                <div className={cx('card', 'list-section')}>
                    <div className={cx('card-title')}>
                        <h3>Danh sách hiện có ({categories.length})</h3>
                    </div>
                    <ul className={cx('list')}>
                        {categories.length > 0 ? (
                            categories.map((item) => (
                                <li key={item._id || item.id} className={cx('item')}>
                                    <span className={cx('name')}>{item.name}</span>
                                    <Button
                                        outline
                                        className={cx('btn-delete')}
                                        onClick={() => handleDelete(item._id || item.id)}
                                        title="Xoá danh mục"
                                    >
                                        Xoá
                                    </Button>
                                </li>
                            ))
                        ) : (
                            <p className={cx('empty')}>Chưa có danh mục nào.</p>
                        )}
                    </ul>
                </div>

                {/* RIGHT: Create */}
                <div className={cx('card', 'create-section')}>
                    <div className={cx('card-title')}>
                        <h3>Thêm mới</h3>
                    </div>
                    <form onSubmit={handleCreate} className={cx('form')}>
                        <div className={cx('input-group')}>
                            <label>Tên danh mục</label>
                            <input
                                type="text"
                                placeholder="VD: Điện thoại, Laptop..."
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <button className={cx('btn-submit')} type="submit" disabled={loading || !name.trim()}>
                            {loading ? 'Đang xử lý...' : '✨ Tạo danh mục'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CategoryManager;
