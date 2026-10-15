import React from 'react';
import { VehicleFilterState } from '../types/vehicle';
import { Search, RotateCcw, SlidersHorizontal } from 'lucide-react';

interface VehicleFilterProps {
  filter: VehicleFilterState;
  setFilter: React.Dispatch<React.SetStateAction<VehicleFilterState>>;
  resetFilter: () => void;
  brands: string[];
  locations: string[];
  categories: string[];
  totalMatches: number;
  isMobileOpen?: boolean;
  setIsMobileOpen?: (open: boolean) => void;
}

export const VehicleFilter: React.FC<VehicleFilterProps> = ({
  filter,
  setFilter,
  resetFilter,
  brands,
  locations,
  categories,
  totalMatches,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const handleChange = (key: keyof VehicleFilterState, value: any) => {
    setFilter((prev) => ({ ...prev, [key]: value }));
  };

  const activeFilterCount = [
    filter.brand,
    filter.minPrice,
    filter.maxPrice,
    filter.condition,
    filter.year,
    filter.transmission,
    filter.fuel_type,
    filter.location,
    filter.category,
    filter.availability,
    filter.search,
  ].filter(Boolean).length;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      
      {/* Header / Active status */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 gap-2">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-amber-500" />
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
            Filter Inventory
          </h3>
          {activeFilterCount > 0 && (
            <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
              {activeFilterCount} active
            </span>
          )}
        </div>

        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={resetFilter}
            className="flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All</span>
          </button>
        )}
      </div>

      <div className="space-y-4 pt-4 text-xs">
        
        {/* Search input */}
        <div>
          <label className="block text-slate-700 font-semibold mb-1.5">Search Vehicles</label>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filter.search}
              onChange={(e) => handleChange('search', e.target.value)}
              placeholder="Search by brand, model, or keyword..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white transition-all text-slate-800"
            />
          </div>
        </div>

        {/* Brand Dropdown */}
        <div>
          <label className="block text-slate-700 font-semibold mb-1.5">Vehicle Brand</label>
          <select
            value={filter.brand}
            onChange={(e) => handleChange('brand', e.target.value)}
            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-800 text-xs"
          >
            <option value="">All Brands</option>
            {brands.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        {/* Condition Filter */}
        <div>
          <label className="block text-slate-700 font-semibold mb-1.5">Condition</label>
          <select
            value={filter.condition}
            onChange={(e) => handleChange('condition', e.target.value)}
            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-800 text-xs"
          >
            <option value="">All Conditions</option>
            <option value="Foreign Used">Foreign Used (Tokunbo)</option>
            <option value="Brand New">Brand New</option>
            <option value="Nigerian Used">Nigerian Used</option>
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-slate-700 font-semibold mb-1.5">Body / Category</label>
          <select
            value={filter.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-800 text-xs"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Price Range (in Nigerian Naira) */}
        <div>
          <label className="block text-slate-700 font-semibold mb-1.5">Price Range (₦)</label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Min ₦ (e.g. 10000000)"
              value={filter.minPrice}
              onChange={(e) => handleChange('minPrice', e.target.value ? Number(e.target.value) : '')}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-amber-500"
            />
            <input
              type="number"
              placeholder="Max ₦ (e.g. 50000000)"
              value={filter.maxPrice}
              onChange={(e) => handleChange('maxPrice', e.target.value ? Number(e.target.value) : '')}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Transmission */}
        <div>
          <label className="block text-slate-700 font-semibold mb-1.5">Transmission</label>
          <select
            value={filter.transmission}
            onChange={(e) => handleChange('transmission', e.target.value)}
            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-800 text-xs"
          >
            <option value="">All Transmissions</option>
            <option value="Automatic">Automatic</option>
            <option value="Manual">Manual</option>
          </select>
        </div>

        {/* Fuel Type */}
        <div>
          <label className="block text-slate-700 font-semibold mb-1.5">Fuel Type</label>
          <select
            value={filter.fuel_type}
            onChange={(e) => handleChange('fuel_type', e.target.value)}
            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-800 text-xs"
          >
            <option value="">All Fuel Types</option>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Electric">Electric</option>
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="block text-slate-700 font-semibold mb-1.5">Vehicle Location</label>
          <select
            value={filter.location}
            onChange={(e) => handleChange('location', e.target.value)}
            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-800 text-xs"
          >
            <option value="">All Locations</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        {/* Availability */}
        <div>
          <label className="block text-slate-700 font-semibold mb-1.5">Availability Status</label>
          <select
            value={filter.availability}
            onChange={(e) => handleChange('availability', e.target.value)}
            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-800 text-xs"
          >
            <option value="">All Statuses</option>
            <option value="Available">Available for Inspection</option>
            <option value="Reserved">Reserved</option>
            <option value="Sold">Sold</option>
          </select>
        </div>

        {/* Sort By */}
        <div className="pt-2 border-t border-slate-100">
          <label className="block text-slate-700 font-semibold mb-1.5">Sort Inventory</label>
          <select
            value={filter.sortBy}
            onChange={(e) => handleChange('sortBy', e.target.value as any)}
            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-800 text-xs font-medium"
          >
            <option value="newest">Newest Listings</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="year-desc">Newest Model Year</option>
          </select>
        </div>

      </div>

      {/* Match info footer */}
      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="font-semibold text-slate-800 tabular-nums">
          {totalMatches} {totalMatches === 1 ? 'vehicle' : 'vehicles'} found
        </span>
        {activeFilterCount > 0 && (
          <button
            onClick={resetFilter}
            className="text-amber-600 hover:text-amber-700 font-medium cursor-pointer"
          >
            Clear all
          </button>
        )}
      </div>

    </div>
  );
};
