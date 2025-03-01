import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { getCompany, updateCompany, uploadLogo } from "@/api/index"; // Asegúrate de tener estas funciones en tu API
import { getCityInfo } from "@/utils/cityUtils";
import CitySelectorModal from "@/components/city_selector/CitySelectorModal";
import { useNavigate } from "react-router-dom";

export default function CompanyView() {
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [webpage, setWebpage] = useState("");
    const [logo, setLogo] = useState("");
    const [emailError, setEmailError] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [city_id, setCityID] = useState<string>("");
    const [cityInfo, setCityInfo] = useState<string>(""); // Estado para el texto Ciudad - Provincia - País
    const [isCitySelectorOpen, setIsCitySelectorOpen] = useState(false);

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Obtener los datos de la empresa al cargar el componente
    const { data: company, isLoading, isError } = useQuery({
        queryKey: ["company"],
        queryFn: getCompany,
    });

    // Actualizar el estado del formulario cuando los datos de la empresa se carguen
    useEffect(() => {
        if (company) {
            setId(company.id);
            setName(company.name);
            setAddress(company.address);
            setEmail(company.email);
            setPhone(company.phone);
            setWebpage(company.webpage);
            setLogo(company.logo);
            setCityID(company.city_id);
        }
    }, [company]);

    // Obtener el texto Ciudad - Provincia - País cuando se cargue la empresa
    useEffect(() => {
        if (company && company.city_id) {
            getCityInfo(company.city_id)
                .then((data) => setCityInfo(data)) // data es un string
                .catch((error) => {
                    console.error(error);
                    toast.error(error.message);
                });
        }
    }, [company]);

    // Obtener el texto Ciudad - Provincia - País cuando se actualice city_id
    useEffect(() => {
        if (city_id) {
            getCityInfo(city_id)
                .then((data) => setCityInfo(data)) // Actualiza el estado cityInfo
                .catch((error) => {
                    console.error(error);
                    toast.error(error.message);
                });
        }
    }, [city_id]); // Este efecto se ejecuta cada vez que city_id cambia

    // Manejar la selección de una ciudad
    const handleSelectCity = (cityId: string) => {
        setCityID(cityId); // Actualiza el estado city_id
        setIsCitySelectorOpen(false); // Cierra el modal
        setCityID(cityId)
    };

    // Manejar la subida del logo
    const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const url = await uploadLogo(file); // Usar la función de subida del logo
                setLogo(url); // Actualizar el estado logo con la URL de la imagen subida
                toast.success("Logo subido correctamente");
            } catch (error) {
                console.error(error);
                toast.error("Error al subir el logo");
            }
        }
    };

    const handleCancel = () => {
        navigate("/"); // Redirigir al raíz del proyecto
    };

    // Mutación para actualizar los datos de la empresa
    const { mutate } = useMutation({
        mutationFn: updateCompany,
        onError: (error: { message: string }) => {
            toast.error(error.message);
        },
        onSuccess: (data: { message: string }) => {
            toast.success(data?.message || "Datos de la empresa actualizados correctamente");
            queryClient.invalidateQueries({ queryKey: ["company"] });
        },
    });

    const validateEmail = (email: string) => {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(email);
    };

    const validatePhone = (phone: string) => {
        const regex = /^\+?[0-9]{10,15}$/;
        return regex.test(phone);
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        if (emailError && validateEmail(e.target.value)) {
            setEmailError("");
        }
    };

    const handleEmailBlur = () => {
        if (!validateEmail(email)) {
            setEmailError("Por favor, ingresa un correo electrónico válido.");
        }
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhone(e.target.value);
        if (phoneError && validatePhone(e.target.value)) {
            setPhoneError("");
        }
    };

    const handlePhoneBlur = () => {
        if (!validatePhone(phone)) {
            setPhoneError("Por favor, ingresa un número de teléfono válido.");
        }
    };

    const handleForm = async (e: React.SyntheticEvent) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            setEmailError("Por favor, ingresa un correo electrónico válido.");
            return;
        }

        if (!validatePhone(phone)) {
            setPhoneError("Por favor, ingresa un número de teléfono válido.");
            return;
        }

        const formData = {
            id,
            name,
            address,
            email,
            phone,
            webpage,
            logo,
            city_id,
        };

        mutate(formData);
    };

    if (isLoading) {
        return <div>Cargando...</div>;
    }

    if (isError) {
        return <div>Error al cargar los datos de la empresa.</div>;
    }

    return (
        <form onSubmit={handleForm}>
            <div className="mb-5 space-y-3">
                <p className="text-2xl font-light text-gray-500 mb-5">
                    Datos de la Empresa
                </p>

                <label htmlFor="name" className="text-sm uppercase font-bold">Nombre</label>
                <input
                    id="name"
                    className="w-full p-3 border border-gray-200"
                    type="text"
                    placeholder="Nombre de la empresa"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <label htmlFor="address" className="text-sm uppercase font-bold">Dirección</label>
                <input
                    id="address"
                    className="w-full p-3 border border-gray-200"
                    type="text"
                    placeholder="Dirección"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />

                <label htmlFor="email" className="text-sm uppercase font-bold">Correo electrónico</label>
                <input
                    id="email"
                    className="w-full p-3 border border-gray-200"
                    type="email"
                    placeholder="Correo electrónico"
                    required
                    value={email}
                    onChange={handleEmailChange}
                    onBlur={handleEmailBlur}
                />
                {emailError && <p className="text-red-500 text-sm">{emailError}</p>}

                <label htmlFor="phone" className="text-sm uppercase font-bold">Teléfono</label>
                <input
                    id="phone"
                    className="w-full p-3 border border-gray-200"
                    type="text"
                    placeholder="Teléfono"
                    required
                    value={phone}
                    onChange={handlePhoneChange}
                    onBlur={handlePhoneBlur}
                />
                {phoneError && <p className="text-red-500 text-sm">{phoneError}</p>}

                <label htmlFor="webpage" className="text-sm uppercase font-bold">Página web</label>
                <input
                    id="webpage"
                    className="w-full p-3 border border-gray-200"
                    type="url"
                    placeholder="Página web"
                    value={webpage}
                    onChange={(e) => setWebpage(e.target.value)}
                />

                {/* <label htmlFor="logo" className="text-sm uppercase font-bold">Logo</label>
                <div className="flex items-center gap-3">
                    {logo && <img src={logo} alt="Logo" className="w-12 h-12 rounded-lg" />}
                    <input
                        type="file"
                        id="logo"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="hidden"
                    />
                    <label
                        htmlFor="logo"
                        className="bg-gray-100 px-4 py-2 rounded-lg text-sm font-bold cursor-pointer"
                    >
                        Cambiar Logo
                    </label>
                </div> */}

                <label htmlFor="logo" className="text-sm uppercase font-bold">Logo</label>
                <div className="flex items-center gap-3">
                    {logo && (
                        <>
                            <img
                                src={`${import.meta.env.VITE_API_URL}${logo}`}  // URL completa del logo
                                alt="Logo"
                                className="w-12 h-12 rounded-lg"
                            />
                            <span className="text-sm text-gray-500">{`${import.meta.env.VITE_API_URL}${logo}`}</span>
                        </>
                    )}
                    <input
                        type="file"
                        id="logo"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="hidden"
                    />
                    <label
                        htmlFor="logo"
                        className="bg-gray-100 px-3 py-3.5 rounded-md cursor-pointer"
                    >
                        Cambiar Logo
                    </label>
                </div>

                <label htmlFor="city" className="text-sm uppercase font-bold">Ciudad</label>
                <div className="flex items-center gap-3">
                    <input
                        id="city"
                        className="w-full p-3 border border-gray-200"
                        type="text"
                        placeholder="Seleccionar ciudad"
                        value={cityInfo} // Muestra el texto "Ciudad - Provincia - País"
                        readOnly
                    />
                    <button
                        type="button"
                        onClick={() => setIsCitySelectorOpen(true)}
                        className="bg-gray-100 px-3 py-3.5 rounded-md"
                    >
                        Seleccionar
                    </button>
                </div>
            </div>


            <div className="flex w-full space-x-3">
                <button
                    type="button"
                    className="flex-1 bg-gray-500 px-6 py-3 text-white uppercase font-bold text-xs rounded-lg"
                    onClick={handleCancel}
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

            <CitySelectorModal
                isOpen={isCitySelectorOpen}
                onClose={() => setIsCitySelectorOpen(false)}
                onSelectCity={handleSelectCity}
            />
        </form>
    );
}