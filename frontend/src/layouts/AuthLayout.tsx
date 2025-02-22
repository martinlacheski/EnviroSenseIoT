import Logo from '@/components/Logo'
import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

export default function AuthLayout() {
    return (
        <>
            <div className='items-center bg-gray-800 min-h-screen'>
                <div className='items-center py-10 lg:py-20 mx-auto w-[500px] center'>
                    <div className="flex justify-center">
                        <div style={{ transform: "scale(1.5)" }}>
                            <Logo />
                        </div>
                    </div>
                    <div className='mt-10'>
                        <Outlet />
                    </div>
                </div>
            </div>
            {<ToastContainer
                pauseOnHover={false}
                pauseOnFocusLoss={false}
            />}
        </>
    )
}