import { useNavigate, useParams } from "react-router-dom";
import { SensorAmbientalList } from "./interfaces";
import { useEffect, useState } from "react";
import api from "../../../api/api";
import { SweetAlert2 } from "../../utils";
import { BreadcrumbHeader, Loading } from "../../components";
import { Card, Row } from "react-bootstrap";

export const SensorAmbiental = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [sensor, setSensor] = useState<SensorAmbientalList | null>(null);

  const fetch = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/sensors/environmental/${id}`);
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
                  label: "Sensores ambientales",
                  to: "/dispositivos/sensores-ambientales",
                },
                { label: `Sensor ambiental ${sensor.sensor_code}` },
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
                      Sensor ambiental #{sensor.sensor_code}
                    </span>
                    <ActiveBadge active={sensor.enabled} />
                  </Card.Title>
                  <p className="text-muted mb-0">{sensor.description}</p>
                  <p className="text-muted mb-0 fw-bold small">
                    Segundos para reportar: {sensor.seconds_to_report}
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
                        <strong>Dirección:</strong> {sensor.environment.address}
                        , {sensor.environment.city.name} -{" "}
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
                  <span>Información del sensor</span>
                </Card.Header>
                <Card.Body>
                  <div className="row">
                    {/* Temperatura */}
                    <div className="col-12 col-lg-6">
                      <p>
                        Alerta temperatura mínima:{" "}
                        <span className="fw-bold">{sensor.temperature_alert_min}°C</span>
                      </p>
                    </div>
                    <div className="col-12 col-lg-6">
                      <p>
                        Alerta temperatura máxima:{" "}
                        <span className="fw-bold">{sensor.temperature_alert_max}°C</span>
                      </p>
                    </div>

                    {/* Humedad */}
                    <div className="col-12 col-lg-6">
                      <p>
                        Alerta humedad mínima:{" "}
                        <span className="fw-bold">{sensor.humidity_alert_min}%</span>
                      </p>
                    </div>
                    <div className="col-12 col-lg-6">
                      <p>
                        Alerta humedad máxima:{" "}
                        <span className="fw-bold">{sensor.humidity_alert_max}%</span>
                      </p>
                    </div>

                    {/* Presión atmosférica */}
                    <div className="col-12 col-lg-6">
                      <p>
                        Alerta presión atmosférica mínima:{" "}
                        <span className="fw-bold">{sensor.atmospheric_pressure_alert_min} hPa</span>
                      </p>
                    </div>
                    <div className="col-12 col-lg-6">
                      <p>
                        Alerta presión atmosférica máxima:{" "}
                        <span className="fw-bold">{sensor.atmospheric_pressure_alert_max} hPa</span>
                      </p>
                    </div>

                    {/* CO2 */}
                    <div className="col-12 col-lg-6">
                      <p>
                        Alerta CO2 mínimo:{" "}
                        <span className="fw-bold">{sensor.co2_alert_min} ppm</span>
                      </p>
                    </div>
                    <div className="col-12 col-lg-6">
                      <p>
                        Alerta CO2 máximo:{" "}
                        <span className="fw-bold">{sensor.co2_alert_max} ppm</span>
                      </p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </Row>
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
