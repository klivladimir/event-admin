import { DateTime } from 'luxon';
import { ActivityList } from './activity.type';
import { RaffleList } from './raffle.type';

export type Event = {
  id: string;
  title: string;
  eventDate: DateTime | null;
  eventTime: string;
  date: string | null;
  shortDescription: string;
  longDescription: string;
  address: string;
  cover: File | null;
  activities: ActivityList;
  raffles: RaffleList;
  status: 'past' | 'current' | 'planned' | 'draft';
};

export type EventList = Event[];
