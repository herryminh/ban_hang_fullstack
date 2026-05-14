import classNames from 'classnames/bind';
import Styles from './defaultLayout.module.scss';
import Header from './Header';
import Footer from './Footer';

const cx = classNames.bind(Styles);

function DefaulLayout({ children }) {
    return (
        <>
            <Header />
            <div className={cx('container')}>{children}</div>

            <div className={cx('container')}>
                <Footer />
            </div>
        </>
    );
}

export default DefaulLayout;
