import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import Styles from './Header.module.scss';
import Button from '~/compopnents/Buttons';
import images from '~/assets/images';
import AccountMenu from '~/compopnents/AcountMenu';
import { useContext, useState } from 'react';
import { AuthContext } from '~/context/AuthContext';
import AdminMenu from '~/compopnents/AdminMenu';

const cx = classNames.bind(Styles);
function Header() {
    const [openProduct, setOpenProduct] = useState(false);

    const { user } = useContext(AuthContext); // lấy user từ context
    const isLoggedIn = !!user;
    const isAdmin = user?.role === 'admin';
    const [openAdmin, setOpenAdmin] = useState(false);

    return (
        <header className={cx('wrapper')}>
            <div className={cx('inner')}>
                <Link to="/" className={cx('logo')}>
                    <img src={images.logo} alt="logo" />
                </Link>

                <div className={cx('content')}>
                    <Button className={cx('item')} to="/product">
                        Sản Phẩm
                    </Button>
                    <div className={cx('item', 'product-dropdown')}>
                        <Button small onClick={() => setOpenProduct(!openProduct)}>
                            Bộ Sưu Tập
                        </Button>

                        {openProduct && (
                            <div className={cx('product-menu-popup')}>
                                <Button to="/category/clothes">Quần áo</Button>
                                <Button to="/category/bags">Túi xách</Button>
                                <Button to="/category/shoes">Giày dép</Button>
                            </div>
                        )}
                    </div>

                    <Button className={cx('item')} to="/about">
                        Giới thiệu
                    </Button>

                    {/* Chỉ admin mới thấy */}
                    {isAdmin && (
                        <div className={cx('item', 'admin-dropdown')}>
                            <Button small onClick={() => setOpenAdmin(!openAdmin)}>
                                Admin Dashboard
                            </Button>

                            {openAdmin && (
                                <div className={cx('admin-menu-popup')}>
                                    <AdminMenu onHide={() => setOpenAdmin(false)} />
                                </div>
                            )}
                        </div>
                    )}
                </div>
                {/* phần dành cho acount  */}
                <div className={cx('action')}>
                    {isLoggedIn ? (
                        <AccountMenu user={user} />
                    ) : (
                        <>
                            <Button text to="/register">
                                Sign Up
                            </Button>
                            <Button primary to="/login">
                                Log In
                            </Button>
                        </>
                    )}
                </div>
            </div>
            <div className={cx('contact')}>
                <a
                    href="https://www.facebook.com/hoang.tran.minh.530452"
                    className={cx('contact-logo')}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img src={images.facebook} alt="facebook" />
                </a>
                <a
                    href="https://www.facebook.com/hoang.tran.minh.530452"
                    className={cx('contact-logo')}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img src={images.zalo} alt="zalo" className={cx('contact-logo-zalo')} />
                </a>
                <a
                    href="https://www.tiktok.com/@tranminhhoang021"
                    className={cx('contact-logo')}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img
                        src={images.tiktok_dark}
                        alt="https://www.tiktok.com/@tranminhhoang021"
                        className={cx('contact-logo-tiktok')}
                    />
                </a>
            </div>
        </header>
    );
}
export default Header;
