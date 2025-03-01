import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import ConfirmationDialog from '@/components/common/ConfirmationDialog'; // Importa el nuevo componente
import { PencilIcon, TrashIcon, MapPinIcon } from '@heroicons/react/20/solid'; // Importa el ícono de GPS
import { Environment } from '@/types/environment/environment';
import EnvironmentModalForm from './EnvironmentModalForm';
import { deleteEnvironment, getCities, getTypes } from '@/api/index';

type EnvironmentDetailsProps = { environment: Environment };

export default function EnvironmentTypeDetails({ environment }: EnvironmentDetailsProps) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // Estado para el diálogo de confirmación
    const queryClient = useQueryClient();

    // Obtener la lista de ciudades
    const { data: cities } = useQuery({
        queryKey: ['cities'],
        queryFn: getCities,
    });

    // Obtener la lista de Tipos de Ambientes
    const { data: environment_types } = useQuery({
        queryKey: ['environment_types'],
        queryFn: getTypes,
    });

    // Mutación para eliminar un ambiente
    const { mutate: deleteMutation } = useMutation({
        mutationFn: deleteEnvironment,
        onError: (error: { message: string }) => {
            toast.error(error.message); // Mostrar toast de error
        },
        onSuccess: (data: { message: string }) => {
            toast.success(data?.message || "Ambiente eliminado correctamente"); // Mostrar toast de éxito
            queryClient.invalidateQueries({ queryKey: ['environments'] }); // Actualizar la lista de ambientes
        },
    });

    // Función para manejar la eliminación
    const handleDelete = () => {
        setIsDeleteDialogOpen(true); // Abrir el diálogo de confirmación
    };

    // Función para confirmar la eliminación
    const confirmDelete = () => {
        deleteMutation(environment.id); // Llamar a la mutación para eliminar
        setIsDeleteDialogOpen(false); // Cerrar el diálogo
    };

    // Buscar el nombre de la ciudad correspondiente al city_id
    const city = cities?.find((city) => city.id === environment.city_id);
    const cityName = city?.name || "Ciudad no encontrada";

    // Buscar el nombre del país correspondiente a la provincia
    const typeName = environment_types?.find((environment_type) => environment_type.id === environment?.type_id)?.name || "País no encontrado";

    // Función para construir el enlace de GPS
    const getGpsLink = (gpsLocation: string) => {
        if (gpsLocation.startsWith('http')) {
            // Si es una URL, usarla directamente
            return gpsLocation;
        } else if (gpsLocation.includes(',')) {
            // Si son coordenadas, construir el enlace de Google Maps
            return `https://www.google.com/maps?q=${gpsLocation}`;
        }
        // Si no es válido, devolver un enlace vacío
        return '#';
    };

    return (
        <>
            <tr className="border-b">
                <td className="p-4 text-lg text-gray-800 w-[25%]">{typeName}</td>
                <td className="p-4 text-lg text-gray-800 w-[30%]">{environment.name}</td>
                <td className="p-4 text-lg text-gray-800 w-[15%]">{cityName}</td>
                <td className="p-4 text-lg text-gray-800 w-[15%]">{environment.address}</td>
                <td className="p-4 text-lg text-gray-800 w-[5%]">
                    {/* Botón con ícono de GPS */}
                    <a
                        href={getGpsLink(environment.gps_location)} // Enlace dinámico
                        target="_blank" // Abrir en una nueva pestaña
                        rel="noopener noreferrer" // Seguridad para abrir enlaces externos
                        className="inline-flex items-center justify-center p-2 bg-blue-100 rounded-lg hover:bg-blue-200"
                    >
                        <MapPinIcon className="h-5 w-5 text-blue-600" /> {/* Ícono de GPS */}
                    </a>
                </td>
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

            {/* Diálogo de confirmación */}
            <ConfirmationDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={confirmDelete}
                title="Eliminar Ambiente"
                message={`¿Estás seguro de eliminar el  "${environment.name}"?`}
            />

            <EnvironmentModalForm open={isEditModalOpen} setOpen={setIsEditModalOpen} type={environment} />
        </>
    );
}