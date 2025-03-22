import { Routes, Route, Navigate } from "react-router-dom";
import {
  Ciudades,
  Empresa,
  Paises,
  Provincias,
  Roles,
  TiposAmbientes,
  TiposNutrientes,
} from "../pages/parametros";

const ParametersRoutes = () => {
  return (
    <Routes>
      <Route path="/empresa" element={<Empresa />} />
      <Route path="/paises" element={<Paises />} />
      <Route path="/provincias" element={<Provincias />} />
      <Route path="/ciudades" element={<Ciudades />} />
      <Route path="/tipos-ambientes" element={<TiposAmbientes />} />
      <Route path="/tipos-nutrientes" element={<TiposNutrientes />} />
      <Route path="roles" element={<Roles />} />

      <Route path="/*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default ParametersRoutes;
