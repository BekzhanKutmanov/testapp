'use client';

import { useEffect, useState } from 'react';
import { Dialog, IconButton } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

// Минимальный набор полей плана (чтобы не импортировать Plan и не делать цикл)
export interface EditablePlan {
    id: number;
    title: string;
    startAt: string; // "2026-10-15 10:20:00"
    endAt: string;
}

// Черновик формы. Даты в формате datetime-local: "2026-10-15T10:20"
export interface EditPlanForm {
    title: string;
    startAt: string;
    endAt: string;
}

interface Props {
    plan: EditablePlan | null; // null -> окно закрыто
    onClose: () => void;
    onSubmit: (form: EditPlanForm) => void;
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

// "2026-10-15 10:20:00" -> "2026-10-15T10:20"
const toDateTimeLocal = (v: string) => v.replace(' ', 'T').slice(0, 16);

const inputClass =
    'h-14 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 pb-1 pt-5 text-sm text-slate-800 outline-none transition focus:border-slate-500 focus:bg-white';
const labelClass =
    'pointer-events-none absolute left-4 top-2 text-xs text-slate-500';

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export default function EditPlanDialog({ plan, onClose, onSubmit }: Props) {
    // Черновик: живёт только внутри модалки
    const [form, setForm] = useState<EditPlanForm>({ title: '', startAt: '', endAt: '' });

    // При открытии (смене плана) заполняем черновик данными плана
    useEffect(() => {
        if (!plan) return;
        setForm({
            title: plan.title,
            startAt: toDateTimeLocal(plan.startAt),
            endAt: toDateTimeLocal(plan.endAt),
        });
    }, [plan]);

    const set = (key: keyof EditPlanForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm((prev) => ({ ...prev, [key]: e.target.value }));

    const datesInvalid = !!form.startAt && !!form.endAt && form.endAt <= form.startAt;
    const canSubmit = form.title.trim() !== '' && !!form.startAt && !!form.endAt && !datesInvalid;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSubmit) return;
        onSubmit(form);
    };

    return (
        <Dialog
            open={!!plan}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            slotProps={{ paper: { className: '!rounded-3xl' } }}
        >
            <form onSubmit={handleSubmit} className="p-6 sm:p-8">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-semibold text-slate-900">Өзгөртүү</h2>
                    <IconButton size="small" aria-label="Жабуу" onClick={onClose} className="!text-slate-400">
                        <CloseRoundedIcon />
                    </IconButton>
                </div>

                {/* Body */}
                <div className="flex flex-col gap-4">
                    <div className="relative">
                        <label htmlFor="plan-title" className={labelClass}>Аталышы</label>
                        <input
                            id="plan-title"
                            type="text"
                            value={form.title}
                            onChange={set('title')}
                            className={inputClass}
                        />
                    </div>

                    <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:gap-3">
                        <div className="relative flex-1">
                            <label htmlFor="plan-start" className={labelClass}>Башталышы</label>
                            <input
                                id="plan-start"
                                type="datetime-local"
                                value={form.startAt}
                                onChange={set('startAt')}
                                className={inputClass}
                            />
                        </div>

                        <span className="hidden h-px w-4 shrink-0 bg-slate-300 sm:block" />

                        <div className="relative flex-1">
                            <label htmlFor="plan-end" className={labelClass}>Аягы</label>
                            <input
                                id="plan-end"
                                type="datetime-local"
                                value={form.endAt}
                                min={form.startAt || undefined}
                                onChange={set('endAt')}
                                className={`${inputClass} ${datesInvalid ? '!border-rose-400' : ''}`}
                            />
                        </div>
                    </div>

                    {datesInvalid && (
                        <p className="-mt-2 text-xs text-rose-500">
                            Аягы башталышынан кийин болушу керек
                        </p>
                    )}
                </div>

                {/* Footer */}
                <div className="mt-8 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="h-12 cursor-pointer rounded-xl bg-red-400 px-6 text-sm font-semibold text-white transition-colors hover:bg-red-500"
                    >
                        Артка
                    </button>
                    <button
                        type="submit"
                        disabled={!canSubmit}
                        className="h-12 cursor-pointer rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white shadow-md shadow-blue-600/30 transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Өзгөртүү
                    </button>
                </div>
            </form>
        </Dialog>
    );
}
