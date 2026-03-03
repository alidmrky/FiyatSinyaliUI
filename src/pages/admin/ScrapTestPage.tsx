import { useState, useMemo } from 'react'
import { useLoading } from '@/contexts/LoadingContext'
import { useNotification } from '@/contexts/NotificationContext'
import { scraperApi } from '@/services/api/scraper'
import type { ScrapTestResult } from '@/types/scraper.types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import JsonView from '@uiw/react-json-view'

// ─── Site options ──────────────────────────────────────────────────────────────
const SUPPORTED_SITES = ['Beymen', 'Boyner', 'Vakko'] as const

// ─── Field renderer ────────────────────────────────────────────────────────────
interface InfoRowProps {
    label: string
    value?: string | number | boolean | null
}

const InfoRow = ({ label, value }: InfoRowProps) => {
    if (value === undefined || value === null || value === '') return null
    return (
        <div className="py-2 border-b border-border/40 last:border-0">
            <span className="text-xs text-muted-foreground block mb-0.5">{label}</span>
            <span className="text-sm font-medium break-all">
                {typeof value === 'boolean' ? (value ? 'Evet' : 'Hayır') : String(value)}
            </span>
        </div>
    )
}

// ─── Page ──────────────────────────────────────────────────────────────────────

const ScrapTestPage = () => {
    const { showLoading, hideLoading } = useLoading()
    const { success, error: notifyError } = useNotification()

    const [siteName, setSiteName] = useState<string>('')
    const [productUrl, setProductUrl] = useState<string>('')
    const [result, setResult] = useState<ScrapTestResult | null>(null)

    const handleTest = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!siteName) {
            notifyError('Lütfen bir site seçin.')
            return
        }
        if (!productUrl.trim()) {
            notifyError("Lütfen ürün URL'sini girin.")
            return
        }

        showLoading('Scraper test çalıştırılıyor…')
        setResult(null)

        try {
            const data = await scraperApi.scrapTest.test({
                siteName: siteName,
                productUrl: productUrl.trim(),
            })
            setResult(data)
            success(`Test tamamlandı — ${data.durationMs}ms`)
        } catch (err: unknown) {
            const msg =
                err && typeof err === 'object' && 'message' in err
                    ? (err as { message: string }).message
                    : 'Bilinmeyen bir hata oluştu.'
            notifyError(msg)
        } finally {
            hideLoading()
        }
    }

    // ─── Pretty JSON ─────────────────────────────────────────────────────────
    const prettyJson = (raw: string) => {
        try {
            return JSON.stringify(JSON.parse(raw), null, 2)
        } catch {
            return raw
        }
    }

    // ─── Parsed JSON ─────────────────────────────────────────────────────────
    const parsedJson = useMemo(() => {
        if (!result?.scrapResponseJson) return null
        try {
            return JSON.parse(result.scrapResponseJson)
        } catch {
            return null
        }
    }, [result?.scrapResponseJson])

    const p = result?.mappedProduct

    return (
        <div className="space-y-6 p-6">
            {/* ── Header ── */}
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Scraper Test</h2>
                <p className="text-muted-foreground text-sm mt-1">
                    Belirtilen site ve ürün URL'si için anlık scrape testi yapın.
                    Sonuçlar veritabanına kaydedilmez.
                </p>
            </div>

            {/* ── Form — alanlar yan yana ── */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">Test Parametreleri</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleTest}>
                        <div className="flex flex-col sm:flex-row gap-4 items-end">
                            {/* Site seçimi */}
                            <div className="space-y-1.5 w-full sm:w-48 shrink-0">
                                <Label htmlFor="siteName">Site Adı</Label>
                                <Select value={siteName} onValueChange={setSiteName}>
                                    <SelectTrigger id="siteName">
                                        <SelectValue placeholder="Site seçin…" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {SUPPORTED_SITES.map((s) => (
                                            <SelectItem key={s} value={s}>
                                                {s}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Ürün URL */}
                            <div className="space-y-1.5 flex-1 min-w-0">
                                <Label htmlFor="productUrl">Ürün URL</Label>
                                <Input
                                    id="productUrl"
                                    placeholder="https://www.beymen.com/..."
                                    value={productUrl}
                                    onChange={(e) => setProductUrl(e.target.value)}
                                    className="font-mono text-sm"
                                />
                            </div>

                            {/* Buton */}
                            <Button type="submit" className="shrink-0 h-10">
                                Test Et
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* ── Results ── */}
            {result && (
                <div className="space-y-4">
                    {/* Özet badge'leri */}
                    <div className="flex items-center gap-3 flex-wrap">
                        <Badge variant="outline" className="text-sm px-3 py-1">
                            ⏱ {result.durationMs} ms
                        </Badge>
                        <Badge variant="outline" className="text-sm px-3 py-1">
                            🌐 {result.siteName}
                        </Badge>
                        {p ? (
                            <Badge className="text-sm px-3 py-1 bg-green-600 hover:bg-green-700">
                                ✓ Ürün çekildi
                            </Badge>
                        ) : (
                            <Badge variant="destructive" className="text-sm px-3 py-1">
                                ✗ Ürün eşlenemedi
                            </Badge>
                        )}
                    </div>

                    {/* ── Sol: Eşlenen Ürün | Sağ: Ham JSON ── */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">

                        {/* SOL — Eşlenen Ürün */}
                        <Card className="h-full">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base">Eşlenen Ürün</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {p ? (
                                    <div>
                                        <InfoRow label="Ürün Adı" value={p.displayName ?? p.name} />
                                        <InfoRow label="Marka" value={p.brandName} />
                                        <InfoRow label="Marka Kodu" value={p.brandCode} />
                                        <InfoRow label="Renk" value={p.color} />
                                        <InfoRow label="Renk Kodu" value={p.colorCode} />
                                        <InfoRow
                                            label="Güncel Fiyat"
                                            value={p.currentPrice != null ? `₺${p.currentPrice}` : undefined}
                                        />
                                        <InfoRow
                                            label="Orijinal Fiyat"
                                            value={p.originalPrice != null ? `₺${p.originalPrice}` : undefined}
                                        />
                                        <InfoRow
                                            label="İndirim"
                                            value={p.discount != null ? `%${p.discount}` : undefined}
                                        />
                                        <InfoRow label="Stok" value={p.inStock} />
                                        <InfoRow label="Site" value={p.siteName} />
                                        <InfoRow label="Kategori" value={p.categoryName} />
                                        <InfoRow label="Kategori Kodu" value={p.categoryCode} />
                                        <InfoRow label="External ID" value={p.externalId} />
                                        <InfoRow label="Durum" value={p.status} />
                                        <InfoRow label="Oluşturulma" value={p.createdAt} />
                                        <InfoRow label="Güncellenme" value={p.updatedAt} />
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground italic">
                                        Ürün eşleşmesi bulunamadı.
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {/* SAĞ — Scrape Sonucu */}
                        <Card className="h-full flex flex-col">
                            <CardHeader className="pb-2 border-b">
                                <CardTitle className="text-base">Scrape Sonucu</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0 flex-1 relative min-h-[400px]">
                                {result.scrapResponseJson ? (
                                    <Tabs defaultValue="tree" className="w-full h-full flex flex-col">
                                        <div className="px-4 pt-3 pb-2 border-b bg-muted/10">
                                            <TabsList>
                                                <TabsTrigger value="tree">Ağaç Görünümü</TabsTrigger>
                                                <TabsTrigger value="raw">Ham JSON</TabsTrigger>
                                            </TabsList>
                                        </div>
                                        <div className="flex-1 overflow-auto max-h-[600px]">
                                            <TabsContent value="tree" className="p-4 m-0 data-[state=inactive]:hidden">
                                                {parsedJson ? (
                                                    <div className="font-mono text-sm max-w-full">
                                                        <JsonView
                                                            value={parsedJson}
                                                            displayDataTypes={false}
                                                            displayObjectSize={true}
                                                            enableClipboard={true}
                                                            style={{ backgroundColor: 'transparent' }}
                                                        />
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-red-500">JSON parse edilemedi.</p>
                                                )}
                                            </TabsContent>
                                            <TabsContent value="raw" className="m-0 data-[state=inactive]:hidden">
                                                <pre className="p-4 text-xs leading-relaxed bg-muted/50 whitespace-pre-wrap break-all min-h-full">
                                                    {prettyJson(result.scrapResponseJson)}
                                                </pre>
                                            </TabsContent>
                                        </div>
                                    </Tabs>
                                ) : (
                                    <p className="text-sm text-muted-foreground italic p-6">
                                        Ham JSON verisi yok.
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ScrapTestPage
