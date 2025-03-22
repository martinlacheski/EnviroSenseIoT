import { Card } from "react-bootstrap";
import styles from "./CardCarpetas.module.css";
import { Link } from "react-router-dom";

interface Folder {
  id: number;
  nombre: string;
}

interface Props {
  instance: "persona" | "emprendimiento";
  id_instance: string | number;
  folders: Folder[];
}

enum Instance {
  "persona" = "personas",
  "emprendimiento" = "emprendimientos",
}

export const CardCarpetas = ({ instance, id_instance, folders }: Props) => {
  return (
    <Card className="h-100">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <span>
          <i className="bi bi-archive me-2"></i>
          Galería de archivos
        </span>
        <Link
          to={`/${Instance[instance]}/${id_instance}/carpetas`}
          className="btn btn-sm py-0 px-2 btn-light text-decoration-none"
          title="Explorar carpetas"
        >
          <i className="bi bi-folder"></i>
        </Link>
      </Card.Header>
      <Card.Body className="small">
        {folders.length === 0 && (
          <span className="capitalize text-muted">
            <i className="bi bi-info-circle me-2"></i>
            No hay carpetas para mostrar.
          </span>
        )}
        {folders.length > 0 && (
          <ul className={styles["folder-list"]}>
            {folders.map((folder) => (
              <li key={folder.id} className={styles["folder-item"]}>
                <Link
                  to={`/${Instance[instance]}/${id_instance}/carpetas/${folder.id}`}
                  className="text-decoration-none text-dark"
                  title="Explorar carpeta"
                >
                  <i className="bi bi-folder-fill me-2 text-primary"></i>
                  {folder.nombre}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card.Body>
    </Card>
  );
};
