export const adminMenu = [
    {
        id: 1,
        title: 'Quản lý sản phẩm',
        icon: '📦',
        requiredRole: 'admin',
        children: [
            { id: 14, title: 'Danh sách sản phẩm', path: '/admin/products/list' },
            { id: 14, title: 'Các Mặt hàng', path: '/admin/category' },
        ],
    },
    {
        id: 3,
        title: 'Quản lý người dùng',
        icon: '👤',
        requiredRole: 'admin',
        children: [{ id: 31, title: 'Danh sách người dùng', path: '/admin/users' }],
    },
    {
        id: 2,
        title: 'Quản lý đơn hàng',
        icon: '🧾',
        requiredRole: 'admin',
        children: [
            { id: 21, title: 'Tất cả đơn hàng', path: '/admin/orders' },
            { id: 22, title: 'Đơn hàng đang xử lý', path: '/admin/orders/pending' },
            { id: 23, title: 'Đơn hàng đã giao', path: '/admin/orders/delivered' },
            { id: 24, title: 'Đơn hàng đã hủy', path: '/admin/orders/cancelled' },
        ],
    },

    {
        id: 4,
        title: 'Thống kê',
        icon: '📊',
        requiredRole: 'admin',
        children: [
            { id: 41, title: 'Doanh thu', path: '/admin/stats/revenue' },
            { id: 42, title: 'Sản phẩm bán chạy', path: '/admin/stats/best-seller' },
            { id: 43, title: 'Thống kê người dùng', path: '/admin/stats/users' },
        ],
    },
];
