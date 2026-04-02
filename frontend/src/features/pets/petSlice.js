import { createGenericSlice } from '../../app/genericSlice'
import { petApi } from '../../api'
const { slice, fetchAll, fetchById, create, update, remove } = createGenericSlice('pets', petApi)
export { fetchAll as fetchPets, fetchById as fetchPetById, create as createPet, update as updatePet, remove as deletePet }
export default slice.reducer
