import { useState } from 'react'
import type { CategoryTree } from '@/types/category'
import { ChevronRight, ChevronDown, Folder, FolderOpen } from 'lucide-react'

interface CategoryTreeProps {
    categories: CategoryTree[]
    onSelect?: (category: CategoryTree) => void
    selectedId?: string
}

export function CategoryTreeComponent({ categories, onSelect, selectedId }: CategoryTreeProps) {
    return (
        <div className="space-y-1">
            {categories.map((category) => (
                <CategoryTreeNode
                    key={category.id}
                    category={category}
                    onSelect={onSelect}
                    selectedId={selectedId}
                />
            ))}
        </div>
    )
}

interface CategoryTreeNodeProps {
    category: CategoryTree
    onSelect?: (category: CategoryTree) => void
    selectedId?: string
    level?: number
}

function CategoryTreeNode({ category, onSelect, selectedId, level = 0 }: CategoryTreeNodeProps) {
    const [isExpanded, setIsExpanded] = useState(false)
    const hasChildren = category.children && category.children.length > 0
    const isSelected = category.id === selectedId

    return (
        <div>
            <div
                className={`
          flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer
          hover:bg-gray-100 transition-colors
          ${isSelected ? 'bg-blue-50 border border-blue-200' : ''}
        `}
                style={{ paddingLeft: `${level * 1.5 + 0.75}rem` }}
                onClick={() => {
                    if (hasChildren) setIsExpanded(!isExpanded)
                    onSelect?.(category)
                }}
            >
                {hasChildren ? (
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            setIsExpanded(!isExpanded)
                        }}
                        className="p-0.5 hover:bg-gray-200 rounded"
                    >
                        {isExpanded ? (
                            <ChevronDown className="w-4 h-4" />
                        ) : (
                            <ChevronRight className="w-4 h-4" />
                        )}
                    </button>
                ) : (
                    <div className="w-5" />
                )}
                {isExpanded && hasChildren ? (
                    <FolderOpen className="w-4 h-4 text-blue-500" />
                ) : (
                    <Folder className="w-4 h-4 text-gray-500" />
                )}
                <span className="flex-1 text-sm font-medium">{category.name}</span>

                {category.productCount > 0 && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                        {category.productCount}
                    </span>
                )}
            </div>
            {isExpanded && hasChildren && (
                <div className="mt-1">
                    {category.children!.map((child) => (
                        <CategoryTreeNode
                            key={child.id}
                            category={child}
                            onSelect={onSelect}
                            selectedId={selectedId}
                            level={level + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
