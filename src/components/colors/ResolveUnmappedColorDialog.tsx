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
import { unmappedColorService, masterColorService } from '@/services/api/colors';
import type {
    UnmappedColor,
    MasterColor,
    ResolveUnmappedColorDto,
    UnmappedColorAction,
    CreateMasterColorDto,
} from '@/types/color';
import { CheckCircle, Plus, Link, XCircle, Search } from 'lucide-react';

interface ResolveUnmappedColorDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    unmappedColor: UnmappedColor;
    onResolved: () => void;
}

const ResolveUnmappedColorDialog = ({
    open,
    onOpenChange,
    unmappedColor,
    onResolved,
}: ResolveUnmappedColorDialogProps) => {
    const [action, setAction] = useState<UnmappedColorAction>('MapToExisting');
    const [selectedMasterColorId, setSelectedMasterColorId] = useState<string>('');
    const [suggestions, setSuggestions] = useState<MasterColor[]>([]);
    const [allColors, setAllColors] = useState<MasterColor[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [notes, setNotes] = useState('');

    // New Master Color Form
    const [newColor, setNewColor] = useState<CreateMasterColorDto>({
        code: '',
        name: unmappedColor.colorName,
        hexCode: '',
        isVerified: false,
    });

    const { showLoading, hideLoading } = useLoading();
    const { success, error } = useNotification();

    useEffect(() => {
        if (open) {
            loadData();
            setAction('MapToExisting');
            setSelectedMasterColorId('');
            setSearchQuery('');
            setNotes('');
            setNewColor({
                code: '',
                name: unmappedColor.colorName,
                hexCode: '',
                isVerified: false,
            });
        }
    }, [open, unmappedColor]);

    const loadData = async () => {
        try {
            const [suggestionsData, colorsData] = await Promise.all([
                unmappedColorService.getSuggestions(unmappedColor.id),
                masterColorService.getAll(),
            ]);
            setSuggestions(suggestionsData);
            setAllColors(colorsData);
        } catch (err) {
            console.error('Data load error:', err);
        }
    };

    const filteredColors = searchQuery.trim()
        ? allColors.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : suggestions.length > 0
            ? suggestions
            : allColors;

    const selectedColor = allColors.find((c) => c.id === selectedMasterColorId);

    const handleResolve = async () => {
        showLoading('İşlem yapılıyor...');
        try {
            const dto: ResolveUnmappedColorDto = {
                action,
                notes: notes || undefined,
            };

            if (action === 'MapToExisting') {
                if (!selectedMasterColorId) {
                    error('Lütfen bir master renk seçin');
                    hideLoading();
                    return;
                }
                dto.masterColorId = selectedMasterColorId;
            } else if (action === 'CreateNewMaster') {
                if (!newColor.name.trim()) {
                    error('Renk adı gereklidir');
                    hideLoading();
                    return;
                }
                if (!newColor.code.trim()) {
                    error('Renk kodu gereklidir');
                    hideLoading();
                    return;
                }
                dto.newMasterColor = newColor;
            }

            await unmappedColorService.resolve(unmappedColor.id, dto);
            success(
                action === 'MapToExisting'
                    ? 'Renk başarıyla eşleştirildi'
                    : action === 'CreateNewMaster'
                        ? 'Yeni renk oluşturuldu ve eşleştirildi'
                        : 'Renk yok sayıldı'
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
                    <DialogTitle>Eşleşmemiş Rengi Çözümle</DialogTitle>
                    <DialogDescription>
                        <span className="font-medium">{unmappedColor.colorName}</span> için bir
                        aksiyon seçin
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Color Info */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm">Renk Bilgileri</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="font-medium">Orijinal İsim:</span>{' '}
                                    {unmappedColor.colorName}
                                </div>
                                <div>
                                    <span className="font-medium">Normalize:</span>{' '}
                                    {unmappedColor.normalizedName}
                                </div>
                                <div>
                                    <span className="font-medium">Ürün Sayısı:</span>{' '}
                                    {unmappedColor.productCount}
                                </div>
                                {unmappedColor.source && (
                                    <div>
                                        <span className="font-medium">Kaynak:</span>{' '}
                                        {unmappedColor.source}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="action-select">Aksiyon Seç</Label>
                        <Select
                            value={action}
                            onValueChange={(v) => setAction(v as UnmappedColorAction)}
                        >
                            <SelectTrigger id="action-select">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="MapToExisting">
                                    <div className="flex items-center gap-2">
                                        <Link className="h-4 w-4" />
                                        Mevcut Master Renge Eşleştir
                                    </div>
                                </SelectItem>
                                <SelectItem value="CreateNewMaster">
                                    <div className="flex items-center gap-2">
                                        <Plus className="h-4 w-4" />
                                        Yeni Master Renk Oluştur
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
                                <CardTitle className="text-base">Master Renk Seç</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {/* Search */}
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Renk ara..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>

                                {/* Color List */}
                                <div className="border rounded-lg max-h-60 overflow-y-auto">
                                    {filteredColors.length === 0 ? (
                                        <div className="p-4 text-center text-gray-500 text-sm">
                                            Sonuç bulunamadı
                                        </div>
                                    ) : (
                                        <div className="divide-y">
                                            {filteredColors.map((color) => (
                                                <div
                                                    key={color.id}
                                                    className={`p-3 hover:bg-gray-50 cursor-pointer ${selectedMasterColorId === color.id
                                                            ? 'bg-blue-50'
                                                            : ''
                                                        }`}
                                                    onClick={() =>
                                                        setSelectedMasterColorId(color.id)
                                                    }
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            {/* Color swatch */}
                                                            <div
                                                                className="h-8 w-8 rounded border"
                                                                style={{
                                                                    backgroundColor:
                                                                        color.hexCode ||
                                                                        'transparent',
                                                                    backgroundImage: color.hexCode
                                                                        ? undefined
                                                                        : 'repeating-conic-gradient(#ccc 0% 25%, white 0% 50%) 0 0 / 6px 6px',
                                                                }}
                                                                title={color.hexCode || 'No hex'}
                                                            />
                                                            <div>
                                                                <div className="font-medium">
                                                                    {color.name}
                                                                </div>
                                                                <div className="text-xs text-gray-500">
                                                                    {color.productCount} ürün
                                                                    {color.hexCode && (
                                                                        <span className="ml-2 font-mono">
                                                                            {color.hexCode}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {selectedMasterColorId === color.id && (
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
                                        💡 Üstteki renkler benzerlik skoruna göre önerilmiştir
                                    </div>
                                )}

                                {selectedColor && (
                                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            {selectedColor.hexCode && (
                                                <div
                                                    className="h-10 w-10 rounded border"
                                                    style={{
                                                        backgroundColor: selectedColor.hexCode,
                                                    }}
                                                />
                                            )}
                                            <div>
                                                <div className="font-semibold text-blue-900">
                                                    Seçilen: {selectedColor.name}
                                                </div>
                                                <div className="text-sm text-blue-700">
                                                    {unmappedColor.colorName} →{' '}
                                                    {selectedColor.name} (alternatif isim olarak
                                                    eklenecek)
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
                                <CardTitle className="text-base">
                                    Yeni Master Renk Bilgileri
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <Label htmlFor="new-code">
                                        Renk Kodu <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="new-code"
                                        value={newColor.code}
                                        onChange={(e) =>
                                            setNewColor({ ...newColor, code: e.target.value })
                                        }
                                        placeholder="NAVY_BLUE"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="new-name">
                                        Renk Adı <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="new-name"
                                        value={newColor.name}
                                        onChange={(e) =>
                                            setNewColor({ ...newColor, name: e.target.value })
                                        }
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="new-hex">Hex Kodu (Opsiyonel)</Label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="color"
                                            value={newColor.hexCode || '#ffffff'}
                                            onChange={(e) =>
                                                setNewColor({
                                                    ...newColor,
                                                    hexCode: e.target.value,
                                                })
                                            }
                                            className="h-10 w-10 rounded cursor-pointer border"
                                        />
                                        <Input
                                            id="new-hex"
                                            value={newColor.hexCode || ''}
                                            onChange={(e) =>
                                                setNewColor({
                                                    ...newColor,
                                                    hexCode: e.target.value || undefined,
                                                })
                                            }
                                            placeholder="#1B2A4A"
                                            maxLength={7}
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="new-verified"
                                        checked={newColor.isVerified}
                                        onCheckedChange={(checked) =>
                                            setNewColor({
                                                ...newColor,
                                                isVerified: checked as boolean,
                                            })
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
                                    Bu renk <strong>yok sayılacak</strong> ve spam/geçersiz olarak
                                    işaretlenecektir.
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

export default ResolveUnmappedColorDialog;
