import axios from 'axios';
import { CreateEventRequest, EventFormData, EventList, SuccessResponse } from '../types';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const storedToken = localStorage.getItem('authToken');
if (storedToken) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
}

export async function getEvents(): Promise<EventFormData[]> {
  try {
    const response = await axios.get<SuccessResponse<EventList>>(`${API_BASE_URL}/list`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
}

export async function getEventById(id: string): Promise<EventFormData> {
  try {
    const response = await axios.get<EventFormData>(`${API_BASE_URL}/api/events/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching event with ID ${id}:`, error);
    throw error;
  }
}

export async function createEvent(eventData: CreateEventRequest): Promise<EventFormData> {
  try {
    console.log(`${API_BASE_URL}/create`);
    const response = await axios.post<SuccessResponse<EventFormData>>(
      `${API_BASE_URL}/create`,
      eventData,
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
