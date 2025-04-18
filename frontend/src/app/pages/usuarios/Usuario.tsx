import { useNavigate, useParams } from "react-router-dom";
import { Usuario as UsuarioInterface } from "./interfaces";
import { useEffect, useState } from "react";
import api from "../../../api/api";
import { SweetAlert2 } from "../../utils";
import { BreadcrumbHeader, Loading } from "../../components";
import { Card, Row } from "react-bootstrap";

export const Usuario = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [usuario, setUsuario] = useState<UsuarioInterface | null>(null);

  const fetch = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/users/${id}`);
      setUsuario(data);
    } catch (error) {
      navigate("/");
      SweetAlert2.errorAlert("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);
  return (
    <div>
      {loading && <Loading />}

      {usuario && !loading && (
        <>
          <BreadcrumbHeader
            section={"usuarios"}
            paths={[{ label: usuario.username }]}
          />

          <Card className="my-3">
            <Card.Header>
              <i className="bi bi-info-circle me-2"></i>
              <span>Información del usuario</span>
            </Card.Header>
            <Card.Body>
              <Card.Title>{usuario.name} {usuario.surname}</Card.Title>
              {/* <Card.Text>{usuario.surname}</Card.Text> */}
              <Row xs={1} lg={2}>
                <div>
                  <strong>Nombre de usuario:</strong> {usuario.username}
                </div>
                <div>
                  <strong>Correo electrónico:</strong> {usuario.email}
                </div>
                <div>
                  <strong>Nombre:</strong> {usuario.name}
                </div>
                <div>
                  <strong>Apellido:</strong> {usuario.surname}
                </div>
                <div>
                  <strong>Usuario habilitado:</strong>{" "}
                  {usuario.enabled ? (
                    <span className="badge bg-success">Si</span>
                  ) : (
                    <span className="badge bg-danger">No</span>
                  )}
                </div>
                <div>
                  <strong>Es administrador:</strong>{" "}
                  {usuario.is_admin ? (
                    <span className="badge bg-success">Si</span>
                  ) : (
                    <span className="badge bg-danger">No</span>
                  )}
                </div>
              </Row>
            </Card.Body>
          </Card>
        </>
      )}
    </div>
  );
};
