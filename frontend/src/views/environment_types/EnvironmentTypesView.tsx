import { getTypes } from '@/api/environment_types/EnvironmentTypesAPI';
import { useAuth } from '@/hooks/useAuth';
import EnvironmentTypeDetails from '@/components/environment_types/EnvironmentTypesDetails';
import ModalForm from '@/components/environment_types/EnvironmentTypesModalForm';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

export default function Types() {

    const { data: user } = useAuth();
    const { data } = useQuery({ queryKey: ['types'], queryFn: getTypes });
    const [isNewModalOpen, setIsNewModalOpen] = useState(false);

    if (data && user) return (
        <>
            <div className='flex justify-between'>
                <h2 className='text-3xl font-black text-gray-800'>Tipos de ambiente</h2>
                <button
                    className="bg-blue-600 px-10 py-3 text-white uppercase font-bold text-xs text-center rounded-lg"
                    onClick={() => setIsNewModalOpen(true)}
                >
                    Nuevo
                </button>
            </div>

            <ModalForm open={isNewModalOpen} setOpen={setIsNewModalOpen} />

            <div className='flex justify-between'>
                <table className="w-full mt-5 table-auto">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-4 text-left m-2 w-4/5">Nombre</th>
                            <th className="p-1 m-1 w-1/5">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(type => (
                            <EnvironmentTypeDetails key={type.id} type={type} />
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}