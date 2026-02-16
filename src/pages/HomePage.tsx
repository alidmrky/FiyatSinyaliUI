import { APP_NAME } from '@/constants'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Search, TrendingDown, Bell, BarChart3 } from 'lucide-react'

const HomePage = () => {
    return (
        <div>
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-5xl font-bold mb-4">
                        {APP_NAME}
                    </h1>
                    <p className="text-xl mb-8 opacity-90">
                        Türkiye'nin önde gelen e-ticaret sitelerinden ürün fiyatlarını takip edin
                    </p>
                    <div className="flex gap-2 justify-center max-w-2xl mx-auto">
                        <Input
                            type="text"
                            placeholder="Ürün ara..."
                            className="flex-1 bg-white text-gray-900"
                        />
                        <Button size="lg" className="bg-green-600 hover:bg-green-700">
                            <Search className="mr-2 h-4 w-4" />
                            Ara
                        </Button>
                    </div>
                </div>
            </section>

            {/* Supported Sites */}
            <section className="py-16 px-4 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
                        Desteklenen E-Ticaret Siteleri
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {['Boyner', 'Beymen', 'Vakko', 'Zara', 'Mango'].map((site) => (
                            <Card key={site} className="hover:shadow-lg transition-shadow">
                                <CardContent className="p-6 text-center">
                                    <h3 className="text-xl font-semibold">{site}</h3>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
                        Özellikler
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <Card>
                            <CardHeader>
                                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                                    <BarChart3 className="h-6 w-6 text-purple-600" />
                                </div>
                                <CardTitle>Fiyat Takibi</CardTitle>
                                <CardDescription>
                                    Ürün fiyatlarını gerçek zamanlı olarak takip edin
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                    <Bell className="h-6 w-6 text-green-600" />
                                </div>
                                <CardTitle>Fiyat Alarmları</CardTitle>
                                <CardDescription>
                                    İstediğiniz fiyata düştüğünde bildirim alın
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                                    <TrendingDown className="h-6 w-6 text-amber-600" />
                                </div>
                                <CardTitle>Fiyat Geçmişi</CardTitle>
                                <CardDescription>
                                    Ürünlerin fiyat geçmişini görüntüleyin
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default HomePage
