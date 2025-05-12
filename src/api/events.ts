import axios from 'axios';
import { Event, EventList } from '../types';
import { SuccessResponse } from '../types/api.type';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const storedToken = localStorage.getItem('authToken');
if (storedToken) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
}

export async function getEvents(): Promise<Event[]> {
  try {
    const response = await axios.get<SuccessResponse<EventList>>(`${API_BASE_URL}/list`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
}

export async function getEventById(id: string): Promise<Event> {
  try {
    const response = await axios.get<Event>(`${API_BASE_URL}/api/events/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching event with ID ${id}:`, error);
    throw error;
  }
}

export interface CreateEventData {
  image: File | null;
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  shortDescription: string;
  description: string;
  address: string;
}

export async function createEvent(eventData: CreateEventData): Promise<Event> {
  try {
    const formData = new FormData();

    // Add all event data to form data
    Object.keys(eventData).forEach(key => {
      if (eventData[key] !== null) {
        formData.append(key, eventData[key]);
      }
    });

    const response = await axios.post<SuccessResponse<Event>>(
      `${API_BASE_URL}/api/admin/event/create`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data.data;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
}
