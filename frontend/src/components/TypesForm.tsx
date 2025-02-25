import { createType, updateType } from "@/api/environment_types/EnvironmentTypesAPI";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Type } from "../types";
import { toast } from "react-toastify";

const TypesForm = (props: { handleClose: () => void; type?: Type }) => {
    const [name, setName] = useState("");
    const [id, setId] = useState("");

    const queryClient = useQueryClient(); // Obtener el cliente de consultas

    useEffect(() => {
        if (props.type) {
            setId(props.type.id); // Precargar el ID si estamos editando
            setName(props.type.name); // Precargar el nombre si estamos editando
        }
    }, [props.type]);

    const { mutate } = useMutation({
        mutationFn: (formData: { id?: string; name: string }) => {
            if (props.type) {
                // Si hay un type, actualizamos
                return updateType({ formData, typeId: props.type.id });
            } else {
                // Si no hay type, creamos uno nuevo
                return createType(formData);
            }
        },
        onError: (error: { message: string }) => {
            if (error.message.includes("Ya existe un tipo de ambiente con ese nombre")) {
                toast.error("Ya existe un tipo de ambiente con ese nombre"); // Mensaje específico para nombre duplicado
            } else {
                toast.error(error.message); // Mostrar otros errores
            }
        },
        onSuccess: (data: { message: string }) => {
            toast.success(data?.message || "Operación exitosa"); // Mostrar toast de éxito
            queryClient.invalidateQueries({ queryKey: ["types"] }); // Forzar la actualización del listado
            props.handleClose(); // Cerrar el modal
        },
    });

    const handleForm = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        mutate({ id, name }); // Llamar a la mutación con los datos del formulario
    };

    return (
        <form onSubmit={handleForm}>
            <div className="mb-5 space-y-3">
                <p className="text-2xl font-light text-gray-500 mb-5">
                    {props.type ? "Editar Tipo de Ambiente" : "Crear Tipo de Ambiente"}
                </p>
                <label htmlFor="name" className="text-sm uppercase font-bold">
                    Nombre
                </label>
                <input
                    id="name"
                    className="w-full p-3 border border-gray-200"
                    type="text"
                    placeholder="Tipo de ambiente"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
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

export default TypesForm;