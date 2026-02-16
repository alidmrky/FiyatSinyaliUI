import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Package,
    TrendingUp,
    Users,
    DollarSign,
    Eye,
    Edit,
    Trash2
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

// Mock data
const stats = [
    {
        title: 'Toplam Ürün',
        value: '12,543',
        change: '+12.5%',
        icon: Package,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
    },
    {
        title: 'Aktif Siteler',
        value: '5',
        change: '+2',
        icon: Users,
        color: 'text-green-600',
        bgColor: 'bg-green-100',
    },
    {
        title: 'Günlük Güncelleme',
        value: '8,432',
        change: '+18.2%',
        icon: TrendingUp,
        color: 'text-purple-600',
        bgColor: 'bg-purple-100',
    },
    {
        title: 'Ortalama Fiyat',
        value: '₺1,245',
        change: '-3.1%',
        icon: DollarSign,
        color: 'text-amber-600',
        bgColor: 'bg-amber-100',
    },
]

const recentProducts = [
    {
        id: '1',
        name: 'Erkek Klasik Gömlek',
        brand: 'Beymen',
        category: 'Giyim',
        price: '₺899',
        stock: 'Stokta',
        status: 'active',
        lastUpdate: '2 saat önce',
    },
    {
        id: '2',
        name: 'Kadın Deri Çanta',
        brand: 'Vakko',
        category: 'Aksesuar',
        price: '₺2,450',
        stock: 'Stokta',
        status: 'active',
        lastUpdate: '3 saat önce',
    },
    {
        id: '3',
        name: 'Erkek Spor Ayakkabı',
        brand: 'Boyner',
        category: 'Ayakkabı',
        price: '₺1,299',
        stock: 'Tükendi',
        status: 'inactive',
        lastUpdate: '5 saat önce',
    },
    {
        id: '4',
        name: 'Kadın Elbise',
        brand: 'Zara',
        category: 'Giyim',
        price: '₺599',
        stock: 'Stokta',
        status: 'active',
        lastUpdate: '1 gün önce',
    },
    {
        id: '5',
        name: 'Erkek Kaban',
        brand: 'Mango',
        category: 'Giyim',
        price: '₺1,899',
        stock: 'Stokta',
        status: 'active',
        lastUpdate: '1 gün önce',
    },
]

const chartData = [
    { name: 'Pzt', products: 400 },
    { name: 'Sal', products: 300 },
    { name: 'Çar', products: 600 },
    { name: 'Per', products: 800 },
    { name: 'Cum', products: 500 },
    { name: 'Cmt', products: 700 },
    { name: 'Paz', products: 900 },
]

const AdminPage = () => {
    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-500 mt-1">Genel bakış ve istatistikler</p>
                </div>
                <Button>
                    <Package className="mr-2 h-4 w-4" />
                    Yeni Ürün Ekle
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <div className={`${stat.bgColor} p-2 rounded-lg`}>
                                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">
                                <span className={stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                                    {stat.change}
                                </span>
                                {' '}son 30 günde
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Haftalık Ürün Güncellemeleri</CardTitle>
                    <CardDescription>
                        Son 7 günde güncellenen ürün sayısı
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="products"
                                stroke="#8b5cf6"
                                strokeWidth={2}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Recent Products Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Son Eklenen Ürünler</CardTitle>
                    <CardDescription>
                        Sisteme en son eklenen ürünlerin listesi
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Ürün Adı</TableHead>
                                <TableHead>Marka</TableHead>
                                <TableHead>Kategori</TableHead>
                                <TableHead>Fiyat</TableHead>
                                <TableHead>Stok</TableHead>
                                <TableHead>Durum</TableHead>
                                <TableHead>Son Güncelleme</TableHead>
                                <TableHead className="text-right">İşlemler</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentProducts.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell className="font-medium">{product.name}</TableCell>
                                    <TableCell>{product.brand}</TableCell>
                                    <TableCell>{product.category}</TableCell>
                                    <TableCell className="font-semibold">{product.price}</TableCell>
                                    <TableCell>
                                        <Badge variant={product.stock === 'Stokta' ? 'success' : 'destructive'}>
                                            {product.stock}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                                            {product.status === 'active' ? 'Aktif' : 'Pasif'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {product.lastUpdate}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon">
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

export default AdminPage
