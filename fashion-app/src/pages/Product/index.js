import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Product.module.scss';

import Sidebar from '~/compopnents/Product/SideBar';
import CategoryProduct from '~/compopnents/Product/CategoryProduct';
import productApi from '~/api/productApi';
import categoryApi from '~/api/categoryApi'; // Dùng getCategories thay vì getBySlug

const cx = classNames.bind(styles);

function Product({ user }) {
    const { slug } = useParams();
    const [products, setProducts] = useState([]);
    // const [categoryName, setCategoryName] = useState('');
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoading(true);

                // 1. Lấy song song: tất cả sản phẩm và tất cả danh mục
                const [prodRes, catRes] = await Promise.all([productApi.getProducts(), categoryApi.getCategories()]);

                const allProducts = Array.isArray(prodRes.data) ? prodRes.data : prodRes.data.data || [];
                const allCategories = Array.isArray(catRes.data) ? catRes.data : catRes.data.data || [];

                // 2. Tìm danh mục khớp với slug trên URL
                // Ví dụ: slug trên URL là 'quan-ao', tìm trong list thấy { name: 'Quần áo', slug: 'quan-ao' }
                const currentCat = allCategories.find((c) => c.slug === slug);

                if (currentCat) {
                    // setCategoryName(currentCat.name);
                    // 3. Lọc sản phẩm theo tên tiếng Việt vừa tìm được
                    const filtered = allProducts.filter((p) => p.category === currentCat.name);
                    setProducts(filtered);
                } else {
                    // Nếu không tìm thấy slug nào khớp
                    setProducts([]);
                    // setCategoryName('Không tìm thấy danh mục');
                }
            } catch (err) {
                console.error('Lỗi fetch dữ liệu:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();
    }, [slug]);

    const displayedProducts = selectedBrand ? products.filter((p) => p.brand === selectedBrand) : products;

    if (loading) return <p className={cx('loading')}>Đang tải sản phẩm...</p>;

    return (
        <div className={cx('wrapper')}>
            <Sidebar categoryProducts={products} selectedBrand={selectedBrand} onBrandChange={setSelectedBrand} />
            <div className={cx('content')}>
                <CategoryProduct products={displayedProducts} user={user} isShowAll={true} />
            </div>
        </div>
    );
}

export default Product;
