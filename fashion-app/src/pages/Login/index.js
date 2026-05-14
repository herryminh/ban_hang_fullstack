import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Login.module.scss';
import { AuthContext } from '~/context/AuthContext';
import Button from '~/compopnents/Buttons';
import authApi from '~/api/authApi';
const cx = classNames.bind(styles);

function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // 1️⃣ Gọi API login
            const res = await authApi.login(form);

            // 2️⃣ Lấy token và user từ response → lưu vào localStorage + context
            const { user, token } = res.data.data; // lấy đúng token từ backend
            localStorage.setItem('token', token); // lưu token
            login({ user, token }); // lưu vào AuthContext

            navigate('/');
        } catch (err) {
            setMessage(err.response?.data?.message || 'Đăng nhập thất bại');
        }
    };

    return (
        <div className={cx('login')}>
            <>
                <span>
                    <div className={cx('home')}>
                        <Button to="/" outline small>
                            trang chủ
                        </Button>
                    </div>
                </span>
                <h2 className={cx('title')}>Đăng Nhập</h2>
            </>
            <form onSubmit={handleSubmit} className={cx('form')}>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Mật khẩu"
                    value={form.password}
                    onChange={handleChange}
                    required
                />
                <Button className={cx('submit')} type="submit">
                    Log In
                </Button>
            </form>
            {message && <p className={cx('message')}>{message}</p>}
        </div>
    );
}

export default Login;
