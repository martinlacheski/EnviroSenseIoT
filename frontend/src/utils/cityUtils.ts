import { getCityById, getProvinceById, getCountryById } from "@/api/index";

// Función para obtener el texto Ciudad - Provincia - País
export async function getCityInfo(cityId: string): Promise<string> {
    try {
        // Obtener la ciudad
        const city = await getCityById(cityId);
        if (!city) {
            throw new Error("No se encontró la ciudad.");
        }

        // Obtener la provincia usando el ID de la ciudad
        const province = await getProvinceById(city.province_id);
        if (!province) {
            throw new Error("No se encontró la provincia.");
        }

        // Obtener el país usando el ID de la provincia
        const country = await getCountryById(province.country_id);
        if (!country) {
            throw new Error("No se encontró el país.");
        }

        // Construir el texto en el formato "Ciudad - Provincia - País"
        const cityProvinceCountry = `${city.name} - ${province.name} - ${country.name}`;

        return cityProvinceCountry;
    } catch (error) {
        throw new Error(error.message || "Error al obtener los datos de la ciudad, provincia y país.");
    }
}