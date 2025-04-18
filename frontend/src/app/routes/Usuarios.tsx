import { Routes, Route, Navigate } from "react-router-dom";
import { Usuarios, Usuario } from "../pages/usuarios";

const UsuariosRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Usuarios />} />
      <Route path="/:id" element={<Usuario />} />

      <Route path="/*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default UsuariosRoutes;
