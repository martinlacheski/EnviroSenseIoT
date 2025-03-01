import { useQuery } from "@tanstack/react-query";
import { getProvinces } from "../api";


// Obtener la lista de provincias
async function provinces(countryId: string) {
    const provincesList = await getProvinces()
    // Filtrar provincias por país seleccionado
    const filteredProvinces = provincesList?.filter((province) => province.country_id === countryId);
    return filteredProvinces
}



export const useProvinces = (countryId: string) => {
    return useQuery({
        queryKey: ["provinces", countryId],
        queryFn: () => provinces(countryId),
        enabled: !!countryId, // Solo se ejecuta si hay un countryId
    });
};