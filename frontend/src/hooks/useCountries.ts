import { useQuery } from "@tanstack/react-query";
import { getCountries } from "../api";

export const useCountries = () => {
    return useQuery({
        queryKey: ["countries"],
        queryFn: getCountries,
    });
};