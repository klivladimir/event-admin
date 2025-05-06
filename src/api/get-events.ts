import axios from 'axios';
import { Event } from '../types';

// Get API base URL from environment variables or use default
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

/**
 * Fetches all events from the API
 * @returns Promise resolving to an array of Event objects
 */
export async function getEvents(): Promise<Event[]> {
  try {
    // Using the configurable base URL
    const response = await axios.get<Event[]>(`${API_BASE_URL}/api/events`);
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
}

/**
 * Fetches a single event by ID
 * @param id - The ID of the event to fetch
 * @returns Promise resolving to an Event object
 */
export async function getEventById(id: string): Promise<Event> {
  try {
    const response = await axios.get<Event>(`${API_BASE_URL}/api/events/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching event with ID ${id}:`, error);
    throw error;
  }
}
