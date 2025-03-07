import { Link, Navigate, Outlet } from "react-router-dom";
import Logo from "@/components/common/Logo";
import NavMenu from "@/components/common/NavMenu";
import { useAuth } from "@/hooks/useAuth";
import { ToastContainer } from "react-toastify";
import { useState } from "react";
import React from "react";

// Componente DropdownMenu para los submenús
const DropdownMenu = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Función para cerrar el menú
    const close = () => {
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-gray-800 px-10 text-white font-bold cursor-pointer transition-colors"
            >
                {title}
            </button>
            {isOpen && (
                <div className="absolute bg-gray-800 mt-2 py-2 w-64 rounded-lg shadow-lg">
                    {/* Pasar la función close a los hijos */}
                    {React.Children.map(children, (child) =>
                        React.cloneElement(child, { close })
                    )}
                </div>
            )}
        </div>
    );
};

// Componente LinkWithClose para manejar el cierre del menú
const LinkWithClose = ({ to, children, close }) => {
    return (
        <Link
            to={to}
            className="block px-4 py-2 text-white"
            onClick={close} // Cerrar el menú al hacer clic
        >
            {children}
        </Link>
    );
};

export default function AppLayout() {
    const { data, isError, isLoading } = useAuth();

    if (isLoading) return 'Cargando...';
    if (isError) {
        return <Navigate to='/login' />;
    }

    if (data) return (
        <>
            <header className='bg-gray-800 py-1'>
                <div className='max-w-screen-2xl mx-auto flex flex-col lg:flex-row justify-between items-center'>
                    <div className='w-16'>
                        <Link to={'/'}>
                            <Logo />
                        </Link>
                    </div>
                    <DropdownMenu title="Administración">
                        <LinkWithClose to={'/users'} close={close}>
                            Usuarios
                        </LinkWithClose>
                        <LinkWithClose to={'/roles'} close={close}>
                            Roles
                        </LinkWithClose>
                        <LinkWithClose to={'/countries'} close={close}>
                            Países
                        </LinkWithClose>
                        <LinkWithClose to={'/provinces'} close={close}>
                            Provincias
                        </LinkWithClose>
                        <LinkWithClose to={'/cities'} close={close}>
                            Ciudades
                        </LinkWithClose>
                        <LinkWithClose to={'/company'} close={close}>
                            Empresa
                        </LinkWithClose>
                        <LinkWithClose to={'/nutrients/types'} close={close}>
                            Tipos de nutrientes
                        </LinkWithClose>
                    </DropdownMenu>

                    <DropdownMenu title="Ambientes">
                        <LinkWithClose to={'/environments/types'} close={close}>
                            Tipos de ambiente
                        </LinkWithClose>
                        <LinkWithClose to={'/environments'} close={close}>
                            Ambientes
                        </LinkWithClose>
                    </DropdownMenu>

                    <DropdownMenu title="Dispositivos">
                        <LinkWithClose to={'/actuators'} close={close}>
                            Actuadores
                        </LinkWithClose>
                        <LinkWithClose to={'/sensors/consumption'} close={close}>
                            Sensores de Consumos
                        </LinkWithClose>
                        <LinkWithClose to={'/sensors/environmental'} close={close}>
                            Sensores Ambientales
                        </LinkWithClose>
                        <LinkWithClose to={'/sensors/nutrient/solution'} close={close}>
                            Sensores de Solución Nutritiva
                        </LinkWithClose>
                    </DropdownMenu>

                    <NavMenu username={data.username} />
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
            <ToastContainer
                pauseOnHover={false}
                pauseOnFocusLoss={false}
            />
        </>
    );
}