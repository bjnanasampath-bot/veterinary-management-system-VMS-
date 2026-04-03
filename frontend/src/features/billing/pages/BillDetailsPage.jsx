import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { billingApi } from '../../../api'
import { Loader } from '../../../components/common'
import { ArrowLeft, Printer, Send, Download } from 'lucide-react'
import toast from 'react-hot-toast'
import html2pdf from 'html2pdf.js'

const STATUS_COLORS = { paid: 'bg-green-100 text-green-700', pending: 'bg-yellow-100 text-yellow-700', partial: 'bg-blue-100 text-blue-700', cancelled: 'bg-red-100 text-red-700' }

export default function BillDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [bill, setBill] = useState(null)
  const [loading, setLoading] = useState(true)
  const [payAmount, setPayAmount] = useState('')
  const [payMethod, setPayMethod] = useState('cash')
  const [paying, setPaying] = useState(false)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    billingApi.getById(id).then(r => setBill(r.data?.data || r.data)).finally(() => setLoading(false))
  }, [id])

  const handlePayment = async () => {
    if (!payAmount || Number(payAmount) <= 0) return toast.error('Enter valid amount')
    setPaying(true)
    try {
      const res = await billingApi.makePayment(id, { paid_amount: payAmount, payment_method: payMethod })
      setBill(res.data?.data || res.data)
      toast.success('Payment recorded!')
      setPayAmount('')
    } catch {
      toast.error('Payment failed')
    } finally {
      setPaying(false)
    }
  }

  const handleSendEmail = async () => {
    setSending(true)
    try {
      await billingApi.sendEmail(id)
      toast.success('Bill sent to client email!')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send email')
    } finally {
      setSending(false)
    }
  }

  const handleDownloadPDF = () => {
    const element = document.getElementById('invoice-download-content')
    const opt = {
      margin:       10,
      filename:     `bill_${bill.bill_number}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }
    html2pdf().set(opt).from(element).save()
  }

  if (loading) return <Loader />
  if (!bill) return <div className="card text-center py-16 text-gray-400">Bill not found</div>

  return (
    <div className="max-w-3xl mx-auto space-y-5 pb-10">
      <div className="flex items-center gap-3 no-print flex-wrap">
        <button onClick={() => navigate('/billing')} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg"><ArrowLeft size={18} /></button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Bill #{bill.bill_number}</h1>
          <p className="text-sm text-gray-500">{new Date(bill.created_at).toLocaleDateString()}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[bill.status] || 'bg-gray-100 text-gray-600'}`}>{bill.status}</span>
        <button onClick={() => window.print()} className="btn-secondary flex items-center gap-2 text-sm"><Printer size={15} /> Print</button>
        <button onClick={handleDownloadPDF} className="btn-secondary flex items-center gap-2 text-sm"><Download size={15} /> Download PDF</button>
        <button onClick={handleSendEmail} disabled={sending} className="btn-primary flex items-center gap-2 text-sm">
          <Send size={15} /> {sending ? 'Sending...' : 'Send to Client'}
        </button>
      </div>

      <div id="invoice-download-content" className="bg-white p-6 sm:p-10 rounded-xl shadow-sm border border-gray-100 print:shadow-none print:border-none print:p-0">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-700">VetCare</h1>
          <p className="text-gray-500 mb-4">Veterinary Management System</p>
          <div className="flex justify-between text-left text-sm pt-4 border-t border-gray-100">
            <div>
              <p className="font-bold text-gray-700">From:</p>
              <p>VetCare Clinic</p>
              <p>123 Pet Lane, City</p>
              <p>Phone: +91 98765 43210</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-700">Invoice:</p>
              <p className="font-medium text-gray-900">#{bill.bill_number}</p>
              <p>Date: {new Date(bill.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
          <div><p className="text-xs text-gray-400 uppercase">Pet</p><p className="font-semibold text-gray-900">{bill.pet_name}</p></div>
          <div><p className="text-xs text-gray-400 uppercase">Owner</p><p className="font-semibold text-gray-900">{bill.owner_name}</p></div>
          <div><p className="text-xs text-gray-400 uppercase">Payment Method</p><p className="capitalize">{bill.payment_method || '—'}</p></div>
          <div><p className="text-xs text-gray-400 uppercase">Due Date</p><p>{bill.due_date || '—'}</p></div>
        </div>

        <table className="w-full text-sm mb-6">
          <thead><tr className="border-b border-gray-200"><th className="text-left py-2 text-gray-500">Description</th><th className="text-center py-2 text-gray-500">Type</th><th className="text-right py-2 text-gray-500">Qty</th><th className="text-right py-2 text-gray-500">Price</th><th className="text-right py-2 text-gray-500">Total</th></tr></thead>
          <tbody className="divide-y divide-gray-100">
            {(bill.items || []).map((item, i) => (
              <tr key={i}><td className="py-3">{item.description}</td><td className="py-3 text-center capitalize text-gray-500">{item.item_type}</td><td className="py-3 text-right">{item.quantity}</td><td className="py-3 text-right">₹{item.unit_price}</td><td className="py-3 text-right font-medium">₹{item.total_price}</td></tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mb-6">
          <div className="w-64 space-y-2 text-sm">
            <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>₹{bill.subtotal}</span></div>
            <div className="flex justify-between text-gray-600"><span>Discount ({bill.discount_percent}%)</span><span>-₹{bill.discount_amount}</span></div>
            <div className="flex justify-between text-gray-600"><span>Tax ({bill.tax_percent}%)</span><span>+₹{bill.tax_amount}</span></div>
            <div className="flex justify-between font-bold text-gray-900 text-base pt-3 mt-1 border-t border-gray-200"><span>Total</span><span>₹{bill.total_amount}</span></div>
            <div className="flex justify-between text-green-600 font-medium"><span>Paid</span><span>₹{bill.paid_amount}</span></div>
            <div className="flex justify-between text-red-500 font-bold p-2 bg-red-50 rounded-md mt-2"><span className="text-red-700">Due</span><span className="text-red-700">₹{bill.due_amount}</span></div>
          </div>
        </div>
        
        <div className="mt-10 pt-6 border-t border-gray-100 text-center text-gray-500 text-sm">
          <p>Thank you for trusting VetCare with your pet's health!</p>
          <p className="mt-1">This is a system generated invoice.</p>
        </div>
      </div>

      {bill.status !== 'paid' && bill.status !== 'cancelled' && (
        <div className="card no-print">
          <h2 className="font-semibold text-gray-800 mb-4">Record Payment</h2>
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-1 block">Amount (₹)</label>
              <input value={payAmount} onChange={e => setPayAmount(e.target.value)} type="number" className="input-field" placeholder="Enter amount" />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-1 block">Payment Method</label>
              <select value={payMethod} onChange={e => setPayMethod(e.target.value)} className="input-field">
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="upi">UPI</option>
                <option value="netbanking">Net Banking</option>
              </select>
            </div>
            <button onClick={handlePayment} disabled={paying} className="btn-primary px-6 py-2.5">{paying ? 'Processing...' : 'Pay'}</button>
          </div>
        </div>
      )}


    </div>
  )
}
