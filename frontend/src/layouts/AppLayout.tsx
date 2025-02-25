import { Link, Navigate, Outlet } from "react-router-dom"
import Logo from "@/components/Logo"
import NavMenu from "@/components/NavMenu"
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
                    <div className=" bg-gray-800 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors">
                        <Link to={'/users'}>
                            Usuarios
                        </Link>
                    </div>
                    <div className=" bg-gray-800 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors">
                        <Link to={'/environments/types/'}>
                            Tipos de entorno
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