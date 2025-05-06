import './CustomListItem.css';
import { ListItem } from '@mui/material';
import React, { ReactNode } from 'react';

interface CustomListItemProps {
  leftContent: ReactNode;
  rightContent: ReactNode;
  additionalContent?: ReactNode;
  height?: string;
}

const CustomListItem: React.FC<CustomListItemProps> = ({
  leftContent,
  rightContent,
  height,
  additionalContent,
}) => {
  return (
    <>
      <ListItem
        sx={{
          backgroundColor: '#FEF7FF',
          minHeight: height || '72px',
          padding: '8px 16px 0 16px',
          alignItems: 'end',
          cursor: 'pointer',
          minWidth: '400px',
          containerType: 'inline-size',
          containerName: 'custom-list-item-container',
        }}
      >
        <div className="item flex gap-4 w-full justify-between items-center border-b-[1px] border-b-[#CAC4D0]">
          <div className="flex flex-col pb-[8px] gap-[4px]">{leftContent}</div>
          <div className="actions empty:hidden flex pb-[8px] pr-[16px] self-center ">
            {rightContent}
          </div>
        </div>
      </ListItem>
      {additionalContent}
    </>
  );
};

export default CustomListItem;
