import { useEffect, useState, Fragment } from 'react';
import classNames from 'classnames/bind';
import styles from './ListOrder.module.scss';
import orderApi from '~/api/oderApi'; // Đảm bảo bạn đã có file này
import { toast } from 'react-toastify';

const cx = classNames.bind(styles);
const BASE_URL = 'http://localhost:3001';

function ListOrder() {
    const [adminNotes, setAdminNotes] = useState({}); // Lưu tạm ghi chú đang nhập
    const [orders, setOrders] = useState([]);
    const [expandedRows, setExpandedRows] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleNoteChange = (orderId, value) => {
        setAdminNotes((prev) => ({ ...prev, [orderId]: value }));
    };

    const saveAdminNote = async (orderId) => {
        const token = localStorage.getItem('token');
        const noteContent = adminNotes[orderId];
        try {
            await orderApi.updateOrder(orderId, { adminNote: noteContent }, token);
            toast.success('Đã lưu ghi chú admin');
            fetchOrders(); // Load lại để đồng bộ
        } catch (err) {
            toast.error('Không thể lưu ghi chú');
        }
    };

    // FIX HÀM FETCH: Gọi 1 lần duy nhất và dùng token
    const fetchOrders = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await orderApi.getAllOrders(token);

            // Xử lý dữ liệu an toàn
            const actualData = res?.data?.data || res?.data || [];
            setOrders(actualData);
        } catch (err) {
            console.error('Lỗi lấy danh sách đơn hàng:', err);
            setOrders([]);
            toast.error('Không thể tải danh sách đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const toggleRow = (id) => {
        setExpandedRows((prev) => (prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]));
    };

    // FIX HÀM UPDATE: Đổi tên thành updateOrder và truyền token
    const handleStatusChange = async (orderId, newStatus) => {
        const token = localStorage.getItem('token');
        try {
            // Lưu ý: phải dùng updateOrder theo file orderApi của bạn
            await orderApi.updateOrder(orderId, { status: newStatus }, token);
            toast.success('Cập nhật trạng thái thành công');
            fetchOrders(); // Load lại danh sách sau khi sửa thành công
        } catch (err) {
            console.error('Update error:', err);
            toast.error('Cập nhật thất bại');
        }
    };
    if (loading) return <div className={cx('loading')}>Đang tải dữ liệu đơn hàng...</div>;

    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>
                <div className={cx('titleGroup')}>
                    <h2>Quản lý đơn hàng</h2>
                    <p>Theo dõi và cập nhật trạng thái vận chuyển</p>
                </div>
            </div>

            <div className={cx('tableWrapper')}>
                <table className={cx('table')}>
                    <thead>
                        <tr>
                            <th width="50"></th>
                            <th>Mã đơn / Ngày đặt</th>
                            <th>Khách hàng</th>
                            <th>Tổng tiền</th>
                            <th>Thanh toán</th>
                            <th>Trạng thái</th>
                            <th className={cx('textRight')}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => {
                            const isExpanded = expandedRows.includes(order._id);
                            const date = new Date(order.createdAt).toLocaleDateString('vi-VN');

                            return (
                                <Fragment key={order._id}>
                                    <tr
                                        className={cx('mainRow', { isExpanded })}
                                        onClick={() => toggleRow(order._id)} // Click vào dòng để mở rộng
                                        style={{ cursor: 'pointer' }} // Thêm con trỏ tay để người dùng biết click được
                                    >
                                        <td className={cx('textCenter')}>
                                            {/* Nút này bây giờ chỉ mang tính chất hiển thị, hoặc vẫn để click */}
                                            <button className={cx('btnToggle')}>
                                                <span className={cx('arrow', { active: isExpanded })}>▶</span>
                                            </button>
                                        </td>
                                        <td>
                                            <div className={cx('orderId')}>#{order._id.slice(-6).toUpperCase()}</div>
                                            <div className={cx('date')}>{date}</div>
                                        </td>
                                        <td>
                                            <div className={cx('name')}>{order.customerName}</div>
                                            <div className={cx('phone')}>{order.phone}</div>
                                        </td>
                                        <td className={cx('price')}>{order.totalAmount?.toLocaleString()}₫</td>
                                        <td>
                                            <span className={cx('method')}>
                                                {order.paymentMethod === 'cod' ? 'Thanh toán COD' : 'Banking'}
                                            </span>
                                        </td>

                                        {/* Cột trạng thái: Nếu bạn không muốn click vào Badge này mà bị mở rộng, hãy thêm stopPropagation */}
                                        <td onClick={(e) => e.stopPropagation()}>
                                            <span className={cx('statusBadge', order.status)}>
                                                {order.status === 'pending' && 'Chờ xử lý'}
                                                {order.status === 'shipping' && 'Đang giao'}
                                                {order.status === 'delivered' && 'Đã giao'}
                                                {order.status === 'cancelled' && 'Đã hủy'}
                                            </span>
                                        </td>

                                        {/* Cột Thao tác: Bắt buộc phải có stopPropagation để khi chọn Select không bị đóng/mở dòng */}
                                        <td className={cx('textRight')} onClick={(e) => e.stopPropagation()}>
                                            <select
                                                className={cx('statusSelect')}
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                            >
                                                <option value="pending">Chờ xử lý</option>
                                                <option value="shipping">Đang giao</option>
                                                <option value="delivered">Đã giao</option>
                                                <option value="cancelled">Hủy đơn</option>
                                            </select>
                                        </td>
                                    </tr>

                                    {/* CHI TIẾT SẢN PHẨM TRONG ĐƠN HÀNG */}
                                    {isExpanded && (
                                        <tr className={cx('expandRow')}>
                                            <td colSpan="7">
                                                <div className={cx('orderDetailContainer')}>
                                                    {/* 1. Header chi tiết: Mã đơn và Thời gian đầy đủ */}
                                                    <div className={cx('detailHeader')}>
                                                        <span className={cx('fullId')}>
                                                            <strong>Mã đơn hàng:</strong> {order._id}
                                                        </span>
                                                        <span className={cx('fullDate')}>
                                                            <strong>Thời gian đặt:</strong>{' '}
                                                            {new Date(order.createdAt).toLocaleString('vi-VN')}
                                                        </span>
                                                    </div>

                                                    <div className={cx('detailGrid')}>
                                                        {/* 2. Thông tin khách hàng & Giao hàng */}
                                                        <div className={cx('infoSection')}>
                                                            <h4>
                                                                <i className="fas fa-truck"></i> Thông tin giao hàng
                                                            </h4>
                                                            <div className={cx('infoContent')}>
                                                                <p>
                                                                    <strong>Người nhận:</strong> {order.customerName}
                                                                </p>
                                                                <p>
                                                                    <strong>Số điện thoại:</strong>{' '}
                                                                    <span className={cx('highlight')}>
                                                                        {order.phone}
                                                                    </span>
                                                                </p>
                                                                <p>
                                                                    <strong>Địa chỉ:</strong> {order.address}
                                                                </p>
                                                                <p>
                                                                    <strong>Ghi chú đơn hàng:</strong>{' '}
                                                                    {order.customerNote?.trim() || 'Không có ghi chú'}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* 3. Thông tin thanh toán */}
                                                        <div className={cx('infoSection')}>
                                                            <h4>
                                                                <i className="fas fa-credit-card"></i> Thanh toán
                                                            </h4>
                                                            <div className={cx('infoContent')}>
                                                                <p>
                                                                    <strong>Phương thức:</strong>{' '}
                                                                    {order.paymentMethod === 'cod'
                                                                        ? 'Thanh toán khi nhận hàng (COD)'
                                                                        : 'Chuyển khoản ngân hàng'}
                                                                </p>
                                                                <p>
                                                                    <strong>Trạng thái:</strong>{' '}
                                                                    {order.status === 'delivered'
                                                                        ? 'Đã thanh toán'
                                                                        : 'Chưa hoàn tất'}
                                                                </p>
                                                                <p className={cx('totalFinal')}>
                                                                    <strong>Tổng tiền cuối cùng : </strong>
                                                                    <span>{order.totalAmount?.toLocaleString()}₫</span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* 4. Danh sách sản phẩm chi tiết */}
                                                    <div className={cx('productTable')}>
                                                        <h4>Danh sách sản phẩm ({order.items.length})</h4>
                                                        <div className={cx('tableHead')}>
                                                            <span className={cx('colImg')}>Ảnh</span>
                                                            <span className={cx('colDesc')}>Sản phẩm / SKU</span>
                                                            <span className={cx('colVariant')}>Phân loại</span>
                                                            <span className={cx('colQty')}>Số lượng</span>
                                                            <span className={cx('colPrice')}>Đơn giá</span>
                                                            <span className={cx('colSubtotal')}>Thành tiền</span>
                                                        </div>
                                                        {order.items.map((item, idx) => (
                                                            <div key={idx} className={cx('productRow')}>
                                                                <div className={cx('colImg')}>
                                                                    <img
                                                                        src={
                                                                            item.image ? `${BASE_URL}${item.image}` : ''
                                                                        }
                                                                        alt={item.name}
                                                                    />
                                                                </div>
                                                                <div className={cx('colDesc')}>
                                                                    <div className={cx('itemName')}>{item.name}</div>
                                                                    <div className={cx('itemSku')}>
                                                                        SKU: <strong>{item.sku || 'N/A'}</strong>
                                                                    </div>
                                                                </div>
                                                                <div className={cx('colVariant')}>
                                                                    <span>Màu: {item.color}</span>
                                                                    <span>Size: {item.size}</span>
                                                                </div>
                                                                <div className={cx('colQty')}>x{item.quantity}</div>
                                                                <div className={cx('colPrice')}>
                                                                    {item.price?.toLocaleString()}₫
                                                                </div>
                                                                <div className={cx('colSubtotal')}>
                                                                    {(item.price * item.quantity).toLocaleString()}₫
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className={cx('infoSection')}>
                                                        <h4>
                                                            <i className="fas fa-edit"></i> Ghi chú nội bộ (Admin)
                                                        </h4>
                                                        <div className={cx('noteWrapper')}>
                                                            <textarea
                                                                className={cx('adminNoteInput')}
                                                                placeholder="Nhập ghi chú cho đơn hàng này..."
                                                                defaultValue={order.adminNote}
                                                                onChange={(e) =>
                                                                    handleNoteChange(order._id, e.target.value)
                                                                }
                                                            />
                                                            <button
                                                                className={cx('btnSaveNote')}
                                                                onClick={() => saveAdminNote(order._id)}
                                                            >
                                                                Lưu ghi chú
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ListOrder;
