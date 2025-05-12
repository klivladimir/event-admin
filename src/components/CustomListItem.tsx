import { ListItem, Box } from '@mui/material';
import React, { ReactNode } from 'react';

interface CustomListItemProps {
  leftContent: ReactNode;
  rightContent: ReactNode;
  additionalContent?: ReactNode;
  height?: string;
  keepRowOnSmallScreens?: boolean;
}

const CustomListItem: React.FC<CustomListItemProps> = ({
  leftContent,
  rightContent,
  height,
  additionalContent,
  keepRowOnSmallScreens,
}) => {
  return (
    <>
      <ListItem
        sx={{
          backgroundColor: '#FEF7FF',
          minHeight: height || '72px',
          padding: '12px 16px 0 16px',
          alignItems: 'end',
          cursor: 'pointer',
        }}
      >
        <div
          className={`flex ${
            keepRowOnSmallScreens
              ? 'flex-row justify-between items-center'
              : 'flex-col items-start sm:flex-row sm:items-center sm:justify-between'
          } gap-4 w-full border-b-[1px] border-b-[#CAC4D0] ${
            additionalContent ? 'border-b-0' : ''
          }`}
        >
          <div className="flex flex-col pb-[8px] gap-[4px] whitespace-normal sm:whitespace-nowrap">
            {leftContent}
          </div>
          <Box
            className="empty:hidden self-end md:self-center"
            sx={{
              display: 'flex',
              paddingBottom: '12px',
              width: { xs: '100%', md: 'fit-content' },
              justifyContent: { sm: 'flex-end', md: 'initial' },
            }}
          >
            {rightContent}
          </Box>
        </div>
      </ListItem>
      {additionalContent}
    </>
  );
};

export default CustomListItem;
