import { createUser, updateUser } from "@/api/index";
import { User } from "@/types/index";
import { Switch } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const UserForm = (props: { handleClose: () => void; user?: User }) => {
    const [id, setId] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [enabled, setEnabled] = useState(false);
    const [is_admin, setIsAdmin] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const [emailError, setEmailError] = useState("");

    const queryClient = useQueryClient();

    useEffect(() => {
        if (props.user) {
            setId(props.user.id);
            setUsername(props.user.username);
            setPassword(props.user.password); // Guardar la contraseña actual
            setPasswordConfirmation(props.user.password); // Guardar la contraseña actual
            setName(props.user.name);
            setSurname(props.user.surname);
            setEmail(props.user.email);
            setEnabled(props.user.enabled);
            setIsAdmin(props.user.is_admin);
        }
    }, [props.user]);

    const { mutate } = useMutation({
        mutationFn: (data: { formData: User; userId: string }) => {
            if (props.user) {
                return updateUser(data.formData);
            } else {
                return createUser(data.formData);
            }
        },
        onError: (error: { message: string }) => {
            toast.error(error.message);
        },
        onSuccess: (data: { message: string }) => {
            toast.success(data?.message || "Operación exitosa");
            queryClient.invalidateQueries({ queryKey: ["users"] });
            props.handleClose();
        },
    });

    const validateEmail = (email: string) => {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(email);
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        if (emailError && validateEmail(e.target.value)) {
            setEmailError(""); // Limpiar el error si el email es válido
        }
    };

    const handleEmailBlur = () => {
        if (!validateEmail(email)) {
            setEmailError("Por favor, ingresa un correo electrónico válido.");
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        if (passwordError && e.target.value === passwordConfirmation) {
            setPasswordError(""); // Limpiar el error si las contraseñas coinciden
        }
    };

    const handlePasswordConfirmationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordConfirmation(e.target.value);
        if (passwordError && e.target.value === password) {
            setPasswordError(""); // Limpiar el error si las contraseñas coinciden
        }
    };

    const handlePasswordBlur = () => {
        if (password !== passwordConfirmation) {
            setPasswordError("Las contraseñas no coinciden.");
        }
    };

    const handleForm = async (e: React.SyntheticEvent) => {
        e.preventDefault();

        // Validar que las contraseñas coincidan (solo para crear usuario)
        if (!props.user && password !== passwordConfirmation) {
            setPasswordError("Las contraseñas no coinciden.");
            return;
        }

        // Validar el formato del email
        if (!validateEmail(email)) {
            setEmailError("Por favor, ingresa un correo electrónico válido.");
            return;
        }

        // Limpiar errores y enviar el formulario
        setPasswordError("");
        setEmailError("");

        const formData = {
            id,
            username,
            password,
            name,
            surname,
            email,
            enabled,
            is_admin,
        };

        if (props.user) {
            // Si es una edición, enviar el userId junto con los datos
            mutate({ formData, userId: props.user.id });
        } else {
            // Si es una creación, enviar también la contraseña
            mutate({ formData: { ...formData, password }, userId: "" });
        }
    };

    return (
        <form onSubmit={handleForm}>
            <div className="mb-5 space-y-3">
                <p className="text-2xl font-light text-gray-500 mb-5">
                    {props.user ? "Editar Usuario" : "Crear Usuario"}
                </p>
                <label htmlFor="username" className="text-sm uppercase font-bold">Nombre de usuario</label>
                <input
                    id="username"
                    className="w-full p-3 border border-gray-200"
                    type="text"
                    placeholder="Nombre de usuario"
                    minLength={4}
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                {/* Mostrar campos de contraseña solo si es un nuevo usuario */}
                {!props.user && (
                    <>
                        <label className="text-sm uppercase font-bold" htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Password"
                            className="w-full p-3 border border-gray-200"
                            required
                            minLength={4}
                            value={password}
                            onChange={handlePasswordChange}
                            onBlur={handlePasswordBlur}
                        />
                        <label htmlFor="password_confirmation" className="text-sm uppercase font-bold">Repetir Password</label>
                        <input
                            id="password_confirmation"
                            type="password"
                            placeholder="Repetir Password"
                            className="w-full p-3 border border-gray-200"
                            required
                            minLength={4}
                            value={passwordConfirmation}
                            onChange={handlePasswordConfirmationChange}
                            onBlur={handlePasswordBlur}
                        />
                        {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
                    </>
                )}
                <label htmlFor="name" className="text-sm uppercase font-bold">Nombres</label>
                <input
                    id="name"
                    className="w-full p-3 border border-gray-200"
                    type="text"
                    placeholder="Nombres"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <label htmlFor="surname" className="text-sm uppercase font-bold">Apellidos</label>
                <input
                    id="surname"
                    className="w-full p-3 border border-gray-200"
                    type="text"
                    placeholder="Apellidos"
                    required
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                />
                <label htmlFor="email" className="text-sm uppercase font-bold">Correo electrónico</label>
                <input
                    id="email"
                    className="w-full p-3 border border-gray-200"
                    type="email"
                    placeholder="Ingrese el correo electrónico"
                    required
                    pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                    value={email}
                    onChange={handleEmailChange}
                    onBlur={handleEmailBlur}
                />
                {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
                <div className="mb-5 space-y-3">
                    <label htmlFor="enabled" className="text-sm uppercase font-bold">Usuario activo</label>
                    <div className="mb-5 space-y-3">
                        <Switch checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
                    </div>
                </div>
                <div className="mb-5 space-y-3">
                    <label htmlFor="is_admin" className="text-sm uppercase font-bold">Usuario administrador</label>
                    <div className="mb-5 space-y-3">
                        <Switch checked={is_admin} onChange={(e) => setIsAdmin(e.target.checked)} />
                    </div>
                </div>
            </div>
            <div className="flex w-full space-x-3">
                <button
                    type="button"
                    onClick={props.handleClose}
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

export default UserForm;