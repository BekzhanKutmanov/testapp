import {routeTree, type RouteNode } from './routeTree';

export function buildBreadcrumbs(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  let node: RouteNode | undefined = routeTree;
  let href = '';
  const result: { href: string; label: string }[] = [];

  for (const seg of segments) {
    href += `/${seg}`;

    if (node?.children?.[seg]) {
      // это известный literal-сегмент
      node = node.children[seg];
    } else if (node?.param) {
      // на этой позиции по схеме ожидается параметр — неважно, число это или slug
      node = node.param;
    } else {
      // сегмент не описан схемой вообще
      node = undefined;
    }

    if (node?.label) {
      result.push({ href, label: node.label });
    }
  }

  return result;
}
