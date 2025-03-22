import { Routes, Route, Navigate } from "react-router-dom";
import {
  SensoresActuadores,
  SensorActuador,

  SensoresConsumos,
  SensorConsumo,
  Dispositivos,

  SensoresAmbientales,
  SensorAmbiental,

  SensoresNutrientes,
  SensorNutriente,
} from "../pages";

const SensoresRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dispositivos />} />
      <Route path="/actuadores" element={<SensoresActuadores />} />
      <Route path="/actuadores/:id" element={<SensorActuador />} />

      <Route path="/sensores-consumo" element={<SensoresConsumos />} />
      <Route path="/sensores-consumo/:id" element={<SensorConsumo />} />

      <Route path="/sensores-ambientales" element={<SensoresAmbientales />} />
      <Route path="/sensores-ambientales/:id" element={<SensorAmbiental />} />

      <Route path="/sensores-nutrientes" element={<SensoresNutrientes />} />
      <Route path="/sensores-nutrientes/:id" element={<SensorNutriente />} />

      <Route path="/*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default SensoresRoutes;
