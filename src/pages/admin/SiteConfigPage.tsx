import { useState } from 'react'
import { useSiteConfigs } from '@/hooks/useSiteConfigs'
import { SiteConfigService } from '@/services/api/siteConfig'
import type { SiteConfiguration, SiteCategory, CreateSiteConfigDto, UpdateSiteConfigDto, CreateSiteCategoryDto, UpdateSiteCategoryDto } from '@/types/siteConfig'
import { SiteConfigForm, SiteCategoryTree, SiteCategoryForm } from '@/components/siteConfig'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Settings, ChevronDown, ChevronRight } from 'lucide-react'

type ModalMode = 'create-site' | 'edit-site' | 'create-category' | 'edit-category' | null

export default function SiteConfigPage() {
    const { sites, loading, error, reload } = useSiteConfigs()
    const [searchTerm, setSearchTerm] = useState('')
    const [expandedSites, setExpandedSites] = useState<Set<string>>(new Set())
    const [modalMode, setModalMode] = useState<ModalMode>(null)
    const [selectedSite, setSelectedSite] = useState<SiteConfiguration | null>(null)
    const [selectedCategory, setSelectedCategory] = useState<SiteCategory | null>(null)
    const [parentCategory, setParentCategory] = useState<SiteCategory | null>(null)
    const [submitting, setSubmitting] = useState(false)

    // Filter sites by search term
    const filteredSites = sites.filter(site =>
        site.siteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        site.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        site.baseUrl.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Toggle site expansion
    const toggleSiteExpansion = (siteId: string) => {
        setExpandedSites(prev => {
            const next = new Set(prev)
            if (next.has(siteId)) {
                next.delete(siteId)
            } else {
                next.add(siteId)
            }
            return next
        })
    }

    // Site CRUD handlers
    const handleCreateSite = async (data: CreateSiteConfigDto) => {
        try {
            setSubmitting(true)
            await SiteConfigService.createSite(data)
            alert('Site başarıyla oluşturuldu!')
            setModalMode(null)
            reload()
        } catch (err) {
            alert('Site oluşturulurken hata oluştu: ' + (err instanceof Error ? err.message : 'Unknown error'))
        } finally {
            setSubmitting(false)
        }
    }

    const handleUpdateSite = async (data: UpdateSiteConfigDto) => {
        if (!selectedSite) return
        try {
            setSubmitting(true)
            await SiteConfigService.updateSite(selectedSite.id, data)
            alert('Site başarıyla güncellendi!')
            setModalMode(null)
            setSelectedSite(null)
            reload()
        } catch (err) {
            alert('Site güncellenirken hata oluştu: ' + (err instanceof Error ? err.message : 'Unknown error'))
        } finally {
            setSubmitting(false)
        }
    }

    const handleDeleteSite = async (site: SiteConfiguration) => {
        if (!confirm(`"${site.displayName}" sitesini silmek istediğinize emin misiniz?`)) return
        try {
            await SiteConfigService.deleteSite(site.id)
            alert('Site başarıyla silindi!')
            reload()
        } catch (err) {
            alert('Site silinirken hata oluştu: ' + (err instanceof Error ? err.message : 'Unknown error'))
        }
    }

    // Category CRUD handlers
    const handleCreateCategory = async (data: CreateSiteCategoryDto) => {
        if (!selectedSite) return
        try {
            setSubmitting(true)
            await SiteConfigService.addSiteCategory(selectedSite.id, data)
            alert('Kategori başarıyla eklendi!')
            setModalMode(null)
            setParentCategory(null)
            reload()
        } catch (err) {
            alert('Kategori eklenirken hata oluştu: ' + (err instanceof Error ? err.message : 'Unknown error'))
        } finally {
            setSubmitting(false)
        }
    }

    const handleUpdateCategory = async (data: UpdateSiteCategoryDto) => {
        if (!selectedSite || !selectedCategory) return
        try {
            setSubmitting(true)
            await SiteConfigService.updateSiteCategory(selectedSite.id, selectedCategory.id, data)
            alert('Kategori başarıyla güncellendi!')
            setModalMode(null)
            setSelectedCategory(null)
            reload()
        } catch (err) {
            alert('Kategori güncellenirken hata oluştu: ' + (err instanceof Error ? err.message : 'Unknown error'))
        } finally {
            setSubmitting(false)
        }
    }

    const handleDeleteCategory = async (category: SiteCategory) => {
        if (!selectedSite) return
        if (!confirm(`"${category.name}" kategorisini silmek istediğinize emin misiniz?`)) return
        try {
            await SiteConfigService.deleteSiteCategory(selectedSite.id, category.id)
            alert('Kategori başarıyla silindi!')
            reload()
        } catch (err) {
            alert('Kategori silinirken hata oluştu: ' + (err instanceof Error ? err.message : 'Unknown error'))
        }
    }

    if (loading) {
        return (
            <div className="p-6">
                <div className="text-center py-12">
                    <p className="text-gray-600">Yükleniyor...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800">Hata: {error}</p>
                    <Button onClick={reload} className="mt-2">Tekrar Dene</Button>
                </div>
            </div>
        )
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Site Konfigürasyonu</h2>
                    <p className="text-gray-600 mt-1">E-ticaret sitelerini ve kategorilerini yönetin</p>
                </div>
                <Button onClick={() => setModalMode('create-site')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Yeni Site
                </Button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                    placeholder="Site ara (isim, URL)..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Sites List */}
            <div className="space-y-4">
                {filteredSites.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <p className="text-gray-600">
                            {searchTerm ? 'Arama sonucu bulunamadı' : 'Henüz site eklenmemiş'}
                        </p>
                    </div>
                ) : (
                    filteredSites.map((site) => {
                        const isExpanded = expandedSites.has(site.id)
                        return (
                            <Card key={site.id}>
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => toggleSiteExpansion(site.id)}
                                                    className="p-1 hover:bg-gray-100 rounded"
                                                >
                                                    {isExpanded ? (
                                                        <ChevronDown className="h-5 w-5 text-gray-600" />
                                                    ) : (
                                                        <ChevronRight className="h-5 w-5 text-gray-600" />
                                                    )}
                                                </button>
                                                <div>
                                                    <CardTitle className="text-lg">{site.displayName}</CardTitle>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        <span className="font-mono">{site.siteName}</span> • {site.baseUrl}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant={site.isEnabled ? 'default' : 'outline'}>
                                                {site.isEnabled ? 'Aktif' : 'Pasif'}
                                            </Badge>
                                            <Badge variant="outline">{site.siteType}</Badge>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedSite(site)
                                                    setModalMode('edit-site')
                                                }}
                                            >
                                                <Settings className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDeleteSite(site)}
                                            >
                                                Sil
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>

                                {isExpanded && (
                                    <CardContent className="pt-0">
                                        <div className="border-t pt-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <h4 className="font-semibold text-gray-900">Kategoriler</h4>
                                                <Button
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedSite(site)
                                                        setParentCategory(null)
                                                        setModalMode('create-category')
                                                    }}
                                                >
                                                    <Plus className="h-4 w-4 mr-1" />
                                                    Kategori Ekle
                                                </Button>
                                            </div>

                                            {site.categories && site.categories.length > 0 ? (
                                                <SiteCategoryTree
                                                    categories={site.categories}
                                                    onEdit={(category) => {
                                                        setSelectedSite(site)
                                                        setSelectedCategory(category)
                                                        setModalMode('edit-category')
                                                    }}
                                                    onDelete={handleDeleteCategory}
                                                    onAddChild={(parent) => {
                                                        setSelectedSite(site)
                                                        setParentCategory(parent)
                                                        setModalMode('create-category')
                                                    }}
                                                />
                                            ) : (
                                                <p className="text-sm text-gray-500 text-center py-4">
                                                    Henüz kategori eklenmemiş
                                                </p>
                                            )}
                                        </div>

                                        {/* Site Stats */}
                                        <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t">
                                            <div className="text-center">
                                                <p className="text-2xl font-bold text-gray-900">{site.categories.length}</p>
                                                <p className="text-xs text-gray-600">Kategori</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-2xl font-bold text-gray-900">{site.scrapingIntervalMinutes}</p>
                                                <p className="text-xs text-gray-600">Dakika Aralık</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-2xl font-bold text-gray-900">{site.maxRetryAttempts}</p>
                                                <p className="text-xs text-gray-600">Max Retry</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-2xl font-bold text-gray-900">{site.requestDelayMs}ms</p>
                                                <p className="text-xs text-gray-600">Request Delay</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                )}
                            </Card>
                        )
                    })
                )}
            </div>

            {/* Modals */}
            <Dialog open={modalMode === 'create-site' || modalMode === 'edit-site'} onOpenChange={() => {
                setModalMode(null)
                setSelectedSite(null)
            }}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {modalMode === 'create-site' ? 'Yeni Site Ekle' : 'Site Düzenle'}
                        </DialogTitle>
                    </DialogHeader>
                    <SiteConfigForm
                        site={selectedSite || undefined}
                        onSubmit={modalMode === 'create-site'
                            ? (data) => handleCreateSite(data as CreateSiteConfigDto)
                            : (data) => handleUpdateSite(data as UpdateSiteConfigDto)}
                        onCancel={() => {
                            setModalMode(null)
                            setSelectedSite(null)
                        }}
                        loading={submitting}
                    />
                </DialogContent>
            </Dialog>

            <Dialog open={modalMode === 'create-category' || modalMode === 'edit-category'} onOpenChange={() => {
                setModalMode(null)
                setSelectedCategory(null)
                setParentCategory(null)
            }}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {modalMode === 'create-category' ? 'Yeni Kategori Ekle' : 'Kategori Düzenle'}
                        </DialogTitle>
                    </DialogHeader>
                    <SiteCategoryForm
                        category={selectedCategory || undefined}
                        parentCategory={parentCategory || undefined}
                        onSubmit={modalMode === 'create-category'
                            ? (data) => handleCreateCategory(data as CreateSiteCategoryDto)
                            : (data) => handleUpdateCategory(data as UpdateSiteCategoryDto)}
                        onCancel={() => {
                            setModalMode(null)
                            setSelectedCategory(null)
                            setParentCategory(null)
                        }}
                        loading={submitting}
                    />
                </DialogContent>
            </Dialog>
        </div>
    )
}
