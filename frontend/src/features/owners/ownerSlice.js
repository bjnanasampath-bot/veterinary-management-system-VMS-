import { createGenericSlice } from '../../app/genericSlice'
import { ownerApi } from '../../api'
const { slice, fetchAll, fetchById, create, update, remove } = createGenericSlice('owners', ownerApi)
export { fetchAll as fetchOwners, fetchById as fetchOwnerById, create as createOwner, update as updateOwner, remove as deleteOwner }
export default slice.reducer
