import type { Dict } from '@/shared/i18n/lang';

export interface RouteNode {
  // ключ из словаря t.breadcrumbs
  label?: keyof Dict['breadcrumbs'];
  // literal-дети: конкретное имя сегмента
  children?: Record<string, RouteNode>;
  // если сегмент на этом уровне — параметр (id/slug/что угодно)
  param?: RouteNode;
};

export const routeTree: RouteNode = {
  children: {
    teacher: {
      label: 'allSubjects',
      param: {
        label: 'subject',
        children: {
          createTest: {
            // label: 'Create',
            param: { label: 'create' },
          },
        },
      },
    }
  },
};
