'use client'

import Link from 'next/link'

import { Card, CardContent, Typography, IconButton, Box, Stack } from '@mui/material'

import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import { useDraggable } from '@dnd-kit/core'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { useEffect, useState } from 'react'

import EditIcon from '@mui/icons-material/Edit'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

interface TestItem {
  id: string
  name: string
  createdAt: string
}

interface TestCardProps {
  subjectId: string
  test: TestItem
  onEditClick: (test: TestItem) => void
  onDeleteClick: (id: string) => void
  testsLength: number
}

export default function TestCard({ subjectId, test, onEditClick, onDeleteClick, testsLength }: TestCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: test.id,
    data: test // важно: чтобы DragOverlay знал что рисовать
  })

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const menuItems = [
    {
      id: 'edit',
      icon: <EditIcon fontSize="small" color="primary" />,
      text: 'Редактировать',
      onClick: () => onEditClick(test),
    },
    {
      id: 'copy',
      icon: <ContentCopyIcon fontSize="small" color={'action'} />,
      text: 'Копировать',
      onClick: () => console.log(test),
    },
    {
      id: 'delete',
      icon: <DeleteOutlineIcon fontSize="small" color="error" />,
      text: 'Удалить',
      onClick: () => onDeleteClick(test.id),
    },
  ];

  useEffect(() => {
    console.log(testsLength);
  }, [testsLength]);

  return (
    <div
      ref={setNodeRef}
      className={`
        w-full transition-[0.3s] m-0
        ${testsLength === 1 ? 'border-y-[2px]' : 'border-t-[2px]'}
        ${isDragging ? 'opacity-[0.4] cursor-grabbing inline-block' : 'opacity-1 cursor-default'}
        hover:shadow-md hover:bg-gray-100
      `}
    >
      <CardContent className='flex justify-between sm:items-center p-5 gap-2'>
        <Box className={'flex items-center gap-2'}>
          <Box
            className={'hidden lg:block'}
            {...listeners}
            {...attributes}
            sx={{
              cursor: 'grab'
            }}
          >
            <DragIndicatorIcon />
          </Box>

          <Box className={'flex-1 min-w-0'}>
            <Link
              href={`/teacher/${subjectId}/createTest/${test?.id}`}
              className={'text-[var(--custom-component-color)] text-[1fr] break-words hover:underline font-bold'}
            >
              {test.name}
            </Link>
            <Typography variant='body2' color='textSecondary' style={{ fontSize: '12px', marginTop: '8px' }}>
              Дата создания: {test.createdAt}
            </Typography>
          </Box>
        </Box>
        <Stack direction='row' spacing={1} className={'flex justify-end'}>
          <div>
            <IconButton
              aria-label="more"
              id="long-button"
              aria-controls={open ? 'long-menu' : undefined}
              aria-expanded={open ? 'true' : undefined}
              aria-haspopup="true"
              onClick={handleClick}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
            >
              {menuItems.map((option) => (
                <MenuItem key={option?.id} onClick={()=> {
                  handleClose();
                  option.onClick();
                }}>
                  {option.icon}
                </MenuItem>
              ))}
            </Menu>
          </div>
        </Stack>
      </CardContent>
    </div>
  )
}
