import React from 'react'
import { ChevronRight, Home } from 'lucide-react'
import type { Category } from '@/types/category'

interface CategoryBreadcrumbProps {
    category: Category
}

export function CategoryBreadcrumb({ category }: CategoryBreadcrumbProps) {
    return (
        <nav className="flex items-center gap-2 text-sm">
            <a href="/" className="text-gray-500 hover:text-gray-700">
                <Home className="w-4 h-4" />
            </a>

            {category.path.map((slug, index) => (
                <React.Fragment key={slug}>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                    <a
                        href={`/categories/${slug}`}
                        className={`
              ${index === category.path.length - 1
                                ? 'text-gray-900 font-medium'
                                : 'text-gray-500 hover:text-gray-700'}
            `}
                    >
                        {slug}
                    </a>
                </React.Fragment>
            ))}
        </nav>
    )
}
