export function formatTime(totalSec: number) {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function isAnswered(value: string[] | undefined) {
  return !!value && value.some((v) => v.trim().length > 0);
}

/** id DOM-элемента карточки вопроса — по нему работают «якоря» */
export const questionDomId = (questionId: string) => `question-${questionId}`;

/** Плавно прокручивает страницу к вопросу (с учётом prefers-reduced-motion) */
export function scrollToQuestion(questionId: string) {
  const el = document.getElementById(questionDomId(questionId));
  if (!el) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
}
