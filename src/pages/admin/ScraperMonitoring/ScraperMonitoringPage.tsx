import { useState } from 'react'
import DashboardTab from './components/DashboardTab'
import HealthTab from './components/HealthTab'

const ScraperMonitoringPage = () => {
    const [activeTab, setActiveTab] = useState('dashboard')

    const tabs = [
        { id: 'dashboard', label: '📊 Genel Bakış', component: DashboardTab },
        { id: 'health', label: '🩺 Sağlık Durumu', component: HealthTab },
    ]

    const ActiveComponent = tabs.find(t => t.id === activeTab)?.component || DashboardTab

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">
                    Scraper İzleme
                </h1>
                <p className="text-gray-600 mt-1">
                    Scraper sağlık durumu, hata logları ve istatistikler
                </p>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${activeTab === tab.id
                                    ? 'border-purple-500 text-purple-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }
              `}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            <div>
                <ActiveComponent />
            </div>
        </div>
    )
}

export default ScraperMonitoringPage
