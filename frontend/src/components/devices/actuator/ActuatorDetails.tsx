import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import ConfirmationDialog from '@/components/common/ConfirmationDialog'; // Importa el nuevo componente
import { PencilIcon, TrashIcon } from '@heroicons/react/20/solid';
import { Actuator } from '@/types/index';
import { deleteActuator, getEnvironments } from '@/api/index';
import ActuatorModalForm from './ActuatorModalForm';

type ActuatorDetailsProps = { actuator: Actuator };

export default function ActuatorDetails({ actuator }: ActuatorDetailsProps) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // Estado para el diálogo de confirmación
    const queryClient = useQueryClient();

    // Obtener la lista de Ambientes
    const { data: environments } = useQuery({
        queryKey: ['environments'],
        queryFn: getEnvironments,
    });

    // Mutación para eliminar un actuador
    const { mutate: deleteMutation } = useMutation({
        mutationFn: deleteActuator,
        onError: (error: { message: string }) => {
            toast.error(error.message); // Mostrar toast de error
        },
        onSuccess: (data: { message: string }) => {
            toast.success(data?.message || "Actuador eliminado correctamente"); // Mostrar toast de éxito
            queryClient.invalidateQueries({ queryKey: ['actuators'] }); // Actualizar la lista
        },
    });

    // Función para manejar la eliminación
    const handleDelete = () => {
        setIsDeleteDialogOpen(true); // Abrir el diálogo de confirmación
    };

    // Función para confirmar la eliminación
    const confirmDelete = () => {
        deleteMutation(actuator.id); // Llamar a la mutación para eliminar
        setIsDeleteDialogOpen(false); // Cerrar el diálogo
    };

    // Buscar el nombre del tipo de ambiente
    const EnvironmentName = environments?.find((environment) => environment.id === actuator?.environment_id)?.name || "Tipo de ambiente no encontrado";

    return (
        <>
            <tr className="border-b">
                <td className="p-4 text-lg text-gray-800 w-[50%]">{actuator.description}</td>
                <td className="p-4 text-lg text-gray-800 w-[40%]">{EnvironmentName}</td>
                <td className="p-2 text-lg text-gray-800 w-[10%]">
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
                title="Eliminar Actuador"
                message={`¿Estás seguro de eliminar el Actuador "${actuator.description}"?`}
            />

            <ActuatorModalForm open={isEditModalOpen} setOpen={setIsEditModalOpen} actuator={actuator} />
        </>
    );
}