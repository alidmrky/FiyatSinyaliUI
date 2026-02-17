import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
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
import { masterBrandService } from '@/services/api/brands';
import type { MasterBrand, CreateBrandAlternativeDto } from '@/types/brand';
import { Plus, ExternalLink, CheckCircle, XCircle } from 'lucide-react';
import dayjs from 'dayjs';

interface BrandDetailsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    brand: MasterBrand;
    onAlternativeAdded: () => void;
}

const BrandDetailsDialog = ({
    open,
    onOpenChange,
    brand,
    onAlternativeAdded,
}: BrandDetailsDialogProps) => {
    const [isAddingAlternative, setIsAddingAlternative] = useState(false);
    const [newAlternative, setNewAlternative] = useState('');

    const { showLoading, hideLoading } = useLoading();
    const { success, error } = useNotification();

    const handleAddAlternative = async () => {
        if (!newAlternative.trim()) {
            error('Alternatif isim gereklidir');
            return;
        }

        showLoading('Alternatif isim ekleniyor...');
        try {
            const data: CreateBrandAlternativeDto = {
                masterBrandId: brand.id,
                alternativeName: newAlternative.trim(),
                source: 'Manual',
                isAutoMatched: false,
            };

            await masterBrandService.addAlternative(brand.id, data);
            success('Alternatif isim başarıyla eklendi');
            setNewAlternative('');
            setIsAddingAlternative(false);
            onAlternativeAdded();
        } catch (err: any) {
            error(err.message || 'Alternatif isim eklenirken hata oluştu');
            console.error(err);
        } finally {
            hideLoading();
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        {brand.logoUrl && (
                            <img
                                src={brand.logoUrl}
                                alt={brand.name}
                                className="h-12 w-12 rounded object-contain"
                            />
                        )}
                        <div>
                            <DialogTitle>{brand.name}</DialogTitle>
                            <DialogDescription>{brand.normalizedName}</DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Brand Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Marka Bilgileri</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="font-medium">Durum:</span>{' '}
                                    {brand.isVerified ? (
                                        <Badge variant="default" className="ml-2">
                                            <CheckCircle className="h-3 w-3 mr-1" />
                                            Doğrulanmış
                                        </Badge>
                                    ) : (
                                        <Badge variant="secondary" className="ml-2">
                                            <XCircle className="h-3 w-3 mr-1" />
                                            Beklemede
                                        </Badge>
                                    )}
                                </div>
                                <div>
                                    <span className="font-medium">Ürün Sayısı:</span>{' '}
                                    {brand.productCount.toLocaleString()}
                                </div>
                                {brand.countryCode && (
                                    <div>
                                        <span className="font-medium">Ülke:</span> {brand.countryCode}
                                    </div>
                                )}
                                {brand.website && (
                                    <div>
                                        <span className="font-medium">Website:</span>{' '}
                                        <a
                                            href={brand.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline inline-flex items-center gap-1"
                                        >
                                            Link <ExternalLink className="h-3 w-3" />
                                        </a>
                                    </div>
                                )}
                            </div>
                            {brand.description && (
                                <div className="pt-2 border-t">
                                    <span className="font-medium">Açıklama:</span>
                                    <p className="text-gray-600 mt-1">{brand.description}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Alternatives */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                            <CardTitle className="text-base">
                                Alternatif İsimler ({brand.alternatives?.length || 0})
                            </CardTitle>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setIsAddingAlternative(!isAddingAlternative)}
                            >
                                <Plus className="h-4 w-4 mr-1" />
                                Ekle
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Add Alternative Form */}
                            {isAddingAlternative && (
                                <div className="flex gap-2 p-3 bg-gray-50 rounded-lg">
                                    <div className="flex-1">
                                        <Label htmlFor="new-alternative" className="text-xs mb-1">
                                            Yeni Alternatif İsim
                                        </Label>
                                        <Input
                                            id="new-alternative"
                                            value={newAlternative}
                                            onChange={(e) => setNewAlternative(e.target.value)}
                                            placeholder="Örn: NIKE AIR, nike türkiye"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleAddAlternative();
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="flex items-end gap-2">
                                        <Button onClick={handleAddAlternative} size="sm">
                                            Ekle
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                setIsAddingAlternative(false);
                                                setNewAlternative('');
                                            }}
                                            size="sm"
                                            variant="outline"
                                        >
                                            İptal
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Alternatives Table */}
                            {brand.alternatives && brand.alternatives.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Alternatif İsim</TableHead>
                                            <TableHead>Kaynak</TableHead>
                                            <TableHead>Kullanım</TableHead>
                                            <TableHead>Eşleşme</TableHead>
                                            <TableHead>Eklenme</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {brand.alternatives.map((alt) => (
                                            <TableRow key={alt.id}>
                                                <TableCell className="font-medium">
                                                    {alt.alternativeName}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{alt.source || 'N/A'}</Badge>
                                                </TableCell>
                                                <TableCell>{alt.usageCount.toLocaleString()}</TableCell>
                                                <TableCell>
                                                    {alt.isAutoMatched ? (
                                                        <Badge variant="secondary">Otomatik</Badge>
                                                    ) : (
                                                        <Badge variant="default">Manuel</Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-sm text-gray-500">
                                                    {dayjs(alt.createdAt).format('DD.MM.YYYY')}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    Henüz alternatif isim eklenmemiş
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default BrandDetailsDialog;
