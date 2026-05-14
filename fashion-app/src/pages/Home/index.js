import classNames from 'classnames/bind';
import Styles from './Home.module.scss';
import Banner from '~/compopnents/Home/Baner';
import Category from '~/compopnents/Home/Category';
const cx = classNames.bind(Styles);

function Home() {
    return (
        <div className={cx('wrapper')}>
            <Banner />
            <Category />
        </div>
    );
}

export default Home;
