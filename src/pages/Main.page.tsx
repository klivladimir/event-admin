import { Button, ButtonGroup, CircularProgress, List } from '@mui/material';
import Add from '@mui/icons-material/Add';
import { useState, useMemo, useCallback } from 'react';
import { ArrowDropDown, ArrowDropUp, Check } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { Event } from '../types';
import CustomListItem from '../components/CustomListItem';
import { useEvents } from '../hooks/useEvents';

type Tab = 'all' | Event['status'];

function MainPage() {
  const menu: { key: Tab; value: string }[] = [
    { key: 'all', value: 'Все' },
    { key: 'past', value: 'Прошедшие' },
    { key: 'current', value: 'Текущие' },
    { key: 'planned', value: 'Запланированные' },
    { key: 'draft', value: 'Черновики' },
  ];

  const [selectedTab, setSelectedTab] = useState<Tab>('all');
  const { events, loading, error } = useEvents();
  const [showWinnersForEventId, setShowWinnersForEventId] = useState<string | null>(null);
  const navigate = useNavigate();

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      switch (selectedTab) {
        case 'past':
          return event.status === 'past';
        case 'current':
          return event.status === 'current';
        case 'planned':
          return event.status === 'planned';
        case 'draft':
          return event.status === 'draft';
        default:
          return true;
      }
    });
  }, [events, selectedTab]);

  const handleSelectEvent = useCallback(
    (event: Event) => {
      if (event.status === 'draft') {
        navigate('/create-event/first', { state: event });
      }
    },
    [navigate]
  );

  const renderEventButtons = (event: Event) => {
    if (event.status === 'planned') {
      return (
        <>
          <Button
            className="!rounded-full w-fit max-h-[32px] !bg-[#5D48AF] !text-white"
            variant="contained"
          >
            <span className="normal-case">Запустить ивент</span>
          </Button>
        </>
      );
    }
    if (event.status === 'current') {
      return (
        <div className="flex gap-2">
          <Button
            className="!rounded-full w-fit max-h-[32px] !bg-transparent text-fg-secondary"
            variant="contained"
          >
            <span className="normal-case">Завершить ивент</span>
          </Button>

          <Button
            className="!rounded-full w-fit max-h-[32px] !bg-[#14AE5C] !text-white"
            variant="contained"
          >
            <span className="normal-case">Запустить розыгрыш</span>
          </Button>
        </div>
      );
    }

    if (event.status === 'past') {
      return (
        <div className="flex gap-2">
          <Button
            className="!rounded-full w-fit max-h-[32px] !bg-transparent text-fg-secondary"
            variant="contained"
            startIcon={showWinnersForEventId === event.id ? <ArrowDropUp /> : <ArrowDropDown />}
            onClick={e => {
              e.stopPropagation();
              setShowWinnersForEventId(showWinnersForEventId === event.id ? null : event.id);
            }}
          >
            <span className="normal-case">Показать победителей</span>
          </Button>
        </div>
      );
    }

    return null;
  };

  const renderEventStatus = (event: Event) => {
    switch (event.status) {
      case 'planned':
        return (
          <span className="text-[14px] leading-[20px] text-fg-secondary">Запланированное</span>
        );
      case 'current':
        return <span className="text-[14px] leading-[20px] text-fg-secondary">Текущее</span>;
      case 'past':
        return <span className="text-[14px] leading-[20px] text-fg-secondary">Прошедшее</span>;
      case 'draft':
        return <span className="text-[14px] leading-[20px] text-fg-secondary">Черновик</span>;
      default:
        return null;
    }
  };

  const renderWinners = (event: Event) => {
    if (event.status === 'past' && showWinnersForEventId === event.id) {
      return (
        <div className="p-[16px] bg-[#E8DEF8]">
          <div className="text-[14px] leading-[20px] font-semibold mb-1">Победители:</div>
          <div className="text-[14px] leading-[20px]">Приз: iPhone17 Ник: @robot Код: 4567</div>
          <div className="text-[14px] leading-[20px]">Приз: iPhone18 Ник: @kolyan Код: 3232</div>
        </div>
      );
    }
    return null;
  };

  return (
    <main className="h-full w-full pt-[40px] pl-[40px]">
      <div className="flex flex-col gap-[28px]">
        <div className="flex flex-col gap-[28px]">
          <span className="font-[600] text-[28px] leading-[36px]">Админка</span>
          <Button
            className="!rounded-full w-fit min-h-[40px] !bg-[#5D48AF] !text-white"
            variant="contained"
            component={Link}
            to="/create-event"
            startIcon={<Add />}
          >
            <span className="normal-case">Создать ивент</span>
          </Button>
        </div>

        <div className="flex flex-col gap-[18px]">
          <span>Список ивентов</span>
          <ButtonGroup className="min-h-[40px] max-w-[966px] pr-[40px] overflow-x-auto no-scrollbar">
            {menu.map((item, i) => (
              <Button
                key={item.key}
                sx={{
                  backgroundColor: selectedTab === item.key ? '#EDE7F6' : '#FFF',
                  border: '1px solid',
                  borderColor: '#79747E',
                  minWidth: '170px !important',
                }}
                startIcon={selectedTab === item.key ? <Check /> : ''}
                onClick={() => setSelectedTab(item.key)}
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
                {filteredEvents.map(event => (
                  <div onClick={() => handleSelectEvent(event)} key={event.id}>
                    <CustomListItem
                      height="88px"
                      leftContent={
                        <div className="xer flex flex-col">
                          {renderEventStatus(event)}
                          <span className="text-[16px] leading-[24px] text-fg-primary font-medium">
                            {event.title}
                          </span>
                          <span className="text-[14px] leading-[20px] text-fg-secondary">
                            {event.eventDate} - {event.eventTime}
                          </span>
                        </div>
                      }
                      rightContent={renderEventButtons(event)}
                      additionalContent={renderWinners(event)}
                    />
                  </div>
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
