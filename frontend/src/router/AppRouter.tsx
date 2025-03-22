import { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import AuthRoutes from "../auth/routes/AuthRoutes";
import { useAuthStore } from "../hooks";
import { Loading } from "../auth/components/Loading";
import AppRoutes from "../app/routes/AppRoutes";

export const AppRouter = () => {
  const { status, checkAuthToken } = useAuthStore();

  useEffect(() => {
    checkAuthToken();
  }, []);

  if (status === "checking") {
    return <Loading />;
  }

  return (
    <Routes>
      <>
        {status === "not-authenticated" ? (
          <>
            <Route path="/*" element={<AuthRoutes />} />
            <Route path="/auth/*" element={<AuthRoutes />} />
            <Route path="/auth/*" element={<Navigate to="/auth/login" />} />
          </>
        ) : (
          <Route path="/*" element={<AppRoutes />} />
        )}
      </>
    </Routes>
  );
};
