import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getNutrientTypes } from '@/api/sensors/NutrientTypesAPI';
import NutrientTypeModalForm from '@/components/sensors/nutrient_types/NutrientTypesModalForm';
import NutrientTypeDetails from '@/components/sensors/nutrient_types/NutrientTypesDetails';

export default function NutrientTypes() {

    const { data: user } = useAuth();
    const { data } = useQuery({ queryKey: ['nutrient_types'], queryFn: getNutrientTypes });
    const [isNewModalOpen, setIsNewModalOpen] = useState(false);

    if (data && user) return (
        <>
            <div className='flex justify-between'>
                <h2 className='text-3xl font-black text-gray-800'>Tipos de nutrientes</h2>
                <button
                    className="bg-blue-600 px-10 py-3 text-white uppercase font-bold text-xs text-center rounded-lg"
                    onClick={() => setIsNewModalOpen(true)}
                >
                    Nuevo
                </button>
            </div>

            <NutrientTypeModalForm open={isNewModalOpen} setOpen={setIsNewModalOpen} />

            <div className='flex justify-between'>
                <table className="w-full mt-5 table-auto">
                    <thead className="bg-slate-800 text-white">
                        <tr>
                            <th className="p-4 text-left m-2 w-4/5">Nombre</th>
                            <th className="p-1 m-1 w-1/5">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(type => (
                            <NutrientTypeDetails key={type.id} type={type} />
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}