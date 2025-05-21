import { Button, ButtonGroup, CircularProgress, List } from '@mui/material';
import Add from '@mui/icons-material/Add';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { Check, AccountCircle } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { CreateEventResponce } from '../types';
import { useEvents } from '../hooks/useEvents';
import EventItem from '../components/EventItem';

type Tab = 'all' | 'past' | 'today' | 'next' | 'pending';

function MainPage() {
  const menu: { key: Tab; value: string }[] = [
    { key: 'all', value: 'Все' },
    { key: 'past', value: 'Прошедшие' },
    { key: 'today', value: 'Текущие' },
    { key: 'next', value: 'Запланированные' },
    { key: 'pending', value: 'Черновики' },
  ];

  const [selectedTab, setSelectedTab] = useState<Tab>('all');
  const { events, loading, error, refetchEvents } = useEvents();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      setUserEmail(storedEmail);
    }
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');

    const allLocalStorageKeys = Object.keys(localStorage);
    allLocalStorageKeys.forEach(key => {
      if (key.endsWith('endTime')) {
        localStorage.removeItem(key);
      }
    });

    navigate('/login');
  }, [navigate]);

  const filteredEvents = useMemo(() => {
    return events?.filter(event => {
      switch (selectedTab) {
        case 'past':
          return event.showStatus === 'past';
        case 'today':
          return event.showStatus === 'today';
        case 'next':
          return event.showStatus === 'next';
        case 'pending':
          return event.showStatus === 'pending';
        default:
          return true;
      }
    });
  }, [events, selectedTab]);

  const handleTabChange = (tab: Tab) => {
    setSelectedTab(tab);
  };

  return (
    <main className="h-full w-full pt-[12px] md:pt-[40px] pl-[12px] md:pl-[40px] pr-[12px] md:pr-[40px]">
      <div className="flex justify-between items-center h-[48px] mb-[28px]">
        <div className="flex items-center">
          <AccountCircle sx={{ color: 'action.active', mr: 1 }} />
          <span>{userEmail || 'user@example.com'}</span>{' '}
        </div>
        <Button
          variant="text"
          onClick={handleLogout}
          sx={{
            color: 'primary.main',
            textTransform: 'none',
            padding: '0px 8px',
            minWidth: 'auto',
          }}
        >
          Выйти
        </Button>
      </div>

      <div className="flex flex-col gap-[28px]">
        <div className="flex flex-col gap-[28px]">
          <span className="font-[600] text-[28px] leading-[36px]">Админка</span>
          <Button
            className="!rounded-full w-[165px] min-h-[40px] fill-primary !text-white"
            variant="contained"
            component={Link}
            to="/create-event"
            startIcon={<Add />}
            disableElevation
          >
            <span className="normal-case">Создать ивент</span>
          </Button>
        </div>

        <div className="flex flex-col gap-[18px]">
          <span>Список ивентов</span>
          <ButtonGroup className="min-h-[40px] py-[4px] overflow-x-auto no-scrollbar">
            {menu.map((item, i) => (
              <Button
                key={item.key}
                sx={{
                  backgroundColor: selectedTab === item.key ? '#EDE7F6' : '#FFF',
                  border: '1px solid',
                  borderColor: '#79747E',
                  minWidth: '170px !important',
                  maxWidth: '187px',
                }}
                startIcon={selectedTab === item.key ? <Check /> : ''}
                onClick={() => handleTabChange(item.key)}
                className={` text-fg-button-secondary ${i === 0 ? '!rounded-l-full' : ''} ${i === menu.length - 1 ? '!rounded-r-full' : ''}`}
                fullWidth
              >
                <span className="normal-case">{item.value}</span>
              </Button>
            ))}
          </ButtonGroup>

          <div className="w-full flex flex-col items-center">
            {loading ? (
              <CircularProgress />
            ) : error ? (
              <div>{error}</div>
            ) : filteredEvents.length > 0 ? (
              <List className="w-full">
                {filteredEvents.map((event: CreateEventResponce) => (
                  <EventItem
                    key={event.id}
                    event={event}
                    onEventUpdated={refetchEvents}
                    onTabChange={tab => handleTabChange(tab as Tab)}
                  />
                ))}
              </List>
            ) : (
              !loading &&
              !error &&
              events.length === 0 && <div>Здесь ничего нет, создайте свой первый ивент</div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default MainPage;
