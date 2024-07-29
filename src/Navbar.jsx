import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faDumbbell, faCalendarAlt, faTools, faNewspaper, faList, faUser, faPen } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    return (
        <div className="navbar">
            <Link to ='/' className="navbar-item">
                <FontAwesomeIcon icon={faHome} />
                <span>Home</span>
            </Link>
            <div className="navbar-item">
                <FontAwesomeIcon icon={faDumbbell} />
                <span>Workouts</span>
            </div>
            <div className="navbar-item">
                <FontAwesomeIcon icon={faCalendarAlt} />
                <span>Routines</span>
            </div>
            <div className="navbar-item">
                <FontAwesomeIcon icon={faTools} />
                <span>Tools</span>
            </div>
            <div className="navbar-item">
                <FontAwesomeIcon icon={faNewspaper} />
                <span>Articles</span>
            </div>
            <div className="navbar-item">
                <FontAwesomeIcon icon={faList} />
                <span>Directory</span>
            </div>
            <Link to='/signin' className="navbar-item">
                <FontAwesomeIcon icon={faUser} />
                <span>Login</span>
            </Link>
            <Link to = '/signup' className="navbar-item">
                <FontAwesomeIcon icon={faPen} />
                <span>Sign Up</span>
            </Link>
        </div>
    );
};

export default Navbar;