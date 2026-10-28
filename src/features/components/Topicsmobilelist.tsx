'use client';

import type { Topic } from './TopicsTable';

interface Props {
    topics: Topic[];
    className?: string;
}

export default function TopicsMobileList({ topics, className = '' }: Props) {
    if (topics.length === 0) {
        return (
            <div className={`rounded-2xl border border-slate-200 bg-white py-12 text-center text-sm text-slate-400 ${className}`}>
                Эч нерсе табылган жок
            </div>
        );
    }

    return (
        <ul className={`flex flex-col gap-3 ${className}`}>
            {topics.map((topic) => (
                <li
                    key={topic.id}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                    <div className="flex items-start justify-between gap-3">
                        <p className="text-sm font-medium leading-snug text-slate-900">{topic.test}</p>
                        <span className="shrink-0 rounded-lg bg-slate-100 px-2 py-0.5 text-xs font-semibold tabular-nums text-slate-500">
                            #{topic.id}
                        </span>
                    </div>

                    <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
                        <dt className="text-slate-400">Окутуучу</dt>
                        <dd className="text-slate-700">{topic.teacher}</dd>

                        <dt className="text-slate-400">Предмети</dt>
                        <dd className="text-slate-700">{topic.subject}</dd>

                        <dt className="text-slate-400">Суроонун саны</dt>
                        <dd className="tabular-nums text-slate-700">{topic.questionCount}</dd>
                    </dl>
                </li>
            ))}
        </ul>
    );
}
