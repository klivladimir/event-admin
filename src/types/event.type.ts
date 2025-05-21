import { SubEventList } from './subEvent.type';
import { RaffleList } from './raffle.type';
import { DateTime } from 'luxon';
import { Prize } from './prize.type';

export type EventFormData = {
  id?: string;
  name: string;
  eventDate: DateTime | null;
  eventStartTime: string;
  eventEndTime: string;
  shortDescription: string;
  description: string;
  address: string;
  image: File | string | null;
  subEvents: SubEventList;
  raffles: RaffleList;
  showStatus?: 'past' | 'today' | 'next' | 'pending';
  winners?: Winner[];
  raffleStatus?: 'started' | 'waiting' | 'end';
  duration?: string;
};

export type Winner = {
  id: number;
  number: string;
  prize: Prize;
  user: User;
};

export type User = {
  id: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
};

export type EventList = EventFormData[];
