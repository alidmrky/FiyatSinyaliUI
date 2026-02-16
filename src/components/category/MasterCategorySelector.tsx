import { useState, useEffect } from 'react'
import { useCategoryTree } from '@/hooks/useCategoryTree'
import type { CategoryTree } from '@/types/category'
import { ChevronRight, ChevronDown, Folder, FolderOpen, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface MasterCategorySelectorProps {
    value?: string
    onChange: (categoryId: string, categoryName: string) => void
    placeholder?: string
}

export function MasterCategorySelector({ value, onChange, placeholder = 'Master kategori seçin' }: MasterCategorySelectorProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedName, setSelectedName] = useState('')
    const { tree, loading } = useCategoryTree()
    const categoryTree = tree

    // Find selected category name when value changes
    useEffect(() => {
        if (value && categoryTree.length > 0) {
            const category = findCategoryById(categoryTree, value)
            if (category) {
                setSelectedName(category.name)
            }
        } else {
            setSelectedName('')
        }
    }, [value, categoryTree])

    const handleSelect = (category: CategoryTree) => {
        onChange(category.id, category.name)
        setSelectedName(category.name)
        setIsOpen(false)
    }

    const handleClear = () => {
        onChange('', '')
        setSelectedName('')
    }

    const findCategoryById = (categories: CategoryTree[], id: string): CategoryTree | null => {
        for (const category of categories) {
            if (category.id === id) return category
            if (category.children && category.children.length > 0) {
                const found = findCategoryById(category.children, id)
                if (found) return found
            }
        }
        return null
    }

    const filterCategories = (categories: CategoryTree[], term: string): CategoryTree[] => {
        if (!term) return categories

        return categories.reduce<CategoryTree[]>((acc, category) => {
            const matchesSearch = category.name.toLowerCase().includes(term.toLowerCase()) ||
                category.slug.toLowerCase().includes(term.toLowerCase())

            const filteredChildren = category.children ? filterCategories(category.children, term) : []

            if (matchesSearch || filteredChildren.length > 0) {
                acc.push({
                    ...category,
                    children: filteredChildren.length > 0 ? filteredChildren : category.children
                })
            }

            return acc
        }, [])
    }

    const filteredTree = filterCategories(categoryTree, searchTerm)

    return (
        <div>
            <div className="flex gap-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsOpen(true)}
                    className="flex-1 justify-start text-left font-normal"
                >
                    {selectedName || placeholder}
                </Button>
                {value && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClear}
                        size="sm"
                    >
                        Temizle
                    </Button>
                )}
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-2xl max-h-[80vh]">
                    <DialogHeader>
                        <DialogTitle>Master Kategori Seç</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        {/* Search */}
                        <Input
                            placeholder="Kategori ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />

                        {/* Category Tree */}
                        <div className="border rounded-lg max-h-[500px] overflow-y-auto">
                            {loading ? (
                                <div className="p-4 text-center text-gray-500">Yükleniyor...</div>
                            ) : filteredTree.length === 0 ? (
                                <div className="p-4 text-center text-gray-500">
                                    {searchTerm ? 'Kategori bulunamadı' : 'Henüz kategori yok'}
                                </div>
                            ) : (
                                <div className="p-2">
                                    {filteredTree.map((category) => (
                                        <CategoryTreeNode
                                            key={category.id}
                                            category={category}
                                            selectedId={value}
                                            onSelect={handleSelect}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

interface CategoryTreeNodeProps {
    category: CategoryTree
    level?: number
    selectedId?: string
    onSelect: (category: CategoryTree) => void
}

function CategoryTreeNode({ category, level = 0, selectedId, onSelect }: CategoryTreeNodeProps) {
    const [isExpanded, setIsExpanded] = useState(true)
    const hasChildren = category.children && category.children.length > 0
    const isSelected = category.id === selectedId

    return (
        <div>
            <div
                className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${isSelected
                    ? 'bg-blue-100 text-blue-900'
                    : 'hover:bg-gray-100'
                    }`}
                style={{ paddingLeft: `${level * 24 + 12}px` }}
                onClick={() => onSelect(category)}
            >
                {/* Expand/Collapse Button */}
                {hasChildren ? (
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            setIsExpanded(!isExpanded)
                        }}
                        className="p-0.5 hover:bg-gray-200 rounded"
                    >
                        {isExpanded ? (
                            <ChevronDown className="h-4 w-4 text-gray-600" />
                        ) : (
                            <ChevronRight className="h-4 w-4 text-gray-600" />
                        )}
                    </button>
                ) : (
                    <div className="w-5" />
                )}

                {/* Folder Icon */}
                {isExpanded && hasChildren ? (
                    <FolderOpen className="h-4 w-4 text-blue-500" />
                ) : (
                    <Folder className="h-4 w-4 text-gray-500" />
                )}

                {/* Category Name */}
                <span className="flex-1 text-sm font-medium">{category.name}</span>

                {/* Selected Indicator */}
                {isSelected && <Check className="h-4 w-4 text-blue-600" />}

                {/* Product Count */}
                <span className="text-xs text-gray-500">
                    {category.productCount} ürün
                </span>
            </div>

            {/* Children */}
            {isExpanded && hasChildren && (
                <div>
                    {category.children!.map((child) => (
                        <CategoryTreeNode
                            key={child.id}
                            category={child}
                            level={level + 1}
                            selectedId={selectedId}
                            onSelect={onSelect}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
