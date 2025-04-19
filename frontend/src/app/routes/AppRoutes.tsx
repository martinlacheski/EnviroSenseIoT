import { RootState } from "../../store";
import { useSelector } from "react-redux";
import { hasRole, RolesEnum } from "./role.middleware";
import { Routes, Route, Navigate } from "react-router-dom";

import { Layout } from "../../layout/Layout";
import { Inicio } from "../pages";

import ParametersRoutes from "./ParametersRoutes";
import AmbientesRoutes from "./AmbientesRoutes";
import SensoresRoutes from "./SensoresRoutes";
import UsuariosRoutes from "./Usuarios";
import MyAccount from "../pages/MyAccount";

const AppRoutes = () => {
  const { roles } = useSelector((state: RootState) => state.auth);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {hasRole(roles, [RolesEnum.ADMIN, RolesEnum.USUARIO]) && (
          <>
            <Route path="/" element={<Inicio />} />
            <Route path="/ambientes/*" element={<AmbientesRoutes />} />
            <Route path="/dispositivos/*" element={<SensoresRoutes />} />
          </>
        )}

        {hasRole(roles, [RolesEnum.ADMIN]) && (
          <>
            <Route path="/" element={<Inicio />} />
            <Route path="/usuarios/*" element={<UsuariosRoutes />} />
            <Route path="/parametros/*" element={<ParametersRoutes />} />
          </>
        )}

        <Route path="/panel-usuario/*" element={<MyAccount />} />

        <Route path="/*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
