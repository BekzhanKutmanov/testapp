'use client';

import { useEffect, useRef, useState } from 'react';
import { Badge, ButtonBase, Fab } from '@mui/material';
import FormatListNumberedRoundedIcon from '@mui/icons-material/FormatListNumberedRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import NavigationItems from '../navigation-items/NavigationItems';

export interface NavigatorItem {
    id: string;
    answered: boolean;
}

interface QuestionNavigatorProps {
    items: NavigatorItem[];
    onSelect: (id: string) => void;
}

/**
 * Компактное раскрывающееся меню-«якорь» в правом нижнем углу.
 * Закрыто — видна только маленькая кнопка со счётчиком неотвеченных.
 * Открыто — сетка номеров: красный = без ответа, зелёный = есть ответ.
 */
export default function QuestionNavigator({ items, onSelect }: QuestionNavigatorProps) {
    const [open, setOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null);

    const answeredCount = items.filter((i) => i.answered).length;
    const unansweredCount = items.length - answeredCount;

    // Закрываем по клику вне меню и по Escape
    useEffect(() => {
        if (!open) return;

        const onPointerDown = (e: PointerEvent) => {
            if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
        };
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false);
        };

        document.addEventListener('pointerdown', onPointerDown);
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('pointerdown', onPointerDown);
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [open]);

    const handleSelect = (id: string) => {
        onSelect(id);
        // на телефоне закрываем меню, чтобы оно не закрывало вопрос
        if (window.innerWidth < 640) setOpen(false);
    };

    const navigationItems = () => (
        <div className="grid max-h-[45vh] grid-cols-4 gap-1.5 overflow-y-auto p-0.5">
            {items.map((item, index) => (
                <ButtonBase
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    aria-label={`Вопрос ${index + 1}: ${item.answered ? 'есть ответ' : 'нет ответа'}`}
                    className={`aspect-square w-[30px] rounded-lg border text-xs font-semibold transition-colors duration-300 ${item.answered
                        ? 'border-emerald-200 bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
                        : 'border-red-200 bg-red-100 text-red-600 hover:bg-red-100'
                        }`}
                >
                    {index + 1}
                </ButtonBase>
            ))}
        </div>
    );

    return (
        <div className={`sticky bottom-4 z-30 mt-16 h-0 sm:bottom-6 ${!open ? '' : ''}`}>
            <div ref={rootRef} className="absolute bottom-0 right-0 flex flex-col items-end gap-3">
                {/* Панель */}
                <div
                    id="question-navigator-panel"
                    className={`w-[180px] origin-bottom-right rounded-2xl border border-slate-200 bg-white p-2 shadow-xl transition-all duration-300 ease-out ${open ? 'visible translate-y-0 scale-100 opacity-100' : 'invisible translate-y-2 scale-95 opacity-0'
                        }`}
                >
                    <p className="mb-2.5 text-xs text-slate-500">
                        Отвечено {answeredCount} из {items.length}
                    </p>

                    {navigationItems()}

                </div>

                {/* Кнопка-переключатель */}
                <Badge
                    badgeContent={open ? 0 : unansweredCount}
                    color="error"
                    overlap="circular"
                    sx={{ '& .MuiBadge-badge': { transition: 'transform 0.3s ease' } }}
                    className='pr-2'
                >
                    <Fab
                        size="small"
                        onClick={() => setOpen((v) => !v)}
                        aria-label={open ? 'Скрыть список вопросов' : 'Показать список вопросов'}
                        aria-expanded={open}
                        aria-controls="question-navigator-panel"
                        sx={{
                            bgcolor: '#fff',
                            color: '#334155',
                            boxShadow: '0 4px 14px rgba(15, 23, 42, 0.15)',
                            transition: 'all 0.3s ease',
                            '&:hover': { bgcolor: '#f8fafc' },
                        }}
                    >
                        {open ? <CloseRoundedIcon /> : <FormatListNumberedRoundedIcon />}
                    </Fab>
                </Badge>
                {/* <div
                    color="error"
                    className=''
                >
                    <div
                        onClick={() => setOpen((v) => !v)}
                        aria-label={open ? 'Скрыть список вопросов' : 'Показать список вопросов'}
                        aria-expanded={open}
                        aria-controls="question-navigator-panel"
                        className='flex items-center bg-black h-12 cursor-pointer'
                        style={{borderRadius: '10px 0px 0px 10px'}}
                    >
                        {open ? <CloseRoundedIcon className='text-white'/> : <KeyboardArrowLeftIcon className='text-white'/>}
                    </div>
                </div> */}
            </div>
        </div>
    );

    // return (
    //     <div className={`sticky bottom-4 z-30 mt-16 h-0 sm:bottom-6 ${!open ? '' : ''}`}>
    //         <div ref={rootRef} className="absolute w-full bottom-0 right-0 flex items-end gap-3">
    //             {/* Панель */}
    //             <div
    //                 id="question-navigator-panel"
    //                 className={`origin-bottom-right rounded-2xl border border-slate-200 bg-white p-2 shadow-xl transition-all duration-300 ease-out w-full ${open ? 'visible translate-y-0 scale-100 opacity-100' : 'invisible translate-y-2 scale-95 opacity-0'
    //                     }`}
    //             >
    //                 {/* <p className="mb-2.5 text-xs text-slate-500">
    //                     Отвечено {answeredCount} из {items.length}
    //                 </p> */}

    //                 <div className="flex gap-2 justify-between">
    //                     {items.map((item, index) => (
    //                         <ButtonBase
    //                             key={item.id}
    //                             onClick={() => handleSelect(item.id)}
    //                             aria-label={`Вопрос ${index + 1}: ${item.answered ? 'есть ответ' : 'нет ответа'}`}
    //                             className={`aspect-square w-[20px] rounded-lg border text-xs font-semibold text-white transition-colors duration-300 ${item.answered
    //                                 ? 'border-emerald-200 bg-emerald-400 text-emerald-700 hover:bg-emerald-100'
    //                                 : 'border-red-200 bg-red-400 text-red-600 hover:bg-red-100'
    //                                 }`}
    //                         >
    //                             {index + 1}
    //                         </ButtonBase>
    //                     ))}
    //                 </div>
    //             </div>

    //             {/* Кнопка-переключатель */}
    //             <Badge
    //                 badgeContent={open ? 0 : unansweredCount}
    //                 color="error"
    //                 overlap="circular"
    //                 sx={{ '& .MuiBadge-badge': { transition: 'transform 0.3s ease' } }}
    //                 className='pr-2'
    //             >
    //                 <Fab
    //                     size="small"
    //                     onClick={() => setOpen((v) => !v)}
    //                     aria-label={open ? 'Скрыть список вопросов' : 'Показать список вопросов'}
    //                     aria-expanded={open}
    //                     aria-controls="question-navigator-panel"
    //                     sx={{
    //                         bgcolor: '#fff',
    //                         color: '#334155',
    //                         boxShadow: '0 4px 14px rgba(15, 23, 42, 0.15)',
    //                         transition: 'all 0.3s ease',
    //                         '&:hover': { bgcolor: '#f8fafc' },
    //                     }}
    //                 >
    //                     {open ? <CloseRoundedIcon /> : <FormatListNumberedRoundedIcon />}
    //                 </Fab>
    //             </Badge>
    //             {/* <div
    //                 color="error"
    //                 className=''
    //             >
    //                 <div
    //                     onClick={() => setOpen((v) => !v)}
    //                     aria-label={open ? 'Скрыть список вопросов' : 'Показать список вопросов'}
    //                     aria-expanded={open}
    //                     aria-controls="question-navigator-panel"
    //                     className='flex items-center bg-black h-12 cursor-pointer'
    //                     style={{borderRadius: '10px 0px 0px 10px'}}
    //                 >
    //                     {open ? <CloseRoundedIcon className='text-white'/> : <KeyboardArrowLeftIcon className='text-white'/>}
    //                 </div>
    //             </div> */}
    //         </div>
    //     </div>
    // );
}
