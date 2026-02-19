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
import { masterColorService } from '@/services/api/colors';
import type { MasterColor } from '@/types/color';
import type { PaginatedResponse } from '@/types/common/base.types';
import {
    Search,
    Plus,
    Edit,
    Trash2,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import UnmappedColorsSection from '@/components/colors/UnmappedColorsSection';
import ColorFormDialog from '@/components/colors/ColorFormDialog';
import ColorDetailsDialog from '@/components/colors/ColorDetailsDialog';

const ColorsPage = () => {
    const [paginatedData, setPaginatedData] = useState<PaginatedResponse<MasterColor>>({
        items: [],
        totalCount: 0,
        pageNumber: 1,
        pageSize: 20,
        totalPages: 0,
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize] = useState(20);
    const [selectedColor, setSelectedColor] = useState<MasterColor | null>(null);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

    const { showLoading, hideLoading } = useLoading();
    const { success, error } = useNotification();

    useEffect(() => {
        loadColors();
    }, [pageNumber, searchQuery]);

    const loadColors = async () => {
        showLoading('Renkler yükleniyor...');
        try {
            const data = await masterColorService.getList({
                pageNumber,
                pageSize,
                searchTerm: searchQuery || undefined,
                sortBy: 'name',
                sortDescending: false,
            });
            setPaginatedData(data);
        } catch (err) {
            error('Renkler yüklenirken hata oluştu');
            console.error(err);
        } finally {
            hideLoading();
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`"${name}" rengini silmek istediğinizden emin misiniz?`)) {
            return;
        }

        showLoading('Renk siliniyor...');
        try {
            await masterColorService.delete(id);
            success('Renk başarıyla silindi');
            loadColors();
        } catch (err) {
            error('Renk silinirken hata oluştu');
            console.error(err);
        } finally {
            hideLoading();
        }
    };

    const handleViewDetails = async (color: MasterColor) => {
        showLoading('Renk detayları yükleniyor...');
        try {
            const fullColor = await masterColorService.getById(color.id);
            if (fullColor) {
                setSelectedColor(fullColor);
                setIsDetailsDialogOpen(true);
            }
        } catch (err) {
            error('Renk detayları yüklenirken hata oluştu');
            console.error(err);
        } finally {
            hideLoading();
        }
    };

    const handleEdit = (color: MasterColor) => {
        setSelectedColor(color);
        setIsEditDialogOpen(true);
    };

    return (
        <div className="space-y-6">
            {/* Floating Action Button */}
            <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="fixed bottom-8 right-8 z-50 h-14 w-14 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-2xl hover:shadow-purple-500/50 transition-all hover:scale-110"
                size="icon"
            >
                <Plus className="h-6 w-6" />
            </Button>

            <Tabs defaultValue="master-colors" className="w-full">
                <TabsList className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-lg p-1">
                    <TabsTrigger
                        value="master-colors"
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-purple-700 data-[state=active]:text-white"
                    >
                        Master Renkler
                    </TabsTrigger>
                    <TabsTrigger
                        value="unmapped-colors"
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-purple-700 data-[state=active]:text-white"
                    >
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Eşleşmemiş Renkler
                    </TabsTrigger>
                </TabsList>

                {/* ─── Master Colors Tab ─── */}
                <TabsContent value="master-colors" className="space-y-4">
                    {/* Search Bar */}
                    <Card className="border-white/20 bg-white/80 backdrop-blur-xl shadow-lg">
                        <CardContent className="pt-6">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Renk ara..."
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
                                    Toplam Renk
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {paginatedData.totalCount}
                                </div>
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
                                <div className="text-2xl font-bold">
                                    {paginatedData.items.length}
                                </div>
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

                    {/* Colors Table */}
                    <Card className="border-white/20 bg-white/80 backdrop-blur-xl shadow-xl">
                        <CardContent className="pt-6">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Renk</TableHead>
                                        <TableHead>Kod</TableHead>
                                        <TableHead>Ürün Sayısı</TableHead>
                                        <TableHead>Durum</TableHead>
                                        <TableHead className="text-right">İşlemler</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedData.items.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={5}
                                                className="text-center py-8 text-gray-500"
                                            >
                                                Renk bulunamadı
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        paginatedData.items.map((color) => (
                                            <TableRow
                                                key={color.id}
                                                className="cursor-pointer hover:bg-gray-50"
                                                onClick={() => handleViewDetails(color)}
                                            >
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        {/* Color swatch */}
                                                        <div
                                                            className="h-8 w-8 rounded-md border border-gray-200 flex-shrink-0 shadow-sm"
                                                            style={{
                                                                backgroundColor:
                                                                    color.hexCode || 'transparent',
                                                                backgroundImage: color.hexCode
                                                                    ? undefined
                                                                    : 'repeating-conic-gradient(#ddd 0% 25%, white 0% 50%) 0 0 / 6px 6px',
                                                            }}
                                                            title={color.hexCode || 'Hex kodu yok'}
                                                        />
                                                        <div>
                                                            <div className="font-medium">
                                                                {color.name}
                                                            </div>
                                                            <div className="text-xs text-gray-500">
                                                                {color.normalizedName}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="font-mono text-sm text-gray-600">
                                                        {color.code}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    {color.productCount.toLocaleString()}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex gap-1 flex-wrap">
                                                        {color.isVerified && (
                                                            <Badge variant="default">
                                                                Doğrulanmış
                                                            </Badge>
                                                        )}
                                                        {!color.isActive && (
                                                            <Badge variant="destructive">
                                                                Pasif
                                                            </Badge>
                                                        )}
                                                        {color.isActive && !color.isVerified && (
                                                            <Badge variant="secondary">Aktif</Badge>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell
                                                    className="text-right"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleEdit(color);
                                                            }}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDelete(color.id, color.name);
                                                            }}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>

                            {/* Pagination */}
                            {paginatedData.totalPages > 1 && (
                                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                                    <div className="text-sm text-gray-600">
                                        Toplam {paginatedData.totalCount} renk, sayfa{' '}
                                        {paginatedData.pageNumber} /{' '}
                                        {paginatedData.totalPages}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={pageNumber === 1}
                                            onClick={() => setPageNumber((p) => p - 1)}
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={pageNumber >= paginatedData.totalPages}
                                            onClick={() => setPageNumber((p) => p + 1)}
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ─── Unmapped Colors Tab ─── */}
                <TabsContent value="unmapped-colors">
                    <UnmappedColorsSection onColorMapped={() => loadColors()} />
                </TabsContent>
            </Tabs>

            {/* Create Dialog */}
            <ColorFormDialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
                onSuccess={() => {
                    setIsCreateDialogOpen(false);
                    loadColors();
                }}
            />

            {/* Edit Dialog */}
            {selectedColor && (
                <ColorFormDialog
                    open={isEditDialogOpen}
                    onOpenChange={setIsEditDialogOpen}
                    color={selectedColor}
                    onSuccess={() => {
                        setIsEditDialogOpen(false);
                        setSelectedColor(null);
                        loadColors();
                    }}
                />
            )}

            {/* Details Dialog */}
            {selectedColor && (
                <ColorDetailsDialog
                    open={isDetailsDialogOpen}
                    onOpenChange={setIsDetailsDialogOpen}
                    color={selectedColor}
                    onAlternativeAdded={() => handleViewDetails(selectedColor)}
                />
            )}
        </div>
    );
};

export default ColorsPage;
