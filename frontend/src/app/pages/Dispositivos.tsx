import { Card, Col, Row } from "react-bootstrap";
import { BreadcrumbHeader } from "../components";
import { NavLink } from "react-router-dom";

const links = [
  { label: "Actuadores", to: "/dispositivos/actuadores" },
  { label: "Sensores de consumo", to: "/dispositivos/sensores-consumo" },
  { label: "Sensores ambientales", to: "/dispositivos/sensores-ambientales" },
  { label: "Sensores de nutrientes", to: "/dispositivos/sensores-nutrientes" },
];

export const Dispositivos = () => {
  return (
    <div>
      <BreadcrumbHeader section={"dispositivos"} />
      <Card className="my-3">
        <Card.Header>
          <i className="bi bi-info-circle me-2"></i>
          <span>Información de los dispositivos</span>
        </Card.Header>
        <Card.Body>
          <Card.Title>
            <span>Tipos de dispositivos</span>
          </Card.Title>
          <Row>
            {links.map((link, index) => (
              <Col key={index} xs={12} md={6} lg={3} className="my-2">
                <NavLink
                  key={index}
                  to={link.to}
                  className="btn btn-light shadow-sm w-100"
                >
                  {link.label}
                </NavLink>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};
