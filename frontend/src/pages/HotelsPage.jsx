import { useEffect, useState } from "react";
import Header from "../components/Header/Header";
import ItineraryInfo from "../components/ItineraryComponents/ItineraryInfo";
import { useNavigate, useParams } from "react-router-dom";
import { loadItineraryById, updateItineraryById } from "../lib/supabaseItinerary";
import HotelContainer from "../components/HotelPageContent/HotelContainer";
import { addHGToArr, addHotelToArr, deleteHGFromArr, deleteHotelFromArr, doesHGOverlap, editHotelInArr, getAllConfirmedHotelsFromArr } from "../data/hotel";
import { setItinHotels } from "../data/activity";
import HGInfo from "../components/HotelPageContent/HotelGroupInfo";
import ConfirmedHotelGroup from "../components/HotelPageContent/ConfirmedHotelGroup";
import { AutoSaveButton } from "../components/Misc/AutoSaver";
import "./HotelsPage.css";
import HotelComparator from "../components/GoogleMapsComponents/HotelComparator";
import ConfirmModal from "../components/Misc/ConfirmModal";

function HotelGrpContent({hotelGrp, hgId, itin, setItin, deleteHG}) { //CONTENT FOR ONE HOTEL GROUP
    const hotels = hotelGrp?.hotels; 
    const hgName = hotelGrp?.name;
    const [isComparingLocations, setIsComparingLocations] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const getConfirmedHotel = () => {
        //THIS RETURNS THE CONFIRMED HOTEL IN A HOTEL GROUP (ASSUMES ONLY 1 CONFIRMED HOTEL)
        //RETURNS UNDEFINED IF NO CONFIRMED HOTEL
        return hotels.find(h => h.isConfirmed == true);
    }
    
    const [confirmedHotel, setConfirmedHotel] = useState(getConfirmedHotel);

    const handleConfirmClick = (targetHotel) => {
        // Guard clause for missing hotel name
        if (!targetHotel.name || targetHotel.name.trim() === '') {
            alert("Hotel name is required before confirming.");
            return;
        }

        // Check if hotel's check-in date is before Hotel Group's start date
        if (itin.startDate && hotelGrp.startDate) {
            const itinStartDate = dayjs(itin.startDate, 'DD-MM-YYYY');
            const groupStartDate = dayjs(hotelGrp.startDate, 'DD-MM-YYYY');
            if (groupStartDate.isBefore(itinStartDate)) {
                alert("Hotel check-in date cannot be earlier than the travel start date.");
                return;
            }
        }

        // Prevent overlapping check-in/check-out
        const confirmedHotelsArr = getAllConfirmedHotelsFromArr(itin.hotelGrps);
        if (doesHGOverlap(hotelGrp, confirmedHotelsArr)) {
            return;
        }

        // Mark as confirmed
        const updatedHotel = { ...targetHotel, isConfirmed: true };

        updateHotel(targetHotel.id, updatedHotel);
        setConfirmedHotel(updatedHotel);
    }

    const updateHotel = (targetId, updatedH) => {
        const newHotelArr = editHotelInArr(targetId, hotels, updatedH);
        const newHotelGrps = itin.hotelGrps.map(hg => hg.id == hgId ? {...hg, hotels: newHotelArr} : hg);
        setItin(prev => setItinHotels(prev, newHotelGrps));
    }

    const deleteHotel = targetId => {
        const newHotelArr = deleteHotelFromArr(targetId, hotels);
        const newHotelGrps = itin.hotelGrps.map(hg => hg.id == hgId ? {...hg, hotels: newHotelArr} : hg);
        setItin(prev => setItinHotels(prev, newHotelGrps));
    }

    const addNewHotel = () => {
        const newHotelArr = addHotelToArr(hotels);
        const newHotelGrps = itin.hotelGrps.map(hg => hg.id == hgId ? {...hg, hotels: newHotelArr} : hg);
        setItin(prev => setItinHotels(prev, newHotelGrps));
        // console.log("added new hotel");
    }

    const renameHG = (newName) => {
        const newHotelGrps = itin.hotelGrps.map(hg => hg.id == hgId ? {...hg, name: newName} : hg);
        setItin(prev => setItinHotels(prev, newHotelGrps));
    }

    const setStartHG = (newStartDate) => {
        const newHotelGrps = itin.hotelGrps.map(hg => hg.id == hgId ? {...hg, startDate: newStartDate} : hg);
        setItin(prev => setItinHotels(prev, newHotelGrps));
    }

    const setEndHG = (newEndDate) => {
        const newHotelGrps = itin.hotelGrps.map(hg => hg.id == hgId ? {...hg, endDate: newEndDate} : hg);
        setItin(prev => setItinHotels(prev, newHotelGrps));
    }

    const hotelsElements = hotels.length==0
        ? (
            <div className="no-hotels-warning text-center fade-in">
            <h4>🏨 No Hotels in this Hotel Group</h4>
            <p>
                Please click <strong>"Add New Hotel To Group"</strong> below to add new ones.
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
                    <button className='btn btn-primary m-3' onClick={addNewHotel}>+ Add New Hotel</button>
                    <button className='btn btn-success m-3' 
                        onClick={()=>{setIsComparingLocations(true)}}
                        disabled={hotels.length<=0}
                        >Compare Locations</button>
                    <button className='btn btn-danger m-3' onClick={()=>setDeleteModalOpen(true)}>Delete Hotel Group</button>
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

function HotelGroupsContent({itin, setItin}) {
    const hotelGroupsArr = itin.hotelGrps;
    const hotelGrpsElements = hotelGroupsArr.length==0
        ? (
            <div className="hotel-group-warning text-center fade-in">
                <h4>🏨 No Hotel Groups Found</h4>
                <p>
                    Get started by clicking <strong>"Add New Hotel Group"</strong> below to begin planning your stay!
                </p>
            </div>
)
        :hotelGroupsArr.map(hg => (
        <div className="hg-content" key={hg.id}>
            <HotelGrpContent
                hotelGrp={hg}
                itin={itin}
                setItin={setItin}
                hgId={hg.id}
                deleteHG={() => deleteHG(hg.id)}
            />
        </div>
    ));

    const addNewHG = () => {
        const newHotelGrps = addHGToArr(hotelGroupsArr);
        setItin(prev => setItinHotels(prev, newHotelGrps));
        console.log("added new hotel grp");
    }

    const deleteHG = (hgId) => {
        // const confirmDelete = window.confirm("Are you sure you want to delete this Hotel Group?");
        // if (confirmDelete) {                               
            const newHotelGrps = deleteHGFromArr(hgId, hotelGroupsArr);
            setItin(prev => setItinHotels(prev, newHotelGrps));
            console.log("deleted hotel grp");
        // }
    }

    return (
        <div className="hg-content container">
            {hotelGrpsElements}
            <button className='btn btn-primary m-3' onClick={addNewHG}>+ Add New Hotel Group</button>
        </div>);
}

export function HotelsPage() {
    const [itin, setItin] = useState(null); //initialize itin to null
    const { id: itinDbId } = useParams(); //get the itinDbId from the URL
    const navigate = useNavigate();

    useEffect( () => {
          const fetchItin = async () => {
            try {
              loadItineraryById(itinDbId).then((loadedItin) => setItin(loadedItin));
            } catch (err) {
              console.error("Failed to load itinerary", err);
            }
          }
          fetchItin();
        }
        ,[itinDbId]); //re-fetch the moment the itin id in url changes 
        //***(this is bcuz the component stays mounted even if u change url)
    
    const saveToDB = async (itin) => {
            try {
                await updateItineraryById(itinDbId, itin);
                console.log(itin);
            } catch (err) {
                console.error('Failed to update Itinerary...', err);
            }
        };
    
    

    return (
        <div className="hotel-background-image">
            <Header />
            <h1 className="text-primary" style={{ margin: "20px", marginTop: "80px", marginBottom: "40px" }}>
                ✈️TravelSync
            </h1>

            {itin? (
                <>
                    <ItineraryInfo itin={itin} setItin={setItin} />

                    <div className="custom-button-group">
                        <button className="custom-nav-btn activities-btn" onClick={() => navigate(`/activities/${itinDbId}`)}>
                            🎯 To Activities
                        </button>
                        <button className="custom-nav-btn hotels-home-btn" onClick={() => navigate('/')}>
                            🏡 Back To Home
                        </button>
                        <AutoSaveButton itin={itin} saveToDB={saveToDB} />
                    </div>

                    <HotelGroupsContent itin={itin} setItin={setItin} />
                    <div className="custom-button-wrapper">
                        <button className='back-btn themed-button' onClick={()=>navigate('/')}>🏡 Back To Home</button>
                        <button className='save-btn themed-button' onClick={()=>saveToDB(itin)}>💾 Save</button>
                    </div>
                </> 
            ) : <h2 className="text-secondary">Loading Hotels....</h2>}
            
        </div>
    );
}