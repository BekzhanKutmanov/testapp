'use client';

import { ButtonBase } from "@mui/material";
import { NavigatorItem } from "../question-navigator/QuestionNavigator";

export default function NavigationItems({ items, handleSelect }: { items: NavigatorItem[], handleSelect: (id: string) => void}) {

    return <div className="sticky top-[100px] right-0 w-[220px] mt-8 p-3 bg-white rounded">
        <div className="grid grid-cols-4 gap-1.5 overflow-y-auto p-0.5">
            {items.map((item, index) => (
                <ButtonBase
                    key={item.id}
                    onClick={()=> handleSelect(item.id)}
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
    </div>
};
