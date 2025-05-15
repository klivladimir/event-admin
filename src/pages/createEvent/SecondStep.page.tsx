import { Add, CreateOutlined, DeleteOutline } from '@mui/icons-material';
import { Button, Fab, List } from '@mui/material';
import React, { useEffect } from 'react';
import { deleteRaffle, deleteSubEvent } from '../../api/events';
import CustomListItem from '../../components/CustomListItem';
import CreateEventDialog from '../../dialogs/CreateEvent.dialog';
import { Raffle, SubEvent } from '../../types';
import { RaffleList } from '../../types/raffle.type';
import { SubEventList } from '../../types/subEvent.type';

function SecondStepPage({
  subEventsList,
  raffleList,
  updateSubEventList,
  onSubmit,
}: {
  subEventsList: SubEventList;

  raffleList: RaffleList;
  updateSubEventList: React.Dispatch<unknown>;
  onSubmit: () => void;
}) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [dialogType, setDialogType] = React.useState<'activity' | 'raffle'>('activity');
  const [selectedItem, setSelectedItem] = React.useState<SubEvent | Raffle | null>(null);

  const isSaveDisabled = subEventsList.length === 0 && raffleList.length === 0;

  const handleClickOpen = (type: 'activity' | 'raffle', item?: SubEvent | Raffle) => {
    setDialogType(type);
    setIsDialogOpen(true);
    if (item) {
      setSelectedItem(item);
    }
  };

  useEffect(() => {
    updateSubEventList(null);
  }, []);

  async function handleClose() {
    setIsDialogOpen(false);
    setSelectedItem(null);
    updateSubEventList(null);
  }

  return (
    <>
      <div className="flex flex-col gap-[29px] pt-[26px] px-[12px] pb-[0] md:px-[40px]">
        <div className="flex justify-between items-center max-w-[450px] mb-[22px]">
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
        <div className="flex flex-col gap-[4px]">
          <span className="text-[22px] leading-[28px]">Программа ивента</span>
          <span className="text-[14px] leading-[20px]">
            Расписание ваших активностей. Для создания ивента надо создать хотя бы один розыгрыш или
            событие
          </span>
        </div>

        <div className="flex flex-col gap-[12px] w-full md:flex-row md:gap-[47px] md:w-fit md:flex-nowrap md:self-start">
          <Button
            onClick={() => handleClickOpen('activity')}
            variant="contained"
            color="info"
            startIcon={<Add />}
            className="!rounded-full min-w-[202px] min-h-[40px] text-fg-button-secondary"
            disableElevation
          >
            <span className="normal-case">Добавить событие</span>
          </Button>
          <Button
            onClick={() => handleClickOpen('raffle')}
            variant="contained"
            color="info"
            startIcon={<Add />}
            className="!rounded-full min-w-[202px] min-h-[40px] text-fg-button-secondary"
            disableElevation
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
            raffleList={raffleList}
            onUpdate={() => updateSubEventList(null)}
          />
        )}
      </div>

      <div className="flex flex-col gap-[18px] pl-[12px] md:pl-[40px]">
        {(subEventsList.length > 0 || raffleList.length > 0) && (
          <List>
            {[...subEventsList, ...raffleList]

              .sort((a, b) => {
                const getNumericTime = (dateTimeStr?: string): number => {
                  if (!dateTimeStr) {
                    return NaN;
                  }
                  const timePart = dateTimeStr.substring(11);
                  return Number(timePart.replace(/:/g, ''));
                };

                const numTimeA = getNumericTime(a.startTime);
                const numTimeB = getNumericTime(b.startTime);

                if (isNaN(numTimeA) && isNaN(numTimeB)) return 0;
                if (isNaN(numTimeA)) return 1;
                if (isNaN(numTimeB)) return -1;

                return numTimeA - numTimeB;
              })
              .map((item: SubEvent | Raffle) => (
                <div key={item.id}>
                  <CustomListItem
                    keepRowOnSmallScreens={true}
                    leftContent={
                      <>
                        <span className="text-[16px] leading-[24px] text-fg-primary">
                          {item.name}
                        </span>
                        <span className="text-[14px] leading-[20px] text-fg-secondary">
                          {item.startTime ? item.startTime.substring(11, 16) : ''} -
                          {item.endTime ? item.endTime.substring(11, 16) : ''}
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
                            if ('duration' in item && item.id) {
                              deleteRaffle(item.id).then(() => {
                                updateSubEventList(null);
                              });
                            } else {
                              deleteSubEvent(item.id).then(() => {
                                updateSubEventList(null);
                              });
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
