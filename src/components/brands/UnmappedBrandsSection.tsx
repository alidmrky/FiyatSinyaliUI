import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLoading } from '@/contexts/LoadingContext';
import { useNotification } from '@/contexts/NotificationContext';
import { unmappedBrandService } from '@/services/api/brands';
import type {
    UnmappedBrand,
    UnmappedBrandListRequestDto,
    UnmappedBrandStatus,
} from '@/types/brand';
import { Eye, Trash2 } from 'lucide-react';
import ResolveUnmappedBrandDialog from './ResolveUnmappedBrandDialog';
import dayjs from 'dayjs';

interface UnmappedBrandsSectionProps {
    onBrandMapped: () => void;
}

const UnmappedBrandsSection = ({ onBrandMapped }: UnmappedBrandsSectionProps) => {
    const [unmappedBrands, setUnmappedBrands] = useState<UnmappedBrand[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [pendingCount, setPendingCount] = useState(0);
    const [selectedBrand, setSelectedBrand] = useState<UnmappedBrand | null>(null);
    const [isResolveDialogOpen, setIsResolveDialogOpen] = useState(false);

    const [filters, setFilters] = useState<UnmappedBrandListRequestDto>({
        status: 'Pending',
        pageNumber: 1,
        pageSize: 20,
        sortBy: 'ProductCount',
        sortDescending: true,
    });

    const { showLoading, hideLoading } = useLoading();
    const { success, error } = useNotification();

    useEffect(() => {
        loadUnmappedBrands();
        loadPendingCount();
    }, [filters]);

    const loadUnmappedBrands = async () => {
        showLoading('Eşleşmemiş markalar yükleniyor...');
        try {
            const response = await unmappedBrandService.getList(filters);
            setUnmappedBrands(response.items);
            setTotalCount(response.totalCount);
        } catch (err) {
            error('Eşleşmemiş markalar yüklenirken hata oluştu');
            console.error(err);
        } finally {
            hideLoading();
        }
    };

    const loadPendingCount = async () => {
        try {
            const count = await unmappedBrandService.getPendingCount();
            setPendingCount(count);
        } catch (err) {
            console.error('Pending count error:', err);
        }
    };

    const handleResolve = (brand: UnmappedBrand) => {
        setSelectedBrand(brand);
        setIsResolveDialogOpen(true);
    };

    const handleBulkIgnore = async () => {
        if (
            !confirm(
                'Ürün sayısı 1 veya daha az olan tüm markaları yok saymak istediğinizden emin misiniz?'
            )
        ) {
            return;
        }

        showLoading('Toplu işlem yapılıyor...');
        try {
            const count = await unmappedBrandService.bulkIgnore(1);
            success(`${count} marka yok sayıldı`);
            loadUnmappedBrands();
            loadPendingCount();
            onBrandMapped();
        } catch (err) {
            error('Toplu işlem sırasında hata oluştu');
            console.error(err);
        } finally {
            hideLoading();
        }
    };

    const getStatusBadge = (status: UnmappedBrandStatus) => {
        switch (status) {
            case 'Pending':
                return <Badge variant="secondary">Beklemede</Badge>;
            case 'Approved':
                return <Badge variant="default">Onaylandı</Badge>;
            case 'Rejected':
                return <Badge variant="destructive">Reddedildi</Badge>;
            case 'Ignored':
                return <Badge variant="outline">Yok Sayıldı</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    return (
        <div className="space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Toplam Eşleşmemiş
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalCount}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Beklemede
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">{pendingCount}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Toplam Ürün
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {unmappedBrands
                                .reduce((sum, b) => sum + b.productCount, 0)
                                .toLocaleString()}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Sayfa
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {filters.pageNumber} / {Math.ceil(totalCount / filters.pageSize)}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-wrap gap-4 items-end">
                        <div className="flex-1 min-w-[200px]">
                            <label className="text-sm font-medium mb-2 block">Durum</label>
                            <Select
                                value={filters.status}
                                onValueChange={(value: UnmappedBrandStatus) =>
                                    setFilters({ ...filters, status: value, pageNumber: 1 })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Pending">Beklemede</SelectItem>
                                    <SelectItem value="Approved">Onaylandı</SelectItem>
                                    <SelectItem value="Rejected">Reddedildi</SelectItem>
                                    <SelectItem value="Ignored">Yok Sayıldı</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex-1 min-w-[200px]">
                            <label className="text-sm font-medium mb-2 block">Sıralama</label>
                            <Select
                                value={filters.sortBy}
                                onValueChange={(value: any) =>
                                    setFilters({ ...filters, sortBy: value, pageNumber: 1 })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ProductCount">Ürün Sayısı</SelectItem>
                                    <SelectItem value="BrandName">Marka Adı</SelectItem>
                                    <SelectItem value="FirstSeenDate">İlk Görülme</SelectItem>
                                    <SelectItem value="LastSeenDate">Son Görülme</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex-1 min-w-[150px]">
                            <label className="text-sm font-medium mb-2 block">Sayfa Boyutu</label>
                            <Select
                                value={filters.pageSize.toString()}
                                onValueChange={(value) =>
                                    setFilters({ ...filters, pageSize: parseInt(value), pageNumber: 1 })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="10">10</SelectItem>
                                    <SelectItem value="20">20</SelectItem>
                                    <SelectItem value="50">50</SelectItem>
                                    <SelectItem value="100">100</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button variant="destructive" onClick={handleBulkIgnore}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Toplu Yok Say (≤1 ürün)
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Table */}
            <Card>
                <CardContent className="pt-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Marka Adı</TableHead>
                                <TableHead>Ürün Sayısı</TableHead>
                                <TableHead>Durum</TableHead>
                                <TableHead>Kaynak</TableHead>
                                <TableHead>İlk Görülme</TableHead>
                                <TableHead className="text-right">İşlemler</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {unmappedBrands.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                        Eşleşmemiş marka bulunamadı
                                    </TableCell>
                                </TableRow>
                            ) : (
                                unmappedBrands.map((brand) => (
                                    <TableRow key={brand.id}>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">{brand.brandName}</div>
                                                <div className="text-xs text-gray-500">{brand.normalizedName}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{brand.productCount.toLocaleString()}</TableCell>
                                        <TableCell>{getStatusBadge(brand.status)}</TableCell>
                                        <TableCell>
                                            {brand.source ? (
                                                <Badge variant="outline">{brand.source}</Badge>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {dayjs(brand.firstSeenDate).format('DD.MM.YYYY HH:mm')}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {brand.status === 'Pending' && (
                                                <Button
                                                    variant="default"
                                                    size="sm"
                                                    onClick={() => handleResolve(brand)}
                                                >
                                                    <Eye className="h-4 w-4 mr-1" />
                                                    İncele
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    {totalCount > filters.pageSize && (
                        <div className="flex items-center justify-between mt-4 pt-4 border-t">
                            <div className="text-sm text-gray-600">
                                Toplam {totalCount} sonuçtan {(filters.pageNumber - 1) * filters.pageSize + 1} -{' '}
                                {Math.min(filters.pageNumber * filters.pageSize, totalCount)} arası gösteriliyor
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={filters.pageNumber === 1}
                                    onClick={() =>
                                        setFilters({ ...filters, pageNumber: filters.pageNumber - 1 })
                                    }
                                >
                                    Önceki
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={
                                        filters.pageNumber >= Math.ceil(totalCount / filters.pageSize)
                                    }
                                    onClick={() =>
                                        setFilters({ ...filters, pageNumber: filters.pageNumber + 1 })
                                    }
                                >
                                    Sonraki
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Resolve Dialog */}
            {selectedBrand && (
                <ResolveUnmappedBrandDialog
                    open={isResolveDialogOpen}
                    onOpenChange={setIsResolveDialogOpen}
                    unmappedBrand={selectedBrand}
                    onResolved={() => {
                        loadUnmappedBrands();
                        loadPendingCount();
                        onBrandMapped();
                        setIsResolveDialogOpen(false);
                        setSelectedBrand(null);
                    }}
                />
            )}
        </div>
    );
};

export default UnmappedBrandsSection;
