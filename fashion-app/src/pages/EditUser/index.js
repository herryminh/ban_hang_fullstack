import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './EditUser.module.scss';
import Button from '~/compopnents/Buttons';
import authApi from '~/api/authApi';

const cx = classNames.bind(styles);
const BASE_URL = 'http://localhost:3001';

function EditUserForm({ userId, onClose, onUpdate }) {
    const [form, setForm] = useState({
        name: '',
        userName: '',
        email: '',
        phoneNumber: '',
        password: '',
        role: 'customer',
    });

    const [avatar, setAvatar] = useState(null);
    const [preview, setPreview] = useState('');
    const [message, setMessage] = useState('');

    // =========================
    // LOAD USER
    // =========================
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await authApi.getUserById(userId);
                const user = res.data.data;

                setForm({
                    name: user.name || '',
                    userName: user.userName || '',
                    email: user.email || '',
                    phoneNumber: user.phoneNumber || '',
                    password: '',
                    role: user.role || 'customer',
                });

                if (user.avatar) {
                    setPreview(`${BASE_URL}${user.avatar}`);
                }
            } catch (err) {
                console.error('Load user failed:', err);
            }
        };

        fetchUser();
    }, [userId]);

    // =========================
    // HANDLERS
    // =========================
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setAvatar(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();

        Object.entries(form).forEach(([key, value]) => {
            if (key === 'password' && !value.trim()) return;
            data.append(key, value);
        });

        if (avatar) {
            data.append('avatar', avatar);
        }

        try {
            await authApi.updateUser(userId, data);
            setMessage('Cập nhật thành công!');

            if (onUpdate) onUpdate();
            if (onClose) onClose();
        } catch (err) {
            setMessage(err.response?.data?.message || 'Cập nhật thất bại!');
        }
    };

    // =========================
    // RENDER
    // =========================
    return (
        <div className={cx('formBox')}>
            <div className={cx('formHeader')}>
                <h2>Sửa thông tin người dùng</h2>
                <p>Cập nhật hồ sơ và phân quyền tài khoản</p>
            </div>

            <form onSubmit={handleSubmit} className={cx('form')}>
                {/* GRID */}
                <div className={cx('formGrid')}>
                    <div className={cx('formGroup')}>
                        <label>Họ và tên</label>
                        <input name="name" value={form.name} onChange={handleChange} />
                    </div>

                    <div className={cx('formGroup')}>
                        <label>Tên đăng nhập</label>
                        <input name="userName" value={form.userName} onChange={handleChange} />
                    </div>

                    <div className={cx('formGroup')}>
                        <label>Email</label>
                        <input type="email" name="email" value={form.email} onChange={handleChange} />
                    </div>

                    <div className={cx('formGroup')}>
                        <label>Số điện thoại</label>
                        <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} />
                    </div>

                    <div className={cx('formGroup')}>
                        <label>Vai trò</label>
                        <select name="role" value={form.role} onChange={handleChange}>
                            <option value="customer">Customer</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <div className={cx('formGroup')}>
                        <label>Mật khẩu mới</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Để trống nếu không đổi"
                            value={form.password}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {/* AVATAR */}
                <div className={cx('avatarSection')}>
                    <div className={cx('avatarPreview')}>
                        {preview ? <img src={preview} alt="avatar" /> : <span>Avatar</span>}
                    </div>

                    <label className={cx('uploadBtn')}>
                        Chọn ảnh
                        <input type="file" accept="image/*" hidden onChange={handleFileChange} />
                    </label>
                </div>

                {/* ACTION */}
                <div className={cx('actions')}>
                    <Button outline type="button" onClick={onClose}>
                        Hủy
                    </Button>
                    <Button primary type="submit">
                        Lưu thay đổi
                    </Button>
                </div>

                {message && <p className={cx('message')}>{message}</p>}
            </form>
        </div>
    );
}

export default EditUserForm;
