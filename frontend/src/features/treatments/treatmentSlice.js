import { createGenericSlice } from '../../app/genericSlice'
import { treatmentApi } from '../../api'
const { slice, fetchAll, fetchById, create, update, remove } = createGenericSlice('treatments', treatmentApi)
export { fetchAll as fetchTreatments, fetchById as fetchTreatmentById, create as createTreatment, update as updateTreatment, remove as deleteTreatment }
export default slice.reducer
