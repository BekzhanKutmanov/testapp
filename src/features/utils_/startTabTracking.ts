export function startTabTracking() {
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      console.warn('Прокторинг: вкладка скрыта!')
    }
  }

  const handleBlur = () => {
    console.warn('Прокторинг: потерян фокус!')
  }

  // Включаем слежку
  document.addEventListener('visibilitychange', handleVisibilityChange)
  window.addEventListener('blur', handleBlur)

  // Возвращаем функцию ДЛЯ УДАЛЕНИЯ слушателей
  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange)
    window.removeEventListener('blur', handleBlur)
  }
}
