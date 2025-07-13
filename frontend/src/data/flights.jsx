import { supabase } from "../lib/supabaseClient";
import { v4 as genId } from "uuid";

//-------------------------------------------------------
// Create a new flight object
export function newFlight({
  itineraryId,
  travelDayId = null, //optional?
  airline,
  flightNumber,
  departureAirport,
  arrivalAirport,
  departureCity,
  arrivalCity,
  departureTime, //INCLUDES DATE AND TIME
  arrivalTime , //INCLUDES DATE AND TIME
  terminal = '', //optional?
  gate = '', //optional?
  durationMinutes = null, //optional?
  seatNumber = '', //optional?
  notes = '', //optional?
  isReturn = false, // default false
  price = 0, // default price
}) {
  return {
    id: genId(),
    itineraryId,
    // travelDayId,
    airline,
    flightNumber,
    departureAirport,
    arrivalAirport,
    departureTime,
    arrivalTime,
    // departureCity,
    // arrivalCity,
    // terminal,
    // gate,
    // durationMinutes,
    seatNumber,
    // notes,
    isReturn,
    price,
  };
}

//-------------------------------------------------------
// ADD: Add 1 or more flights to Supabase
export async function addFlightsIntoDB(flights) {
  const { error } = await supabase
    .from('flights')
    .insert(flights);

  if (error) {
    console.error('Failed to store flights:', error);
    throw error;
  }
}

// CREATE: Creates and inserts a single flight object
export async function createNewFlight({itineraryId}) {
  const flight = newFlight({itineraryId});
  await addFlightsIntoDB([flight]);
  return flight;
}

// LOAD: Get all flights for a specific itinerary
export async function loadFlightsByItineraryId(itineraryId) {
  console.log("fetching from itindb", itineraryId);
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

// LOAD: Get flight by id
export async function loadFlightById(id) {
  const { data, error } = await supabase
    .from('flights')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

// UPDATE: Update a flight object by ID
export async function updateFlightById(id, updatedFlight) {
  const { data, error } = await supabase
    .from('flights')
    .update(updatedFlight)
    .eq('id', id)
    .select();

  if (error) throw error;

  console.log("Updated flight with ID:", id);
  return data[0];
}

// DELETE: Delete a flight by ID
export async function deleteFlightById(id) {
  const { error } = await supabase
    .from('flights')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Failed to delete flight:", error.message);
    throw error;
  }

  console.log("Successfully deleted flight with ID:", id);
}
