import type { I18nProvider } from '@refinedev/core';

// Русская локализация встроенных строк Refine (кнопки, ошибки и т.д.).
const DICT: Record<string, string> = {
  'buttons.create': 'Создать',
  'buttons.save': 'Сохранить',
  'buttons.logout': 'Выйти',
  'buttons.delete': 'Удалить',
  'buttons.edit': 'Изменить',
  'buttons.cancel': 'Отмена',
  'buttons.confirm': 'Вы уверены?',
  'buttons.filter': 'Фильтр',
  'buttons.clone': 'Клонировать',
  'buttons.refresh': 'Обновить',
  'buttons.show': 'Открыть',
  'buttons.list': 'Список',
  'buttons.import': 'Импорт',
  'buttons.export': 'Экспорт',
  'buttons.clearFilters': 'Сбросить фильтры',
  'buttons.notAccessTitle': 'Недостаточно прав',
  'buttons.undo': 'Отменить',

  'warnWhenUnsavedChanges': 'Есть несохранённые изменения. Точно уйти?',

  'pages.error.info': 'Похоже, что-то пошло не так',
  'pages.error.404': 'Страница не найдена',
  'pages.error.resource404': 'Ресурс не найден',
  'pages.error.backHome': 'На главную',

  'table.actions': 'Действия',

  'notifications.success': 'Успешно',
  'notifications.error': 'Ошибка',
  'notifications.undoable': 'У вас есть {{seconds}} сек. на отмену',
  'notifications.createSuccess': 'Создано',
  'notifications.editSuccess': 'Сохранено',
  'notifications.deleteSuccess': 'Удалено',
  'notifications.editError': 'Ошибка при сохранении',
  'notifications.createError': 'Ошибка при создании',
  'notifications.deleteError': 'Ошибка при удалении',
};

function interpolate(str: string, options?: any) {
  if (!options) return str;
  return str.replace(/\{\{(\w+)\}\}/g, (_, k) => (options[k] != null ? String(options[k]) : `{{${k}}}`));
}

export const i18nProvider: I18nProvider = {
  translate: (key: string, arg2?: any, arg3?: any) => {
    const defaultMessage = typeof arg2 === 'string' ? arg2 : arg3;
    const options = typeof arg2 === 'object' ? arg2 : undefined;
    const found = DICT[key];
    return interpolate(found ?? defaultMessage ?? key, options);
  },
  getLocale: () => 'ru',
  changeLocale: () => Promise.resolve(),
};
