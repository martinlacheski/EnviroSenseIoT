import { Spinner } from "react-bootstrap";

export const Loading = () => {
  return (
    <div
      className="my-4 d-flex align-items-center justify-content-center"
      style={{ textAlign: "center" }}
    >
      <Spinner animation="grow" variant="secondary" />
      <small className="ms-2 text-muted">Cargando...</small>
    </div>
  );
};
