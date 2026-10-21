'use client';

import { Checkbox, Radio, TextField } from '@mui/material';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import type { Question, QuestionType } from '../../../types/questions/question-page';
import { isAnswered, questionDomId } from '../../lib/question-page/utils';

const QUESTION_HINT: Record<QuestionType, string> = {
  RADIO: 'Выберите один вариант',
  CHECKBOX: 'Выберите все подходящие варианты',
  TEXT: 'Введите ответ своими словами',
};

interface QuestionCardProps {
  question: Question;
  index: number;
  selected: string[];
  /** подсветить красным (вопрос пропущен после попытки отправки) */
  invalid: boolean;
  disabled: boolean;
  onRadio: (questionId: string, optionId: string) => void;
  onCheckbox: (questionId: string, optionId: string) => void;
  onText: (questionId: string, value: string) => void;
}

export default function QuestionCard({
  question: q,
  index,
  selected,
  invalid,
  disabled,
  onRadio,
  onCheckbox,
  onText,
}: QuestionCardProps) {
  const done = isAnswered(selected);

  const borderClass = done
    ? 'border-emerald-200'
    : invalid
      ? 'border-red-300 ring-4 ring-red-50'
      : 'border-slate-200';

  const badgeClass = done
    ? 'bg-emerald-500 text-white'
    : invalid
      ? 'bg-red-500 text-white'
      : 'bg-slate-100 text-slate-600';

  return (
    <section
      id={questionDomId(q.id)}
      aria-labelledby={`${q.id}-title`}
      className={`scroll-mt-32 rounded-2xl border bg-white p-4 shadow-sm transition-all duration-500 hover:shadow-md sm:p-6 ${borderClass}`}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <span
          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors duration-500 ${badgeClass}`}
        >
          {done ? <CheckRoundedIcon sx={{ fontSize: 18 }} /> : index + 1}
        </span>

        <div className="min-w-0 flex-1">
          <h2
            id={`${q.id}-title`}
            className="text-[15px] font-medium leading-snug text-slate-900 sm:text-base"
          >
            {q.title}
          </h2>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">{QUESTION_HINT[q.type]}</p>
          {invalid && (
            <p className="mt-1 text-xs font-medium text-red-600 sm:text-sm" role="alert">
              Вы не ответили на этот вопрос
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 space-y-2 sm:mt-5 sm:space-y-2.5">
        {q.type === 'TEXT' ? (
          <TextField
            fullWidth
            multiline
            minRows={3}
            placeholder="Ваш ответ"
            value={selected[0] ?? ''}
            error={invalid}
            onChange={(e) => onText(q.id, e.target.value)}
            disabled={disabled}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                transition: 'all 0.3s ease',
              },
            }}
          />
        ) : (
          q.options.map((opt) => {
            const checked = selected.includes(opt.id);
            return (
              <label
                key={opt.id}
                className={`flex cursor-pointer items-center gap-2 rounded-xl border px-2 py-1.5 transition-all duration-300 ease-out sm:px-3 sm:py-2 ${
                  checked
                    ? 'border-[#1976d2] bg-[#1976d2]/[0.06]'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                } ${disabled ? 'pointer-events-none opacity-70' : ''}`}
              >
                {q.type === 'RADIO' ? (
                  <Radio
                    name={q.id}
                    checked={checked}
                    onChange={() => onRadio(q.id, opt.id)}
                  />
                ) : (
                  <Checkbox checked={checked} onChange={() => onCheckbox(q.id, opt.id)} />
                )}
                <span
                  className={`py-1 text-sm leading-snug transition-colors duration-300 sm:text-[15px] ${
                    checked ? 'text-slate-900' : 'text-slate-700'
                  }`}
                >
                  {opt.text}
                </span>
              </label>
            );
          })
        )}
      </div>
    </section>
  );
}
