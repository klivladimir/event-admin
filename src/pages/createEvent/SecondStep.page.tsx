import { Add, CreateOutlined, DeleteOutline } from '@mui/icons-material';
import { Button, Fab, List } from '@mui/material';
import React from 'react';
import CreateEventDialog from '../../dialogs/CreateEvent.dialog';
import { Activity, Raffle } from '../../types';
import { v4 as uuidv4 } from 'uuid';
import { ActivityList } from '../../types/activity.type';
import { RaffleList } from '../../types/raffle.type';
import CustomListItem from '../../components/CustomListItem';

function SecondStepPage({
  activityList,
  setActivityList,
  raffleList,
  setRaffleList,
  onSubmit,
}: {
  activityList: ActivityList;
  setActivityList: React.Dispatch<React.SetStateAction<ActivityList>>;
  raffleList: RaffleList;
  setRaffleList: React.Dispatch<React.SetStateAction<RaffleList>>;
  onSubmit: () => void;
}) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [dialogType, setDialogType] = React.useState<'activity' | 'raffle'>('activity');
  const [selectedItem, setSelectedItem] = React.useState<Activity | Raffle | null>(null);

  const isSaveDisabled = activityList.length === 0 && raffleList.length === 0;

  const handleClickOpen = (type: 'activity' | 'raffle', item?: Activity | Raffle) => {
    console.log([raffleList, activityList]);
    setDialogType(type);
    setIsDialogOpen(true);
    if (item) {
      setSelectedItem(item);
    }
  };

  const handleClose = (data?: Activity | Raffle) => {
    setIsDialogOpen(false);
    if (!data) {
      setSelectedItem(null);
      return;
    }

    if (dialogType === 'activity') {
      if (selectedItem) {
        setActivityList(prev =>
          prev.map(activity =>
            activity.id === (selectedItem as Activity).id ? { ...activity, ...data } : activity
          )
        );
      } else {
        const activityData = data as Activity;
        setActivityList(prev => [...prev, { ...activityData, id: uuidv4() }]);
      }
    } else {
      if (selectedItem) {
        setRaffleList(prev =>
          prev.map(raffle => (raffle.id === selectedItem.id ? { ...raffle, ...data } : raffle))
        );
      } else {
        const raffleData = data as Raffle;
        setRaffleList(prev => [...prev, { ...raffleData, id: uuidv4() }]);
      }
    }
    setSelectedItem(null);
  };

  return (
    <>
      <div className="flex flex-col gap-[57px] p-[40px]">
        <div className="flex justify-between items-center min-w-[425px] max-w-[425px]">
          <span>Шаг 2 из 2</span>
          <Button
            variant="contained"
            color="primary"
            className="!rounded-full min-w-[163px] min-h-[40px]"
            onClick={onSubmit}
            disabled={isSaveDisabled}
          >
            <span className="normal-case">Сохранить</span>
          </Button>
        </div>
        <div className="mt-[51px] flex flex-col gap-[4px]">
          <span className="text-[22px] leading-[28px]">Программа ивента</span>
          <span className="text-[14px] leading-[20px]">
            Расписание ваших активностей. Для создания ивента надо создать хотя бы один розыгрыш или
            событие
          </span>
        </div>

        <div className="flex gap-[47px]">
          <Button
            onClick={() => handleClickOpen('activity')}
            variant="contained"
            color="info"
            startIcon={<Add />}
            className="!rounded-full min-w-[202px] min-h-[40px] text-fg-button-secondary"
          >
            <span className="normal-case">Добавить событие</span>
          </Button>
          <Button
            onClick={() => handleClickOpen('raffle')}
            variant="contained"
            color="info"
            startIcon={<Add />}
            className="!rounded-full min-w-[202px] min-h-[40px] text-fg-button-secondary"
          >
            <span className="normal-case">Добавить розыгрыш</span>
          </Button>
        </div>

        {isDialogOpen && (
          <CreateEventDialog
            open={isDialogOpen}
            onClose={handleClose}
            type={dialogType}
            data={selectedItem}
          />
        )}
      </div>

      <div className="flex flex-col gap-[18px] pl-[40px]">
        {(activityList.length > 0 || raffleList.length > 0) && (
          <List>
            {[...activityList, ...raffleList]

              .sort((a, b) => {
                const startA = Number(a.start?.replace(/:/g, ''));
                const startB = Number(b.start?.replace(/:/g, ''));

                return startA - startB;
              })
              .map((item: Activity | Raffle) => (
                <div key={item.id}>
                  <CustomListItem
                    leftContent={
                      <>
                        <span className="text-[16px] leading-[24px] text-fg-primary">
                          {item.name}
                        </span>
                        <span className="text-[14px] leading-[20px] text-fg-secondary">
                          {item.start} - {item.end}
                        </span>
                      </>
                    }
                    rightContent={
                      <>
                        <Fab
                          size="small"
                          onClick={() => {
                            if ('duration' in item) {
                              handleClickOpen('raffle', item);
                            } else {
                              handleClickOpen('activity', item);
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
                          <CreateOutlined className="cursor-pointer" />
                        </Fab>
                        <Fab
                          size="small"
                          onClick={() => {
                            if ('duration' in item) {
                              setRaffleList(prev => prev.filter(r => r.id !== item.id));
                            } else {
                              setActivityList(prev => prev.filter(a => a.id !== item.id));
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
                      </>
                    }
                  />
                </div>
              ))}
          </List>
        )}
      </div>
    </>
  );
}

export default SecondStepPage;
