import { createGenericSlice } from '../../app/genericSlice'
import { appointmentApi } from '../../api'
const { slice, fetchAll, fetchById, create, update, remove } = createGenericSlice('appointments', appointmentApi)
export { fetchAll as fetchAppointments, fetchById as fetchAppointmentById, create as createAppointment, update as updateAppointment, remove as deleteAppointment }
export default slice.reducer
