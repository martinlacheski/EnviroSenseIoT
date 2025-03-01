import { useCitySelector } from "./useCitySelector";

const CitySelector = ({ onSelectCity }) => {
    const {
        countries,
        provinces,
        cities,
        selectedCountry,
        selectedProvince,
        selectedCity,
        handleCountryChange,
        handleProvinceChange,
        //handleCityChange,
    } = useCitySelector();

    const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const cityId = e.target.value;
        onSelectCity(cityId); // Pasa el ID de la ciudad seleccionada al componente padre
    };

    return (
        <div className="space-y-4">
            <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                    País
                </label>
                <select
                    id="country"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    value={selectedCountry}
                    onChange={handleCountryChange}
                >
                    <option value="">Seleccione un país</option>
                    {countries.map((country) => (
                        <option key={country.id} value={country.id}>
                            {country.name}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="province" className="block text-sm font-medium text-gray-700">
                    Provincia
                </label>
                <select
                    id="province"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    value={selectedProvince}
                    onChange={handleProvinceChange}
                    disabled={!selectedCountry}
                >
                    <option value="">Seleccione una provincia</option>
                    {provinces.map((province) => (
                        <option key={province.id} value={province.id}>
                            {province.name}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                    Ciudad
                </label>
                <select
                    id="city"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    value={selectedCity}
                    onChange={handleCityChange}
                    disabled={!selectedProvince}
                >
                    <option value="">Seleccione una ciudad</option>
                    {cities.map((city) => (
                        <option key={city.id} value={city.id}>
                            {city.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default CitySelector;