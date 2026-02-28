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
import { masterBrandService } from '@/services/api/brands';
import type { MasterBrand, CreateMasterBrandDto, UpdateMasterBrandDto } from '@/types/brand';

interface BrandFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    brand?: MasterBrand;
    onSuccess: () => void;
}

const BrandFormDialog = ({ open, onOpenChange, brand, onSuccess }: BrandFormDialogProps) => {
    const [formData, setFormData] = useState<CreateMasterBrandDto>({
        code: '',
        name: '',
        logoUrl: '',
        description: '',
        website: '',
        countryCode: '',
        isActive: true,
        isVerified: false,
    });

    const { showLoading, hideLoading } = useLoading();
    const { success, error } = useNotification();

    const isEditMode = !!brand;

    useEffect(() => {
        if (brand) {
            setFormData({
                code: brand.code,
                name: brand.name,
                logoUrl: brand.logoUrl || '',
                description: brand.description || '',
                website: brand.website || '',
                countryCode: brand.countryCode || '',
                isActive: brand.isActive,
                isVerified: brand.isVerified,
            });
        } else {
            // Reset form when creating new
            setFormData({
                code: '',
                name: '',
                logoUrl: '',
                description: '',
                website: '',
                countryCode: '',
                isActive: true,
                isVerified: false,
            });
        }
    }, [brand, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            error('Marka adı gereklidir');
            return;
        }

        showLoading(isEditMode ? 'Marka güncelleniyor...' : 'Marka oluşturuluyor...');
        try {
            if (isEditMode) {
                const updateData: UpdateMasterBrandDto = {
                    code: formData.code,
                    name: formData.name,
                    logoUrl: formData.logoUrl || undefined,
                    description: formData.description || undefined,
                    website: formData.website || undefined,
                    countryCode: formData.countryCode || undefined,
                    isActive: formData.isActive,
                    isVerified: formData.isVerified,
                };
                await masterBrandService.update(brand.id, updateData);
                success('Marka başarıyla güncellendi');
            } else {
                await masterBrandService.create(formData);
                success('Marka başarıyla oluşturuldu');
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
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{isEditMode ? 'Marka Düzenle' : 'Yeni Marka Ekle'}</DialogTitle>
                    <DialogDescription>
                        {isEditMode
                            ? 'Marka bilgilerini güncelleyin'
                            : 'Yeni bir master marka oluşturun'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="code">
                            Marka Kodu <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="code"
                            value={formData.code}
                            onChange={(e) => !isEditMode && setFormData({ ...formData, code: e.target.value })}
                            readOnly={isEditMode}
                            placeholder="NIKE"
                            required
                            className={isEditMode ? 'bg-gray-100 cursor-not-allowed text-gray-500' : ''}
                        />
                        {isEditMode && (
                            <p className="text-xs text-gray-500">Marka kodu düzenlenemez</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="name">
                            Marka Adı <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Nike"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="logoUrl">Logo URL</Label>
                        <Input
                            id="logoUrl"
                            value={formData.logoUrl}
                            onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                            placeholder="https://example.com/logo.png"
                            type="url"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Açıklama</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Marka hakkında kısa açıklama..."
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="website">Website</Label>
                            <Input
                                id="website"
                                value={formData.website}
                                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                placeholder="https://nike.com"
                                type="url"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="countryCode">Ülke Kodu</Label>
                            <Input
                                id="countryCode"
                                value={formData.countryCode}
                                onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                                placeholder="TR"
                                maxLength={2}
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="isActive"
                            checked={formData.isActive}
                            onCheckedChange={(checked) =>
                                setFormData({ ...formData, isActive: checked as boolean })
                            }
                        />
                        <Label
                            htmlFor="isActive"
                            className="text-sm font-normal cursor-pointer"
                        >
                            Aktif marka
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
                        <Label
                            htmlFor="isVerified"
                            className="text-sm font-normal cursor-pointer"
                        >
                            Doğrulanmış marka olarak işaretle
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

export default BrandFormDialog;
