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
import { masterColorService } from '@/services/api/colors';
import type { MasterColor, CreateColorAlternativeDto } from '@/types/color';
import { Plus, CheckCircle, XCircle } from 'lucide-react';
import dayjs from 'dayjs';

interface ColorDetailsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    color: MasterColor;
    onAlternativeAdded: () => void;
}

const ColorDetailsDialog = ({
    open,
    onOpenChange,
    color,
    onAlternativeAdded,
}: ColorDetailsDialogProps) => {
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
            const data: CreateColorAlternativeDto = {
                masterColorId: color.id,
                alternativeName: newAlternative.trim(),
                source: 'Manual',
                isAutoMatched: false,
            };

            await masterColorService.addAlternative(color.id, data);
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
                        {/* Color swatch preview */}
                        {color.hexCode && (
                            <div
                                className="h-12 w-12 rounded-lg border-2 border-gray-200 shadow-inner flex-shrink-0"
                                style={{ backgroundColor: color.hexCode }}
                                title={color.hexCode}
                            />
                        )}
                        <div>
                            <DialogTitle>{color.name}</DialogTitle>
                            <DialogDescription>{color.normalizedName}</DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Color Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Renk Bilgileri</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="font-medium">Kod:</span>{' '}
                                    <span className="font-mono text-gray-600">{color.code}</span>
                                </div>
                                <div>
                                    <span className="font-medium">Durum:</span>{' '}
                                    {color.isVerified ? (
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
                                    {color.productCount.toLocaleString()}
                                </div>
                                {color.hexCode && (
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">Hex:</span>
                                        <div
                                            className="h-5 w-5 rounded border"
                                            style={{ backgroundColor: color.hexCode }}
                                        />
                                        <span className="font-mono text-gray-600">
                                            {color.hexCode}
                                        </span>
                                    </div>
                                )}
                            </div>
                            {color.description && (
                                <div className="pt-2 border-t">
                                    <span className="font-medium">Açıklama:</span>
                                    <p className="text-gray-600 mt-1">{color.description}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Alternatives */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                            <CardTitle className="text-base">
                                Alternatif İsimler ({color.alternatives?.length || 0})
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
                                            placeholder="Örn: Navy Blue, mavi lacivert"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') handleAddAlternative();
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
                            {color.alternatives && color.alternatives.length > 0 ? (
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
                                        {color.alternatives.map((alt) => (
                                            <TableRow key={alt.id}>
                                                <TableCell className="font-medium">
                                                    {alt.alternativeName}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">
                                                        {alt.source || 'N/A'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {alt.usageCount.toLocaleString()}
                                                </TableCell>
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

export default ColorDetailsDialog;
