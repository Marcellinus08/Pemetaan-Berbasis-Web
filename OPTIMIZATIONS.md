# Optimasi Performance Web UMKM Tasikmalaya

## 📋 Ringkasan Optimasi

Dokumen ini menjelaskan berbagai optimasi yang telah diimplementasikan untuk meningkatkan performance website, terutama dalam menangani data UMKM yang banyak.

## 🚀 Optimasi yang Diimplementasikan

### 1. **Image Lazy Loading dengan Blur Placeholder**
- **File**: `UMKMGrid.tsx`, `UMKMList.tsx`, `peta-umkm/page.tsx`
- **Manfaat**: 
  - Gambar dimuat hanya saat terlihat di viewport
  - Blur placeholder memberikan UX yang lebih baik
  - Mengurangi initial page load time
- **Implementasi**:
  ```tsx
  <Image 
    loading="lazy"
    placeholder="blur"
    blurDataURL="data:image/svg+xml;base64,..."
  />
  ```

### 2. **Search Input Debouncing**
- **File**: `FilterBar.tsx`
- **Manfaat**:
  - Mengurangi jumlah re-render saat user mengetik
  - API calls hanya dilakukan setelah user selesai mengetik (300ms delay)
  - Meningkatkan responsiveness UI
- **Implementasi**:
  ```tsx
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch]);
  ```

### 3. **React.memo untuk Prevent Unnecessary Re-renders**
- **File**: `UMKMGrid.tsx`, `UMKMList.tsx`, `FilterBar.tsx`
- **Manfaat**:
  - Komponen hanya re-render jika props berubah
  - Mengurangi CPU usage
  - Meningkatkan responsiveness aplikasi
- **Implementasi**:
  ```tsx
  export default memo(UMKMGrid);
  ```

### 4. **Server-Side Pagination & Filtering (Backward Compatible)**
- **File**: `api/umkm/route.ts`
- **Manfaat**:
  - Mengurangi data transfer dari server ke client
  - Client hanya menerima data yang dibutuhkan
  - Mengurangi memory usage di browser
- **API Params** (Optional):
  - `page`: Nomor halaman (default: 1)
  - `limit`: Jumlah item per halaman (default: 50)
  - `category`: Filter by kategori
  - `search`: Search by nama atau alamat
- **Response Format**:
  - **Tanpa query params**: Returns `Array` untuk backward compatibility
    ```json
    [{ "no": 1, "name": "..." }, ...]
    ```
  - **Dengan query params**: Returns `Object` dengan pagination
    ```json
    {
      "data": [...],
      "pagination": {
        "page": 1,
        "limit": 50,
        "total": 150,
        "totalPages": 3
      }
    }
    ```

### 5. **Loading Skeleton untuk Better UX**
- **File**: `UMKMGrid.tsx`, `UMKMList.tsx`
- **Manfaat**:
  - User melihat placeholder saat data loading
  - Perceived performance lebih baik
  - Mengurangi layout shift
- **Implementasi**: Skeleton dengan animate-pulse yang matching dengan layout asli

### 6. **Data Caching Hook**
- **File**: `hooks/useUMKMCache.ts`
- **Manfaat**:
  - Data di-cache selama 5 menit
  - Mengurangi API calls yang tidak perlu
  - Instant response untuk data yang sudah di-cache
- **Usage**:
  ```tsx
  const { umkms, loading, pagination, invalidateCache } = useUMKMCache(
    page, 
    limit, 
    category, 
    search
  );
  ```

## 📊 Performa Sebelum & Sesudah

### Sebelum Optimasi:
- ❌ Load semua data UMKM sekaligus (bisa 100+ items)
- ❌ Semua gambar di-load langsung
- ❌ Re-render pada setiap keystroke di search
- ❌ Tidak ada caching
- ❌ Loading indicator sederhana

### Sesudah Optimasi:
- ✅ Load data per halaman (9-50 items)
- ✅ Gambar lazy-loaded dengan blur placeholder
- ✅ Search dengan debouncing (300ms)
- ✅ Data di-cache 5 menit
- ✅ Skeleton loading yang informatif
- ✅ Reduced re-renders dengan React.memo

## 🎯 Best Practices yang Digunakan

1. **Progressive Enhancement**: Website tetap berfungsi tanpa JavaScript
2. **Graceful Degradation**: Fallback untuk error handling
3. **Accessibility**: Semantic HTML dan ARIA labels
4. **Performance Budget**: Target < 3s First Contentful Paint
5. **Code Splitting**: Dynamic imports untuk komponen berat (Leaflet Map)

## 🔧 Cara Menggunakan API Pagination

### Backward Compatibility
API mendukung 2 format response:

**1. Format Lama (Array) - Tanpa Query Params:**
```javascript
// Request tanpa params - returns array
const response = await fetch('/api/umkm');
const data = await response.json();
// data = [{...}, {...}, ...]
```

**2. Format Baru (Object) - Dengan Query Params:**
```javascript
// Get page 2 with 20 items
const response = await fetch('/api/umkm?page=2&limit=20&category=Kuliner');
const result = await response.json();
// result = { data: [...], pagination: {...} }

// Search UMKM
const response = await fetch('/api/umkm?search=toko');
const result = await response.json();
// result = { data: [...], pagination: {...} }
```

### Contoh Response dengan Pagination:
```json
{
  "data": [
    {
      "no": 1,
      "name": "Toko ABC",
      "category": "Kuliner",
      ...
    }
  ],
  "pagination": {
    "page": 2,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

## 📈 Metrics untuk Monitor

1. **First Contentful Paint (FCP)**: < 1.8s
2. **Largest Contentful Paint (LCP)**: < 2.5s
3. **Time to Interactive (TTI)**: < 3.8s
4. **Total Blocking Time (TBT)**: < 200ms
5. **Cumulative Layout Shift (CLS)**: < 0.1

## 🔄 Future Optimizations (Optional)

1. **Virtual Scrolling**: Untuk list yang sangat panjang
2. **Service Worker**: Offline support dan caching
3. **WebP Images**: Konversi gambar ke format yang lebih efisien
4. **CDN**: Serve static assets dari CDN
5. **Database Indexing**: Optimasi query di Supabase
6. **Compression**: Gzip/Brotli compression di server

## 📝 Notes

- Cache duration dapat disesuaikan di `useUMKMCache.ts` (default: 5 menit)
- Debounce delay dapat disesuaikan di `FilterBar.tsx` (default: 300ms)
- Items per page dapat disesuaikan sesuai kebutuhan
- Blur placeholder dapat diganti dengan gambar custom yang lebih kecil

---

**Last Updated**: November 2025
**Maintainer**: GitHub Copilot
