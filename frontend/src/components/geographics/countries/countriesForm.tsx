
import { createCountry, updateCountry } from "@/api/index";
import { Country } from "@/types/geographics/countries";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";

import { toast } from "react-toastify";

const CountriesForm = (props: { handleClose: () => void; country?: Country }) => {
    const [name, setName] = useState("");
    const [id, setId] = useState("");

    const queryClient = useQueryClient(); // Obtener el cliente de consultas

    useEffect(() => {
        if (props.country) {
            setId(props.country.id); // Precargar el ID si estamos editando
            setName(props.country.name); // Precargar el nombre si estamos editando
        }
    }, [props.country]);

    const { mutate } = useMutation({
        mutationFn: (formData: { id?: string; name: string }) => {
            if (props.country) {
                // Si hay un Pais, actualizamos
                return updateCountry({ formData, countryId: props.country.id });
            } else {
                // Si no hay Pais, creamos uno nuevo
                return createCountry(formData);
            }
        },
        onError: (error: { message: string }) => {
            if (error.message.includes("Ya existe un país con ese nombre")) {
                toast.error("Ya existe un país con ese nombre"); // Mensaje específico para nombre duplicado
            } else {
                toast.error(error.message); // Mostrar otros errores
            }
        },
        onSuccess: (data: { message: string }) => {
            toast.success(data?.message || "Operación exitosa"); // Mostrar toast de éxito
            queryClient.invalidateQueries({ queryKey: ["countries"] }); // Forzar la actualización del listado
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
                    {props.country ? "Editar País" : "Crear País"}
                </p>
                <label htmlFor="name" className="text-sm uppercase font-bold">
                    Nombre
                </label>
                <input
                    id="name"
                    className="w-full p-3 border border-gray-200"
                    type="text"
                    placeholder="País"
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

export default CountriesForm;