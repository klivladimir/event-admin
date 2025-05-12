import { useMaskito } from '@maskito/react';
import { Button, Dialog, Fab, TextField } from '@mui/material';
import { useState, useEffect } from 'react';
import { maskitoTimeOptionsGenerator } from '@maskito/kit';
import { Activity } from '../types/activity.type';
import { Raffle } from '../types/raffle.type';
import { Add, Autorenew, CloudDownload, CreateOutlined, DeleteOutline } from '@mui/icons-material';
import { Prize, PrizeList } from '../types/prize.type';
import { v4 as uuidv4 } from 'uuid';

const timeMask = maskitoTimeOptionsGenerator({ mode: 'HH:MM' });

type DialogType = 'activity' | 'raffle';

type EventData = Activity | Raffle;

interface CreateEventDialogProps {
  open: boolean;
  onClose: (eventData?: EventData) => void;
  type: DialogType;
  data?: EventData | null;
}

function CreateEventDialog(props: CreateEventDialogProps) {
  const { onClose, open, type, data } = props;
  const startTimeInputRef = useMaskito({ options: timeMask });
  const endTimeInputRef = useMaskito({ options: timeMask });

  const [eventName, setEventName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [eventRule, setEventRule] = useState('');
  const [duration, setDuration] = useState('');
  const [prizes, setPrizes] = useState<PrizeList>([]);
  const [currentPrize, setCurrentPrize] = useState<Prize | null>(null);
  const [showPrizeEditing, setShowPrizeEditing] = useState<boolean>(false);

  useEffect(() => {
    if (data) {
      setEventName(data.name || '');
      setStartTime(data.start || '');
      setEndTime(data.end || '');
      if (type === 'raffle') {
        const raffleData = data as Raffle;
        setEventRule(raffleData.rule || '');
        setDuration(raffleData.duration || '');
        setPrizes(raffleData.prizes || []);
      }
    } else {
      setEventName(type === 'activity' ? 'Событие' : 'Розыгрыш');
      setStartTime('');
      setEndTime('');
      setEventRule('');
      setDuration('');
    }
  }, [data, type]);

  const handleClose = () => {
    setEventName('');
    setStartTime('');
    setEndTime('');
    setEventRule('');
    setDuration('');
    onClose();
  };

  const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const baseEventData = {
      ...data,
      name: eventName,
      start: startTime,
      end: endTime,
      prizes: prizes,
    };

    const eventData =
      type === 'raffle'
        ? ({ ...baseEventData, rule: eventRule, duration, prizes: prizes } satisfies Raffle)
        : baseEventData;

    onClose(eventData);
  };

  const isSaveDisabled =
    type === 'raffle'
      ? !eventName.trim() ||
        !startTime.trim() ||
        !endTime.trim() ||
        !eventRule.trim() ||
        !duration.trim()
      : !eventName.trim() || !startTime.trim() || !endTime.trim();

  function addPrize(): void {
    setShowPrizeEditing(true);
    const newPrize: Prize = {
      id: null,
      name: '',
      cover: null,
    };
    setCurrentPrize(newPrize);
  }

  function handleSaveCurrentPrize(prize: Prize | null): void {
    if (!prize) return;

    if (prize.id) {
      setPrizes(prev =>
        prev.map(p => {
          if (p.id === prize.id) {
            return { ...p, name: prize.name, cover: prize.cover };
          }
          return p;
        })
      );
    } else {
      const newId = uuidv4();
      setPrizes(prev => [...prev, { id: newId, name: prize.name || '', cover: prize.cover }]);
    }
  }

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
            {data ? 'Редактирование' : 'Создание'}{' '}
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
            onChange={e => setEventName(e.target.value)}
            label="Название события"
            variant="outlined"
            fullWidth
            InputLabelProps={{ shrink: true }}
            inputProps={{ autoComplete: 'off' }}
          />

          {type === 'raffle' && (
            <TextField
              required
              id="eventRule"
              value={eventRule}
              label="Правила участия"
              variant="outlined"
              fullWidth
              onChange={e => setEventRule(e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{ autoComplete: 'off' }}
            />
          )}

          <div className="flex gap-[12px] max-w-[292px]">
            <TextField
              inputRef={startTimeInputRef}
              id="start-time"
              label="Время начала"
              value={startTime}
              onBlur={e => setStartTime(e.target.value)}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              inputProps={{ autoComplete: 'off' }}
            />
            <TextField
              id="end-time"
              inputRef={endTimeInputRef}
              label="Время окончания"
              value={endTime}
              onBlur={e => setEndTime(e.target.value)}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              inputProps={{ autoComplete: 'off' }}
            />
          </div>

          {type === 'raffle' && (
            <>
              <TextField
                required
                id="duration"
                value={duration}
                label="Длительность розыгрыша"
                variant="outlined"
                onChange={e => setDuration(e.target.value)}
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
                          setPrizes(prev => prev.filter(p => p.id !== prize.id));
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
                    startIcon={!currentPrize?.cover ? <CloudDownload /> : <Autorenew />}
                    component="label"
                  >
                    <span className="normal-case ">
                      {currentPrize?.cover ? 'Изменить обложку приза' : 'Загрузите обложку приза'}
                    </span>
                    <input
                      type="file"
                      hidden
                      onInput={e => {
                        e.preventDefault();
                        if (currentPrize) {
                          const file = e.currentTarget.files?.[0];
                          console.log(file);
                          if (file) {
                            setCurrentPrize(prev => (prev ? { ...prev, cover: file } : null));
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
                        handleSaveCurrentPrize(currentPrize);
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
            onClick={handleSubmit}
          >
            <span className="normal-case">Сохранить</span>
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

export default CreateEventDialog;
