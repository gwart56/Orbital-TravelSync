import { Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { useAuthContext } from '../../lib/AuthContext';
import './Header.css';

export default function Header() {
  const { signOutUser, session } = useAuthContext();
  const user = session?.user;
  const userName = user?.user_metadata?.name || user?.email;

  async function handleLogout() {
        try {
            await signOutUser();
            navigate('/login');
            console.log("signed out");
        } catch (error) {
            console.error('error: ', error.message);
        }
    }

  return (
    <header
      className="position-fixed top-0 start-0 end-0 d-flex justify-content-between align-items-center px-4 py-3 shadow-sm border-bottom"
      style={{
        backgroundColor: 'rgba(183, 249, 255, 1)',
        backdropFilter: 'blur(5px)',
        zIndex: 1000,
      }}
    >
    <div className="d-flex align-items-center gap-4">
        <Link to="/dashboard" className="fs-4 fw-bold text-decoration-none text-primary">
            ✈️TravelSync
        </Link>
        
        <nav className="d-flex gap-3">
            <Link className="text-decoration-none fw-medium text-dark nav-link-hover mx-2" to="/dashboard">
                Home
            </Link>
            <Link className="text-decoration-none fw-medium text-dark nav-link-hover mx-2" to="/about">
                About
            </Link>
            <Link className="text-decoration-none fw-medium text-dark nav-link-hover mx-2" to="/contact">
                Contact
            </Link>
        </nav>
      </div>

      <div className="d-flex align-items-center gap-3">
        <span className="fw-semibold">{userName || 'Guest'}</span>
        <form
          className="d-flex align-items-center"
          onSubmit={(e) => {
            e.preventDefault();
            console.log('Searching...');
          }}
        >

        </form>
        {user && (
        <button
            onClick={handleLogout}
            className="btn btn-outline-danger btn-sm"
            type="button"
            >
            Logout
        </button>
        )}
      </div>
    </header>
  );
}
