
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toast } from 'react-toastify';
import ConfirmationDialog from '@/components/ConfirmationDialog'; // Importa el nuevo componente
import { Country } from '@/types/geographics/countries';
import { deleteCountry } from '@/api/index';
import CountriesModalForm from './countriesModalForm';

type CountryDetailsProps = { country: Country };

export default function CountryDetails({ country }: CountryDetailsProps) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // Estado para el diálogo de confirmación
    const queryClient = useQueryClient();

    // Mutación para eliminar un tipo
    const { mutate: deleteMutation } = useMutation({
        mutationFn: deleteCountry,
        onError: (error: { message: string }) => {
            toast.error(error.message); // Mostrar toast de error
        },
        onSuccess: (data: { message: string }) => {
            toast.success(data?.message || "País eliminado correctamente"); // Mostrar toast de éxito
            queryClient.invalidateQueries({ queryKey: ['countries'] }); // Actualizar la lista de Paises
        },
    });

    // Función para manejar la eliminación
    const handleDelete = () => {
        setIsDeleteDialogOpen(true); // Abrir el diálogo de confirmación
    };

    // Función para confirmar la eliminación
    const confirmDelete = () => {
        deleteMutation(country.id); // Llamar a la mutación para eliminar
        setIsDeleteDialogOpen(false); // Cerrar el diálogo
    };

    return (
        <>
            <tr className="border-b">
                <td className="p-4 text-lg text-gray-800 w-4/5">{country.name}</td>
                <td className="p-2 text-lg text-gray-800 w-1/5">
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

            {/* Diálogo de confirmación */}
            <ConfirmationDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={confirmDelete}
                title="Eliminar País"
                message={`¿Estás seguro de eliminar el país "${country.name}"?`}
            />

            {/* Modal de edición */}
            <CountriesModalForm open={isEditModalOpen} setOpen={setIsEditModalOpen} country={country} />
        </>
    );
}