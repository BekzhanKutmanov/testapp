export type QuestionType = 'RADIO' | 'CHECKBOX' | 'TEXT';

export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  title: string;
  type: QuestionType;
  options: Option[];
  correctOptionIds: string[]; // массив — чтобы поддерживать чекбоксы
}

/** Для RADIO/CHECKBOX — id выбранных вариантов, для TEXT — [текст ответа] */
export type Answers = Record<string, string[]>;
