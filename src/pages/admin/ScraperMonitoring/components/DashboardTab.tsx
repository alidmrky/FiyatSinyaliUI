import { useEffect, useState } from 'react'
import { scraperApi } from '@/services/api'
import { ScraperHealthCheck, DashboardStats } from '@/types/scraper.types'
import StatCards from './StatCards'
import HealthTable from './HealthTable'

const DashboardTab = () => {
    const [healthData, setHealthData] = useState<ScraperHealthCheck[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchData()
        // Auto-refresh every 30 seconds
        const interval = setInterval(fetchData, 30000)
        return () => clearInterval(interval)
    }, [])

    const fetchData = async () => {
        try {
            setError(null)
            const data = await scraperApi.health.getAll()
            setHealthData(data)
        } catch (err) {
            setError('Veri yüklenirken hata oluştu')
            console.error('Error fetching health data:', err)
        } finally {
            setLoading(false)
        }
    }

    const stats: DashboardStats = {
        healthy: healthData.filter(h => h.status === 'Healthy').length,
        degraded: healthData.filter(h => h.status === 'Degraded').length,
        unhealthy: healthData.filter(h => h.status === 'Unhealthy').length,
        circuitOpen: healthData.filter(h => h.isCircuitBreakerOpen).length,
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">Yükleniyor...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">{error}</p>
                <button
                    onClick={fetchData}
                    className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                >
                    Tekrar Dene
                </button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <StatCards stats={stats} />
            <HealthTable data={healthData} onRefresh={fetchData} />
        </div>
    )
}

export default DashboardTab
