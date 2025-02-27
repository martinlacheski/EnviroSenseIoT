import { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import ConfirmationDialog from '@/components/ConfirmationDialog';
import { City } from '@/types/index';
import { getProvinces } from '@/api/geographic/ProvincesAPI';
import { getCountries } from '@/api/geographic/CountriesAPI'; // Importar la función para obtener países
import { deleteCity } from '@/api/geographic/CitiesAPI';
import CitiesModalForm from './citiesModalForm';

type CityDetailsProps = { city: City };

export default function ProvinceDetails({ city }: CityDetailsProps) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const queryClient = useQueryClient();

    // Obtener la lista de provincias y países
    const { data: provinces } = useQuery({
        queryKey: ['provinces'],
        queryFn: getProvinces,
    });

    const { data: countries } = useQuery({
        queryKey: ['countries'],
        queryFn: getCountries,
    });

    // Mutación para eliminar una ciudad
    const { mutate: deleteMutation } = useMutation({
        mutationFn: deleteCity,
        onError: (error: { message: string }) => {
            toast.error(error.message);
        },
        onSuccess: (data: { message: string }) => {
            toast.success(data?.message || "Ciudad eliminada correctamente");
            queryClient.invalidateQueries({ queryKey: ['cities'] });
        },
    });

    // Función para manejar la eliminación
    const handleDelete = () => {
        setIsDeleteDialogOpen(true);
    };

    // Función para confirmar la eliminación
    const confirmDelete = () => {
        deleteMutation(city.id);
        setIsDeleteDialogOpen(false);
    };

    // Buscar el nombre de la provincia correspondiente al province_id
    const province = provinces?.find((province) => province.id === city.province_id);
    const provinceName = province?.name || "Provincia no encontrada";

    // Buscar el nombre del país correspondiente a la provincia
    const countryName = countries?.find((country) => country.id === province?.country_id)?.name || "País no encontrado";

    return (
        <>
            <tr className="border-b">
                <td className="p-4 text-lg text-gray-800 w-[26.67%]">{city.name}</td>
                <td className="p-4 text-lg text-gray-800 w-[26.67%]">{provinceName}</td>
                <td className="p-4 text-lg text-gray-800 w-[26.67%]">{countryName}</td>
                <td className="p-1 text-lg text-gray-800 w-[20%]">
                    <div className="flex justify-center gap-2">
                        <button
                            onClick={() => setIsEditModalOpen(true)}
                            className="bg-yellow-500 text-white rounded-lg p-2 uppercase font-bold text-xs text-center w-24"
                        >
                            Editar
                        </button>
                        <button
                            onClick={handleDelete}
                            className="bg-red-600 text-white rounded-lg p-2 uppercase font-bold text-xs text-center w-24"
                        >
                            Eliminar
                        </button>
                    </div>
                </td>
            </tr>
            <ConfirmationDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={confirmDelete}
                title="Eliminar Ciudad"
                message={`¿Estás seguro de eliminar la ciudad "${city.name}"?`}
            />
            <CitiesModalForm open={isEditModalOpen} setOpen={setIsEditModalOpen} city={city} countries={countries} />
        </>
    );
}