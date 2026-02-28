import { ScraperHealthCheck, HealthStatus } from '@/types/scraper.types'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/tr'

dayjs.extend(relativeTime)
dayjs.locale('tr')

interface HealthTableProps {
    data: ScraperHealthCheck[]
    onRefresh: () => void
}

const HealthTable = ({ data, onRefresh }: HealthTableProps) => {
    const getStatusBadge = (status: HealthStatus) => {
        const badges: Record<string, { icon: string; text: string; class: string }> = {
            Healthy: { icon: '🟢', text: 'Sağlıklı', class: 'bg-green-100 text-green-800' },
            Degraded: { icon: '🟡', text: 'Bozulmuş', class: 'bg-yellow-100 text-yellow-800' },
            Unhealthy: { icon: '🔴', text: 'Sorunlu', class: 'bg-red-100 text-red-800' }
        }
        const badge = badges[status] ?? { icon: '⚪', text: status ?? 'Bilinmiyor', class: 'bg-gray-100 text-gray-600' }
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.class}`}>
                <span className="mr-1">{badge.icon}</span>
                {badge.text}
            </span>
        )
    }

    const formatDuration = (duration: string) => {
        // Duration comes as "00:00:02.5000000" format
        const match = duration.match(/(\d+):(\d+):(\d+)/)
        if (!match) return duration

        const [, hours, minutes, seconds] = match
        const h = parseInt(hours)
        const m = parseInt(minutes)
        const s = parseFloat(seconds)

        if (h > 0) return `${h}sa ${m}dk`
        if (m > 0) return `${m}dk ${s.toFixed(1)}sn`
        return `${s.toFixed(1)}sn`
    }

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Site Durumları</h3>
                <button
                    onClick={onRefresh}
                    className="text-sm text-purple-600 hover:text-purple-800 font-medium"
                >
                    🔄 Yenile
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Site
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Durum
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Başarı Oranı
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Ort. Süre
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Son Başarılı
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                    Henüz veri yok
                                </td>
                            </tr>
                        ) : (
                            data.map((health) => (
                                <tr key={health.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="text-sm font-medium text-gray-900">
                                                {health.siteName}
                                            </div>
                                            {health.isCircuitBreakerOpen && (
                                                <span className="ml-2 text-xs">⛔</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getStatusBadge(health.status)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                                                <div
                                                    className={`h-2 rounded-full ${health.successRate >= 90 ? 'bg-green-500' :
                                                        health.successRate >= 70 ? 'bg-yellow-500' :
                                                            'bg-red-500'
                                                        }`}
                                                    style={{ width: `${health.successRate}%` }}
                                                />
                                            </div>
                                            <span className="text-sm text-gray-900">
                                                {health.successRate.toFixed(1)}%
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDuration(health.averageResponseTime)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {health.lastSuccessfulScrapeAt
                                            ? dayjs(health.lastSuccessfulScrapeAt).fromNow()
                                            : 'Hiç'}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default HealthTable
