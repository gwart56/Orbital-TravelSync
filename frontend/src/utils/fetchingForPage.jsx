// import { useNavigate } from "react-router-dom";
import { loadItineraryRowById } from "../data/itinerary";

export function fetchItin(itinDbId, setItin, setItinMeta, navigate, sessionUserId) {
    const fetchF = async () => {
        try {
          const data = await loadItineraryRowById(itinDbId); // gives {id, user_id, itinerary_data, created_at, itinerary_members(ARRAY)}
          
          setItinMeta(data);

          const creatorId = data.user_id;
          const itinMembers = data.itinerary_members;
          const memberDetails = itinMembers.find(m => m.user_id == sessionUserId);

          console.log("session user", sessionUserId);
          console.log("itin user id", creatorId);

          if (sessionUserId !== creatorId && !memberDetails) {
            alert("You do not have permission to view this itinerary.");
            navigate('/');
            return;
          }

          const loadedItin = data.itinerary_data;
          setItin(loadedItin);
        } catch (err) {
          console.error("Failed to load itinerary", err);
        }
      }
      return fetchF();
}