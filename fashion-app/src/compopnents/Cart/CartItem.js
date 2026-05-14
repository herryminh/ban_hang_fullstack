import { useContext } from 'react';
import { AuthContext } from '~/context/AuthContext';
import cartApi from '~/api/cartApi';
import styles from './CartItem.module.scss';
import classNames from 'classnames/bind';
import images from '~/assets/images';

const cx = classNames.bind(styles);
const BASE_URL = 'http://localhost:3001';

function CartItem({ item, onReload }) {
    const { user } = useContext(AuthContext);

    const displayPrice = Number(item?.price || 0);
    const displayQuantity = item?.quantity || 1;

    // Xử lý đường dẫn ảnh: Nếu đã có http thì giữ nguyên, nếu không thì nối BASE_URL
    const imageUrl = item?.image
        ? item.image.startsWith('http')
            ? item.image
            : `${BASE_URL}${item.image}`
        : images.noImage;

    // Hàm xử lý xóa sản phẩm khỏi Database
    const handleRemove = async () => {
        if (!window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;

        try {
            // item.cartDocId chính là cái _id (productId-sku) ta đã gán ở CartDropdown
            await cartApi.removeFromCart(item.cartDocId, user.token);

            // 1. Báo cho component cha (CartDropdown) load lại danh sách
            if (onReload) onReload();

            // 2. Phát sự kiện để Header (AccountMenu) cập nhật lại con số cartCount
            window.dispatchEvent(new Event('cartUpdated'));
        } catch (error) {
            console.error('Lỗi khi xóa sản phẩm:', error);
            alert('Không thể xóa sản phẩm, vui lòng thử lại.');
        }
    };

    return (
        <div className={cx('item')}>
            {/* Nút X xóa sản phẩm */}
            <button className={cx('remove-btn')} onClick={handleRemove}>
                &times;
            </button>

            <div className={cx('img-wrapper')}>
                <img
                    src={imageUrl}
                    alt={item.name}
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = images.noImage;
                    }}
                />
            </div>

            <div className={cx('info')}>
                <p className={cx('name')}>{item.name || 'Sản phẩm không tên'}</p>
                <p className={cx('meta')}>
                    {item.color} / {item.size}
                </p>
                <p className={cx('price')}>
                    {displayPrice.toLocaleString()} ₫ <span className={cx('qty')}>x {displayQuantity}</span>
                </p>
            </div>
        </div>
    );
}

export default CartItem;
