# FiyatSinyali Web - Development Guide

> **Amaç:** Bu doküman, FiyatSinyali Web projesinde çalışacak tüm geliştiriciler için standartları, best practice'leri ve dikkat edilmesi gereken noktaları içerir.

---

## 📚 İçindekiler

1. [Proje Yapısı](#-proje-yapısı)
2. [Yeni Sayfa Ekleme](#-yeni-sayfa-ekleme)
3. [Constants Kullanımı](#-constants-kullanımı)
4. [Context ve State Yönetimi](#-context-ve-state-yönetimi)
5. [API Servisleri](#-api-servisleri)
6. [Komponent Geliştirme](#-komponent-geliştirme)
7. [Utility Fonksiyonları](#-utility-fonksiyonları)
8. [Type Definitions](#-type-definitions)
9. [Coding Standards](#-coding-standards)
10. [Git Workflow](#-git-workflow)

---

## 📁 Proje Yapısı

```
src/
├── components/          # Reusable komponentler
│   └── common/         # Genel komponentler (Loading, etc.)
├── config/             # Konfigürasyon dosyaları
│   ├── env.ts         # Environment variables
│   └── routes.config.tsx  # Route tanımlamaları
├── constants/          # Sabit değerler
│   ├── api.constants.ts
│   ├── app.constants.ts
│   └── storage.constants.ts
├── contexts/           # React Context providers
│   ├── LoadingContext.tsx
│   └── NotificationContext.tsx
├── hooks/              # Custom React hooks
├── layouts/            # Layout komponentleri
│   └── MainLayout.tsx
├── pages/              # Sayfa komponentleri
│   └── HomePage.tsx   # Ana sayfa
├── services/           # API servisleri
│   └── api/
│       ├── products/
│       └── client.ts
├── types/              # TypeScript type definitions
│   ├── common/
│   └── product/
├── utils/              # Utility fonksiyonları
│   ├── formatters.ts
│   ├── helpers.ts
│   └── storage.ts
└── routes.tsx          # Ana route konfigürasyonu
```

---

## 🆕 Yeni Sayfa Ekleme

### Adım 1: Sayfa Komponentini Oluştur

**Konum:** `src/pages/[kategori]/[SayfaAdi]Page.tsx`

```typescript
// src/pages/ProductsPage.tsx

const ProductsPage = () => {
    return (
        <div>
            <h2>Ürün Listesi</h2>
            <div style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '8px' }}>
                {/* Sayfa içeriği */}
            </div>
        </div>
    );
};

export default ProductsPage;
```

**📌 Önemli Notlar:**
- Sayfa adı **mutlaka** `Page` suffix'i ile bitmelidir (örn: `ProductsPage`)
- Tüm sayfalar → `src/pages/`

### Adım 2: Route Config'e Ekle

**Dosya:** `src/config/routes.config.tsx`

```typescript
import ProductsPage from '../pages/ProductsPage';

export const APP_ROUTES: RouteConfig[] = [
    // ... mevcut route'lar
    {
        path: '/products',
        element: <ProductsPage />,
        menu: {
            label: 'Ürünler',
            order: 2, // Menüdeki sıra
        },
    },
];
```

**📌 Önemli Notlar:**
- `menu` objesi varsa, sayfa sidebar menüsünde görünür
- `order`: Menüdeki sıralama (küçük değer = üstte)

### Adım 3: Hiyerarşik Menü Yapısı (Opsiyonel)

**Ne Zaman Kullanılır:** Birden fazla ilişkili sayfayı gruplamak için

**Örnek: İki seviyeli menü yapısı**

```typescript
// src/config/routes.config.tsx
export const APP_ROUTES: RouteConfig[] = [
    {
        path: '/products',
        element: <Navigate to="/products/list" replace />,
        menu: {
            label: 'Ürünler',
            order: 2,
        },
        children: [
            {
                path: '/products/list',
                element: <ProductListPage />,
                menu: {
                    label: 'Ürün Listesi',
                    order: 1,
                },
            },
            {
                path: '/products/favorites',
                element: <FavoritesPage />,
                menu: {
                    label: 'Favoriler',
                    order: 2,
                },
            },
        ],
    },
];
```

**📌 Önemli Notlar:**
- **Parent Route Element**: `<Navigate to="/first/child/path" replace />` ile ilk child'a yönlendir
- **Parent Menu**: `menu` property'si olmalı (label, order)
- **Child Routes**: Her child kendi `path` ve `element` değerine sahip

**Menü Görünümü:**
```
🏠 Ana Sayfa
📦 Ürünler
  ├─ Ürün Listesi
  └─ Favoriler
```

---

## 🔢 Constants Kullanımı

### API Endpoints

**Dosya:** `src/constants/api.constants.ts`

```typescript
export const API_ENDPOINTS = {
    PRODUCTS: {
        LIST: 'api/products/list',
        GET: 'api/products/get',
        SEARCH: 'api/products/search',
    },
    SITES: {
        LIST: 'api/sites/list',
    },
} as const;
```

**Kullanım:**
```typescript
import { API_ENDPOINTS } from '@/constants';

// ✅ Doğru
const response = await apiRequest(API_ENDPOINTS.PRODUCTS.LIST);

// ❌ Yanlış - Hard-coded string kullanma!
const response = await apiRequest('api/products/list');
```

### App Constants

**Dosya:** `src/constants/app.constants.ts`

```typescript
// Pagination
import { PAGINATION } from '@/constants';
const pageSize = PAGINATION.DEFAULT_PAGE_SIZE; // 20

// Date Formats
import { DATE_FORMATS } from '@/constants';
const formattedDate = dayjs(date).format(DATE_FORMATS.DISPLAY); // DD.MM.YYYY
```

### Storage Keys

**Dosya:** `src/constants/storage.constants.ts`

```typescript
import { STORAGE_KEYS } from '@/constants';

// ✅ Doğru
localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));

// ❌ Yanlış
localStorage.setItem('favorites', JSON.stringify(favorites));
```

**📌 Kural:** Asla hard-coded string kullanma! Her zaman constants'tan import et.

---

## 🌐 Context ve State Yönetimi

### 1. Loading Context

**Ne Zaman Kullanılır:** API çağrıları sırasında global loading göstermek için

```typescript
import { useLoading } from '@/contexts/LoadingContext';

const MyComponent = () => {
    const { showLoading, hideLoading } = useLoading();

    const handleSubmit = async () => {
        showLoading('Veriler kaydediliyor...');
        try {
            await api.saveData();
        } finally {
            hideLoading();
        }
    };
};
```

**📌 Önemli:**
- `showLoading()` çağrıldığında fullscreen loading overlay gösterilir
- **Mutlaka** `finally` bloğunda `hideLoading()` çağrılmalı

### 2. Notification Context

**Ne Zaman Kullanılır:** Kullanıcıya toast mesajları göstermek için

```typescript
import { useNotification } from '@/contexts/NotificationContext';

const MyComponent = () => {
    const { success, error, warning, info } = useNotification();

    const handleSave = async () => {
        try {
            await api.save();
            success('Kayıt başarılı!');
        } catch (err) {
            error('Kayıt sırasında hata oluştu!');
        }
    };
};
```

**Mesaj Tipleri:**
- `success()` - Başarılı işlemler için (yeşil)
- `error()` - Hata durumları için (kırmızı)
- `warning()` - Uyarılar için (sarı)
- `info()` - Bilgilendirme için (mavi)
```



---

## 🌐 API Servisleri

### Yeni Servis Oluşturma

**Konum:** `src/services/api/[domain]/[domain].service.ts`

```typescript
// src/services/api/workflow/workflow.service.ts
import { apiRequest } from '../client';
import { API_ENDPOINTS } from '@/constants';
import type { WorkflowListResponse, WorkflowDto } from '@/types';

export const workflowService = {
    /**
     * Get workflow list
     */
    async getList(): Promise<WorkflowListResponse> {
        return apiRequest<WorkflowListResponse>(
            API_ENDPOINTS.WORKFLOW.LIST
        );
    },

    /**
     * Get workflow by ID
     */
    async getById(id: string): Promise<WorkflowDto> {
        return apiRequest<WorkflowDto>(
            `${API_ENDPOINTS.WORKFLOW.GET}/${id}`
        );
    },

    /**
     * Create new workflow
     */
    async create(data: Partial<WorkflowDto>): Promise<WorkflowDto> {
        return apiRequest<WorkflowDto>(
            API_ENDPOINTS.WORKFLOW.CREATE,
            {
                method: 'POST',
                body: JSON.stringify(data),
            }
        );
    },
};
```

### Servis Index Dosyası

**Dosya:** `src/services/api/workflow/index.ts`

```typescript
export { workflowService } from './workflow.service';
```

### Ana Index'e Ekleme

**Dosya:** `src/services/api/index.ts`

```typescript
export { authService } from './auth';
export { workflowService } from './workflow';
```

### BaseResponse Yapısı

**❗ ÖNEMLİ:** Tüm API response'ları `BaseResponse<T>` ile sarmalanır.

**BaseResponse Interface:**
```typescript
interface BaseResponse<T> {
    IsSuccess: boolean;      // İşlem başarılı mı?
    Message: string;         // Response mesajı
    StatusCode: number;      // HTTP status code
    TrackingNumber: string;  // İzleme numarası
    Data: T;                 // Gerçek veri
}
```

**Servis İmplementasyonu:**
```typescript
// ❌ YANLIŞ - BaseResponse kullanmadan
export const myService = {
    async getList(): Promise<MyData[]> {
        return apiRequest<MyData[]>('api/MyEndpoint');
    }
};

// ✅ DOĞRU - BaseResponse ile
export const myService = {
    async getList(): Promise<MyData[]> {
        const response = await apiRequest<BaseResponse<MyData[]>>('api/MyEndpoint', {
            method: 'POST',
            body: JSON.stringify({}),
        });
        
        // Data property'sini döndür
        return response.Data || [];
    }
};
```

**Neden BaseResponse?**
- Backend tüm response'ları bu yapıda döner
- `IsSuccess` ile hata kontrolü yapılabilir
- `TrackingNumber` ile request takibi yapılabilir
- `Data` property'si gerçek veriyi içerir

### Kullanım

```typescript
import { workflowService } from '@/services/api';
import { useLoading } from '@/contexts/LoadingContext';
import { useNotification } from '@/contexts/NotificationContext';

const MyComponent = () => {
    const { showLoading, hideLoading } = useLoading();
    const { success, error } = useNotification();

    const loadWorkflows = async () => {
        showLoading('Workflow listesi yükleniyor...');
        try {
            const data = await workflowService.getList();
            setWorkflows(data.items);
            success('Workflow listesi yüklendi');
        } catch (err) {
            error('Workflow listesi yüklenemedi');
            console.error(err);
        } finally {
            hideLoading();
        }
    };
};
```

**📌 Best Practices:**
1. Her zaman `try-catch-finally` kullan
2. Loading state'i `showLoading/hideLoading` ile yönet
3. Başarı/hata durumlarında notification göster
4. Error'ları console'a logla

**🔐 Authentication:**
API client otomatik olarak `localStorage`'dan token okur ve her request'e `Authorization: Bearer {token}` header'ı ekler. Token, login işlemi sırasında `STORAGE_KEYS.AUTH_TOKEN` key'i ile kaydedilir.

```typescript
// API client otomatik olarak şunu yapar:
headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`, // Otomatik eklenir
}
```

**🌍 Türkçe Tarih Formatı:**
DatePicker ve diğer tarih komponentlerini Türkçe yapmak için:

```typescript
import { ConfigProvider } from '@turkcell/tfs-configprovider';
import { Row } from '@turkcell/tfs-row';
import { Col } from '@turkcell/tfs-col';
import locale from 'antd/locale/tr_TR';
import dayjs from 'dayjs';
import 'dayjs/locale/tr';

// dayjs locale'i ayarla
dayjs.locale('tr');

// Component'i ConfigProvider ile sar
return (
    <ConfigProvider locale={locale}>
        <RangePicker format="DD.MM.YYYY" />
    </ConfigProvider>
);
```

---

## 🧩 Komponent Geliştirme

### Turkcell Komponentleri Kullanımı

**❌ Yanlış - Direkt antd kullanma:**
```typescript
import { Button } from 'antd';
```

**✅ Doğru - Turkcell wrapper'ı kullan:**
```typescript
import { AntButton as Button } from '@turkcell/tfs-antbutton';
```

### Komponent Dosya Yapısı

```typescript
// src/components/common/MyComponent.tsx
import { AntCard as Card } from '@turkcell/tfs-antcard';
import type { CardProps } from '@turkcell/tfs-antdtypes';

interface MyComponentProps extends CardProps {
    title: string;
    onAction?: () => void;
}

/**
 * MyComponent - Açıklama
 * @param title - Başlık
 * @param onAction - İşlem callback'i
 */
const MyComponent = ({ title, onAction, ...cardProps }: MyComponentProps) => {
    return (
        <Card {...cardProps}>
            <h3>{title}</h3>
            {onAction && <button onClick={onAction}>İşlem Yap</button>}
        </Card>
    );
};

export default MyComponent;
```

**📌 Kurallar:**
1. Props interface'i **mutlaka** tanımla
2. JSDoc yorumları ekle
3. Default export kullan
4. Props spreading kullan (`...cardProps`)

---

## 🛠️ Utility Fonksiyonları

### Formatters

```typescript
import { formatCurrency, formatDate, formatPhoneNumber } from '@/utils/formatters';

// Para birimi
formatCurrency(1234.56); // "₺1.234,56"

// Tarih
formatDate(new Date()); // "02.02.2026"

// Telefon
formatPhoneNumber('5551234567'); // "(555) 123 45 67"
```

### Validators

```typescript
import { isValidEmail, isValidTCKN, isValidIBAN } from '@/utils/validators';

// Email
isValidEmail('test@example.com'); // true

// TCKN
isValidTCKN('12345678901'); // false (geçersiz)

// IBAN
isValidIBAN('TR330006100519786457841326'); // true
```

### Helpers

```typescript
import { debounce, groupBy, sortBy } from '@/utils/helpers';

// Debounce
const debouncedSearch = debounce(searchFunction, 500);

// Group by
const grouped = groupBy(users, 'department');

// Sort by
const sorted = sortBy(users, 'name', 'asc');
```

**📌 Kural:** Utility fonksiyonları **pure** olmalı (side-effect yok)

---

## 📝 Type Definitions

### Yeni Type Oluşturma

**Konum:** `src/types/[domain]/[type-name].types.ts`

```typescript
// src/types/product/product.types.ts

/**
 * Product DTO
 */
export interface Product {
    id: string;
    name: string;
    brand: string;
    currentPrice: number;
    originalPrice?: number;
    imageUrl: string;
    siteCode: string;
    categoryCode: string;
    url: string;
    lastUpdated: Date;
}

/**
 * Product list response
 */
export interface ProductListResponse {
    items: Product[];
    total: number;
    page: number;
    pageSize: number;
}
```

### Barrel Export

**Dosya:** `src/types/product/index.ts`

```typescript
export * from './product.types';
```

### Ana Index

**Dosya:** `src/types/index.ts`

```typescript
export * from './product';
export * from './common';
```

**📌 Kurallar:**
1. Her type için JSDoc yorumu ekle
2. Barrel export kullan
3. Enum'lar için string değerler kullan
4. Optional field'lar için `?` kullan

---

## 💻 Coding Standards

### 1. Naming Conventions

| Tip | Convention | Örnek |
|-----|-----------|-------|
| **Component** | PascalCase | `ProductListPage` |
| **Function** | camelCase | `getProductData` |
| **Variable** | camelCase | `productData` |
| **Constant** | UPPER_SNAKE_CASE | `API_BASE_URL` |
| **Type/Interface** | PascalCase | `Product` |

### 2. File Naming

| Tip | Convention | Örnek |
|-----|-----------|-------|
| **Component** | PascalCase.tsx | `ProductList.tsx` |
| **Page** | PascalCase + Page.tsx | `ProductListPage.tsx` |
| **Hook** | camelCase.ts | `useProducts.ts` |
| **Utility** | camelCase.ts | `formatters.ts` |
| **Type** | kebab-case.types.ts | `product.types.ts` |

### 3. Import Order

```typescript
// 1. React imports
import { useState, useEffect } from 'react';

// 2. External libraries
import { useNavigate } from 'react-router-dom';

// 3. Turkcell components
import { AntButton as Button } from '@turkcell/tfs-antbutton';

// 4. Internal components
import MyComponent from '@/components/MyComponent';

// 5. Hooks
import { usePermissions } from '@/hooks/usePermissions';

// 6. Utils
import { formatCurrency } from '@/utils/formatters';

// 7. Types
import type { WorkflowDto } from '@/types';

// 8. Constants
import { API_ENDPOINTS } from '@/constants';

// 9. Styles (eğer varsa)
import './styles.css';
```

### 4. TypeScript Best Practices

**✅ Doğru:**
```typescript
// Explicit return type
const getUserData = async (): Promise<UserDto> => {
    return await api.getUser();
};

// Type inference
const count = 5; // number (inferred)

// Interface over type for objects
interface User {
    name: string;
    age: number;
}
```

**❌ Yanlış:**
```typescript
// No return type
const getUserData = async () => {
    return await api.getUser();
};

// Using 'any'
const data: any = await api.getData();

// Type instead of interface
type User = {
    name: string;
};
```

### 5. React Best Practices

**✅ Doğru:**
```typescript
// Functional components
const MyComponent = () => {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
        // Effect logic
    }, [count]); // Dependencies
    
    return <div>{count}</div>;
};

// Memoization
const expensiveValue = useMemo(() => {
    return computeExpensiveValue(a, b);
}, [a, b]);
```

**❌ Yanlış:**
```typescript
// Class components (avoid)
class MyComponent extends React.Component {
    render() {
        return <div>Old style</div>;
    }
}

// Missing dependencies
useEffect(() => {
    doSomething(count);
}, []); // ❌ count eksik!
```

---

## 🔄 Git Workflow

### Branch Naming

```
feature/workflow-list-page
bugfix/login-error-handling
hotfix/production-crash
refactor/api-client-improvement
```

### Commit Messages

**Format:** `type(scope): message`

```bash
# Feature
git commit -m "feat(workflow): add workflow list page"

# Bug fix
git commit -m "fix(auth): resolve token expiration issue"

# Refactor
git commit -m "refactor(api): improve error handling"

# Documentation
git commit -m "docs(readme): update installation guide"

# Style
git commit -m "style(button): fix button alignment"
```

**Types:**
- `feat` - Yeni özellik
- `fix` - Bug fix
- `refactor` - Kod iyileştirme
- `docs` - Dokümantasyon
- `style` - Stil değişiklikleri
- `test` - Test ekleme/düzeltme
- `chore` - Build, dependency güncellemeleri

### Pull Request Checklist

- [ ] Kod TypeScript hatası vermiyor (`npm run build`)
- [ ] Lint hatası yok (`npm run lint`)
- [ ] Yeni sayfalar route config'e eklenmiş
- [ ] Constants kullanılmış (hard-coded string yok)
- [ ] Type definitions eklenmiş
- [ ] JSDoc yorumları eklenmiş
- [ ] Console.log'lar temizlenmiş

---

## 🚨 Sık Yapılan Hatalar

### ❌ Hard-coded Strings

```typescript
// ❌ Yanlış
const response = await fetch('https://api.example.com/users');
localStorage.setItem('token', token);

// ✅ Doğru
import { env } from '@/config/env';
import { STORAGE_KEYS } from '@/constants';

const response = await fetch(`${env.apiBaseUrl}/users`);
localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
```

### ❌ Direkt antd Kullanımı

```typescript
// ❌ Yanlış
import { Button } from 'antd';

// ✅ Doğru
import { AntButton as Button } from '@turkcell/tfs-antbutton';
```

### ❌ Loading/Notification Kullanmamak

```typescript
// ❌ Yanlış
const loadData = async () => {
    const data = await api.getData();
    setData(data);
};

// ✅ Doğru
const loadData = async () => {
    showLoading('Veriler yükleniyor...');
    try {
        const data = await api.getData();
        setData(data);
        success('Veriler yüklendi');
    } catch (err) {
        error('Veri yükleme hatası');
    } finally {
        hideLoading();
    }
};
```

### ❌ Yetki Kontrolü Yapmamak

```typescript
// ❌ Yanlış
<Button onClick={handleApprove}>Onayla</Button>

// ✅ Doğru
<PermissionButton
    resourceCode="WORKFLOW_DESIGNER"
    actionCommand="Approve"
    onClick={handleApprove}
>
    Onayla
</PermissionButton>
```

---

## 📞 Yardım ve Destek

### Dokümantasyon

- **Project Analysis:** `project_analysis.md` - Proje durumu ve eksikler
- **Development Guide:** Bu dosya - Geliştirme standartları
- **README:** `README.md` - Kurulum ve başlangıç

### Kod Örnekleri

- **Auth:** `src/pages/auth/LoginPage.tsx`
- **Protected Page:** `src/pages/protected/DashboardPage.tsx`
- **API Service:** `src/services/api/auth/auth.service.ts`
- **Permission Button:** `src/components/permissions/PermissionButton.tsx`

### Sorular

Herhangi bir sorunuz olduğunda:
1. Bu guide'ı kontrol edin
2. Mevcut kod örneklerine bakın
3. Team lead'e danışın

---

## ✅ Checklist - Yeni Sayfa Eklerken

- [ ] Sayfa komponenti oluşturuldu (`src/pages/[kategori]/[Sayfa]Page.tsx`)
- [ ] Route config'e eklendi (`src/config/routes.config.tsx`)
- [ ] ResourceCode tanımlandı (eğer korumalıysa)
- [ ] Menu icon ve label eklendi (eğer menüde görünecekse)
- [ ] Hiyerarşik yapı düşünüldü (tree view gerekli mi?)
- [ ] Type definitions oluşturuldu (`src/types/[domain]/`)
- [ ] API servisi oluşturuldu (eğer gerekiyorsa)
- [ ] Constants eklendi (eğer gerekiyorsa)
- [ ] Loading context kullanıldı
- [ ] Notification context kullanıldı
- [ ] Permission kontrolü yapıldı
- [ ] Turkcell komponentleri kullanıldı
- [ ] TypeScript hataları yok
- [ ] Lint hataları yok

---

**Son Güncelleme:** 02.02.2026
**Versiyon:** 1.0.0
