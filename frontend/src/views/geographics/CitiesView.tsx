import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCities } from '@/api/geographic/CitiesAPI';
import { getCountries } from '@/api/geographic/CountriesAPI'; // Importar la función para obtener países
import CitiesModalForm from '@/components/geographics/cities/citiesModalForm';
import CitiesDetails from '@/components/geographics/cities/citiesDetails';

export default function Cities() {
    const { data: user } = useAuth();
    const { data: cities } = useQuery({ queryKey: ['cities'], queryFn: getCities });
    const { data: countries } = useQuery({ queryKey: ['countries'], queryFn: getCountries }); // Obtener la lista de países
    const [isNewModalOpen, setIsNewModalOpen] = useState(false);

    if (cities && user) return (
        <>
            <div className='flex justify-between'>
                <h2 className='text-3xl font-black text-gray-800'>Ciudades</h2>
                <button
                    className="bg-blue-600 px-10 py-3 text-white uppercase font-bold text-xs text-center rounded-lg"
                    onClick={() => setIsNewModalOpen(true)}
                >
                    Nuevo
                </button>
            </div>

            <CitiesModalForm open={isNewModalOpen} setOpen={setIsNewModalOpen} countries={countries} />

            <div className='flex justify-between'>
                <table className="w-full mt-5 table-auto">
                    <thead className="bg-slate-800 text-white">
                        <tr>
                            <th className="p-4 m-2 text-left w-[26.67%]">Ciudad</th>
                            <th className="p-4 m-2 text-left w-[26.67%]">Provincia</th>
                            <th className="p-4 m-2 text-left w-[26.67%]">País</th>
                            <th className="p-1 m-1 w-[20%]">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cities.map(city => (
                            <CitiesDetails key={city.id} city={city} />
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}