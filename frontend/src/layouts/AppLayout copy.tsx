import { Link, Navigate, Outlet } from "react-router-dom";
import Logo from "@/components/common/Logo";
import NavMenu from "@/components/common/NavMenu";
import { useAuth } from "@/hooks/useAuth";
import { ToastContainer } from "react-toastify";
import { useState, useEffect, useRef } from "react";
import React from "react";

// Componente DropdownMenu para los submenús
const DropdownMenu = ({ title, children, isOpen, onClick, onClose }) => {
    const ref = useRef(null);

    // Cerrar el menú al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={onClick}
                className="bg-gray-800 px-10 text-white font-bold cursor-pointer transition-colors"
            >
                {title}
            </button>
            {isOpen && (
                <div className="absolute bg-gray-800 mt-2 py-2 w-48 rounded-lg shadow-lg">
                    {React.Children.map(children, (child) =>
                        React.cloneElement(child, { onClick: onClose })
                    )}
                </div>
            )}
        </div>
    );
};

export default function AppLayout() {
    const { data, isError, isLoading } = useAuth();
    const [openMenu, setOpenMenu] = useState(null); // Estado para rastrear el menú abierto

    // Función para manejar el clic en un menú
    const handleMenuClick = (menu) => {
        if (openMenu === menu) {
            setOpenMenu(null); // Cerrar el menú si ya está abierto
        } else {
            setOpenMenu(menu); // Abrir el menú seleccionado
        }
    };

    // Función para cerrar todos los menús
    const closeAllMenus = () => {
        setOpenMenu(null);
    };

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

                    <DropdownMenu
                        title="Administración"
                        isOpen={openMenu === "Administración"}
                        onClick={() => handleMenuClick("Administración")}
                        onClose={closeAllMenus}
                    >
                        <Link to={'/users'} className="block px-4 py-2 text-white">
                            Usuarios
                        </Link>
                        <Link to={'/roles'} className="block px-4 py-2 text-white">
                            Roles
                        </Link>
                        <Link to={'/countries'} className="block px-4 py-2 text-white">
                            Países
                        </Link>
                        <Link to={'/provinces'} className="block px-4 py-2 text-white">
                            Provincias
                        </Link>
                        <Link to={'/cities'} className="block px-4 py-2 text-white">
                            Ciudades
                        </Link>
                        <Link to={'/company'} className="block px-4 py-2 text-white">
                            Empresa
                        </Link>
                    </DropdownMenu>

                    <DropdownMenu
                        title="Ambientes"
                        isOpen={openMenu === "Ambientes"}
                        onClick={() => handleMenuClick("Ambientes")}
                        onClose={closeAllMenus}
                    >
                        <Link to={'/environments/types'} className="block px-4 py-2 text-white">
                            Tipos de ambiente
                        </Link>
                        <Link to={'/environments'} className="block px-4 py-2 text-white">
                            Ambientes
                        </Link>
                    </DropdownMenu>

                    <DropdownMenu
                        title="Actuadores"
                        isOpen={openMenu === "Actuadores"}
                        onClick={() => handleMenuClick("Actuadores")}
                        onClose={closeAllMenus}
                    >
                        <Link to={'/nutrients/types'} className="block px-4 py-2 text-white">
                            Tipos de nutrientes
                        </Link>
                    </DropdownMenu>

                    <DropdownMenu
                        title="Sensores"
                        isOpen={openMenu === "Sensores"}
                        onClick={() => handleMenuClick("Sensores")}
                        onClose={closeAllMenus}
                    >
                        <Link to={'/sensors/environmental'} className="block px-4 py-2 text-white">
                            Sensores Ambientales
                        </Link>
                        <Link to={'/sensors/nutrient/solution'} className="block px-4 py-2 text-white">
                            Sensores de Solución Nutritiva
                        </Link>
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