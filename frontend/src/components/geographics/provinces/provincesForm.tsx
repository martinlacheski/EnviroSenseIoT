import { createProvince, updateProvince } from "@/api/geographic/ProvincesAPI";
import { Province } from "@/types/index";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"; // Agregar useQuery
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ProvincesForm = (props: { handleClose: () => void; province?: Province }) => {
    const [name, setName] = useState("");
    const [country_id, setCountryId] = useState("");
    const [id, setId] = useState("");

    const queryClient = useQueryClient(); // Obtener el cliente de consultas

    // Obtener la lista de países
    const { data: countries } = useQuery({
        queryKey: ['countries'],
        queryFn: () => getCountries(), // Asegúrate de importar getCountries
    });

    useEffect(() => {
        if (props.province) {
            setId(props.province.id); // Precargar el ID si estamos editando
            setName(props.province.name); // Precargar el nombre si estamos editando
            setCountryId(props.province.country_id); // Precargar el Country_ID si estamos editando
        }
    }, [props.province]);

    const { mutate } = useMutation({
        mutationFn: (formData: { id?: string; name: string; country_id: string }) => {
            if (props.province) {
                // Si hay una Provincia, actualizamos
                return updateProvince({ formData, provinceId: props.province.id });
            } else {
                // Si no hay Provincia, creamos uno nuevo
                return createProvince(formData);
            }
        },
        onError: (error: { message: string }) => {
            if (error.message.includes("Ya existe una provincia con ese nombre")) {
                toast.error("Ya existe una provincia con ese nombre"); // Mensaje específico para nombre duplicado
            } else {
                toast.error(error.message); // Mostrar otros errores
            }
        },
        onSuccess: (data: { message: string }) => {
            toast.success(data?.message || "Operación exitosa"); // Mostrar toast de éxito
            queryClient.invalidateQueries({ queryKey: ["provinces"] }); // Forzar la actualización del listado
            props.handleClose(); // Cerrar el modal
        },
    });

    const handleForm = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        mutate({ id, name, country_id }); // Llamar a la mutación con los datos del formulario
    };

    return (
        <form onSubmit={handleForm}>
            <div className="mb-5 space-y-3">
                <p className="text-2xl font-light text-gray-500 mb-5">
                    {props.province ? "Editar Provincia" : "Crear Provincia"}
                </p>
                <label htmlFor="country_id" className="text-sm uppercase font-bold">
                    País
                </label>
                <select
                    id="country_id"
                    className="w-full p-3 border border-gray-200"
                    value={country_id}
                    onChange={(e) => setCountryId(e.target.value)}
                    required
                >
                    <option value="">Seleccione un país</option>
                    {countries?.map((country) => (
                        <option key={country.id} value={country.id}>
                            {country.name}
                        </option>
                    ))}
                </select>
                <label htmlFor="name" className="text-sm uppercase font-bold">
                    Nombre
                </label>
                <input
                    id="name"
                    className="w-full p-3 border border-gray-200"
                    type="text"
                    placeholder="Provincia"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div>
                <input
                    type="submit"
                    value={props.province ? "Actualizar Provincia" : "Crear Provincia"}
                    className="bg-blue-600 px-10 py-3 text-white uppercase font-bold text-xs w-full text-center rounded-lg"
                />
            </div>
        </form>
    );
};

export default ProvincesForm;