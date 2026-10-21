import type { Question } from '@/types/questions/question-page';

export const TEST_ID = 'js-basics-1'; // для ключа в localStorage
export const TEST_TITLE = 'Основы JavaScript и React';
export const TEST_DURATION_SEC = 10 * 60; // 10 минут
export const RESULT_URL = '/student/tests/result'; // ← сюда подставь свою ссылку

export const QUESTIONS: Question[] = [
  {
    id: 'q1',
    title: 'Что выведет typeof null?',
    type: 'RADIO',
    options: [
      { id: 'a', text: '"null"' },
      { id: 'b', text: '"object"' },
      { id: 'c', text: '"undefined"' },
      { id: 'd', text: '"number"' },
    ],
    correctOptionIds: ['b'],
  },
  {
    id: 'q2',
    title: 'Какой хук React используется для хранения локального состояния компонента?',
    type: 'RADIO',
    options: [
      { id: 'a', text: 'useEffect' },
      { id: 'b', text: 'useRef' },
      { id: 'c', text: 'useState' },
      { id: 'd', text: 'useMemo' },
    ],
    correctOptionIds: ['c'],
  },
  {
    id: 'q3',
    title: 'Какие из перечисленных значений в JavaScript являются ложными (falsy)?',
    type: 'CHECKBOX',
    options: [
      { id: 'a', text: '0' },
      { id: 'b', text: '"0"' },
      { id: 'c', text: 'NaN' },
      { id: 'd', text: '[]' },
      { id: 'e', text: '""' },
    ],
    correctOptionIds: ['a', 'c', 'e'],
  },
  {
    id: 'q4',
    title: 'Чем const отличается от let?',
    type: 'RADIO',
    options: [
      { id: 'a', text: 'const нельзя переприсвоить после объявления' },
      { id: 'b', text: 'const работает только внутри функций' },
      { id: 'c', text: 'let всегда поднимается (hoisting) вместе со значением' },
      { id: 'd', text: 'Разницы нет' },
    ],
    correctOptionIds: ['a'],
  },
  {
    id: 'q5',
    title: 'Какой метод массива возвращает новый массив с элементами, прошедшими проверку?',
    type: 'RADIO',
    options: [
      { id: 'a', text: 'map' },
      { id: 'b', text: 'filter' },
      { id: 'c', text: 'reduce' },
      { id: 'd', text: 'forEach' },
    ],
    correctOptionIds: ['b'],
  },
  {
    id: 'q6',
    title: 'Что из этого относится к HTTP-методам?',
    type: 'CHECKBOX',
    options: [
      { id: 'a', text: 'GET' },
      { id: 'b', text: 'FETCH' },
      { id: 'c', text: 'POST' },
      { id: 'd', text: 'PATCH' },
    ],
    correctOptionIds: ['a', 'c', 'd'],
  },
  {
    id: 'q7',
    title: 'Для чего нужен атрибут key при отрисовке списков в React?',
    type: 'RADIO',
    options: [
      { id: 'a', text: 'Для стилизации элементов списка' },
      { id: 'b', text: 'Чтобы React мог эффективно определять изменения в списке' },
      { id: 'c', text: 'Чтобы шифровать данные элементов' },
      { id: 'd', text: 'Он обязателен только для таблиц' },
    ],
    correctOptionIds: ['b'],
  },
  {
    id: 'q8',
    title: 'Чему равно значение выражения 2 + "2" в JavaScript?',
    type: 'TEXT',
    options: [],
    correctOptionIds: [],
  },
  {
    id: 'q9',
    title: 'Какой оператор используется для строгого сравнения без приведения типов?',
    type: 'RADIO',
    options: [
      { id: 'a', text: '==' },
      { id: 'b', text: '=' },
      { id: 'c', text: '===' },
      { id: 'd', text: '=>' },
    ],
    correctOptionIds: ['c'],
  },
  {
    id: 'q10',
    title: 'Своими словами объясните, что такое замыкание (closure) в JavaScript.',
    type: 'TEXT',
    options: [],
    correctOptionIds: [],
  },
  
];

// завершение 
// показать агаю что улучшить разузнать 

// автошкола повторить запрещяющие знаки пройти тест по знакам.  
