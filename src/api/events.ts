import { firstValueFrom, map, catchError } from 'rxjs';
import {
  CreateEventRequest,
  CreateEventResponce,
  CreatePrizeRequest,
  CreatePrizeResponse,
  CreateRaffleRequest,
  CreateRaffleResponse,
  CreateSubEventRequest,
  CreateSubEventResponse,
  EventFormData,
  SuccessResponse,
  UpdateRaffleResponse,
  UpdateSubEventRequest,
  UpdateSubEventResponse,
} from '../types';
import { ajax } from 'rxjs/ajax';
import { jsonToFormData } from './helpers';
import { handleAuthError } from './errorHandler';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getEvents(): Promise<CreateEventResponce[]> {
  const res = ajax<SuccessResponse<CreateEventResponce[]>>({
    url: `${API_BASE_URL}/list`,
    method: 'GET',
    headers: getHeaders(),
  }).pipe(
    map(response => response.response.data),
    catchError(handleAuthError)
  );

  return firstValueFrom(res);
}

export async function getEventById(id: number): Promise<CreateEventResponce> {
  const res = ajax<SuccessResponse<CreateEventResponce>>({
    url: `${API_BASE_URL}/view/${id}`,
    method: 'GET',
    headers: getHeaders(),
  }).pipe(
    map(response => response.response.data),
    catchError(handleAuthError)
  );

  return firstValueFrom(res);
}

export async function createOrUpdateEvent(eventData: CreateEventRequest) {
  const id = localStorage.getItem('currentEventId');
  if (id) {
    return updateEvent(eventData, id);
  } else {
    return createEvent(eventData);
  }
}

export async function createEvent(eventData: CreateEventRequest): Promise<EventFormData> {
  const formData = jsonToFormData(eventData);

  const res = ajax<SuccessResponse<EventFormData>>({
    url: `${API_BASE_URL}/create`,
    method: 'POST',
    body: formData,
    headers: getHeaders(),
  }).pipe(
    map(response => {
      if (response.response.data.id) {
        localStorage.setItem('currentEventId', response.response.data.id);
      }
      return response.response.data;
    }),
    catchError(handleAuthError)
  );

  return firstValueFrom(res);
}

export async function updateEvent(
  eventData: CreateEventRequest,
  id: string
): Promise<EventFormData> {
  const formData = jsonToFormData(eventData);

  const res = ajax<SuccessResponse<EventFormData>>({
    url: `${API_BASE_URL}/update/${id}`,
    method: 'POST',
    body: formData,
    headers: getHeaders(),
  }).pipe(
    map(response => {
      if (response.response.data.id) {
        localStorage.setItem('currentEventId', response.response.data.id);
      }
      return response.response.data;
    }),
    catchError(handleAuthError)
  );

  return firstValueFrom(res);
}

export async function saveEvent(id: number): Promise<unknown> {
  const res = ajax({
    url: `${API_BASE_URL}/save/${id}`,
    method: 'POST',
    headers: getHeaders(),
  }).pipe(catchError(handleAuthError));

  return firstValueFrom(res);
}

export async function startEvent(id: number): Promise<unknown> {
  const res = ajax({
    url: `${API_BASE_URL}/start/${id}`,
    method: 'POST',
    headers: getHeaders(),
  }).pipe(catchError(handleAuthError));

  return firstValueFrom(res);
}

export async function createSubEvent(
  subEventData: CreateSubEventRequest
): Promise<SuccessResponse<CreateSubEventResponse>> {
  const formData = jsonToFormData(subEventData);

  const res = ajax<SuccessResponse<CreateSubEventResponse>>({
    url: `${API_BASE_URL}/${localStorage.currentEventId}/sub-event/create`,
    method: 'POST',
    body: formData,
    headers: getHeaders(),
  }).pipe(
    map(response => response.response),
    catchError(handleAuthError)
  );

  return firstValueFrom(res);
}

export async function updateSubEvent(
  subEventId: number,
  subEventData: UpdateSubEventRequest
): Promise<UpdateSubEventResponse> {
  const resBody = {
    name: subEventData.name,
    startTime: subEventData.startTime,
    endTime: subEventData.endTime,
  };
  const formData = jsonToFormData(resBody);

  const res = ajax<SuccessResponse<UpdateSubEventResponse>>({
    url: `${API_BASE_URL}/${localStorage.currentEventId}/sub-event/update/${subEventId}`,
    method: 'POST',
    body: formData,
    headers: getHeaders(),
  }).pipe(
    map(response => response.response.data),
    catchError(handleAuthError)
  );

  return firstValueFrom(res);
}

export async function deleteSubEvent(subEventId: unknown): Promise<SuccessResponse<void>> {
  const res = ajax<SuccessResponse<void>>({
    url: `${API_BASE_URL}/${localStorage.currentEventId}/sub-event/delete/${subEventId}`,
    method: 'POST',
    headers: getHeaders(),
  }).pipe(
    map(response => response.response),
    catchError(handleAuthError)
  );

  return firstValueFrom(res);
}

export async function createRaffle(
  raffleData: CreateRaffleRequest
): Promise<SuccessResponse<CreateRaffleResponse>> {
  const formData = jsonToFormData(raffleData);

  const res = ajax<SuccessResponse<CreateRaffleResponse>>({
    url: `${API_BASE_URL}/${localStorage.currentEventId}/raffle/create`,
    method: 'POST',
    body: formData,
    headers: getHeaders(),
  }).pipe(
    map(response => response.response),
    catchError(handleAuthError)
  );

  return firstValueFrom(res);
}

export async function updateRaffle(
  raffleId: number,
  raffleData: CreateRaffleRequest
): Promise<UpdateRaffleResponse> {
  const resBody = {
    name: raffleData.name,
    startTime: raffleData.startTime,
    endTime: raffleData.endTime,
    terms: raffleData.terms,
    duration: raffleData.duration,
  };
  const formData = jsonToFormData(resBody);

  const res = ajax<SuccessResponse<UpdateRaffleResponse>>({
    url: `${API_BASE_URL}/${localStorage.currentEventId}/raffle/update/${raffleId}`,
    method: 'POST',
    body: formData,
    headers: getHeaders(),
  }).pipe(
    map(response => response.response.data),
    catchError(handleAuthError)
  );

  return firstValueFrom(res);
}

export async function deleteRaffle(raffleId: unknown): Promise<SuccessResponse<void>> {
  const res = ajax<SuccessResponse<void>>({
    url: `${API_BASE_URL}/${localStorage.currentEventId}/raffle/delete/${raffleId}`,
    method: 'POST',
    headers: getHeaders(),
  }).pipe(
    map(response => response.response),
    catchError(handleAuthError)
  );

  return firstValueFrom(res);
}

export async function startRaffle(eventId: number): Promise<unknown> {
  const res = ajax({
    url: `${API_BASE_URL}/${eventId}/raffle/start`,
    method: 'POST',
    headers: getHeaders(),
  }).pipe(catchError(handleAuthError));

  return firstValueFrom(res);
}

export async function createPrize(
  raffleId: number,
  prizeData: CreatePrizeRequest
): Promise<SuccessResponse<CreatePrizeResponse>> {
  const formData = jsonToFormData(prizeData);

  const res = ajax<SuccessResponse<CreatePrizeResponse>>({
    url: `${API_BASE_URL}/${localStorage.currentEventId}/raffle/${raffleId}/prize/create`,
    method: 'POST',
    body: formData,
    headers: getHeaders(),
  }).pipe(
    map(response => response.response),
    catchError(handleAuthError)
  );

  return firstValueFrom(res);
}

export async function updatePrize(
  raffleId: number,
  prizeId: string,
  prizeData: { name: string; image: File | null }
): Promise<CreatePrizeResponse> {
  const resBody = {
    name: prizeData.name,
    image: prizeData.image,
  };
  const formData = jsonToFormData(resBody);

  const res = ajax<SuccessResponse<CreatePrizeResponse>>({
    url: `${API_BASE_URL}/${localStorage.currentEventId}/raffle/${raffleId}/prize/${prizeId}/update`,
    method: 'POST',
    body: formData,
    headers: getHeaders(),
  }).pipe(
    map(response => response.response.data),
    catchError(handleAuthError)
  );

  return firstValueFrom(res);
}

export async function deletePrize(
  raffleId: unknown,
  prizeId: unknown
): Promise<SuccessResponse<void>> {
  const res = ajax<SuccessResponse<void>>({
    url: `${API_BASE_URL}/${localStorage.currentEventId}/raffle/${raffleId}/prize/${prizeId}/delete`,
    method: 'POST',
    headers: getHeaders(),
  }).pipe(
    map(response => response.response),
    catchError(handleAuthError)
  );

  return firstValueFrom(res);
}

const getHeaders = () => {
  return {
    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
  };
};
