import Header from "../components/Header";
import { useAuthContext } from "../lib/AuthContext";
import { useNavigate, Link} from 'react-router-dom';

function DashboardNotLoggedIn() {
    return (<>
        <h1 className="text-primary" style={{margin: "20px", marginTop: "100px"}}>Welcome to TravelSync</h1>
        <h2>Not Logged In</h2>
        <Link to="/login">Click here to log in</Link>
    </>)
}

function DashboardContent({user}) {
    const {signOutUser, deleteUser} = useAuthContext();
    const navigate = useNavigate(); //used for navigation

    async function handleClick() {
        try {
            await signOutUser();
            navigate('/login');
            console.log("signed out");
        } catch (error) {
            console.error('error: ', error.message);
        }
    }

    async function handleDeleteAccount() {
        const confirmDelete = window.confirm("Are you sure you want to delete your account? This cannot be undone.");
        if (!confirmDelete) return;

        try {
            await deleteUser(user.id);
            navigate('/signup');
            console.log("deleted");
        } catch (error) {
            console.error("Error deleting account:", error.message);
            alert("Failed to delete account: " + error.message);
        }
    }

    return (<>
        <h1 className="text-primary" style={{marginBottom: "20px", marginTop: "100px"}}>Welcome to TravelSync, {user?.user_metadata?.name || user?.email}</h1>
        <h2 style={{margin: "20px"}}>Dashboard</h2>
        <button className="btn btn-danger" onClick={handleClick}>Log Out</button>
        <button className="btn btn-outline-danger" onClick={handleDeleteAccount}>
            Delete Account
        </button>
    </>)
}

export default function Dashboard(){
    const {session} = useAuthContext();
    const user = session?.user;
    return (
        <>
            <Header />
            {session? <DashboardContent user={user} /> : <DashboardNotLoggedIn />}
        </>
    );
}