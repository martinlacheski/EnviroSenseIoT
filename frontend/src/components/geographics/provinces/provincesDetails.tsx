import { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'; // Agregar useQuery
import { toast } from 'react-toastify';
import ConfirmationDialog from '@/components/common/ConfirmationDialog';
import { Province } from '@/types/index';
import { deleteProvince } from '@/api/geographic/ProvincesAPI'; // Importar getCountries
import ProvincesModalForm from './provincesModalForm';
import { getCountries } from '@/api/index';
import { PencilIcon, TrashIcon } from '@heroicons/react/20/solid';

type ProvinceDetailsProps = { province: Province };

export default function ProvinceDetails({ province }: ProvinceDetailsProps) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const queryClient = useQueryClient();

    // Obtener la lista de países
    const { data: countries } = useQuery({
        queryKey: ['countries'],
        queryFn: getCountries,
    });

    // Mutación para eliminar una provincia
    const { mutate: deleteMutation } = useMutation({
        mutationFn: deleteProvince,
        onError: (error: { message: string }) => {
            toast.error(error.message);
        },
        onSuccess: (data: { message: string }) => {
            toast.success(data?.message || "Provincia eliminada correctamente");
            queryClient.invalidateQueries({ queryKey: ['provinces'] });
        },
    });

    // Función para manejar la eliminación
    const handleDelete = () => {
        setIsDeleteDialogOpen(true);
    };

    // Función para confirmar la eliminación
    const confirmDelete = () => {
        deleteMutation(province.id);
        setIsDeleteDialogOpen(false);
    };

    // Buscar el nombre del país correspondiente al country_id
    const countryName = countries?.find((country) => country.id === province.country_id)?.name || "País no encontrado";

    return (
        <>
            <tr className="border-b">
                <td className="p-4 text-lg text-gray-800 w-2/5">{province.name}</td>
                <td className="p-4 text-lg text-gray-800 w-2/5">{countryName}</td>
                <td className="p-2 text-lg text-gray-800 w-1/5">
                    <div className="flex justify-center gap-2">
                        <button
                            onClick={() => setIsEditModalOpen(true)}
                            className="bg-gray-100 rounded-lg p-2 uppercase font-bold text-xs text-center w-24 flex items-center justify-center"
                        >
                            <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                            onClick={handleDelete}
                            className="bg-gray-100 rounded-lg p-2 uppercase font-bold text-xs text-center w-24 flex items-center justify-center"
                        >
                            <TrashIcon className="h-5 w-5" />
                        </button>
                    </div>
                </td>
            </tr>
            <ConfirmationDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={confirmDelete}
                title="Eliminar Provincia"
                message={`¿Estás seguro de eliminar la provincia "${province.name}"?`}
            />
            <ProvincesModalForm open={isEditModalOpen} setOpen={setIsEditModalOpen} province={province} />
        </>
    );
}