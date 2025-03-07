import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import DashboardView from './views/dashboard/DashboardView'
import UsersView from './views/users/UsersView'
import AuthLayout from './layouts/AuthLayout'
import LoginView from './views/auth/LoginView'
import CurrentUserView from './views/user/CurrentUserView'
import ProfileLayout from './layouts/ProfileLayout'
import ChangePasswordView from './views/user/ChangePasswordView'
import EnvironmentTypesView from './views/environment_types/EnvironmentTypesView'
import CountriesView from './views/geographics/CountriesView'
import ProvincesView from './views/geographics/ProvincesView'
import CitiesView from './views/geographics/CitiesView'
import RoleTypesView from './views/role_types/RoleTypesView'
import NutrientTypesView from './views/devices/nutrient_types/NutrientTypesView'
import CompanyView from './views/company/CompanyView'
import EnvironmentView from './views/environment/EnvironmentView'
import EnvironmentalSensorsView from './views/devices/environmental_sensors/EnvironmentalSensorsView'
import NutrientSolutionSensorsView from './views/devices/nutrient_solution_sensors/NutrientSolutionSensorsView'
import ConsumptionSensorsView from './views/devices/consumption_sensors/ConsumptionSensorsView'
import ActuatorsView from './views/devices/actuators/ActuatorsView'

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AppLayout />}>
                    <Route path='/' element={<DashboardView />} index />
                    <Route path='/users' element={<UsersView />} />
                    <Route path='/roles' element={<RoleTypesView />} />
                    <Route path='/environments/types/' element={<EnvironmentTypesView />} />
                    <Route path='/countries' element={<CountriesView />} />
                    <Route path='/provinces' element={<ProvincesView />} />
                    <Route path='/cities' element={<CitiesView />} />
                    <Route path='/company' element={<CompanyView />} />
                    <Route path='/environments' element={<EnvironmentView />} />
                    <Route path='/nutrients/types/' element={<NutrientTypesView />} />
                    <Route path='/actuators/' element={<ActuatorsView />} />
                    <Route path='/sensors/consumption/' element={<ConsumptionSensorsView />} />
                    <Route path='/sensors/environmental/' element={<EnvironmentalSensorsView />} />
                    <Route path='/sensors/nutrient/solution/' element={<NutrientSolutionSensorsView />} />
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

