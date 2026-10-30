'use client';

import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import {
    Pagination,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    IconButton,
    Snackbar,
    Dialog,
    MenuItem,
    Select,
    useMediaQuery,
} from '@mui/material';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import LinkRoundedIcon from '@mui/icons-material/LinkRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import VideocamRoundedIcon from '@mui/icons-material/VideocamRounded';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';

import NewPlanDialog from './NewPlanDialog';
import PlansMobileList from './PlansMobileList';
import EditPlanDialog, { EditPlanForm } from '@/shared/ui/planning/Editplandialog';
import Link from 'next/link';

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

export interface Option {
    id: number | string;
    name: string;
}

// TODO: заменить на ваш реальный тип TestInitialState (импортом).
export interface TestInitialState {
    title: string;
    teacherId: number | string;
    subjectId: number | string;
    testId: number | string;
    groupId: number | string;
    typeId: number | string;
    questionSetId: number | string;
    startAt: string; // "2026-10-15T10:20" (datetime-local)
    endAt: string;
    showQuestionsToStudents: boolean;
    noShuffle: boolean;
    phoneAccess: boolean;
}

export interface NewPlan {
    open: boolean;
    onClose: () => void;
    onSubmit: (form: TestInitialState) => void;
    teachers: Option[];
    subjects: Option[];
    tests: Option[];
    groups: Option[];
    types: Option[];
    questionSets: Option[];
}

export interface Plan {
    // --- Реальные данные ---
    id: number;
    title: string;
    group: string;
    startAt: string; // "2026-10-15 10:20:00"
    endAt: string;

    // --- Необязательные: если не пришли, берутся дефолты ---
    subject?: string;
    questionCount?: number; // Саны
    duration?: number; // Тесттин убактысы (мин.)
}

// Мета пагинации с бэкенда (формат Laravel paginate)
export interface PaginationMeta {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
}

export interface PlansTableProps {
    /**
     * Если передано — серверная пагинация: в таблице показываются планы текущей страницы,
     * а смена страницы отдаётся наружу через onPageChange.
     * Если нет — пока работает локальная пагинация по моковым данным.
     */
    pagination?: PaginationMeta;
    onPageChange?: (page: number) => void;
    /** Смена «строк на странице» (при серверной пагинации — перезапросить с page=1) */
    onPerPageChange?: (perPage: number) => void;
}

/* -------------------------------------------------------------------------- */
/*  Defaults (временные значения, пока нет реальных данных)                    */
/* -------------------------------------------------------------------------- */

const DEFAULT_QUESTION_COUNT = 20;
const DEFAULT_DURATION = 30;
const DEFAULT_PER_PAGE = 5;
const PER_PAGE_OPTIONS = [5, 10, 25, 50];

// TODO(real data): название предмета из поля «Предмети» выбранного плана
const DEFAULT_SUBJECT = 'дуйно тарыхы';

// TODO(real data): значение поля «Берилүүчү суроонун саны жана убактысы» из модалки
const DEFAULT_QUESTION_SET_LABEL = 'жыйынтык баа учун тест';

// TODO(real data): реальная ссылка плана (в сообщении она была обрезана)
const DEFAULT_LINK =
    'https://testapp.portal.oshsu.kg/openReportTest/227992636ae0269c260';

/* -------------------------------------------------------------------------- */
/*  Mock data                                                                 */
/* -------------------------------------------------------------------------- */

const INITIAL_PLANS: Plan[] = [
    { id: 43857, title: 'new jdflkasj;lkfjksdjlfjldksjfklsdjf;lkjdsklfjsdlkjfakjdflkasj;lkfjksdjlfjldksjfklsdjf;lkjdsklfjsdlkjfak', group: 'MyEDU', startAt: '2026-10-15 10:20:00', endAt: '2026-10-23 10:20:00' },
    { id: 43854, title: 'Для биологии', group: 'login', startAt: '2026-10-08 10:41:00', endAt: '2026-10-30 10:41:00' },
    { id: 43831, title: 'jljk 2', group: 'Ссылка', startAt: '2026-10-07 13:39:00', endAt: '2026-10-31 13:39:00' },
    { id: 38192, title: 'new', group: 'MyEDU', startAt: '2026-04-03 13:21:00', endAt: '2026-04-05 13:21:00' },
    { id: 38191, title: 'jljk', group: 'Ссылка', startAt: '2026-04-07 13:15:00', endAt: '2026-04-17 13:15:00' },

    { id: 4331, title: 'jljk 2', group: 'Ссылка', startAt: '2026-10-07 13:39:00', endAt: '2026-10-31 13:39:00' },
    { id: 3192, title: 'new', group: 'MyEDU', startAt: '2026-04-03 13:21:00', endAt: '2026-04-05 13:21:00' },
    { id: 391, title: 'jljk', group: 'Ссылка', startAt: '2026-04-07 13:15:00', endAt: '2026-04-17 13:15:00' },
    { id: 433, title: 'jljk 2', group: 'Ссылка', startAt: '2026-10-07 13:39:00', endAt: '2026-10-31 13:39:00' },
    { id: 312, title: 'new', group: 'MyEDU', startAt: '2026-04-03 13:21:00', endAt: '2026-04-05 13:21:00' },
    { id: 39, title: 'jljk', group: 'Ссылка', startAt: '2026-04-07 13:15:00', endAt: '2026-04-17 13:15:00' },
];

// TODO: заменить на реальные списки с бэкенда
const MOCK = {
    teachers: [{ id: 1, name: 'Абдалимова Айгерим Жоомартовна' }],
    subjects: [{ id: 1, name: 'дуйно тарыхы' }],
    tests: [{ id: 9263, name: 'жыйынтык баа учун тест (№9263, кол. воп.)' }],
    groups: [
        { id: 1, name: 'MyEDU' },
        { id: 2, name: 'login' },
        { id: 3, name: 'Ссылка' },
    ],
    types: [{ id: 1, name: 'Стандарт' }],
    questionSets: [{ id: 1, name: '20 суроо / 30 мүн.' }],
} satisfies Record<string, Option[]>;

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

// "2026-10-15T10:20" -> "2026-10-15 10:20:00"
const fromDateTimeLocal = (v: string) => {
    if (!v) return '';
    const [d, t = '00:00'] = v.split('T');
    return `${d} ${t.length === 5 ? `${t}:00` : t}`;
};

// "2026-10-15 10:20:00" -> "2026-10-15 10:20"
const shortDate = (v: string) => v.slice(0, 16);

const headCell = '!border-slate-200 !bg-slate-50 !py-3 !text-xs !font-semibold !text-slate-500';
const bodyCell = '!border-slate-100 !py-3.5';

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export default function PlansTable({ pagination, onPageChange, onPerPageChange }: PlansTableProps = {
    pagination: {
        current_page: 1,
        per_page: 2,
        total: 6,
        last_page: 6,
    }
}) {
    const [plans, setPlans] = useState<Plan[]>(INITIAL_PLANS);
    const [query, setQuery] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [toast, setToast] = useState('');
    const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<Plan | null>(null);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return plans;
        return plans.filter(
            (p) => p.title.toLowerCase().includes(q) || String(p.id).includes(q),
        );
    }, [plans, query]);

    /* ---------------------------- Pagination -------------------------------- */

    const [localPage, setLocalPage] = useState(1);
    const [localPerPage, setLocalPerPage] = useState(DEFAULT_PER_PAGE);
    const isMobile = useMediaQuery('(max-width:599px)');

    const isServer = Boolean(pagination);
    const perPage = pagination?.per_page ?? localPerPage;
    const total = pagination?.total ?? filtered.length;
    const pageCount = pagination?.last_page ?? Math.max(1, Math.ceil(filtered.length / perPage));
    const page = pagination?.current_page ?? Math.min(localPage, pageCount);

    // При серверной пагинации бэкенд уже вернул нужную страницу
    const pagedPlans = isServer ? filtered : filtered.slice((page - 1) * perPage, page * perPage);

    const rangeFrom = total === 0 ? 0 : (page - 1) * perPage + 1;
    const rangeTo = Math.min(page * perPage, total);

    // Новый поиск — с первой страницы
    useEffect(() => {
        if (!isServer) setLocalPage(1);
    }, [query, isServer]);

    const handlePageChange = (_: ChangeEvent<unknown>, value: number) => {
        if (isServer) onPageChange?.(value);
        else setLocalPage(value);
    };

    const handlePerPageChange = (value: number) => {
        if (isServer) {
            onPerPageChange?.(value);
        } else {
            setLocalPerPage(value);
            setLocalPage(1);
        }
    };

    /* ----------------------------- Actions ---------------------------------- */

    const handleDelete = (id: number) => {
        // TODO: вызвать API удаления, затем обновить список
        setPlans((prev) => prev.filter((p) => p.id !== id));
    };

    const requestDelete = (plan: Plan) => {
        setDeleteTarget(plan);
        setDeleteOpen(true);
    };

    const confirmDelete = () => {
        if (deleteTarget) handleDelete(deleteTarget.id);
        setDeleteOpen(false);
    };

    const handleCopyLink = async (plan: Plan) => {
        // Формат: "<предмет>: <саны жана убактысы> - Тесттин жүрүшүн онлайн байкоо ссылкасы: <ссылка>"
        const text =
            // TODO(real data): plan.subject — реальный предмет из модалки
            `${plan.subject ?? DEFAULT_SUBJECT}: ` +
            // TODO(real data): реальное значение «Берилүүчү суроонун саны жана убактысы»
            `${DEFAULT_QUESTION_SET_LABEL} - ` +
            // TODO(real data): реальная ссылка плана
            `Тесттин жүрүшүн онлайн байкоо ссылкасы: ${DEFAULT_LINK}`;

        try {
            await navigator.clipboard.writeText(text);
            setToast('Ссылка скопирована');
        } catch {
            setToast('Көчүрүү мүмкүн болгон жок');
        }
    };

    const handleCreate = (form: TestInitialState) => {
        const groupName =
            MOCK.groups.find((g) => g.id === form.groupId)?.name ?? '—';
        const subjectName = MOCK.subjects.find((s) => s.id === form.subjectId)?.name;

        const newPlan: Plan = {
            // TODO: id должен приходить с бэкенда
            id: Math.max(0, ...plans.map((p) => p.id)) + 1,
            title: form.title || 'Аталышы жок',
            group: groupName,
            startAt: fromDateTimeLocal(form.startAt),
            endAt: fromDateTimeLocal(form.endAt),
            subject: subjectName,
        };

        setPlans((prev) => [newPlan, ...prev]);
        setDialogOpen(false);
    };

    const handleUpdate = (form: EditPlanForm) => {
        if (!editingPlan) return;

        // Тело будущего PUT-запроса
        const body = {
            title: form.title.trim(),
            startAt: fromDateTimeLocal(form.startAt), // "2026-10-15 10:20:00"
            endAt: fromDateTimeLocal(form.endAt),
        };

        // TODO: await api.put(`/plans/${editingPlan.id}`, body), затем обновить список
        setPlans((prev) =>
            prev.map((p) => (p.id === editingPlan.id ? { ...p, ...body } : p)),
        );
        setEditingPlan(null);
    };

    /* ------------------------------ Render ---------------------------------- */

    return (
        <div className="mx-auto w-full max-w-6xl p-4 sm:p-6">
            {/* Toolbar */}
            <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <h1 className="w-full text-lg font-semibold text-slate-900">
                    Баары <span className="ml-1 text-sm font-normal text-slate-400">{total}</span>
                </h1>

                <div className="flex items-start sm:items-center justify-end gap-2 flex-col sm:flex-row w-full">
                    <label className="relative">
                        <SearchRoundedIcon
                            fontSize="small"
                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 !text-slate-400"
                        />
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Поиск по ФИО"
                            className="h-10 w-56 rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        />
                    </label>

                    <button
                        type="button"
                        onClick={() => setDialogOpen(true)}
                        className="inline-flex h-10 items-center w-full sm:max-w-[180px] justify-center gap-1 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 cursor-pointer"
                    >
                        <AddRoundedIcon fontSize="small" />
                        Жаңы пландоо
                    </button>
                </div>
            </div>

            {/* Table */}
            <TableContainer
                component={Paper}
                elevation={0}
                className="!rounded-2xl border border-slate-200 !shadow-sm hidden md:block"
            >
                <Table size="medium">
                    <TableHead>
                        <TableRow>
                            <TableCell className={headCell}>#</TableCell>
                            <TableCell className={headCell}>Аталышы</TableCell>
                            <TableCell className={headCell}>Тайпа</TableCell>
                            <TableCell className={headCell} align="center">Тиби</TableCell>
                            <TableCell className={headCell} align="center">Саны</TableCell>
                            <TableCell className={headCell} align="center">Убактысы</TableCell>
                            <TableCell className={headCell}>Күнү</TableCell>
                            <TableCell className={headCell} align="right" />
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {pagedPlans.map((plan) => (
                            <TableRow
                                key={plan.id}
                                hover
                                className="transition-colors last:[&>td]:!border-b-0"
                            >
                                <TableCell className={`${bodyCell} w-[70px] text-xs tabular-nums `}>
                                    {plan.id}
                                </TableCell>

                                <TableCell className={`${bodyCell} !font-medium !text-blue-600 max-w-[200px] break-words`}>
                                    {plan.title}
                                </TableCell>

                                <TableCell className={`${bodyCell} !text-slate-600`}>
                                    {plan.group}
                                </TableCell>

                                {/* Тиби — TODO(real data): камера вкл/выкл */}
                                <TableCell className={bodyCell} align="center">
                                    <VideocamRoundedIcon fontSize="small" className="!text-slate-500" />
                                </TableCell>

                                {/* Саны */}
                                <TableCell className={bodyCell} align="center">
                                    <Link href={'/planning/connectThemes'} className="inline-flex items-center gap-1 text-sm tabular-nums text-slate-700">
                                        {plan.questionCount ?? DEFAULT_QUESTION_COUNT}
                                        <HelpOutlineRoundedIcon sx={{ fontSize: 16 }} className="!text-blue-500" />
                                    </Link>
                                </TableCell>

                                {/* Убактысы */}
                                <TableCell className={bodyCell} align="center">
                                    <span className="inline-flex items-center gap-1 text-sm tabular-nums text-slate-700">
                                        {plan.duration ?? DEFAULT_DURATION}
                                        <ScheduleRoundedIcon sx={{ fontSize: 16 }} className="!text-slate-400" />
                                    </span>
                                </TableCell>

                                {/* Күнү: «от» и «до» друг под другом, мелким шрифтом, по центру строки */}
                                <TableCell className={`${bodyCell} !align-middle`}>
                                    <div className="flex flex-col gap-0.5 text-xs tabular-nums text-slate-600">
                                        <span>
                                            <span className="mr-1.5 inline-block w-5 text-slate-400">от</span>
                                            {shortDate(plan.startAt)}
                                        </span>
                                        <span>
                                            <span className="mr-1.5 inline-block w-5 text-slate-400">до</span>
                                            {shortDate(plan.endAt)}
                                        </span>
                                    </div>
                                </TableCell>

                                {/* Действия */}
                                <TableCell className={bodyCell} align="right">
                                    <div className="flex items-center justify-end gap-1">
                                        <Tooltip title="Өзгөртүү">
                                            <IconButton
                                                size="small"
                                                aria-label="Өзгөртүү"
                                                onClick={() => setEditingPlan(plan)}
                                                className="!rounded-lg !text-emerald-600 hover:!bg-emerald-50"
                                            >
                                                <EditRoundedIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip title="Ссылканы көчүрүү">
                                            <IconButton
                                                size="small"
                                                aria-label="Ссылканы көчүрүү"
                                                onClick={() => handleCopyLink(plan)}
                                                className="!rounded-lg !text-blue-600 hover:!bg-blue-50"
                                            >
                                                <LinkRoundedIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip title="Студенттер">
                                            <Link href={'/planning/streamConnect'}>
                                                <IconButton
                                                    size="small"
                                                    aria-label="Студенттер"
                                                    // TODO: пока ничего не делает
                                                    className="!rounded-lg !text-indigo-600 hover:!bg-indigo-50"
                                                >
                                                    <GroupsRoundedIcon fontSize="small" />
                                                </IconButton>
                                            </Link>
                                        </Tooltip>

                                        <Tooltip title="Өчүрүү">
                                            <IconButton
                                                size="small"
                                                aria-label="Өчүрүү"
                                                onClick={() => requestDelete(plan)}
                                                className="!rounded-lg !text-rose-500 hover:!bg-rose-50"
                                            >
                                                <DeleteOutlineRoundedIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}

                        {pagedPlans.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={8} align="center" className="!py-12 !text-slate-400">
                                    Эч нерсе табылган жок
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <NewPlanDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onSubmit={handleCreate}
                {...MOCK}
            />

            <EditPlanDialog
                plan={editingPlan}
                onClose={() => setEditingPlan(null)}
                onSubmit={handleUpdate}
            />

            <PlansMobileList
                className="md:hidden"
                plans={pagedPlans}
                onCopyLink={handleCopyLink}
                onEdit={(plan) => {
                    setEditingPlan(plan);
                }}
                onDelete={(id) => {
                    const plan = plans.find((p) => p.id === id);
                    if (plan) requestDelete(plan);
                }}
            />

            {/* Пагинация (общая для таблицы и мобильного списка) */}
            {total > 0 && (
                <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
                    {/* <span className="text-xs tabular-nums text-slate-500">
                        {rangeFrom}–{rangeTo} / {total}
                    </span> */}

                    {pageCount > 1 && (
                        <Pagination
                            page={page}
                            count={pageCount}
                            onChange={handlePageChange}
                            color="primary"
                            shape="rounded"
                            size="small"
                            siblingCount={1}
                            boundaryCount={1}
                        />
                    )}
                </div>
            )}

            <Snackbar
                open={!!toast}
                autoHideDuration={2000}
                onClose={() => setToast('')}
                message={toast}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            />

            {/* Диалог удаление */}
            {/* Подтверждение удаления */}
            <Dialog
                open={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                fullWidth
                maxWidth="xs"
                slotProps={{
                    paper: { className: '!rounded-3xl' },
                    transition: { onExited: () => setDeleteTarget(null) },
                }}
            >
                <div className="p-6 sm:p-8">
                    <div className='w-full flex justify-center'>
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-50">
                            <DeleteOutlineRoundedIcon className="!text-rose-500" />
                        </div>
                    </div>

                    <h2 className="text-xl font-semibold text-slate-900">Пландоону өчүрүү</h2>
                    <p className="mt-2 text-sm text-slate-500">
                        <span className='max-w-[250px] break-words text-blue-500'>«{deleteTarget?.title}»</span>
                        (#{deleteTarget?.id}) өчүрүлөт. Бул аракетти кайтаруу мүмкүн эмес.
                    </p>

                    <div className="mt-8 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setDeleteOpen(false)}
                            className="h-12 cursor-pointer rounded-xl bg-slate-100 px-6 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-200"
                        >
                            Артка
                        </button>
                        <button
                            type="button"
                            onClick={confirmDelete}
                            className="h-12 cursor-pointer rounded-xl bg-red-500 px-6 text-sm font-semibold text-white shadow-md shadow-red-500/30 transition-colors hover:bg-red-600"
                        >
                            Өчүрүү
                        </button>
                    </div>
                </div>
            </Dialog>
        </div>
    );
}
