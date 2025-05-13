import TopBar from '../components/TopBar.tsx';
import FirstStepPage from './createEvent/FirstStep.page.tsx';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import SecondStepPage from './createEvent/SecondStep.page.tsx';
import { useState, useEffect } from 'react';
import { EventFormData } from '../types';
import { ActivityList } from '../types/activity.type';
import { RaffleList } from '../types/raffle.type';
import { DateTime } from 'luxon';

function CreateEventPage() {
  const location = useLocation();

  const [generalInfo, setGeneralInfo] = useState<EventFormData>({
    name: '',
    eventDate: null,
    eventTime: '',
    date: null,
    shortDescription: '',
    description: '',
    address: '',
    image: null,
    activities: [],
    raffles: [],
  });
  const [facts, setFacts] = useState<ActivityList>([]);
  const [giveaways, setGiveaways] = useState<RaffleList>([]);

  useEffect(() => {
    if (location.state) {
      console.log('Данные из состояния:', location.state);
      const eventData = location.state as EventFormData;
      const date = DateTime.fromFormat(eventData.eventDate || '', 'dd.mm.yyyy');
      console.log('Parsed date:', date.isValid);
      setGeneralInfo({ ...eventData, eventDate: date });
      setFacts(eventData.activities || []);
      setGiveaways(eventData.raffles || []);
    }
  }, [location.state]);

  const handleSubmit = async () => {
    const {
      name: title,
      address,
      image: cover,
      date,
      description: longDescription,
      shortDescription,
    } = generalInfo;
    const eventData = {
      title,
      date,
      shortDescription,
      longDescription,
      address,
      cover,
      activities: facts,
      raffles: giveaways,
    };
    // TODO: заменить на реальный запрос
    console.log('Отправка данных на сервер:', eventData);
    // await fetch('/api/events', { method: 'POST', body: JSON.stringify(eventData) });
  };

  return (
    <>
      <TopBar />
      <div className="flex flex-col gap-[49px]">
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
                activityList={facts}
                setActivityList={setFacts}
                raffleList={giveaways}
                setRaffleList={setGiveaways}
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
