import { DashboardStats } from '@/types/scraper.types'

interface StatCardsProps {
    stats: DashboardStats
}

const StatCards = ({ stats }: StatCardsProps) => {
    const cards = [
        {
            label: 'Sağlıklı Siteler',
            value: stats.healthy,
            icon: '🟢',
            bgColor: 'bg-green-50',
            textColor: 'text-green-700',
            borderColor: 'border-green-200'
        },
        {
            label: 'Bozulmuş Siteler',
            value: stats.degraded,
            icon: '🟡',
            bgColor: 'bg-yellow-50',
            textColor: 'text-yellow-700',
            borderColor: 'border-yellow-200'
        },
        {
            label: 'Sorunlu Siteler',
            value: stats.unhealthy,
            icon: '🔴',
            bgColor: 'bg-red-50',
            textColor: 'text-red-700',
            borderColor: 'border-red-200'
        },
        {
            label: 'Circuit Breaker Açık',
            value: stats.circuitOpen,
            icon: '⛔',
            bgColor: 'bg-gray-50',
            textColor: 'text-gray-700',
            borderColor: 'border-gray-200'
        }
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card, index) => (
                <div
                    key={index}
                    className={`${card.bgColor} ${card.borderColor} border rounded-lg p-6`}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">{card.label}</p>
                            <p className={`text-3xl font-bold ${card.textColor} mt-2`}>
                                {card.value}
                            </p>
                        </div>
                        <div className="text-4xl">{card.icon}</div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default StatCards
