# 🎬 SDÜ Film Kulübü

Modern ve kullanıcı dostu bir dizi/film keşif uygulaması. TVMaze API kullanılarak geliştirilmiştir.

### 🎬 [MovieApp'i Ziyaret Et](https://movie-app-blond-gamma.vercel.app/)

## ✨ Özellikler

### 🔍 Arama ve Filtreleme
- **Gelişmiş Arama**: Dizi ve film isimlerine göre arama yapın
- **Akıllı Filtreleme**: Tür, dil ve minimum puan filtreleri
- **Sıralama**: Sonuçlar en yüksek puandan en düşüğe otomatik sıralanır

### ∞ Sonsuz Kaydırma
- **Infinite Scroll**: Sayfayı aşağı kaydırdıkça otomatik yeni diziler yüklenir
- **Rastgele Diziler**: Sayfa açılışında rastgele dizilerle karşılaşın
- **Optimize Performans**: Duplicate önleme ve akıllı yükleme

### 📝 Gösterime Girecekler Listesi
- **Hızlı Ekleme**: Beğendiğiniz dizileri tek tıkla listeye ekleyin
- **LocalStorage**: Listeniz tarayıcıda saklanır, sayfa yenilense bile kaybolmaz
- **Liste Yönetimi**: Dizileri listeden kaldırma ve tüm listeyi temizleme

### 🎭 Detaylı İçerik Sayfası
- **Dizi Bilgileri**: Tam açıklama, puan, tür, dil ve daha fazlası
- **Bölüm Listesi**: Sezonlara göre gruplandırılmış tüm bölümler
- **Kaynak Bağlantıları**: Her bölüm için TVMaze bağlantısı

### 🎨 Modern Tasarım
- **Dark Mode**: Göz dostu koyu tema
- **Smooth Animasyonlar**: Hover ve geçiş efektleri
- **Responsive**: Mobil, tablet ve desktop uyumlu
- **Gradient Efektler**: Modern ve estetik görünüm

## 🚀 Teknolojiler

- **React 18**: Modern UI geliştirme
- **Vite**: Hızlı build ve development
- **React Router**: SPA routing
- **Axios**: HTTP istekleri
- **useReducer**: State yönetimi
- **LocalStorage**: Veri saklama
- **IntersectionObserver**: Infinite scroll
- **TVMaze API**: Dizi verileri

## 📦 Kurulum

```bash
# Projeyi klonlayın
git clone https://github.com/burak0aydin/MovieApp.git

# Klasöre girin
cd MovieApp

# Bağımlılıkları yükleyin
npm install

# Development sunucusunu başlatın
npm run dev
```

## 🎯 Kullanım

### Arama Yapmak
1. Arama kutusuna dizi ismini yazın
2. "Ara" butonuna basın veya Enter'a basın
3. Sonuçlar puanına göre sıralanır

### Filtreleme
1. Tür, Dil ve/veya Min. Puan seçin
2. "Filtrele" butonuna basın
3. Filtrelenmiş sonuçlar görüntülenir
4. Aşağı kaydırdıkça yeni diziler de filtreli gelir

### Gösterime Eklemek
1. Beğendiğiniz dizinin "Gösterime Ekle" butonuna tıklayın
2. Dizi sağ panelde görünür
3. Liste otomatik olarak kaydedilir

### Sıfırlama
- "Sıfırla" butonuna basarak tüm filtreleri ve aramayı temizleyin
- Yeni rastgele diziler yüklenir

## 📱 Ekran Görüntüleri

- **Anasayfa**: Rastgele diziler ve infinite scroll
- **Arama Sonuçları**: Filtrelenmiş ve sıralı sonuçlar
- **Detay Sayfası**: Dizi bilgileri ve bölümler
- **Gösterime Girecekler**: Yan panel listesi

## 🛠️ Geliştirme

### Proje Yapısı
```
src/
├── components/
│   ├── Home.jsx           # Ana sayfa
│   ├── ShowDetail.jsx     # Detay sayfası
│   ├── SearchBox.jsx      # Arama kutusu
│   ├── Filters.jsx        # Filtreleme bileşeni
│   ├── TVList.jsx         # Dizi listesi
│   ├── TVCard.jsx         # Dizi kartı
│   ├── WatchlistPanel.jsx # Gösterime girecekler
│   ├── Pagination.jsx     # Sayfalama
│   └── Footer.jsx         # Alt bilgi
├── reducer.js             # State yönetimi
├── App.jsx                # Ana uygulama
└── main.jsx               # Entry point
```

### State Yönetimi
- **useReducer**: Merkezi state yönetimi
- **Actions**: FETCH_INIT, FETCH_SUCCESS, FETCH_FAILURE, SET_QUERY, SET_FILTERS, APPLY_FILTERS, ADD_WATCHLIST, vb.
- **LocalStorage**: Watchlist persistence

### API Kullanımı
- **Arama**: `https://api.tvmaze.com/search/shows?q={query}`
- **Detay**: `https://api.tvmaze.com/shows/{id}`
- **Bölümler**: `https://api.tvmaze.com/shows/{id}/episodes`

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/AmazingFeature`)
3. Commit yapın (`git commit -m 'Add some AmazingFeature'`)
4. Push yapın (`git push origin feature/AmazingFeature`)
5. Pull Request açın

## 📄 Lisans

Bu proje eğitim amaçlı geliştirilmiştir.

## 👨‍💻 Geliştirici

**Burak Aydın**

## 🙏 Teşekkürler

- [TVMaze API](https://www.tvmaze.com/api) - Dizi verileri için
- [Vercel](https://vercel.com) - Hosting için
- [React](https://react.dev) - UI framework için

---

⭐ Projeyi beğendiyseniz yıldız vermeyi unutmayın!
