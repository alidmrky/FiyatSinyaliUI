import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useLoading } from '@/contexts/LoadingContext';
import { useNotification } from '@/contexts/NotificationContext';
import { masterColorService } from '@/services/api/colors';
import type { MasterColor, CreateMasterColorDto, UpdateMasterColorDto } from '@/types/color';

interface ColorFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    color?: MasterColor;
    onSuccess: () => void;
}

const EMPTY_FORM: CreateMasterColorDto = {
    code: '',
    name: '',
    hexCode: '',
    description: '',
    isActive: true,
    isVerified: false,
};

const ColorFormDialog = ({ open, onOpenChange, color, onSuccess }: ColorFormDialogProps) => {
    const [formData, setFormData] = useState<CreateMasterColorDto>(EMPTY_FORM);

    const { showLoading, hideLoading } = useLoading();
    const { success, error } = useNotification();

    const isEditMode = !!color;

    useEffect(() => {
        if (color) {
            setFormData({
                code: color.code,
                name: color.name,
                hexCode: color.hexCode || '',
                description: color.description || '',
                isActive: color.isActive,
                isVerified: color.isVerified,
            });
        } else {
            setFormData(EMPTY_FORM);
        }
    }, [color, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            error('Renk adı gereklidir');
            return;
        }
        if (!formData.code.trim()) {
            error('Renk kodu gereklidir');
            return;
        }

        showLoading(isEditMode ? 'Renk güncelleniyor...' : 'Renk oluşturuluyor...');
        try {
            if (isEditMode) {
                const updateData: UpdateMasterColorDto = {
                    code: formData.code,
                    name: formData.name,
                    hexCode: formData.hexCode || undefined,
                    description: formData.description || undefined,
                    isActive: formData.isActive,
                    isVerified: formData.isVerified,
                };
                await masterColorService.update(color.id, updateData);
                success('Renk başarıyla güncellendi');
            } else {
                await masterColorService.create(formData);
                success('Renk başarıyla oluşturuldu');
            }
            onSuccess();
        } catch (err: any) {
            error(err.message || 'İşlem sırasında hata oluştu');
            console.error(err);
        } finally {
            hideLoading();
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle>{isEditMode ? 'Renk Düzenle' : 'Yeni Renk Ekle'}</DialogTitle>
                    <DialogDescription>
                        {isEditMode
                            ? 'Renk bilgilerini güncelleyin'
                            : 'Yeni bir master renk oluşturun'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Code */}
                    <div className="space-y-2">
                        <Label htmlFor="code">
                            Renk Kodu <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="code"
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                            placeholder="NAVY_BLUE"
                            required
                        />
                    </div>

                    {/* Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name">
                            Renk Adı <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Lacivert"
                            required
                        />
                    </div>

                    {/* Hex Code with color picker */}
                    <div className="space-y-2">
                        <Label htmlFor="hexCode">Hex Renk Kodu</Label>
                        <div className="flex items-center gap-3">
                            <div
                                className="h-10 w-10 rounded-lg border-2 border-gray-300 flex-shrink-0 shadow-inner"
                                style={{
                                    backgroundColor: formData.hexCode
                                        ? formData.hexCode
                                        : 'transparent',
                                    backgroundImage: formData.hexCode
                                        ? undefined
                                        : 'repeating-conic-gradient(#ccc 0% 25%, white 0% 50%) 0 0 / 8px 8px',
                                }}
                            />
                            <input
                                type="color"
                                value={formData.hexCode || '#ffffff'}
                                onChange={(e) =>
                                    setFormData({ ...formData, hexCode: e.target.value })
                                }
                                className="h-10 w-10 rounded cursor-pointer border border-gray-300 flex-shrink-0"
                                title="Renk seç"
                            />
                            <Input
                                id="hexCode"
                                value={formData.hexCode || ''}
                                onChange={(e) =>
                                    setFormData({ ...formData, hexCode: e.target.value || undefined })
                                }
                                placeholder="#1B2A4A"
                                className="flex-1"
                                maxLength={7}
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Açıklama</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({ ...formData, description: e.target.value })
                            }
                            placeholder="Renk hakkında kısa açıklama..."
                            rows={3}
                        />
                    </div>

                    {/* Checkboxes */}
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="isActive"
                            checked={formData.isActive}
                            onCheckedChange={(checked) =>
                                setFormData({ ...formData, isActive: checked as boolean })
                            }
                        />
                        <Label htmlFor="isActive" className="text-sm font-normal cursor-pointer">
                            Aktif renk
                        </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="isVerified"
                            checked={formData.isVerified}
                            onCheckedChange={(checked) =>
                                setFormData({ ...formData, isVerified: checked as boolean })
                            }
                        />
                        <Label htmlFor="isVerified" className="text-sm font-normal cursor-pointer">
                            Doğrulanmış renk olarak işaretle
                        </Label>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            İptal
                        </Button>
                        <Button type="submit">{isEditMode ? 'Güncelle' : 'Oluştur'}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ColorFormDialog;
