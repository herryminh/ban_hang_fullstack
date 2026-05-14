import classNames from 'classnames/bind';
import Styles from './DropDownMenu.module.scss';
import Button from '../Buttons';
const cx = classNames.bind(Styles);

function DropDownMenu({ user, handleLogout }) {
    return (
        <div className={cx('dropdown')}>
            <p className={cx('username')}>{user.name}</p>

            <Button small to="/profile" className={cx('item')}>
                Profile
            </Button>
            <Button small to="/orders" className={cx('item')}>
                Orders<span className={cx('value')}> 4</span>
            </Button>

            <Button small to="/notifications" className={cx('item')}>
                Notifications <span className={cx('value')}>2</span>
            </Button>
            <Button small to="/change-password" className={cx('item')}>
                Change Password
            </Button>

            <Button small onClick={handleLogout} className={cx('item', 'logout')}>
                Logout
            </Button>
        </div>
    );
}

export default DropDownMenu;
