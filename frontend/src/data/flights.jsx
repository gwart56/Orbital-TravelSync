import { supabase } from "../lib/supabaseClient";
import { v4 as genId } from "uuid";

//-------------------------------------------------------
// Create a new flight object
function newFlight({
  itineraryId,
  travelDayId = null, //optional?
  airline,
  flightNumber,
  departureAirport,
  arrivalAirport,
  departureCity,
  arrivalCity,
  departureTime, //INCLUDES DATE AND TIME
  arrivalTime, //INCLUDES DATE AND TIME
  terminal = '', //optional?
  gate = '', //optional?
  durationMinutes = null, //optional?
  seatNumber = '', //optional?
  notes = '' //optional?
}) {
  return {
    flightId: genId(),
    itineraryId,
    travelDayId,
    airline,
    flightNumber,
    departureAirport,
    arrivalAirport,
    departureCity,
    arrivalCity,
    departureTime,
    arrivalTime,
    terminal,
    gate,
    durationMinutes,
    seatNumber,
    notes
  };
}

//-------------------------------------------------------
// ADD: Add 1 or more flights to Supabase
async function addFlightsIntoDB(flights) {
  const { error } = await supabase
    .from('flights')
    .insert(flights);

  if (error) {
    console.error('Failed to store flights:', error);
    throw error;
  }
}

// CREATE: Creates and inserts a single flight object
export async function createNewFlight(itineraryId) {
  const flight = newFlight({itineraryId});
  await addFlightsIntoDB([flight]);
  return flight;
}

// LOAD: Get all flights for a specific itinerary
export async function loadFlightsByItineraryId(itineraryId) {
  const { data, error } = await supabase
    .from('flights')
    .select('*')
    .eq('itineraryId', itineraryId)
    .order('departureTime', { ascending: true });

  if (error) {
    console.error('Error fetching flights:', error);
    return [];
  }

  return data;
}

// LOAD: Get all flights for a specific travel day (MAY OR MAY NOT USE LTR IDK)
export async function loadFlightsByTravelDayId(travelDayId) {
  const { data, error } = await supabase
    .from('flights')
    .select('*')
    .eq('travelDayId', travelDayId)
    .order('departureTime', { ascending: true });

  if (error) {
    console.error('Error fetching flights for travel day:', error);
    return [];
  }

  return data;
}

// LOAD: Get flight by flightId
export async function loadFlightById(flightId) {
  const { data, error } = await supabase
    .from('flights')
    .select('*')
    .eq('flightId', flightId)
    .single();

  if (error) throw error;
  return data;
}

// UPDATE: Update a flight object by ID
export async function updateFlightById(flightId, updatedFlight) {
  const { data, error } = await supabase
    .from('flights')
    .update(updatedFlight)
    .eq('flightId', flightId)
    .select();

  if (error) throw error;

  console.log("Updated flight with ID:", flightId);
  return data[0];
}

// DELETE: Delete a flight by ID
export async function deleteFlightById(flightId) {
  const { error } = await supabase
    .from('flights')
    .delete()
    .eq('flightId', flightId);

  if (error) {
    console.error("Failed to delete flight:", error.message);
    throw error;
  }

  console.log("Successfully deleted flight with ID:", flightId);
}
