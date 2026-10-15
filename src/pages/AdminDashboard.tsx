import React, { useState, useEffect } from 'react';
import { useVehicles } from '../context/VehicleContext';
import { Vehicle, VehicleCondition, TransmissionType, FuelType, AvailabilityStatus } from '../types/vehicle';
import { formatNaira } from '../utils/currency';
import {
  Lock,
  Plus,
  Edit,
  Trash2,
  Search,
  CheckCircle2,
  X,
  Upload,
  Eye,
  LogOut,
  Layers,
  Car,
  Tag,
  AlertTriangle,
  RefreshCw,
  Mail,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    vehicles,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    isAdmin,
    loginAdmin,
    logoutAdmin,
    enquiries,
    fetchEnquiries,
    setSelectedVehicle,
    setCurrentPage,
  } = useVehicles();

  // Login form state
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active view tab: 'inventory' | 'enquiries'
  const [activeTab, setActiveTab] = useState<'inventory' | 'enquiries'>('inventory');

  // Search inside dashboard
  const [dashboardSearch, setDashboardSearch] = useState('');

  // Add / Edit Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null);

  // Form fields
  const initialFormState = {
    brand: 'Toyota',
    model: '',
    year: new Date().getFullYear(),
    price: 15000000,
    condition: 'Foreign Used' as VehicleCondition,
    transmission: 'Automatic' as TransmissionType,
    fuel_type: 'Petrol' as FuelType,
    mileage: '35,000 miles',
    exterior_colour: 'Black',
    interior_colour: 'Leather',
    engine: '2.5L 4-Cylinder',
    location: 'Lekki Phase 1, Lagos',
    description: '',
    category: ['SUVs'] as string[],
    images: ['/src/assets/images/hero_luxury_cars_1792063513133.jpg'],
    featured: false,
    availability: 'Available' as AvailabilityStatus,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);

  useEffect(() => {
    if (isAdmin) {
      fetchEnquiries();
    }
  }, [isAdmin]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const success = await loginAdmin(passwordInput);
    if (!success) {
      setLoginError('Incorrect administration passcode. Please try again.');
    } else {
      setPasswordInput('');
    }
  };

  const handleOpenAddModal = () => {
    setEditingVehicleId(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (car: Vehicle) => {
    setEditingVehicleId(car.id);
    setFormData({
      brand: car.brand,
      model: car.model,
      year: car.year,
      price: car.price,
      condition: car.condition,
      transmission: car.transmission,
      fuel_type: car.fuel_type,
      mileage: car.mileage,
      exterior_colour: car.exterior_colour,
      interior_colour: car.interior_colour,
      engine: car.engine,
      location: car.location,
      description: car.description,
      category: car.category || ['SUVs'],
      images: car.images && car.images.length > 0 ? car.images : ['/src/assets/images/hero_luxury_cars_1792063513133.jpg'],
      featured: car.featured,
      availability: car.availability,
    });
    setIsModalOpen(true);
  };

  const handleToggleSold = async (car: Vehicle) => {
    const newStatus: AvailabilityStatus = car.availability === 'Sold' ? 'Available' : 'Sold';
    await updateVehicle(car.id, { availability: newStatus });
    setSaveSuccessNotice(`Updated ${car.brand} ${car.model} to ${newStatus}`);
    setTimeout(() => setSaveSuccessNotice(null), 3000);
  };

  const handleToggleFeatured = async (car: Vehicle) => {
    await updateVehicle(car.id, { featured: !car.featured });
  };

  const handleDelete = async (car: Vehicle) => {
    if (window.confirm(`Are you sure you want to permanently delete the listing for ${car.brand} ${car.model} (${car.id})?`)) {
      await deleteVehicle(car.id);
      setSaveSuccessNotice(`Deleted vehicle listing ${car.id}`);
      setTimeout(() => setSaveSuccessNotice(null), 3000);
    }
  };

  // Image Upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadStatus('Uploading image...');
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: base64String, filename: file.name }),
        });

        if (res.ok) {
          const data = await res.json();
          setFormData((prev) => ({ ...prev, images: [data.url, ...prev.images] }));
          setUploadStatus('Image uploaded successfully!');
        } else {
          // If server upload fails, fallback to local base64 data URL
          setFormData((prev) => ({ ...prev, images: [base64String, ...prev.images] }));
          setUploadStatus('Image added locally.');
        }
      } catch {
        setFormData((prev) => ({ ...prev, images: [base64String, ...prev.images] }));
        setUploadStatus('Image stored locally.');
      }
      setTimeout(() => setUploadStatus(null), 3000);
    };
    reader.readAsDataURL(file);
  };

  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return;
    setFormData((prev) => ({ ...prev, images: [...prev.images, newImageUrl.trim()] }));
    setNewImageUrl('');
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleCategoryToggle = (cat: string) => {
    setFormData((prev) => {
      const exists = prev.category.includes(cat);
      if (exists) {
        return { ...prev, category: prev.category.filter((c) => c !== cat) };
      } else {
        return { ...prev, category: [...prev.category, cat] };
      }
    });
  };

  const handleSaveVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.brand || !formData.model || !formData.price) {
      alert('Please fill in Brand, Model, and Price.');
      return;
    }

    if (editingVehicleId) {
      await updateVehicle(editingVehicleId, formData);
      setSaveSuccessNotice('Vehicle updated successfully!');
    } else {
      await addVehicle(formData);
      setSaveSuccessNotice('New vehicle listing added to showroom!');
    }

    setIsModalOpen(false);
    setTimeout(() => setSaveSuccessNotice(null), 3500);
  };

  // Filter listings inside dashboard
  const displayedVehicles = vehicles.filter((v) => {
    if (!dashboardSearch.trim()) return true;
    const q = dashboardSearch.toLowerCase();
    return (
      v.brand.toLowerCase().includes(q) ||
      v.model.toLowerCase().includes(q) ||
      v.id.toLowerCase().includes(q) ||
      v.location.toLowerCase().includes(q)
    );
  });

  // If NOT logged in, show secure login gate
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#0B192C] text-white rounded-2xl p-8 border border-slate-800 shadow-2xl">
          <div className="w-12 h-12 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center mx-auto mb-4 font-display font-black text-xl">
            A
          </div>
          <h2 className="text-xl font-bold font-display text-center text-white">
            AHAVA AUTOS Admin
          </h2>
          <p className="text-xs text-slate-400 text-center mt-1 mb-6">
            Authorized management portal for vehicle listings and showroom inventory.
          </p>

          {loginError && (
            <div className="mb-4 p-3 bg-rose-950/60 border border-rose-800 text-rose-300 text-xs rounded-lg flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Passcode / Master Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter admin passcode"
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                  autoFocus
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1.5">
                Default demonstration passcode: <code className="text-amber-300">ahava2026</code>
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
            >
              Sign In to Management
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800 text-center">
            <button
              onClick={() => setCurrentPage('home')}
              className="text-xs text-slate-400 hover:text-white cursor-pointer"
            >
              &larr; Return to Public Showroom
            </button>
          </div>
        </div>
      </div>
    );
  }

  // LOGGED IN ADMIN VIEW
  return (
    <div className="bg-slate-100 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Management Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Showroom Administration
              </span>
            </div>
            <h1 className="text-2xl font-display font-black text-slate-900 mt-0.5">
              AHAVA AUTOS Inventory Manager
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Persistent storage active · Changes remain saved across reloads
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Car</span>
            </button>

            <button
              type="button"
              onClick={logoutAdmin}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Success toast notice */}
        {saveSuccessNotice && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{saveSuccessNotice}</span>
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="text-xs font-semibold text-slate-500">Total Cars Listed</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1 tabular-nums">
              {vehicles.length}
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="text-xs font-semibold text-slate-500">Available Stock</div>
            <div className="text-2xl font-extrabold text-emerald-600 mt-1 tabular-nums">
              {vehicles.filter((v) => v.availability === 'Available').length}
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="text-xs font-semibold text-slate-500">Marked as Sold</div>
            <div className="text-2xl font-extrabold text-rose-600 mt-1 tabular-nums">
              {vehicles.filter((v) => v.availability === 'Sold').length}
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="text-xs font-semibold text-slate-500">Customer Enquiries</div>
            <div className="text-2xl font-extrabold text-amber-600 mt-1 tabular-nums">
              {enquiries.length}
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'inventory' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            Vehicle Listings ({vehicles.length})
          </button>
          <button
            onClick={() => setActiveTab('enquiries')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'enquiries' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            Logged Enquiries ({enquiries.length})
          </button>
        </div>

        {/* Tab 1: Vehicle Listings Table */}
        {activeTab === 'inventory' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            
            {/* Table Search Header */}
            <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter by brand, model, or ID..."
                  value={dashboardSearch}
                  onChange={(e) => setDashboardSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="text-xs text-slate-500">
                Displaying {displayedVehicles.length} of {vehicles.length} listings
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                  <tr>
                    <th className="py-3 px-4">Vehicle</th>
                    <th className="py-3 px-4">Price (₦)</th>
                    <th className="py-3 px-4">Condition</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Featured</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {displayedVehicles.map((car) => {
                    const thumb = car.images?.[0] || '/src/assets/images/hero_luxury_cars_1792063513133.jpg';
                    const isSold = car.availability === 'Sold';

                    return (
                      <tr key={car.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={thumb}
                              alt={car.model}
                              className="w-12 h-9 object-cover rounded bg-slate-200 shrink-0"
                            />
                            <div>
                              <div className="font-bold text-slate-900">
                                {car.brand} {car.model} ({car.year})
                              </div>
                              <div className="text-[11px] text-slate-400 font-mono">
                                REF: {car.id} {car.is_demo ? '· Sample Demo' : '· Confirmed Stock'}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 font-bold tabular-nums text-slate-900">
                          {formatNaira(car.price)}
                        </td>

                        <td className="py-3 px-4">
                          <span className="font-medium text-slate-600">
                            {car.condition}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-slate-600 truncate max-w-[150px]">
                          {car.location}
                        </td>

                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleToggleSold(car)}
                            className={`px-2 py-1 rounded text-[11px] font-bold uppercase tracking-wider cursor-pointer transition-colors ${
                              isSold
                                ? 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                                : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            }`}
                          >
                            {car.availability}
                          </button>
                        </td>

                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleToggleFeatured(car)}
                            className={`px-2 py-0.5 rounded text-[11px] font-medium cursor-pointer ${
                              car.featured ? 'bg-amber-100 text-amber-800 font-bold' : 'text-slate-400 hover:text-slate-700'
                            }`}
                          >
                            {car.featured ? '★ Featured' : '☆ Standard'}
                          </button>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedVehicle(car);
                                window.location.hash = `#car/${car.id}`;
                                setCurrentPage('car-details');
                              }}
                              className="p-1.5 text-slate-500 hover:text-slate-800 rounded cursor-pointer"
                              title="Preview Listing"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleOpenEditModal(car)}
                              className="p-1.5 text-blue-600 hover:text-blue-800 rounded cursor-pointer"
                              title="Edit Details"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(car)}
                              className="p-1.5 text-rose-600 hover:text-rose-800 rounded cursor-pointer"
                              title="Delete Listing"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* Tab 2: Enquiries List */}
        {activeTab === 'enquiries' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-500" />
              <span>Customer Enquiries Log</span>
            </h3>

            {enquiries.length > 0 ? (
              <div className="space-y-3">
                {enquiries.map((enq) => (
                  <div key={enq.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <div className="flex items-center justify-between font-bold text-slate-900 mb-1">
                      <span>{enq.name} ({enq.phone})</span>
                      <span className="text-[11px] font-normal text-slate-400">
                        {new Date(enq.created_at).toLocaleString('en-NG')}
                      </span>
                    </div>
                    <div className="text-amber-700 font-semibold mb-1">
                      Interested In: {enq.carInterest}
                    </div>
                    <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                      {enq.message}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs">
                No customer enquiries recorded yet. Enquiries from the website contact form will appear here.
              </div>
            )}
          </div>
        )}

      </div>

      {/* ADD / EDIT VEHICLE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto my-8">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
              <h3 className="text-lg font-bold font-display text-slate-900">
                {editingVehicleId ? 'Edit Vehicle Listing' : 'Add New Car to Showroom'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVehicle} className="space-y-5 text-xs">
              
              {/* Row 1: Brand, Model, Year */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Brand *</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    required
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Model *</label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    required
                    placeholder="e.g. Camry XSE, RX 350"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Year *</label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                    required
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
              </div>

              {/* Row 2: Price in Naira & Condition */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Price in Naira (₦) *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    required
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-bold"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    Displays as: {formatNaira(formData.price)}
                  </span>
                </div>
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Condition *</label>
                  <select
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  >
                    <option value="Foreign Used">Foreign Used (Tokunbo)</option>
                    <option value="Brand New">Brand New</option>
                    <option value="Nigerian Used">Nigerian Used</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Availability *</label>
                  <select
                    value={formData.availability}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-bold"
                  >
                    <option value="Available">Available for Inspection</option>
                    <option value="Reserved">Reserved</option>
                    <option value="Sold">Sold</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Transmission, Fuel, Mileage */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Transmission</label>
                  <select
                    value={formData.transmission}
                    onChange={(e) => setFormData({ ...formData, transmission: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  >
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Fuel Type</label>
                  <select
                    value={formData.fuel_type}
                    onChange={(e) => setFormData({ ...formData, fuel_type: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Electric">Electric</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Mileage</label>
                  <input
                    type="text"
                    value={formData.mileage}
                    onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                    placeholder="e.g. 38,000 miles"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
              </div>

              {/* Row 4: Colours, Engine, Location */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Exterior Colour</label>
                  <input
                    type="text"
                    value={formData.exterior_colour}
                    onChange={(e) => setFormData({ ...formData, exterior_colour: e.target.value })}
                    placeholder="e.g. Pearl White"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Interior Colour</label>
                  <input
                    type="text"
                    value={formData.interior_colour}
                    onChange={(e) => setFormData({ ...formData, interior_colour: e.target.value })}
                    placeholder="e.g. Black Leather"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Vehicle Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Lekki Phase 1, Lagos"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
              </div>

              {/* Engine Specs */}
              <div>
                <label className="block font-semibold text-slate-800 mb-1">Engine Specifications</label>
                <input
                  type="text"
                  value={formData.engine}
                  onChange={(e) => setFormData({ ...formData, engine: e.target.value })}
                  placeholder="e.g. 3.5L V6 DOHC 24V with Dual VVT-i"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold text-slate-800 mb-1">Detailed Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe vehicle features, packages, condition, and customs papers status..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              {/* Categories */}
              <div>
                <label className="block font-semibold text-slate-800 mb-1.5">Categories (Select all that apply)</label>
                <div className="flex flex-wrap gap-2">
                  {['SUVs', 'Sedans', 'Luxury Cars', 'Affordable Cars', 'Family Cars', 'Pickup Trucks', 'Foreign Used Cars', 'Brand New Cars'].map((cat) => {
                    const isSelected = formData.category.includes(cat);
                    return (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => handleCategoryToggle(cat)}
                        className={`px-3 py-1.5 rounded-lg border text-xs cursor-pointer ${
                          isSelected ? 'bg-amber-100 border-amber-400 text-amber-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Vehicle Photos Management */}
              <div>
                <label className="block font-semibold text-slate-800 mb-1.5">Vehicle Photographs</label>
                
                {/* Upload or Add URL */}
                <div className="flex flex-col sm:flex-row gap-2 mb-3">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Paste image URL (or upload below)"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-3 py-2 bg-slate-800 text-white rounded-lg font-bold"
                  >
                    Add URL
                  </button>

                  <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-lg font-bold flex items-center justify-center gap-1.5 cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>

                {uploadStatus && (
                  <p className="text-[11px] text-amber-700 font-semibold mb-2">{uploadStatus}</p>
                )}

                {/* Thumbnails preview */}
                <div className="flex flex-wrap gap-2">
                  {formData.images.map((img, i) => (
                    <div key={i} className="relative w-20 h-16 rounded border border-slate-300 overflow-hidden group">
                      <img src={img} alt={`Car ${i}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(i)}
                        className="absolute top-1 right-1 p-0.5 bg-rose-600 text-white rounded-full opacity-90 group-hover:opacity-100 cursor-pointer"
                        title="Remove Image"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Featured toggle */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded text-amber-500 focus:ring-amber-400"
                />
                <label htmlFor="featured" className="font-semibold text-slate-800">
                  Mark this car as Featured on the Homepage
                </label>
              </div>

              {/* Form Actions */}
              <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg font-bold shadow-xs cursor-pointer"
                >
                  {editingVehicleId ? 'Update Vehicle' : 'Save & Publish Listing'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
