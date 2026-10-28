'use client';

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  IconButton,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

export interface StudentRow {
  // --- Реальные данные ---
  id: number | string;
  fullName: string; // ФАА

  // --- Необязательные: если не пришли, берутся дефолты ---
  group?: string; // Тайпа
  discipline?: string; // Дисц.
  score?: number; // Балл
  note?: string; // Эскертүү
}

interface StudentsTableProps {
  students: StudentRow[];
  onAddClick: () => void; // открыть модалку «Агымды тандоо»
  onDelete: (id: StudentRow['id']) => void;
}

/* -------------------------------------------------------------------------- */
/*  Defaults (временные значения, пока неизвестно, как придут данные)          */
/* -------------------------------------------------------------------------- */

// TODO(real data): заменить на реальные значения, когда появится формат данных
const DEFAULT_GROUP = 'ИС-1-21';
const DEFAULT_DISCIPLINE = 'Фронт-энд иштеп чыгуу';
const DEFAULT_SCORE = 0;
const DEFAULT_NOTE = '';

const headCell = '!border-slate-200 !bg-slate-50 !py-3 !text-xs !font-semibold !text-slate-500';
const bodyCell = '!border-slate-100 !py-3.5';

const withDefaults = (s: StudentRow) => ({
  ...s,
  group: s.group ?? DEFAULT_GROUP,
  discipline: s.discipline ?? DEFAULT_DISCIPLINE,
  score: s.score ?? DEFAULT_SCORE,
  note: s.note ?? DEFAULT_NOTE,
});

function ScoreBadge({ value }: { value: number }) {
  return (
    <span className="inline-flex min-w-9 items-center justify-center rounded-lg bg-slate-100 px-2 py-1 text-xs font-semibold tabular-nums text-slate-700">
      {value}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export default function StudentsTable({ students, onAddClick, onDelete }: StudentsTableProps) {
  const rows = students.map(withDefaults);

  return (
    <div className="mx-auto w-full max-w-6xl p-4 sm:p-6">
      {/* Toolbar */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <h1 className="text-lg font-semibold text-slate-900">
          Всего <span className="ml-1 text-sm font-normal text-slate-400">{rows.length}</span>
        </h1>

        <button
          type="button"
          onClick={onAddClick}
          className="inline-flex h-10 items-center gap-1 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
        >
          <AddRoundedIcon fontSize="small" />
          Агымды тандоо
        </button>
      </div>

      {/* Пустое состояние (общее для десктопа и мобилки) */}
      {rows.length === 0 && (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-white py-14 text-center">
          <PersonOutlineRoundedIcon className="!text-slate-300" sx={{ fontSize: 40 }} />
          <p className="text-sm font-medium text-slate-600">Студенттер жок</p>
          <p className="text-xs text-slate-400">«Агымды тандоо» баскычы менен кошуңуз</p>
        </div>
      )}

      {rows.length > 0 && (
        <>
          {/* ------------------------- Desktop: таблица ------------------------- */}
          <TableContainer
            component={Paper}
            elevation={0}
            className="!hidden !rounded-2xl border border-slate-200 !shadow-sm md:!block"
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className={headCell} width={56}>#</TableCell>
                  <TableCell className={headCell} width={48} align="center">?</TableCell>
                  <TableCell className={headCell}>ФАА</TableCell>
                  <TableCell className={headCell}>Тайпа</TableCell>
                  <TableCell className={headCell}>Дисц.</TableCell>
                  <TableCell className={headCell} align="center">Балл</TableCell>
                  <TableCell className={headCell}>Эскертүү</TableCell>
                  <TableCell className={headCell} align="right">Өчүрүү</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {rows.map((s, i) => (
                  <TableRow key={s.id} hover className="last:[&>td]:!border-b-0">
                    <TableCell className={`${bodyCell} !font-semibold tabular-nums text-slate-900`}>
                      {i + 1}
                    </TableCell>

                    {/* TODO(real data): статус студента */}
                    <TableCell className={bodyCell} align="center">
                      <HelpOutlineRoundedIcon sx={{ fontSize: 18 }} className="!text-slate-300" />
                    </TableCell>

                    <TableCell className={`${bodyCell} !font-medium !text-blue-600`}>
                      {s.fullName}
                    </TableCell>

                    <TableCell className={bodyCell}>
                      <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                        {s.group}
                      </span>
                    </TableCell>

                    <TableCell className={`${bodyCell} !text-sm !text-slate-600`}>
                      {s.discipline}
                    </TableCell>

                    <TableCell className={bodyCell} align="center">
                      <ScoreBadge value={s.score} />
                    </TableCell>

                    <TableCell className={`${bodyCell} !text-sm !text-slate-500`}>
                      {s.note || <span className="text-slate-300">—</span>}
                    </TableCell>

                    <TableCell className={bodyCell} align="right">
                      <Tooltip title="Өчүрүү">
                        <IconButton
                          size="small"
                          aria-label="Өчүрүү"
                          onClick={() => onDelete(s.id)}
                          className="!rounded-lg !text-rose-500 hover:!bg-rose-50"
                        >
                          <DeleteOutlineRoundedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* ------------------------- Mobile: карточки ------------------------- */}
          <ul className="flex flex-col gap-3 md:hidden">
            {rows.map((s, i) => (
              <li
                key={s.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="flex flex-col gap-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="break-words text-base font-semibold leading-snug text-blue-600">
                        {s.fullName}
                      </h3>
                      <span className="mt-1.5 inline-block rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                        {s.group}
                      </span>
                    </div>
                    <span className="shrink-0 pt-0.5 text-xs font-semibold tabular-nums text-slate-400">
                      #{i + 1}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2.5">
                    <span className="min-w-0 text-xs text-slate-600">{s.discipline}</span>
                    <span className="flex shrink-0 items-center gap-1.5 text-xs text-slate-400">
                      Балл <ScoreBadge value={s.score} />
                    </span>
                  </div>

                  {s.note && <p className="text-xs text-slate-500">{s.note}</p>}
                </div>

                <div className="flex justify-end border-t border-slate-100 px-2 py-1.5">
                  <IconButton
                    aria-label="Өчүрүү"
                    onClick={() => onDelete(s.id)}
                    className="!rounded-xl !p-2.5 !text-rose-500 active:!bg-rose-50"
                  >
                    <DeleteOutlineRoundedIcon fontSize="small" />
                  </IconButton>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
