import { useEffect, useState, useContext, useCallback } from 'react';
import { AuthContext } from '~/context/AuthContext';
import cartApi from '~/api/cartApi';
import CartItem from './CartItem';
import styles from './CartDropdown.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function CartDropdown() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user: authUser } = useContext(AuthContext);

    const loadData = useCallback(async () => {
        if (!authUser || !authUser._id) {
            setItems([]);
            setLoading(false);
            return;
        }

        try {
            const res = await cartApi.getMyCart(authUser._id, authUser.token);

            // CHUYỂN ĐỔI DỮ LIỆU:
            // Backend trả về: [{ _id: '...', items: [{...}] }, ...]
            // Chúng ta cần: [{... sản phẩm ...}, ...]
            const formattedItems = res.data.map((doc) => ({
                ...doc.items[0], // Lấy object sản phẩm bên trong mảng items
                cartDocId: doc._id, // Giữ lại ID document để xóa/sửa sau này
            }));

            setItems(formattedItems);
        } catch (error) {
            console.error('Lỗi load dropdown cart:', error);
        } finally {
            setLoading(false);
        }
    }, [authUser]);

    useEffect(() => {
        loadData();

        // Lắng nghe sự kiện để tự reload khi nhấn "Thêm vào giỏ hàng" ở trang Detail
        window.addEventListener('cartUpdated', loadData);

        return () => {
            window.removeEventListener('cartUpdated', loadData);
        };
    }, [loadData]);

    // Tính tổng tiền
    const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);

    if (loading) return <div className={cx('dropdown')}>Đang tải...</div>;

    return (
        <div className={cx('dropdown')}>
            <h4 className={cx('title')}>Giỏ hàng của bạn</h4>

            {items.length === 0 ? (
                <div className={cx('emptyContent')}>
                    <div className={cx('emptyIcon')}>🛒</div>
                    <p>Giỏ hàng hiện đang trống.</p>
                    <a href="/" className={cx('shopNow')}>
                        Mua sắm ngay
                    </a>
                </div>
            ) : (
                <>
                    <div className={cx('list')}>
                        {items.map((item, index) => (
                            // Dùng cartDocId (productId-sku) làm key để không bị trùng
                            <CartItem key={item.cartDocId || index} item={item} onReload={loadData} />
                        ))}
                    </div>

                    <div className={cx('footer')}>
                        <div className={cx('summary')}>
                            <span>Tổng cộng:</span>
                            <span className={cx('totalPrice')}>{totalPrice.toLocaleString()} ₫</span>
                        </div>
                        <a href="/cart" className={cx('viewCart')}>
                            Xem giỏ hàng
                        </a>
                    </div>
                </>
            )}
        </div>
    );
}

export default CartDropdown;
