# FiyatSinyali - Frontend

Türkiye'nin önde gelen e-ticaret sitelerinden (Boyner, Beymen, Vakko vb.) ürün verilerini otomatik olarak toplayan, fiyat değişimlerini takip eden ve kullanıcılara sunan bir platformun frontend uygulaması.

## 🚀 Teknolojiler

- **React 18** - UI kütüphanesi
- **TypeScript** - Type safety
- **Vite** - Build tool ve dev server
- **React Router DOM** - Routing
- **Day.js** - Tarih işlemleri

## 📦 Kurulum

### Gereksinimler

- Node.js 18+ 
- npm veya yarn

### Adımlar

1. **Bağımlılıkları yükleyin:**
   ```bash
   npm install
   ```

2. **Environment dosyasını oluşturun:**
   ```bash
   cp .env.example .env
   ```

3. **Environment değişkenlerini düzenleyin:**
   ```env
   VITE_API_BASE_URL=http://localhost:5000
   ```

4. **Development server'ı başlatın:**
   ```bash
   npm run dev
   ```

   Uygulama `http://localhost:5173` adresinde çalışacaktır.

## 🛠️ Komutlar

```bash
# Development server
npm run dev

# Production build
npm run build

# Build önizleme
npm run preview

# Linting
npm run lint
```

## 📁 Proje Yapısı

```
src/
├── components/          # Reusable komponentler
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
├── layouts/            # Layout komponentleri
│   └── MainLayout.tsx
├── pages/              # Sayfa komponentleri
│   └── HomePage.tsx
├── services/           # API servisleri
│   └── api/
│       ├── client.ts
│       └── products/
├── types/              # TypeScript type definitions
│   ├── common/
│   └── product/
├── utils/              # Utility fonksiyonları
│   ├── formatters.ts
│   ├── storage.ts
│   └── helpers.ts
├── App.tsx             # Ana uygulama komponenti
├── routes.tsx          # Route konfigürasyonu
└── main.tsx            # Entry point
```

## 🎨 Özellikler

- ✅ TypeScript ile tam tip güvenliği
- ✅ Path aliases (@/ imports)
- ✅ Global loading state yönetimi
- ✅ Toast notification sistemi
- ✅ API client ile merkezi error handling
- ✅ BaseResponse unwrapping
- ✅ Responsive tasarım
- ✅ Modern ve temiz UI

## 📚 Dokümantasyon

Detaylı geliştirme standartları ve best practice'ler için [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md) dosyasına bakın.

## 🔗 Backend API

Bu frontend uygulama, FiyatSinyali backend API'si ile çalışır. Backend projesini çalıştırmayı unutmayın.

## 📝 Lisans

Bu proje özel bir projedir.
