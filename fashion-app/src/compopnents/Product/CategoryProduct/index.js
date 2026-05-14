import { Link } from 'react-router-dom';
import ProductCard from '~/compopnents/Home/ProductCard';
import styles from './CategoryProduct.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function CategoryProduct({ products, isShowAll = false }) {
    // 1. Nhóm sản phẩm theo category
    const groupedProducts = products.reduce((acc, product) => {
        const cat = product.category || 'Khác';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(product);
        return acc;
    }, {});

    // Giả lập mapping slug (Nếu bạn có list categories từ API thì nên truyền vào đây)
    const categorySlugMap = {
        'Quần áo': 'quan-ao',
        'Giày dép': 'giay-dep',
        'Túi Xách': 'tui-xach',
        Balo: 'balo',
    };

    return (
        <section className={cx('category')}>
            {Object.keys(groupedProducts).map((catName) => (
                <div key={catName} className={cx('category-row')}>
                    <h2 className={cx('category-title')}>{catName}</h2>

                    <div className={cx('grid-row')}>
                        {/* 2. Lấy 9 sản phẩm mới nhất nếu không phải trang "Xem tất cả" */}
                        {(isShowAll ? groupedProducts[catName] : groupedProducts[catName].slice(0, 9)).map(
                            (product) => (
                                <div key={product._id} className={cx('item')}>
                                    <ProductCard product={product} />
                                </div>
                            ),
                        )}

                        {/* 3. Ô THỨ 10: Chỉ hiện khi ở trang chủ và có > 9 sản phẩm */}
                        {!isShowAll && groupedProducts[catName].length > 9 && (
                            <Link
                                to={`/category/${categorySlugMap[catName] || 'all'}`}
                                className={cx('item', 'view-all-box')}
                            >
                                <div className={cx('view-all-content')}>
                                    <i className="fa-solid fa-circle-plus"></i>
                                    <span>Xem tất cả {catName}</span>
                                </div>
                            </Link>
                        )}
                    </div>
                </div>
            ))}
        </section>
    );
}

export default CategoryProduct;
