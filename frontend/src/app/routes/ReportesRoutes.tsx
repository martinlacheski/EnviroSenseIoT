import { Routes, Route, Navigate } from "react-router-dom";
import {
  Actuadores,
  Ambientales,
  Consumo,
  Nutrientes,
} from "../pages/reportes";

const ReportesRoutes = () => {
  return (
    <Routes>
      <Route path="/actuadores" element={<Actuadores />} />
      <Route path="/sensores-consumo" element={<Consumo />} />
      <Route path="/sensores-ambientales" element={<Ambientales />} />
      <Route path="/sensores-nutrientes" element={<Nutrientes />} />
      <Route path="/*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default ReportesRoutes;
