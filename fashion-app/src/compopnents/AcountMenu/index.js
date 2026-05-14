import { useEffect, useState, useContext, useCallback } from 'react';
import classNames from 'classnames/bind';
import styles from './AcountMenu.module.scss';
import { AuthContext } from '~/context/AuthContext';
import images from '~/assets/images';
import DropDownMenu from '~/compopnents/DropDownMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartArrowDown } from '@fortawesome/free-solid-svg-icons';
import CartDropdown from '../Cart/CartDropdown';
import cartApi from '~/api/cartApi';

const cx = classNames.bind(styles);

function AccountMenu({ user }) {
    const [openCart, setOpenCart] = useState(false);
    const [open, setOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const { user: authUser, logout } = useContext(AuthContext);

    const toggleMenu = () => setOpen(!open);

    // Sử dụng useCallback để hàm không bị tạo lại mỗi lần render
    const fetchCartData = useCallback(async () => {
        // Kiểm tra nếu có authUser và có ID (tránh gửi undefined lên server)
        if (!authUser || !authUser._id) {
            setCartCount(0);
            return;
        }

        try {
            // Theo cartApi: tham số 1 là userId, tham số 2 là token
            const res = await cartApi.getMyCart(authUser._id, authUser.token);
            const cartDocs = res.data; // Đây là mảng các document giỏ hàng

            // Tính tổng số lượng từ cấu trúc: [{ items: [{ quantity: ... }] }, ...]
            const total = cartDocs.reduce((sum, doc) => {
                const itemQty = doc.items[0]?.quantity || 0;
                return sum + itemQty;
            }, 0);

            setCartCount(total);
        } catch (err) {
            console.error('Lỗi lấy số lượng giỏ hàng:', err);
        }
    }, [authUser]);

    useEffect(() => {
        fetchCartData();

        // Lắng nghe sự kiện để cập nhật con số ngay lập tức khi thêm hàng ở trang khác
        window.addEventListener('cartUpdated', fetchCartData);
        return () => window.removeEventListener('cartUpdated', fetchCartData);
    }, [fetchCartData]);

    const handleLogout = () => {
        logout();
    };

    return (
        <div className={cx('account-menu')}>
            <div className={cx('item')}>
                <button className={cx('btn-icon')} onClick={() => setOpenCart(!openCart)}>
                    <FontAwesomeIcon className={cx('icon')} icon={faCartArrowDown} />
                    {cartCount > 0 && <span className={cx('value')}>{cartCount}</span>}
                </button>

                {openCart && <CartDropdown />}

                <div className={cx('avatar')} onClick={toggleMenu}>
                    <img
                        src={user.avatar ? `http://localhost:3001${user.avatar}` : images.avatar}
                        alt={user.name}
                        onError={(e) => {
                            e.target.src = images.avatar;
                        }}
                    />
                </div>
                {open && <DropDownMenu user={user} handleLogout={handleLogout} />}
            </div>
        </div>
    );
}

export default AccountMenu;
