
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toast } from 'react-toastify';
import ConfirmationDialog from '@/components/common/ConfirmationDialog'; // Importa el nuevo componente
import { User } from '@/types/index';
import { deleteUser } from '@/api/index';
import UsersModalForm from './usersModalForm';
import { LockClosedIcon, PencilIcon, TrashIcon } from '@heroicons/react/20/solid';
import UsersPasswordModalForm from './usersPasswordModalForm';

type UserDetailsProps = { user: User };

export default function UserDetails({ user }: UserDetailsProps) {
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // Estado para el diálogo de confirmación
    const queryClient = useQueryClient();

    // Mutación para eliminar un Usuario
    const { mutate: deleteMutation } = useMutation({
        mutationFn: deleteUser,
        onError: (error: { message: string }) => {
            toast.error(error.message); // Mostrar toast de error
        },
        onSuccess: (data: { message: string }) => {
            toast.success(data?.message || "Usuario eliminado correctamente"); // Mostrar toast de éxito
            queryClient.invalidateQueries({ queryKey: ['users'] }); // Actualizar la lista de Paises
        },
    });

    // Función para manejar la eliminación
    const handleDelete = () => {
        setIsDeleteDialogOpen(true); // Abrir el diálogo de confirmación
    };

    // Función para confirmar la eliminación
    const confirmDelete = () => {
        deleteMutation(user.id); // Llamar a la mutación para eliminar
        setIsDeleteDialogOpen(false); // Cerrar el diálogo
    };

    return (
        <>
            <tr className="border-b">
                <td className="p-4 text-lg text-gray-800 w-[10%]">{user.username}</td>
                <td className="p-4 text-lg text-gray-800 w-[15%]">{user.name}</td>
                <td className="p-4 text-lg text-gray-800 w-[15%]">{user.surname}</td>
                <td className="p-4 text-lg text-gray-800 w-[20%]">{user.email}</td>
                <td className="p-4 text-lg text-gray-800 w-[10%]">
                    <span
                        className={`inline-block w-16 px-2 py-0.4 rounded-lg text-white text-center ${user.enabled ? "bg-green-500" : "bg-red-500"
                            }`}
                    >
                        {user.enabled ? "Sí" : "No"}
                    </span>
                </td>
                <td className="p-4 text-lg text-gray-800 w-[10%]">
                    <span
                        className={`inline-block w-16 px-2 py-0.4 rounded-lg text-white text-center ${user.is_admin ? "bg-green-500" : "bg-red-500"
                            }`}
                    >
                        {user.is_admin ? "Sí" : "No"}
                    </span>
                </td>
                <td className="p-2 text-lg text-gray-800 w-[15%]">
                    <div className="flex justify-center gap-2">
                        <button
                            onClick={() => setIsPasswordModalOpen(true)}
                            className="bg-gray-100 rounded-lg p-2 uppercase font-bold text-xs text-center w-24 flex items-center justify-center"
                        >
                            <LockClosedIcon className="h-5 w-5" />
                        </button>
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
                title="Eliminar Usuario"
                message={`¿Estás seguro de eliminar el usuario "${user.username}"?`}
            />
            {/* Modal de Contraseña */}
            <UsersPasswordModalForm open={isPasswordModalOpen} setOpen={setIsPasswordModalOpen} user={user} />
            {/* Modal de edición */}
            <UsersModalForm open={isEditModalOpen} setOpen={setIsEditModalOpen} user={user} />
        </>
    );
}