import { createRoleType, updateRoleType } from "@/api/index";
import { RoleType } from "@/types/role_types/roleTypes";
import { Switch } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const RoleTypesForm = (props: { handleClose: () => void; type?: RoleType }) => {
    const [name, setName] = useState("");
    const [id, setId] = useState("");
    const [is_admin, setIsAdmin] = useState(false); // Cambiado a boolean

    const queryClient = useQueryClient(); // Obtener el cliente de consultas

    useEffect(() => {
        if (props.type) {
            setId(props.type.id); // Precargar el ID si estamos editando
            setName(props.type.name); // Precargar el nombre si estamos editando
            setIsAdmin(props.type.is_admin); // Precargar el booleano si es administrador
        }
    }, [props.type]);

    const { mutate } = useMutation({
        mutationFn: (formData: { id?: string; name: string; is_admin: boolean }) => {
            if (props.type) {
                // Si hay un role type, actualizamos
                return updateRoleType({ formData, typeId: props.type.id });
            } else {
                // Si no hay type, creamos uno nuevo
                return createRoleType(formData);
            }
        },
        onError: (error: { message: string }) => {
            if (error.message.includes("Ya existe un tipo de rol con ese nombre")) {
                toast.error("Ya existe un tipo de rol con ese nombre"); // Mensaje específico para nombre duplicado
            } else {
                toast.error(error.message); // Mostrar otros errores
            }
        },
        onSuccess: (data: { message: string }) => {
            toast.success(data?.message || "Operación exitosa"); // Mostrar toast de éxito
            queryClient.invalidateQueries({ queryKey: ["roles"] }); // Forzar la actualización del listado
            props.handleClose(); // Cerrar el modal
        },
    });

    const handleForm = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        mutate({ id, name, is_admin }); // Llamar a la mutación con los datos del formulario
    };

    return (
        <form onSubmit={handleForm}>
            <div className="mb-5 space-y-3">
                <p className="text-2xl font-light text-gray-500 mb-5">
                    {props.type ? "Editar Tipo de Rol" : "Crear Tipo de Rol"}
                </p>
                <label htmlFor="name" className="text-sm uppercase font-bold">
                    Nombre
                </label>
                <input
                    id="name"
                    className="w-full p-3 border border-gray-200"
                    type="text"
                    placeholder="Tipo de rol"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <div className="mb-5 space-y-3">
                    <label htmlFor="is_admin" className="text-sm uppercase font-bold">
                        Usuario administrador
                    </label>
                </div>
                <div>
                    <Switch
                        checked={is_admin}
                        onChange={(e) => setIsAdmin(e.target.checked)} // Actualizar el estado con el valor booleano
                        inputProps={{ 'aria-label': 'controlled' }}
                    />
                </div>

            </div>
            <div>
                <input
                    type="submit"
                    value={props.type ? "Actualizar Tipo" : "Crear Tipo"}
                    className="bg-blue-600 px-10 py-3 text-white uppercase font-bold text-xs w-full text-center rounded-lg"
                />
            </div>
        </form>
    );
};

export default RoleTypesForm;