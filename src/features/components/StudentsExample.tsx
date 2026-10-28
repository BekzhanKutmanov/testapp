'use client';

import { useState } from 'react';
import StreamConnectTable, { type StudentRow } from '@/shared/ui/planning/StreamConnectTable';
import AddStudentsDialog, {
  type AddStudentsFilters,
  type FilterOptions,
  type StudentOption,
} from '@/shared/ui/planning/Addstudentsdialog';

// TODO: заменить на реальные данные с бэкенда
const MOCK_OPTIONS: FilterOptions = {
  academicYear: [{ id: 1, name: '2026-2027' }],
  faculty: [{ id: 1, name: 'Математика, физика, техника жана технологиялар' }],
  specialty: [{ id: 1, name: 'Информацияны иштетүү жана ...' }],
  studyForm: [{ id: 1, name: 'Күндүзгү бакалавр' }],
  semester: [{ id: 7, name: '7-семестр' }],
  admission: [{ id: 1, name: 'Летний прием' }],
  subject: [{ id: 1, name: 'Фронд-энд иштеп чыгуу' }],
  stream: [{ id: 1, name: 'Лекция (1) (кыр)' }],
  statement: [{ id: 1, name: 'Ведомость' }],
};

// TODO: студенты выбранного потока приходят с бэкенда после заполнения фильтров
const MOCK_STUDENTS: StudentOption[] = [
  { id: 1, fullName: 'Абдыкадыров Адилет' },
  { id: 2, fullName: 'Сыдыкова Айдана' },
  { id: 3, fullName: 'Турусбеков Эрмек' },
];

export default function StudentsExample() {
  const [rows, setRows] = useState<StudentRow[]>([]);
  const [open, setOpen] = useState(false);
  const [streamStudents, setStreamStudents] = useState<StudentOption[]>([]);

  const handleFiltersChange = (f: AddStudentsFilters) => {
    // TODO: загрузить студентов потока по фильтрам; пока — когда выбрана ведомость
    setStreamStudents(f.statement ? MOCK_STUDENTS : []);
  };

  const handleSubmit = (selected: StudentOption[]) => {
    setRows((prev) => {
      const existing = new Set(prev.map((r) => r.id));
      // Реальное только ФИО (+id), остальное — дефолты внутри StreamConnectTable
      const added = selected
        .filter((s) => !existing.has(s.id))
        .map((s) => ({ id: s.id, fullName: s.fullName }));
      return [...prev, ...added];
    });
    setOpen(false);
  };

  return (
    <>
      <StreamConnectTable
        students={rows}
        onAddClick={() => setOpen(true)}
        onDelete={(id) => setRows((prev) => prev.filter((r) => r.id !== id))}
      />

      <AddStudentsDialog
        open={open}
        onClose={() => setOpen(false)}
        options={MOCK_OPTIONS}
        students={streamStudents}
        onFiltersChange={handleFiltersChange}
        onSubmit={handleSubmit}
      />
    </>
  );
}
