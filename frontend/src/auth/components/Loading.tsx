import { Spinner } from "react-bootstrap";
import "./Loading.css";

export const Loading = () => {
  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center w-100 h-100vh"
      style={{
        backgroundImage: "url(/backgrounds/texture.jpg)",
        height: "100vh",
      }}
    >
      <Spinner animation="border" role="status" variant="light" />
      <p className="mt-2">Verificando credenciales...</p>
    </div>
  );
};
