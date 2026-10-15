import React, { useState, useMemo } from 'react';
import { useVehicles } from '../context/VehicleContext';
import { VehicleCard } from '../components/VehicleCard';
import { VehicleFilter } from '../components/VehicleFilter';
import { VehicleFilterState } from '../types/vehicle';
import { createGeneralWhatsAppLink } from '../utils/whatsapp';
import { SlidersHorizontal, MessageSquare, RotateCcw, Car } from 'lucide-react';

export const AllCarsPage: React.FC = () => {
  const {
    vehicles,
    activeBrandFilter,
    setActiveBrandFilter,
    activeCategoryFilter,
    setActiveCategoryFilter,
  } = useVehicles();

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const initialFilterState: VehicleFilterState = {
    search: '',
    brand: activeBrandFilter || '',
    model: '',
    minPrice: '',
    maxPrice: '',
    condition: '',
    year: '',
    transmission: '',
    fuel_type: '',
    location: '',
    category: activeCategoryFilter || '',
    availability: '',
    sortBy: 'newest',
  };

  const [filter, setFilter] = useState<VehicleFilterState>(initialFilterState);

  // Sync external filters if changed from navbar/category clicks
  React.useEffect(() => {
    if (activeBrandFilter) {
      setFilter((prev) => ({ ...prev, brand: activeBrandFilter }));
    }
  }, [activeBrandFilter]);

  React.useEffect(() => {
    if (activeCategoryFilter) {
      setFilter((prev) => ({ ...prev, category: activeCategoryFilter }));
    }
  }, [activeCategoryFilter]);

  const resetFilter = () => {
    setFilter({
      search: '',
      brand: '',
      model: '',
      minPrice: '',
      maxPrice: '',
      condition: '',
      year: '',
      transmission: '',
      fuel_type: '',
      location: '',
      category: '',
      availability: '',
      sortBy: 'newest',
    });
    setActiveBrandFilter('');
    setActiveCategoryFilter('');
  };

  // Derive unique brands, locations, categories
  const brands = useMemo(() => {
    const set = new Set<string>();
    vehicles.forEach((v) => set.add(v.brand));
    return Array.from(set).sort();
  }, [vehicles]);

  const locations = useMemo(() => {
    const set = new Set<string>();
    vehicles.forEach((v) => set.add(v.location));
    return Array.from(set).sort();
  }, [vehicles]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    vehicles.forEach((v) => v.category?.forEach((c) => set.add(c)));
    return Array.from(set).sort();
  }, [vehicles]);

  // Filter and sort vehicles
  const filteredVehicles = useMemo(() => {
    let result = vehicles.filter((car) => {
      // Keyword search (brand, model, description, engine, location)
      if (filter.search.trim()) {
        const query = filter.search.toLowerCase();
        const matchesBrand = car.brand.toLowerCase().includes(query);
        const matchesModel = car.model.toLowerCase().includes(query);
        const matchesDesc = car.description?.toLowerCase().includes(query);
        const matchesLoc = car.location?.toLowerCase().includes(query);
        if (!matchesBrand && !matchesModel && !matchesDesc && !matchesLoc) {
          return false;
        }
      }

      // Brand
      if (filter.brand && car.brand.toLowerCase() !== filter.brand.toLowerCase()) {
        return false;
      }

      // Condition
      if (filter.condition && car.condition !== filter.condition) {
        return false;
      }

      // Category
      if (filter.category && !car.category?.includes(filter.category as any)) {
        return false;
      }

      // Transmission
      if (filter.transmission && car.transmission !== filter.transmission) {
        return false;
      }

      // Fuel type
      if (filter.fuel_type && car.fuel_type !== filter.fuel_type) {
        return false;
      }

      // Location
      if (filter.location && car.location !== filter.location) {
        return false;
      }

      // Availability
      if (filter.availability && car.availability !== filter.availability) {
        return false;
      }

      // Min Price
      if (filter.minPrice !== '' && car.price < Number(filter.minPrice)) {
        return false;
      }

      // Max Price
      if (filter.maxPrice !== '' && car.price > Number(filter.maxPrice)) {
        return false;
      }

      // Year
      if (filter.year !== '' && car.year !== Number(filter.year)) {
        return false;
      }

      return true;
    });

    // Sorting
    if (filter.sortBy === 'newest') {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (filter.sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (filter.sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (filter.sortBy === 'year-desc') {
      result.sort((a, b) => b.year - a.year);
    }

    return result;
  }, [vehicles, filter]);

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-8">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">
            AHAVA AUTOS Showroom
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900">
            Available Vehicle Inventory
          </h1>
          <p className="mt-2 text-sm text-slate-600 max-w-2xl">
            Browse our inspected foreign-used, brand-new, and verified Nigerian-used vehicles. Filter by make, price, or body type and message us directly on WhatsApp for inspections.
          </p>
        </div>

        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-6 flex items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-700">
            Showing <span className="text-slate-900 font-bold">{filteredVehicles.length}</span> vehicles
          </div>
          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
            <span>Filter & Sort</span>
          </button>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Desktop Filter Sidebar (1 column) */}
          <aside className="hidden lg:block lg:col-span-1 sticky top-24">
            <VehicleFilter
              filter={filter}
              setFilter={setFilter}
              resetFilter={resetFilter}
              brands={brands}
              locations={locations}
              categories={categories}
              totalMatches={filteredVehicles.length}
            />
          </aside>

          {/* Vehicle Inventory Grid (3 columns) */}
          <main className="lg:col-span-3">
            
            {/* Top Toolbar */}
            <div className="hidden lg:flex items-center justify-between bg-white px-5 py-3.5 rounded-xl border border-slate-200 mb-6 shadow-xs">
              <div className="text-xs text-slate-600">
                Found <span className="font-bold text-slate-900 tabular-nums">{filteredVehicles.length}</span> vehicles matching your selection
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-slate-500">Sort by:</span>
                <select
                  value={filter.sortBy}
                  onChange={(e) => setFilter((prev) => ({ ...prev, sortBy: e.target.value as any }))}
                  className="text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg p-1.5 focus:ring-1 focus:ring-amber-500"
                >
                  <option value="newest">Newest Listings</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="year-desc">Newest Model Year</option>
                </select>
              </div>
            </div>

            {/* Vehicle Grid */}
            {filteredVehicles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVehicles.map((car) => (
                  <VehicleCard key={car.id} car={car} />
                ))}
              </div>
            ) : (
              /* Helpful Empty State with WhatsApp Call to Action */
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
                  <Car className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  No Vehicles Match Your Current Filters
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mb-6 leading-relaxed">
                  We frequently receive fresh shipments and vehicle arrivals that may not yet be published on our showroom site. Contact us directly on WhatsApp to request this vehicle.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={resetFilter}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Clear Filters</span>
                  </button>

                  <a
                    href={createGeneralWhatsAppLink(`Hello AHAVA AUTOS, I am looking for a vehicle matching: ${filter.brand || 'any brand'} ${filter.category || ''} under my budget. Please let me know what is available.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm"
                  >
                    <MessageSquare className="w-3.5 h-3.5 fill-slate-950" />
                    <span>Request on WhatsApp</span>
                  </a>
                </div>
              </div>
            )}

          </main>
        </div>

      </div>

      {/* Mobile Filter Modal Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <h3 className="font-bold text-slate-900 text-base">Filter & Sort Vehicles</h3>
            <button
              onClick={() => setMobileFilterOpen(false)}
              className="text-xs font-bold text-slate-600 p-2"
            >
              Done
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <VehicleFilter
              filter={filter}
              setFilter={setFilter}
              resetFilter={resetFilter}
              brands={brands}
              locations={locations}
              categories={categories}
              totalMatches={filteredVehicles.length}
            />
          </div>

          <div className="p-4 border-t border-slate-200 bg-slate-50 flex gap-3">
            <button
              onClick={() => {
                resetFilter();
                setMobileFilterOpen(false);
              }}
              className="flex-1 py-3 text-xs font-bold bg-slate-200 text-slate-800 rounded-lg"
            >
              Reset
            </button>
            <button
              onClick={() => setMobileFilterOpen(false)}
              className="flex-1 py-3 text-xs font-bold bg-amber-400 text-slate-950 rounded-lg"
            >
              Apply ({filteredVehicles.length})
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
