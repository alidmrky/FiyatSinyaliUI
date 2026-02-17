import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLoading } from '@/contexts/LoadingContext';
import { useNotification } from '@/contexts/NotificationContext';
import { masterBrandService } from '@/services/api/brands';
import type { MasterBrand, PaginatedResponse } from '@/types/brand';
import { Search, Plus, Edit, Trash2, ExternalLink, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import UnmappedBrandsSection from '@/components/brands/UnmappedBrandsSection';
import BrandFormDialog from '@/components/brands/BrandFormDialog';
import BrandDetailsDialog from '@/components/brands/BrandDetailsDialog';

const BrandsPage = () => {
    const [paginatedData, setPaginatedData] = useState<PaginatedResponse<MasterBrand>>({
        items: [],
        totalCount: 0,
        pageNumber: 1,
        pageSize: 20,
        totalPages: 0,
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize] = useState(20);
    const [selectedBrand, setSelectedBrand] = useState<MasterBrand | null>(null);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

    const { showLoading, hideLoading } = useLoading();
    const { success, error } = useNotification();

    useEffect(() => {
        loadBrands();
    }, [pageNumber, searchQuery]);

    const loadBrands = async () => {
        showLoading('Markalar yükleniyor...');
        try {
            const data = await masterBrandService.getList({
                pageNumber,
                pageSize,
                searchTerm: searchQuery || undefined,
                sortBy: 'name',
                sortDescending: false,
            });
            setPaginatedData(data);
        } catch (err) {
            error('Markalar yüklenirken hata oluştu');
            console.error(err);
        } finally {
            hideLoading();
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`"${name}" markasını silmek istediğinizden emin misiniz?`)) {
            return;
        }

        showLoading('Marka siliniyor...');
        try {
            await masterBrandService.delete(id);
            success('Marka başarıyla silindi');
            loadBrands();
        } catch (err) {
            error('Marka silinirken hata oluştu');
            console.error(err);
        } finally {
            hideLoading();
        }
    };

    const handleViewDetails = async (brand: MasterBrand) => {
        showLoading('Marka detayları yükleniyor...');
        try {
            // Load full brand details with alternatives
            const fullBrand = await masterBrandService.getById(brand.id);
            if (fullBrand) {
                setSelectedBrand(fullBrand);
                setIsDetailsDialogOpen(true);
            }
        } catch (err) {
            error('Marka detayları yüklenirken hata oluştu');
            console.error(err);
        } finally {
            hideLoading();
        }
    };

    const handleEdit = (brand: MasterBrand) => {
        setSelectedBrand(brand);
        setIsEditDialogOpen(true);
    };

    return (
        <div className="space-y-6">
            {/* No need for header here since it's already in AdminLayout top bar */}

            {/* Floating Action Button */}
            <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="fixed bottom-8 right-8 z-50 h-14 w-14 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-2xl hover:shadow-purple-500/50 transition-all hover:scale-110"
                size="icon"
            >
                <Plus className="h-6 w-6" />
            </Button>

            <Tabs defaultValue="master-brands" className="w-full">
                <TabsList className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-lg p-1">
                    <TabsTrigger
                        value="master-brands"
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-purple-700 data-[state=active]:text-white"
                    >
                        Master Markalar
                    </TabsTrigger>
                    <TabsTrigger
                        value="unmapped-brands"
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-purple-700 data-[state=active]:text-white"
                    >
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Eşleşmemiş Markalar
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="master-brands" className="space-y-4">
                    {/* Search Bar */}
                    <Card className="border-white/20 bg-white/80 backdrop-blur-xl shadow-lg">
                        <CardContent className="pt-6">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Marka ara..."
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setPageNumber(1);
                                    }}
                                    className="pl-10"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="border-white/20 bg-white/80 backdrop-blur-xl shadow-lg hover:shadow-xl transition-shadow">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600">
                                    Toplam Marka
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{paginatedData.totalCount}</div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Sayfa {paginatedData.pageNumber} / {paginatedData.totalPages}
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600">
                                    Bu Sayfada
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{paginatedData.items.length}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600">
                                    Sayfa Başına
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{paginatedData.pageSize}</div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Brands Table */}
                    <Card className="border-white/20 bg-white/80 backdrop-blur-xl shadow-xl">
                        <CardContent className="pt-6">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Kod</TableHead>
                                        <TableHead>Marka</TableHead>
                                        <TableHead>Ürün Sayısı</TableHead>
                                        <TableHead>Durum</TableHead>
                                        <TableHead>Aktif</TableHead>
                                        <TableHead>Ülke</TableHead>
                                        <TableHead className="text-right">İşlemler</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedData.items.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                                {searchQuery ? 'Sonuç bulunamadı' : 'Henüz marka eklenmemiş'}
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        paginatedData.items.map((brand) => (
                                            <TableRow key={brand.id}>
                                                <TableCell>
                                                    <span className="font-mono text-sm text-gray-600">{brand.code}</span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        {brand.logoUrl && (
                                                            <img
                                                                src={brand.logoUrl}
                                                                alt={brand.name}
                                                                className="h-8 w-8 rounded object-contain"
                                                            />
                                                        )}
                                                        <div>
                                                            <div className="font-medium">{brand.name}</div>
                                                            {brand.description && (
                                                                <div className="text-sm text-gray-500 line-clamp-1">
                                                                    {brand.description}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{brand.productCount.toLocaleString()}</TableCell>
                                                <TableCell>
                                                    {brand.isVerified ? (
                                                        <Badge variant="default">Doğrulanmış</Badge>
                                                    ) : (
                                                        <Badge variant="secondary">Beklemede</Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {brand.isActive ? (
                                                        <Badge variant="default" className="bg-green-600">Aktif</Badge>
                                                    ) : (
                                                        <Badge variant="destructive">Pasif</Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {brand.countryCode || <span className="text-gray-400">-</span>}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleViewDetails(brand)}
                                                        >
                                                            <ExternalLink className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleEdit(brand)}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDelete(brand.id, brand.name)}
                                                        >
                                                            <Trash2 className="h-4 w-4 text-red-500" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>

                            {/* Pagination Controls */}
                            {paginatedData.totalPages > 1 && (
                                <div className="flex items-center justify-between mt-4 px-2">
                                    <div className="text-sm text-gray-600">
                                        {paginatedData.totalCount} markadan {((paginatedData.pageNumber - 1) * paginatedData.pageSize) + 1} - {Math.min(paginatedData.pageNumber * paginatedData.pageSize, paginatedData.totalCount)} arası gösteriliyor
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setPageNumber(pageNumber - 1)}
                                            disabled={pageNumber === 1}
                                        >
                                            <ChevronLeft className="h-4 w-4 mr-1" />
                                            Önceki
                                        </Button>
                                        <span className="text-sm text-gray-600">
                                            Sayfa {paginatedData.pageNumber} / {paginatedData.totalPages}
                                        </span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setPageNumber(pageNumber + 1)}
                                            disabled={pageNumber === paginatedData.totalPages}
                                        >
                                            Sonraki
                                            <ChevronRight className="h-4 w-4 ml-1" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="unmapped-brands">
                    <UnmappedBrandsSection onBrandMapped={loadBrands} />
                </TabsContent>
            </Tabs>

            {/* Create Dialog */}
            <BrandFormDialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
                onSuccess={() => {
                    loadBrands();
                    setIsCreateDialogOpen(false);
                }}
            />

            {/* Edit Dialog */}
            {selectedBrand && (
                <BrandFormDialog
                    open={isEditDialogOpen}
                    onOpenChange={setIsEditDialogOpen}
                    brand={selectedBrand}
                    onSuccess={() => {
                        loadBrands();
                        setIsEditDialogOpen(false);
                        setSelectedBrand(null);
                    }}
                />
            )}

            {/* Details Dialog */}
            {selectedBrand && (
                <BrandDetailsDialog
                    open={isDetailsDialogOpen}
                    onOpenChange={setIsDetailsDialogOpen}
                    brand={selectedBrand}
                    onAlternativeAdded={loadBrands}
                />
            )}
        </div>
    );
};

export default BrandsPage;
