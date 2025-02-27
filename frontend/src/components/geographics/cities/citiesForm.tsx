import { createCity, updateCity } from "@/api/geographic/CitiesAPI";
import { getProvinces } from "@/api/geographic/ProvincesAPI";
import { City } from "@/types/index";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const CitiesForm = (props: { handleClose: () => void; city?: City; countries: any[] }) => {
    const [id, setId] = useState("");
    const [countryId, setCountryId] = useState("");
    const [province_id, setProvinceId] = useState("");
    const [name, setName] = useState("");
    const [postal_code, setPostalCode] = useState("");

    const queryClient = useQueryClient();

    // Obtener la lista de provincias
    const { data: provinces } = useQuery({
        queryKey: ['provinces'],
        queryFn: getProvinces,
    });

    // Filtrar provincias por país seleccionado
    const filteredProvinces = provinces?.filter((province) => province.country_id === countryId);

    useEffect(() => {
        if (props.city) {
            setId(props.city.id);
            setName(props.city.name);
            setProvinceId(props.city.province_id);
            setPostalCode(props.city.postal_code);
            // Establecer el país basado en la provincia seleccionada
            const province = provinces?.find((province) => province.id === props.city?.province_id);
            if (province) {
                setCountryId(province.country_id);
            }
        }
    }, [props.city, provinces]);

    const { mutate } = useMutation({
        mutationFn: (formData: { id?: string; province_id: string, name: string; postal_code: string }) => {
            if (props.city) {
                return updateCity({ formData, cityId: props.city.id });
            } else {
                return createCity(formData);
            }
        },
        onError: (error: { message: string }) => {
            if (error.message.includes("Ya existe una ciudad con ese nombre")) {
                toast.error("Ya existe una ciudad con ese nombre");
            } else {
                toast.error(error.message);
            }
        },
        onSuccess: (data: { message: string }) => {
            toast.success(data?.message || "Operación exitosa");
            queryClient.invalidateQueries({ queryKey: ["cities"] });
            props.handleClose();
        },
    });

    const handleForm = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        mutate({ id, province_id, name, postal_code });
    };

    return (
        <form onSubmit={handleForm}>
            <div className="mb-5 space-y-3">
                <p className="text-2xl font-light text-gray-500 mb-5">
                    {props.city ? "Editar Ciudad" : "Crear Ciudad"}
                </p>
                <label htmlFor="country_id" className="text-sm uppercase font-bold">
                    País
                </label>
                <select
                    id="country_id"
                    className="w-full p-3 border border-gray-200"
                    value={countryId}
                    onChange={(e) => setCountryId(e.target.value)}
                    required
                >
                    <option value="">Seleccione un país</option>
                    {props.countries?.map((country) => (
                        <option key={country.id} value={country.id}>
                            {country.name}
                        </option>
                    ))}
                </select>
                <label htmlFor="province_id" className="text-sm uppercase font-bold">
                    Provincia
                </label>
                <select
                    id="province_id"
                    className="w-full p-3 border border-gray-200"
                    value={province_id}
                    onChange={(e) => setProvinceId(e.target.value)}
                    required
                >
                    <option value="">Seleccione una provincia</option>
                    {filteredProvinces?.map((province) => (
                        <option key={province.id} value={province.id}>
                            {province.name}
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
                    placeholder="Ciudad"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <label htmlFor="postal_code" className="text-sm uppercase font-bold">
                    Código Postal
                </label>
                <input
                    id="postal_code"
                    className="w-full p-3 border border-gray-200"
                    type="text"
                    placeholder="Código Postal"
                    required
                    value={postal_code}
                    onChange={(e) => setPostalCode(e.target.value)}
                />
            </div>
            <div>
                <input
                    type="submit"
                    value={props.city ? "Actualizar Ciudad" : "Crear Ciudad"}
                    className="bg-blue-600 px-10 py-3 text-white uppercase font-bold text-xs w-full text-center rounded-lg"
                />
            </div>
        </form>
    );
};

export default CitiesForm;