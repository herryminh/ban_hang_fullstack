import { useState } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './AdminMenu.module.scss';
import { adminMenu } from '~/contans/adminMenu';

const cx = classNames.bind(styles);

function AdminMenu({ onHide }) {
    const [activeId, setActiveId] = useState(null);

    const handleToggle = (e, id) => {
        e.preventDefault();
        e.stopPropagation(); // Cực kỳ quan trọng để không làm đóng cái Dropdown cha ngoài Header
        setActiveId(activeId === id ? null : id);
    };

    return (
        <div className={cx('admin-container')}>
            {adminMenu.map((group) => {
                const isOpen = activeId === group.id;
                return (
                    <div key={group.id} className={cx('menu-group')}>
                        {/* Mục cha: Bấm vào để mở/đóng mục con */}
                        <div
                            className={cx('menu-header', { active: isOpen })}
                            onClick={(e) => handleToggle(e, group.id)}
                        >
                            <span className={cx('title')}>
                                <span className={cx('icon')}>{group.icon}</span>
                                {group.title}
                            </span>
                            <span className={cx('arrow', { rotate: isOpen })}>▼</span>
                        </div>

                        {/* Mục con: Sổ xuống ngay bên dưới */}
                        <div className={cx('menu-children', { show: isOpen })}>
                            {group.children.map((child) => (
                                <Link
                                    key={child.id}
                                    to={child.path}
                                    className={cx('child-item')}
                                    onClick={onHide} // Bấm vào link thì đóng toàn bộ menu lớn
                                >
                                    {child.title}
                                </Link>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default AdminMenu;
