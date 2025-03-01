import { UseFormRegister, FieldErrors } from "react-hook-form"
import ErrorMessage from "../common/ErrorMessage"
import { UserFormData } from "@/types/index"



type UserFormProps = {
    register: UseFormRegister<UserFormData>
    errors: FieldErrors<UserFormData>
}

export default function UserForm({ errors, register }: UserFormProps) {
    return (
        <>
            <div className="mb-5 space-y-3">
                <label htmlFor="username" className="text-sm uppercase font-bold">
                    Nombre de usuario
                </label>
                <input
                    id="username"
                    className="w-full p-3  border border-gray-200"
                    type="text"
                    placeholder="Nombre de usuario"
                    {...register("username", {
                        required: "El nombre de usuario es obligatorio",
                    })}
                />

                {errors.username && (
                    <ErrorMessage>{errors.username.message}</ErrorMessage>
                )}
            </div>

            <div className="mb-5 space-y-3">
                <label htmlFor="password" className="text-sm uppercase font-bold">
                    Contraseña
                </label>
                <input
                    id="password"
                    className="w-full p-3  border border-gray-200"
                    type="password"
                    placeholder="Contraseña"
                    {...register("password", {
                        required: "La contraseña es obligatoria",
                    })}
                />

                {errors.password && (
                    <ErrorMessage>{errors.password.message}</ErrorMessage>
                )}
            </div>

            <div className="mb-5 space-y-3">
                <label htmlFor="name" className="text-sm uppercase font-bold">
                    Nombres
                </label>
                <input
                    id="name"
                    className="w-full p-3  border border-gray-200"
                    type="text"
                    placeholder="Nombres"
                    {...register("name", {
                        required: "El nombre es obligatorio",
                    })}
                />

                {errors.name && (
                    <ErrorMessage>{errors.name.message}</ErrorMessage>
                )}
            </div>

            <div className="mb-5 space-y-3">
                <label htmlFor="surname" className="text-sm uppercase font-bold">
                    Apellido
                </label>
                <input
                    id="surname"
                    className="w-full p-3  border border-gray-200"
                    type="text"
                    placeholder="Apellido"
                    {...register("surname", {
                        required: "El apellido es obligatorio",
                    })}
                />

                {errors.name && (
                    <ErrorMessage>{errors.surname.message}</ErrorMessage>
                )}
            </div>

            <div className="mb-5 space-y-3">
                <label htmlFor="email" className="text-sm uppercase font-bold">
                    Correo electrónico
                </label>
                <input
                    id="email"
                    className="w-full p-3  border border-gray-200"
                    type="email"
                    placeholder="correo@correo.com"
                    {...register("email", {
                        required: "El correo electrónico es obligatorio",
                        pattern: {
                            value: /\S+@\S+\.\S+/,
                            message: "El correo electrónico no es válido",
                        },
                    })}
                />

                {errors.email && (
                    <ErrorMessage>{errors.email.message}</ErrorMessage>
                )}
            </div>
            <div className="mb-5 space-y-3">
                <label htmlFor="enabled" className="text-sm uppercase font-bold">
                    Usuario activo
                </label>

            </div>
            <div className="relative inline-block w-11 h-5 mb-5">
                <input id="enabled" type="checkbox" className="peer appearance-none w-11 h-5 bg-slate-100 rounded-full checked:bg-slate-800 cursor-pointer transition-colors duration-300 mb-5" />
                <label htmlFor="enabled" className="absolute top-0 left-0 w-5 h-5 bg-white rounded-full border border-slate-300 shadow-sm transition-transform duration-300 peer-checked:translate-x-6 peer-checked:border-slate-800 cursor-pointer mb-5">
                </label>
            </div>
            <div className="mb-5 space-y-3">
                <label htmlFor="is_admin" className="text-sm uppercase font-bold">
                    Usuario administrador
                </label>

            </div>
            <div className="relative inline-block w-11 h-5 mb-5">
                <input id="is_admin" type="checkbox" className="peer appearance-none w-11 h-5 bg-slate-100 rounded-full checked:bg-slate-800 cursor-pointer transition-colors duration-300 mb-5" />
                <label htmlFor="is_admin" className="absolute top-0 left-0 w-5 h-5 bg-white rounded-full border border-slate-300 shadow-sm transition-transform duration-300 peer-checked:translate-x-6 peer-checked:border-slate-800 cursor-pointer mb-5">
                </label>
            </div>

            {errors.is_admin && (
                <ErrorMessage>{errors.is_admin.message}</ErrorMessage>
            )}
        </>
    )
}