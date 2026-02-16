import { useState } from 'react'
import type { SiteCategory, CreateSiteCategoryDto, UpdateSiteCategoryDto } from '@/types/siteConfig'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MasterCategorySelector } from '@/components/category'

interface SiteCategoryFormProps {
    category?: SiteCategory
    parentCategory?: SiteCategory
    onSubmit: (data: CreateSiteCategoryDto | UpdateSiteCategoryDto) => void | Promise<void>
    onCancel: () => void
    loading?: boolean
}

export function SiteCategoryForm({ category, parentCategory, onSubmit, onCancel, loading }: SiteCategoryFormProps) {
    const [formData, setFormData] = useState({
        name: category?.name || '',
        categoryUrl: category?.categoryUrl || '',
        searchQuery: category?.searchQuery || '',
        isLeaf: category?.isLeaf ?? false,
        isEnabled: category?.isEnabled ?? true,
        masterCategoryId: category?.masterCategoryId || '',
        section: category?.section || '',
        storeId: category?.storeId || '',
        locale: category?.locale || '',
        priority: category?.priority || 0,
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const data: CreateSiteCategoryDto | UpdateSiteCategoryDto = {
            ...formData,
            parentId: parentCategory?.id,
            searchQuery: formData.searchQuery || undefined,
            masterCategoryId: formData.masterCategoryId || undefined,
            section: formData.section || undefined,
            storeId: formData.storeId || undefined,
            locale: formData.locale || undefined,
        }
        onSubmit(data)
    }

    const handleChange = (field: string, value: string | number | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Parent Category Info */}
            {parentCategory && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-900">
                        <strong>Üst Kategori:</strong> {parentCategory.name}
                    </p>
                </div>
            )}

            {/* Category Name */}
            <div>
                <Label htmlFor="name">Kategori Adı *</Label>
                <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Kadın Giyim"
                    required
                    disabled={loading}
                />
            </div>

            {/* Category URL */}
            <div>
                <Label htmlFor="categoryUrl">Kategori URL *</Label>
                <Input
                    id="categoryUrl"
                    value={formData.categoryUrl}
                    onChange={(e) => handleChange('categoryUrl', e.target.value)}
                    placeholder="https://www.site.com/kadin-giyim"
                    required
                    disabled={loading}
                />
            </div>

            {/* Search Query */}
            <div>
                <Label htmlFor="searchQuery">Arama Sorgusu (Opsiyonel)</Label>
                <Input
                    id="searchQuery"
                    value={formData.searchQuery}
                    onChange={(e) => handleChange('searchQuery', e.target.value)}
                    placeholder="kadın giyim"
                    disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-1">Arama tabanlı scraping için</p>
            </div>

            {/* Master Category Selector */}
            <div>
                <Label htmlFor="masterCategoryId">Master Kategori (Opsiyonel)</Label>
                <MasterCategorySelector
                    value={formData.masterCategoryId}
                    onChange={(categoryId: string) => handleChange('masterCategoryId', categoryId)}
                    placeholder="Master kategori seçin"
                />
                <p className="text-xs text-gray-500 mt-1">Site kategorisini master kategori ile eşleştirin</p>
            </div>

            {/* Checkboxes */}
            <div className="space-y-2">
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="isLeaf"
                        checked={formData.isLeaf}
                        onChange={(e) => handleChange('isLeaf', e.target.checked)}
                        disabled={loading}
                        className="w-4 h-4"
                    />
                    <Label htmlFor="isLeaf">Leaf Kategori (Alt kategorisi yok)</Label>
                </div>

                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="isEnabled"
                        checked={formData.isEnabled}
                        onChange={(e) => handleChange('isEnabled', e.target.checked)}
                        disabled={loading}
                        className="w-4 h-4"
                    />
                    <Label htmlFor="isEnabled">Aktif</Label>
                </div>
            </div>

            {/* Priority */}
            <div>
                <Label htmlFor="priority">Öncelik</Label>
                <Input
                    id="priority"
                    type="number"
                    value={formData.priority}
                    onChange={(e) => handleChange('priority', parseInt(e.target.value))}
                    disabled={loading}
                />
            </div>

            {/* Site-specific fields (for Zara-like sites) */}
            <details className="border rounded-lg p-3">
                <summary className="cursor-pointer text-sm font-medium text-gray-700">
                    Site-Specific Alanlar (Opsiyonel)
                </summary>
                <div className="mt-3 space-y-3">
                    <div>
                        <Label htmlFor="section">Section</Label>
                        <Input
                            id="section"
                            value={formData.section}
                            onChange={(e) => handleChange('section', e.target.value)}
                            placeholder="woman, man, kid"
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <Label htmlFor="storeId">Store ID</Label>
                        <Input
                            id="storeId"
                            value={formData.storeId}
                            onChange={(e) => handleChange('storeId', e.target.value)}
                            placeholder="52010"
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <Label htmlFor="locale">Locale</Label>
                        <Input
                            id="locale"
                            value={formData.locale}
                            onChange={(e) => handleChange('locale', e.target.value)}
                            placeholder="tr-TR"
                            disabled={loading}
                        />
                    </div>
                </div>
            </details>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                    İptal
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading ? 'Kaydediliyor...' : category ? 'Güncelle' : 'Oluştur'}
                </Button>
            </div>
        </form>
    )
}
