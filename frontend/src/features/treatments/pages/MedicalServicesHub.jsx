import { useState } from 'react'
import VaccinationListPage from '../../vaccinations/pages/VaccinationListPage'
import SurgeryListPage from '../../surgeries/pages/SurgeryListPage'
import LabTestListPage from '../../lab_tests/pages/LabTestListPage'
import { Syringe, Scissors, Activity, ClipboardList } from 'lucide-react'

export default function MedicalServicesHub() {
  const [activeTab, setActiveTab] = useState('vaccinations')

  const tabs = [
    { id: 'vaccinations', label: 'Vaccinations', icon: Syringe, component: VaccinationListPage },
    { id: 'surgeries', label: 'Surgeries', icon: Scissors, component: SurgeryListPage },
    { id: 'lab-tests', label: 'Lab Tests', icon: Activity, component: LabTestListPage },
  ]

  const ActiveComponent = tabs.find(t => t.id === activeTab).component

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Medical Services</h1>
          <p className="text-sm text-gray-500">Access vaccinations, surgeries, and lab results in one place</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 p-1.5 bg-gray-100 rounded-2xl w-fit border border-gray-200 shadow-inner">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
              activeTab === tab.id 
                ? 'bg-white text-primary-600 shadow-md transform scale-105' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-4 transition-all duration-300">
        <ActiveComponent isEmbedded={true} />
      </div>
    </div>
  )
}
