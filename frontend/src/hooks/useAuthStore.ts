import { useDispatch, useSelector } from "react-redux";
import api from "../api/api";
import { onChecking, onLogin, onLogout, clearErrorMessage, RootState } from "../store";
import { SweetAlert2 } from "../app/utils";

interface LoginProps {
    username: string;
    password: string;
}

export const useAuthStore = () => {
    const { status, user, errorMessage } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();

    const startLogin = async ({ username, password }: LoginProps) => {
        dispatch(onChecking());
        try {
            const formData = new FormData();
            formData.append("username", username);
            formData.append("password", password);
            
            const { data } = await api.post("/login", formData);
            localStorage.setItem("token", data.access_token);
            localStorage.setItem("token-init-date", new Date().getTime().toString());
            
            dispatch(onLogin({
                id_user: data.user.id,
                name: data.user.name,
                username: data.user.username,
                roles: data.user.roles,
            }));
        } catch (error) {
            dispatch(onLogout("Verifique las credenciales ingresadas"));
            setTimeout(() => {
                dispatch(clearErrorMessage());
            }, 10);
        }
    };

    const checkAuthToken = async () => {
        const token = localStorage.getItem("token");
        if (!token) return dispatch(onLogout());

        try {
            const { data } = await api.get("/renew-token");
            localStorage.setItem("token", data.access_token);
            localStorage.setItem("token-init-date", new Date().getTime().toString());
            dispatch(onLogin({
                id_user: data.user.id,
                name: data.user.name,
                username: data.user.username,
                roles: data.user.roles,
            }));
            
        } catch (error) {
            localStorage.clear();
            dispatch(onLogout("Ocurrió un error al verificar el token"));
        }
    };

    const startLogout = async () => {
        const confirmation = await SweetAlert2.confirm("¿Está seguro de cerrar la sesión?");
        if (!confirmation.value) return;
        localStorage.clear();
        dispatch(onLogout("Sesión cerrada correctamente"));
    };

    return {
        // Propiedades
        status,
        user,

        errorMessage,

        // Métodos
        startLogin,
        checkAuthToken,
        startLogout,
    };
};