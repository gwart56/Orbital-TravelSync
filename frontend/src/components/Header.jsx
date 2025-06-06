import './Header.css';
import { FaSearch } from 'react-icons/fa';

export default function Header() {
    return (
        <header className="hidden-headr">
            <nav className="nav-bar">
                <a>Home</a>
                <a>About</a>
                <a>Contact</a>
            </nav>
            <div className="right-section">
                <form onSubmit={(event)=>{console.log("Searching...");event.preventDefault();}}>
                    <input className="search-bar" type="text" placeholder="Search" /> 
                    <button className="search-button"><FaSearch /></button>
                </form>
            </div>
        </header>
        
    );
}
