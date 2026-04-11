import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import DashboardLayout from '../components/layout/DashboardLayout'
import AuthLayout from '../components/layout/AuthLayout'
import LandingPage from '../features/landing/pages/LandingPage'
import ServiceInfoPage from '../features/landing/pages/ServiceInfoPage'

import Login from '../features/auth/pages/Login'
import Register from '../features/auth/pages/Register'
import ClientAuthPage from '../features/auth/pages/ClientAuthPage'
import ForgotPassword from '../features/auth/pages/ForgotPassword'
import ResetPassword from '../features/auth/pages/ResetPassword'
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
import DoctorDetailsPage from '../features/doctors/pages/DoctorDetailsPage'
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

import PharmacyListPage from '../features/pharmacy/pages/PharmacyListPage'
import AddPharmacyItem from '../features/pharmacy/pages/AddPharmacyItem'

import PrescriptionListPage from '../features/prescriptions/pages/PrescriptionListPage'
import AddPrescription from '../features/prescriptions/pages/AddPrescription'

import LabTestListPage from '../features/lab_tests/pages/LabTestListPage'
import AddLabTest from '../features/lab_tests/pages/AddLabTest'

import SurgeryListPage from '../features/surgeries/pages/SurgeryListPage'
import AddSurgery from '../features/surgeries/pages/AddSurgery'

import MedicalServicesHub from '../features/treatments/pages/MedicalServicesHub'

function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user } = useSelector(s => s.auth)
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (allowedRoles && !allowedRoles.includes(user?.role)) return <Navigate to="/dashboard" replace />
  return children
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/services/:serviceId" element={<ServiceInfoPage />} />
      
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/client-portal" element={<ClientAuthPage />} />
        <Route path="/register" element={<Navigate to="/client-portal" replace />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Common for all roles but tailored inside */}
        <Route path="/pets" element={<PetListPage />} />
        <Route path="/pets/:id" element={<PetDetailsPage />} />
        <Route path="/appointments" element={<AppointmentListPage />} />
        <Route path="/appointments/:id" element={<AppointmentDetailsPage />} />

        {/* Restricted access */}
        <Route path="/pets/add" element={<ProtectedRoute allowedRoles={['admin', 'doctor', 'client']}><AddPetPage /></ProtectedRoute>} />
        <Route path="/pets/:id/edit" element={<ProtectedRoute allowedRoles={['admin', 'doctor', 'client']}><EditPetPage /></ProtectedRoute>} />

        <Route path="/owners" element={<ProtectedRoute allowedRoles={['admin']}><OwnerListPage /></ProtectedRoute>} />
        <Route path="/owners/add" element={<ProtectedRoute allowedRoles={['admin']}><AddOwnerPage /></ProtectedRoute>} />
        <Route path="/owners/:id" element={<ProtectedRoute allowedRoles={['admin']}><OwnerDetailsPage /></ProtectedRoute>} />
        <Route path="/owners/:id/edit" element={<ProtectedRoute allowedRoles={['admin']}><EditOwnerPage /></ProtectedRoute>} />

        <Route path="/doctors" element={<ProtectedRoute allowedRoles={['admin']}><DoctorListPage /></ProtectedRoute>} />
        <Route path="/doctors/add" element={<ProtectedRoute allowedRoles={['admin']}><AddDoctorPage /></ProtectedRoute>} />
        <Route path="/doctors/:id" element={<ProtectedRoute allowedRoles={['admin']}><DoctorDetailsPage /></ProtectedRoute>} />
        <Route path="/doctors/:id/edit" element={<ProtectedRoute allowedRoles={['admin']}><EditDoctorPage /></ProtectedRoute>} />

        <Route path="/appointments/create" element={<CreateAppointmentPage />} />

        <Route path="/vaccinations" element={<ProtectedRoute allowedRoles={['admin', 'doctor']}><VaccinationListPage /></ProtectedRoute>} />
        <Route path="/vaccinations/add" element={<ProtectedRoute allowedRoles={['admin', 'doctor']}><AddVaccinationPage /></ProtectedRoute>} />

        <Route path="/billing" element={<ProtectedRoute allowedRoles={['admin']}><BillListPage /></ProtectedRoute>} />
        <Route path="/billing/create" element={<ProtectedRoute allowedRoles={['admin']}><CreateBillPage /></ProtectedRoute>} />
        <Route path="/billing/:id" element={<ProtectedRoute allowedRoles={['admin', 'client']}><BillDetailsPage /></ProtectedRoute>} />

        <Route path="/reports" element={<ProtectedRoute allowedRoles={['admin']}><ReportsDashboard /></ProtectedRoute>} />

        <Route path="/pharmacy" element={<ProtectedRoute allowedRoles={['admin', 'doctor']}><PharmacyListPage /></ProtectedRoute>} />
        <Route path="/pharmacy/add" element={<ProtectedRoute allowedRoles={['admin', 'doctor']}><AddPharmacyItem /></ProtectedRoute>} />
        
        <Route path="/medical-services" element={<ProtectedRoute allowedRoles={['admin', 'doctor']}><MedicalServicesHub /></ProtectedRoute>} />
        
        <Route path="/prescriptions" element={<ProtectedRoute allowedRoles={['admin', 'doctor']}><PrescriptionListPage /></ProtectedRoute>} />
        <Route path="/prescriptions/add" element={<ProtectedRoute allowedRoles={['admin', 'doctor']}><AddPrescription /></ProtectedRoute>} />
        
        <Route path="/lab-tests" element={<ProtectedRoute allowedRoles={['admin', 'doctor']}><LabTestListPage /></ProtectedRoute>} />
        <Route path="/lab-tests/add" element={<ProtectedRoute allowedRoles={['admin', 'doctor']}><AddLabTest /></ProtectedRoute>} />
        
        <Route path="/surgeries" element={<ProtectedRoute allowedRoles={['admin', 'doctor']}><SurgeryListPage /></ProtectedRoute>} />
        <Route path="/surgeries/add" element={<ProtectedRoute allowedRoles={['admin', 'doctor']}><AddSurgery /></ProtectedRoute>} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
