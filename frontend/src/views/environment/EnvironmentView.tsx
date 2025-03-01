import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getEnvironments } from '@/api/index';
import EnvironmentDetails from '@/components/environment/EnvironmentDetails';
import EnvironmentModalForm from '@/components/environment/EnvironmentModalForm';

export default function EnvironmentView() {

    const { data: user } = useAuth();
    const { data } = useQuery({ queryKey: ['environments'], queryFn: getEnvironments });
    const [isNewModalOpen, setIsNewModalOpen] = useState(false);

    if (data && user) return (
        <>
            <div className='flex justify-between'>
                <h2 className='text-3xl font-black text-gray-800'>Ambientes</h2>
                <button
                    className="bg-blue-600 px-10 py-3 text-white uppercase font-bold text-xs text-center rounded-lg"
                    onClick={() => setIsNewModalOpen(true)}
                >
                    Nuevo
                </button>
            </div>

            <EnvironmentModalForm open={isNewModalOpen} setOpen={setIsNewModalOpen} />

            <div className='flex justify-between'>
                <table className="w-full mt-5 table-auto">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-4 text-left m-2 w-[25%]">Tipo</th>
                            <th className="p-4 text-left m-2 w-[30%]">Nombre</th>
                            <th className="p-4 text-left m-2 w-[15%]">Ciudad</th>
                            <th className="p-4 text-left m-2 w-[15%]">Dirección</th>
                            <th className="p-4 text-left m-2 w-[5%]">GPS</th>
                            <th className="p-1 m-1 w-[10%]">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(environment => (
                            <EnvironmentDetails key={environment.id} environment={environment} />
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}