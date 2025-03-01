import { useCities, useCountries, useProvinces } from "@/hooks/index";
import { useState } from "react";

export const useCitySelector = () => {
    const [selectedCountry, setSelectedCountry] = useState("");
    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedCity, setSelectedCity] = useState("");

    // Asegúrate de que los datos tengan valores predeterminados
    const { data: countries = [] } = useCountries();
    const { data: provinces = [] } = useProvinces(selectedCountry);
    const { data: cities = [] } = useCities(selectedProvince);

    const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCountry(e.target.value);
        setSelectedProvince("");
        setSelectedCity("");
    };

    const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedProvince(e.target.value);
        setSelectedCity("");
    };

    const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCity(e.target.value);
    };

    return {
        countries,
        provinces,
        cities,
        selectedCountry,
        selectedProvince,
        selectedCity,
        handleCountryChange,
        handleProvinceChange,
        handleCityChange,
    };
};