'use client';

import { Box } from '@mui/material'
import CustomSelect from '@/shared/ui/components/CustomSelect'

import Select, { type SelectChangeEvent } from '@mui/material/Select'

import MenuItem from '@mui/material/MenuItem'
import React from 'react'

export default function SubjectSelect ({selectedSubjectId, setSelectedSubjectId, subjects}: {selectedSubjectId: number | null, setSelectedSubjectId: (value: number)=> void , subjects: SubjectType[]}) {
  return <Box className={'flex flex-col gap-1 max-w-[140px] overflow-hidden'}>
    <Select
      value={String(selectedSubjectId)}
      onChange={(e:SelectChangeEvent) => setSelectedSubjectId(Number(e.target.value))}
      sx={{
        // width: '100%',
        // Настраиваем размер через внутренние отступы и размер шрифта
        '& .MuiSelect-select': {
          padding: '8px 12px', // Вертикальный и горизонтальный padding
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
        },
        // Изменяем размер и положение иконки стрелочки
        '& .MuiSelect-icon': {
          top: 'calc(50% - 12px)', // Центрируем иконку
        },
      }}
    >
      {
        subjects?.map((subject)=> {
          return <MenuItem key={subject?.id} value={subject?.id}>{subject?.name}</MenuItem>
        })
      }
    </Select>
  </Box>
}
