import { Link, Navigate, Outlet } from "react-router-dom"
import Logo from "@/components/common/Logo"
import NavMenu from "@/components/common/NavMenu"
import { useAuth } from "@/hooks/useAuth"
import { ToastContainer } from "react-toastify"

export default function AppLayout() {

    const { data, isError, isLoading } = useAuth()

    if (isLoading) return 'Cargando...'
    if (isError) {
        return <Navigate to='/login' />
    }

    if (data) return (
        <>
            <header className='bg-gray-800 py-1'>
                <div className=' max-w-screen-2xl mx-auto flex flex-col lg:flex-row justify-between items-center'>
                    <div className='w-16'>
                        <Link to={'/'}>
                            <Logo />
                        </Link>
                    </div>
                    <div className=" bg-gray-800 px-10 py-3 text-white font-bold cursor-pointer transition-colors">
                        <Link to={'/users'}>
                            Usuarios
                        </Link>
                    </div>
                    <div className=" bg-gray-800 px-10 py-3 text-white font-bold cursor-pointer transition-colors">
                        <Link to={'/roles'}>
                            Roles
                        </Link>
                    </div>
                    <div className=" bg-gray-800 px-10 py-3 text-white font-bold cursor-pointer transition-colors">
                        <Link to={'/environments/types/'}>
                            Tipos de ambiente
                        </Link>
                    </div>
                    <div className=" bg-gray-800 px-10 py-3 text-white font-bold cursor-pointer transition-colors">
                        <Link to={'/countries/'}>
                            Paises
                        </Link>
                    </div>
                    <div className=" bg-gray-800 px-10 py-3 text-white font-bold cursor-pointer transition-colors">
                        <Link to={'/provinces/'}>
                            Provincias
                        </Link>
                    </div>
                    <div className=" bg-gray-800 px-10 py-3 text-white font-bold cursor-pointer transition-colors">
                        <Link to={'/cities/'}>
                            Ciudades
                        </Link>
                    </div>
                    <div className=" bg-gray-800 px-10 py-3 text-white font-bold cursor-pointer transition-colors">
                        <Link to={'/company/'}>
                            Empresa
                        </Link>
                    </div>
                    <div className=" bg-gray-800 px-10 py-3 text-white font-bold cursor-pointer transition-colors">
                        <Link to={'/environments/'}>
                            Ambientes
                        </Link>
                    </div>                    
                    <div className=" bg-gray-800 px-10 py-3 text-white font-bold cursor-pointer transition-colors">
                        <Link to={'/nutrients/types/'}>
                            Tipos de nutrientes
                        </Link>
                    </div>
                    <NavMenu
                        username={data.username}
                    />
                </div>
            </header>

            <section className='max-w-screen-2xl mx-auto p-5'>
                <Outlet />
            </section>

            <footer className='py-1'>
                <p className='text-center'>
                    Todos los derechos reservados {new Date().getFullYear()}
                </p>
            </footer>
            {<ToastContainer
                pauseOnHover={false}
                pauseOnFocusLoss={false}
            />}
        </>

    )
}