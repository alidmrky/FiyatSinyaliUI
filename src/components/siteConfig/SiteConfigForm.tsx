import { useState } from 'react'
import type { SiteConfiguration, CreateSiteConfigDto, UpdateSiteConfigDto, SiteType } from '@/types/siteConfig'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface SiteConfigFormProps {
    site?: SiteConfiguration
    onSubmit: (data: CreateSiteConfigDto | UpdateSiteConfigDto) => void | Promise<void>
    onCancel: () => void
    loading?: boolean
}

export function SiteConfigForm({ site, onSubmit, onCancel, loading }: SiteConfigFormProps) {
    const [formData, setFormData] = useState({
        siteName: site?.siteName || '',
        displayName: site?.displayName || '',
        baseUrl: site?.baseUrl || '',
        siteType: site?.siteType || ('Retail' as SiteType),
        isEnabled: site?.isEnabled ?? true,
        scrapingIntervalMinutes: site?.scrapingIntervalMinutes || 60,
        maxRetryAttempts: site?.maxRetryAttempts || 3,
        requestDelayMs: site?.requestDelayMs || 1000,
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
    }

    const handleChange = (field: string, value: string | number | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Site Name */}
            <div>
                <Label htmlFor="siteName">Site Adı *</Label>
                <Input
                    id="siteName"
                    value={formData.siteName}
                    onChange={(e) => handleChange('siteName', e.target.value)}
                    placeholder="beymen"
                    required
                    disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-1">Teknik ad (küçük harf, boşluksuz)</p>
            </div>

            {/* Display Name */}
            <div>
                <Label htmlFor="displayName">Görünen Ad *</Label>
                <Input
                    id="displayName"
                    value={formData.displayName}
                    onChange={(e) => handleChange('displayName', e.target.value)}
                    placeholder="Beymen"
                    required
                    disabled={loading}
                />
            </div>

            {/* Base URL */}
            <div>
                <Label htmlFor="baseUrl">Base URL *</Label>
                <Input
                    id="baseUrl"
                    value={formData.baseUrl}
                    onChange={(e) => handleChange('baseUrl', e.target.value)}
                    placeholder="https://www.beymen.com"
                    required
                    disabled={loading}
                />
            </div>

            {/* Site Type */}
            <div>
                <Label htmlFor="siteType">Site Tipi</Label>
                <Select
                    value={formData.siteType}
                    onValueChange={(value) => handleChange('siteType', value)}
                    disabled={loading}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Retail">Retail</SelectItem>
                        <SelectItem value="Marketplace">Marketplace</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Is Enabled */}
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

            {/* Scraping Interval */}
            <div>
                <Label htmlFor="scrapingInterval">Scraping Aralığı (dakika)</Label>
                <Input
                    id="scrapingInterval"
                    type="number"
                    value={formData.scrapingIntervalMinutes}
                    onChange={(e) => handleChange('scrapingIntervalMinutes', parseInt(e.target.value))}
                    min="1"
                    disabled={loading}
                />
            </div>

            {/* Max Retry Attempts */}
            <div>
                <Label htmlFor="maxRetry">Maksimum Tekrar Sayısı</Label>
                <Input
                    id="maxRetry"
                    type="number"
                    value={formData.maxRetryAttempts}
                    onChange={(e) => handleChange('maxRetryAttempts', parseInt(e.target.value))}
                    min="0"
                    disabled={loading}
                />
            </div>

            {/* Request Delay */}
            <div>
                <Label htmlFor="requestDelay">İstek Gecikmesi (ms)</Label>
                <Input
                    id="requestDelay"
                    type="number"
                    value={formData.requestDelayMs}
                    onChange={(e) => handleChange('requestDelayMs', parseInt(e.target.value))}
                    min="0"
                    disabled={loading}
                />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                    İptal
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading ? 'Kaydediliyor...' : site ? 'Güncelle' : 'Oluştur'}
                </Button>
            </div>
        </form>
    )
}
