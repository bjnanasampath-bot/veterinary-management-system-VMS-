import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import DashboardLayout from '../components/layout/DashboardLayout'
import AuthLayout from '../components/layout/AuthLayout'

import Login from '../features/auth/pages/Login'
import Register from '../features/auth/pages/Register'
import Dashboard from '../features/dashboard/pages/Dashboard'

import PetListPage from '../features/pets/pages/PetListPage'
import PetDetailsPage from '../features/pets/pages/PetDetailsPage'
import AddPetPage from '../features/pets/pages/AddPetPage'
import EditPetPage from '../features/pets/pages/EditPetPage'

import OwnerListPage from '../features/owners/pages/OwnerListPage'
import OwnerDetailsPage from '../features/owners/pages/OwnerDetailsPage'
import AddOwnerPage from '../features/owners/pages/AddOwnerPage'
import EditOwnerPage from '../features/owners/pages/EditOwnerPage'

import DoctorListPage from '../features/doctors/pages/DoctorListPage'
import AddDoctorPage from '../features/doctors/pages/AddDoctorPage'
import EditDoctorPage from '../features/doctors/pages/EditDoctorPage'

import AppointmentListPage from '../features/appointments/pages/AppointmentListPage'
import CreateAppointmentPage from '../features/appointments/pages/CreateAppointmentPage'
import AppointmentDetailsPage from '../features/appointments/pages/AppointmentDetailsPage'

import VaccinationListPage from '../features/vaccinations/pages/VaccinationListPage'
import AddVaccinationPage from '../features/vaccinations/pages/AddVaccinationPage'

import BillListPage from '../features/billing/pages/BillListPage'
import CreateBillPage from '../features/billing/pages/CreateBillPage'
import BillDetailsPage from '../features/billing/pages/BillDetailsPage'

import ReportsDashboard from '../features/reports/pages/ReportsDashboard'

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useSelector(s => s.auth)
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/pets" element={<PetListPage />} />
        <Route path="/pets/add" element={<AddPetPage />} />
        <Route path="/pets/:id" element={<PetDetailsPage />} />
        <Route path="/pets/:id/edit" element={<EditPetPage />} />

        <Route path="/owners" element={<OwnerListPage />} />
        <Route path="/owners/add" element={<AddOwnerPage />} />
        <Route path="/owners/:id" element={<OwnerDetailsPage />} />
        <Route path="/owners/:id/edit" element={<EditOwnerPage />} />

        <Route path="/doctors" element={<DoctorListPage />} />
        <Route path="/doctors/add" element={<AddDoctorPage />} />
        <Route path="/doctors/:id/edit" element={<EditDoctorPage />} />

        <Route path="/appointments" element={<AppointmentListPage />} />
        <Route path="/appointments/create" element={<CreateAppointmentPage />} />
        <Route path="/appointments/:id" element={<AppointmentDetailsPage />} />

        <Route path="/vaccinations" element={<VaccinationListPage />} />
        <Route path="/vaccinations/add" element={<AddVaccinationPage />} />

        <Route path="/billing" element={<BillListPage />} />
        <Route path="/billing/create" element={<CreateBillPage />} />
        <Route path="/billing/:id" element={<BillDetailsPage />} />

        <Route path="/reports" element={<ReportsDashboard />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
