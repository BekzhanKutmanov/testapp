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
import { useLang } from '@/shared/i18n'

export default function ExportCurrentTest({ currentSubjectName, selectedSubject, addressedSubjectId }: { currentSubjectName: string, selectedSubject: (id: number | null) => void, addressedSubjectId: number | null}) {
  // selectedSubjectId, setSelectedSubjectId, subjects - получаю от родителя и просто передаю в SubjectSelect получая от него конкретный предмет и отправлю в родитель выбранный предмет
  const { t } = useLang()
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null)
  const [subjectName, setSubjectName] = useState('');
  const [addressed, setAddressed] = useState('');

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

      const test = data.find((item)=> {
        return item.id == addressedSubjectId
      })
      console.log('test ', test);
      if(test) setAddressed(test?.name);
    }
  },[data]);

  return (
    <Box>
      {subjectName ? (
        <p className={'flex items-center gap-1 mb-3 text-sm mt-3'}>
          {t.tests.currentSubject}
          <span className={' flex items-center gap-1 text-gray-400'}>
            <InfoOutlinedIcon fontSize={'small'} /> <span className={'max-w-[170px] overflow-hidden text-nowrap text-ellipsis block'}>{subjectName}</span>
          </span>
        </p>
      ) : (
        ''
      )}
      <Box className={'flex items-center gap-2 justify-between flex-col sm:flex-row my-3'}>
        <Box className={'w-full'}>
          <label className={'text-[var(--myDarkColor)]'}>{t.common.action}</label>
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
              {t.common.move}
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
              {t.common.copy}
            </Button>
          </Box>
        </Box>
        <div className={'w-full sm:w-[80%]'}>
          <label className={'text-[var(--myDarkColor)]'}>{t.common.subject}: </label>
          {addressedSubjectId ? (
            <div className={'text-gray-400 max-w-[170px] overflow-hidden text-nowrap text-ellipsis'}>{addressed}</div>
          ) : (
            <SubjectSelect
              selectedSubjectId={selectedSubjectId}
              setSelectedSubjectId={setSelectedSubjectId}
              subjects={data}
            />
          )}
        </div>
      </Box>
      <Alert severity='info' className={'text-[13px] p-2'}>
        {t.tests.moveNote}
      </Alert>
    </Box>
  )
}
