import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import ConfirmationDialog from '@/components/common/ConfirmationDialog'; // Importa el nuevo componente
import { NutrientType } from '@/types/index';
import { deleteNutrientType } from '@/api/sensors/NutrientTypesAPI';
import NutrientTypeModalForm from './NutrientTypesModalForm';
import { PencilIcon, TrashIcon } from '@heroicons/react/20/solid';

type NutrientTypeDetailsProps = { type: NutrientType };

export default function NutrientTypeDetails({ type }: NutrientTypeDetailsProps) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // Estado para el diálogo de confirmación
    const queryClient = useQueryClient();

    // Mutación para eliminar un tipo
    const { mutate: deleteMutation } = useMutation({
        mutationFn: deleteNutrientType,
        onError: (error: { message: string }) => {
            toast.error(error.message); // Mostrar toast de error
        },
        onSuccess: (data: { message: string }) => {
            toast.success(data?.message || "Tipo eliminado correctamente"); // Mostrar toast de éxito
            queryClient.invalidateQueries({ queryKey: ['nutrient_types'] }); // Actualizar la lista de tipos
        },
    });

    // Función para manejar la eliminación
    const handleDelete = () => {
        setIsDeleteDialogOpen(true); // Abrir el diálogo de confirmación
    };

    // Función para confirmar la eliminación
    const confirmDelete = () => {
        deleteMutation(type.id); // Llamar a la mutación para eliminar
        setIsDeleteDialogOpen(false); // Cerrar el diálogo
    };

    return (
        <>
            <tr className="border-b">
                <td className="p-4 text-lg text-gray-800 w-4/5">{type.name}</td>
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

            {/* Diálogo de confirmación */}
            <ConfirmationDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={confirmDelete}
                title="Eliminar Tipo de Nutriente"
                message={`¿Estás seguro de eliminar el tipo de nutriente "${type.name}"?`}
            />

            {/* Modal de edición */}
            <NutrientTypeModalForm open={isEditModalOpen} setOpen={setIsEditModalOpen} type={type} />
        </>
    );
}