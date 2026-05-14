import Header from './Header';
function DefaulLayout({ children }) {
    return (
        <>
            <Header />
            <div className="container">{children}</div>
        </>
    );
}

export default DefaulLayout;
