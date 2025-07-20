import Header from "../components/Header/Header";
import { MdGroup } from "react-icons/md";
import dayjs from "dayjs";
import { useAuthContext } from "../lib/AuthContext";
import { useNavigate, Link} from 'react-router-dom';
// import { addItineraryForUser, deleteItineraryById, loadAllItineraryForUser } from "../lib/supabaseItinerary";
import { useState, useEffect } from "react";
import { MdDeleteForever } from 'react-icons/md';
import "./Dashboard.css";
import ItineraryModal from "../components/ItineraryComponents/ItineraryModal";
import { createNewItinForUser, deleteItineraryById, loadAllItineraryForUser, loadCollaboratingItineraries } from "../data/itinerary";
import { loadTravelDaysByItineraryId } from "../data/travelDays";
import { findEmailByUserId } from "../lib/supabaseCollaborator";
import { supabase } from "../lib/supabaseClient";
import ConfirmModal from '../components/Misc/ConfirmModal';

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


function CollaboratingItineraryLinks({ userId, navigate }) {
  const [itinsArray, setItins] = useState(null);

  const fetchCollaboratingItins = async () => {
      try {
        const loaded = await loadCollaboratingItineraries(userId);

        const withDayCount = await Promise.all(
          loaded.map(async (it) => {
            const travelDays = await loadTravelDaysByItineraryId(it.itin.id);
            return {
              ...it,
              numOfDays: travelDays.length,
            };
          })
        );

        //NOTE: 'it' is in format {
            // itinDbId: row.id,
            // itin: row.itinerary_data,
            // dateCreated: formatDate(row.created_at),
            // owner: row.user_id,
            // ownerEmail: row.users.email,
            // numOfDays: numDays
            //}

        const sorted = withDayCount.sort((a, b) => {
          const dateA = dayjs(a.itin.startDate, 'YYYY-MM-DD');
          const dateB = dayjs(b.itin.startDate, 'YYYY-MM-DD');
          return dateA - dateB;
        });

        setItins(sorted);
      } catch (err) {
        console.error("Failed to load collaborating itineraries:", err);
      }
  };


  useEffect(() => {
    fetchCollaboratingItins();
  }, [userId]);

  useEffect(() => {//this is for realtime channel for itin
    // Initial fetch when the component mounts or itinDbId changes
    fetchCollaboratingItins();      
    const channel = supabase.channel(`itinerary_members-${userId}`);
    console.log(`[Realtime] Subscribing to itinerary_members-${userId}`);

    channel
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'itinerary_members',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('[Realtime] INSERT/UPDATE/DELETE itin members', payload);
          fetchCollaboratingItins();
        }
      )
      .subscribe((status) => {
        console.log(`[Realtime] itinerary_members-${userId} channel status:`, status);
      });

    // Cleanup function: This runs when hgId changes or component unmounts
    return () => {
      console.log(`[Cleanup] Removing itin channel for ${userId}`);
      if (channel) {
        channel.unsubscribe();
      }
    };
  }, [userId]);

  const goToActivityPage = (itinDbId) => {
    navigate(`/activities/${itinDbId}`);
  };

  if (!userId) return <h3>Error: No user</h3>;

  return (
    <div className="itins-container">
      {itinsArray === null ? (
        <h3 className="text-secondary">Loading...</h3>
      ) : itinsArray.length === 0 ? (
        <div className="empty-itin-message">
          <h3>🤝 No collaborations yet!</h3>
          <p className="text-muted">Ask a friend to invite you to an itinerary.</p>
        </div>
      ) : (
        itinsArray.map((it, index) => (
          <div
            className="d-flex justify-content-center fade-in"
            style={{ animationDelay: `${index * 100}ms`, animationFillMode: "both" }}
            key={it.itinDbId}
          >
            <div
              className="itin-link-container d-flex align-items-center flex-wrap gap-3 clickable-card"
              onClick={() => goToActivityPage(it.itinDbId)}
            >
              <div className="itin-detail name">
                <h4><strong><MdGroup /></strong> {it.itin.name}</h4>
              </div>
              <div className="itin-detail date">
                <h4><strong>📅</strong> {dayjs(it.itin.startDate, "YYYY-MM-DD").format("D MMMM YYYY")}</h4>
              </div>
              <div className="itin-detail days">
                <h4><strong>🕒</strong> {it.numOfDays} days</h4>
              </div>
              <div className="itin-detail owner text-muted">
                <small><strong>Shared by:</strong> {it.ownerEmail}</small> {/* Optionally map owner to name later */}
              </div>
            </div>
          </div>
        ))
      )}
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
            const newItin = await createNewItinForUser(userId, 
                name, 
                dayjs(startDate, 'YYYY-MM-DD').format('YYYY-MM-DD'),  //format the startDate
                numDays);
            console.log('successfully created new itinerary');
            console.log('newitin', newItin);
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

    const [deletingItinId, setDeletingItinId] = useState(null);

    useEffect(() => {
        const fetchItins = async () => {
            try {
            const loadedItins = await loadAllItineraryForUser(userId);

            const itinsWithDayCount = await Promise.all(
                loadedItins.map(async (it) => {
                const travelDays = await loadTravelDaysByItineraryId(it.itin.id);
                return {
                    ...it,
                    numOfDays: travelDays.length,
                };
                })
            );

            // Sort by startDate
            const sorted = itinsWithDayCount.sort((a, b) => {
                const dateA = dayjs(a.itin.startDate, 'YYYY-MM-DD');
                const dateB = dayjs(b.itin.startDate, 'YYYY-MM-DD');
                return dateA - dateB;
            });

            setItins(sorted);
            } catch (err) {
            console.error("Failed to load itineraries:", err);
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
                <h3>🗺️ No trips planned - Let's change that!</h3>
                <p className="text-muted">Click the button below to create your first itinerary.</p>
            </div>
            )

        : itinsArray.map((it, index) => { 
            return (<div
            className="d-flex justify-content-center fade-in"
            style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
            key={it.itinDbId}
            >

                <div
                    className="itin-link-container d-flex align-items-center flex-wrap gap-3 clickable-card"
                    onClick={() => goToActivityPage(it.itinDbId)}
                >
                    <div className="itin-detail name"><h4><strong>🌍</strong> {it.itin.name}</h4></div>
                    <div className="itin-detail date"><h4><strong>📅</strong> {dayjs(it.itin.startDate, "YYYY-MM-DD").format("D MMMM YYYY")}</h4></div>
                    <div className="itin-detail days"><h4><strong>🕒</strong> {it.numOfDays} days</h4></div>


                    <div
                    className="d-flex gap-2"
                    onClick={(e) => e.stopPropagation()} // allow delete without triggering edit
                    >
                      <button
                          className="delete-act-butt btn btn-danger align-items-center"
                          onClick={() => setDeletingItinId(it.itinDbId)}
                      >
                          <span>Delete </span>
                          <MdDeleteForever size={20} />
                      </button>
                    </div>
                </div>
            </div>)}
        ): (<h3 className="text-secondary">Loading Itineraries...</h3>);

    return (
        <div>
            <div className="itins-container">
                {itinsElements}
            </div>
            {/* Confirm modal outside the list */}
            {deletingItinId && (
              <ConfirmModal
                message={`Are you sure you want to delete "${
                  itinsArray.find((it) => it.itinDbId === deletingItinId)?.itin.name
                }"?`}
                onConfirm={() => {
                  deleteItinerary(deletingItinId);
                  setDeletingItinId(null);
                }}
                onCancel={() => setDeletingItinId(null)}
              />
            )}
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
        Welcome to ✈️TravelSync, {userName}!
        </h1>
        <h2 style={{ margin: "20px", fontWeight: "800", color: "#444", fontSize: "2.5rem" }}>My Itineraries</h2>
        <ItineraryLinks userId={userId} navigate={navigate}/>
        <h2 style={{ margin: "20px", fontWeight: "800", color: "#444", fontSize: "2.5rem" }}>Itineraries Shared With Me</h2>
        <CollaboratingItineraryLinks userId={userId} navigate={navigate}/>
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