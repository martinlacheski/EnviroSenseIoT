import { useNavigate, useParams } from "react-router-dom";
import { Ambiente as AmbienteInterface } from "./interfaces";
import { useEffect, useState } from "react";
import api from "../../../api/api";
import { SweetAlert2 } from "../../utils";
import { BreadcrumbHeader, Loading } from "../../components";
import { Card, Row } from "react-bootstrap";

export const Ambiente = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [ambiente, setAmbiente] = useState<AmbienteInterface | null>(null);

  const fetch = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/environments/${id}`);
      setAmbiente(data);
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

      {ambiente && !loading && (
        <>
          <BreadcrumbHeader
            section={"ambientes"}
            paths={[{ label: ambiente.name }]}
          />

          <Card className="my-3">
            <Card.Header>
              <i className="bi bi-info-circle me-2"></i>
              <span>Información del ambiente</span>
            </Card.Header>
            <Card.Body>
              <Card.Title>{ambiente.name}</Card.Title>
              <Card.Text>{ambiente.description}</Card.Text>
              <Row xs={1} lg={2}>
                <div>
                  <strong>Nombre:</strong> {ambiente.name}
                </div>
                <div>
                  <strong>Tipo:</strong> {ambiente.type.name}
                </div>
                <div>
                  <strong>Dirección:</strong> {ambiente.address},{" "}
                  {ambiente.city.name} -{" "}
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${ambiente.gps_location}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="bi bi-geo-alt-fill text-danger"></i>
                  </a>
                </div>
                <div>
                  <strong>Descripción:</strong> {ambiente.description}
                </div>
              </Row>
              <div className="my-3">
                <p className="fw-bold mb-1 fst-italic">Empresa</p>
                <Row xs={1} lg={2} className="">
                  <div>
                    <strong>Nombre:</strong> {ambiente.company.name}
                  </div>
                  <div>
                    <strong>Dirección:</strong> {ambiente.company.address},{" "}
                    {ambiente.company.city.name}
                  </div>
                  <div>
                    <strong>Teléfono:</strong> {ambiente.company.phone}
                  </div>
                  <div>
                    <strong>Email:</strong> {ambiente.company.email}
                  </div>
                </Row>
              </div>
            </Card.Body>
          </Card>

          <p>
            Acá podes listar los dispositivos que pertenecen a este ambiente etc
          </p>
        </>
      )}
    </div>
  );
};
