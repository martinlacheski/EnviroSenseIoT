import { Button, Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { DateFormatter, NumberFormatter } from "../../helpers";
import { CarpetaInterface } from "./interfaces";

interface Props {
  instance: "personas" | "emprendimientos";
  id_instance: string;
  carpetas: CarpetaInterface[];
  handleCreateFolder: () => void;
  handleUpdateFolder: (folder: CarpetaInterface) => void;
}

export const ListaCarpetas = ({
  instance,
  id_instance,
  carpetas,
  handleCreateFolder,
  handleUpdateFolder,
}: Props) => {
  return (
    <Card>
      <Card.Header>
        <div className="d-flex align-items-center justify-content-between">
          <span>
            <i className="bi bi-folder2-open me-2"></i>
            Listado de carpetas
          </span>
          <Button
            size="sm"
            variant="outline-secondary"
            className="px-1 py-0"
            onClick={handleCreateFolder}
            title="Crear nueva carpeta"
          >
            <i className="bi bi-folder-plus"></i>
          </Button>
        </div>
      </Card.Header>
      <Card.Body className="p-0">
        {carpetas.length === 0 ? (
          <div className="text-center p-3">
            <p className="text-muted small">
              No hay ninguna carpeta creada en esta galería
            </p>
            <Button
              size="sm"
              variant="success"
              className="px-2 py-1"
              onClick={handleCreateFolder}
            >
              <i className="bi bi-folder-plus me-2"></i>
              Crear nueva carpeta
            </Button>
          </div>
        ) : (
          <>
            <Row className="px-3 py-1 d-none d-md-flex">
              <Col xs={11}>
                <Row>
                  <Col xs={12} md={5}>
                    <b className="small">Nombre de la carpeta</b>
                  </Col>
                  <Col xs={12} md={2} className="text-start text-md-end">
                    <b className="small">Archivos</b>
                  </Col>
                  <Col xs={12} md={2} className="text-start text-md-end">
                    <b className="small">Tamaño</b>
                  </Col>
                  <Col xs={12} md={3} className="text-start text-md-end">
                    <b className="small">Última modificación</b>
                  </Col>
                </Row>
              </Col>
            </Row>
            <ul className="small list-unstyled mb-0">
              {carpetas.map((folder) => (
                <li key={folder.id} className="custom-folder">
                  <Row className="align-items-center">
                    <Col xs={10} md={11} title="Ver archivos de la carpeta">
                      <Link
                        to={`/${instance}/${id_instance}/carpetas/${folder.id}`}
                        className="text-decoration-none text-dark"
                      >
                        <Row>
                          <Col xs={12} md={5}>
                            <span className="folder-name">
                              <i className="bi bi-folder me-2"></i>
                              {folder.nombre}
                            </span>
                          </Col>
                          <Col
                            xs={12}
                            md={2}
                            className="text-start text-md-end"
                          >
                            <span className="text-muted">
                              {folder.total_files >= 0 &&
                                `${folder.total_files} archivos`}
                            </span>
                          </Col>
                          <Col
                            xs={12}
                            md={2}
                            className="text-start text-md-end"
                          >
                            <span className="text-muted">
                              {folder.total_size > 0 &&
                                NumberFormatter.formatBytes(folder.total_size)}
                            </span>
                          </Col>
                          <Col
                            xs={12}
                            md={3}
                            className="text-start text-md-end"
                          >
                            <span className="text-muted">
                              {DateFormatter.toDDmmYYYYhhMM(folder.updatedAt)}
                            </span>
                          </Col>
                        </Row>
                      </Link>
                    </Col>
                    <Col xs={2} md={1} className="text-end">
                      <Button
                        onClick={() => handleUpdateFolder(folder)}
                        size="sm"
                        variant="transparent"
                        className="px-3 px-md-1"
                        title="Opciones de carpeta"
                      >
                        <i className="bi bi-three-dots-vertical"></i>
                      </Button>
                    </Col>
                  </Row>
                </li>
              ))}
            </ul>
          </>
        )}
      </Card.Body>
    </Card>
  );
};
