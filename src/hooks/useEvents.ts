import { useState, useEffect } from 'react';
import { getEvents } from '../api/events';
import { CreateEventResponce } from '../types';

export function useEvents() {
  const [events, setEvents] = useState<CreateEventResponce[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (err) {
        setError('Failed to load events. Please try again.');
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return { events, loading, error, setEvents };
}
