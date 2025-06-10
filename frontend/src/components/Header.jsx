import { Link } from 'react-router-dom';
import './Header.css';
import { FaSearch } from 'react-icons/fa';

export default function Header() {
    return (
        <header className="overlay-header">
            <nav className="nav-bar">
                <Link to="/dashboard">Home</Link>
                <Link to="/about">About</Link>
                <Link to="/contact">Contact</Link>
            </nav>
            <div className="right-section">
                <form onSubmit={(e) => { e.preventDefault(); console.log("Searching..."); }}>
                    <input className="search-bar" type="text" placeholder="Search" /> 
                    <button className="search-button"><FaSearch /></button>
                </form>
            </div>
        </header>
    );
}