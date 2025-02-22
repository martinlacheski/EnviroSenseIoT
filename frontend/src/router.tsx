import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import DashboardView from './views/dashboard/DashboardView'
import UsersView from './views/users/UsersView'
import CreateUser from './views/users/CreateUser'
import AuthLayout from './layouts/AuthLayout'
import LoginView from './views/auth/LoginView'
import CurrentUserView from './views/user/CurrentUserView'
import ProfileLayout from './layouts/ProfileLayout'
import ChangePasswordView from './views/user/ChangePasswordView'

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AppLayout />}>
                    <Route path='/' element={<DashboardView />} index />
                    <Route path='/users' element={<UsersView />} />
                    <Route path='/users/create' element={<CreateUser />} />
                    <Route element={<ProfileLayout />}>
                        <Route path='/users/me' element={<CurrentUserView />} />
                        <Route path='/users/me/change/password' element={<ChangePasswordView />} />
                    </Route>
                </Route>
                <Route element={<AuthLayout />}>
                    <Route path='/login' element={<LoginView />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

