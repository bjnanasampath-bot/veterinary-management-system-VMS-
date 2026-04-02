import { createGenericSlice } from '../../app/genericSlice'
import { doctorApi } from '../../api'
const { slice, fetchAll, fetchById, create, update, remove } = createGenericSlice('doctors', doctorApi)
export { fetchAll as fetchDoctors, fetchById as fetchDoctorById, create as createDoctor, update as updateDoctor, remove as deleteDoctor }
export default slice.reducer
