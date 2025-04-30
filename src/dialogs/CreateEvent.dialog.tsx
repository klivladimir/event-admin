import { useMaskito } from '@maskito/react';
import { Button, Dialog, TextField } from '@mui/material';
import { useState, useEffect } from 'react';
import { maskitoTimeOptionsGenerator } from '@maskito/kit';
import { Activity } from '../types/activity.type';
import { Raffle } from '../types/raffle.type';

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

  useEffect(() => {
    if (data) {
      setEventName(data.name || '');
      setStartTime(data.start || '');
      setEndTime(data.end || '');
      if (type === 'raffle') {
        const raffleData = data as Raffle;
        setEventRule(raffleData.rule || '');
        setDuration(raffleData.duration || '');
      }
    } else {
      setEventName('');
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
    };

    const eventData = type === 'raffle'
      ? { ...baseEventData, rule: eventRule, duration }
      : baseEventData;

    onClose(eventData);
  };

  const isSaveDisabled = type === 'raffle'
    ? !eventName.trim() || !startTime.trim() || !endTime.trim() || !eventRule.trim() || !duration.trim()
    : !eventName.trim() || !startTime.trim() || !endTime.trim();

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      sx={{
        backgroundColor: '#A3A3A3',
      }}
    >
      <div className="min-w-[560px] flex flex-col p-[24px] bg-[#ECE6F0]">
        <div className="flex flex-col gap-[16px]">
          <span className="self-center text-[24px] leading-[32px]">
            {data ? 'Редактирование' : 'Создание'} {type === 'activity' ? 'события расписания' : 'розыгрыша'}
          </span>
          <span className="text-[14px] leading-[20px]">
            A dialog is a type of modal window that appears in front of app content to provide
            critical information, or prompt for a decision to be made.
          </span>
        </div>

        <form className="flex flex-col gap-[44px] mt-[24px] px-[20px]">
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
            />
            <TextField
              id="end-time"
              inputRef={endTimeInputRef}
              label="Время окончания"
              value={endTime}
              onBlur={e => setEndTime(e.target.value)}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            />
          </div>

          {type === 'raffle' && (
            <TextField
              required
              id="duration"
              value={duration}
              label="Длительность"
              variant="outlined"
              onChange={e => setDuration(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          )}
        </form>

        <div className="actions self-end h-[88px] gap-[8px] flex items-center">
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