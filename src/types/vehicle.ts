export type VehicleCondition = 'Foreign Used' | 'Brand New' | 'Nigerian Used';

export type TransmissionType = 'Automatic' | 'Manual';

export type FuelType = 'Petrol' | 'Diesel' | 'Hybrid' | 'Electric';

export type AvailabilityStatus = 'Available' | 'Sold' | 'Reserved';

export type VehicleCategory =
  | 'SUVs'
  | 'Sedans'
  | 'Hatchbacks'
  | 'Coupes'
  | 'Pickup Trucks'
  | 'Minivans'
  | 'Luxury Cars'
  | 'Family Cars'
  | 'Affordable Cars'
  | 'Brand New Cars'
  | 'Foreign Used Cars'
  | 'Nigerian Used Cars';

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  slug: string;
  price: number; // in NGN (Nigerian Naira)
  condition: VehicleCondition;
  transmission: TransmissionType;
  fuel_type: FuelType;
  mileage: string;
  exterior_colour: string;
  interior_colour: string;
  engine: string;
  location: string;
  description: string;
  category: string[];
  images: string[];
  featured: boolean;
  availability: AvailabilityStatus;
  is_demo?: boolean;
  created_at: string;
  updated_at: string;
}

export interface VehicleFilterState {
  search: string;
  brand: string;
  model: string;
  minPrice: number | '';
  maxPrice: number | '';
  condition: string;
  year: number | '';
  transmission: string;
  fuel_type: string;
  location: string;
  category: string;
  availability: string;
  sortBy: 'newest' | 'price-asc' | 'price-desc' | 'year-desc';
}

export interface CustomerEnquiry {
  id: string;
  name: string;
  phone: string;
  carInterest: string;
  message: string;
  vehicleId?: string;
  created_at: string;
}
