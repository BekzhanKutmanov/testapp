export interface RouteNode {
  label?: string;
  // literal-дети: конкретное имя сегмента
  children?: Record<string, RouteNode>;
  // если сегмент на этом уровне — параметр (id/slug/что угодно)
  param?: RouteNode;
};

export const routeTree: RouteNode = {
  children: {
    teacher: {
      label: 'Home',
      param: {
        label: 'Subject',
        children: {
          createTest: {
            // label: 'Create',
            param: { label: 'Test' },
          },
        },
      },
    }
  },
};
