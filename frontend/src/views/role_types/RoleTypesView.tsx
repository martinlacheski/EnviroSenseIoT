import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getRoleTypes } from '@/api/index';
import RoleTypesModalForm from '@/components/role_types/RoleTypesModalForm';
import RoleTypeDetails from '@/components/role_types/RoleTypesDetails';


export default function RoleTypes() {

    const { data: user } = useAuth();
    const { data } = useQuery({ queryKey: ['roles'], queryFn: getRoleTypes });
    const [isNewModalOpen, setIsNewModalOpen] = useState(false);

    if (data && user) return (
        <>
            <div className='flex justify-between'>
                <h2 className='text-3xl font-black text-gray-800'>Roles</h2>
                <button
                    className="bg-blue-600 px-10 py-3 text-white uppercase font-bold text-xs text-center rounded-lg"
                    onClick={() => setIsNewModalOpen(true)}
                >
                    Nuevo
                </button>
            </div>

            <RoleTypesModalForm open={isNewModalOpen} setOpen={setIsNewModalOpen} />


            <div className='flex justify-between'>
                <table className="w-full mt-5 table-auto">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-4 text-left m-2 w-3/5">Nombre</th>
                            <th className="p-4 text-left m-2 w-1/5">Administrador</th>
                            <th className="p-1 m-1 w-1/5">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(role => (
                            <RoleTypeDetails key={role.id} type={role} />
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}