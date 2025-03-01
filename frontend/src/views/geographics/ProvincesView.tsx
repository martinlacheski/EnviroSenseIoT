import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProvinces } from '@/api/geographic/ProvincesAPI';
import ProvincesModalForm from '@/components/geographics/provinces/provincesModalForm';
import ProvinceDetails from '@/components/geographics/provinces/provincesDetails';


export default function Provinces() {

    const { data: user } = useAuth();
    const { data } = useQuery({ queryKey: ['provinces'], queryFn: getProvinces });
    const [isNewModalOpen, setIsNewModalOpen] = useState(false);

    if (data && user) return (
        <>
            <div className='flex justify-between'>
                <h2 className='text-3xl font-black text-gray-800'>Provincias</h2>
                <button
                    className="bg-blue-600 px-10 py-3 text-white uppercase font-bold text-xs text-center rounded-lg"
                    onClick={() => setIsNewModalOpen(true)}
                >
                    Nuevo
                </button>
            </div>

            <ProvincesModalForm open={isNewModalOpen} setOpen={setIsNewModalOpen} />


            <div className='flex justify-between'>
                <table className="w-full mt-5 table-auto">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-4 text-left m-2 w-2/5">Provincia</th>
                            <th className="p-4 text-left m-2 w-2/5">País</th>
                            <th className="p-1 m-1 w-1/5">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(province => (
                            <ProvinceDetails key={province.id} province={province} />
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}