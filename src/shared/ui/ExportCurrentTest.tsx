'use client'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ArrowRightAltOutlinedIcon from '@mui/icons-material/ArrowRightAltOutlined'
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined'
import SubjectSelect from '@/shared/ui/SubjectSelect'
import React, { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getSubjects } from '@/features/api/api'
import { Alert } from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'

export default function ExportCurrentTest({ currentSubjectName, selectedSubject }: { currentSubjectName: string, selectedSubject: (id: number | null) => void }) {
  // selectedSubjectId, setSelectedSubjectId, subjects - получаю от родителя и просто передаю в SubjectSelect получая от него конкретный предмет и отправлю в родитель выбранный предмет
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null)
  const [subjectName, setSubjectName] = useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['subjectKey'],
    queryFn: getSubjects
  })

  useEffect(() => {
    console.log('export ', selectedSubjectId)
    if (selectedSubjectId) {
      selectedSubject(selectedSubjectId);
    }
  }, [selectedSubjectId]);

  useEffect(() => {
    if (currentSubjectName) {
      setSubjectName(currentSubjectName);
    }
  }, [currentSubjectName]);

  useEffect(()=> {
    if(Array.isArray(data)) {
      setSelectedSubjectId(data[0]?.id);
    }
  },[data]);

  return (
    <Box>
      {subjectName ? (
        <p className={'flex items-center gap-1 mb-3 text-sm mt-3'}>
          Текущий предмет:{' '}
          <span className={'flex items-center gap-1 text-gray-400'}>
            <InfoOutlinedIcon fontSize={'small'} /> {subjectName}
          </span>
        </p>
      ) : (
        ''
      )}
      <Box className={'flex items-center gap-2 justify-between flex-col sm:flex-row my-3'}>
        <Box className={'w-full'}>
          <label className={'text-[var(--myDarkColor)]'}>Действие</label>
          <Box className={'flex items-center'}>
            <Button
              variant='contained'
              size={'small'}
              className={'w-full sm:w-[120px]'}
              sx={{
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0
              }}
              startIcon={<ArrowRightAltOutlinedIcon fontSize={'small'} />}
            >
              {' '}
              Переместить
            </Button>
            <Button
              variant='outlined'
              size={'small'}
              className={'w-full sm:w-[120px]'}
              sx={{
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0
              }}
              startIcon={<ContentCopyOutlinedIcon fontSize={'small'} />}
            >
              {' '}
              Копировать
            </Button>
          </Box>
        </Box>
        <div className={'w-full sm:w-[80%]'}>
          <label className={'text-[var(--myDarkColor)]'}>Предмет:</label>
          <SubjectSelect
            selectedSubjectId={selectedSubjectId}
            setSelectedSubjectId={setSelectedSubjectId}
            subjects={data}
          />
        </div>
      </Box>
      <Alert severity='info' className={'text-[13px] p-2'}>
        Данный тест будет перемещен в выбранный предмет. Он не будет доступен в текущем предмете. Редактируйте с
        осторожностью.
      </Alert>
    </Box>
  )
}
