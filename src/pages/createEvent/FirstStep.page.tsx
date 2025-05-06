import { CloudDownload, Delete } from '@mui/icons-material';
import { Button, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { Link } from 'react-router-dom';
import { maskitoTimeOptionsGenerator } from '@maskito/kit';
import { useMaskito } from '@maskito/react';
import * as luxon from 'luxon';

const timeMask = maskitoTimeOptionsGenerator({ mode: 'HH:MM' });

function FirstStepPage({
  form,
  setForm,
}: {
  form: import('../../types').Event;
  setForm: React.Dispatch<React.SetStateAction<import('../../types').Event>>;
}) {
  const startTimeInputRef = useMaskito({ options: timeMask });

  const handleChange = (field: string, value: unknown) => {
    if (field === 'eventDate' && luxon.DateTime.isDateTime(value)) {
      const formattedDate = value?.toISO();
      setForm(prev => ({ ...prev, date: formattedDate }));
    }
    if (field === 'eventTime' && value) {
      const date = form.eventDate;
      if (luxon.DateTime.isDateTime(date)) {
        const formattedDate = date
          .set({
            hour: Number((value as string).split(':')[0]),
            minute: Number((value as string).split(':')[1]),
          })
          .toISO();
        setForm(prev => ({ ...prev, date: formattedDate }));
      }
    }
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm(prev => ({ ...prev, cover: e.target.files![0] }));
    }
  };

  const isNextStepDisabled =
    !form.title ||
    !form.eventDate ||
    !form.eventTime ||
    !form.shortDescription ||
    !form.longDescription ||
    !form.address ||
    !form.cover;

  return (
    <div className="flex flex-col gap-[57px] max-w-[425px] p-[40px]">
      <div className="flex justify-between items-center">
        <span>Шаг 1 из 2</span>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="../second"
          className="!rounded-full min-w-[163px] min-h-[40px] text-fg-button-primary"
          disabled={isNextStepDisabled}
        >
          <span className="normal-case">Далее</span>
        </Button>
      </div>
      <form className="flex flex-col gap-[28px]">
        <TextField
          required
          id="eventName"
          label="Название эвента"
          variant="outlined"
          fullWidth
          helperText="Это публичное название. Его все увидят"
          value={form.title}
          onChange={e => handleChange('eventName', e.target.value)}
          onBlur={e => handleChange('eventName', e.target.value)}
        />
        <div className="max-w-[312px]">
          <DatePicker
            value={form.eventDate}
            disablePast
            onChange={date => handleChange('eventDate', date)}
          />
        </div>
        <div className="max-w-[312px]">
          {!form?.cover && (
            <div className="flex flex-col gap-[14px]">
              <Button
                variant="contained"
                color="info"
                className="!rounded-full min-w-[163px] max-w-[256px] min-h-[40px] text-fg-button-secondary"
                startIcon={<CloudDownload />}
                component="label"
              >
                <span className="normal-case ">Загрузите обложку события</span>
                <input type="file" hidden onChange={handleFileChange} />
              </Button>
              <span className="text-xs mt-1">Лучше всего размер 1110х468 px</span>
            </div>
          )}

          {form?.cover && (
            <div className="flex flex-col gap-[14px]">
              <Button
                variant="contained"
                color="info"
                className="!rounded-full min-w-[163px] max-w-[256px] min-h-[40px] text-black"
                startIcon={<Delete />}
                component="label"
                onClick={() => setForm(prev => ({ ...prev, cover: null }))}
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
        />
        <TextField
          required
          id="longDescription"
          label="Длинное описание ивента (дискрипшон)"
          variant="outlined"
          fullWidth
          helperText="Показывается внутри ивента"
          value={form.longDescription}
          onChange={e => handleChange('longDescription', e.target.value)}
          onBlur={e => handleChange('longDescription', e.target.value)}
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
        />
      </form>
    </div>
  );
}

export default FirstStepPage;
