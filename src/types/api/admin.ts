import { Activity } from '../activity.type';
import { EventList } from '../event.type';
import { Prize } from '../prize.type';
import { Raffle } from '../raffle.type';
import { GenericAdminActionResponse } from './common';

export type CreateEventRequest = {
  image: File;
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  shortDescription: string;
  description: string;
  address: string;
};

export type CreateEventResponce = {
  id: number;
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  shortDescription: string;
  description: string;
  address: string;
  subEvents: Activity[];
  raffles: Raffle[];
  status: number;
};

export interface AdminEventListRequestParams {
  type: 'pending' | 'past' | 'next' | 'today';
}

export interface AdminEventListResponse {
  items: EventList;
}

// --- Sub Event (Activity) Management ---
export interface CreateSubEventRequest {
  // eventId is a path parameter
  name: string;
  startTime: string;
  endTime: string;
}

export interface CreateSubEventResponse extends Activity {} // Assuming the created sub-event/activity is returned

export interface UpdateSubEventRequest {
  name: string;
  startTime: string;
  endTime: string;
}

export interface UpdateSubEventResponse extends Activity {} // Assuming the updated sub-event/activity is returned

export interface DeleteSubEventResponse extends GenericAdminActionResponse {}

// --- Raffle Management ---
export interface CreateRaffleRequest {
  // eventId is a path parameter
  name: string;
  startTime: string; // HH:MM:SS
  endTime: string; // HH:MM:SS
  terms: string;
  prizes?: Array<{ name: string; image: File }>; // Optional based on Postman
}

export interface CreateRaffleResponse extends Raffle {} // Assuming the created raffle is returned

export interface UpdateRaffleRequest {
  // eventId and raffleId are path parameters
  name: string;
  startTime: string; // HH:MM:SS
  endTime: string; // HH:MM:SS
  terms: string;
}

export interface UpdateRaffleResponse extends Raffle {} // Assuming the updated raffle is returned

export interface DeleteRaffleResponse extends GenericAdminActionResponse {}

export interface StartRaffleResponse extends GenericAdminActionResponse {}

// --- Prize Management ---
export interface CreatePrizeRequest {
  // eventId and raffleId are path parameters
  name: string;
  image: File;
}

export interface CreatePrizeResponse extends Prize {} // Assuming the created prize is returned

export interface UpdatePrizeRequest {
  // eventId, raffleId, and prizeId are path parameters
  name: string;
  image: File; // Or string if image can be unchanged or URL
}

export interface UpdatePrizeResponse extends Prize {} // Assuming the updated prize is returned

export interface DeletePrizeResponse extends GenericAdminActionResponse {}

// --- Image Retrieve ---
export interface ImageRetrieveRequestParams {
  type: 'event' | 'prize';
  name: string;
}
// Response for ImageRetrieve is typically a Blob/File stream, not JSON.
// No specific JSON response type needed here unless the API wraps it.
