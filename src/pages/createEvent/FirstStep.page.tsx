import { maskitoTimeOptionsGenerator } from '@maskito/kit';
import { useMaskito } from '@maskito/react';
import { CloudDownload, Delete } from '@mui/icons-material';
import { Button, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import * as luxon from 'luxon';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrUpdateEvent } from '../../api/events';
import { CreateEventRequest, EventFormData } from '../../types';

const timeMask = maskitoTimeOptionsGenerator({ mode: 'HH:MM' });

function FirstStepPage({
  form,
  setForm,
}: {
  form: EventFormData;
  setForm: React.Dispatch<React.SetStateAction<EventFormData>>;
}) {
  const startTimeInputRef = useMaskito({ options: timeMask });
  const navigate = useNavigate();
  const endTimeInputRef = useMaskito({ options: timeMask });
  const [endTimeError, setEndTimeError] = useState<string | null>(null);
  const [startTimeError, setStartTimeError] = useState<string | null>(null);
  const [eventNameError, setEventNameError] = useState<boolean>(false);

  const handleChange = (field: keyof EventFormData, value: unknown) => {
    setForm(prev => ({ ...prev, [field]: value }));

    if (field === 'name' && typeof value === 'string') {
      setEventNameError(value.trim().length < 2);
    }

    if (field === 'eventDate' && luxon.DateTime.isDateTime(value)) {
      const formattedDate = value?.toISO();
      let newDate = luxon.DateTime.fromISO(formattedDate!);
      if (form.eventStartTime) {
        const [hours, minutes] = form.eventStartTime.split(':').map(Number);
        newDate = newDate.set({ hour: hours, minute: minutes });
      }
      setForm(prev => ({ ...prev, date: newDate.toISO(), eventDate: value }));
    }

    if (field === 'eventStartTime' && typeof value === 'string') {
      const timeValue = value as string;
      setForm(prev => ({ ...prev, eventTime: timeValue }));

      if (timeValue.length < 5) {
        setStartTimeError('Время начала должно быть заполнено полностью (ЧЧ:ММ)');
      } else {
        setStartTimeError(null);
      }

      if (form.eventDate && luxon.DateTime.isDateTime(form.eventDate)) {
        const [hours, minutes] = timeValue.split(':').map(Number);
        const updatedDate = form.eventDate.set({ hour: hours, minute: minutes }).toISO();
        setForm(prev => ({ ...prev, date: updatedDate }));
      }
      if (form.eventEndTime && timeValue.length === 5 && form.eventEndTime.length === 5) {
        const startTimeParts = timeValue.split(':').map(Number);
        const endTimeParts = form.eventEndTime.split(':').map(Number);
        const startTimeTotalMinutes = startTimeParts[0] * 60 + startTimeParts[1];
        const endTimeTotalMinutes = endTimeParts[0] * 60 + endTimeParts[1];
        if (endTimeTotalMinutes <= startTimeTotalMinutes) {
          setEndTimeError('Время окончания не может быть раньше или равно времени начала');
        } else {
          setEndTimeError(null);
        }
      } else if (form.eventEndTime && form.eventEndTime.length < 5) {
        setEndTimeError('Время окончания должно быть заполнено полностью (ЧЧ:ММ)');
      } else if (form.eventEndTime && timeValue.length === 5 && form.eventEndTime.length === 5) {
        setEndTimeError(null);
      }
    }

    if (field === 'eventEndTime' && typeof value === 'string') {
      const timeValue = value as string;
      setForm(prev => ({ ...prev, endTime: timeValue }));

      if (timeValue.length < 5) {
        setEndTimeError('Время окончания должно быть заполнено полностью (ЧЧ:ММ)');
      } else {
        setEndTimeError(null); // Clear length error if format is correct
        if (form.eventStartTime && form.eventStartTime.length === 5) {
          const startTimeParts = form.eventStartTime.split(':').map(Number);
          const endTimeParts = timeValue.split(':').map(Number);
          const startTimeTotalMinutes = startTimeParts[0] * 60 + startTimeParts[1];
          const endTimeTotalMinutes = endTimeParts[0] * 60 + endTimeParts[1];

          if (endTimeTotalMinutes <= startTimeTotalMinutes) {
            setEndTimeError('Время окончания не может быть раньше или равно времени начала');
          } else {
            // Explicitly clear if no other error condition is met
            if (timeValue.length === 5) setEndTimeError(null);
          }
        } else if (form.eventStartTime && form.eventStartTime.length < 5) {
          setStartTimeError('Время начала должно быть заполнено полностью (ЧЧ:ММ)');
        }
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm(prev => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleCreateEvent = () => {
    if (!form.eventDate) {
      console.error('Form validation failed: eventDate is missing.');
      return;
    }

    const data: CreateEventRequest = {
      name: form.name,
      date: form.eventDate.toFormat('yyyy-MM-dd'),
      startTime: form.eventStartTime,
      endTime: form.eventEndTime,
      shortDescription: form.shortDescription,
      description: form.description,
      address: form.address,
    };

    if (form.image instanceof File) {
      data.image = form.image;
    }

    createOrUpdateEvent(data).then(res => {
      localStorage.setItem('currentEventId', JSON.stringify(res?.id));
      navigate('../second');
    });
  };

  const isNextStepDisabled =
    !form.name ||
    !form.eventDate ||
    !form.eventStartTime ||
    !form.eventEndTime ||
    !form.shortDescription ||
    !form.description ||
    !form.address ||
    !form.image ||
    !!endTimeError ||
    !!startTimeError ||
    eventNameError;

  return (
    <div className="flex flex-col gap-[57px] pt-[26px] px-[12px] pb-[12px] md:px-[40px] md:pb-[40px] w-full md:w-[505px]">
      <div className="flex justify-between items-center">
        <span>Шаг 1 из 2</span>
        <Button
          variant="contained"
          color="primary"
          className="!rounded-full min-w-[163px] min-h-[40px] text-fg-button-primary"
          disabled={isNextStepDisabled}
          onClick={() => handleCreateEvent()}
        >
          <span className="normal-case">Далее</span>
        </Button>
      </div>
      <form className="flex flex-col gap-[28px]">
        <TextField
          required
          id="title"
          label="Название эвента"
          variant="outlined"
          fullWidth
          helperText={
            eventNameError
              ? 'Название должно содержать не менее 2 символов'
              : 'Это публичное название. Его все увидят'
          }
          value={form.name}
          onChange={e => handleChange('name', e.target.value)}
          onBlur={e => handleChange('name', e.target.value)}
          inputProps={{ autoComplete: 'off' }}
          error={eventNameError}
        />
        <div className="max-w-[312px]">
          <DatePicker
            value={form.eventDate}
            disablePast
            onChange={date => handleChange('eventDate', date)}
          />
        </div>
        <div className="max-w-[312px]">
          {!form?.image && (
            <div className="flex flex-col gap-[14px]">
              <Button
                variant="contained"
                color="info"
                className="!rounded-full min-w-[163px] max-w-[256px] min-h-[40px] text-fg-button-secondary"
                startIcon={<CloudDownload />}
                component="label"
                disableElevation
              >
                <span className="normal-case ">Загрузите обложку события</span>
                <input
                  type="file"
                  hidden
                  onChange={handleFileChange}
                  accept="image/png, image/jpeg"
                />
              </Button>
              <span className="text-xs mt-1">Лучше всего размер 1110х468 px</span>
            </div>
          )}

          {form?.image && (
            <div className="flex flex-col gap-[14px]">
              <Button
                variant="contained"
                color="info"
                className="!rounded-full min-w-[163px] max-w-[256px] min-h-[40px] text-black"
                startIcon={<Delete />}
                component="label"
                onClick={() => setForm(prev => ({ ...prev, image: null }))}
              >
                <span className="normal-case ">Удалить обложку события</span>
              </Button>
              <span className="text-xs mt-1">Это обязательный пункт, придется загрузить новую</span>
            </div>
          )}
        </div>
        <TextField
          required
          id="eventStartTime"
          label="Время начала ивента"
          variant="outlined"
          inputRef={startTimeInputRef}
          fullWidth
          disabled={!form.eventDate}
          helperText={startTimeError || 'Это местное время. Того места где вы находитесь'}
          value={form.eventStartTime}
          onChange={e => handleChange('eventStartTime', e.target.value)}
          onBlur={e => handleChange('eventStartTime', e.target.value)}
          inputProps={{ autoComplete: 'off' }}
          InputLabelProps={{ shrink: true }}
          error={!!startTimeError}
        />
        <TextField
          required
          id="eventEndTime"
          label="Время окончания ивента"
          variant="outlined"
          inputRef={endTimeInputRef}
          fullWidth
          disabled={!form.eventDate}
          helperText={endTimeError || 'Это местное время. Того места где вы находитесь'}
          value={form.eventEndTime}
          onChange={e => handleChange('eventEndTime', e.target.value)}
          onBlur={e => handleChange('eventEndTime', e.target.value)}
          inputProps={{ autoComplete: 'off' }}
          error={!!endTimeError}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          required
          id="shortDescription"
          label="Краткое описание ивента (превью)"
          variant="outlined"
          fullWidth
          helperText="Показывается на карточке ивента"
          value={form.shortDescription}
          onChange={e => handleChange('shortDescription', e.target.value)}
          onBlur={e => handleChange('shortDescription', e.target.value)}
          inputProps={{ autoComplete: 'off' }}
        />
        <TextField
          required
          id="description"
          label="Длинное описание ивента (дискрипшон)"
          variant="outlined"
          fullWidth
          helperText="Показывается внутри ивента"
          value={form.description}
          onChange={e => handleChange('description', e.target.value)}
          onBlur={e => handleChange('description', e.target.value)}
          inputProps={{ autoComplete: 'off' }}
        />
        <TextField
          required
          id="address"
          label="Адрес ивента"
          variant="outlined"
          fullWidth
          helperText="Введите Страну, Город, Улицу"
          value={form.address}
          onChange={e => handleChange('address', e.target.value)}
          onBlur={e => handleChange('address', e.target.value)}
          inputProps={{ autoComplete: 'off' }}
        />
      </form>
    </div>
  );
}

export default FirstStepPage;
