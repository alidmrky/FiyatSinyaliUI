import { useState, useEffect } from 'react'
import { CategoryService } from '@/services/api/categories'
import type { CategoryListItem } from '@/types/category'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

interface CategorySelectorProps {
    value?: string
    onChange: (categoryId: string) => void
    placeholder?: string
}

export function CategorySelector({
    value,
    onChange,
    placeholder = 'Kategori seçin'
}: CategorySelectorProps) {
    const [categories, setCategories] = useState<CategoryListItem[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadCategories()
    }, [])

    const loadCategories = async () => {
        try {
            setLoading(true)
            // Load ALL categories so we can see the full hierarchy
            const data = await CategoryService.getAllCategories()
            setCategories(data)
        } catch (error) {
            console.error('Error loading categories:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleValueChange = (newValue: string) => {
        // Convert 'none' back to empty string
        onChange(newValue === 'none' ? '' : newValue)
    }

    return (
        <Select value={value || 'none'} onValueChange={handleValueChange} disabled={loading}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder={loading ? 'Yükleniyor...' : placeholder} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="none">
                    {loading ? 'Yükleniyor...' : placeholder}
                </SelectItem>
                {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                        {'—'.repeat(category.level)} {category.name} ({category.productCount})
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
