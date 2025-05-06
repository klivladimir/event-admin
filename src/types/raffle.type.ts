import { PrizeList } from './prize.type';

export type Raffle = {
  id?: string;
  name: string;
  start: string;
  end: string;
  duration: string;
  rule: string;
  prizes: PrizeList;
};

export type RaffleList = Raffle[];
