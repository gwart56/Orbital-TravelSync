import { useEffect, useState } from "react";
import Header from "../components/Header/Header";
import ItineraryInfo from "../components/ItineraryComponents/ItineraryInfo";
import { useNavigate, useParams } from "react-router-dom";
// import { loadItineraryById, updateItineraryById } from "../lib/supabaseItinerary";
import HotelContainer from "../components/HotelPageContent/HotelContainer";
import { addHGToArr, addHotelGrpsIntoDB, addHotelsIntoDB, addHotelToArr, deleteHGFromArr, deleteHotelById, deleteHotelFromArr, deleteHotelGroupById, doesHGOverlap, editHotelInArr, getAllConfirmedHotelsFromArr, loadAllConfirmedHotelsByItineraryId, loadHotelGroupsByItineraryId, loadHotelsByGroupId, newHotel, newHotelGroup, updateHotelById, updateHotelGroupById } from "../data/hotel";
import { setItinHotels } from "../data/activity";
import HGInfo from "../components/HotelPageContent/HotelGroupInfo";
import ConfirmedHotelGroup from "../components/HotelPageContent/ConfirmedHotelGroup";
// import { AutoSaveButton } from "../components/Misc/AutoSaver";
import "./HotelsPage.css";
import HotelComparator from "../components/GoogleMapsComponents/HotelComparator";
import ConfirmModal from "../components/Misc/ConfirmModal";
import { loadItineraryById, updateItineraryById } from "../data/itinerary";
import { addItemToArray, deleteItemFromArrayById, editItemInArrayById} from '../utils/arrays';
import { useAuthContext } from "../lib/AuthContext";
import { LoadingMessage } from "../components/Misc/LoadingMessage";
import { fetchItin } from "../utils/fetchingForPage";
import { supabase } from "../lib/supabaseClient";

function HotelGrpContent({hotelGrp, hgId, deleteHG, hotelGrps, setHotelGroups, itinDbId, setLoadingMessage, isEditable}) { //CONTENT FOR ONE HOTEL GROUP
    const [hotels, setHotels] = useState([]);
    const [confirmedHotel, setConfirmedHotel] = useState(undefined);
    const [isComparingLocations, setIsComparingLocations] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const fetchH = async () => {
            try {
                const loadedH = await loadHotelsByGroupId(hgId);
                setHotels(loadedH);
                const confirmed = loadedH.find(h => h.isConfirmed === true);
                setConfirmedHotel(confirmed);
            } catch (err) {
                console.error("Failed to load itinerary", err);
            }
          }
    
    useEffect( () => {//FETCH ALL HOTELS IN THIS GROUP
          fetchH();
        }
        ,[hgId]);

    useEffect(() => {
        // Initial fetch when the component mounts or itinDbId changes
        fetchH();
    
        const channel = supabase.channel(`hotels-${hgId}`);
        console.log(`[Realtime] Subscribing to hotels-${hgId}`);
    
        channel
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'hotels',
              filter: `groupId=eq.${hgId}`,
            },
            (payload) => {
              console.log('[Realtime] INSERT/UPDATE/DELETE hotel', payload);
              fetchH();
            }
          )
          .subscribe((status) => {
            console.log(`[Realtime] hotels-${hgId} channel status:`, status);
          });
    
        // Cleanup function: This runs when hgId changes or component unmounts
        return () => {
          console.log(`[Cleanup] Removing hotel channel for ${hgId}`);
          if (channel) {
            channel.unsubscribe();
          }
        };
      }, [hgId]);

    // const getConfirmedHotel = () => {
    //     //THIS RETURNS THE CONFIRMED HOTEL IN A HOTEL GROUP (ASSUMES ONLY 1 CONFIRMED HOTEL)
    //     //RETURNS UNDEFINED IF NO CONFIRMED HOTEL
    //     return 
    // }
    

    //FOR EDITING,ADDING,DELETING AND CONFIRMING HOTELS---------------------------------------------------
    const handleConfirmClick = async (targetHotel) => {
        // Guard clause for missing hotel name
        if (!targetHotel.name || targetHotel.name.trim() === '') {
            alert("Hotel name is required before confirming.");
            return;
        }

        // TODO: Prevent overlapping check-in/check-out
        const confirmedHotelsArr = await loadAllConfirmedHotelsByItineraryId(itinDbId);
        if (doesHGOverlap(hotelGrp, confirmedHotelsArr)) {
            // alert('WARNING: Hotel check-in and check-out date overlaps with other confirmed hotel(s)')
            return;
        }

        const updatedHotel = { ...targetHotel, isConfirmed: true, checkInDate: hotelGrp.startDate, checkOutDate: hotelGrp.endDate };

        updateHotel(targetHotel.id, updatedHotel);
        setConfirmedHotel(updatedHotel);
    }

    const updateHotel = async (targetId, updatedH) => {
        setLoadingMessage("Updating...");
        const newHotelArr = editItemInArrayById(hotels, updatedH, targetId);
        await updateHotelById(targetId, updatedH);
        setHotels(newHotelArr);
        setLoadingMessage("");
    }

    const deleteHotel = async (targetId) => {
        setLoadingMessage("Deleting...");
        const newHotelArr = deleteItemFromArrayById(hotels, targetId);
        await deleteHotelById(targetId);
        setHotels(newHotelArr);
        setLoadingMessage("");
    }

    const addNewHotel = async () => {
        setLoadingMessage("Adding...");
        const newHot = newHotel(hgId, "");
        await addHotelsIntoDB(newHot);
        const newHotelArr = [...hotels, newHot];
        setHotels(newHotelArr);
        setLoadingMessage("");
        // console.log("added new hotel");
    }

    //FOR EDITING HOTEL GROUP NAME, DATES ---------------------------------------------------
    const renameHG = async (newName) => {
        const newHG = {...hotelGrp, name: newName};
        await updateHotelGroupById(hgId, newHG);
        const newHotelGrps = hotelGrps.map(hg => hg.id == hgId ? {...hg, name: newName} : hg);
        setHotelGroups(newHotelGrps);
    }

    const setStartHG = async (newStartDate) => {
        const newHG = {...hotelGrp, startDate: newStartDate};
        await updateHotelGroupById(hgId, newHG);
        const newHotelGrps = hotelGrps.map(hg => hg.id == hgId ? {...hg, startDate: newStartDate} : hg);
        setHotelGroups(newHotelGrps);
    }

    const setEndHG = async (newEndDate) => {
        const newHG = {...hotelGrp, endDate: newEndDate};
        await updateHotelGroupById(hgId, newHG);
        const newHotelGrps = hotelGrps.map(hg => hg.id == hgId ? {...hg, endDate: newEndDate} : hg);
        setHotelGroups(newHotelGrps);
    }
    //-----------------------------------------

    const hotelsElements = hotels.length==0
        ? (
            <div className="no-hotels-warning text-center fade-in">
            <h4>🏨 No Hotels in this Hotel Group</h4>
            <p>
                Please click <strong>"Add New Hotel"</strong> below to add new ones.
            </p>
            </div>
)
        :hotels
        .map(h => (
        <div key={h.id}>
            <HotelContainer
                key={h.id}
                hotel={h}
                onSave={updatedH => updateHotel(h.id, updatedH)}
                onDelete={deleteHotel}
                onConfirm={handleConfirmClick}
                isEditable={isEditable}
            />
        </div>));

    return (
        <>
            <div className="hg-container">               
                {confirmedHotel ? (
                    <>
                    <HGInfo hg={hotelGrp} renameHG={renameHG} setEndHG={setEndHG} setStartHG={setStartHG} confirmedHotel={confirmedHotel}/>
                    <ConfirmedHotelGroup //THIS CONTAINER ONLY APPEARS WHEN THERS CONFIRMED HOTEL
                        confirmedHotel={confirmedHotel}
                        updateHotel={updateHotel}
                        setConfirmedHotel={setConfirmedHotel}
                        isEditable={isEditable}
                    />
                    </>
                ) : (//THIS IS FOR UNCONFIRMED HOTELS, 
                <> 
                    <HGInfo hg={hotelGrp} renameHG={renameHG} setEndHG={setEndHG} setStartHG={setStartHG}/>
                    {hotelsElements}
                    {isComparingLocations && <HotelComparator
                        key={`hotel-comparator-${hgId}`} // <-- helps force full remount
                        comparedHotels={hotels}
                        onClose={() => setIsComparingLocations(false)}
                    />}
                    <button className='btn btn-primary m-3' onClick={addNewHotel} disabled={!isEditable}>+ Add New Hotel</button>
                    <button className='btn btn-success m-3' 
                        onClick={()=>{setIsComparingLocations(true)}}
                        disabled={hotels.length<=0}
                        >Compare Locations</button>
                    <button className='btn btn-danger m-3' onClick={()=>setDeleteModalOpen(true)} disabled={!isEditable}>Delete Hotel Group</button>
                    {deleteModalOpen && <ConfirmModal
                        message={"Are you sure you want to delete this Hotel Group?"}
                        onConfirm={deleteHG}
                        onCancel={()=>setDeleteModalOpen(false)}
                    />}
                </>
                )} 
            </div>
        </>
    );
}

function HotelGroupsContent({itinDbId, isEditable, setLoadingMessage}) {
    const [hotelGrps, setHotelGroups] = useState([]);

    const fetchHGs = async () => {
            try {
              loadHotelGroupsByItineraryId(itinDbId).then((loadedHGs) => setHotelGroups(loadedHGs));
            } catch (err) {
              console.error("Failed to load itinerary", err);
            }
          }
    
    useEffect( () => {fetchHGs();}
        ,[itinDbId]);

    useEffect(() => {
        // Initial fetch when the component mounts or itinDbId changes
        fetchHGs();
    
        const channel = supabase.channel(`hotelGroups-${itinDbId}`);
        console.log(`[Realtime] Subscribing to hotelGroups-${itinDbId}`);
    
        channel
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'hotelGroups',
              filter: `itineraryId=eq.${itinDbId}`,
            },
            (payload) => {
              console.log('[Realtime] INSERT hotelGrp', payload);
              fetchHGs();
            }
          )
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'hotelGroups',
              filter: `itineraryId=eq.${itinDbId}`,
            },
            (payload) => {
              console.log('[Realtime] UPDATE hotelGrp', payload);
              fetchHGs();
            }
          )
          .on(
            'postgres_changes',
            {
              event: 'DELETE',
              schema: 'public',
              table: 'hotelGroups',
              filter: `itineraryId=eq.${itinDbId}`
            },
            (payload) => {
              console.log('[Realtime] DELETE hotelGrp', payload);
              fetchHGs();
            }
          )
          .subscribe((status) => {
            console.log(`[Realtime] hotelGroups-${itinDbId} channel status:`, status);
          });
    
        // Cleanup function: This runs when itinDbId changes or component unmounts
        return () => {
          console.log(`[Cleanup] Removing travelDay channel for ${itinDbId}`);
          if (channel) {
            channel.unsubscribe();
          }
        };
      }, [itinDbId]);

    const hotelGrpsElements = hotelGrps.length==0
        ? (
            <div className="hotel-group-warning text-center fade-in">
                <h4>🏨 No Hotel Groups Found</h4>
                <p>
                    Get started by clicking <strong>"Add New Hotel Group"</strong> below to begin planning your stay!
                </p>
            </div>
)
        :hotelGrps.map(hg => (
        <div className="hg-content" key={hg.id}>
            <HotelGrpContent
                hotelGrp={hg}
                hotelGrps={hotelGrps}
                setHotelGroups={setHotelGroups}
                // itin={itin}
                // setItin={setItin}
                itinDbId={itinDbId}
                hgId={hg.id}
                deleteHG={() => deleteHG(hg.id)}
                isEditable={isEditable}
                setLoadingMessage={setLoadingMessage}
            />
        </div>
    ));

    const addNewHG = async () => {
        setLoadingMessage("Adding...");
        const newHotelGrp = newHotelGroup(itinDbId,"New Group");
        const newHotelGrps = [...hotelGrps, newHotelGrp];
        await addHotelGrpsIntoDB(newHotelGrp);
        setHotelGroups(newHotelGrps);
        console.log("added new hotel grp");
        setLoadingMessage("");
    }

    const deleteHG = async (hgId) => {       
        setLoadingMessage("Deleting...");                    
        const newHotelGrps = hotelGrps.filter(x => x.id !== hgId);
        await deleteHotelGroupById(hgId);
        setHotelGroups(newHotelGrps);
        console.log("deleted hotel grp");
        setLoadingMessage("");
    }

    return (
        <div className="hg-content container">
            {hotelGrpsElements}
            <button className='btn btn-primary m-3' onClick={addNewHG} disabled={!isEditable}>+ Add New Hotel Group</button>
        </div>);
}

export function HotelsPage() {
    const [loadingMessage, setLoadingMessage] = useState("");
    const [itinMeta, setItinMeta] = useState(null);   // holds user_id and itinerary_members
    const {session} = useAuthContext();
    const sessionUser = session?.user; // get user of current session
    const sessionUserId = sessionUser?.id; //get userId

    const [itin, setItin] = useState(null); //initialize itin to null

    const { id: itinDbId } = useParams(); //get the itinDbId from the URL

    const navigate = useNavigate();

    useEffect( () => {//FETCH ITIN
        fetchItin(itinDbId, setItin, setItinMeta, navigate, sessionUserId);
    }
    ,[itinDbId, sessionUserId, navigate]); //re-fetch the moment the itin id in url changes 
        //***(this is bcuz the component stays mounted even if u change url)

    useEffect(() => {//this is for realtime channel for itin
        // Initial fetch when the component mounts or itinDbId changes
        fetchItin(itinDbId, setItin, setItinMeta, navigate, sessionUserId);
    
        const channel = supabase.channel(`itins-${itinDbId}`);
        console.log(`[Realtime] Subscribing to itins-${itinDbId}`);
    
        channel
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'itins',
              filter: `id=eq.${itinDbId}`,
            },
            (payload) => {
              console.log('[Realtime] INSERT/UPDATE/DELETE itin', payload);
              fetchItin(itinDbId, setItin, setItinMeta, navigate, sessionUserId);
            }
          )
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'itinerary_members',
              filter: `itinerary_id=eq.${itinDbId}`,
            },
            (payload) => {
              console.log('[Realtime] INSERT/UPDATE/DELETE itin members', payload);
              fetchItin(itinDbId, setItin, setItinMeta, navigate, sessionUserId);
            }
          )
          .subscribe((status) => {
            console.log(`[Realtime] itins-${itinDbId} channel status:`, status);
          });
    
        // Cleanup function: This runs when hgId changes or component unmounts
        return () => {
          console.log(`[Cleanup] Removing itin channel for ${itinDbId}`);
          if (channel) {
            channel.unsubscribe();
          }
        };
      }, [itinDbId, sessionUserId, navigate]);
    
    const isEditable = (() => {
        if (!itinMeta || !sessionUserId) return false;
            const creatorId = itinMeta.user_id;
            const memberDetails = itinMeta.itinerary_members?.find(m => m.user_id == sessionUserId);
            if (sessionUserId === creatorId || (memberDetails && memberDetails.role === 'editor')) {
                console.log("YES EDITABLE");
                return true;
            }
            console.log("NO NOT EDITABLE");
            return false;
        })(); //determines whether page is editable or not
    
    const saveItinToDB = async (itin) => {//SAVES ITINERARY TO DATABASE
        try {
            await updateItineraryById(itinDbId, itin);
            setItin(itin);
            console.log('SAVED ITIN TO DB!');
        } catch (err) {
            console.error('Failed to update Itinerary...', err);
        }
    }
    
    

    return (
        <div className="hotel-background-image">
            <Header />
            <h1 className="text-primary" style={{ margin: "20px", marginTop: "80px", marginBottom: "40px" }}>
                🏨 Hotels
            </h1>
            <LoadingMessage loadingMessage={loadingMessage}/>
            {itin? (
                <>
                    <ItineraryInfo //THIS ALLOWS USER TO EDIT NAME AND START DATE OF ITIN
                        itin={itin}
                        onSave={saveItinToDB}
                        isEditable={isEditable}
                    />

                    <div className="custom-button-group">
                        <button className="custom-nav-btn activities-btn" onClick={() => navigate(`/activities/${itinDbId}`)}>
                            🎯 To Activities
                        </button>
                        <button className="custom-btn darkened-hotels-btn">
                            🏨 To Hotels
                        </button>
                        <button className="custom-nav-btn flights-btn" onClick={() => navigate(`/flights/${itinDbId}`)}>
                            🛫 To Flights
                        </button>
                        <button className="custom-nav-btn summary-btn" onClick={() => navigate(`/summary/${itinDbId}`)}>
                            📝 To Summary
                        </button>
                        <button className="custom-nav-btn hotels-home-btn" onClick={() => navigate('/')}>
                            🏡 Back To Home
                        </button>
                        {/* <AutoSaveButton itin={itin} saveToDB={saveToDB} /> */}
                    </div>

                    <HotelGroupsContent itin={itin} setItin={setItin} itinDbId={itinDbId} isEditable={isEditable} setLoadingMessage={setLoadingMessage}/>
                    <div className="custom-button-wrapper">
                        <button className='back-btn themed-button' onClick={()=>navigate('/')}>🏡 Back To Home</button>
                        {/* <button className='save-btn themed-button' onClick={()=>saveToDB(itin)}>💾 Save</button> */}
                    </div>
                </> 
            ) : <h2 className="text-secondary">Loading Hotels....</h2>}
        
        {/* <button onClick={() => {console.log("ALLCHANNELS", supabase.getChannels()); supabase.getChannels().forEach(c => console.log("CHANNEL", c.topic, c.state));}}>get channels</button> */}
            <div style={{height: "50px"}}/>
        </div>
    );
}