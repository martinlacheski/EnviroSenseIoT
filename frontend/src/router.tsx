import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppLayout from './layouts/app/AppLayout'
import DashboardView from './views/dashboard/DashboardView'
import UsersView from './views/users/UsersView'
import CreateUser from './views/users/CreateUser'
import AuthLayout from './layouts/auth/AuthLayout'
import LoginView from './views/auth/LoginView'

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AppLayout />}>
                    <Route path='/' element={<DashboardView />} index />
                    <Route path='/users' element={<UsersView />} />
                    <Route path='/users/create' element={<CreateUser />} />
                </Route>
                <Route element={<AuthLayout />}>
                    <Route path='/login' element={<LoginView />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

