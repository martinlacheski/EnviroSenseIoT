import { Image } from "react-bootstrap";

export const Inicio = () => {
  return (
    <div
      style={{
        height: "calc(100vh - 75px)",
        backgroundSize: "cover",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F8F9FA",
        border: "1px solid #dee2e6",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        position: "relative",
      }}
    >
      <Image src="/logo-pc-texto.png" height={115} alt="Logo Envirosense" />
      <h1 className="fs-5 fw-bold text-center my-4 text-uppercase">
        Control del clima en invernaderos
      </h1>
    </div>
  );
};
