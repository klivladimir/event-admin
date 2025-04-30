import TopBar from '../components/TopBar.tsx';
import FirstStepPage from './createEvent/FirstStep.page.tsx';
import { Navigate, Route, Routes } from 'react-router-dom';
import SecondStepPage from './createEvent/SecondStep.page.tsx';
import { useState } from 'react';
import { GeneralEventInfo } from '../types';
import { Activity } from '../types/activity.type';
import { Raffle } from '../types/raffle.type';

function CreateEventPage() {
  const [generalInfo, setGeneralInfo] = useState<GeneralEventInfo>({
    eventName: '',
    eventDate: null,
    eventTime: '',
    date: null,
    shortDescription: '',
    longDescription: '',
    address: '',
    cover: null,
  });
  const [facts, setFacts] = useState<Activity[]>([]);
  const [giveaways, setGiveaways] = useState<Raffle[]>([]);

  const handleSubmit = async () => {
    const { eventName, address, cover, date, longDescription, shortDescription } = generalInfo;
    const eventData = {
      eventName,
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
                facts={facts}
                setFacts={setFacts}
                giveaways={giveaways}
                setGiveaways={setGiveaways}
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
