import React from "react";
import "./ConnectionIndicator.css"; // estilos separados

interface Props {
  isConnected: boolean;
}

export const ConnectionIndicator: React.FC<Props> = ({ isConnected }) => {
  return (
    <div className="d-flex align-items-center gap-2">
      <span
        className={`indicator-dot ${
          isConnected ? "bg-success pulse" : "bg-danger"
        }`}
      />
      <span className="fs-6 fw-normal">{isConnected ? "Conectado" : "Desconectado"}</span>
    </div>
  );
};
