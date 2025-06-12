import { useEffect, useState } from "react";
import Header from "../components/Header";
import ItineraryInfo from "../components/ItineraryInfo";
import { useNavigate, useParams } from "react-router-dom";
import { loadItineraryById, updateItineraryById } from "../lib/supabaseItinerary";
import HotelContainer from "../components/HotelContainer";
import { addHotelToArr, deleteHotelFromArr, editHotelInArr } from "../data/hotel";
import { setItinHotels } from "../data/activity";

function HotelsContent({itin, setItin}) {
    const hotels = itin.hotels; //initialize hotels from itin

    const updateHotel = (targetId, updatedH) => {
        const newHotelArr = editHotelInArr(targetId, hotels, updatedH);
        setItin(prev => setItinHotels(prev, newHotelArr));
    }

    const deleteHotel = targetId => {
        const newHotelArr = deleteHotelFromArr(targetId, hotels);
        setItin(prev => setItinHotels(prev, newHotelArr));
    }

    const addNewHotel = () => {
        const newHotelArr = addHotelToArr(hotels);
        setItin(prev => setItinHotels(prev, newHotelArr));
        console.log("added new hotel");
    }

    const hotelsElements = hotels
        .map(h => (<HotelContainer
            key={h.id}
            hotel={h}
            onSave={updatedH => updateHotel(h.id, updatedH)}
            onDelete={deleteHotel}
        />));

    return (
        <>
        <div>
            {hotelsElements}
            <button className='btn btn-primary m-3' onClick={()=>addNewHotel()}>Add New Hotel</button>
        </div>
        </>
    );
}

export function HotelsPage() {
    const [itin, setItin] = useState(null); //initialize itin to null
    const { id: itinDbId } = useParams(); //get the itinDbId from the URL
    const navigate = useNavigate();

    useEffect( () => {
          const fetchItin = async () => {
            try {
              const loadedItin = await loadItineraryById(itinDbId); //wait to get itin class obj by id from supabase
              setItin(loadedItin);
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
                
  console.log(itin);
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
                    <HotelsContent itin={itin} setItin={setItin} />
                    <button className='btn btn-primary m-3' onClick={()=>saveToDB(itin)}>Save To Supabase</button>
                </>
            ) : <h2 className="text-secondary">Loading Hotels....</h2>}
            
        </>
    );
}