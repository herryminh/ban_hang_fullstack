import classNames from 'classnames/bind';
import styles from './SideBar.module.scss';
import Button from '~/compopnents/Buttons';
const cx = classNames.bind(styles);

function Sidebar({ categoryProducts, selectedBrand, onBrandChange }) {
    // Lấy danh sách brand trong category hiện tại
    const brands = [...new Set(categoryProducts.map((p) => p.brand).filter(Boolean))];

    return (
        <aside>
            <div className={cx('sidebar')}>
                <h3 className={cx('title')}>Hãng sản phẩm</h3>

                {brands.map((brand) => (
                    <Button
                        text
                        key={brand}
                        className={cx('item', { active: selectedBrand === brand })}
                        onClick={() => onBrandChange(brand)}
                    >
                        {brand}
                    </Button>
                ))}
                <Button
                    text
                    className={cx('item', { active: selectedBrand === null })}
                    onClick={() => onBrandChange(null)}
                >
                    Tất cả
                </Button>
            </div>
        </aside>
    );
}

export default Sidebar;
