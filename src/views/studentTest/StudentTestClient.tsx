'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  LinearProgress,
} from '@mui/material';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';

import type { Answers } from '../../types/questions/question-page';
import {
  QUESTIONS,
  RESULT_URL,
  TEST_DURATION_SEC,
  TEST_ID,
  TEST_TITLE,
} from './test-data';
import { formatTime, isAnswered, scrollToQuestion } from '../../shared/lib/question-page/utils';
import { useTestTimer } from './useTestTimer';
import QuestionCard from '../../shared/ui/question-card/QuestionCard';
import QuestionNavigator, { type NavigatorItem } from '../../shared/ui/question-navigator/QuestionNavigator';
import NavigationItems from '@/shared/ui/navigation-items/NavigationItems';
import { useMediaQuery } from '@/shared/model/useMediaQuery';
import { ProctorCamera } from '@/features/components/Face';

export default function StudentTestClient() {
  const router = useRouter();

  const [answers, setAnswers] = useState<Answers>({});
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [showErrors, setShowErrors] = useState(false); // подсвечивать пропущенные красным
  const [status, setStatus] = useState<'idle' | 'submitting' | 'timeout'>('idle');
  const [error, setError] = useState<string | null>(null);

  const answersRef = useRef<Answers>(answers);
  answersRef.current = answers;
  const submittedRef = useRef(false);
  const scrollAfterCloseRef = useRef(false); // прокрутить к пропущенному после закрытия модалки

  const { timeLeft, clearDeadline } = useTestTimer(TEST_ID, TEST_DURATION_SEC);

  const total = QUESTIONS.length;
  const navigatorItems = useMemo<NavigatorItem[]>(
    () => QUESTIONS.map((q) => ({ id: q.id, answered: isAnswered(answers[q.id]) })),
    [answers],
  );
  const answeredCount = navigatorItems.filter((i) => i.answered).length;
  const unanswered = total - answeredCount;
  const firstUnansweredId = navigatorItems.find((i) => !i.answered)?.id;
  const progress = (answeredCount / total) * 100;

  // proctor
  const [mounted, setMounted] = useState(false)
  const [descriptor, setDescriptor] = useState<number[] | null>(null)
  const [imageURL, setImageURL] = useState<string | null>(null)

  const [facesDetected, setFacesDetected] = useState(0)
  const [matchResult, setMatchResult] = useState('')
  const [isLookingAway, setIsLookingAway] = useState(false)
  const [resultSend, setResultSend] = useState(false);

  const [screenshots, setScreenshots] = useState<{ blob: Blob; timestamp: number; type: string; url: string }[]>([])
  // 

  const media = useMediaQuery('840px');

  /* ---------- отправка ---------- */

  const submit = useCallback(
    async (reason: 'manual' | 'timeout') => {
      if (submittedRef.current) return;
      submittedRef.current = true;

      scrollAfterCloseRef.current = false;
      setConfirmOpen(false);
      setError(null);
      setStatus(reason === 'timeout' ? 'timeout' : 'submitting');

      try {
        const payload = QUESTIONS.map((q) => ({
          questionId: q.id,
          answer: answersRef.current[q.id] ?? [],
        }));

        // TODO: замени на свой запрос. Бэкенд должен сам пометить тест завершённым.
        // await fetch(`/api/tests/${TEST_ID}/submit`, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ reason, answers: payload }),
        // });

        // proctor trigger
        setResultSend(true);
        console.log('submit', reason, payload);
        await new Promise((r) => setTimeout(r, 800));

        clearDeadline();  

        // replace — текущая страница теста заменяется в истории,
        // наверное можно передать в урл параметры результата прокторинга, или редакс 
        // возможно даже отправлю результат прокторинга в бекенд тогда просто сделаю редирект и все
        // поэтому кнопка «Назад» не вернёт студента в тест
        router.replace('/student/testResult');
      } catch {
        submittedRef.current = false;
        setStatus('idle');
        setError('Не удалось отправить тест. Проверьте соединение и попробуйте ещё раз.');
      }
    },
    [router, clearDeadline],
  );

  // время вышло — отправляем автоматически
  useEffect(() => {
    if (timeLeft === 0) submit('timeout');
  }, [timeLeft, submit]);

  useEffect(() => {
    setMounted(true)
  }, [])

  /* ---------- обработчики ответов ---------- */

  const selectRadio = (qId: string, optId: string) =>
    setAnswers((prev) => ({ ...prev, [qId]: [optId] }));

  const toggleCheckbox = (qId: string, optId: string) =>
    setAnswers((prev) => {
      const current = prev[qId] ?? [];
      const next = current.includes(optId)
        ? current.filter((id) => id !== optId)
        : [...current, optId];
      return { ...prev, [qId]: next };
    });

  const changeText = (qId: string, value: string) =>
    setAnswers((prev) => ({ ...prev, [qId]: [value] }));

  /* ---------- модальное окно ---------- */

  const handleSubmitClick = () => {
    if (unanswered > 0) setConfirmOpen(true);
    else submit('manual');
  };

  // «Вернуться к вопросам», клик по фону или Escape
  const handleDialogCancel = () => {
    setShowErrors(true);
    scrollAfterCloseRef.current = true;
    setConfirmOpen(false);
  };

  // Прокручиваем уже после того, как модалка полностью закрылась
  // (пока она открыта, MUI блокирует прокрутку страницы)
  const handleDialogExited = () => {
    if (!scrollAfterCloseRef.current) return;
    scrollAfterCloseRef.current = false;
    if (firstUnansweredId) scrollToQuestion(firstUnansweredId);
  };

  const isLow = timeLeft !== null && timeLeft <= 60;
  const busy = status !== 'idle';
  const highlightMissing = showErrors && unanswered > 0;

  /* ---------- UI ---------- */

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Шапка: название, прогресс и таймер */}
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/85 backdrop-blur">
        <div className="mx-auto max-w-3xl px-4 pt-3 sm:px-6 sm:pt-4">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h1 className="truncate text-base font-semibold text-slate-900 sm:text-lg">
                {TEST_TITLE}
              </h1>
              <p className="text-xs text-slate-500 sm:text-sm">
                Отвечено {answeredCount} из {total}
              </p>
            </div>

            <div
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold tabular-nums transition-colors duration-500 sm:px-4 ${isLow ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-700'
                }`}
              role="timer"
              aria-label="Оставшееся время"
            >
              <AccessTimeRoundedIcon sx={{ fontSize: 18 }} />
              {timeLeft === null ? '--:--' : formatTime(timeLeft)}
            </div>
          </div>

          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              mt: 1.5,
              height: 4,
              borderRadius: 2,
              backgroundColor: '#e2e8f0',
              '& .MuiLinearProgress-bar': { transition: 'transform 0.6s ease' },
            }}
          />
          <div className="h-3 sm:h-4" />
        </div>
      </header>

      <div className='relative flex items-start gap-1 mx-auto max-w-4xl'>
        {/* Вопросы (pb-28 — место под плавающее меню, чтобы оно не перекрывало кнопку) */}
        <main className="relative max-w-3xl px-4 py-5 pb-28 sm:px-6 sm:py-8 sm:pb-32">
          <div className="space-y-4 sm:space-y-5">
            {QUESTIONS.map((q, index) => (
              <QuestionCard
                key={q.id}
                question={q}
                index={index}
                selected={answers[q.id] ?? []}
                invalid={showErrors && !isAnswered(answers[q.id])}
                disabled={busy}
                onRadio={selectRadio}
                onCheckbox={toggleCheckbox}
                onText={changeText}
              />
            ))}
          </div>

          {/* Отправка */}
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:mt-8 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p
                  className={`font-medium transition-colors duration-500 ${highlightMissing ? 'text-red-600' : 'text-slate-900'
                    }`}
                >
                  {unanswered === 0
                    ? 'Вы ответили на все вопросы'
                    : `Без ответа: ${unanswered}`}
                </p>
                <p className="mt-0.5 text-sm text-slate-500">
                  После отправки изменить ответы будет нельзя.
                </p>
              </div>

              <Button
                variant="contained"
                disableElevation
                disabled={busy}
                onClick={handleSubmitClick}
                endIcon={<SendRoundedIcon />}
                sx={{
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 4,
                  py: 1.25,
                  transition: 'all 0.3s ease',
                  width: { xs: '100%', sm: 'auto' },
                }}
              >
                Отправить тест
              </Button>
            </div>

            {error && (
              <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </p>
            )}
          </div>

          {/* Меню-якорь по вопросам */}
          {media && <QuestionNavigator items={navigatorItems} onSelect={scrollToQuestion} />}
        </main>

        {!media && <NavigationItems items={navigatorItems} handleSelect={scrollToQuestion} />}
      </div>

      {mounted && 
        <ProctorCamera
          onFacesDetected={setFacesDetected}
          onMatchResult={setMatchResult}
          onLookingAway={setIsLookingAway}
          facesDetected={facesDetected}
          matchResult={matchResult}
          isLookingAway={isLookingAway}
          resultSend={resultSend}
        />
      }

      <div>
        {screenshots.map((s, i) => (
          <div key={i}>
            <img src={s.url} width={160} />
            <div>{s.type} — {new Date(s.timestamp).toLocaleTimeString()}</div>
          </div>
        ))}
      </div>

      {/* Подтверждение, если есть пропущенные вопросы */}
      <Dialog
        open={confirmOpen}
        onClose={handleDialogCancel}
        slotProps={{
          paper: { sx: { borderRadius: '16px', m: 2 } },
          transition: { onExited: handleDialogExited },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Отправить тест?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Вопросов без ответа: {unanswered}. После отправки вернуться к ним не получится.
            Если вернётесь, мы подсветим пропущенные и перейдём к первому из них.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            onClick={handleDialogCancel}
            sx={{ textTransform: 'none', borderRadius: '10px' }}
          >
            Вернуться к вопросам
          </Button>
          <Button
            variant="contained"
            disableElevation
            onClick={() => submit('manual')}
            sx={{ textTransform: 'none', borderRadius: '10px' }}
          >
            Всё равно отправить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Оверлей отправки / окончания времени */}
      {busy && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-white/90 px-6 text-center backdrop-blur-sm">
          <CircularProgress size={40} />
          <p className="text-base font-medium text-slate-800">
            {status === 'timeout'
              ? 'Время вышло. Отправляем ваши ответы…'
              : 'Отправляем ваши ответы…'}
          </p>
        </div>
      )}
    </div>
  );
}
