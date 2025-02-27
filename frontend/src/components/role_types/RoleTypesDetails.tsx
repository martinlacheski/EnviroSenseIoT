import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import ConfirmationDialog from '@/components/ConfirmationDialog'; // Importa el nuevo componente
import { RoleType } from '@/types/role_types/roleTypes';
import { deleteRoleType } from '@/api/index';
import RoleTypesModalForm from './RoleTypesModalForm';

type RoleTypeDetailsProps = { type: RoleType };

export default function RoleTypeDetails({ type }: RoleTypeDetailsProps) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // Estado para el diálogo de confirmación
    const queryClient = useQueryClient();

    // Mutación para eliminar un tipo de Rol
    const { mutate: deleteMutation } = useMutation({
        mutationFn: deleteRoleType,
        onError: (error: { message: string }) => {
            toast.error(error.message); // Mostrar toast de error
        },
        onSuccess: (data: { message: string }) => {
            toast.success(data?.message || "Tipo de rol eliminado correctamente"); // Mostrar toast de éxito
            queryClient.invalidateQueries({ queryKey: ['roles'] }); // Actualizar la lista de tipos de roles
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
                <td className="p-4 text-lg text-gray-800 w-3/5">{type.name}</td>
                <td className="p-4 text-lg text-gray-800 w-1/5">
                    <span
                        className={`inline-block w-16 px-2 py-0.4 rounded-lg text-white text-center ${type.is_admin ? "bg-green-500" : "bg-red-500"
                            }`}
                    >
                        {type.is_admin ? "Sí" : "No"}
                    </span>
                </td>



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
            <ConfirmationDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={confirmDelete}
                title="Eliminar Tipo de Rol"
                message={`¿Estás seguro de eliminar el tipo de rol "${type.name}"?`}
            />
            <RoleTypesModalForm open={isEditModalOpen} setOpen={setIsEditModalOpen} type={type} />
        </>
    );
}