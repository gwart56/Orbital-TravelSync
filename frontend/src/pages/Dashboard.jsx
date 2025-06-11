import Header from "../components/Header";
import { useAuthContext } from "../lib/AuthContext";
import { useNavigate, Link} from 'react-router-dom';
import { addItineraryForUser, deleteItineraryById, loadAllItineraryForUser } from "../lib/supabaseItinerary";
import { supabase } from "../lib/supabaseClient";
import { useState, useEffect } from "react";

function DashboardNotLoggedIn() {
    return (<>
        <h1 className="text-primary" style={{margin: "20px", marginTop: "100px"}}>Welcome to TravelSync</h1>
        <h2>Not Logged In</h2>
        <Link to="/login">Click here to log in</Link>
    </>)
}

function ItineraryLinks({userId, navigate}) {
    if (!userId) {
        return (<h3>Error: No user</h3>);
    }
    const [itinsArray, setItins] = useState(null); //***NOTE THE ITINSARRAY HERE 
    // IS IN FORM [..., {
        // itinDbId: *itin supabase id*, 
        // itin: *ItineraryClassObj*
    //}] ***jus for my own ref

    const addNewItinerary = async () => {
        try {
            const newItin = await addItineraryForUser(userId);
            console.log('successfully created new itinerary');
            console.log(newItin);
            goToActivityPage(newItin.id);
        } catch (err) {
          console.error('Failed to create new Itinerary...', err);
        }
    }

    const deleteItinerary = async (itinDbId) => {
        try {
            await deleteItineraryById(itinDbId);
            console.log('successfully deleted new itinerary');
            navigate('/');
        } catch (err) {
            console.error('Failed to create new Itinerary...', err);
        }
    }

    useEffect(() => {
        const fetchItins = async () => {
            try {
                const loadedItins = await loadAllItineraryForUser(userId); //wait to get itin class obj by id from supabase
                setItins(loadedItins);
            } catch (err) {
                console.error("failed to load itins", err);
            }
        }
        fetchItins();
    }
    , []);

    const goToActivityPage = (itinDbId) => {
        navigate(`/activities/${itinDbId}`);
    };

    const itinsElements = itinsArray? itinsArray.map(it => (
        <div>
            <button className="itin-button btn btn-success mb-3" key={it.itinDbId} onClick={() => goToActivityPage(it.itinDbId)}>
                {it.itin.name}
            </button>
            <button className="btn btn-danger mb-3" onClick={()=>deleteItinerary(it.itinDbId)}>
                DELETE
            </button>
        </div>
      )) : (<h3>No Itineraries</h3>);

    return (
        <div>
            <div className="itins-container">
                {itinsElements}
            </div>
            <button className="btn btn-primary btn-lg px-4 mt-4 mb-4" onClick={addNewItinerary}>
                Create New Itinerary
            </button>
        </div>
    );
}

function DashboardContent() {
    const {signOutUser, session} = useAuthContext();
    const navigate = useNavigate(); //used for navigation
    const user = session?.user; // get user of current session
    const userId = user?.id; //get userId
    const userName = user?.user_metadata?.name || user?.email; //user name
    useEffect(() => {
        console.log("user", user);
        console.log("NAME of current session's user: ", userName);
    }, [user, userName]);

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
        if (!window.confirm("Are you sure? This cannot be undone.")) return;
        // todo: delete all data associated with user
        try {
            const res = await fetch('/api/delete-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id }),
            });

            if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || 'Failed to delete user');
            }

            await signOutUser();
            navigate('/signup');
            alert('Account deleted successfully');

        } catch (error) {
            console.error('Error deleting account:', error)
            alert('Failed to delete account: ' + error.message)
        }
    }

    return (<>
        <h1 className="text-primary" style={{marginBottom: "20px", marginTop: "100px"}}>Welcome to TravelSync, {userName}</h1>
        <h2 style={{margin: "20px"}}>Dashboard</h2>
        <ItineraryLinks userId={userId} navigate={navigate}/>
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