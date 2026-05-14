import { HeaderOnly } from '~/compopnents/Layout';
import Home from '~/pages/Home';
import Order from '~/pages/Order';
import Upload from '~/pages/Upload';
import About from '~/pages/About';
import Login from '~/pages/Login';
import Register from '~/pages/Register';
import Users from '~/pages/Users';
import EditUserForm from '~/pages/EditUser';
import Product from '~/pages/Product';
import ProductDetail from '~/pages/ProductDetail';
import ListProduct from '~/pages/ListProduct';
import Cart from '~/pages/Cart';
import ListOrder from '~/pages/ListOrder';
import Category from '~/pages/CategoryList';
const publicRoutes = [
    { path: '/', component: Home },
    { path: '/order', component: Order },
    // { path: '/product', component: Product },
    // trang hiện mỗi loại sản phẩm
    // { path: '/category/bags', component: Product, props: { category: 'Túi Xách' } }, // túi xách
    // { path: '/category/clothes', component: Product, props: { category: 'Quần áo' } }, // quần áo
    // { path: '/category/shoes', component: Product, props: { category: 'Giày Dép' } },
    { path: '/category/:slug', component: Product },
    { path: '/about', component: About },
    { path: '/upload', component: Upload, layout: HeaderOnly },
    { path: '/product/:slug', component: ProductDetail, layout: HeaderOnly },
    { path: 'admin/products/list', component: ListProduct, layout: HeaderOnly },
    { path: '/admin/orders', component: ListOrder, layout: HeaderOnly },
    { path: '/admin/category', component: Category, layout: HeaderOnly },
    { path: '/cart', component: Cart, layout: HeaderOnly },
    { path: '/login', component: Login, layout: null },
    { path: '/admin/users', component: Users, layout: HeaderOnly },
    { path: '/admin/users/:id', component: EditUserForm, layout: null },
    { path: '/register', component: Register, layout: null },
];
const privateRoutes = [];
export { privateRoutes, publicRoutes };
