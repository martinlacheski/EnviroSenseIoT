import { CSSProperties } from "react";

export interface MenuItemData {
  title: string;
  icon?: string;
  link?: string;
  subItems?: MenuItemData[];
  style?: CSSProperties;
}

export const sidebarItems: MenuItemData[] = [
  {
    title: "Ambientes",
    icon: "bi bi-house-door",
    link: "/ambientes",
  },
  {
    title: "Dispositivos",
    icon: "bi bi-cpu",
    subItems: [
      { title: "Actuadores", link: "/dispositivos/actuadores" },
      { title: "Sensores de consumo", link: "/dispositivos/sensores-consumo" },
      { title: "Sensores ambientales", link: "/dispositivos/sensores-ambientales" },
      { title: "Sensores de nutrientes", link: "/dispositivos/sensores-nutrientes", },
    ],
  },

  {
    title: "Parámetros",
    icon: "bi bi-sliders",
    subItems: [
      { title: "Empresa", link: "/parametros/empresa" },
      { title: "Países", link: "/parametros/paises" },
      { title: "Provincias", link: "/parametros/provincias" },
      { title: "Ciudades", link: "/parametros/ciudades" },
      { title: "Tipos de nutrientes", link: "/parametros/tipos-nutrientes" },
      { title: "Tipos de ambientes", link: "/parametros/tipos-ambientes" },
      { title: "Usuarios", link: "/usuarios" },
      { title: "Roles", link: "/parametros/roles" },
    ],
  },
];
