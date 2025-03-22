import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserInterface {
    id_user: string;
    name: string;
    username: string;
}

// interface RolesInterface {
//     roles: string[];
// }

interface AuthState {
    status: string;
    user: UserInterface | null;
    roles: string[];
    errorMessage?: string; // Hacer errorMessage opcional
}

export const authSlice = createSlice({
    name: "auth",
    initialState: {
        status: "checking",
        user: null,
        roles: [],
        errorMessage: undefined,
    } as AuthState,

    reducers: {
        onChecking: (state) => {
            state.status = "checking";
            state.user = null;
            state.roles = [];
            state.errorMessage = undefined;
        },
        onLogin: (state, { payload }: PayloadAction<any>) => {
            state.status = "authenticated";
            state.user = {
                id_user: payload.id_user,
                name: payload.name,
                username: payload.username,
            };
            state.roles = payload.roles;
            state.errorMessage = undefined;
        },
        onLogout: (state, { payload }: PayloadAction<string | undefined>) => {
            state.status = "not-authenticated";
            state.user = null;
            state.roles = [];
            state.errorMessage = payload;
        },
        clearErrorMessage: (state) => {
            state.errorMessage = undefined;
        },
    },
});

export const { onChecking, onLogin, onLogout, clearErrorMessage } = authSlice.actions;
