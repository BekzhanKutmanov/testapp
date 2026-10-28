'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Switch,
    Collapse,
    IconButton,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';

/**
 * Required: @mui/material @mui/icons-material @emotion/react @emotion/styled (MUI v6/v7)
 *
 * Usage:
 * <NewPlanDialog
 *   open={open}
 *   onClose={() => setOpen(false)}
 *   onSubmit={(data) => console.log(data)}
 *   teachers={[{ id: 1, name: 'Абдалимова Айгерим Жоомартовна' }]}
 *   subjects={[{ id: 1, name: 'дуйно тарыхы' }]}
 *   tests={[{ id: 9263, name: 'жыйынтык баа учун тест (№9263, кол. воп.)' }]}
 *   groups={[{ id: 1, name: 'MyEDU' }]}
 *   types={[{ id: 1, name: 'Стандарт' }]}
 *   questionSets={[{ id: 1, name: '20 суроо / 40 мүн.' }]}
 * />
 */

// Общие стили полей MUI: скругление + мягкий фокус. Всё остальное — Tailwind.
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

interface TestInitialState {
    title: string,
    teacherId: string,
    subjectId: string,
    testId: string,
    groupId: string,
    typeId: string,
    questionSetId: string,
    startAt: string,
    endAt: string,
    showQuestionsToStudents: boolean,
    noShuffle: boolean,
    phoneAccess: boolean,
}

const initialState = {
    title: '',
    teacherId: '',
    subjectId: '',
    testId: '',
    groupId: '',
    typeId: '',
    questionSetId: '',
    startAt: '',
    endAt: '',
    showQuestionsToStudents: false,
    noShuffle: false,
    phoneAccess: false,
};

function Select({ label, value, onChange, items = [], placeholder }) {
    return (
        <TextField
            select
            fullWidth
            label={label}
            value={value}
            onChange={onChange}
            sx={fieldSx}
            slotProps={{
                select: { displayEmpty: !!placeholder },
                inputLabel: placeholder ? { shrink: true } : undefined,
            }}
        >
            {placeholder && (
                <MenuItem value="" disabled>
                    {placeholder}
                </MenuItem>
            )}
            {items.map((i) => (
                <MenuItem key={i.id} value={i.id}>
                    {i.name}
                </MenuItem>
            ))}
        </TextField>
    );
}

function ToggleRow({ label, checked, onChange }) {
    return (
        <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl px-3 py-2.5 transition-colors hover:bg-slate-50">
            <span className="text-sm text-slate-700">{label}</span>
            <Switch size="small" checked={checked} onChange={onChange} />
        </label>
    );
}

interface NewPlan {
    open: boolean,
    onClose: ()=> void,
    onSubmit: (form: TestInitialState)=> void,
    teachers: null,
    subjects: null,
    tests: null,
    groups: null,
    types: null,
    questionSets: null,
}

export default function NewPlanDialog({
    open,
    onClose,
    onSubmit,
    teachers,
    subjects,
    tests,
    groups,
    types,
    questionSets,
}: NewPlan) {
    const [form, setForm] = useState<TestInitialState>(initialState);
    const [showMore, setShowMore] = useState(false);

    const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
    const toggle = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.checked }));

    const handleClose = () => {
        onClose?.();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit?.(form);
    };

    const dateField = (label, key) => (
        <TextField
            fullWidth
            type="datetime-local"
            label={label}
            value={form[key]}
            onChange={set(key)}
            sx={fieldSx}
            InputLabelProps={{ shrink: true }}
        />
    );

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
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
                <span className="text-xl font-semibold tracking-tight text-slate-900">
                    Жаңы пландоо
                </span>
                <IconButton
                    onClick={handleClose}
                    size="small"
                    aria-label="Жабуу"
                    className="!text-slate-400 hover:!bg-slate-100 hover:!text-slate-600"
                >
                    <CloseRoundedIcon fontSize="small" />
                </IconButton>
            </DialogTitle>

            {/* Body */}
            <DialogContent className="!px-6 !pb-2 !pt-3">
                <div className="flex flex-col gap-4 pt-2">
                    <TextField
                        fullWidth
                        label="Аталышы"
                        value={form.title}
                        onChange={set('title')}
                        sx={fieldSx}
                    />

                    <Select label="Окутуучу" value={form.teacherId} onChange={set('teacherId')} items={teachers} />

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Select label="Предмети" value={form.subjectId} onChange={set('subjectId')} items={subjects} />
                        <Select label="Тайпа" value={form.groupId} onChange={set('groupId')} items={groups} />
                    </div>

                    <Select label="Тест" value={form.testId} onChange={set('testId')} items={tests} />

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Select label="Тиби" value={form.typeId} onChange={set('typeId')} items={types} />
                        <Select
                            label="Берилүүчү суроонун саны жана убактысы"
                            value={form.questionSetId}
                            onChange={set('questionSetId')}
                            items={questionSets}
                            placeholder="-------"
                        />
                    </div>

                    {/* Башталышы — Аягы в один ряд */}
                    <div className="flex items-center gap-3">
                        <div className="min-w-0 flex-1">{dateField('Башталышы', 'startAt')}</div>
                        <span className="select-none text-slate-300" aria-hidden>
                            —
                        </span>
                        <div className="min-w-0 flex-1">{dateField('Аягы', 'endAt')}</div>
                    </div>

                    {/* Дополнительные настройки */}
                    <div>
                        <button
                            type="button"
                            onClick={() => setShowMore((v) => !v)}
                            aria-expanded={showMore}
                            className="inline-flex items-center gap-1 rounded-md text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 cursor-pointer"
                        >
                            Кошумча параметрлер
                            <ExpandMoreRoundedIcon
                                fontSize="small"
                                className={`transition-transform duration-200 ${showMore ? 'rotate-180' : ''}`}
                            />
                        </button>

                        <Collapse in={showMore} unmountOnExit>
                            <div className="mt-2 divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white p-1">
                                <ToggleRow
                                    label="Тесттин суроолорун студенттер көрө алат"
                                    checked={form.showQuestionsToStudents}
                                    onChange={toggle('showQuestionsToStudents')}
                                />
                                <ToggleRow
                                    label="Суроолор аралаштырылбайт"
                                    checked={form.noShuffle}
                                    onChange={toggle('noShuffle')}
                                />
                                <ToggleRow
                                    label="Телефондон кире алат"
                                    checked={form.phoneAccess}
                                    onChange={toggle('phoneAccess')}
                                />
                            </div>
                        </Collapse>
                    </div>
                </div>
            </DialogContent>

            {/* Footer */}
            <DialogActions className="!gap-2 !px-6 !pb-5 !pt-4">
                <button
                    type="button"
                    onClick={handleClose}
                    className="rounded-xl px-4 py-2.5 text-sm font-medium bg-red-400 text-white transition-colors hover:bg-red-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/40 cursor-pointer"
                >
                    Жокко чыгаруу
                </button>
                <button
                    type="submit"
                    className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 cursor-pointer"
                >
                    Кошуу
                </button>
            </DialogActions>
        </Dialog>
    );
}
