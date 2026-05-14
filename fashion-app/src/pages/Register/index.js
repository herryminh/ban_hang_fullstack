import { useState } from 'react';
import styles from './Register.module.scss'; // thêm dòng này
import classNames from 'classnames/bind';
import Button from '~/compopnents/Buttons';
import authApi from '~/api/authApi';
const cx = classNames.bind(styles);

function Register() {
    const [form, setForm] = useState({
        name: '',
        userName: '',
        password: '',
        email: '',
        phoneNumber: '',
    });

    const [avatar, setAvatar] = useState(null);
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleFileChange = (e) => {
        setAvatar(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('name', form.name);
        data.append('userName', form.userName);
        data.append('password', form.password);
        data.append('email', form.email);
        data.append('phoneNumber', form.phoneNumber);
        data.append('role', 'customer');
        if (avatar) data.append('avatar', avatar);

        // try {
        //     const res = await axios.post('http://localhost:3001/user/create', data, {
        //         headers: { 'Content-Type': 'multipart/form-data' },
        //     });

        //     setMessage('Tạo tài khoản thành công!');
        //     console.log(res.data);
        // } catch (err) {
        //     setMessage(err.response?.data?.message || 'Lỗi đăng ký!');
        // }
        try {
            // 🔥 GỌI API ĐÃ TÁCH
            const res = await authApi.register(data);

            setMessage('Tạo tài khoản thành công!');
            console.log(res);
        } catch (err) {
            setMessage(err.response?.data?.message || 'Lỗi đăng ký!');
        }
    };

    return (
        <div className={cx('wrap')}>
            <form onSubmit={handleSubmit} className={cx('form')}>
                <>
                    <span>
                        <div className={cx('home')}>
                            <Button to="/" outline small>
                                trang chủ
                            </Button>
                        </div>
                    </span>
                    <h2 className={cx('title')}>Tạo tài khoản</h2>
                </>

                <label className={cx('label')}>Họ và tên</label>
                <input className={cx('input')} name="name" value={form.name} onChange={handleChange} />

                <label className={cx('label')}>Tên đăng nhập</label>
                <input className={cx('input')} name="userName" value={form.userName} onChange={handleChange} />

                <label className={cx('label')}>Email</label>
                <input className={cx('input')} name="email" type="email" value={form.email} onChange={handleChange} />

                <label className={cx('label')}>Số điện thoại</label>
                <input className={cx('input')} name="phoneNumber" value={form.phoneNumber} onChange={handleChange} />

                <label className={cx('label')}>Mật khẩu</label>
                <input
                    className={cx('input')}
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                />

                <label className={cx('label')}>Ảnh đại diện</label>
                <input className={cx('file')} type="file" accept="image/*" onChange={handleFileChange} />

                <Button primary className={cx('btn')} type="submit">
                    Đăng ký
                </Button>

                {message && <p className={cx('message')}>{message}</p>}
            </form>
        </div>
    );
}

export default Register;
