import Header from "../components/Header";
import dayjs from "dayjs";
import { useAuthContext } from "../lib/AuthContext";
import { useNavigate, Link} from 'react-router-dom';
import { addItineraryForUser, deleteItineraryById, loadAllItineraryForUser } from "../lib/supabaseItinerary";
import { useState, useEffect } from "react";
import { MdDeleteForever } from 'react-icons/md';
import "./Dashboard.css";
import ItineraryModal from "../components/ItineraryModal";

function DashboardNotLoggedIn() {
    return (
        <div className="dashboard-page">
            <div className="dashboard-card">
                <h1 className="text-primary">Welcome to TravelSync</h1>
                <h2>Log in to plan your next holiday!</h2>
                <Link to="/login">Click here to log in!</Link><br />
                <Link to="/signup">Don't have an account? Sign up here!</Link>
            </div>
        </div>
    );
}


function ItineraryLinks({userId, navigate}) {
    if (!userId) {
        return (<h3>Error: No user</h3>);
    }
    const [itinsArray, setItins] = useState(null); //***NOTE THE ITINSARRAY HERE 
    const [isModalOpen, setIsModalOpen] = useState(false);
    // IS IN FORM [..., {
        // itinDbId: *itin supabase id*, 
        // itin: *ItineraryClassObj*
        // dateCreated: *date created*
    //}] ***jus for my own ref

    const addNewItinerary = async ({name, startDate, numDays}) => {
        try {
            const newItin = await addItineraryForUser(userId, 
                name, 
                dayjs(startDate, 'YYYY-MM-DD').format('DD-MM-YYYY'),  //format the startDate
                numDays);
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


    const itinsElements = itinsArray? 
        itinsArray.length==0 ? (<h3>No Itineraries</h3>) //if no itineraries...
        : itinsArray.map(it => (
            <div className="d-flex justify-content-center" key={it.itinDbId}>
                <div className="itin-link-container d-flex align-items-center flex-wrap gap-3">
                    <span><strong>Itinerary Name:</strong> {it.itin.name}</span>
                    {/* <span className="m-3">Created: {it.dateCreated}</span> */}
                    <span><strong>Itinerary Date:</strong> {it.itin.startDate}</span>
                    <span><strong>No. of Days:</strong> {it.itin.travelDays.length}</span>

                    <div className="d-flex gap-2">
                    <button className="itin-button btn btn-success" onClick={() => goToActivityPage(it.itinDbId)}>
                        Edit
                    </button>
                    <button
                        className="delete-act-butt btn btn-danger align-items-center"
                        onClick={() => {
                            const confirmDelete = window.confirm("Are you sure you want to delete this itinerary?");
                            if (confirmDelete) {
                            deleteItinerary(it.itinDbId);
                            }
                        }}
                        >
                        <span>Delete </span> 
                        <MdDeleteForever size={20} />
                    </button>
                    </div>
                </div>
            </div>
        )) : (<h3 className="text-secondary">Loading Itineraries...</h3>);

    return (
        <div>
            <div className="itins-container">
                {itinsElements}
            </div>
            <button className="btn btn-primary btn-lg px-4 mt-4 mb-4" onClick={() => setIsModalOpen(true)}>
                Create New Itinerary
            </button>
            {isModalOpen && <ItineraryModal 
                onCreate={addNewItinerary} 
                onClose={() => setIsModalOpen(false)}
                />}
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
        <h1 className="text-primary" style={{ marginTop: "90px", fontWeight: "700" }}>
        ✈️ Welcome to TravelSync, {userName}
        </h1>
        <h2 style={{ margin: "20px", fontWeight: "600", color: "#444" }}>My Itineraries</h2>
        <ItineraryLinks userId={userId} navigate={navigate}/>
        <button className="btn btn-outline-danger mx-2" onClick={handleClick}>Log Out</button>
        <button className="btn btn-danger mx-2" onClick={handleDeleteAccount}>
            Delete Account
        </button>
    </>)
}

export default function Dashboard(){
    const {session} = useAuthContext();
    const user = session?.user;
    console.log("Confirmed at:", session?.user?.email_confirmed_at);
    return (
        <>
            <Header />
            {session? <DashboardContent user={user} /> : <DashboardNotLoggedIn />}
        </>
    );
}