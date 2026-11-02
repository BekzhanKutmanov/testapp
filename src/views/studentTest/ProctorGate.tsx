'use client';

import { Button, CircularProgress } from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import VideocamOffRoundedIcon from '@mui/icons-material/VideocamOffRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';

import type { ProctorState, ProctorStep } from '@/features/components/Face';

interface ProctorGateProps {
  state: ProctorState;
  onRetry: () => void;
  onContinueWithout: () => void;
}

const STEPS: { key: ProctorStep; label: string; hint?: string }[] = [
  { key: 'models', label: 'Загрузка модулей распознавания' },
  { key: 'camera', label: 'Доступ к камере', hint: 'Разрешите доступ в окне браузера' },
  { key: 'warmup', label: 'Проверка распознавания лица' },
];

/**
 * Экран перед тестом: ждём, пока прокторинг действительно готов к работе.
 * Таймер теста не идёт, пока показан этот экран.
 */
export default function ProctorGate({ state, onRetry, onContinueWithout }: ProctorGateProps) {
  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-solid border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        {state.status === 'error' ? (
          <ErrorView message={state.error.message} code={state.error.code} onRetry={onRetry} onContinueWithout={onContinueWithout} />
        ) : (
          <LoadingView done={state.status === 'loading' ? state.done : STEPS.map((s) => s.key)} />
        )}
      </div>
    </div>
  );
}

function LoadingView({ done }: { done: ProctorStep[] }) {
  // «Проверка» начинается только когда готовы и модели, и камера
  const isActive = (key: ProctorStep) =>
    !done.includes(key) && (key !== 'warmup' || (done.includes('models') && done.includes('camera')));

  return (
    <div className="flex flex-col items-center text-center">
      <CircularProgress size={44} thickness={4} />
      <h2 className="m-0 mt-5 text-lg font-semibold text-slate-900">Подготовка к тесту</h2>
      <p className="m-0 mt-1 text-sm text-slate-500">
        Включаем прокторинг. Время теста пойдёт только после готовности.
      </p>

      <ul className="m-0 mt-6 flex w-full list-none flex-col gap-3 p-0 text-left">
        {STEPS.map((step) => {
          const isDone = done.includes(step.key);
          const active = isActive(step.key);

          return (
            <li key={step.key} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
                {isDone ? (
                  <CheckCircleRoundedIcon sx={{ fontSize: 20 }} className="!text-emerald-500" />
                ) : active ? (
                  <CircularProgress size={16} thickness={5} />
                ) : (
                  <span className="h-2 w-2 rounded-full bg-slate-300" />
                )}
              </span>
              <span className="min-w-0">
                <span className={`block text-sm ${isDone ? 'text-slate-500' : active ? 'font-medium text-slate-900' : 'text-slate-400'}`}>
                  {step.label}
                </span>
                {active && step.hint && <span className="block text-xs text-slate-500">{step.hint}</span>}
              </span>
            </li>
          );
        })}
      </ul>

      <p className="m-0 mt-6 text-xs text-slate-400">
        При медленном интернете это может занять до минуты. Не закрывайте страницу.
      </p>
    </div>
  );
}

function ErrorView({
  message,
  code,
  onRetry,
  onContinueWithout,
}: {
  message: string;
  code: string;
  onRetry: () => void;
  onContinueWithout: () => void;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
        <VideocamOffRoundedIcon className="!text-red-500" />
      </div>
      <h2 className="m-0 mt-4 text-lg font-semibold text-slate-900">Не удалось запустить прокторинг</h2>
      <p className="m-0 mt-2 text-sm text-slate-600">{message}</p>

      {code === 'camera-denied' && (
        <p className="m-0 mt-3 rounded-xl bg-slate-50 px-4 py-3 text-left text-xs text-slate-500">
          Нажмите на значок замка 🔒 слева от адреса сайта → «Камера» → «Разрешить», затем нажмите «Попробовать снова».
        </p>
      )}

      <div className="mt-6 flex w-full flex-col gap-2">
        <Button
          variant="contained"
          disableElevation
          startIcon={<RefreshRoundedIcon />}
          onClick={onRetry}
          sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 600, py: 1.1 }}
        >
          Попробовать снова
        </Button>
        <Button
          onClick={onContinueWithout}
          sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 500, color: 'text.secondary' }}
        >
          Начать тест без прокторинга
        </Button>
      </div>
    </div>
  );
}
