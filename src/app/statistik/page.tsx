'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { CAT_COLOR } from '@/data/umkm';

// Fallback colors jika kategori tidak ada di CAT_COLOR
const FALLBACK_COLORS = [
  '#F97316', '#8B5CF6', '#EC4899', '#10B981', '#3B82F6', 
  '#F59E0B', '#EF4444', '#14B8A6', '#6366F1', '#84CC16',
  '#F472B6', '#A78BFA', '#FB923C', '#FCD34D', '#818CF8'
];

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
}

interface CategoryStat {
  category: string;
  count: number;
  percentage: number;
  color: string;
}

interface DistrictStat {
  district: string;
  count: number;
}

export default function StatistikPage() {
  const [umkms, setUmkms] = useState<UMKM[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryStats, setCategoryStats] = useState<CategoryStat[]>([]);
  const [districtStats, setDistrictStats] = useState<DistrictStat[]>([]);
  const [totalUMKM, setTotalUMKM] = useState(0);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/umkm');
        const data: UMKM[] = await response.json();
        setUmkms(data);
        setTotalUMKM(data.length);

        // Hitung statistik per kategori
        const categoryCount: Record<string, number> = {};
        data.forEach(umkm => {
          categoryCount[umkm.category] = (categoryCount[umkm.category] || 0) + 1;
        });

        const categoryStatsData = Object.entries(categoryCount)
          .map(([category, count], index) => ({
            category,
            count,
            percentage: (count / data.length) * 100,
            color: CAT_COLOR[category] || FALLBACK_COLORS[index % FALLBACK_COLORS.length]
          }))
          .sort((a, b) => b.count - a.count);

        setCategoryStats(categoryStatsData);

        // Hitung statistik per kecamatan
        const districtCount: Record<string, number> = {};
        data.forEach(umkm => {
          districtCount[umkm.district] = (districtCount[umkm.district] || 0) + 1;
        });

        const districtStatsData = Object.entries(districtCount)
          .map(([district, count]) => ({ district, count }))
          .sort((a, b) => b.count - a.count);

        setDistrictStats(districtStatsData);
      } catch (error) {
        console.error('Error fetching UMKM data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const maxDistrictCount = Math.max(...districtStats.map(d => d.count), 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Fixed Green Blur Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-500/30 rounded-full blur-3xl animate-pulse-green"></div>
        <div className="absolute top-1/3 right-20 w-80 h-80 bg-green-500/30 rounded-full blur-3xl animate-pulse-green-delay-1"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-teal-500/30 rounded-full blur-3xl animate-pulse-green-delay-2"></div>
      </div>

      <Header />
      
      <main className="relative z-10 pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-400/20 to-green-400/20 border border-emerald-400/30 rounded-full backdrop-blur-sm mb-6">
              <span className="material-icons text-emerald-600 dark:text-emerald-500 text-sm">bar_chart</span>
              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-500">Analisis Data</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
              <span className="bg-gradient-to-r from-emerald-500 to-green-500 bg-clip-text text-transparent">Statistik</span> UMKM
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Data dan analisis UMKM di Tasikmalaya
            </p>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-500 mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Memuat data statistik...</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <span className="material-icons text-emerald-500 text-4xl">store</span>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalUMKM}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total UMKM</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <span className="material-icons text-emerald-500 text-4xl">category</span>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">{categoryStats.length}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Kategori</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <span className="material-icons text-emerald-500 text-4xl">location_city</span>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">{districtStats.length}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Kecamatan</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Categories */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <span className="material-icons text-emerald-500">emoji_events</span>
                  Top 5 Kategori Terpopuler
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {categoryStats.slice(0, 5).map((stat, index) => (
                    <div 
                      key={index}
                      className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 text-center border-2 border-gray-200 dark:border-gray-600 hover:scale-105 transition-transform"
                    >
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <div 
                        className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center"
                        style={{ backgroundColor: stat.color }}
                      >
                        <span className="material-icons text-white text-2xl">storefront</span>
                      </div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1">{stat.category}</h3>
                      <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-500">{stat.count}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">UMKM</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category Statistics - Compact Pie Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="material-icons text-emerald-500">pie_chart</span>
                  Distribusi per Kategori
                </h2>

                <div className="flex flex-col gap-6 items-center">
                  {/* Compact Pie Chart - Top */}
                  <div className="relative flex items-center justify-center">
                    <svg viewBox="0 0 200 200" className="w-56 h-56">
                      {(() => {
                        let currentAngle = 0;
                        return categoryStats.map((stat, index) => {
                          const angle = (stat.percentage / 100) * 360;
                          const startAngle = currentAngle;
                          currentAngle += angle;
                          
                          const startRad = (startAngle - 90) * (Math.PI / 180);
                          const endRad = (currentAngle - 90) * (Math.PI / 180);
                          
                          const x1 = 100 + 85 * Math.cos(startRad);
                          const y1 = 100 + 85 * Math.sin(startRad);
                          const x2 = 100 + 85 * Math.cos(endRad);
                          const y2 = 100 + 85 * Math.sin(endRad);
                          
                          const largeArc = angle > 180 ? 1 : 0;
                          const isHovered = hoveredCategory === stat.category;
                          
                          return (
                            <path
                              key={index}
                              d={`M 100 100 L ${x1} ${y1} A 85 85 0 ${largeArc} 1 ${x2} ${y2} Z`}
                              fill={stat.color}
                              className="transition-all duration-300 cursor-pointer"
                              style={{ 
                                filter: isHovered ? 'brightness(1.1)' : 'brightness(1)',
                                opacity: hoveredCategory && !isHovered ? 0.4 : 1,
                              }}
                              onMouseEnter={() => setHoveredCategory(stat.category)}
                              onMouseLeave={() => setHoveredCategory(null)}
                            />
                          );
                        });
                      })()}
                    </svg>

                    {/* Compact Tooltip */}
                    {hoveredCategory && (() => {
                      const stat = categoryStats.find(s => s.category === hoveredCategory);
                      if (!stat) return null;
                      return (
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
                          <div className="bg-gray-900 text-white rounded-lg shadow-xl px-3 py-2 text-xs text-center">
                            <div className="font-bold">{stat.category}</div>
                            <div className="text-emerald-400">{stat.percentage.toFixed(1)}%</div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Compact Legend - Bottom (3 columns) */}
                  <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {categoryStats.map((stat, index) => {
                      const isHovered = hoveredCategory === stat.category;
                      return (
                        <div 
                          key={index} 
                          className="flex items-center gap-2 p-2 rounded-lg transition-all duration-200 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                          style={{
                            opacity: hoveredCategory && !isHovered ? 0.4 : 1
                          }}
                          onMouseEnter={() => setHoveredCategory(stat.category)}
                          onMouseLeave={() => setHoveredCategory(null)}
                        >
                          <div 
                            className="w-3 h-3 rounded-sm flex-shrink-0"
                            style={{ backgroundColor: stat.color }}
                          ></div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-gray-900 dark:text-white truncate">
                              {stat.category}
                            </div>
                            <div className="text-[10px] text-gray-500 dark:text-gray-400">
                              {stat.count} UMKM
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* District Statistics - Bar Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <span className="material-icons text-emerald-500">location_on</span>
                  Distribusi per Kecamatan
                </h2>

                <div className="space-y-6">
                  {/* Bar Chart */}
                  <div className="flex items-end justify-between gap-2 px-4" style={{ height: '256px' }}>
                    {districtStats.map((stat, index) => {
                      const heightPercentage = (stat.count / maxDistrictCount) * 100;
                      const heightInPx = (heightPercentage / 100) * 256; // 256px = container height
                      
                      return (
                        <div key={index} className="flex-1 flex flex-col items-center gap-2 group" style={{ height: '100%', justifyContent: 'flex-end' }}>
                          {/* Value label on top */}
                          <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity z-10" style={{ bottom: `${heightInPx + 40}px` }}>
                            <div className="bg-emerald-600 text-white text-xs font-bold px-2 py-1 rounded whitespace-nowrap">
                              {stat.count} UMKM
                            </div>
                          </div>
                          
                          {/* Bar */}
                          <div 
                            className="w-full bg-gradient-to-t from-emerald-500 to-green-400 rounded-t-lg transition-all duration-1000 ease-out hover:from-emerald-600 hover:to-green-500 cursor-pointer relative overflow-hidden group-hover:shadow-lg flex items-start justify-center pt-2"
                            style={{ 
                              height: `${heightInPx}px`,
                              minHeight: '30px'
                            }}
                          >
                            {/* Shine effect */}
                            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent transform -translate-y-full group-hover:translate-y-full transition-transform duration-1000"></div>
                            
                            {/* Count label inside bar */}
                            <span className="text-white font-bold text-sm relative z-10">
                              {stat.count}
                            </span>
                          </div>
                          
                          {/* District name */}
                          <div className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center w-full truncate mt-2" title={stat.district}>
                            {stat.district}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Summary table */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                    {districtStats.map((stat, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <span className="text-sm font-medium text-gray-900 dark:text-white truncate mr-2">{stat.district}</span>
                        <span className="text-sm font-bold text-emerald-600 dark:text-emerald-500">{stat.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 mt-16">
        <div className="container mx-auto max-w-6xl text-center">
          <p className="text-gray-400">© 2025 UMKM Tasikmalaya. Mendukung pertumbuhan ekonomi lokal.</p>
        </div>
      </footer>
    </div>
  );
}
