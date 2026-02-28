import React, { useState, useEffect } from 'react'
import type { CategoryTree, CreateCategoryDto, UpdateCategoryDto } from '@/types/category'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

import { CategorySelector } from './CategorySelector'

interface CategoryFormProps {
    category?: CategoryTree | null
    parentCategory?: CategoryTree
    onSubmit: (data: CreateCategoryDto | UpdateCategoryDto) => void
    onCancel: () => void
    loading?: boolean
    mode: 'create' | 'edit'
}

export function CategoryForm({
    category,
    parentCategory,
    onSubmit,
    onCancel,
    loading = false,
    mode,
}: CategoryFormProps) {
    const [formData, setFormData] = useState({
        name: category?.name || '',
        code: category?.code || '',
        slug: category?.slug || '',
        description: category?.description || '',
        parentId: parentCategory?.id || category?.parentId || '',
        sortOrder: category?.sortOrder || 0,
        isLeaf: category?.isLeaf ?? false,
    })

    useEffect(() => {
        if (category) {
            console.log('🔍 [CategoryForm] Category data received:')
            console.log('  - ID:', category.id)
            console.log('  - Name:', category.name)
            console.log('  - isLeaf value:', category.isLeaf)
            console.log('  - isLeaf type:', typeof category.isLeaf)
            console.log('  - isLeaf === true:', category.isLeaf === true)
            console.log('  - isLeaf === false:', category.isLeaf === false)
            console.log('  - Full category object:', JSON.stringify(category, null, 2))

            setFormData({
                name: category.name,
                code: category.code,
                slug: category.slug,
                description: category.description || '',
                parentId: category.parentId || '',
                sortOrder: category.sortOrder,
                isLeaf: category.isLeaf ?? false,
            })

            console.log('✅ [CategoryForm] Form data set with isLeaf:', category.isLeaf ?? false)
        } else if (parentCategory) {
            setFormData((prev) => ({
                ...prev,
                parentId: parentCategory.id,
            }))
        }
    }, [category, parentCategory])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (mode === 'create') {
            const createDto: CreateCategoryDto = {
                name: formData.name,
                code: formData.code,
                slug: formData.slug || undefined,
                description: formData.description || undefined,
                parentId: formData.parentId || undefined,
                sortOrder: formData.sortOrder,
                isLeaf: formData.isLeaf,
            }
            onSubmit(createDto)
        } else {
            const updateDto: UpdateCategoryDto = {
                name: formData.name,
                code: formData.code,
                slug: formData.slug,
                description: formData.description || undefined,
                parentId: formData.parentId || undefined,
                sortOrder: formData.sortOrder,
                isLeaf: formData.isLeaf,
            }
            onSubmit(updateDto)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="name">Kategori Adı *</Label>
                <Input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Elektronik"
                    className="mt-1"
                />
            </div>

            <div>
                <Label htmlFor="code">Kod *</Label>
                <Input
                    id="code"
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => mode === 'create' && setFormData({ ...formData, code: e.target.value })}
                    readOnly={mode === 'edit'}
                    placeholder="ELEC (benzersiz kod)"
                    className={`mt-1 ${mode === 'edit' ? 'bg-gray-100 cursor-not-allowed text-gray-500' : ''}`}
                />
                <p className="text-xs text-gray-500 mt-1">
                    {mode === 'edit'
                        ? 'Kod alanı düzenlenemez'
                        : 'Kategori için benzersiz kod (büyük harf, boşluksuz)'}
                </p>
            </div>

            <div>
                <Label htmlFor="slug">Slug (opsiyonel)</Label>
                <Input
                    id="slug"
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="elektronik (boş bırakılırsa otomatik oluşturulur)"
                    className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                    URL'de kullanılacak benzersiz tanımlayıcı
                </p>
            </div>

            <div>
                <Label htmlFor="description">Açıklama</Label>
                <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Kategori açıklaması..."
                    rows={3}
                    className="mt-1"
                />
            </div>

            {!parentCategory && (
                <div>
                    <Label htmlFor="parentId">Üst Kategori</Label>
                    <div className="mt-1">
                        <CategorySelector
                            value={formData.parentId}
                            onChange={(parentId) => setFormData({ ...formData, parentId })}
                            placeholder="Ana kategori (üst kategori yok)"
                        />
                    </div>
                </div>
            )}

            {parentCategory && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-900">
                        <span className="font-medium">Üst Kategori:</span> {parentCategory.name}
                    </p>
                </div>
            )}

            <div>
                <Label htmlFor="sortOrder">Sıralama</Label>
                <Input
                    id="sortOrder"
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                    className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                    Düşük değerler önce gösterilir
                </p>
            </div>

            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    id="isLeaf"
                    checked={formData.isLeaf}
                    onChange={(e) => setFormData({ ...formData, isLeaf: e.target.checked })}
                    className="w-4 h-4"
                />
                <Label htmlFor="isLeaf">Leaf Kategori (Alt kategorisi yok)</Label>
            </div>

            <div className="flex gap-4 pt-4">
                <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1"
                >
                    {loading ? 'İşleniyor...' : mode === 'create' ? 'Oluştur' : 'Güncelle'}
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={loading}
                    className="flex-1"
                >
                    İptal
                </Button>
            </div>
        </form>
    )
}
