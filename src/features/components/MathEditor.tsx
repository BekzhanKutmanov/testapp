// app/components/MathEditor.tsx
'use client';

import React, { useEffect, useRef } from 'react';

// Описываем типы для пропсов
interface MathEditorProps {
  value: string;
  onChange: (newValue: string) => void;
}

export default function MathEditor({ value, onChange }: MathEditorProps) {
  const mathfieldRef = useRef<any>(null);

  useEffect(() => {
    // Динамический импорт MathLive для избежания ошибок на сервере
    import('mathlive');
  }, []);

  useEffect(() => {
    const mfield = mathfieldRef.current;
    if (!mfield) return;

    // Слушаем ввод пользователя и передаем наверх родителю
    const handleInput = (e: Event) => {
      const target = e.target as any;
      onChange(target.value); // <--- Отправка родителю
    };

    mfield.addEventListener('input', handleInput);

    return () => {
      mfield.removeEventListener('input', handleInput);
    };
  }, [onChange]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      await import('mathlive');
      await customElements.whenDefined('math-field');
      if (cancelled) return;

      const mfield = mathfieldRef.current;
      if (!mfield) return;

      // принудительно пересчитываем меню
      mfield.menuItems = mfield.menuItems;

      // запасной вариант: показать кнопку напрямую
      const toggle = mfield.shadowRoot?.querySelector('[part="menu-toggle"]') as HTMLElement | null;
      if (toggle) toggle.style.display = '';
    })();

    return () => { cancelled = true; };
  }, []);

  return (
    <div style={{ border: '1px solid #ccc', borderRadius: '6px', }}>
      <math-field
        ref={mathfieldRef}
        style={{
          display: 'block',
          width: '100%',
          padding: '12px',
          fontSize: '1.2rem',
          background: '#fff',
          color: '#000',
        }}
      />
    </div>
  );
}
