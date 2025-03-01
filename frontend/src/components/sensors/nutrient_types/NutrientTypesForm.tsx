import { createNutrientType, updateNutrientType } from "@/api/sensors/NutrientTypesAPI";
import { NutrientType } from "@/types/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const NutrientTypesForm = (props: { handleClose: () => void; type?: NutrientType }) => {
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
                return updateNutrientType({ formData, typeId: props.type.id });
            } else {
                // Si no hay type, creamos uno nuevo
                return createNutrientType(formData);
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
            queryClient.invalidateQueries({ queryKey: ["nutrient_types"] }); // Forzar la actualización del listado
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
                    {props.type ? "Editar Tipo de Nutriente" : "Crear Tipo de Nutriente"}
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

export default NutrientTypesForm;