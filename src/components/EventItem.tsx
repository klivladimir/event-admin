import { Button, Box } from '@mui/material';
import { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { CreateEventResponce, Winner } from '../types';
import CustomListItem from './CustomListItem';
import { startEvent, startRaffle, endEvent } from '../api/events';

interface ExtendedEvent extends CreateEventResponce {
  showStatus: 'next' | 'today' | 'past' | 'pending';
  raffleStatus?: 'waiting' | 'started' | 'end';
  duration?: string;
  winners?: Winner[];
}

const WAITING_TIME_BEFORE_START = 5 * 60 * 1000;

interface EventItemProps {
  event: CreateEventResponce;
  onEventUpdated: () => void;
  onTabChange?: (tab: string) => void;
}

function EventItem({ event, onEventUpdated, onTabChange }: EventItemProps) {
  const navigate = useNavigate();
  const [showWinners, setShowWinners] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const timerInterval = useRef<number | null>(null);

  const eventId = String(event.id);

  const eventData = event as ExtendedEvent;
  const hasRaffle = eventData.raffleStatus && eventData.duration;

  const cleanupTimer = useCallback(() => {
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
      timerInterval.current = null;
    }
    localStorage.removeItem(`${eventId}endTime`);
    setTimeRemaining(null);
  }, [eventId]);

  const startTimerFromSaved = useCallback(
    (remainingTime: number) => {
      setTimeRemaining(remainingTime);

      timerInterval.current = setInterval(() => {
        const currentEndTimeString = localStorage.getItem(`${eventId}endTime`);
        if (!currentEndTimeString) {
          cleanupTimer();
          return;
        }

        const currentEndTime = parseInt(currentEndTimeString, 10);
        const newRemaining = currentEndTime - Date.now();

        if (newRemaining <= 0) {
          cleanupTimer();
          setTimeRemaining(0);
          setTimeout(() => onEventUpdated(), 2000);
        } else {
          setTimeRemaining(newRemaining);
        }
      }, 1000);
    },
    [cleanupTimer, eventId, onEventUpdated]
  );

  const startTimer = useCallback(
    (durationMs: number) => {
      cleanupTimer();

      const endTime = Date.now() + durationMs;
      localStorage.setItem(`${eventId}endTime`, endTime.toString());
      setTimeRemaining(durationMs);

      timerInterval.current = setInterval(() => {
        const currentEndTimeString = localStorage.getItem(`${eventId}endTime`);
        if (!currentEndTimeString) {
          cleanupTimer();
          return;
        }

        const currentEndTime = parseInt(currentEndTimeString, 10);
        const newRemaining = currentEndTime - Date.now();

        if (newRemaining <= 0) {
          cleanupTimer();
          setTimeRemaining(0);
          onEventUpdated();
        } else {
          setTimeRemaining(newRemaining);
        }
      }, 1000);
    },
    [cleanupTimer, eventId, onEventUpdated]
  );

  useEffect(() => {
    return () => {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
        timerInterval.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (eventData.showStatus === 'today' && eventData.raffleStatus === 'started') {
      const endTimeString = localStorage.getItem(`${eventId}endTime`);
      if (endTimeString) {
        const endTime = parseInt(endTimeString, 10);
        const remaining = endTime - Date.now();

        if (remaining > 0) {
          startTimerFromSaved(remaining);
        } else {
          cleanupTimer();
        }
      }
    } else {
      cleanupTimer();
    }
  }, [
    event,
    eventData.showStatus,
    eventData.raffleStatus,
    eventId,
    cleanupTimer,
    startTimerFromSaved,
  ]);

  const handleSelectEvent = useCallback(() => {
    if (eventData.showStatus === 'pending') {
      localStorage.setItem('currentEventId', eventId);
      navigate('/create-event/first', { state: event });
    }
  }, [event, eventId, navigate, eventData.showStatus]);

  const renderEventStatus = () => {
    switch (eventData.showStatus) {
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

  const renderEventButtons = () => {
    if (eventData.showStatus === 'next') {
      return (
        <Button
          className="!rounded-full max-h-[32px] fill-primary !text-white"
          variant="contained"
          disableElevation
          sx={{
            minWidth: '160px',
            width: { xs: '100%', sm: 'fit-content' },
          }}
          onClick={async () => {
            if (event.id) {
              await startEvent(+event.id);
              onEventUpdated();
              if (onTabChange) onTabChange('today');
            }
          }}
        >
          <span className="normal-case">Запустить ивент</span>
        </Button>
      );
    }

    if (eventData.showStatus === 'today') {
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
            onClick={async () => {
              if (event.id) {
                await endEvent(+event.id);
                onEventUpdated();
                if (onTabChange) onTabChange('past');
              }
            }}
            disabled={eventData.raffleStatus === 'started'}
          >
            <span className="normal-case text-primary">Завершить ивент</span>
          </Button>

          {hasRaffle && !event?.winners && (
            <Button
              className="!rounded-full max-h-[32px] !text-white"
              style={{
                backgroundColor:
                  eventData.raffleStatus === 'waiting'
                    ? '#14AE5C'
                    : eventData.raffleStatus === 'end'
                      ? '#0000001f'
                      : '#E5A000',
              }}
              variant="contained"
              disabled={eventData.raffleStatus === 'started' || eventData.raffleStatus === 'end'}
              sx={{
                minWidth: '192px',
                width: { xs: '100%', sm: 'fit-content' },
              }}
              onClick={async () => {
                const duration = eventData?.duration;
                if (hasRaffle && duration && event.id) {
                  const [, minutes, seconds] = duration.split(':').map(Number);
                  const durationInMilliseconds =
                    (minutes * 60 + seconds) * 1000 + WAITING_TIME_BEFORE_START;

                  await startRaffle(+event.id);
                  startTimer(durationInMilliseconds);
                  onEventUpdated();
                }
              }}
            >
              {eventData.raffleStatus === 'waiting' && (
                <span className="normal-case">Запустить розыгрыш</span>
              )}

              {eventData.raffleStatus === 'started' && (
                <span className="normal-case">
                  Розыгрыш идет:{' '}
                  {timeRemaining != null ? Math.max(0, Math.floor(timeRemaining / 1000)) : '0'} сек
                </span>
              )}
              {eventData.raffleStatus === 'end' && (
                <span className="normal-case">Розыгрыш прошел</span>
              )}
            </Button>
          )}

          {hasRaffle && event?.winners && (
            <Button
              className="!rounded-full max-h-[32px] text-fg-secondary border border-fg-button-outline"
              variant="outlined"
              disableElevation
              startIcon={
                showWinners ? (
                  <ArrowDropUp className="fill-primary" />
                ) : (
                  <ArrowDropDown className="fill-primary" />
                )
              }
              onClick={e => {
                e.stopPropagation();
                setShowWinners(prev => !prev);
              }}
              sx={{
                minWidth: '220px',
                width: { xs: '100%', sm: 'fit-content' },
              }}
            >
              <span className="normal-case text-primary">Показать победителей</span>
            </Button>
          )}
        </Box>
      );
    }

    if (eventData.showStatus === 'past') {
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
              showWinners ? (
                <ArrowDropUp className="fill-primary" />
              ) : (
                <ArrowDropDown className="fill-primary" />
              )
            }
            onClick={e => {
              e.stopPropagation();
              setShowWinners(prev => !prev);
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

  const renderWinners = () => {
    if (['past', 'today'].includes(eventData.showStatus) && showWinners) {
      const winners = eventData.winners || [];
      return (
        <div className="p-[16px] bg-[#E8DEF8] border-b-[1px] border-b-[#CAC4D0]">
          <div className="text-[14px] leading-[20px] font-semibold mb-1">Победители:</div>

          {winners.length > 0 ? (
            winners.map((winner, index) => (
              <div key={index} className="text-[14px] leading-[20px]">
                Приз: {winner.prize.name} Ник: `${winner.user.firstName} ${winner.user.lastName}`
                Код: {winner.number}
              </div>
            ))
          ) : (
            <div className="text-[14px] leading-[20px]">Информации о победителях нет.</div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div onClick={handleSelectEvent}>
      <CustomListItem
        height="88px"
        leftContent={
          <div className="flex flex-col">
            {renderEventStatus()}
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
              - {event.startTime ? event.startTime.substring(11, 16) : ''}
            </span>
          </div>
        }
        rightContent={renderEventButtons()}
        additionalContent={renderWinners()}
      />
    </div>
  );
}

export default EventItem;
