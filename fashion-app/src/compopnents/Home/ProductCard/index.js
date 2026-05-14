import { NavLink } from 'react-router-dom';
import styles from './ProductCard.module.scss';
import classNames from 'classnames/bind';
import images from '~/assets/images';

const cx = classNames.bind(styles);
function ProductCard({ product, user }) {
    const firstVariant = product.variants?.[0];
    const firstImage = firstVariant?.images?.[0];

    const imageUrl = firstImage ? `http://localhost:3001${firstImage}` : null;

    return (
        <NavLink className={cx('card')} to={`/product/${product.slug}`}>
            <div className={cx('image')}>
                <img
                    src={imageUrl || (user?.avatar ? user.avatar : images.slogan)} // fallback user.avatar hoặc mặc định
                    alt={product.name}
                    onError={(e) => {
                        e.target.onerror = null; // tránh loop
                        e.target.src = user?.avatar || images.slogan; // fallback khi lỗi load
                    }}
                />
            </div>

            <div className={cx('info')}>
                <h3 className={cx('name')}>{product.name}</h3>
                <p className={cx('price')}>{(firstVariant?.price || product.basePrice).toLocaleString()}₫</p>
                <p className={cx('description')}>{product.description}</p>
            </div>
        </NavLink>
    );
}
export default ProductCard;
