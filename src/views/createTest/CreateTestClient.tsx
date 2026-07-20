'use client'

import React, { useState, useCallback, useEffect } from 'react'

import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  TextField,
  Typography,
  Radio,
  Tooltip,
  Paper,
  Fab,
  Container,
  Stack,
  Fade,
  Select,
  MenuItem,
  FormControl,
  Checkbox
} from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import AddIcon from '@mui/icons-material/Add'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import SaveIcon from '@mui/icons-material/Save'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import ShortTextIcon from '@mui/icons-material/ShortText'
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked'

type QuestionType = 'RADIO' | 'CHECKBOX' | 'TEXT';

interface Option {
  id: string
  text: string
}

interface Question {
  id: string
  title: string
  type: QuestionType
  options: Option[]
  correctOptionIds: string[] // Используем массив для поддержки чекбоксов
}

const CreateTestClient = () => {
  const [testTitle, setTestTitle] = useState('')
  const [testDescription, setTestDescription] = useState('')

  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 'q-' + Date.now(),
      title: '',
      type: 'RADIO',
      options: [
        { id: 'opt-1', text: 'Вариант 1' },
        { id: 'opt-2', text: 'Вариант 2' }
      ],
      correctOptionIds: ['opt-1']
    }
  ])

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    const order = questions.map(q => q.id);
  }, [questions]);

  const generateId = (prefix: string) => `${prefix}-${Math.random().toString(36).substr(2, 9)}`

  const addQuestion = useCallback(() => {
    const newId = generateId('q')

    const newQuestion: Question = {
      id: newId,
      title: '',
      type: 'RADIO',
      options: [
        { id: generateId('opt'), text: '' },
        { id: generateId('opt'), text: '' }
      ],
      correctOptionIds: []
    }

    setQuestions(prev => [...prev, newQuestion])

  }, [])

  const deleteQuestion = (id: string) => {
    if (questions.length > 1) {
      setQuestions(questions.filter(q => q.id !== id))
    }
  }

  const duplicateQuestion = (question: Question) => {
    const newOptions = question.options.map(opt => ({ ...opt, id: generateId('opt') }));

    // Мапим старые ID правильных ответов на новые
    const newCorrectIds = question.correctOptionIds.map(oldId => {
      const oldIndex = question.options.findIndex(o => o.id === oldId);

      return oldIndex !== -1 ? newOptions[oldIndex].id : '';

    }).filter(id => id !== '');

    const duplicated: Question = {
      ...question,
      id: generateId('q'),
      options: newOptions,
      correctOptionIds: newCorrectIds
    }
    setQuestions(prev => [...prev, duplicated])
  }

  const handleQuestionTitleChange = (id: string, title: string) => {
    setQuestions(prev => prev.map(q => (q.id === id ? { ...q, title } : q)))
  }

  const handleTypeChange = (questionId: string, type: QuestionType) => {
    console.log(questionId, type);
    setQuestions(prev => prev.map(q => {
      if (q.id === questionId) {
        // При смене типа сбрасываем или корректируем правильные ответы
        let newCorrectIds = [...q.correctOptionIds];
        if (type === 'RADIO' && newCorrectIds.length > 1) {
          newCorrectIds = [newCorrectIds[0]];
        } else if (type === 'TEXT') {
          newCorrectIds = [];
        }
        return { ...q, type, correctOptionIds: newCorrectIds };
      }
      return q;
    }));
  }

  const addOption = (questionId: string) => {
    setQuestions(prev =>
      prev.map(q => {
        if (q.id === questionId) {
          const newOptionId = generateId('opt')
          return {
            ...q,
            options: [...q.options, { id: newOptionId, text: '' }]
          }
        }
        return q
      })
    )
  }

  const deleteOption = (questionId: string, optionId: string) => {
    setQuestions(prev =>
      prev.map(q => {
        if (q.id === questionId && q.options.length > 2) {
          const newOptions = q.options.filter(opt => opt.id !== optionId)
          const newCorrectIds = q.correctOptionIds.filter(id => id !== optionId);

          // Если удалили единственный правильный вариант для RADIO, выбираем первый доступный
          if (q.type === 'RADIO' && newCorrectIds.length === 0 && newOptions.length > 0) {
            newCorrectIds.push(newOptions[0].id);
          }

          return { ...q, options: newOptions, correctOptionIds: newCorrectIds }
        }
        return q
      })
    )
  }

  const handleOptionTextChange = (questionId: string, optionId: string, text: string) => {
    setQuestions(prev =>
      prev.map(q => {
        if (q.id === questionId) {
          return {
            ...q,
            options: q.options.map(opt => (opt.id === optionId ? { ...opt, text } : opt))
          }
        }
        return q
      })
    )
  }

  const handleCorrectToggle = (questionId: string, optionId: string) => {
    setQuestions(prev =>
      prev.map(q => {
        if (q.id === questionId) {
          if (q.type === 'RADIO') {
            return { ...q, correctOptionIds: [optionId] };
          } else if (q.type === 'CHECKBOX') {
            const isAlreadyCorrect = q.correctOptionIds.includes(optionId);
            const newCorrectIds = isAlreadyCorrect
              ? q.correctOptionIds.filter(id => id !== optionId)
              : [...q.correctOptionIds, optionId];

            return { ...q, correctOptionIds: newCorrectIds };
          }
        }

        return q;
      })
    )
  }

  const handleSaveTest = () => {
    console.log('Сохранение теста:', { title: testTitle, description: testDescription, questions })
  }

  const onDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.setData('text/plain', index.toString());
    e.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    const newQuestions = [...questions];
    const draggedItem = newQuestions[draggedIndex];
    newQuestions.splice(draggedIndex, 1);
    newQuestions.splice(index, 0, draggedItem);
    setDraggedIndex(index);
    setQuestions(newQuestions);
  };

  const onDragEnd = () => setDraggedIndex(null);

  useEffect(()=> {
    console.log(questions);
  },[questions]);

  return (
    <Container maxWidth={false} sx={{ py: 4, maxWidth: '1800px', px: { xs: 0, sm: 2, md: 4 } }}>
      <Stack spacing={3}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 2.5, md: 3 },
            borderRadius: '12px',
            border: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'background.paper',
            borderTop: '6px solid #666cff',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)'
          }}
        >
          <TextField
            fullWidth
            variant='standard'
            placeholder='Название теста'
            value={testTitle}
            onChange={e => setTestTitle(e.target.value)}
            InputProps={{
              disableUnderline: true,
              style: { fontSize: '1.8rem', fontWeight: 700 }
            }}
            sx={{ mb: 1 }}
          />
          <TextField
            fullWidth
            variant='standard'
            placeholder='Описание теста...'
            multiline
            value={testDescription}
            onChange={e => setTestDescription(e.target.value)}
            InputProps={{
              disableUnderline: true,
              style: { fontSize: '1rem' }
            }}
          />
        </Paper>

        <Stack spacing={2.5}>
          {questions.map((question, index) => (
            <Fade in key={question.id}>
              <Card
                draggable
                onDragStart={e => onDragStart(e, index)}
                onDragOver={e => onDragOver(e, index)}
                onDragEnd={onDragEnd}
                sx={{
                  borderRadius: '12px',
                  overflow: 'visible',
                  border: '1px solid',
                  borderColor: draggedIndex === index ? 'primary.main' : 'divider',
                  boxShadow:
                    draggedIndex === index
                      ? '0px 8px 30px rgba(102, 108, 255, 0.15)'
                      : '0px 2px 10px rgba(0, 0, 0, 0.03)',
                  transition: '0.2s',
                  opacity: draggedIndex === index ? 0.6 : 1
                }}
              >
                <Box
                  sx={{ display: 'flex', justifyContent: 'center', py: 0.5, color: 'text.disabled', cursor: 'grab' }}
                >
                  <DragIndicatorIcon fontSize='small' />
                </Box>

                <CardContent sx={{ px: { xs: 2, sm: 3, md: 4 }, py: '16px !important', pb: '24px !important' }}>
                  <Stack spacing={2.5}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'flex-start' }}>
                      <Box sx={{ display: 'flex', gap: 1.5, flex: 1, minWidth: '300px' }}>
                        <Typography
                          variant='h6'
                          sx={{ mt: 0.5, fontWeight: 700, minWidth: '25px', color: 'primary.main', fontSize: '1.1rem' }}
                        >
                          {index + 1}.
                        </Typography>
                        <TextField
                          fullWidth
                          placeholder='Ваш вопрос'
                          variant='outlined'
                          size='small'
                          value={question.title}
                          onChange={e => handleQuestionTitleChange(question.id, e.target.value)}
                          multiline
                          sx={{
                            '& .MuiOutlinedInput-root': { borderRadius: '10px', fontSize: '1rem', fontWeight: 500 }
                          }}
                        />
                      </Box>

                      <FormControl size='small' sx={{ minWidth: 200 }}>
                        <Select
                          value={question.type}
                          onChange={e => handleTypeChange(question.id, e.target.value as QuestionType)}
                          sx={{ borderRadius: '10px' }}
                        >
                          <MenuItem value='RADIO'>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <RadioButtonCheckedIcon fontSize='small' color='action' />
                              <Typography variant='body2'>Один ответ</Typography>
                            </Box>
                          </MenuItem>
                          <MenuItem value='CHECKBOX'>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <CheckBoxIcon fontSize='small' color='action' />
                              <Typography variant='body2'>Несколько ответов</Typography>
                            </Box>
                          </MenuItem>
                          <MenuItem value='TEXT'>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <ShortTextIcon fontSize='small' color='action' />
                              <Typography variant='body2'>Текстовый ответ</Typography>
                            </Box>
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Box>

                    <Divider />

                    {question.type === 'TEXT' ? (
                      <Box sx={{ px: 1, py: 1 }}>
                        <TextField
                          fullWidth
                          disabled
                          variant='standard'
                          placeholder='Текстовый ответ будет введен пользователем'
                          sx={{ fontStyle: 'italic' }}
                        />
                      </Box>
                    ) : (
                      <>
                        <Stack spacing={1}>
                          {question.options.map((option, optIndex) => {
                            const isCorrect = question.correctOptionIds.includes(option.id)

                            return (
                              <Box
                                key={option.id}
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1,
                                  p: 0.5,
                                  borderRadius: '10px',
                                  backgroundColor: isCorrect ? 'rgba(46, 125, 50, 0.04)' : 'transparent',
                                  border: '1px solid',
                                  borderColor: isCorrect ? 'success.light' : 'transparent',
                                  transition: '0.2s'
                                }}
                              >
                                <Tooltip title={isCorrect ? 'Удалить из правильных' : 'Отметить как правильный'}>
                                  {question.type === 'RADIO' ? (
                                    <Radio
                                      size='small'
                                      checked={isCorrect}
                                      onChange={() => handleCorrectToggle(question.id, option.id)}
                                      color='success'
                                      icon={<CheckCircleIcon sx={{ opacity: 0.2 }} />}
                                      checkedIcon={<CheckCircleIcon />}
                                    />
                                  ) : (
                                    <Checkbox
                                      size='small'
                                      checked={isCorrect}
                                      onChange={() => handleCorrectToggle(question.id, option.id)}
                                      color='success'
                                      icon={<CheckBoxIcon sx={{ opacity: 0.2 }} />}
                                      checkedIcon={<CheckBoxIcon />}
                                    />
                                  )}
                                </Tooltip>
                                <TextField
                                  fullWidth
                                  size='small'
                                  variant='standard'
                                  placeholder={`Вариант ${optIndex + 1}`}
                                  value={option.text}
                                  onChange={e => handleOptionTextChange(question.id, option.id, e.target.value)}
                                  InputProps={{ disableUnderline: true }}
                                  sx={{
                                    px: 1,
                                    '& .MuiInputBase-input': { fontWeight: isCorrect ? 600 : 400, fontSize: '0.95rem' }
                                  }}
                                />
                                <IconButton
                                  onClick={() => deleteOption(question.id, option.id)}
                                  disabled={question.options.length <= 2}
                                  size='small'
                                  sx={{ color: 'text.disabled', '&:hover': { color: 'error.main' } }}
                                >
                                  <DeleteOutlineIcon fontSize='small' />
                                </IconButton>
                              </Box>
                            )
                          })}
                        </Stack>

                        <Button
                          variant='outlined'
                          size='small'
                          startIcon={<AddIcon />}
                          onClick={() => addOption(question.id)}
                          sx={{
                            alignSelf: 'flex-start',
                            borderRadius: '8px',
                            textTransform: 'none',
                            borderStyle: 'dashed',
                            borderWidth: '1.5px',
                            py: 0.5,
                            '&:hover': { borderWidth: '1.5px', borderStyle: 'dashed' }
                          }}
                        >
                          Добавить вариант ответа
                        </Button>
                      </>
                    )}
                  </Stack>
                </CardContent>

                <Divider />

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5, p: 1 }}>
                  <Tooltip title='Сделать копию'>
                    <IconButton onClick={() => duplicateQuestion(question)} size='small'>
                      <ContentCopyIcon fontSize='small' />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title='Удалить вопрос'>
                    <IconButton
                      onClick={() => deleteQuestion(question.id)}
                      color='error'
                      disabled={questions.length <= 1}
                      size='small'
                    >
                      <DeleteOutlineIcon fontSize='small' />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Card>
            </Fade>
          ))}
        </Stack>

        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1 }}>
          <Button
            variant='contained'
            size='medium'
            startIcon={<AddIcon />}
            onClick={addQuestion}
            sx={{
              borderRadius: '10px',
              px: 3,
              py: 1,
              boxShadow: '0px 6px 20px rgba(102, 108, 255, 0.25)',
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 600
            }}
          >
            Добавить следующий вопрос
          </Button>
        </Box>
      </Stack>

      <Box sx={{ position: 'fixed', bottom: 40, right: 40 }}>
        <Tooltip title='Сохранить весь тест' placement='left' arrow>
          <Fab
            color='primary'
            size='large'
            onClick={handleSaveTest}
            sx={{ width: 60, height: 60, boxShadow: '0px 10px 30px rgba(102, 108, 255, 0.4)' }}
          >
            <SaveIcon />
          </Fab>
        </Tooltip>
      </Box>
    </Container>
  )
}

export default CreateTestClient
