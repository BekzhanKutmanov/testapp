'use client'


import { useQuery } from '@tanstack/react-query'

import { getSubjects } from '@/features/api/api'
import { Alert, Box } from '@mui/material'
import CustomSelect from '@/shared/ui/components/CustomSelect'
import MenuItem from '@mui/material/MenuItem'
import React, { useEffect, useState } from 'react'
import { type SelectChangeEvent } from '@mui/material/Select';

interface CopyExternalTestType {
  subjectId: number, externalSubjectId: ()=> void, externalTestId: ()=> void
}

export default function CopyExternalTest({subjectId, externalSubjectId, externalTestId}: CopyExternalTestType) {
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
  const [selectedTestId, setSelectedTestId] = useState<number | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['subjectKey'],
    queryFn: getSubjects,
  })

  const renderSubjectSelect = (subjects: SubjectType[])=> {
    return <Box className={'flex flex-col gap-1'}>
      <label className={'text-[var(--myDarkColor)]'}>Предметы</label>
      <CustomSelect
        sx={{ width: '30vw', height: '8vh', '& .MuiSelect-select': { padding: '1.5vh 1vw', fontSize: '3vh' } }}
        value={selectedSubjectId}
        onChange={(e:SelectChangeEvent) => setSelectedSubjectId(Number(e.target.value))}
      >
        {
          subjects?.map((subject)=> {
            return <MenuItem key={subject?.id} value={subject?.id}>{subject?.name}</MenuItem>
          })
        }
      </CustomSelect>
    </Box>
  }

  const renderTestSelect = (subjects: SubjectType[])=> {
    return <Box className={'flex flex-col gap-1'}>
      <label className={'text-[var(--myDarkColor)]'}>Тесты</label>
      <CustomSelect
        sx={{ width: '30vw', height: '8vh', '& .MuiSelect-select': { padding: '1.5vh 1vw', fontSize: '3vh' } }}
        value={selectedSubjectId}
        onChange={(e:SelectChangeEvent) => setSelectedSubjectId(Number(e.target.value))}
      >
        {
          subjects?.map((subject)=> {
            return <MenuItem key={subject?.id} value={subject?.id}>{subject?.name}</MenuItem>
          })
        }
      </CustomSelect>
    </Box>
  }

  useEffect(() => {
    if(data?.length && selectedSubjectId === null){
      setSelectedSubjectId(data[0]?.id);
    }
  }, [data]);

  if(isLoading) <div>loading...</div>

  if(isError) <div>Error</div>

  return (
    <div className={'flex flex-col gap-4 my-6'}>
      {renderSubjectSelect(data)}
      <Alert severity="info" className={'text-[13px] p-2'}>
        Будут скопированы все вопросы, настройки и структура теста.
        Оригинальный тест останется без изменений.
      </Alert>
    </div>
  );
}
