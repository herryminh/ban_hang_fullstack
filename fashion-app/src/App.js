import { Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { publicRoutes } from '~/routes';
import { DefaultLayout } from './compopnents/Layout';

// 1. Import React-Toastify
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    {publicRoutes.map((route, index) => {
                        const Page = route.component;
                        let Layout = DefaultLayout;
                        if (route.layout) {
                            Layout = route.layout;
                        } else if (route.layout === null) {
                            Layout = Fragment;
                        }

                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    <Layout>
                                        <Page {...route.props} />
                                    </Layout>
                                }
                            />
                        );
                    })}
                </Routes>

                {/* 2. Đặt ToastContainer ở đây để nó hiển thị toàn cục */}
                <ToastContainer
                    position="top-right"
                    autoClose={3000} // 3 giây tự tắt
                    hideProgressBar={false}
                    closeOnClick
                    pauseOnHover
                    draggable
                    theme="colored"
                />
            </div>
        </Router>
    );
}

export default App;
