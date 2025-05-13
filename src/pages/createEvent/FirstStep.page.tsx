import { CloudDownload, Delete } from '@mui/icons-material';
import { Button, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { Link } from 'react-router-dom';
import { maskitoTimeOptionsGenerator } from '@maskito/kit';
import { useMaskito } from '@maskito/react';
import * as luxon from 'luxon';
import { CreateEventRequest, EventFormData } from '../../types';
import { createEvent } from '../../api/events';
import { useState } from 'react';

const timeMask = maskitoTimeOptionsGenerator({ mode: 'HH:MM' });

function FirstStepPage({
  form,
  setForm,
}: {
  form: EventFormData;
  setForm: React.Dispatch<React.SetStateAction<EventFormData>>;
}) {
  const startTimeInputRef = useMaskito({ options: timeMask });
  const endTimeInputRef = useMaskito({ options: timeMask });
  const [endTimeError, setEndTimeError] = useState<string | null>(null);

  const handleChange = (field: keyof EventFormData, value: unknown) => {
    setForm(prev => ({ ...prev, [field]: value }));

    if (field === 'eventDate' && luxon.DateTime.isDateTime(value)) {
      const formattedDate = value?.toISO();
      let newDate = luxon.DateTime.fromISO(formattedDate!);
      if (form.eventTime) {
        const [hours, minutes] = form.eventTime.split(':').map(Number);
        newDate = newDate.set({ hour: hours, minute: minutes });
      }
      setForm(prev => ({ ...prev, date: newDate.toISO(), eventDate: value }));
    }

    if (field === 'eventTime' && typeof value === 'string') {
      const timeValue = value as string;
      setForm(prev => ({ ...prev, eventTime: timeValue }));
      if (form.eventDate && luxon.DateTime.isDateTime(form.eventDate)) {
        const [hours, minutes] = timeValue.split(':').map(Number);
        const updatedDate = form.eventDate.set({ hour: hours, minute: minutes }).toISO();
        setForm(prev => ({ ...prev, date: updatedDate }));
      }
      if (form.endTime) {
        const startTimeParts = timeValue.split(':').map(Number);
        const endTimeParts = form.endTime.split(':').map(Number);
        const startTimeTotalMinutes = startTimeParts[0] * 60 + startTimeParts[1];
        const endTimeTotalMinutes = endTimeParts[0] * 60 + endTimeParts[1];
        if (endTimeTotalMinutes < startTimeTotalMinutes) {
          setEndTimeError('Время окончания не может быть раньше времени начала');
        } else {
          setEndTimeError(null);
        }
      }
    }

    if (field === 'endTime' && typeof value === 'string') {
      const timeValue = value as string;
      setForm(prev => ({ ...prev, endTime: timeValue }));
      if (form.eventTime) {
        const startTimeParts = form.eventTime.split(':').map(Number);
        const endTimeParts = timeValue.split(':').map(Number);
        const startTimeTotalMinutes = startTimeParts[0] * 60 + startTimeParts[1];
        const endTimeTotalMinutes = endTimeParts[0] * 60 + endTimeParts[1];

        if (endTimeTotalMinutes < startTimeTotalMinutes) {
          setEndTimeError('Время окончания не может быть раньше времени начала');
        } else {
          setEndTimeError(null);
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
    if (!form.eventDate || !form.image) {
      console.error('Form validation failed: eventDate or image is missing.');
      return;
    }
    const data = {
      name: form.name,
      date: form.eventDate.toFormat('yyyy-MM-dd'),
      startTime: form.eventTime,
      endTime: form.endTime,
      shortDescription: form.shortDescription,
      description: form.description,
      address: form.address,
      image: form.image,
    } satisfies CreateEventRequest;
    console.log('Отправка данных на сервер:', data);
    createEvent(data);
  };

  const isNextStepDisabled =
    !form.name ||
    !form.eventDate ||
    !form.eventTime ||
    !form.endTime ||
    !form.shortDescription ||
    !form.description ||
    !form.address ||
    !form.image ||
    !!endTimeError;

  return (
    <div className="flex flex-col gap-[57px] pt-[26px] px-[12px] pb-[12px] md:px-[40px] md:pb-[40px] w-full md:w-[505px]">
      <div className="flex justify-between items-center">
        <span>Шаг 1 из 2</span>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="../second"
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
          helperText="Это публичное название. Его все увидят"
          value={form.name}
          onChange={e => handleChange('name', e.target.value)}
          onBlur={e => handleChange('name', e.target.value)}
          inputProps={{ autoComplete: 'off' }}
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
                <input type="file" hidden onChange={handleFileChange} />
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
          id="eventTime"
          label="Время начала ивента"
          variant="outlined"
          inputRef={startTimeInputRef}
          fullWidth
          disabled={!form.eventDate}
          helperText="Это местное время. Того места где вы находитесь"
          value={form.eventTime}
          onChange={e => handleChange('eventTime', e.target.value)}
          onBlur={e => handleChange('eventTime', e.target.value)}
          inputProps={{ autoComplete: 'off' }}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          required
          id="endTime"
          label="Время окончания ивента"
          variant="outlined"
          inputRef={endTimeInputRef}
          fullWidth
          disabled={!form.eventDate}
          helperText={endTimeError || 'Это местное время. Того места где вы находитесь'}
          value={form.endTime}
          onChange={e => handleChange('endTime', e.target.value)}
          onBlur={e => handleChange('endTime', e.target.value)}
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
