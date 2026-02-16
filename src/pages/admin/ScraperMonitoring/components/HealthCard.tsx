import { ScraperHealthCheck } from '@/types/scraper.types'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/tr'

dayjs.extend(relativeTime)
dayjs.locale('tr')

interface HealthCardProps {
    health: ScraperHealthCheck
    onResetCircuit: () => void
    onResetMetrics: () => void
}

const HealthCard = ({ health, onResetCircuit, onResetMetrics }: HealthCardProps) => {
    const statusConfig = {
        Healthy: { icon: '🟢', text: 'Sağlıklı', bgClass: 'bg-green-50', borderClass: 'border-green-200' },
        Degraded: { icon: '🟡', text: 'Bozulmuş', bgClass: 'bg-yellow-50', borderClass: 'border-yellow-200' },
        Unhealthy: { icon: '🔴', text: 'Sorunlu', bgClass: 'bg-red-50', borderClass: 'border-red-200' }
    }

    const config = statusConfig[health.status]

    return (
        <div className={`${config.bgClass} ${config.borderClass} border rounded-lg p-6`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">{health.siteName}</h3>
                <div className="flex items-center gap-2">
                    <span className="text-2xl">{config.icon}</span>
                    <span className="text-sm font-medium text-gray-600">{config.text}</span>
                </div>
            </div>

            {/* Success Rate */}
            <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Başarı Oranı</span>
                    <span className="text-sm font-bold text-gray-900">{health.successRate.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className={`h-2 rounded-full ${health.successRate >= 90 ? 'bg-green-500' :
                                health.successRate >= 70 ? 'bg-yellow-500' :
                                    'bg-red-500'
                            }`}
                        style={{ width: `${health.successRate}%` }}
                    />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <div className="text-xs text-gray-600">Toplam İstek</div>
                    <div className="text-lg font-semibold text-gray-900">{health.totalRequests.toLocaleString()}</div>
                </div>
                <div>
                    <div className="text-xs text-gray-600">Başarılı</div>
                    <div className="text-lg font-semibold text-green-600">{health.successfulRequests.toLocaleString()}</div>
                </div>
                <div>
                    <div className="text-xs text-gray-600">Başarısız</div>
                    <div className="text-lg font-semibold text-red-600">{health.failedRequests.toLocaleString()}</div>
                </div>
                <div>
                    <div className="text-xs text-gray-600">Ort. Süre</div>
                    <div className="text-lg font-semibold text-gray-900">
                        {parseFloat(health.averageResponseTime.split(':')[2]).toFixed(1)}sn
                    </div>
                </div>
            </div>

            {/* Last Success */}
            <div className="mb-4">
                <div className="text-xs text-gray-600">Son Başarılı Scrape</div>
                <div className="text-sm font-medium text-gray-900">
                    {health.lastSuccessfulScrapeAt
                        ? dayjs(health.lastSuccessfulScrapeAt).fromNow()
                        : 'Hiç'}
                </div>
            </div>

            {/* Circuit Breaker */}
            <div className="border-t border-gray-300 pt-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Circuit Breaker</span>
                    <span className={`text-sm font-bold ${health.isCircuitBreakerOpen ? 'text-red-600' : 'text-green-600'}`}>
                        {health.isCircuitBreakerOpen ? '🔴 Açık' : '✅ Kapalı'}
                    </span>
                </div>
                <div className="text-xs text-gray-600">
                    Ardışık Hata: {health.consecutiveFailures}
                </div>
            </div>

            {/* Error Breakdown */}
            {Object.keys(health.errorsByType).length > 0 && (
                <div className="mb-4">
                    <div className="text-sm font-medium text-gray-700 mb-2">Hata Dağılımı (Son 24 Saat)</div>
                    <div className="space-y-1">
                        {Object.entries(health.errorsByType).map(([type, count]) => (
                            <div key={type} className="flex items-center justify-between text-xs">
                                <span className="text-gray-600">{type}</span>
                                <span className="font-semibold text-gray-900">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
                <button
                    onClick={onResetCircuit}
                    disabled={!health.isCircuitBreakerOpen}
                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                    🔓 CB Sıfırla
                </button>
                <button
                    onClick={onResetMetrics}
                    className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    🔄 Metrikleri Sıfırla
                </button>
            </div>
        </div>
    )
}

export default HealthCard
