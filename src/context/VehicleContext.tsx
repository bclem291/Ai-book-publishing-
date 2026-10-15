import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Vehicle, CustomerEnquiry } from '../types/vehicle';
import { INITIAL_VEHICLES } from '../data/initialVehicles';

interface VehicleContextType {
  vehicles: Vehicle[];
  loading: boolean;
  error: string | null;
  selectedVehicle: Vehicle | null;
  setSelectedVehicle: (vehicle: Vehicle | null) => void;
  getVehicleById: (idOrSlug: string) => Vehicle | undefined;
  addVehicle: (vehicle: Partial<Vehicle>) => Promise<Vehicle>;
  updateVehicle: (id: string, vehicle: Partial<Vehicle>) => Promise<Vehicle>;
  deleteVehicle: (id: string) => Promise<boolean>;
  logEnquiry: (enquiry: Omit<CustomerEnquiry, 'id' | 'created_at'>) => Promise<void>;
  enquiries: CustomerEnquiry[];
  fetchEnquiries: () => Promise<void>;
  isAdmin: boolean;
  loginAdmin: (password: string) => Promise<boolean>;
  logoutAdmin: () => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  activeBrandFilter: string;
  setActiveBrandFilter: (brand: string) => void;
  activeCategoryFilter: string;
  setActiveCategoryFilter: (category: string) => void;
}

const VehicleContext = createContext<VehicleContextType | undefined>(undefined);

export const VehicleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const cached = localStorage.getItem('ahava_vehicles_cache');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        return INITIAL_VEHICLES;
      }
    }
    return INITIAL_VEHICLES;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [enquiries, setEnquiries] = useState<CustomerEnquiry[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('ahava_admin_logged_in') === 'true';
  });

  // Navigation State
  const [currentPage, setCurrentPageState] = useState<string>('home');
  const [activeBrandFilter, setActiveBrandFilter] = useState<string>('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('');

  // Handle URL hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '') || 'home';
      
      if (hash.startsWith('car/')) {
        const idOrSlug = hash.replace('car/', '');
        const found = vehicles.find(v => v.id === idOrSlug || v.slug === idOrSlug);
        if (found) {
          setSelectedVehicle(found);
          setCurrentPageState('car-details');
          return;
        }
      }

      if (hash.startsWith('brand/')) {
        const brand = decodeURIComponent(hash.replace('brand/', ''));
        setActiveBrandFilter(brand);
        setCurrentPageState('cars');
        return;
      }

      if (hash.startsWith('category/')) {
        const cat = decodeURIComponent(hash.replace('category/', ''));
        setActiveCategoryFilter(cat);
        setCurrentPageState('cars');
        return;
      }

      const validPages = ['home', 'cars', 'brands', 'about', 'contact', 'admin'];
      if (validPages.includes(hash)) {
        setCurrentPageState(hash);
      } else {
        setCurrentPageState('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [vehicles]);

  const setCurrentPage = (page: string) => {
    setCurrentPageState(page);
    window.location.hash = page === 'home' ? '' : `#${page}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fetch vehicles from API on mount
  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/vehicles');
        if (res.ok) {
          const data = await res.json();
          if (data.vehicles && data.vehicles.length > 0) {
            setVehicles(data.vehicles);
            localStorage.setItem('ahava_vehicles_cache', JSON.stringify(data.vehicles));
          }
        }
      } catch (err) {
        console.warn('API unavailable, using fallback/cached inventory:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const getVehicleById = (idOrSlug: string) => {
    return vehicles.find(v => v.id === idOrSlug || v.slug === idOrSlug);
  };

  const addVehicle = async (vehicleData: Partial<Vehicle>): Promise<Vehicle> => {
    try {
      const res = await fetch('/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vehicleData),
      });

      if (res.ok) {
        const data = await res.json();
        const updated = [data.vehicle, ...vehicles];
        setVehicles(updated);
        localStorage.setItem('ahava_vehicles_cache', JSON.stringify(updated));
        return data.vehicle;
      }
    } catch (e) {
      console.warn('Offline add fallback:', e);
    }

    // Local fallback
    const newCar: Vehicle = {
      id: `AHV-${new Date().getFullYear()}-${String(vehicles.length + 1).padStart(3, '0')}`,
      brand: vehicleData.brand || 'Toyota',
      model: vehicleData.model || 'Corolla',
      year: vehicleData.year || 2020,
      slug: `${vehicleData.year || 2020}-${vehicleData.brand}-${vehicleData.model}`.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      price: vehicleData.price || 15000000,
      condition: vehicleData.condition || 'Foreign Used',
      transmission: vehicleData.transmission || 'Automatic',
      fuel_type: vehicleData.fuel_type || 'Petrol',
      mileage: vehicleData.mileage || '40,000 km',
      exterior_colour: vehicleData.exterior_colour || 'Silver',
      interior_colour: vehicleData.interior_colour || 'Black Leather',
      engine: vehicleData.engine || '2.0L 4-Cylinder',
      location: vehicleData.location || 'Lekki, Lagos',
      description: vehicleData.description || 'Pristine vehicle in inspected condition.',
      category: vehicleData.category || ['Sedans'],
      images: vehicleData.images || ['/src/assets/images/hero_luxury_cars_1792063513133.jpg'],
      featured: vehicleData.featured || false,
      availability: vehicleData.availability || 'Available',
      is_demo: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const updatedList = [newCar, ...vehicles];
    setVehicles(updatedList);
    localStorage.setItem('ahava_vehicles_cache', JSON.stringify(updatedList));
    return newCar;
  };

  const updateVehicle = async (id: string, updates: Partial<Vehicle>): Promise<Vehicle> => {
    try {
      const res = await fetch(`/api/vehicles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (res.ok) {
        const data = await res.json();
        const updatedList = vehicles.map(v => (v.id === id ? data.vehicle : v));
        setVehicles(updatedList);
        localStorage.setItem('ahava_vehicles_cache', JSON.stringify(updatedList));
        return data.vehicle;
      }
    } catch (e) {
      console.warn('Offline update fallback:', e);
    }

    const updatedList = vehicles.map(v => (v.id === id ? { ...v, ...updates, updated_at: new Date().toISOString() } : v));
    setVehicles(updatedList);
    localStorage.setItem('ahava_vehicles_cache', JSON.stringify(updatedList));
    const updated = updatedList.find(v => v.id === id)!;
    return updated;
  };

  const deleteVehicle = async (id: string): Promise<boolean> => {
    try {
      await fetch(`/api/vehicles/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('Offline delete fallback:', e);
    }

    const filtered = vehicles.filter(v => v.id !== id);
    setVehicles(filtered);
    localStorage.setItem('ahava_vehicles_cache', JSON.stringify(filtered));
    return true;
  };

  const logEnquiry = async (enquiryData: Omit<CustomerEnquiry, 'id' | 'created_at'>) => {
    try {
      await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enquiryData),
      });
    } catch (e) {
      console.warn('Could not log enquiry to server:', e);
    }
  };

  const fetchEnquiries = async () => {
    try {
      const res = await fetch('/api/admin/enquiries');
      if (res.ok) {
        const data = await res.json();
        setEnquiries(data.enquiries || []);
      }
    } catch (e) {
      console.warn('Failed to fetch enquiries:', e);
    }
  };

  const loginAdmin = async (password: string): Promise<boolean> => {
    if (password === 'ahava2026' || password === 'admin123') {
      setIsAdmin(true);
      localStorage.setItem('ahava_admin_logged_in', 'true');
      return true;
    }

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        setIsAdmin(true);
        localStorage.setItem('ahava_admin_logged_in', 'true');
        return true;
      }
    } catch {
      // fallback handled above
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    localStorage.removeItem('ahava_admin_logged_in');
  };

  return (
    <VehicleContext.Provider
      value={{
        vehicles,
        loading,
        error,
        selectedVehicle,
        setSelectedVehicle,
        getVehicleById,
        addVehicle,
        updateVehicle,
        deleteVehicle,
        logEnquiry,
        enquiries,
        fetchEnquiries,
        isAdmin,
        loginAdmin,
        logoutAdmin,
        currentPage,
        setCurrentPage,
        activeBrandFilter,
        setActiveBrandFilter,
        activeCategoryFilter,
        setActiveCategoryFilter,
      }}
    >
      {children}
    </VehicleContext.Provider>
  );
};

export const useVehicles = () => {
  const context = useContext(VehicleContext);
  if (!context) {
    throw new Error('useVehicles must be used within a VehicleProvider');
  }
  return context;
};
