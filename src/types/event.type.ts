import { DateTime } from 'luxon';
import { ActivityList } from './activity.type';
import { RaffleList } from './raffle.type';

export type EventFormData = {
  id?: string;
  name: string;
  eventDate: DateTime | null;
  eventTime: string;
  endTime: string;
  date: string | null;
  shortDescription: string;
  description: string;
  address: string;
  image: File | null;
  activities: ActivityList;
  raffles: RaffleList;
  status?: 'past' | 'today' | 'next' | 'pending';
};

export type EventList = EventFormData[];
