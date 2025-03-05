import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getConsumptionSensors } from '@/api/index';
import ConsumptionSensorModalForm from '@/components/sensors/consumption_sensor/ConsumptionSensorModalForm';
import ConsumptionSensorDetails from '@/components/sensors/consumption_sensor/ConsumptionSensorDetails';


export default function ConsumptionSensorsView() {

    const { data: user } = useAuth();
    const { data } = useQuery({ queryKey: ['consumption_sensors'], queryFn: getConsumptionSensors });
    const [isNewModalOpen, setIsNewModalOpen] = useState(false);

    if (data && user) return (
        <>
            <div className='flex justify-between'>
                <h2 className='text-3xl font-black text-gray-800'>Sensores de consumos</h2>
                <button
                    className="bg-blue-600 px-10 py-3 text-white uppercase font-bold text-xs text-center rounded-lg"
                    onClick={() => setIsNewModalOpen(true)}
                >
                    Nuevo
                </button>
            </div>

            <ConsumptionSensorModalForm open={isNewModalOpen} setOpen={setIsNewModalOpen} />

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
                        {data.map(sensor => (
                            <ConsumptionSensorDetails key={sensor.id} sensor={sensor} />
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}