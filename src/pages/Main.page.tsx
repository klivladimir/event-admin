import { Button, ButtonGroup, CircularProgress, List, Box } from '@mui/material';
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
    { key: 'today', value: 'Текущие' },
    { key: 'next', value: 'Запланированные' },
    { key: 'pending', value: 'Черновики' },
  ];

  const [selectedTab, setSelectedTab] = useState<Tab>('all');
  const { events, loading, error } = useEvents();
  const [showWinnersForEventId, setShowWinnersForEventId] = useState<string | null>(null);
  const navigate = useNavigate();

  const filteredEvents = useMemo(() => {
    return events?.filter(event => {
      switch (selectedTab) {
        case 'past':
          return event.status === 'past';
        case 'today':
          return event.status === 'today';
        case 'next':
          return event.status === 'next';
        case 'pending':
          return event.status === 'pending';
        default:
          return true;
      }
    });
  }, [events, selectedTab]);

  const handleSelectEvent = useCallback(
    (event: Event) => {
      if (event.status === 'pending') {
        navigate('/create-event/first', { state: event });
      }
    },
    [navigate]
  );

  const renderEventButtons = (event: Event) => {
    if (event.status === 'next') {
      return (
        <>
          <Button
            className="!rounded-full max-h-[32px] fill-primary !text-white"
            variant="contained"
            disableElevation
            sx={{
              minWidth: '160px',
              width: { xs: '100%', sm: 'fit-content' },
            }}
          >
            <span className="normal-case">Запустить ивент</span>
          </Button>
        </>
      );
    }
    if (event.status === 'today') {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-end', sm: 'center' },
            gap: 2,
            width: { xs: '100%', sm: 'fit-content' },
          }}
        >
          <Button
            className="!rounded-full max-h-[32px] !bg-transparent text-fg-secondary cursor-pointer"
            variant="outlined"
            sx={{
              minWidth: '165px',
              width: { xs: '100%', sm: 'fit-content' },
            }}
          >
            <span className="normal-case text-primary">Завершить ивент</span>
          </Button>

          <Button
            className="!rounded-full max-h-[32px] !bg-[#14AE5C] !text-white"
            variant="contained"
            disableElevation
            sx={{
              minWidth: '192px',
              width: { xs: '100%', sm: 'fit-content' },
            }}
          >
            <span className="normal-case">Запустить розыгрыш</span>
          </Button>
        </Box>
      );
    }

    if (event.status === 'past') {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-end', sm: 'center' },
            gap: 2,
            width: { xs: '100%', sm: 'fit-content' },
          }}
        >
          <Button
            className="!rounded-full max-h-[32px] text-fg-secondary border border-fg-button-outline"
            variant="outlined"
            disableElevation
            startIcon={
              showWinnersForEventId === event.id ? (
                <ArrowDropUp className="fill-primary" />
              ) : (
                <ArrowDropDown className="fill-primary" />
              )
            }
            onClick={e => {
              e.stopPropagation();
              setShowWinnersForEventId(showWinnersForEventId === event.id ? null : event.id);
            }}
            sx={{
              minWidth: '220px',
              width: { xs: '100%', sm: 'fit-content' },
            }}
          >
            <span className="normal-case text-primary">Показать победителей</span>
          </Button>
        </Box>
      );
    }

    return null;
  };

  const renderEventStatus = (event: Event) => {
    switch (event.status) {
      case 'next':
        return (
          <span className="text-[14px] leading-[20px] text-fg-secondary">Запланированное</span>
        );
      case 'today':
        return <span className="text-[14px] leading-[20px] text-fg-secondary">Текущее</span>;
      case 'past':
        return <span className="text-[14px] leading-[20px] text-fg-secondary">Прошедшее</span>;
      case 'pending':
        return <span className="text-[14px] leading-[20px] text-fg-secondary">Черновик</span>;
      default:
        return null;
    }
  };

  const renderWinners = (event: Event) => {
    if (event.status === 'past' && showWinnersForEventId === event.id) {
      return (
        <div className="p-[16px] bg-[#E8DEF8] border-b-[1px] border-b-[#CAC4D0]">
          <div className="text-[14px] leading-[20px] font-semibold mb-1">Победители:</div>
          <div className="text-[14px] leading-[20px]">Приз: iPhone17 Ник: @robot Код: 4567</div>
          <div className="text-[14px] leading-[20px]">Приз: iPhone18 Ник: @kolyan Код: 3232</div>
        </div>
      );
    }
    return null;
  };

  return (
    <main className="h-full w-full pt-[12px] md:pt-[40px] pl-[12px] md:pl-[40px]">
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
                        <div className="flex flex-col">
                          {renderEventStatus(event)}
                          <span className="text-[16px] leading-[24px] text-fg-primary font-medium">
                            {event.name}
                          </span>
                          <span className="text-[14px] leading-[20px] text-fg-secondary">
                            {event.date
                              ? new Date(event.date)
                                  .toLocaleDateString('ru-RU', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                  })
                                  .replace(/\./g, '.')
                              : ''}{' '}
                            -{' '}
                            {event.startTime
                              ? typeof event.startTime === 'string'
                                ? event.startTime.substring(11, 16)
                                : typeof event.startTime === 'object'
                                  ? `${event.startTime.hour.toString().padStart(2, '0')}:${event.startTime.minute.toString().padStart(2, '0')}`
                                  : event.startTime
                              : ''}
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
