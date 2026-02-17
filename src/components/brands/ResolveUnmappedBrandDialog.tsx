import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useLoading } from '@/contexts/LoadingContext';
import { useNotification } from '@/contexts/NotificationContext';
import { unmappedBrandService, masterBrandService } from '@/services/api/brands';
import type {
    UnmappedBrand,
    MasterBrand,
    ResolveUnmappedBrandDto,
    UnmappedBrandAction,
    CreateMasterBrandDto,
} from '@/types/brand';
import { CheckCircle, Plus, Link, XCircle, Search } from 'lucide-react';

interface ResolveUnmappedBrandDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    unmappedBrand: UnmappedBrand;
    onResolved: () => void;
}

const ResolveUnmappedBrandDialog = ({
    open,
    onOpenChange,
    unmappedBrand,
    onResolved,
}: ResolveUnmappedBrandDialogProps) => {
    const [action, setAction] = useState<UnmappedBrandAction>('MapToExisting');
    const [selectedMasterBrandId, setSelectedMasterBrandId] = useState<string>('');
    const [suggestions, setSuggestions] = useState<MasterBrand[]>([]);
    const [allBrands, setAllBrands] = useState<MasterBrand[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [notes, setNotes] = useState('');

    // New Master Brand Form
    const [newBrand, setNewBrand] = useState<CreateMasterBrandDto>({
        name: unmappedBrand.brandName,
        isVerified: false,
    });

    const { showLoading, hideLoading } = useLoading();
    const { success, error } = useNotification();

    useEffect(() => {
        if (open) {
            loadData();
            setAction('MapToExisting');
            setSelectedMasterBrandId('');
            setSearchQuery('');
            setNotes('');
            setNewBrand({
                name: unmappedBrand.brandName,
                isVerified: false,
            });
        }
    }, [open, unmappedBrand]);

    const loadData = async () => {
        try {
            const [suggestionsData, brandsData] = await Promise.all([
                unmappedBrandService.getSuggestions(unmappedBrand.id),
                masterBrandService.getAll(),
            ]);
            setSuggestions(suggestionsData);
            setAllBrands(brandsData);
        } catch (err) {
            console.error('Data load error:', err);
        }
    };

    const filteredBrands = searchQuery.trim()
        ? allBrands.filter((b) => b.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : suggestions.length > 0
            ? suggestions
            : allBrands;

    const selectedBrand = allBrands.find((b) => b.id === selectedMasterBrandId);

    const handleResolve = async () => {
        showLoading('İşlem yapılıyor...');
        try {
            const dto: ResolveUnmappedBrandDto = {
                action,
                notes: notes || undefined,
            };

            if (action === 'MapToExisting') {
                if (!selectedMasterBrandId) {
                    error('Lütfen bir master marka seçin');
                    hideLoading();
                    return;
                }
                dto.masterBrandId = selectedMasterBrandId;
            } else if (action === 'CreateNewMaster') {
                if (!newBrand.name.trim()) {
                    error('Marka adı gereklidir');
                    hideLoading();
                    return;
                }
                dto.newMasterBrand = newBrand;
            }

            await unmappedBrandService.resolve(unmappedBrand.id, dto);
            success(
                action === 'MapToExisting'
                    ? 'Marka başarıyla eşleştirildi'
                    : action === 'CreateNewMaster'
                        ? 'Yeni marka oluşturuldu ve eşleştirildi'
                        : 'Marka yok sayıldı'
            );
            onResolved();
        } catch (err: any) {
            error(err.message || 'İşlem sırasında hata oluştu');
            console.error(err);
        } finally {
            hideLoading();
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Eşleşmemiş Markayı Çözümle</DialogTitle>
                    <DialogDescription>
                        <span className="font-medium">{unmappedBrand.brandName}</span> için bir aksiyon seçin
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Brand Info */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm">Marka Bilgileri</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="font-medium">Orijinal İsim:</span> {unmappedBrand.brandName}
                                </div>
                                <div>
                                    <span className="font-medium">Normalize:</span> {unmappedBrand.normalizedName}
                                </div>
                                <div>
                                    <span className="font-medium">Ürün Sayısı:</span> {unmappedBrand.productCount}
                                </div>
                                {unmappedBrand.source && (
                                    <div>
                                        <span className="font-medium">Kaynak:</span> {unmappedBrand.source}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="action-select">Aksiyon Seç</Label>
                        <Select value={action} onValueChange={(v) => setAction(v as UnmappedBrandAction)}>
                            <SelectTrigger id="action-select">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="MapToExisting">
                                    <div className="flex items-center gap-2">
                                        <Link className="h-4 w-4" />
                                        Mevcut Master Markaya Eşleştir
                                    </div>
                                </SelectItem>
                                <SelectItem value="CreateNewMaster">
                                    <div className="flex items-center gap-2">
                                        <Plus className="h-4 w-4" />
                                        Yeni Master Marka Oluştur
                                    </div>
                                </SelectItem>
                                <SelectItem value="Ignore">
                                    <div className="flex items-center gap-2">
                                        <XCircle className="h-4 w-4" />
                                        Yok Say
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Map to Existing */}
                    {action === 'MapToExisting' && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Master Marka Seç</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {/* Search */}
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Marka ara..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>

                                {/* Brand List */}
                                <div className="border rounded-lg max-h-60 overflow-y-auto">
                                    {filteredBrands.length === 0 ? (
                                        <div className="p-4 text-center text-gray-500 text-sm">Sonuç bulunamadı</div>
                                    ) : (
                                        <div className="divide-y">
                                            {filteredBrands.map((brand) => (
                                                <div
                                                    key={brand.id}
                                                    className={`p-3 hover:bg-gray-50 cursor-pointer ${selectedMasterBrandId === brand.id ? 'bg-blue-50' : ''
                                                        }`}
                                                    onClick={() => setSelectedMasterBrandId(brand.id)}
                                                >
                                                    <div className="flex items-center justify-between">
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
                                                                <div className="text-xs text-gray-500">{brand.productCount} ürün</div>
                                                            </div>
                                                        </div>
                                                        {selectedMasterBrandId === brand.id && (
                                                            <CheckCircle className="h-5 w-5 text-blue-600" />
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {suggestions.length > 0 && !searchQuery && (
                                    <div className="text-xs text-gray-500">
                                        💡 Üstteki markalar benzerlik skoruna göre önerilmiştir
                                    </div>
                                )}

                                {selectedBrand && (
                                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            {selectedBrand.logoUrl && (
                                                <img
                                                    src={selectedBrand.logoUrl}
                                                    alt={selectedBrand.name}
                                                    className="h-10 w-10 rounded object-contain"
                                                />
                                            )}
                                            <div>
                                                <div className="font-semibold text-blue-900">Seçilen: {selectedBrand.name}</div>
                                                <div className="text-sm text-blue-700">
                                                    {unmappedBrand.brandName} → {selectedBrand.name} (alternatif isim olarak eklenecek)
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Create New Master */}
                    {action === 'CreateNewMaster' && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Yeni Master Marka Bilgileri</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <Label htmlFor="new-name">
                                        Marka Adı <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="new-name"
                                        value={newBrand.name}
                                        onChange={(e) => setNewBrand({ ...newBrand, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="new-logo">Logo URL (Opsiyonel)</Label>
                                    <Input
                                        id="new-logo"
                                        value={newBrand.logoUrl || ''}
                                        onChange={(e) => setNewBrand({ ...newBrand, logoUrl: e.target.value || undefined })}
                                        placeholder="https://"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="new-desc">Açıklama (Opsiyonel)</Label>
                                    <Textarea
                                        id="new-desc"
                                        value={newBrand.description || ''}
                                        onChange={(e) =>
                                            setNewBrand({ ...newBrand, description: e.target.value || undefined })
                                        }
                                        rows={2}
                                    />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="new-verified"
                                        checked={newBrand.isVerified}
                                        onCheckedChange={(checked) =>
                                            setNewBrand({ ...newBrand, isVerified: checked as boolean })
                                        }
                                    />
                                    <Label htmlFor="new-verified" className="font-normal cursor-pointer">
                                        Doğrulanmış olarak işaretle
                                    </Label>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Ignore */}
                    {action === 'Ignore' && (
                        <Card className="border-gray-300 bg-gray-50">
                            <CardContent className="pt-6">
                                <p className="text-sm text-gray-700">
                                    Bu marka <strong>yok sayılacak</strong> ve spam/geçersiz olarak işaretlenecektir.
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Notes */}
                    <div>
                        <Label htmlFor="notes">Notlar (Opsiyonel)</Label>
                        <Textarea
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="İşlem hakkında notlar..."
                            rows={2}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        İptal
                    </Button>
                    <Button onClick={handleResolve}>
                        {action === 'MapToExisting'
                            ? 'Eşleştir'
                            : action === 'CreateNewMaster'
                                ? 'Oluştur ve Eşleştir'
                                : 'Yok Say'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ResolveUnmappedBrandDialog;
