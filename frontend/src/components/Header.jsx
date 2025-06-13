import { Link } from 'react-router-dom';
import './Header.css';
import { FaSearch } from 'react-icons/fa';
import { useAuthContext } from '../lib/AuthContext';

export default function Header() {
    const {session} = useAuthContext();
    const user = session?.user; // get user of current session
    const userName = user?.user_metadata?.name || user?.email; //user name
    return (
        <header className="overlay-header">
            <nav className="nav-bar">
                <Link to="/dashboard">Home</Link>
                <Link to="/about">About</Link>
                <Link to="/contact">Contact</Link>
            </nav>
            <div className="right-section">
                <span>{userName? userName: 'Guest'}</span>
                <form onSubmit={(e) => { e.preventDefault(); console.log("Searching..."); }}>
                    <input className="search-bar" type="text" placeholder="Search" /> 
                    <button className="search-button"><FaSearch /></button>
                </form>
            </div>
        </header>
    );
}