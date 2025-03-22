import { Spinner, Placeholder as PH } from "react-bootstrap";

const LoadingSimple = () => {
  return (
    <div
      className="my-3 d-flex align-items-center justify-content-center"
      style={{ textAlign: "center" }}
    >
      <Spinner animation="grow" variant="secondary" />
      <small className="ms-2 text-muted">Cargando...</small>
    </div>
  );
};

const LoadingParams = () => {
  return (
    <div className="my-3 d-flex align-items-center justify-content-center border rounded p-3">
      <Spinner animation="grow" variant="secondary" />
      <small className="ms-2 text-muted">Cargando...</small>
    </div>
  );
};

const Placeholder = () => {
  return (
    <PH as="p" animation="glow" variant="light">
      <PH xs={12} size="lg" className="rounded" />
    </PH>
  );
};

export { LoadingSimple, LoadingParams, Placeholder };
