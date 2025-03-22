import { Routes, Route, Navigate } from "react-router-dom";
import { Ambientes, Ambiente } from "../pages/ambientes";

const AmbientesRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Ambientes />} />
      <Route path="/:id" element={<Ambiente />} />

      <Route path="/*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AmbientesRoutes;
