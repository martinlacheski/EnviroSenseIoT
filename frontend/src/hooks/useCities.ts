import { useQuery } from "@tanstack/react-query";
import { getCities } from "../api";


// Obtener la lista de ciudades
async function cities(provinceId: string) {
    const citiesList = await getCities()
    // Filtrar provincias por país seleccionado
    const filteredCities = citiesList?.filter((city) => city.province_id === provinceId);
    return filteredCities
}



export const useCities = (provinceId: string) => {
    return useQuery({
        queryKey: ["cities", provinceId],
        queryFn: () => cities(provinceId),
        enabled: !!provinceId, // Solo se ejecuta si hay un provinceId
    });
};