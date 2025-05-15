import { useMaskito } from '@maskito/react';
import { Button, Dialog, Fab, TextField } from '@mui/material';
import { useState, useEffect } from 'react';
import { maskitoTimeOptionsGenerator } from '@maskito/kit';
import { SubEvent } from '../types/subEvent.type';
import { Raffle, RaffleList } from '../types/raffle.type';
import { Add, Autorenew, CloudDownload, CreateOutlined, DeleteOutline } from '@mui/icons-material';
import * as luxon from 'luxon';
import {
  CreatePrizeRequest,
  CreateRaffleRequest,
  CreateSubEventRequest,
  Prize,
  PrizeList,
} from '../types';
import {
  createPrize,
  createRaffle,
  createSubEvent,
  deletePrize,
  updatePrize,
  updateRaffle,
  updateSubEvent,
} from '../api/events';

const timeMask = maskitoTimeOptionsGenerator({ mode: 'HH:MM' });
const timeDurationMask = maskitoTimeOptionsGenerator({ mode: 'HH:MM:SS' });

type DialogType = 'activity' | 'raffle';

type EventData = SubEvent | Raffle;

interface CreateEventDialogProps {
  open: boolean;
  onClose: () => void;
  onUpdate: () => void;
  type: DialogType;
  data?: EventData | null;
  raffleList: RaffleList;
}

function CreateEventDialog(props: CreateEventDialogProps) {
  const { onClose, onUpdate, open, type, data: propsData, raffleList } = props;

  const startTimeInputRef = useMaskito({ options: timeMask });
  const endTimeInputRef = useMaskito({ options: timeMask });
  const durationInputRef = useMaskito({ options: timeDurationMask });

  const [itemData, setItemData] = useState<EventData | null | undefined>(null);

  const [currentRaffle, setCurrentRaffle] = useState<Raffle | null>(null);
  const [eventName, setEventName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [terms, setTerms] = useState('');
  const [duration, setDuration] = useState('');
  const [prizes, setPrizes] = useState<PrizeList>([]);
  const [currentPrize, setCurrentPrize] = useState<Prize | null>(null);
  const [showPrizeEditing, setShowPrizeEditing] = useState<boolean>(false);
  const [eventNameError, setEventNameError] = useState(false);
  const [endTimeError, setEndTimeError] = useState<string | null>(null);

  useEffect(() => {
    setItemData(propsData);
  }, [propsData]);

  useEffect(() => {
    const formatTimeToHHMM = (timeInput: string | undefined): string => {
      if (!timeInput) return '';
      if (/^([01]\d|2[0-3]):([0-5]\d)$/.test(timeInput)) {
        return timeInput;
      }

      let dt = luxon.DateTime.fromISO(timeInput);
      if (dt.isValid) {
        return dt.toFormat('HH:mm');
      }
      dt = luxon.DateTime.fromSQL(timeInput);
      if (dt.isValid) {
        return dt.toFormat('HH:mm');
      }

      const match = timeInput.match(/(?:\d{4}-\d{2}-\d{2}[T\s])?(\d{2}:\d{0,2})/);
      if (match && match[1]) {
        let extractedTime = match[1];
        if (/^\d{2}:$/.test(extractedTime)) {
          extractedTime += '00';
        } else if (/^\d{2}:\d$/.test(extractedTime)) {
          extractedTime += '0';
        }

        if (/^([01]\d|2[0-3]):([0-5]\d)$/.test(extractedTime)) {
          return extractedTime;
        }
      }
      return '';
    };

    if (itemData) {
      setEventName(itemData.name || '');
      setStartTime(formatTimeToHHMM(itemData.startTime));
      setEndTime(formatTimeToHHMM(itemData.endTime));
      if (type === 'raffle') {
        const raffleData = raffleList.find(raffle => raffle.id === itemData?.id);
        setCurrentRaffle(raffleData as Raffle);
        setTerms(raffleData?.terms || '');
        setDuration(raffleData?.duration || '');
        setPrizes(raffleData?.prizes || []);
      }
    } else {
      setEventName(type === 'activity' ? 'Событие' : 'Розыгрыш');
      setStartTime('');
      setEndTime('');
      setTerms('');
      setDuration('');
      setPrizes([]);
    }
    setEventNameError(false);
    setEndTimeError(null);
  }, [itemData, type, raffleList]);

  const handleClose = () => {
    setEventName('');
    setStartTime('');
    setEndTime('');
    setTerms('');
    setDuration('');
    setEventNameError(false);
    setEndTimeError(null);
    setShowPrizeEditing(false);
    onClose();
  };

  async function handleSave() {
    const resData = getResSubEventData();
    if (type === 'activity') {
      const id = itemData?.id;
      if (id) {
        await updateSubEvent(+id, resData);
      } else {
        await createSubEvent(resData);
      }
    } else if (type === 'raffle') {
      const data = getResRaffleData();
      if (currentRaffle?.id) {
        await updateRaffle(+currentRaffle.id, data);
      } else {
        await createRaffle(data);
      }
    }
    onClose();
  }

  const isSaveDisabled =
    type === 'raffle'
      ? !eventName.trim() ||
        eventName.trim().length < 2 ||
        !startTime.trim() ||
        !endTime.trim() ||
        !terms.trim() ||
        !duration.trim() ||
        !!endTimeError
      : !eventName.trim() ||
        eventName.trim().length < 2 ||
        !startTime.trim() ||
        !endTime.trim() ||
        !!endTimeError;

  function addPrize(): void {
    if (!currentRaffle) {
      const data = getResRaffleData();
      createRaffle(data).then(res => {
        if (res) {
          setItemData(res.data);
          setCurrentRaffle(res.data);
          onUpdate();
        }
      });
    }
    setCurrentPrize({ name: '', image: null });
    setShowPrizeEditing(true);
  }

  const getResRaffleData = (): CreateRaffleRequest => {
    return {
      name: eventName,
      startTime: startTime,
      endTime: endTime,
      terms: terms,
      duration: duration,
    };
  };

  const getResSubEventData = (): CreateSubEventRequest => {
    return {
      name: eventName,
      startTime: startTime,
      endTime: endTime,
    };
  };

  function handleSaveCurrentPrize(): void {
    const raffleId = currentRaffle?.id;
    if (currentPrize?.id && raffleId) {
      const data = {
        name: currentPrize.name,
        image: currentPrize.image as File,
      } satisfies CreatePrizeRequest;

      updatePrize(+raffleId, data).then(() => {
        onUpdate();
      });
    } else {
      const name = currentPrize?.name;
      const image = currentPrize?.image as File;
      if (name && image) {
        const data = {
          name,
          image,
        } satisfies CreatePrizeRequest;

        createPrize(+raffleId!, data).then(() => {
          onUpdate();
        });
      }
    }
  }

  async function handleDeletePrize(prizeId?: number): Promise<void> {
    const raffleId = currentRaffle?.id;
    await deletePrize(raffleId, prizeId);
    onUpdate();
  }

  const validateTimes = (start: string, end: string) => {
    if (start && end) {
      const startTimeParts = start.split(':').map(Number);
      const endTimeParts = end.split(':').map(Number);
      // Basic check for HH:MM format
      if (
        startTimeParts.length === 2 &&
        !isNaN(startTimeParts[0]) &&
        !isNaN(startTimeParts[1]) &&
        endTimeParts.length === 2 &&
        !isNaN(endTimeParts[0]) &&
        !isNaN(endTimeParts[1])
      ) {
        const startTimeTotalMinutes = startTimeParts[0] * 60 + startTimeParts[1];
        const endTimeTotalMinutes = endTimeParts[0] * 60 + endTimeParts[1];
        if (endTimeTotalMinutes < startTimeTotalMinutes) {
          setEndTimeError('Время окончания не может быть раньше времени начала');
        } else {
          setEndTimeError(null);
        }
      } else {
        setEndTimeError(null);
      }
    } else {
      setEndTimeError(null);
    }
  };

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      sx={{
        backgroundColor: '#A3A3A3',
      }}
    >
      <div className="flex flex-col p-[24px] md:px-[44px] bg-[#ECE6F0] md:min-w-[560px]">
        <div className="flex flex-col gap-[16px] text-center">
          <span className="self-center text-[24px] leading-[32px]">
            {itemData ? 'Редактирование' : 'Создание'}{' '}
            {type === 'activity' ? 'события расписания' : 'розыгрыша'}
          </span>
          <span className="text-[14px] leading-[20px]">
            A dialog is a type of modal window that appears in front of app content to provide
            critical information, or prompt for a decision to be made.
          </span>
        </div>

        <form className="flex flex-col gap-[44px] mt-[24px] px-0">
          <TextField
            required
            autoFocus={true}
            id="eventName"
            value={eventName}
            onChange={e => {
              setEventName(e.target.value);
              setEventNameError(e.target.value.trim().length < 2);
            }}
            label="Название события"
            variant="outlined"
            fullWidth
            InputLabelProps={{ shrink: true }}
            inputProps={{ autoComplete: 'off' }}
            error={eventNameError}
            helperText={eventNameError ? 'Название должно содержать не менее 2 символов' : ''}
          />

          {type === 'raffle' && (
            <TextField
              required
              id="eventRule"
              value={terms}
              label="Правила участия"
              variant="outlined"
              fullWidth
              onChange={e => setTerms(e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{ autoComplete: 'off' }}
            />
          )}

          <div className="flex gap-[12px] max-w-[292px]">
            <TextField
              inputRef={startTimeInputRef}
              id="start-time"
              placeholder="00:00"
              label="Время начала"
              value={startTime}
              onBlur={e => {
                const newStartTime = e.target.value;
                setStartTime(newStartTime);
                validateTimes(newStartTime, endTime);
              }}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              inputProps={{ autoComplete: 'off' }}
            />
            <TextField
              id="end-time"
              placeholder="00:00"
              inputRef={endTimeInputRef}
              label="Время окончания"
              value={endTime}
              onBlur={e => {
                const newEndTime = e.target.value;
                setEndTime(newEndTime);
                validateTimes(startTime, newEndTime);
              }}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              inputProps={{ autoComplete: 'off' }}
              error={!!endTimeError}
              helperText={endTimeError || ''}
            />
          </div>

          {type === 'raffle' && (
            <>
              <TextField
                required
                placeholder="00:00:00"
                inputRef={durationInputRef}
                id="duration"
                value={duration}
                label="Длительность розыгрыша"
                variant="outlined"
                onChange={e => setDuration(e.target.value)}
                onBlur={e => setDuration(e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{ autoComplete: 'off' }}
              />

              <div className="text-fg-primary text-[22px] leading-[28px]">Призы</div>

              {!showPrizeEditing &&
                prizes.map((prize, index) => (
                  <div className="flex min-h-[68px] justify-between" key={index}>
                    <div className="flex flex-col justify-between">
                      <div>Приз {index + 1}</div>
                      <div className="min-h-[40px] flex items-center">{prize.name}</div>
                    </div>
                    <div className="self-end">
                      <Fab
                        size="small"
                        onClick={() => {
                          setShowPrizeEditing(true);
                          setCurrentPrize(prize);
                        }}
                        sx={{
                          boxShadow: 'none',
                          backgroundColor: 'transparent',
                          ':hover': {
                            backgroundColor: 'transparent',
                            boxShadow: 'none',
                          },
                        }}
                      >
                        <CreateOutlined className="cursor-pointer" />
                      </Fab>
                      <Fab
                        size="small"
                        onClick={() => {
                          if (prize?.id) {
                            handleDeletePrize(+prize?.id);
                          }
                        }}
                        sx={{
                          boxShadow: 'none',
                          backgroundColor: 'transparent',
                          ':hover': {
                            backgroundColor: 'transparent',
                            boxShadow: 'none',
                          },
                        }}
                      >
                        <DeleteOutline className="cursor-pointer" />
                      </Fab>
                    </div>
                  </div>
                ))}

              {showPrizeEditing && (
                <div className="flex flex-col gap-[20px]">
                  <div>
                    Приз{' '}
                    {currentPrize?.id
                      ? prizes.findIndex(p => p.id === currentPrize.id) + 1
                      : prizes.length + 1}
                  </div>
                  <TextField
                    required
                    id="prizeName"
                    label="Название приза"
                    variant="outlined"
                    fullWidth
                    value={currentPrize?.name}
                    onChange={e => {
                      const name = e.target.value;
                      setCurrentPrize(prev => (prev ? { ...prev, name } : null));
                    }}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ autoComplete: 'off' }}
                  />
                  <Button
                    variant="contained"
                    color="info"
                    className="!rounded-full min-w-[163px] max-w-[256px] min-h-[40px] text-fg-button-secondary"
                    startIcon={!currentPrize?.image ? <CloudDownload /> : <Autorenew />}
                    component="label"
                  >
                    <span className="normal-case ">
                      {currentPrize?.image ? 'Изменить обложку приза' : 'Загрузите обложку приза'}
                    </span>
                    <input
                      type="file"
                      accept="image/png, image/jpeg"
                      hidden
                      onInput={e => {
                        e.preventDefault();
                        if (currentPrize) {
                          const file = e.currentTarget.files?.[0];
                          if (file) {
                            setCurrentPrize(prev => (prev ? { ...prev, image: file } : null));
                          }
                        }
                      }}
                    />
                  </Button>
                  <span className="text-xs mt-1">Лучше всего размер 318х456 px</span>

                  <div className="flex justify-between self-stretch md:self-end md:gap-[8px]">
                    <Button
                      variant="text"
                      color="primary"
                      className="!rounded-full min-w-[75px] min-h-[40px]"
                      onClick={() => {
                        setShowPrizeEditing(false);
                        setCurrentPrize(null);
                      }}
                    >
                      <span className="normal-case">Отмена</span>
                    </Button>
                    <Button
                      variant="text"
                      className="!rounded-full min-w-[75px] min-h-[40px]"
                      onClick={() => {
                        handleSaveCurrentPrize();
                        setShowPrizeEditing(false);
                        setCurrentPrize(null);
                      }}
                    >
                      <span className="normal-case">Сохранить приз</span>
                    </Button>
                  </div>
                </div>
              )}

              <Button
                variant="contained"
                disabled={isSaveDisabled}
                onClick={addPrize}
                color="primary"
                className="!rounded-full w-full md:w-fit min-h-[40px] text-fg-button-primary"
                startIcon={<Add />}
                component="label"
              >
                <span className="normal-case ">Добавить приз</span>
              </Button>
            </>
          )}
        </form>

        <div className="actions self-stretch md:self-end h-[88px] flex items-center justify-between md:justify-start md:gap-[8px]">
          <Button
            variant="text"
            color="primary"
            className="!rounded-full min-w-[75px] min-h-[40px]"
            onClick={handleClose}
          >
            <span className="normal-case">Отмена</span>
          </Button>
          <Button
            variant="contained"
            className="!rounded-full min-w-[75px] min-h-[40px]"
            disabled={isSaveDisabled}
            onClick={() => handleSave()}
          >
            <span className="normal-case">Сохранить</span>
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

export default CreateEventDialog;
