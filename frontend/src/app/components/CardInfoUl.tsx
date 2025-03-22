import { ReactNode } from "react";
import { Card, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
interface Props {
  className?: string;
  lg?: number;
  icon?: string;
  header?: string;
  title?: string;
  data: string[];
  children?: {
    header?: ReactNode;
    footer?: ReactNode;
  };
  redirect?: string;
}

export const CardInfoUl = ({
  className,
  lg = 2,
  icon = "info-circle",
  header = "Información general",
  title,
  data,
  children = {},
  redirect,
}: Props) => {
  return (
    <Card className={`h-100 ${className}`}>
      <Card.Header>
        <div className="d-flex align-items-center justify-content-between">
          <span>
            {icon && <i className={`bi bi-${icon} me-2`}></i>}
            {header}
          </span>
          {redirect && (
            <Link
              to={redirect}
              className="btn btn-sm py-0 px-2 btn-light text-decoration-none"
              title="Editar información"
            >
              <i className="bi bi-pencil-square"></i>
              {/* Ver más */}
            </Link>
          )}
        </div>
      </Card.Header>
      <Card.Body>
        {children.header
          ? children.header
          : title && <h5 className="fw-bold mb-2 text-uppercase">{title}</h5>}

        {data.length > 0 ? (
          <ul className="mb-0">
            <Row
              className="text-uppercase"
              style={{ fontSize: "14px" }}
              xs={1}
              lg={lg}
            >
              <>
                {data.map((item, index) => (
                  <li key={index} className="ps-0">
                    {item}
                  </li>
                ))}
              </>
            </Row>
          </ul>
        ) : (
          <span className="capitalize small text-muted">
            <i className="bi bi-info-circle me-2"></i>
            No hay información para mostrar
          </span>
        )}

        {children.footer && children.footer}
      </Card.Body>
    </Card>
  );
};
