import { useEffect, useState } from 'react'
import { scraperApi } from '@/services/api'
import { ScraperHealthCheck } from '@/types/scraper.types'
import HealthCard from './HealthCard'

const HealthTab = () => {
    const [healthData, setHealthData] = useState<ScraperHealthCheck[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedSite, setSelectedSite] = useState<string>('all')

    useEffect(() => {
        fetchData()
        const interval = setInterval(fetchData, 60000) // Refresh every minute
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

    const handleReset = async (siteName: string, type: 'circuit' | 'metrics') => {
        try {
            if (type === 'circuit') {
                await scraperApi.health.resetCircuitBreaker(siteName)
            } else {
                await scraperApi.health.resetMetrics(siteName)
            }
            // Refresh data
            await fetchData()
        } catch (err) {
            console.error('Error resetting:', err)
            alert('İşlem başarısız oldu')
        }
    }

    const filteredData = selectedSite === 'all'
        ? healthData
        : healthData.filter(h => h.siteName === selectedSite)

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
            {/* Filter */}
            <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">Site:</label>
                <select
                    value={selectedSite}
                    onChange={(e) => setSelectedSite(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                    <option value="all">Tüm Siteler</option>
                    {healthData.map(h => (
                        <option key={h.siteName} value={h.siteName}>
                            {h.siteName}
                        </option>
                    ))}
                </select>
            </div>

            {/* Health Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredData.map((health) => (
                    <HealthCard
                        key={health.id}
                        health={health}
                        onResetCircuit={() => handleReset(health.siteName, 'circuit')}
                        onResetMetrics={() => handleReset(health.siteName, 'metrics')}
                    />
                ))}
            </div>

            {filteredData.length === 0 && (
                <div className="text-center text-gray-500 py-12">
                    Seçilen filtreye uygun veri bulunamadı
                </div>
            )}
        </div>
    )
}

export default HealthTab
