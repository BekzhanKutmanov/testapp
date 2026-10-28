'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Checkbox,
  IconButton,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

export interface Option {
  id: number | string;
  name: string;
}

export interface StudentOption {
  id: number | string;
  fullName: string;
}

export interface AddStudentsFilters {
  academicYear: number | string; // Окуу жылы
  faculty: number | string; // Факультет
  specialty: number | string; // Адистикти тандоо
  studyForm: number | string; // Форма обучение
  semester: number | string; // Семестр
  admission: number | string; // Кабыл алуу
  subject: number | string; // Предмет
  stream: number | string; // Агым
  statement: number | string; // Ведомость
}

export type FilterOptions = Partial<Record<keyof AddStudentsFilters, Option[]>>;

interface AddStudentsDialogProps {
  open: boolean;
  onClose: () => void;
  /** Вызывается при каждом изменении фильтров (например, чтобы загрузить студентов потока) */
  onFiltersChange?: (filters: AddStudentsFilters) => void;
  onSubmit: (selected: StudentOption[], filters: AddStudentsFilters) => void;
  /** Списки для селектов. Пустой/отсутствующий список — селект неактивен. */
  options: FilterOptions;
  /** Студенты выбранного потока (появляются справа после заполнения фильтров) */
  students: StudentOption[];
  initialFilters?: Partial<AddStudentsFilters>;
}

/* -------------------------------------------------------------------------- */
/*  Config                                                                    */
/* -------------------------------------------------------------------------- */

const FIELDS: {
  key: keyof AddStudentsFilters;
  label: string;
  placeholder?: string;
  full?: boolean;
}[] = [
  { key: 'academicYear', label: 'Окуу жылы', full: true },
  { key: 'faculty', label: 'Факультет', placeholder: 'Факультети танданыз', full: true },
  { key: 'specialty', label: 'Адистикти тандоо', full: true },
  { key: 'studyForm', label: 'Форма обучение' },
  { key: 'semester', label: 'Семестр', placeholder: 'выберите семестр' },
  { key: 'admission', label: 'Кабыл алуу', placeholder: 'выберите' },
  { key: 'stream', label: 'Агым' },
  { key: 'subject', label: 'Предмет', full: true },
  { key: 'statement', label: 'Ведомость', placeholder: 'Выберите', full: true },
];

const EMPTY_FILTERS: AddStudentsFilters = {
  academicYear: '',
  faculty: '',
  specialty: '',
  studyForm: '',
  semester: '',
  admission: '',
  subject: '',
  stream: '',
  statement: '',
};

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: '#f8fafc',
    transition: 'background-color .15s',
    '& fieldset': { borderColor: '#e2e8f0' },
    '&:hover fieldset': { borderColor: '#cbd5e1' },
    '&.Mui-focused': { backgroundColor: '#fff' },
    '&.Mui-focused fieldset': { borderColor: '#2563eb', borderWidth: 1.5 },
  },
  '& .MuiInputLabel-root.Mui-focused': { color: '#2563eb' },
};

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export default function AddStudentsDialog({
  open,
  onClose,
  onFiltersChange,
  onSubmit,
  options,
  students,
  initialFilters,
}: AddStudentsDialogProps) {
  const [filters, setFilters] = useState<AddStudentsFilters>({
    ...EMPTY_FILTERS,
    ...initialFilters,
  });
  const [selected, setSelected] = useState<Set<StudentOption['id']>>(new Set());
  const [search, setSearch] = useState('');

  // Новый список студентов (другой поток) — сбрасываем выбор
  useEffect(() => {
    setSelected(new Set());
    setSearch('');
  }, [students]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? students.filter((s) => s.fullName.toLowerCase().includes(q)) : students;
  }, [students, search]);

  const allVisibleSelected = visible.length > 0 && visible.every((s) => selected.has(s.id));
  const someVisibleSelected = visible.some((s) => selected.has(s.id));

  const setFilter = (key: keyof AddStudentsFilters) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = { ...filters, [key]: e.target.value };
    setFilters(next);
    onFiltersChange?.(next);
  };

  const toggleOne = (id: StudentOption['id']) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const toggleAll = () =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (allVisibleSelected) visible.forEach((s) => next.delete(s.id));
      else visible.forEach((s) => next.add(s.id));
      return next;
    });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(
      students.filter((s) => selected.has(s.id)),
      filters,
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      scroll="paper"
      slotProps={{
        paper: {
          component: 'form',
          onSubmit: handleSubmit,
          className: '!rounded-3xl !shadow-2xl',
        },
        backdrop: { className: '!bg-slate-900/50 backdrop-blur-sm' },
      }}
    >
      {/* Header */}
      <DialogTitle className="!flex !items-center !justify-between !px-6 !pb-2 !pt-5">
        <span className="text-xl font-semibold tracking-tight text-slate-900">Жаңы кошуу</span>
        <IconButton
          onClick={onClose}
          size="small"
          aria-label="Жабуу"
          className="!text-slate-400 hover:!bg-slate-100 hover:!text-slate-600"
        >
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent className="!px-6 !pb-2 !pt-3">
        <div className="grid grid-cols-1 gap-6 pt-2 md:grid-cols-[1fr_320px]">
          {/* ----------------------------- Фильтры ----------------------------- */}
          <div className="grid grid-cols-2 gap-4 self-start">
            {FIELDS.map(({ key, label, placeholder, full }) => {
              const items = options[key] ?? [];
              return (
                <div key={key} className={full ? 'col-span-2' : 'col-span-2 sm:col-span-1'}>
                  <TextField
                    select
                    fullWidth
                    label={label}
                    value={filters[key]}
                    onChange={setFilter(key)}
                    disabled={items.length === 0}
                    sx={fieldSx}
                    slotProps={{
                      select: { displayEmpty: !!placeholder },
                      inputLabel: { shrink: true },
                    }}
                  >
                    {placeholder && (
                      <MenuItem value="" disabled>
                        {placeholder}
                      </MenuItem>
                    )}
                    {items.map((o) => (
                      <MenuItem key={o.id} value={o.id}>
                        {o.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
              );
            })}
          </div>

          {/* ------------------------ Список студентов ------------------------- */}
          <div className="flex min-h-[320px] flex-col self-stretch rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 px-4 py-3">
              <span className="text-sm font-semibold text-slate-800">Список студентов</span>
              <label className="flex cursor-pointer select-none items-center text-xs text-slate-600">
                <Checkbox
                  size="small"
                  checked={allVisibleSelected}
                  indeterminate={!allVisibleSelected && someVisibleSelected}
                  onChange={toggleAll}
                  disabled={visible.length === 0}
                  className="!p-1"
                />
                Выбрать все
              </label>
            </div>

            {students.length > 0 && (
              <div className="border-b border-slate-100 p-2.5">
                <label className="relative block">
                  <SearchRoundedIcon
                    sx={{ fontSize: 18 }}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 !text-slate-400"
                  />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Издөө"
                    className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                  />
                </label>
              </div>
            )}

            {students.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 py-10 text-center">
                <GroupsRoundedIcon className="!text-slate-300" sx={{ fontSize: 36 }} />
                <p className="text-sm text-slate-400">Агымды тандаңыз, студенттер ушул жерде чыгат</p>
              </div>
            ) : (
              <ul className="max-h-[420px] flex-1 overflow-y-auto p-1.5">
                {visible.map((s) => (
                  <li key={s.id}>
                    <label className="flex cursor-pointer items-center gap-1 rounded-lg px-1.5 py-1 text-sm text-slate-700 transition-colors hover:bg-slate-50">
                      <Checkbox
                        size="small"
                        checked={selected.has(s.id)}
                        onChange={() => toggleOne(s.id)}
                        className="!p-1.5"
                      />
                      {s.fullName}
                    </label>
                  </li>
                ))}
                {visible.length === 0 && (
                  <li className="py-6 text-center text-sm text-slate-400">Эч нерсе табылган жок</li>
                )}
              </ul>
            )}

            {students.length > 0 && (
              <div className="border-t border-slate-100 px-4 py-2 text-xs text-slate-400">
                Тандалды: {selected.size} / {students.length}
              </div>
            )}
          </div>
        </div>
      </DialogContent>

      {/* Footer */}
      <DialogActions className="!gap-2 !px-6 !pb-5 !pt-4">
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/40"
        >
          Жокко чыгаруу
        </button>
        <button
          type="submit"
          disabled={selected.size === 0}
          className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
        >
          Кошуу{selected.size > 0 && ` (${selected.size})`}
        </button>
      </DialogActions>
    </Dialog>
  );
}
