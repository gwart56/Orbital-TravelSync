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
            <div className="dashboard-card fade-in">
                <h1 className="text-primary">Welcome to ✈️TravelSync!</h1>
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
                const loadedItins = await loadAllItineraryForUser(userId);

                // Sort by startDate (assuming format is DD-MM-YYYY)
                const sorted = loadedItins.sort((a, b) => {
                    const dateA = dayjs(a.itin.startDate, 'DD-MM-YYYY');
                    const dateB = dayjs(b.itin.startDate, 'DD-MM-YYYY');
                    return dateA - dateB; // ascending (earliest first)
                    // return dateB - dateA; // descending (latest first)
                });

                setItins(sorted);
                } catch (err) {
                console.error("failed to load itins", err);
            }
        };

        fetchItins();
    }, []);


    const goToActivityPage = (itinDbId) => {
        navigate(`/activities/${itinDbId}`);
    };


    const itinsElements = itinsArray? 
        itinsArray.length === 0 ? (
            <div className="empty-itin-message">
                <h3>🗺️ No trips planned - let's change that!</h3>
                <p className="text-muted">Click the button below to create your first itinerary.</p>
            </div>
            )

        : itinsArray.map((it, index) => (
            <div
            className="d-flex justify-content-center fade-in"
            style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
            key={it.itinDbId}
            >

                <div
                    className="itin-link-container d-flex align-items-center flex-wrap gap-3 clickable-card"
                    onClick={() => goToActivityPage(it.itinDbId)}
                >
                    <div className="itin-detail name"><h4><strong>🌍</strong> {it.itin.name}</h4></div>
                    <div className="itin-detail date"><h4><strong>📅</strong> {it.itin.startDate}</h4></div>
                    <div className="itin-detail days"><h4><strong>🕒</strong> {it.itin.travelDays.length} days</h4></div>


                    <div
                    className="d-flex gap-2"
                    onClick={(e) => e.stopPropagation()} // allow delete without triggering edit
                    >
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
            <button className="btn btn-primary btn-lg px-4 mt-4 mb-4 fade-in-up" onClick={() => setIsModalOpen(true)}>
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

    return (<div className="dashboard-background">
        <h1 className="text-primary" style={{ marginTop: "90px", fontWeight: "700" }}>
        Welcome to ✈️TravelSync, {userName}
        </h1>
        <h2 style={{ margin: "20px", fontWeight: "800", color: "#444", fontSize: "2.5rem" }}>My Itineraries</h2>
        <ItineraryLinks userId={userId} navigate={navigate}/>
        <div className="d-flex mb-5">
            <button className="btn btn-danger m-3" onClick={handleClick}>Log Out</button>
            <button className="btn btn-danger m-3" onClick={handleDeleteAccount}>
                Delete Account
            </button>
        </div>
        
    </div>)
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