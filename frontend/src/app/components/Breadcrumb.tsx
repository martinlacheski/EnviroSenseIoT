import { Fragment } from "react";
import { Breadcrumb } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./styles.css";

type Sections =
  | "cuenta"  
  | "reportes"
  | "usuarios"
  | "parametros"
  | "ambientes"
  | "dispositivos"
  | "aux";

const sections: Record<Sections, { label: string; to: string }> = {
  cuenta: {
    label: "CUENTA",
    to: "/cuenta",
  },
  reportes: {
    label: "REPORTES",
    to: "/reportes",
  },
  usuarios: {
    label: "USUARIOS",
    to: "/usuarios",
  },
  parametros: {
    label: "PARÁMETROS",
    to: "/parametros",
  },
  ambientes: {
    label: "LISTADO DE AMBIENTES",
    to: "/ambientes",
  },
  dispositivos: {
    label: "LISTADO DE DISPOSITIVOS",
    to: "/dispositivos",
  },
  aux: {
    label: "AUX",
    to: "/aux",
  },
};

interface Main {
  to: string;
  label: string;
}

interface Path {
  to?: string;
  label: string;
}

interface Props {
  section: Sections;
  current?: string;
  main?: Main;
  paths?: Path[];
}

export const BreadcrumbHeader = ({ section = "aux", main, paths }: Props) => {
  return (
    <>
      <Breadcrumb className="small mt-2 text-uppercase breadcrumb-custom">
        <Link to="/" className="breadcrumb-item custom-item">
          <i className="bi bi-house-door-fill"></i>
        </Link>
        <Link to={sections[section].to} className="breadcrumb-item custom-item">
          {sections[section].label}
        </Link>
        {main && (
          <Link to={main.to} className="breadcrumb-item custom-item">
            <b>{main.label}</b>
          </Link>
        )}
        {paths &&
          paths.map((path, index) => (
            <Fragment key={index}>
              {!path.to ? (
                <Breadcrumb.Item active key={index}>
                  {path.label}
                </Breadcrumb.Item>
              ) : (
                <Link
                  key={index}
                  to={path.to}
                  className="breadcrumb-item custom-item"
                >
                  {path.label}
                </Link>
              )}
            </Fragment>
          ))}
      </Breadcrumb>
    </>
  );
};
