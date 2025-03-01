import React, { useState } from "react";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changePassword } from "@/api/users/UserAPI";


const UserPasswordForm = ({ handleClose, user }) => {
    const [new_password, setNewPassword] = useState("");
    const [new_password_confirmation, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: changePassword,
        onError: (error: { message: string }) => {
            toast.error(error.message);
        },
        onSuccess: (data: { message: string }) => {
            toast.success(data?.message || "Contraseña actualizada correctamente");
            queryClient.invalidateQueries({ queryKey: ['users'] });
            handleClose();
        },
    });

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewPassword(e.target.value);
        if (passwordError && e.target.value === new_password_confirmation) {
            setPasswordError(""); // Limpiar el error si las contraseñas coinciden
        }
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);
        if (passwordError && e.target.value === new_password) {
            setPasswordError(""); // Limpiar el error si las contraseñas coinciden
        }
    };

    const handlePasswordBlur = () => {
        if (new_password !== new_password_confirmation) {
            setPasswordError("Las contraseñas no coinciden.");
        }
    };

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();

        if (new_password !== new_password_confirmation) {
            setPasswordError("Las contraseñas no coinciden.");
            return;
        }

        setPasswordError("");

        const formData = {
            id: user.id,
            new_password,
            new_password_confirmation,
        };

        mutate(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-5 space-y-3">
                <p className="text-2xl font-light text-gray-500 mb-5">Cambiar contraseña</p>

                <div className="mb-5">
                    <label htmlFor="username" className="text-sm uppercase font-bold">
                        Usuario
                    </label>
                    <p id="username" className="text-gray-700">
                        {user.username}
                    </p>
                </div>

                <div className="mb-5">
                    <label htmlFor="newPassword" className="text-sm uppercase font-bold">
                        Nueva contraseña
                    </label>
                    <input
                        id="newPassword"
                        className="w-full p-3 border border-gray-200"
                        type="password"
                        placeholder="Nueva contraseña"
                        required
                        minLength={4}
                        value={new_password}
                        onChange={handlePasswordChange}
                        onBlur={handlePasswordBlur}
                    />
                </div>

                <div className="mb-5">
                    <label htmlFor="confirmPassword" className="text-sm uppercase font-bold">
                        Confirmar nueva contraseña
                    </label>
                    <input
                        id="confirmPassword"
                        className="w-full p-3 border border-gray-200"
                        type="password"
                        placeholder="Confirmar nueva contraseña"
                        required
                        minLength={4}
                        value={new_password_confirmation}
                        onChange={handleConfirmPasswordChange}
                        onBlur={handlePasswordBlur}
                    />
                </div>

                {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
            </div>

            <div className="flex w-full space-x-3">
                <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 bg-gray-500 px-6 py-3 text-white uppercase font-bold text-xs rounded-lg"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="flex-1 bg-blue-600 px-6 py-3 text-white uppercase font-bold text-xs rounded-lg"
                >
                    Guardar
                </button>
            </div>
        </form>
    );
};

export default UserPasswordForm;