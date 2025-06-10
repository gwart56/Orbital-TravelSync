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
    const {signOutUser} = useAuthContext();
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
    return (<>
        <h1 className="text-primary" style={{marginBottom: "20px", marginTop: "100px"}}>Welcome to TravelSync, {user?.user_metadata?.name || user?.email}</h1>
        <h2 style={{margin: "20px"}}>Dashboard</h2>
        <button className="btn btn-danger" onClick={handleClick}>Log Out</button>
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