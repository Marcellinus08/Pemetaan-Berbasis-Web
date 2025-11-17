import { CAT_COLOR } from '@/data/umkm';
import Image from 'next/image';

interface UMKM {
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
  gambar?: string | null;
}

interface UMKMGridProps {
  umkms: UMKM[];
  loading: boolean;
}

export default function UMKMGrid({ umkms, loading }: UMKMGridProps) {
  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-500 mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Memuat data UMKM dari database...</p>
      </div>
    );
  }

  if (umkms.length === 0) {
    return (
      <div className="text-center py-16">
        <span className="material-icons text-6xl text-gray-300 dark:text-gray-600 mb-4">search_off</span>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">UMKM Tidak Ditemukan</h3>
        <p className="text-gray-600 dark:text-gray-400">Coba ubah kata kunci pencarian atau filter kategori</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {umkms.map((umkm, index) => (
        <div
          key={index}
          className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transform hover:-translate-y-2 transition-all duration-300"
        >
          {/* Category stripe */}
          <div className="h-3" style={{ backgroundColor: CAT_COLOR[umkm.category] }}></div>
          
          <div className="p-6">
            {/* Header with icon/image */}
            <div className="flex items-start gap-4 mb-4">
              <div 
                className="w-20 h-20 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform overflow-hidden"
                style={{ backgroundColor: umkm.gambar ? 'transparent' : CAT_COLOR[umkm.category] }}
              >
                {umkm.gambar ? (
                  <Image 
                    src={umkm.gambar} 
                    alt={umkm.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                ) : (
                  <span className="material-icons text-gray-900 dark:text-white text-3xl">storefront</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-500 transition-colors truncate">
                  {umkm.name}
                </h3>
                <span
                  className="inline-block py-1 rounded-full text-xs font-semibold text-gray-900 dark:text-white"
                  style={{ backgroundColor: CAT_COLOR[umkm.category] }}
                >
                  {umkm.category}
                </span>
              </div>
            </div>
            
            <div className="space-y-3 mb-4">
              <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="material-icons text-sm mt-0.5 text-emerald-500">location_on</span>
                <span className="flex-1 line-clamp-2">{umkm.address}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="material-icons text-sm text-emerald-400">schedule</span>
                <span className="font-medium">{umkm.operatingHours}</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg font-semibold hover:from-emerald-600 hover:to-green-600 transition-all duration-300 shadow-md hover:shadow-lg">
                <span className="material-icons text-sm">directions</span>
                <span>Lokasi</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
