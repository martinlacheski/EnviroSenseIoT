import { Type } from '@/types/types/types';
import { useState } from 'react';
import ModalForm from '@/components/ModalForm';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteType } from '@/api/environment_types/EnvironmentTypesAPI';
import { toast } from 'react-toastify';
import ConfirmationDialog from '@/components/ConfirmationDialog'; // Importa el nuevo componente

type TypeDetailsProps = { type: Type };

export default function EnvironmentTypeDetails({ type }: TypeDetailsProps) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // Estado para el diálogo de confirmación
    const queryClient = useQueryClient();

    // Mutación para eliminar un tipo
    const { mutate: deleteMutation } = useMutation({
        mutationFn: deleteType,
        onError: (error: { message: string }) => {
            toast.error(error.message); // Mostrar toast de error
        },
        onSuccess: (data: { message: string }) => {
            toast.success(data?.message || "Tipo eliminado correctamente"); // Mostrar toast de éxito
            queryClient.invalidateQueries({ queryKey: ['types'] }); // Actualizar la lista de tipos
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
            <tr className="border-b ">
                <td className="p-3 text-lg text-gray-800">{type.name}</td>
                <td className="p-3 text-lg text-gray-800">
                    <div className="flex gap-2 items-center">
                        <button
                            onClick={() => setIsEditModalOpen(true)}
                            className='bg-yellow-500 text-white rounded-lg w-full p-2 uppercase font-bold text-xs text-center'
                        >
                            Editar
                        </button>
                        <button
                            onClick={handleDelete}
                            className='bg-red-600 text-white rounded-lg w-full p-2 uppercase font-bold text-xs text-center'
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
                title="Eliminar Tipo de Ambiente"
                message={`¿Estás seguro de eliminar el tipo "${type.name}"?`}
            />

            {/* Modal de edición */}
            <ModalForm open={isEditModalOpen} setOpen={setIsEditModalOpen} type={type} />
        </>
    );
}