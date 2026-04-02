import { createGenericSlice } from '../../app/genericSlice'
import { billingApi } from '../../api'
const { slice, fetchAll, fetchById, create, update, remove } = createGenericSlice('billing', billingApi)
export { fetchAll as fetchBills, fetchById as fetchBillById, create as createBill, update as updateBill, remove as deleteBill }
export default slice.reducer
