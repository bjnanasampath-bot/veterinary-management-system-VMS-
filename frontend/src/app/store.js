import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import petReducer from '../features/pets/petSlice'
import ownerReducer from '../features/owners/ownerSlice'
import doctorReducer from '../features/doctors/doctorSlice'
import appointmentReducer from '../features/appointments/appointmentSlice'
import treatmentReducer from '../features/treatments/treatmentSlice'
import vaccinationReducer from '../features/vaccinations/vaccinationSlice'
import billingReducer from '../features/billing/billingSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    pets: petReducer,
    owners: ownerReducer,
    doctors: doctorReducer,
    appointments: appointmentReducer,
    treatments: treatmentReducer,
    vaccinations: vaccinationReducer,
    billing: billingReducer,
  },
})
