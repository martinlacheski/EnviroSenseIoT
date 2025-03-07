import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getActuators } from '@/api/index';
import ActuatorModalForm from '@/components/devices/actuator/ActuatorModalForm';
import ActuatorDetails from '@/components/devices/actuator/ActuatorDetails';


export default function ActuatorsView() {

    const { data: user } = useAuth();
    const { data } = useQuery({ queryKey: ['actuators'], queryFn: getActuators });
    const [isNewModalOpen, setIsNewModalOpen] = useState(false);

    if (data && user) return (
        <>
            <div className='flex justify-between'>
                <h2 className='text-3xl font-black text-gray-800'>Actuadores</h2>
                <button
                    className="bg-blue-600 px-10 py-3 text-white uppercase font-bold text-xs text-center rounded-lg"
                    onClick={() => setIsNewModalOpen(true)}
                >
                    Nuevo
                </button>
            </div>

            <ActuatorModalForm open={isNewModalOpen} setOpen={setIsNewModalOpen} />

            <div className='flex justify-between'>
                <table className="w-full mt-5 table-auto">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-4 text-left m-2 w-[50%]">Descripción</th>
                            <th className="p-4 text-left m-2w-[40%]">Ambiente</th>
                            <th className="p-1 m-1 w-[10%]">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(actuator => (
                            <ActuatorDetails key={actuator.id} actuator={actuator} />
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}