interface SummaryCardsProps {
  totalUMKM: number;
  categoriesCount: number;
  districtsCount: number;
}

export default function SummaryCards({ totalUMKM, categoriesCount, districtsCount }: SummaryCardsProps) {
  return (
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
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{categoriesCount}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Kategori</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <span className="material-icons text-emerald-500 text-4xl">location_city</span>
          <div className="text-right">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{districtsCount}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Kecamatan</p>
          </div>
        </div>
      </div>
    </div>
  );
}
