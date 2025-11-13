# Integrasi Database - Pemetaan UMKM

## 📋 Ringkasan Perubahan

Website ini telah berhasil diintegrasikan dengan **Supabase Database** untuk mengambil data UMKM secara real-time dari database alih-alih menggunakan data statis.

## 🔧 Konfigurasi Database

### Koneksi Supabase
File konfigurasi: `src/lib/supabase.ts`

Kredensial database disimpan di `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://jewxgvsdtbldbfkmhoox.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Struktur Tabel Database
Tabel: `umkm`

Kolom:
- `id` (int8) - Primary Key
- `nama_perusahaan` (text) - Nama UMKM
- `jenis` (text) - Kategori/jenis usaha
- `kecamatan` (text) - Lokasi kecamatan
- `alamat` (text) - Alamat lengkap
- `latitude` (float8) - Koordinat latitude
- `longitude` (float8) - Koordinat longitude
- `waktu_buka` (text) - Jam operasional

## 🔄 API Endpoint

### GET /api/umkm
File: `src/app/api/umkm/route.ts`

Endpoint ini:
1. Mengambil semua data UMKM dari tabel `umkm` di Supabase
2. Mentransformasi data ke format yang sesuai dengan aplikasi
3. Menangani error dengan graceful fallback
4. Memberikan default koordinat Tasikmalaya jika data koordinat tidak valid

**Response Format:**
```typescript
{
  no: number;
  name: string;
  category: string;
  district: string;
  description: string;
  address: string;
  phone: string;
  lat: number;
  lng: number;
  operatingHours: string;
}
```

## 📱 Halaman yang Menggunakan Database

### 1. Halaman Beranda (`src/app/page.tsx`)
**Perubahan:**
- Mengambil data UMKM dari API `/api/umkm`
- Menghitung statistik secara dinamis:
  - Total UMKM terdaftar
  - Jumlah kategori usaha
  - Jumlah wilayah tercakup
- Menampilkan loading state saat data dimuat

**Fitur:**
- Auto-update statistik berdasarkan data database real-time
- Loading skeleton untuk user experience yang lebih baik

### 2. Halaman Daftar UMKM (`src/app/daftar-umkm/page.tsx`)
**Perubahan:**
- Fetch data UMKM dari API saat halaman dimuat
- Filter dan pencarian bekerja dengan data dari database
- Kategori di-generate secara dinamis dari data aktual

**Fitur:**
- Loading spinner saat mengambil data
- Pencarian real-time berdasarkan nama, deskripsi, dan alamat
- Filter berdasarkan kategori
- Sorting berdasarkan nama atau kategori
- Toggle view: Grid / List

### 3. Halaman Peta UMKM (`src/app/peta-umkm/page.tsx`)
**Perubahan:**
- Menggunakan data dari API untuk peta interaktif
- Filter kategori dinamis dari database
- Marker di peta menggunakan koordinat dari database

**Fitur:**
- Peta interaktif dengan Leaflet
- Multiple map styles (OpenStreetMap, Esri, Satellite, dll)
- Filter berdasarkan kategori
- Marker dengan popup info lengkap

### 4. Komponen Peta (`src/components/Map.tsx` & `src/components/UMKMMap.tsx`)
**Perubahan:**
- Fetch data dari API endpoint
- Marker di-generate berdasarkan koordinat dari database
- Auto-update saat data berubah

**Fitur:**
- GPS location tracking
- Route calculation ke UMKM terdekat
- Clustering untuk performa optimal
- Custom marker colors berdasarkan kategori

## 🎯 Keuntungan Integrasi Database

### 1. **Data Real-Time**
- Website selalu menampilkan data terbaru dari database
- Tidak perlu rebuild/redeploy untuk update data

### 2. **Skalabilitas**
- Mudah menambah/edit/hapus data UMKM melalui database
- Mendukung ratusan hingga ribuan data UMKM

### 3. **Fleksibilitas**
- Admin bisa mengelola data langsung dari Supabase Dashboard
- Support untuk fitur CRUD (Create, Read, Update, Delete)

### 4. **Performa**
- Data di-cache oleh browser
- Lazy loading untuk komponen berat
- Efficient data fetching dengan React hooks

## 🚀 Cara Menambah Data UMKM

### Melalui Supabase Dashboard:
1. Login ke [Supabase Dashboard](https://supabase.com/dashboard)
2. Pilih project: `jewxgvsdtbldbfkmhoox`
3. Buka Table Editor → `umkm`
4. Klik "Insert" → "Insert row"
5. Isi data sesuai kolom:
   - `nama_perusahaan`: Nama UMKM
   - `jenis`: Kategori (Kuliner, Fashion, Kerajinan, dll)
   - `kecamatan`: Nama kecamatan
   - `alamat`: Alamat lengkap
   - `latitude`: Koordinat latitude (contoh: -7.3273)
   - `longitude`: Koordinat longitude (contoh: 108.2221)
   - `waktu_buka`: Jam operasional (contoh: "08:00 - 17:00")
6. Klik "Save"

### Melalui SQL Query (Bulk Insert):
```sql
INSERT INTO umkm (nama_perusahaan, jenis, kecamatan, alamat, latitude, longitude, waktu_buka)
VALUES 
  ('Warung Sate Pak Budi', 'Kuliner', 'Cipedes', 'Jl. Sutisna Senjaya No. 10', -7.3273, 108.2221, '10:00 - 22:00'),
  ('Toko Batik Bu Ani', 'Fashion', 'Cihideung', 'Jl. Ahmad Yani No. 25', -7.3301, 108.2187, '09:00 - 18:00');
```

## 📊 Monitoring Data

### Cek Data di Browser Console:
1. Buka Developer Tools (F12)
2. Buka tab Console
3. Website akan log informasi:
   - `Transformed data count: [jumlah]`
   - `First item:` [data UMKM pertama]

### Endpoint Testing:
```bash
curl http://localhost:3000/api/umkm
```

## ⚠️ Catatan Penting

1. **Koordinat GPS**: Pastikan latitude dan longitude valid untuk area Tasikmalaya
   - Default center: `-7.327, 108.22` (Tasikmalaya)
   - Format: latitude (-7.xxx), longitude (108.xxx)

2. **Kategori Konsisten**: Gunakan nama kategori yang sama untuk grouping yang benar
   - Contoh: "Kuliner", "Restoran", "Fashion", "Kerajinan", dll

3. **Data Validation**: API menangani data null/invalid dengan graceful fallback

4. **Environment Variables**: Jangan commit `.env.local` ke repository!

## 🔮 Pengembangan Selanjutnya

Fitur yang bisa ditambahkan:
- [ ] Form admin untuk CRUD data UMKM
- [ ] Upload foto UMKM ke Supabase Storage
- [ ] Rating & review system
- [ ] Filter berdasarkan jarak dari lokasi user
- [ ] Export data ke Excel/PDF
- [ ] Analytics dashboard untuk admin
- [ ] WhatsApp integration untuk kontak langsung

---

**Dibuat pada:** 13 November 2025  
**Teknologi:** Next.js 16, Supabase, TypeScript, Tailwind CSS, Leaflet
