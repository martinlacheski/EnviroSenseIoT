import { Card, Col, Row } from "react-bootstrap";
import { DateFormatter } from "../helpers";
import { Fragment } from "react/jsx-runtime";
import { ReactNode } from "react";

const DateFields = ["alta_sistema", "fecha_nacimiento", "inicio_actividad"];

export interface CardInfoData {
  [key: string]: string | number;
}

interface Props {
  className?: string;
  icon?: string;
  header?: string;
  title?: string;
  data: CardInfoData;
  klg?: number;
  children?: {
    header?: ReactNode;
    footer?: ReactNode;
  };
}

export const CardInfo = ({
  className,
  icon = "info-circle",
  header = "Información general",
  title,
  data,
  klg = 5,
  children = {},
}: Props) => {
  return (
    <>
      <Card className={className}>
        <Card.Header>
          {icon && <i className={`bi bi-${icon} me-2`}></i>}
          <span>{header}</span>
        </Card.Header>
        <Card.Body>
          {children.header
            ? children.header
            : title && <h5 className="fw-bold mb-2 text-uppercase">{title}</h5>}

          <Row className="text-uppercase" style={{ fontSize: "14px" }}>
            {Object.entries(data).map(([key, value], index) => (
              <Fragment key={index}>
                <Col key={index} xs={12} lg={klg}>
                  <b>{key.replace(/_/g, " ")}</b>
                </Col>
                <Col xs={12} lg={12 - klg} className="mb-1 mb-lg-0">
                  {DateFields.includes(key) ? (
                    <span>
                      {value ? DateFormatter.toDDmmYYYY(value as string) : "—"}
                    </span>
                  ) : (
                    <span>{`${value || "—"}`}</span>
                  )}
                </Col>
              </Fragment>
            ))}
          </Row>

          {children.footer && children.footer}
        </Card.Body>
      </Card>
    </>
  );
};
