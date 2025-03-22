import { useNavigate, useParams } from "react-router-dom";
import { SensorConsumoList } from "./interfaces";
import { useEffect, useState } from "react";
import api from "../../../api/api";
import { SweetAlert2 } from "../../utils";
import { BreadcrumbHeader, Loading } from "../../components";
import { Card, Row, Table } from "react-bootstrap";

export const SensorConsumo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [sensor, setSensor] = useState<SensorConsumoList | null>(null);

  const fetch = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/sensors/consumption/${id}`);
      setSensor(data);
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

      {sensor && !loading && (
        <>
          <div className="mb-3">
            <BreadcrumbHeader
              section={"dispositivos"}
              paths={[
                {
                  label: "Sensores de consumo",
                  to: "/dispositivos/sensores-consumo",
                },
                { label: `Sensor de consumo ${sensor.sensor_code}` },
              ]}
            />
          </div>

          <Row xs={1} xl={2} className="g-3">
            <div>
              <Card className="h-100">
                <Card.Header>
                  <i className="bi bi-info-circle me-2"></i>
                  <span>Información del sensor</span>
                </Card.Header>
                <Card.Body>
                  <Card.Title>
                    <span className="me-4">
                      Sensor de consumo #{sensor.sensor_code}
                    </span>
                    <ActiveBadge active={sensor.enabled} />
                  </Card.Title>
                  <p className="text-muted mb-0">{sensor.description}</p>
                  <p className="text-muted mb-0 fw-bold small">
                    Minutos para reportar: {sensor.minutes_to_report}
                  </p>
                  <div className="my-3">
                    <p className="fw-bold mb-1 fst-italic">Ambiente</p>
                    <Row xs={1} lg={2}>
                      <div>
                        <strong>Nombre:</strong> {sensor.environment.name}
                      </div>
                      <div>
                        <strong>Tipo:</strong> {sensor.environment.type.name}
                      </div>
                      <div>
                        <strong>Dirección:</strong>{" "}
                        {sensor.environment.address},{" "}
                        {sensor.environment.city.name} -{" "}
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${sensor.environment.gps_location}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <i className="bi bi-geo-alt-fill text-danger"></i>
                        </a>
                      </div>
                      <div>
                        <strong>Descripción:</strong>{" "}
                        {sensor.environment.description}
                      </div>
                    </Row>
                  </div>
                  <div className="my-3">
                    <p className="fw-bold mb-1 fst-italic">Empresa</p>
                    <Row xs={1} lg={2} className="">
                      <div>
                        <strong>Nombre:</strong>{" "}
                        {sensor.environment.company.name}
                      </div>
                      <div>
                        <strong>Dirección:</strong>{" "}
                        {sensor.environment.company.address},{" "}
                        {sensor.environment.company.city.name}
                      </div>
                      <div>
                        <strong>Teléfono:</strong>{" "}
                        {sensor.environment.company.phone}
                      </div>
                      <div>
                        <strong>Email:</strong>{" "}
                        {sensor.environment.company.email}
                      </div>
                    </Row>
                  </div>
                </Card.Body>
              </Card>
            </div>

            <div>
              <Card className="h-100">
                <Card.Header>
                  <i className="bi bi-info-circle me-2"></i>
                  <span>Información del los canales</span>
                </Card.Header>
                <Card.Body className="p-0 small">
                  <Table striped hover responsive className="mb-0">
                    <thead>
                      <tr>
                        <th className="col-3">Canal</th>
                        <th className="col-3">Activo</th>
                        <th className="col-3">Tipo nutriente</th>
                        <th className="col-3">Alerta</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr key="1">
                        <td>Canal 1</td>
                        <td>
                          <ActiveBadge active={sensor.nutrient_1_enabled} />
                        </td>
                        <td>{sensor.nutrient_1_type.name}</td>
                        <td>{sensor.nutrient_1_alert}</td>
                      </tr>
                      <tr key="2">
                        <td>Canal 2</td>
                        <td>
                          <ActiveBadge active={sensor.nutrient_2_enabled} />
                        </td>
                        <td>{sensor.nutrient_2_type.name}</td>
                        <td>{sensor.nutrient_2_alert}</td>
                      </tr>
                      <tr key="3">
                        <td>Canal 3</td>
                        <td>
                          <ActiveBadge active={sensor.nutrient_3_enabled} />
                        </td>
                        <td>{sensor.nutrient_3_type.name}</td>
                        <td>{sensor.nutrient_3_alert}</td>
                      </tr>
                      <tr key="4">
                        <td>Canal 4</td>
                        <td>
                          <ActiveBadge active={sensor.nutrient_4_enabled} />
                        </td>
                        <td>{sensor.nutrient_4_type.name}</td>
                        <td>{sensor.nutrient_4_alert}</td>
                      </tr>
                      <tr key="5">
                        <td>Canal 5</td>
                        <td>
                          <ActiveBadge active={sensor.nutrient_5_enabled} />
                        </td>
                        <td>{sensor.nutrient_5_type.name}</td>
                        <td>{sensor.nutrient_5_alert}</td>
                      </tr>
                      <tr key="6">
                        <td>Canal 6</td>
                        <td>
                          <ActiveBadge active={sensor.nutrient_6_enabled} />
                        </td>
                        <td>{sensor.nutrient_6_type.name}</td>
                        <td>{sensor.nutrient_6_alert}</td>
                      </tr>
      
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </div>
          </Row>

          <p className="mt-3">
            Acá podes listar los datos o logs que pertenecen a este sensor etc
          </p>
        </>
      )}
    </div>
  );
};

const ActiveBadge = ({ active }: { active: boolean }) => {
  return (
    <span className={`badge ${active ? "bg-success" : "bg-danger"}`}>
      {active ? "Activo" : "Inactivo"}
    </span>
  );
};
