import classNames from 'classnames/bind';
import { useEffect, useState, useCallback } from 'react';
import styles from './Users.module.scss';
import EditUserForm from '../EditUser';
import authApi from '~/api/authApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faUserShield, faUser, faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingUserId, setEditingUserId] = useState(null);

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            const res = await authApi.getUsers();
            setUsers(res.data.data || res.data);
        } catch (err) {
            console.error('Lỗi load user:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleEdit = (id) => setEditingUserId(id);
    const handleClose = () => setEditingUserId(null);

    const handleDelete = async (id) => {
        if (!window.confirm('Xóa người dùng này?')) return;
        try {
            await authApi.deleteUser(id);
            alert('Đã xóa!');
            fetchUsers();
        } catch (err) {
            alert('Xóa thất bại!');
        }
    };

    return (
        <div className={cx('wrapper')}>
            {/* HEADER ĐỒNG BỘ */}
            <div className={cx('header')}>
                <div className={cx('titleGroup')}>
                    <h2>Quản lý tài khoản</h2>
                    <p>Hệ thống quản lý khách hàng và phân quyền bảo mật</p>
                </div>
                <button className={cx('btnAdd')} onClick={() => (window.location.href = '/')}>
                    <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: '8px' }} />
                    Trang chủ
                </button>
            </div>

            <div className={cx('tableWrapper')}>
                <table className={cx('table')}>
                    <thead>
                        <tr>
                            <th width="80">Avatar</th>
                            <th>Thông tin khách hàng</th>
                            <th>Tài khoản</th>
                            <th>Liên hệ</th>
                            <th>Vai trò</th>
                            <th className={cx('textRight')}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" className={cx('textCenter')}>
                                    Đang tải...
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user._id} className={cx('mainRow')}>
                                    <td>
                                        {/* Tận dụng mainImgBox nhưng dùng chữ cái đầu làm avatar */}
                                        <div className={cx('mainImgBox', 'userAvatar')}>
                                            <span>{user.name?.charAt(0).toUpperCase()}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className={cx('name')}>{user.name}</div>
                                        <div className={cx('category')}>ID: {user._id.substring(0, 8)}...</div>
                                    </td>
                                    <td>
                                        <span className={cx('brand')}>@{user.userName}</span>
                                    </td>
                                    <td>
                                        <div className={cx('price')} style={{ fontSize: '13px' }}>
                                            <div style={{ marginBottom: '4px' }}>
                                                <FontAwesomeIcon
                                                    icon={faEnvelope}
                                                    style={{ width: '14px', marginRight: '6px', color: '#94a3b8' }}
                                                />
                                                {user.email}
                                            </div>
                                            <div>
                                                <FontAwesomeIcon
                                                    icon={faPhone}
                                                    style={{ width: '14px', marginRight: '6px', color: '#94a3b8' }}
                                                />
                                                {user.phoneNumber || 'N/A'}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        {/* Tận dụng style badge của category/brand */}
                                        <div className={cx('roleBadge', user.role.toLowerCase())}>
                                            <FontAwesomeIcon
                                                icon={user.role.toLowerCase() === 'admin' ? faUserShield : faUser}
                                                style={{ marginRight: '6px' }}
                                            />
                                            {user.role}
                                        </div>
                                    </td>
                                    <td className={cx('textRight')}>
                                        <button className={cx('btnAction')} onClick={() => handleEdit(user._id)}>
                                            Sửa
                                        </button>
                                        <button
                                            className={cx('btnAction', 'delete')}
                                            onClick={() => handleDelete(user._id)}
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* MODAL SỬA */}
            {editingUserId && (
                <div className={cx('modalOverlay')}>
                    <div className={cx('modalContent', 'userEditModal')}>
                        <EditUserForm userId={editingUserId} onClose={handleClose} onUpdate={fetchUsers} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default Users;
