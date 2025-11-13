'use client';

import { useState, useMemo, useEffect } from 'react';
import Header from '@/components/Header';
import HeaderSection from '@/components/daftar-umkm/HeaderSection';
import FilterBar from '@/components/daftar-umkm/FilterBar';
import UMKMGrid from '@/components/daftar-umkm/UMKMGrid';
import UMKMList from '@/components/daftar-umkm/UMKMList';
import FooterSection from '@/components/beranda/FooterSection';

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

export default function DaftarUMKM() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [sortBy, setSortBy] = useState<'name' | 'category'>('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [umkms, setUmkms] = useState<UMKM[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data UMKM dari API database
    const fetchUMKMs = async () => {
      try {
        const response = await fetch('/api/umkm');
        const data = await response.json();
        setUmkms(data);
      } catch (error) {
        console.error('Error fetching UMKM data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUMKMs();
  }, []);

  const categories = ['Semua', ...Array.from(new Set(umkms.map(u => u.category)))];

  const filteredAndSortedUMKMs = useMemo(() => {
    let result = umkms.filter(umkm => {
      const matchesSearch = umkm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           umkm.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           umkm.address.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'Semua' || umkm.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    result.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else {
        return a.category.localeCompare(b.category);
      }
    });

    return result;
  }, [umkms, searchQuery, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Fixed Green Blur Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-500/30 rounded-full blur-3xl animate-pulse-green"></div>
        <div className="absolute top-1/3 right-20 w-80 h-80 bg-green-500/30 rounded-full blur-3xl animate-pulse-green-delay-1"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-teal-500/30 rounded-full blur-3xl animate-pulse-green-delay-2"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl animate-pulse-green"></div>
      </div>

      <Header />
      
      <main className="relative z-10 pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <HeaderSection />

          <FilterBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortBy={sortBy}
            setSortBy={setSortBy}
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            viewMode={viewMode}
            setViewMode={setViewMode}
            filteredCount={filteredAndSortedUMKMs.length}
            totalCount={umkms.length}
          />

          {viewMode === 'grid' ? (
            <UMKMGrid umkms={filteredAndSortedUMKMs} loading={loading} />
          ) : (
            <UMKMList umkms={filteredAndSortedUMKMs} loading={loading} />
          )}
        </div>
      </main>

      <FooterSection />
    </div>
  );
}
