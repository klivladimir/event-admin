import { PrizeList } from './prize.type';

export type Raffle = {
  id?: string;
  name: string;
  startTime: string;
  endTime: string;
  duration: string;
  terms: string;
  prizes: PrizeList;
};

export type RaffleList = Raffle[];
