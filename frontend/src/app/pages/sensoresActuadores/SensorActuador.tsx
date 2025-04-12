import { useNavigate, useParams } from "react-router-dom";
import { SensorActuadorList } from "./interfaces";
import { useEffect, useState } from "react";
import api from "../../../api/api";
import { SweetAlert2 } from "../../utils";
import { BreadcrumbHeader, Loading } from "../../components";
import { Card, Row, Table } from "react-bootstrap";

export const SensorActuador = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [actuador, setActuador] = useState<SensorActuadorList | null>(null);

  const fetch = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/actuators/${id}`);
      setActuador(data);
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

      {actuador && !loading && (
        <>
          <div className="mb-3">
            <BreadcrumbHeader
              section={"dispositivos"}
              paths={[
                {
                  label: "actuadores",
                  to: "/dispositivos/actuadores",
                },
                { label: `Actuador ${actuador.actuator_code}` },
              ]}
            />
          </div>

          <Row xs={1} xl={2} className="g-3">
            <div>
              <Card className="h-100">
                <Card.Header>
                  <i className="bi bi-info-circle me-2"></i>
                  <span>Información del actuador</span>
                </Card.Header>
                <Card.Body>
                  <Card.Title>
                    <span className="me-4">
                      Actuador #{actuador.actuator_code}
                    </span>
                    <ActiveBadge active={actuador.enabled} />
                  </Card.Title>
                  <p className="text-muted mb-0">{actuador.description}</p>
                  <p className="text-muted mb-0 fw-bold small">
                    Segundos para reportar: {actuador.seconds_to_report}
                  </p>
                  <div className="my-3">
                    <p className="fw-bold mb-1 fst-italic">Ambiente</p>
                    <Row xs={1} lg={2}>
                      <div>
                        <strong>Nombre:</strong> {actuador.environment.name}
                      </div>
                      <div>
                        <strong>Tipo:</strong> {actuador.environment.type.name}
                      </div>
                      <div>
                        <strong>Dirección:</strong>{" "}
                        {actuador.environment.address},{" "}
                        {actuador.environment.city.name} -{" "}
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${actuador.environment.gps_location}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <i className="bi bi-geo-alt-fill text-danger"></i>
                        </a>
                      </div>
                      <div>
                        <strong>Descripción:</strong>{" "}
                        {actuador.environment.description}
                      </div>
                    </Row>
                  </div>
                  <div className="my-3">
                    <p className="fw-bold mb-1 fst-italic">Empresa</p>
                    <Row xs={1} lg={2} className="">
                      <div>
                        <strong>Nombre:</strong>{" "}
                        {actuador.environment.company.name}
                      </div>
                      <div>
                        <strong>Dirección:</strong>{" "}
                        {actuador.environment.company.address},{" "}
                        {actuador.environment.company.city.name}
                      </div>
                      <div>
                        <strong>Teléfono:</strong>{" "}
                        {actuador.environment.company.phone}
                      </div>
                      <div>
                        <strong>Email:</strong>{" "}
                        {actuador.environment.company.email}
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
                        <th className="col-3">Nombre</th>
                        <th className="col-3">Tiempo</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr key="1">
                        <td>Canal 1</td>
                        <td>
                          <ActiveBadge active={actuador.channel_1_enabled} />
                        </td>
                        <td>{actuador.channel_1_name}</td>
                        <td>{actuador.channel_1_time}</td>
                      </tr>
                      <tr key="2">
                        <td>Canal 2</td>
                        <td>
                          <ActiveBadge active={actuador.channel_2_enabled} />
                        </td>
                        <td>{actuador.channel_2_name}</td>
                        <td>{actuador.channel_2_time}</td>
                      </tr>
                      <tr key="3">
                        <td>Canal 3</td>
                        <td>
                          <ActiveBadge active={actuador.channel_3_enabled} />
                        </td>
                        <td>{actuador.channel_3_name}</td>
                        <td>{actuador.channel_3_time}</td>
                      </tr>
                      <tr key="4">
                        <td>Canal 4</td>
                        <td>
                          <ActiveBadge active={actuador.channel_4_enabled} />
                        </td>
                        <td>{actuador.channel_4_name}</td>
                        <td>{actuador.channel_4_time}</td>
                      </tr>
                      <tr key="5">
                        <td>Canal 5</td>
                        <td>
                          <ActiveBadge active={actuador.channel_5_enabled} />
                        </td>
                        <td>{actuador.channel_5_name}</td>
                        <td>{actuador.channel_5_time}</td>
                      </tr>
                      <tr key="6">
                        <td>Canal 6</td>
                        <td>
                          <ActiveBadge active={actuador.channel_6_enabled} />
                        </td>
                        <td>{actuador.channel_6_name}</td>
                        <td>{actuador.channel_6_time}</td>
                      </tr>
                      <tr key="7">
                        <td>Canal 7</td>
                        <td>
                          <ActiveBadge active={actuador.channel_7_enabled} />
                        </td>
                        <td>{actuador.channel_7_name}</td>
                        <td>{actuador.channel_7_time}</td>
                      </tr>
                      <tr key="8">
                        <td>Canal 8</td>
                        <td>
                          <ActiveBadge active={actuador.channel_8_enabled} />
                        </td>
                        <td>{actuador.channel_8_name}</td>
                        <td>{actuador.channel_8_time}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </div>
          </Row>

          <p className="mt-3">
            Acá podes listar los datos o logs que pertenecen a este actuador etc
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
