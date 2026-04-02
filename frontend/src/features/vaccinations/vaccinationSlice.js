import { createGenericSlice } from '../../app/genericSlice'
import { vaccinationApi } from '../../api'
const { slice, fetchAll, fetchById, create, update, remove } = createGenericSlice('vaccinations', vaccinationApi)
export { fetchAll as fetchVaccinations, fetchById as fetchVaccinationById, create as createVaccination, update as updateVaccination, remove as deleteVaccination }
export default slice.reducer
