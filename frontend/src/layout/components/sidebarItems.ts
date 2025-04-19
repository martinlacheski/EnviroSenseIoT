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
    title: "Ambientes",
    icon: "bi bi-house-door",
    link: "/ambientes",
    requiredRoles: ["ADMIN", "USUARIO"],
  },
  {
    title: "Dispositivos",
    icon: "bi bi-cpu",
    requiredRoles: ["ADMIN", "USUARIO"],
    subItems: [
      { title: "Actuadores", link: "/dispositivos/actuadores", requiredRoles: ["ADMIN", "USUARIO"] },
      { title: "Sensores de consumo", link: "/dispositivos/sensores-consumo", requiredRoles: ["ADMIN", "USUARIO"] },
      { title: "Sensores ambientales", link: "/dispositivos/sensores-ambientales", requiredRoles: ["ADMIN", "USUARIO"] },
      { title: "Sensores de nutrientes", link: "/dispositivos/sensores-nutrientes", requiredRoles: ["ADMIN", "USUARIO"] },
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
