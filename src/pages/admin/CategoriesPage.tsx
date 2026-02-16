'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
    Plus,
    Search,
    Edit,
    Trash2,
    ChevronRight,
    ChevronDown,
    FolderTree,
    MoreHorizontal,
    Folder,
    FolderOpen,
} from 'lucide-react'
import { useCategoryTree } from '@/hooks/useCategoryTree'
import { CategoryTree, CreateCategoryDto, UpdateCategoryDto } from '@/types/category'
import { CategoryService } from '@/services/api/categories'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { CategoryForm } from '@/components/category'

export default function CategoriesPage() {
    const { tree, loading, error, reload } = useCategoryTree()
    const [searchTerm, setSearchTerm] = useState('')
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedParentCategory, setSelectedParentCategory] = useState<CategoryTree | null>(null)
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
    const [editingCategory, setEditingCategory] = useState<CategoryTree | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const toggleExpanded = (categoryId: string) => {
        const newExpanded = new Set(expandedCategories)
        if (newExpanded.has(categoryId)) {
            newExpanded.delete(categoryId)
        } else {
            newExpanded.add(categoryId)
        }
        setExpandedCategories(newExpanded)
    }

    const handleNewCategory = () => {
        setSelectedParentCategory(null)
        setEditingCategory(null)
        setModalMode('create')
        setIsModalOpen(true)
    }

    const handleEditCategory = (category: CategoryTree) => {
        setEditingCategory(category)
        setSelectedParentCategory(null)
        setModalMode('edit')
        setIsModalOpen(true)
    }

    const handleNewSubCategory = (parentCategory: CategoryTree) => {
        setSelectedParentCategory(parentCategory)
        setEditingCategory(null)
        setModalMode('create')
        setIsModalOpen(true)
    }

    const handleModalClose = () => {
        setIsModalOpen(false)
        setSelectedParentCategory(null)
        setEditingCategory(null)
    }

    const handleCategorySubmit = async (data: CreateCategoryDto | UpdateCategoryDto) => {
        setIsSubmitting(true)
        try {
            if (modalMode === 'create') {
                await CategoryService.createCategory(data as CreateCategoryDto)
                alert(selectedParentCategory ? 'Alt kategori başarıyla oluşturuldu!' : 'Kategori başarıyla oluşturuldu!')
            } else if (editingCategory) {
                await CategoryService.updateCategory(editingCategory.id, data as UpdateCategoryDto)
                alert('Kategori başarıyla güncellendi!')
            }
            handleModalClose()
            reload()
        } catch (error: any) {
            const errorMessage = error.message || 'Bir hata oluştu'
            const errorCode = error.statusCode ? ` (HTTP ${error.statusCode})` : ''
            alert(errorMessage + errorCode)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeleteCategory = async (categoryId: string) => {
        if (!confirm('Bu kategoriyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
            return
        }

        try {
            await CategoryService.deleteCategory(categoryId)
            alert('Kategori başarıyla silindi!')
            reload()
        } catch (error: any) {
            const errorMessage = error.message || 'Kategori silinemedi'
            const errorCode = error.statusCode ? ` (HTTP ${error.statusCode})` : ''
            alert(errorMessage + errorCode)
        }
    }

    const filteredCategories = tree.filter(category => {
        const matchesSearch = searchTerm === '' ||
            category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            category.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            category.slug.toLowerCase().includes(searchTerm.toLowerCase())

        return matchesSearch
    })

    const renderCategoryTree = (categories: CategoryTree[], level = 0) => {
        return categories.map((category) => (
            <div key={category.id} className="space-y-1">
                <div
                    className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 p-2.5 sm:p-3 rounded-lg border ${level > 0 ? `ml-${level * 6} bg-gray-50` : 'bg-white'
                        }`}
                    style={{
                        marginLeft: `${level * 12}px`,
                        backgroundColor: level === 0 ? '#ffffff' :
                            level === 1 ? '#f9fafb' :
                                level === 2 ? '#f3f4f6' :
                                    level === 3 ? '#e5e7eb' : '#d1d5db'
                    }}
                >
                    <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                        {category.children && category.children.length > 0 && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 sm:h-6 sm:w-6 flex-shrink-0"
                                onClick={() => toggleExpanded(category.id)}
                            >
                                {expandedCategories.has(category.id) ? (
                                    <ChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                ) : (
                                    <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                )}
                            </Button>
                        )}

                        <div className="flex items-center space-x-1.5 sm:space-x-2 flex-1 min-w-0">
                            {/* Level Indicator */}
                            <div className="flex items-center space-x-0.5 sm:space-x-1 hidden sm:flex">
                                {Array.from({ length: level }, (_, i) => (
                                    <div
                                        key={i}
                                        className="w-0.5 sm:w-1 h-3 sm:h-4 bg-gray-400 rounded-full"
                                        style={{
                                            backgroundColor: i === level - 1 ? '#3b82f6' : '#9ca3af',
                                            opacity: 0.6 + (i * 0.1)
                                        }}
                                    ></div>
                                ))}
                            </div>

                            {expandedCategories.has(category.id) && category.children && category.children.length > 0 ? (
                                <FolderOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600 flex-shrink-0" />
                            ) : (
                                <Folder className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
                            )}

                            <span className="font-medium text-sm sm:text-base truncate">{category.name}</span>

                            <Badge
                                variant="outline"
                                className="text-[10px] sm:text-xs flex-shrink-0"
                                style={{
                                    backgroundColor: level === 0 ? '#dbeafe' :
                                        level === 1 ? '#dcfce7' :
                                            level === 2 ? '#fef3c7' :
                                                level === 3 ? '#fed7aa' : '#fecaca',
                                    color: level === 0 ? '#1e40af' :
                                        level === 1 ? '#166534' :
                                            level === 2 ? '#92400e' :
                                                level === 3 ? '#c2410c' : '#dc2626'
                                }}
                            >
                                L{level}
                            </Badge>
                        </div>
                    </div>

                    <div className="flex items-center space-x-1.5 sm:space-x-2 flex-wrap sm:flex-nowrap">
                        {/* Alt kategori sayısı */}
                        {category.children && category.children.length > 0 && (
                            <Badge variant="outline" className="text-[10px] sm:text-xs">
                                {category.children.length} alt
                            </Badge>
                        )}

                        <Badge variant="outline" className="text-[10px] sm:text-xs">
                            {category.productCount} ürün
                        </Badge>

                        {/* Alt Kategori Ekle Butonu */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleNewSubCategory(category)}
                            className="h-7 sm:h-8 text-xs sm:text-sm px-2 sm:px-3"
                        >
                            <Plus className="h-3 w-3 mr-1" />
                            <span className="hidden sm:inline">Alt Ekle</span>
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8">
                                    <MoreHorizontal className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 sm:w-56">
                                <DropdownMenuItem onClick={() => handleNewSubCategory(category)} className="text-xs sm:text-sm">
                                    <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
                                    Alt Kategori Ekle
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEditCategory(category)} className="text-xs sm:text-sm">
                                    <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
                                    Düzenle
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="text-red-600 text-xs sm:text-sm"
                                    onClick={() => handleDeleteCategory(category.id)}
                                >
                                    <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
                                    Sil
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {expandedCategories.has(category.id) && category.children && (
                    <div className="ml-3 sm:ml-6">
                        {renderCategoryTree(category.children, level + 1)}
                    </div>
                )}
            </div>
        ))
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-gray-500 mt-2">Kategoriler yükleniyor...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="text-center">
                        <p className="text-red-600 mb-4">Hata: {error}</p>
                        <Button onClick={reload}>Tekrar Dene</Button>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                <div>
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Kategori Yönetimi</h1>
                    <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-1 sm:mt-2">Hiyerarşik kategori yapısını yönetin</p>
                </div>
                <Button onClick={handleNewCategory} className="w-full sm:w-auto h-10 sm:h-11 text-sm sm:text-base">
                    <Plus className="h-4 w-4 mr-2" />
                    Yeni Kategori
                </Button>
            </div>

            {/* Search and Filters */}
            <Card>
                <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-base sm:text-lg">Kategoriler</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                        {filteredCategories.length === tree.length
                            ? `Toplam ${tree.length} kategori bulundu`
                            : `${filteredCategories.length} kategori gösteriliyor (Toplam: ${tree.length})`
                        }
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Kategori ara (isim, açıklama, slug)..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 h-10 sm:h-11 text-sm sm:text-base"
                            />
                        </div>
                        <Button variant="outline" className="w-full sm:w-auto h-10 sm:h-11 text-sm sm:text-base">
                            <FolderTree className="h-4 w-4 mr-2" />
                            Ağaç Görünümü
                        </Button>
                    </div>

                    {/* Category List */}
                    <div className="space-y-2">
                        {filteredCategories.length === 0 ? (
                            <div className="text-center py-8 sm:py-12">
                                <FolderTree className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
                                {tree.length === 0 ? (
                                    <>
                                        <p className="text-gray-500 mb-4 text-sm sm:text-base">Henüz hiç kategori bulunmuyor</p>
                                        <Button onClick={handleNewCategory} size="lg" className="mt-2">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Yeni Kategori Ekle
                                        </Button>
                                    </>
                                ) : (
                                    <p className="text-gray-500 text-sm sm:text-base">Arama kriterlerine uygun kategori bulunamadı</p>
                                )}
                            </div>
                        ) : (
                            renderCategoryTree(filteredCategories)
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Category Modal */}
            <Dialog open={isModalOpen} onOpenChange={(open) => {
                if (!open) {
                    handleModalClose()
                }
            }}>
                <DialogContent className="w-full h-full max-w-full max-h-full sm:max-w-4xl sm:h-auto sm:max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-lg sm:text-xl">
                            {modalMode === 'create'
                                ? selectedParentCategory
                                    ? `"${selectedParentCategory.name}" Altına Yeni Kategori Ekle`
                                    : 'Yeni Kategori Ekle'
                                : `"${editingCategory?.name}" Kategorisini Düzenle`
                            }
                        </DialogTitle>
                        <DialogDescription className="text-xs sm:text-sm">
                            {modalMode === 'create'
                                ? selectedParentCategory
                                    ? `"${selectedParentCategory.name}" kategorisinin altına yeni bir kategori ekleyin.`
                                    : 'Yeni bir kategori oluşturun. Bu kategori ana kategori olacak.'
                                : 'Kategori bilgilerini düzenleyin.'
                            }
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mt-4">
                        <CategoryForm
                            category={editingCategory}
                            parentCategory={selectedParentCategory || undefined}
                            onSubmit={handleCategorySubmit}
                            onCancel={handleModalClose}
                            loading={isSubmitting}
                            mode={modalMode}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
