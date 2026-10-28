'use client';

import { IconButton } from '@mui/material';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import LinkRoundedIcon from '@mui/icons-material/LinkRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import VideocamRoundedIcon from '@mui/icons-material/VideocamRounded';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';

import {
  DEFAULT_DURATION,
  DEFAULT_QUESTION_COUNT,
  type Plan,
} from './PlansTable';

interface PlansMobileListProps {
  plans: Plan[];
  onCopyLink: (plan: Plan) => void;
  onDelete: (id: number) => void;
  onEdit?: (plan: Plan) => void; // пока ничего не делает
  onStudents?: (plan: Plan) => void; // пока ничего не делает
  className?: string; // например "md:hidden"
}

// "2026-10-15 10:20:00" -> "2026-10-15 10:20"
const shortDate = (v: string) => v.slice(0, 16);

function Stat({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs font-medium tabular-nums text-slate-700">
      {icon}
      {children}
    </span>
  );
}

export default function PlansMobileList({
  plans,
  onCopyLink,
  onDelete,
  onEdit,
  onStudents,
  className = '',
}: PlansMobileListProps) {
  if (plans.length === 0) {
    return (
      <div className={`py-16 text-center text-sm text-slate-400 ${className}`}>
        Эч нерсе табылган жок
      </div>
    );
  }

  return (
    <ul className={`flex flex-col gap-3 ${className}`}>
      {plans.map((plan) => (
        <li
          key={plan.id}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="flex flex-col gap-3 p-4">
            {/* Заголовок + ID */}
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="break-words text-base font-semibold leading-snug text-blue-600">
                  {plan.title}
                </h3>
                <span className="mt-1.5 inline-block rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                  {plan.group}
                </span>
              </div>
              <span className="shrink-0 pt-0.5 text-xs font-semibold tabular-nums text-slate-400">
                #{plan.id}
              </span>
            </div>

            {/* Параметры */}
            <div className="flex flex-wrap gap-2">
              <Stat
                icon={<HelpOutlineRoundedIcon sx={{ fontSize: 16 }} className="!text-blue-500" />}
              >
                {plan.questionCount ?? DEFAULT_QUESTION_COUNT} суроо
              </Stat>
              <Stat
                icon={<ScheduleRoundedIcon sx={{ fontSize: 16 }} className="!text-slate-400" />}
              >
                {plan.duration ?? DEFAULT_DURATION} мүн.
              </Stat>
              {/* TODO(real data): камера вкл/выкл */}
              <Stat
                icon={<VideocamRoundedIcon sx={{ fontSize: 16 }} className="!text-slate-500" />}
              >
                Камера
              </Stat>
            </div>

            {/* Күнү: от / до */}
            <div className="flex flex-col gap-1.5 rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2.5 text-xs tabular-nums text-slate-600">
              <div className="flex items-center gap-2">
                <span className="w-5 text-slate-400">от</span>
                <span className="font-medium text-slate-700">{shortDate(plan.startAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 text-slate-400">до</span>
                <span className="font-medium text-slate-700">{shortDate(plan.endAt)}</span>
              </div>
            </div>
          </div>

          {/* Действия */}
          <div className="flex items-center justify-between border-t border-slate-100 px-2 py-1.5">
            <div className="flex items-center">
              <IconButton
                aria-label="Өзгөртүү"
                onClick={() => onEdit?.(plan)}
                className="!rounded-xl !p-2.5 !text-emerald-600 active:!bg-emerald-50"
              >
                <EditRoundedIcon fontSize="small" />
              </IconButton>
              <IconButton
                aria-label="Ссылканы көчүрүү"
                onClick={() => onCopyLink(plan)}
                className="!rounded-xl !p-2.5 !text-blue-600 active:!bg-blue-50"
              >
                <LinkRoundedIcon fontSize="small" />
              </IconButton>
              <IconButton
                aria-label="Студенттер"
                onClick={() => onStudents?.(plan)}
                className="!rounded-xl !p-2.5 !text-indigo-600 active:!bg-indigo-50"
              >
                <GroupsRoundedIcon fontSize="small" />
              </IconButton>
            </div>

            <IconButton
              aria-label="Өчүрүү"
              onClick={() => onDelete(plan.id)}
              className="!rounded-xl !p-2.5 !text-rose-500 active:!bg-rose-50"
            >
              <DeleteOutlineRoundedIcon fontSize="small" />
            </IconButton>
          </div>
        </li>
      ))}
    </ul>
  );
}
