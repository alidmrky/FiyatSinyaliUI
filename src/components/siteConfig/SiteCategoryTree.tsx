import { useState } from 'react'
import type { SiteCategory } from '@/types/siteConfig'
import { ChevronRight, ChevronDown, Folder, FolderOpen, MoreVertical } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface SiteCategoryTreeProps {
    categories: SiteCategory[]
    onEdit?: (category: SiteCategory) => void
    onDelete?: (category: SiteCategory) => void
    onAddChild?: (parentCategory: SiteCategory) => void
}

export function SiteCategoryTree({ categories, onEdit, onDelete, onAddChild }: SiteCategoryTreeProps) {
    return (
        <div className="space-y-1">
            {categories.map((category) => (
                <SiteCategoryNode
                    key={category.id}
                    category={category}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onAddChild={onAddChild}
                />
            ))}
        </div>
    )
}

interface SiteCategoryNodeProps {
    category: SiteCategory
    level?: number
    onEdit?: (category: SiteCategory) => void
    onDelete?: (category: SiteCategory) => void
    onAddChild?: (parentCategory: SiteCategory) => void
}

function SiteCategoryNode({ category, level = 0, onEdit, onDelete, onAddChild }: SiteCategoryNodeProps) {
    const [isExpanded, setIsExpanded] = useState(true)
    const hasChildren = category.children && category.children.length > 0

    return (
        <div>
            <div
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg group"
                style={{ paddingLeft: `${level * 24 + 12}px` }}
            >
                {/* Expand/Collapse Button */}
                {hasChildren ? (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
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
                <span className="flex-1 text-sm font-medium text-gray-900">{category.name}</span>

                {/* Badges */}
                <div className="flex items-center gap-2">
                    {!category.isEnabled && (
                        <Badge variant="outline" className="text-xs">
                            Pasif
                        </Badge>
                    )}
                    {category.isLeaf && (
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                            Leaf
                        </Badge>
                    )}
                    {category.masterCategoryId && (
                        <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                            Mapped
                        </Badge>
                    )}
                </div>

                {/* Actions Menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="p-1 hover:bg-gray-200 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical className="h-4 w-4 text-gray-600" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {onEdit && (
                            <DropdownMenuItem onClick={() => onEdit(category)}>
                                Düzenle
                            </DropdownMenuItem>
                        )}
                        {onAddChild && !category.isLeaf && (
                            <DropdownMenuItem onClick={() => onAddChild(category)}>
                                Alt Kategori Ekle
                            </DropdownMenuItem>
                        )}
                        {onDelete && (
                            <DropdownMenuItem
                                onClick={() => onDelete(category)}
                                className="text-red-600"
                            >
                                Sil
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Children */}
            {isExpanded && hasChildren && (
                <div>
                    {category.children!.map((child) => (
                        <SiteCategoryNode
                            key={child.id}
                            category={child}
                            level={level + 1}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onAddChild={onAddChild}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
