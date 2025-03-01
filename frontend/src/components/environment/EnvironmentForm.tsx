import { getTypes } from "@/api/environment_types/EnvironmentTypesAPI";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Environment } from "@/types/environment/environment";
import { createEnvironment, getCities, getCompany, getCountries, getProvinces, updateEnvironment } from "@/api/index";

const EnvironmentForm = (props: { handleClose: () => void; type?: Environment }) => {
    // Inicializa todos los estados con valores por defecto
    const [id, setId] = useState(props.type?.id || "");
    const [company_id, setCompanyId] = useState(props.type?.company_id || "");
    const [country_id, setCountryId] = useState(props.type?.country_id || "");
    const [province_id, setProvinceId] = useState(props.type?.province_id || "");
    const [city_id, setCityId] = useState(props.type?.city_id || "");
    const [type_id, setTypeId] = useState(props.type?.type_id || "");
    const [name, setName] = useState(props.type?.name || "");
    const [address, setAddress] = useState(props.type?.address || "");
    const [gps_location, setGpsLocation] = useState(props.type?.gps_location || "");
    const [description, setDescription] = useState(props.type?.description || "");

    const queryClient = useQueryClient();

    // Obtener la lista de empresas
    const { data: companies } = useQuery({
        queryKey: ['companies'],
        queryFn: () => getCompany(),
    });

    // Obtener la lista de países
    const { data: countries } = useQuery({
        queryKey: ['countries'],
        queryFn: () => getCountries(),
    });

    // Obtener la lista de provincias
    const { data: provinces } = useQuery({
        queryKey: ['provinces'],
        queryFn: () => getProvinces(),
    });

    // Obtener la lista de ciudades
    const { data: cities } = useQuery({
        queryKey: ['cities'],
        queryFn: () => getCities(),
    });

    // Obtener la lista de tipos de ambientes
    const { data: environment_types } = useQuery({
        queryKey: ['environment_types'],
        queryFn: () => getTypes(),
    });

    // Filtrar provincias por país seleccionado
    const filteredProvinces = provinces?.filter((province) => province.country_id === country_id);

    // Filtrar ciudades por provincia seleccionada
    const filteredCities = cities?.filter((city) => city.province_id === province_id);

    useEffect(() => {
        if (props.type) {
            // Obtener la ciudad del ambiente
            const city = cities?.find((city) => city.id === props.type?.city_id);
            if (city) {
                setCityId(city.id);
                setProvinceId(city.province_id);

                // Obtener la provincia de la ciudad
                const province = provinces?.find((province) => province.id === city.province_id);
                if (province) {
                    setProvinceId(province.id);
                    setCountryId(province.country_id);
                }
            }
        }
    }, [props.type, cities, provinces]);

    const { mutate } = useMutation({
        mutationFn: (formData: {
            id?: string;
            company_id: string;
            country_id: string;
            province_id: string;
            city_id: string;
            type_id: string;
            name: string;
            address: string;
            gps_location: string;
            description: string
        }) => {
            if (props.type) {
                // Si hay un type, actualizamos
                return updateEnvironment({ formData, typeId: props.type.id });
            } else {
                // Si no hay type, creamos uno nuevo
                return createEnvironment(formData);
            }
        },
        onError: (error: { message: string }) => {
            if (error.message.includes("Ya existe un ambiente con ese nombre")) {
                toast.error("Ya existe un ambiente con ese nombre");
            } else {
                toast.error(error.message);
            }
        },
        onSuccess: (data: { message: string }) => {
            toast.success(data?.message || "Operación exitosa");
            queryClient.invalidateQueries({ queryKey: ["environments"] });
            props.handleClose();
        },
    });

    const handleForm = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        mutate({ id, company_id, country_id, province_id, city_id, type_id, name, address, gps_location, description });
    };

    return (
        <form onSubmit={handleForm}>
            <div className="mb-5 space-y-3">
                <p className="text-2xl font-light text-gray-500 mb-5">
                    {props.type ? "Editar Ambiente" : "Crear Ambiente"}
                </p>
                <input
                    id="company_id"
                    className="w-full p-3 border border-gray-200"
                    type="text"
                    placeholder="Empresa"
                    hidden
                    required
                    value={companies?.id}
                    onChange={(e) => setCompanyId(e.target.value)}
                />
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
                <label htmlFor="city_id" className="text-sm uppercase font-bold">
                    Ciudad
                </label>
                <select
                    id="city_id"
                    className="w-full p-3 border border-gray-200"
                    value={city_id}
                    onChange={(e) => setCityId(e.target.value)}
                    required
                >
                    <option value="">Seleccione una ciudad</option>
                    {filteredCities?.map((city) => (
                        <option key={city.id} value={city.id}>
                            {city.name}
                        </option>
                    ))}
                </select>
                <label htmlFor="type_id" className="text-sm uppercase font-bold">
                    Tipo de Ambiente
                </label>
                <select
                    id="type_id"
                    className="w-full p-3 border border-gray-200"
                    value={type_id}
                    onChange={(e) => setTypeId(e.target.value)}
                    required
                >
                    <option value="">Seleccione un tipo de ambiente</option>
                    {environment_types?.map((environment_type) => (
                        <option key={environment_type.id} value={environment_type.id}>
                            {environment_type.name}
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
                    placeholder="Nombre"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <label htmlFor="address" className="text-sm uppercase font-bold">
                    Dirección
                </label>
                <input
                    id="address"
                    className="w-full p-3 border border-gray-200"
                    type="text"
                    placeholder="Dirección"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />
                <label htmlFor="gps_location" className="text-sm uppercase font-bold">
                    Ubicación GPS
                </label>
                <input
                    id="gps_location"
                    className="w-full p-3 border border-gray-200"
                    type="text"
                    placeholder="Ubicación GPS"
                    required
                    value={gps_location}
                    onChange={(e) => setGpsLocation(e.target.value)}
                />
                <label htmlFor="description" className="text-sm uppercase font-bold">
                    Descripción
                </label>
                <input
                    id="description"
                    className="w-full p-3 border border-gray-200"
                    type="text"
                    placeholder="Descripción"
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
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

export default EnvironmentForm;