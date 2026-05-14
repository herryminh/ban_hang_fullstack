import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '~/compopnents/Home/ProductCard';
import productApi from '~/api/productApi';
import categoryApi from '~/api/categoryApi'; // Import thêm api category
import styles from './Category.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function CategoryList() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]); // Lưu danh sách category từ DB

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Gọi song song cả 2 API để tối ưu tốc độ
                const [productRes, categoryRes] = await Promise.all([
                    productApi.getProducts(),
                    categoryApi.getCategories(),
                ]);

                const productData = productRes.data || [];
                const categoryData = categoryRes.data || [];

                // 1. Sắp xếp sản phẩm mới nhất lên đầu
                const sortedProducts = productData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                setProducts(sortedProducts);
                setCategories(categoryData);
            } catch (err) {
                console.error('Lỗi fetch data:', err);
            }
        };
        fetchData();
    }, []);

    // 2. Nhóm sản phẩm theo category (Sử dụng tên làm key)
    const groupedProducts = products.reduce((acc, product) => {
        const catName = product.category || 'Khác';
        if (!acc[catName]) acc[catName] = [];
        acc[catName].push(product);
        return acc;
    }, {});

    return (
        <section className={cx('category')}>
            {Object.keys(groupedProducts).map((catName) => {
                // 3. TÌM SLUG TƯƠNG ỨNG: Khớp tên từ sản phẩm với list category từ API
                const categoryInfo = categories.find((c) => c.name === catName);
                const slug = categoryInfo ? categoryInfo.slug : 'all';
                const categoryUrl = `/category/${slug}`;

                return (
                    <div key={catName} className={cx('category-row')}>
                        <div className={cx('header')}>
                            <h2 className={cx('category-title')}>{catName}</h2>
                            <Link to={categoryUrl} className={cx('view-more-link')}>
                                Xem tất cả
                            </Link>
                        </div>

                        <div className={cx('grid-row')}>
                            {/* Hiện 9 sản phẩm mới nhất */}
                            {groupedProducts[catName].slice(0, 9).map((product) => (
                                <div key={product._id} className={cx('item')}>
                                    <ProductCard product={product} />
                                </div>
                            ))}

                            {/* Ô thứ 10: Nút xem tất cả */}
                            {groupedProducts[catName].length > 9 && (
                                <Link to={categoryUrl} className={cx('item', 'view-all-card')}>
                                    <div className={cx('view-all-inner')}>
                                        <div className={cx('icon-circle')}>
                                            {/* <i className="fa-solid fa-arrow-right"></i> */}
                                            <FontAwesomeIcon icon={faArrowRight} />
                                        </div>
                                        <span>Xem thêm</span>
                                        <small>{groupedProducts[catName].length - 9}+ sản phẩm</small>
                                    </div>
                                </Link>
                            )}
                        </div>
                    </div>
                );
            })}
        </section>
    );
}

export default CategoryList;
