import Navbar from './Navbar';

// eslint-disable-next-line react/prop-types
const Layout = ({ children }) => {
    return (
        <div className="app-container">
            <Navbar />
            <div className="app-content">
                {children}
            </div>
        </div>
    );
};

export default Layout;