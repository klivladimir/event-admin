export type GeneralEventInfo = {
    eventName: string;
    eventDate: string | null;
    eventTime: string;
    date: string | null;
    shortDescription: string;
    longDescription: string;
    address: string;
    cover: File | null;
  };