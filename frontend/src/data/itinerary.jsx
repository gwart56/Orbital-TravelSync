import {v4 as genId} from "uuid";
import dayjs from 'dayjs'; // handles dates
//ITINERARY DATA TYPE
// {
//     itineraryId;
//     name;
//     travelDaysId;
//     startDate;
//     hotelGrps;
// }

function newItinerary(name, travelDaysId, startDate, hotelGrpsId) {
    return {
        name, 
        travelDaysId, 
        startDate, 
        hotelGrpsId
    };
}

