import { useEffect, useState } from "react";
import Header from "../components/Header";
import ItineraryInfo from "../components/ItineraryInfo";
import { useNavigate, useParams } from "react-router-dom";
import { loadItineraryById, updateItineraryById } from "../lib/supabaseItinerary";
import HotelContainer from "../components/HotelContainer";
import { addHGToArr, addHotelToArr, deleteHotelFromArr, editHotelInArr } from "../data/hotel";
import { setItinHotels } from "../data/activity";
import HGInfo from "../components/HotelGroupInfo";

function HotelsContent({hotelGrp, hgId, itin, setItin}) {
    const hotels = hotelGrp?.hotels; 
    const hgName = hotelGrp?.name;

    //todo: add a state to track the confirmed hotel
    const [confirmedHotel, setConfirmedHotel] = useState(false);
    const handleConfirmClick = (targetHotel) => {
        // Mark hotel as confirmed in the data
        const updatedHotel = { ...targetHotel, isConfirmed: true };
        updateHotel(targetHotel.id, updatedHotel);
        // Set this hotel as confirmed for display
        setConfirmedHotel(updatedHotel);
    }

    const updateHotel = (targetId, updatedH) => {
        const newHotelArr = editHotelInArr(targetId, hotels, updatedH);
        const newHotelGrps = itin.hotelGrps.map(hg => hg.id == hgId ? {id: hgId, name: hgName, hotels: newHotelArr} : hg);
        setItin(prev => setItinHotels(prev, newHotelGrps));
    }

    const deleteHotel = targetId => {
        const newHotelArr = deleteHotelFromArr(targetId, hotels);
        const newHotelGrps = itin.hotelGrps.map(hg => hg.id == hgId ? {id: hgId, name: hgName, hotels: newHotelArr} : hg);
        setItin(prev => setItinHotels(prev, newHotelGrps));
    }

    const addNewHotel = () => {
        const newHotelArr = addHotelToArr(hotels);
        const newHotelGrps = itin.hotelGrps.map(hg => hg.id == hgId ? {id: hgId, name: hgName, hotels: newHotelArr} : hg);
        setItin(prev => setItinHotels(prev, newHotelGrps));
        // console.log("added new hotel");
    }

    const renameHG = (newName) => {
        const newHotelGrps = itin.hotelGrps.map(hg => hg.id == hgId ? {id: hgId, name: newName, hotels: hotels} : hg);
        setItin(prev => setItinHotels(prev, newHotelGrps));
    }

    const hotelsElements = hotels
        .map(h => (
        <div>
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
            <div className="m-5 border rounded p-3">               
                <HGInfo hg={hotelGrp} renameHG={renameHG}/>
                    {confirmedHotel ? (
                    <div className="d-flex flex-column gap-2">

                        <div className="d-flex align-items-center">
                        <strong className="me-1" style={{ minWidth: "50px" }}>Name:</strong>
                        <span
                            className="text-truncate"
                            style={{
                            maxWidth: "200px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap"
                            }}
                            title={confirmedHotel.name}
                        >
                            {confirmedHotel.name}
                        </span>
                        </div>

                        <div className="d-flex align-items-center">
                        <strong className="me-1" style={{ minWidth: "50px" }}>Price:</strong>
                        <span
                            className="text-truncate"
                            style={{
                            maxWidth: "100px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap"
                            }}
                            title={confirmedHotel.price}
                        >
                            {confirmedHotel.price}
                        </span>
                        </div>
                        
                        <div className="d-flex align-items-center">
                        <strong className="me-1" style={{ minWidth: "50px" }}>Address:</strong>
                        <span
                            className="text-truncate"
                            style={{
                            maxWidth: "400px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap"
                            }}
                            title={confirmedHotel.address}
                        >
                            {confirmedHotel.address}
                        </span>
                        </div>

                        <div className="d-flex align-items-center">
                        <strong className="me-1" style={{ minWidth: "50px" }}>Check-in Time:</strong>
                        <span
                            className="text-truncate"
                            style={{
                            maxWidth: "100px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap"
                            }}
                            title={confirmedHotel.checkInTime}
                        >
                            {confirmedHotel.checkInTime}
                        </span>
                        </div>

                        <div className="d-flex align-items-center">
                        <strong className="me-1" style={{ minWidth: "50px" }}>Check-out Time:</strong>
                        <span
                            className="text-truncate"
                            style={{
                            maxWidth: "100px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap"
                            }}
                            title={confirmedHotel.checkOutTime}
                        >
                            {confirmedHotel.checkOutTime}
                        </span>
                        </div>

                        {/* TODO: add an edit button and also allow user to view previous hotels*/}
                        <div className="d-flex gap-2 m-3">
                            <button
                                className="btn btn-outline-primary btn-sm text-truncate"
                                style={{
                                maxWidth: "200px",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap"
                                }}
                                onClick={() => {
                                if (confirmedHotel.link) {
                                    window.open(confirmedHotel.link, "_blank", "noopener,noreferrer");
                                }
                                }}
                                title={confirmedHotel.link || "No link available"}
                                disabled={!confirmedHotel.link}
                            >
                                Visit Site
                            </button>

                            <button
                                className="btn btn-secondary"
                                onClick={() => {
                                const updatedHotel = { ...confirmedHotel, isConfirmed: false };
                                updateHotel(confirmedHotel.id, updatedHotel);
                                setConfirmedHotel(false);
                                }}
                            >
                                Unconfirm Hotel
                            </button>
                        </div>

                    {/* Todo: allow page to spawn with confirmed hotel */}
                    </div>
                    ) : (
                    <>
                        {hotelsElements}
                        <button className='btn btn-primary m-3' onClick={addNewHotel}>Add New Hotel</button>
                    </>
                    )} </div>
        </>
    );
}

function HotelGroupsContent({itin, setItin}) {
    const hotelGroupsArr = itin.hotelGrps;
    const hotelGrpsElements = hotelGroupsArr.map(hg => (
        <div className="hg-content" key={hg.id}>
            <HotelsContent
                hotelGrp={hg}
                itin={itin}
                setItin={setItin}
                hgId={hg.id}
            />
        </div>
    ));

    const addNewHG = () => {
        const newHotelGrps = addHGToArr(hotelGroupsArr);
        setItin(prev => setItinHotels(prev, newHotelGrps));
        console.log("added new hotel grp");
    }

    return (
        <div className="hg-content container">
            {hotelGrpsElements}
            <button className='btn btn-primary m-3' onClick={addNewHG}>Add New Hotel Group</button>
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
            } catch (err) {
                console.error('Failed to update Itinerary...', err);
            }
        };
    
    

    return (
        <>
            <Header />
            <h1 className="text-primary" style={{margin: "20px", marginTop:"80px"}}>TravelSync</h1>
            {itin? (
                <>
                    <ItineraryInfo itin={itin} setItin={setItin} />
                    <button className='btn btn-secondary m-3' onClick={()=>navigate(`/activities/${itinDbId}`)}>Activities</button>
                    <HotelGroupsContent itin={itin} setItin={setItin} />
                    <button className='btn btn-primary m-3' onClick={()=>saveToDB(itin)}>Save To Supabase</button>
                    <button className='btn btn-secondary m-3' onClick={()=>navigate('/')}>Back To Home</button>
                </> 
            ) : <h2 className="text-secondary">Loading Hotels....</h2>}
            
        </>
    );
}