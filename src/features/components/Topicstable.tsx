'use client';

import { useState } from 'react';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Dialog,
    IconButton,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';

import TopicsMobileList from './Topicsmobilelist';

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

export interface Option {
    id: number | string;
    name: string;
}

export interface Topic {
    id: number;
    teacher: string; // Окутуучу
    subject: string; // Предмети
    test: string; // Тести
    questionCount: number; // Суроонун саны
}

// Черновик формы создания (хранится только пока открыта модалка)
interface TopicForm {
    teacherId: string;
    subjectId: string;
    testId: string;
    questionCount: string; // строка, т.к. значение из <input>
}

const EMPTY_FORM: TopicForm = { teacherId: '', subjectId: '', testId: '', questionCount: '' };

/* -------------------------------------------------------------------------- */
/*  Mock data                                                                 */
/* -------------------------------------------------------------------------- */

const INITIAL_TOPICS: Topic[] = [
    {
        id: 1,
        teacher: 'Айтурган',
        subject: 'МАК3',
        test: 'Кыргыз тили жана адабиятынын практикалык курсу ( №=1)',
        questionCount: 10,
    },
];

// TODO: заменить на реальные списки с бэкенда
const OPTIONS = {
    teachers: [
        { id: 1, name: 'Айтурган' },
        { id: 2, name: 'Абдалимова Айгерим Жоомартовна' },
    ],
    subjects: [
        { id: 1, name: 'МАК3' },
        { id: 2, name: 'дуйно тарыхы' },
    ],
    tests: [
        { id: 1, name: 'Кыргыз тили жана адабиятынын практикалык курсу ( №=1)' },
        { id: 9263, name: 'жыйынтык баа учун тест (№9263, кол. воп.)' },
    ],
} satisfies Record<string, Option[]>;

/* -------------------------------------------------------------------------- */
/*  Styles                                                                    */
/* -------------------------------------------------------------------------- */

const headCell = '!border-slate-200 !bg-slate-50 !py-3 !text-xs !font-semibold !text-slate-500';
const bodyCell = '!border-slate-100 !py-3.5';

const inputClass =
    'h-14 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 pb-1 pt-5 text-sm text-slate-800 outline-none transition focus:border-slate-500 focus:bg-white';
const labelClass = 'pointer-events-none absolute left-4 top-2 text-xs text-slate-500';

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export default function TopicsTable() {
    const [topics, setTopics] = useState<Topic[]>(INITIAL_TOPICS);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [form, setForm] = useState<TopicForm>(EMPTY_FORM);

    /* ----------------------------- Dialog ----------------------------------- */

    const openDialog = () => {
        setForm(EMPTY_FORM);
        setDialogOpen(true);
    };

    const closeDialog = () => setDialogOpen(false);

    const setField = (key: keyof TopicForm, value: string) =>
        setForm((prev) => ({ ...prev, [key]: value }));

    const countNumber = Number(form.questionCount);
    const canSubmit =
        form.teacherId !== '' &&
        form.subjectId !== '' &&
        form.testId !== '' &&
        Number.isInteger(countNumber) &&
        countNumber > 0;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSubmit) return;

        const nameOf = (list: Option[], id: string) =>
            list.find((o) => String(o.id) === id)?.name ?? '—';

        const newTopic: Topic = {
            // TODO: id должен приходить с бэкенда (POST)
            id: Math.max(0, ...topics.map((t) => t.id)) + 1,
            teacher: nameOf(OPTIONS.teachers, form.teacherId),
            subject: nameOf(OPTIONS.subjects, form.subjectId),
            test: nameOf(OPTIONS.tests, form.testId),
            questionCount: countNumber,
        };

        setTopics((prev) => [newTopic, ...prev]);
        closeDialog();
    };

    // Конфиг селектов, чтобы не повторять разметку
    const selectFields: { key: 'teacherId' | 'subjectId' | 'testId'; label: string; options: Option[] }[] = [
        { key: 'teacherId', label: 'Окутуучу', options: OPTIONS.teachers },
        { key: 'subjectId', label: 'Предмети', options: OPTIONS.subjects },
        { key: 'testId', label: 'Тест', options: OPTIONS.tests },
    ];

    /* ------------------------------ Render ---------------------------------- */

    return (
        <div className="mx-auto w-full max-w-6xl p-4 sm:p-6">
            {/* Toolbar */}
            <div className="mb-4 flex items-center justify-between gap-3">
                <h1 className="text-lg font-semibold text-slate-900">
                    Баары <span className="ml-1 text-sm font-normal text-slate-400">{topics.length}</span>
                </h1>

                <button
                    type="button"
                    onClick={openDialog}
                    className="inline-flex h-10 cursor-pointer items-center justify-center gap-1 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
                >
                    <AddRoundedIcon fontSize="small" />
                    Тема
                </button>
            </div>

            {/* Table (desktop) */}
            <TableContainer
                component={Paper}
                elevation={0}
                className="hidden !rounded-2xl border border-slate-200 !shadow-sm md:block"
            >
                <Table size="medium">
                    <TableHead>
                        <TableRow>
                            <TableCell className={headCell}>#</TableCell>
                            <TableCell className={headCell}>Окутуучу</TableCell>
                            <TableCell className={headCell}>Предмети</TableCell>
                            <TableCell className={headCell}>Тести</TableCell>
                            <TableCell className={headCell} align="right">Суроонун саны</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {topics.map((topic) => (
                            <TableRow key={topic.id} hover className="transition-colors last:[&>td]:!border-b-0">
                                <TableCell className={`${bodyCell} !font-semibold tabular-nums text-slate-900`}>
                                    {topic.id}
                                </TableCell>
                                <TableCell className={`${bodyCell} !font-medium !text-slate-800`}>
                                    {topic.teacher}
                                </TableCell>
                                <TableCell className={`${bodyCell} !text-slate-600`}>{topic.subject}</TableCell>
                                <TableCell className={`${bodyCell} !text-slate-600`}>{topic.test}</TableCell>
                                <TableCell className={`${bodyCell} !text-slate-700 tabular-nums`} align="right">
                                    {topic.questionCount}
                                </TableCell>
                            </TableRow>
                        ))}

                        {topics.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} align="center" className="!py-12 !text-slate-400">
                                    Эч нерсе табылган жок
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Mobile list */}
            <TopicsMobileList className="md:hidden" topics={topics} />

            {/* Модалка создания */}
            <Dialog
                open={dialogOpen}
                onClose={closeDialog}
                fullWidth
                maxWidth="sm"
                slotProps={{ paper: { className: '!rounded-3xl' } }}
            >
                <form onSubmit={handleSubmit} className="p-6 sm:p-8">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-2xl font-semibold text-slate-900">Жаңы пландоо</h2>
                        <IconButton size="small" aria-label="Жабуу" onClick={closeDialog} className="!text-slate-400">
                            <CloseRoundedIcon />
                        </IconButton>
                    </div>

                    <div className="flex flex-col gap-4">
                        {selectFields.map(({ key, label, options }) => (
                            <div key={key} className="relative">
                                <label htmlFor={`topic-${key}`} className={labelClass}>
                                    {label}
                                </label>
                                <select
                                    id={`topic-${key}`}
                                    value={form[key]}
                                    onChange={(e) => setField(key, e.target.value)}
                                    className={`${inputClass} cursor-pointer appearance-none truncate pr-10 ${
                                        form[key] === '' ? '!text-slate-400' : ''
                                    }`}
                                >
                                    <option value="" disabled>
                                        Тандаңыз
                                    </option>
                                    {options.map((o) => (
                                        <option key={o.id} value={o.id} className="text-slate-800">
                                            {o.name}
                                        </option>
                                    ))}
                                </select>
                                <KeyboardArrowDownRoundedIcon className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 !text-slate-500" />
                            </div>
                        ))}

                        <div className="relative">
                            <label htmlFor="topic-count" className={labelClass}>
                                Суроонун саны
                            </label>
                            <input
                                id="topic-count"
                                type="number"
                                inputMode="numeric"
                                min={1}
                                step={1}
                                value={form.questionCount}
                                onChange={(e) => setField('questionCount', e.target.value)}
                                className={inputClass}
                            />
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={closeDialog}
                            className="h-12 cursor-pointer rounded-xl bg-red-400 px-6 text-sm font-semibold text-white transition-colors hover:bg-red-500"
                        >
                            Жокко чыгаруу
                        </button>
                        <button
                            type="submit"
                            disabled={!canSubmit}
                            className="h-12 cursor-pointer rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white shadow-md shadow-blue-600/30 transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Кошуу
                        </button>
                    </div>
                </form>
            </Dialog>
        </div>
    );
}
