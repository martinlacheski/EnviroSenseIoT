import { CSSProperties } from "react";

export interface MenuItemData {
  title: string;
  icon?: string;
  link?: string;
  subItems?: MenuItemData[];
  requiredRoles: string[];
  style?: CSSProperties;
}

export const sidebarItems: MenuItemData[] = [
  {
    title: "Dashboard",
    icon: "bi bi-grid-1x2",
    link: "/dashboard",
    requiredRoles: ["ADMIN", "USUARIO"],
  },
  {
    title: "Reportes",
    icon: "bi bi-layout-text-sidebar-reverse",
    requiredRoles: ["ADMIN"],
    subItems: [
      { title: "Actuadores", link: "/reportes/actuadores", requiredRoles: ["ADMIN"] },
      { title: "Sensores de consumo", link: "/reportes/sensores-consumo", requiredRoles: ["ADMIN"] },
      { title: "Sensores ambientales", link: "/reportes/sensores-ambientales", requiredRoles: ["ADMIN"] },
      { title: "Sensores de nutrientes", link: "/reportes/sensores-nutrientes", requiredRoles: ["ADMIN"] },
    ],
  },
  {
    title: "Ambientes",
    icon: "bi bi-house-door",
    link: "/ambientes",
    requiredRoles: ["ADMIN"],
  },
  {
    title: "Dispositivos",
    icon: "bi bi-cpu",
    requiredRoles: ["ADMIN"],
    subItems: [
      { title: "Actuadores", link: "/dispositivos/actuadores", requiredRoles: ["ADMIN"] },
      { title: "Sensores de consumo", link: "/dispositivos/sensores-consumo", requiredRoles: ["ADMIN"] },
      { title: "Sensores ambientales", link: "/dispositivos/sensores-ambientales", requiredRoles: ["ADMIN"] },
      { title: "Sensores de nutrientes", link: "/dispositivos/sensores-nutrientes", requiredRoles: ["ADMIN"] },
    ],
  },
  {
    title: "Parámetros",
    icon: "bi bi-sliders",
    requiredRoles: ["ADMIN"],
    subItems: [
      { title: "Empresa", link: "/parametros/empresa", requiredRoles: ["ADMIN"] },
      { title: "Países", link: "/parametros/paises", requiredRoles: ["ADMIN"] },
      { title: "Provincias", link: "/parametros/provincias", requiredRoles: ["ADMIN"] },
      { title: "Ciudades", link: "/parametros/ciudades", requiredRoles: ["ADMIN"] },
      { title: "Tipos de nutrientes", link: "/parametros/tipos-nutrientes", requiredRoles: ["ADMIN"] },
      { title: "Tipos de ambientes", link: "/parametros/tipos-ambientes", requiredRoles: ["ADMIN"] },
      { title: "Usuarios", link: "/usuarios", requiredRoles: ["ADMIN"] },
      { title: "Roles", link: "/parametros/roles", requiredRoles: ["ADMIN"] },
    ],
  },
];
