import { useEffect, useState, useRef } from 'react';
import images from '~/assets/images';
import styles from './Banner.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const banners = [
    {
        id: 1,
        image: images.banner1,
        title: 'New Collection 2025',
        subtitle: 'Streetwear style',
    },
    {
        id: 2,
        image: images.banner2,
        title: 'Sale up to 50%',
        subtitle: 'Limited time only',
    },
];

function Banner() {
    const [index, setIndex] = useState(0);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (intervalRef.current) return; // chặn chạy lần 2

        intervalRef.current = setInterval(() => {
            setIndex((prev) => (prev + 1) % banners.length);
        }, 5000);

        return () => {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        };
    }, []);
    return (
        <div className={cx('slider')}>
            <div className={cx('track')} style={{ transform: `translateX(-${index * 100}%)` }}>
                {banners.map((banner) => (
                    <div key={banner.id} className={cx('slide')}>
                        <img src={banner.image} alt={banner.title} />
                        <div className={cx('content')}>
                            <h2>{banner.title}</h2>
                            <p>{banner.subtitle}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Banner;
