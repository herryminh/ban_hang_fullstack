import styles from './About.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function About() {
    return (
        <div className={cx('about')}>
            <div className={cx('hero')}>
                <h1 className={cx('title')}>Về Thương Hiệu ABC Fashion</h1>
                <p className={cx('subtitle')}>
                    ABC Fashion – Nơi phong cách gặp chất lượng. Chúng tôi tạo ra những bộ trang phục thời thượng, thoải
                    mái và bền bỉ cho mọi đối tượng.
                </p>
            </div>
            <div className={cx('content')}>
                <h2 className={cx('section-title')}>Sứ mệnh của chúng tôi</h2>
                <p>
                    Chúng tôi cam kết mang đến trải nghiệm mua sắm thời trang tốt nhất với các sản phẩm chất lượng, giá
                    cả hợp lý, và phong cách luôn cập nhật xu hướng mới nhất.
                </p>

                <h2 className={cx('section-title')}>Chất lượng và thiết kế</h2>
                <p>
                    Mỗi sản phẩm của ABC Fashion đều được thiết kế tỉ mỉ, chọn chất liệu cao cấp và sản xuất với quy
                    trình nghiêm ngặt để đảm bảo sự thoải mái và phong cách cho khách hàng.
                </p>
            </div>
        </div>
    );
}

export default About;
