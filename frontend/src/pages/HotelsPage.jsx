import { useEffect, useState } from "react";
import Header from "../components/Header";
import ItineraryInfo from "../components/ItineraryInfo";
import { useNavigate, useParams } from "react-router-dom";
import { loadItineraryById, updateItineraryById } from "../lib/supabaseItinerary";
import HotelContainer from "../components/HotelContainer";
import { addHGToArr, addHotelToArr, deleteHGFromArr, deleteHotelFromArr, editHotelInArr } from "../data/hotel";
import { setItinHotels } from "../data/activity";
import HGInfo from "../components/HotelGroupInfo";
import ConfirmedHotelGroup from "../components/ConfirmedHotelGroup";

function HotelGrpContent({hotelGrp, hgId, itin, setItin, deleteHG}) { //CONTENT FOR ONE HOTEL GROUP
    const hotels = hotelGrp?.hotels; 
    const hgName = hotelGrp?.name;

    const getConfirmedHotel = () => {
        //THIS RETURNS THE CONFIRMED HOTEL IN A HOTEL GROUP (ASSUMES ONLY 1 CONFIRMED HOTEL)
        //RETURNS UNDEFINED IF NO CONFIRMED HOTEL
        return hotels.find(h => h.isConfirmed == true);
    }
    
    const [confirmedHotel, setConfirmedHotel] = useState(getConfirmedHotel);
    const handleConfirmClick = (targetHotel) => {
        // Mark hotel as confirmed in the data
        const updatedHotel = { ...targetHotel, isConfirmed: true };
        updateHotel(targetHotel.id, updatedHotel);
        // Set this hotel as confirmed for display
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
                <HGInfo hg={hotelGrp} renameHG={renameHG} setEndHG={setEndHG} setStartHG={setStartHG}/>
                {confirmedHotel ? (
                    <ConfirmedHotelGroup //THIS CONTAINER ONLY APPEARS WHEN THERS CONFIRMED HOTEL
                        confirmedHotel={confirmedHotel}
                        updateHotel={updateHotel}
                        setConfirmedHotel={setConfirmedHotel}
                    />
                ) : (//THIS IS FOR UNCONFIRMED HOTELS, 
                <> 
                    {hotelsElements}
                    <button className='btn btn-primary m-3' onClick={addNewHotel}>Add New Hotel To Group</button>
                    <button className='btn btn-danger m-3' onClick={deleteHG}>Delete Hotel Group</button>
                </>
                )} 
            </div>
        </>
    );
}

function HotelGroupsContent({itin, setItin}) {
    const hotelGroupsArr = itin.hotelGrps;
    const hotelGrpsElements = hotelGroupsArr.map(hg => (
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
        const confirmDelete = window.confirm("Are you sure you want to delete this Hotel Group?");
        if (confirmDelete) {                               
            const newHotelGrps = deleteHGFromArr(hgId, hotelGroupsArr);
            setItin(prev => setItinHotels(prev, newHotelGrps));
            console.log("deleted hotel grp");
        }
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
                console.log(itin);
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
                    <button className='btn btn-secondary m-3' onClick={()=>navigate(`/activities/${itinDbId}`)}>To Activities</button>
                    <HotelGroupsContent itin={itin} setItin={setItin} />
                    <button className='btn btn-primary m-3' onClick={()=>saveToDB(itin)}>Save To Supabase</button>
                    <button className='btn btn-secondary m-3' onClick={()=>navigate('/')}>Back To Home</button>
                </> 
            ) : <h2 className="text-secondary">Loading Hotels....</h2>}
            
        </>
    );
}