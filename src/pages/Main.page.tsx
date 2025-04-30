import { Button, ButtonGroup } from '@mui/material';
import Add from '@mui/icons-material/Add';
import { useState } from 'react';
import { Check } from '@mui/icons-material';
import { Link } from 'react-router-dom';

type Tab = 'all' | 'past' | 'current' | 'planed' | 'draft';

function MainPage() {
  const menu: { key: Tab; value: string }[] = [
    { key: 'all', value: 'Все' },
    { key: 'past', value: 'Прошедшие' },
    { key: 'current', value: 'Текущие' },
    { key: 'planed', value: 'Запланированные' },
    { key: 'draft', value: 'Черновики' },
  ];

  const [selectedTab, setSelectedTab] = useState<Tab>('all');

  return (
    <main className="h-full w-full pt-[40px] pl-[40px]">
      <div className="flex flex-col gap-[28px]">
        <div className="flex flex-col gap-[28px]">
          <span className="font-[600] text-[28px] leading-[36px]">Админка</span>
          <Button
            className="!rounded-full w-fit min-h-[40px] text-fg-button-primary"
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
          <ButtonGroup className="min-w-[929px] max-w-[966px] min-h-[40px] pr-[40px]">
            {menu.map((item, i) => (
              <Button
                key={item.key}
                sx={{
                  backgroundColor: selectedTab === item.key ? '#EDE7F6' : '#FFF',
                  border: '1px solid',
                  borderColor: '#79747E',
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

          <div className="w-full flex flex-col items-center pr-[40px]">
            {/* TODO list of events*/}
            <div className="min-h-[88px] w-full"></div>

            <div>Здесь ничего нет, создайте свой первый ивент</div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default MainPage;
