import { Fragment } from 'react';
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from '@headlessui/react';
import { Bars3Icon } from '@heroicons/react/20/solid';
import { Link } from 'react-router-dom';
import { User } from '../types';
import { useQueryClient } from '@tanstack/react-query';

type NavMenuProps = {
  username: User['username'];
};

export default function NavMenu({ username }: NavMenuProps) {
  const queryClient = useQueryClient();

  const logout = () => {
    localStorage.removeItem('AUTH_TOKEN');
    queryClient.invalidateQueries({ queryKey: ['user'] });
  };

  return (
    <Popover className='relative'>
      {({ close }) => ( // Recibe la función `close` del Popover
        <>
          <PopoverButton className='inline-flex items-center gap-x-1 text-sm font-semibold leading-6 p-1 rounded-lg bg-gray-800'>
            <Bars3Icon className='w-8 h-8 text-white ' />
          </PopoverButton>

          <Transition
            as={Fragment}
            enter='transition ease-out duration-200'
            enterFrom='opacity-0 translate-y-1'
            enterTo='opacity-100 translate-y-0'
            leave='transition ease-in duration-150'
            leaveFrom='opacity-100 translate-y-0'
            leaveTo='opacity-0 translate-y-1'
          >
            <PopoverPanel className='absolute left-1/2 z-10 mt-5 flex w-screen lg:max-w-min -translate-x-1/2 lg:-translate-x-48'>
              <div className='w-full lg:w-56 shrink rounded-xl bg-white p-4 text-sm font-semibold leading-6 text-gray-900 shadow-lg ring-1 ring-gray-900/5'>
                <p className='text-center'>Hola: {username}</p>
                <Link
                  to='/users/me'
                  className='block p-2'
                  onClick={() => close()} // Cierra el Popover al hacer clic
                >
                  Mi Perfil
                </Link>
                <button
                  className='block p-2'
                  type='button'
                  onClick={() => {
                    logout();
                    close(); // Cierra el Popover al hacer clic
                  }}
                >
                  Cerrar Sesión
                </button>
              </div>
            </PopoverPanel>
          </Transition>
        </>
      )}
    </Popover>
  );
}