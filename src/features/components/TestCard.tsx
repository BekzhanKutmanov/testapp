'use client'

import Link from 'next/link'

import { Card, CardContent, Typography, IconButton, Box, Stack } from '@mui/material'

import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import { useDraggable } from '@dnd-kit/core'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState } from 'react';

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
}

export default function TestCard({ subjectId, test, onEditClick, onDeleteClick }: TestCardProps) {
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

  return (
    <Card
      ref={setNodeRef}
      variant='outlined'
      sx={{
        width: '100%',
        transition: '0.3s',
        borderRadius: 2,
        opacity: isDragging ? 0.4 : 1,   // оригинал "гаснет", а не дёргается transform'ом
        cursor: isDragging ? 'grabbing' : 'default',
        '&:hover': {
          boxShadow: theme => theme.shadows[4],
          borderColor: 'primary.main'
        }
      }}
    >
      <CardContent className='flex justify-between sm:items-center flex-col sm:flex-row p-3 sm:p-4 md:p-5 gap-2'>
        <Box
          className={'hidden lg:block'}
          // ref={setNodeRef}
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
            className={'text-[var(--custom-component-color)] text-lg break-words hover:underline font-medium'}
          >
            {test.name}
          </Link>
          <Typography variant='body2' color='textSecondary' style={{ fontSize: '12px' }}>
            Дата создания: {test.createdAt}
          </Typography>
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
                  {/*<Typography sx={{ ml: 1 }}>*/}
                  {/*  {option.text}*/}
                  {/*</Typography>*/}
                </MenuItem>
              ))}
            </Menu>
          </div>
          {/*<IconButton*/}
          {/*  color='primary'*/}
          {/*  onClick={() => onEditClick(test)}*/}
          {/*  size='medium'*/}
          {/*  sx={{ backgroundColor: 'action.hover' }}*/}
          {/*  title='Редактировать'*/}
          {/*>*/}
          {/*  <EditIcon fontSize='small' />*/}
          {/*</IconButton>*/}
          {/*<IconButton*/}
          {/*  color='error'*/}
          {/*  onClick={() => onDeleteClick(test.id)}*/}
          {/*  size='medium'*/}
          {/*  sx={{ backgroundColor: 'error.lighter', '&:hover': { backgroundColor: 'error.light' } }}*/}
          {/*  title='Удалить'*/}
          {/*>*/}
          {/*  <DeleteOutlineIcon fontSize='small' />*/}
          {/*</IconButton>*/}
        </Stack>
      </CardContent>
    </Card>
  )
}
