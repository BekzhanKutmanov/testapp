import { useCallback, useEffect, useState } from 'react';

/**
 * Таймер теста. Дедлайн хранится в localStorage, чтобы перезагрузка не сбрасывала время.
 * Лучше всего, если дедлайн (endsAt) приходит с бэкенда — тогда его нельзя обойти.
 * timeLeft === null, пока таймер ещё не запущен (до монтирования на клиенте).
 */
export function useTestTimer(testId: string, durationSec: number) {
  const key = `test-deadline-${testId}`;
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    let deadline = 0;

    try {
      deadline = Number(localStorage.getItem(key)) || 0;
    } catch {}

    if (!deadline || deadline < Date.now() - durationSec * 1000) {
      deadline = Date.now() + durationSec * 1000;
      try {
        localStorage.setItem(key, String(deadline));
      } catch {}
    }

    const tick = () =>
      setTimeLeft(Math.max(0, Math.ceil((deadline - Date.now()) / 1000)));

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [key, durationSec]);

  const clearDeadline = useCallback(() => {
    try {
      localStorage.removeItem(key);
    } catch {}
  }, [key]);

  return { timeLeft, clearDeadline };
}
