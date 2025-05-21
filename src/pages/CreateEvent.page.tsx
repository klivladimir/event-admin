import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar.tsx';
import { CreateEventResponce, EventFormData, SubEventList } from '../types/index.ts';
import FirstStepPage from './createEvent/FirstStep.page.tsx';
import SecondStepPage from './createEvent/SecondStep.page.tsx';

import { DateTime } from 'luxon';
import { getEventById, startEvent } from '../api/events.ts';
import { RaffleList } from '../types/raffle.type.ts';

function CreateEventPage() {
  const location = useLocation();

  const [generalInfo, setGeneralInfo] = useState<EventFormData>({
    id: '',
    name: '',
    eventDate: null,
    eventStartTime: '',
    eventEndTime: '',
    shortDescription: '',
    description: '',
    address: '',
    image: null,
    subEvents: [],
    raffles: [],
    showStatus: 'pending',
  });
  const [subEventsList, setSubEventsList] = useState<SubEventList>([]);
  const [raffleList, setRaffleList] = useState<RaffleList>([]);
  const [currentEventId, setCurrentEventId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const currentEventId = localStorage.getItem('currentEventId');
      if (currentEventId) {
        setCurrentEventId(+currentEventId);
        getCurrentEvent(+currentEventId);
        return;
      }
    } catch (error) {
      console.error('Error fetching current event:', error);
    }

    if (location.state) {
      const eventData = location.state as CreateEventResponce;
      if (eventData.id) {
        getCurrentEvent(eventData.id);
      }
    }
  }, []);

  function getCurrentEvent(id: CreateEventResponce['id']) {
    getEventById(id).then(data => {
      const formData = {
        id: String(data.id),
        name: data.name,
        address: data.address,
        image: data.image,
        eventDate: DateTime.fromFormat(data.date, 'yyyy-MM-dd HH:mm:ss'),
        eventStartTime: DateTime.fromFormat(data.startTime, 'yyyy-MM-dd HH:mm:ss').toFormat(
          'HH:mm'
        ),
        eventEndTime: DateTime.fromFormat(data.endTime, 'yyyy-MM-dd HH:mm:ss').toFormat('HH:mm'),
        shortDescription: data.shortDescription,
        description: data.description,
        subEvents: data.subEvents,
        raffles: data.raffles,
        showStatus: data.showStatus,
      } satisfies EventFormData;

      setGeneralInfo({ ...formData });
      setSubEventsList(formData.subEvents || []);
      setRaffleList(formData.raffles || []);
    });
  }

  const handleSubmit = async () => {
    if (currentEventId) {
      startEvent(currentEventId).then(() => {
        localStorage.removeItem('currentEventId');
        navigate('/');
      });
    }
  };

  const updateSubEventList = () => {
    const currentEventId = localStorage.getItem('currentEventId');
    if (currentEventId) {
      getCurrentEvent(+currentEventId);
    }
  };

  return (
    <>
      <TopBar />
      <div className="flex flex-col gap-[28px]">
        <Routes>
          <Route path="/" element={<Navigate to="first" />} />
          <Route
            path="/first"
            element={<FirstStepPage form={generalInfo} setForm={setGeneralInfo} />}
          />
          <Route
            path="/second"
            element={
              <SecondStepPage
                subEventsList={subEventsList}
                updateSubEventList={updateSubEventList}
                raffleList={raffleList}
                onSubmit={handleSubmit}
              />
            }
          />
        </Routes>
      </div>
    </>
  );
}

export default CreateEventPage;
