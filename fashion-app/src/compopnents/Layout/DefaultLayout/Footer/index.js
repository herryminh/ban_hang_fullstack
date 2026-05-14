import classNames from 'classnames/bind';
import styles from './Footer.module.scss';
import images from '~/assets/images';
const cx = classNames.bind(styles);
function Footer() {
    return (
        <footer className={cx('footer')}>
            <div className={cx('footer-container')}>
                <div className={cx('footer-col')}>
                    <h4>SẢN PHẨM</h4>
                    <ul>
                        <li>Giày</li>
                        <li>Quần áo</li>
                        <li>Phụ kiện</li>
                        <li>Hàng Mới Về</li>
                        <li>Release Dates</li>
                        <li>Top Sellers</li>
                        <li>Member exclusives</li>
                        <li>Outlet</li>
                    </ul>
                </div>

                <div className={cx('footer-col')}>
                    <h4>BỘ SƯU TẬP</h4>
                    <ul>
                        <li>Pharrell Williams</li>
                        <li>Ultra Boost</li>
                        <li>Pureboost</li>
                        <li>Predator</li>
                        <li>Superstar</li>
                        <li>Stan Smith</li>
                        <li>NMD</li>
                        <li>Adicolor</li>
                    </ul>
                </div>

                <div className={cx('footer-col')}>
                    <h4>THÔNG TIN VỀ CÔNG TY</h4>
                    <ul>
                        <li>Giới Thiệu Về Chúng Tôi</li>
                        <li>Cơ Hội Nghề Nghiệp</li>
                        <li>Tin tức</li>
                        <li>adidas stories</li>
                    </ul>
                </div>

                <div className={cx('footer-col')}>
                    <h4>HỖ TRỢ</h4>
                    <ul>
                        <li>Trợ Giúp</li>
                        <li>Công cụ tìm kiếm cửa hàng</li>
                        <li>Biểu Đồ Kích Cỡ</li>
                        <li>Thanh toán</li>
                        <li>Giao hàng</li>
                        <li>Trả Hàng & Hoàn Tiền</li>
                        <li>Khuyến mãi</li>
                        <li>Trợ Giúp Dịch Vụ Khách Hàng</li>
                    </ul>

                    <div className={cx('bct-wrap')}>
                        <img
                            src="https://help.haravan.com/assets/images/Mo9gDy2XMZLppkUw4sWCsYV-lk65HqqgQw-97bdbbe9c2042c7044bf7b0f74855894.gif"
                            alt="Đã thông báo Bộ Công Thương"
                            className={cx('bct')}
                        />
                    </div>
                </div>

                <div className={cx('footer-col social')}>
                    <h4>THEO DÕI CHÚNG TÔI</h4>
                    <div className={cx('social-icons')}>
                        <i className={cx('fab fa-facebook-f')}>
                            <img className={cx('icons')} src={images.fbWhrite} alt="fb" />
                        </i>
                        <i className={cx('fab fa-instagram')}>
                            <img className={cx('icons')} src={images.instagram} alt="fb" />
                        </i>
                        <i className={cx('fab fa-x-twitter')}>
                            <img className={cx('icons')} src={images.tiktok_light} alt="fb" />
                        </i>
                        <i className={cx('fab fa-pinterest-p')}>
                            <img className={cx('icons')} src={images.x} alt="fb" />
                        </i>
                        <i className={cx('fab fa-tiktok')}>
                            <img className={cx('icons')} src={images.pinterest} alt="fb" />
                        </i>
                        <i className={cx('fab fa-youtube')}>
                            <img className={cx('icons')} src={images.youtube} alt="fb" />
                        </i>
                    </div>
                </div>
            </div>
            <div className={cx('title')}> @Design By MinhHoangRemix </div>
        </footer>
    );
}

export default Footer;
