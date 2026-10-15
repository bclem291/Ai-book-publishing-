import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { INITIAL_VEHICLES } from './src/data/initialVehicles';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.resolve(__dirname, 'data');
const VEHICLES_FILE = path.join(DATA_DIR, 'vehicles.json');
const ENQUIRIES_FILE = path.join(DATA_DIR, 'enquiries.json');
const UPLOADS_DIR = path.resolve(__dirname, 'public', 'uploads');

// Ensure storage directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Seed vehicles file if not present
if (!fs.existsSync(VEHICLES_FILE)) {
  fs.writeFileSync(VEHICLES_FILE, JSON.stringify(INITIAL_VEHICLES, null, 2), 'utf-8');
}

// Seed enquiries file if not present
if (!fs.existsSync(ENQUIRIES_FILE)) {
  fs.writeFileSync(ENQUIRIES_FILE, JSON.stringify([], null, 2), 'utf-8');
}

// Helper to read vehicles
function getVehicles() {
  try {
    const data = fs.readFileSync(VEHICLES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading vehicles file:', err);
    return INITIAL_VEHICLES;
  }
}

// Helper to save vehicles
function saveVehicles(vehicles: any[]) {
  fs.writeFileSync(VEHICLES_FILE, JSON.stringify(vehicles, null, 2), 'utf-8');
}

// Helper to read enquiries
function getEnquiries() {
  try {
    const data = fs.readFileSync(ENQUIRIES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading enquiries file:', err);
    return [];
  }
}

// Helper to save enquiries
function saveEnquiries(enquiries: any[]) {
  fs.writeFileSync(ENQUIRIES_FILE, JSON.stringify(enquiries, null, 2), 'utf-8');
}

// Parse JSON bodies (up to 20MB for image data URLs)
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Serve uploaded assets
app.use('/uploads', express.static(UPLOADS_DIR));

// ================= API ROUTES =================

// 1. Get all vehicles
app.get('/api/vehicles', (_req: Request, res: Response) => {
  const vehicles = getVehicles();
  res.json({ success: true, count: vehicles.length, vehicles });
});

// 2. Get single vehicle by ID or slug
app.get('/api/vehicles/:id', (req: Request, res: Response) => {
  const vehicles = getVehicles();
  const vehicle = vehicles.find((v: any) => v.id === req.params.id || v.slug === req.params.id);
  if (!vehicle) {
    return res.status(404).json({ success: false, message: 'Vehicle not found' });
  }
  res.json({ success: true, vehicle });
});

// 3. Create a new vehicle listing
app.post('/api/vehicles', (req: Request, res: Response) => {
  const body = req.body;
  if (!body.brand || !body.model || !body.price) {
    return res.status(400).json({ success: false, message: 'Brand, model and price are required' });
  }

  const vehicles = getVehicles();
  const newId = body.id || `AHV-${new Date().getFullYear()}-${String(vehicles.length + 1).padStart(3, '0')}`;
  const slug = `${body.year || new Date().getFullYear()}-${body.brand}-${body.model}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  const newVehicle = {
    ...body,
    id: newId,
    slug: slug + '-' + Date.now().toString().slice(-4),
    price: Number(body.price),
    year: Number(body.year) || new Date().getFullYear(),
    images: Array.isArray(body.images) && body.images.length > 0 ? body.images : ['/src/assets/images/hero_luxury_cars_1792063513133.jpg'],
    category: Array.isArray(body.category) ? body.category : ['SUVs'],
    featured: Boolean(body.featured),
    availability: body.availability || 'Available',
    is_demo: false, // User created listing is actual dealer inventory
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  vehicles.unshift(newVehicle);
  saveVehicles(vehicles);

  res.status(201).json({ success: true, vehicle: newVehicle });
});

// 4. Update an existing vehicle
app.put('/api/vehicles/:id', (req: Request, res: Response) => {
  const vehicles = getVehicles();
  const index = vehicles.findIndex((v: any) => v.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Vehicle not found' });
  }

  const existing = vehicles[index];
  const updated = {
    ...existing,
    ...req.body,
    price: req.body.price !== undefined ? Number(req.body.price) : existing.price,
    year: req.body.year !== undefined ? Number(req.body.year) : existing.year,
    updated_at: new Date().toISOString(),
  };

  vehicles[index] = updated;
  saveVehicles(vehicles);

  res.json({ success: true, vehicle: updated });
});

// 5. Delete vehicle
app.delete('/api/vehicles/:id', (req: Request, res: Response) => {
  const vehicles = getVehicles();
  const filtered = vehicles.filter((v: any) => v.id !== req.params.id);
  if (filtered.length === vehicles.length) {
    return res.status(404).json({ success: false, message: 'Vehicle not found' });
  }

  saveVehicles(filtered);
  res.json({ success: true, message: 'Vehicle deleted successfully' });
});

// 6. Admin Authentication
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { password } = req.body;
  // Secure default passcode for AHAVA AUTOS dashboard
  if (password === 'ahava2026' || password === 'admin123' || password === process.env.ADMIN_PASSWORD) {
    return res.json({
      success: true,
      token: 'ahava_admin_session_' + Date.now(),
      user: { role: 'Administrator', username: 'ahava_manager' },
    });
  }
  return res.status(401).json({ success: false, message: 'Invalid administration password' });
});

// 7. Enquiries logging
app.post('/api/enquiries', (req: Request, res: Response) => {
  const { name, phone, carInterest, message, vehicleId } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ success: false, message: 'Name and phone number are required' });
  }

  const enquiries = getEnquiries();
  const newEnquiry = {
    id: 'ENQ-' + Date.now(),
    name,
    phone,
    carInterest: carInterest || 'General Enquiry',
    message: message || '',
    vehicleId: vehicleId || null,
    created_at: new Date().toISOString(),
  };

  enquiries.unshift(newEnquiry);
  saveEnquiries(enquiries);

  res.status(201).json({ success: true, enquiry: newEnquiry });
});

// 8. Admin get enquiries
app.get('/api/admin/enquiries', (_req: Request, res: Response) => {
  const enquiries = getEnquiries();
  res.json({ success: true, count: enquiries.length, enquiries });
});

// 9. Image Upload handler (Base64 file to static storage)
app.post('/api/upload', (req: Request, res: Response) => {
  try {
    const { imageBase64, filename } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ success: false, message: 'Image base64 data required' });
    }

    const matches = imageBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ success: false, message: 'Invalid base64 string' });
    }

    const extension = matches[1].split('/')[1] || 'jpg';
    const buffer = Buffer.from(matches[2], 'base64');
    const safeFilename = `car_${Date.now()}_${(filename || 'image').replace(/[^a-zA-Z0-9]/g, '_')}.${extension}`;
    const filePath = path.join(UPLOADS_DIR, safeFilename);

    fs.writeFileSync(filePath, buffer);

    res.json({
      success: true,
      url: `/uploads/${safeFilename}`,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: 'Failed to process image upload' });
  }
});

// 10. SEO: Robots.txt & Sitemap
app.get('/robots.txt', (_req: Request, res: Response) => {
  const siteUrl = process.env.APP_URL || 'https://ahava-autos.ng';
  res.type('text/plain');
  res.send(`User-agent: *
Allow: /
Disallow: /admin
Sitemap: ${siteUrl}/sitemap.xml
`);
});

app.get('/sitemap.xml', (_req: Request, res: Response) => {
  const vehicles = getVehicles();
  const siteUrl = process.env.APP_URL || 'https://ahava-autos.ng';
  const urls = [
    `<url><loc>${siteUrl}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>`,
    `<url><loc>${siteUrl}/#cars</loc><changefreq>daily</changefreq><priority>0.9</priority></url>`,
    `<url><loc>${siteUrl}/#brands</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`,
    `<url><loc>${siteUrl}/#about</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>`,
    `<url><loc>${siteUrl}/#contact</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>`,
    ...vehicles.map(
      (v: any) =>
        `<url><loc>${siteUrl}/#car/${v.id}</loc><lastmod>${v.updated_at.split('T')[0]}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`
    ),
  ];

  res.type('application/xml');
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`);
});

// Vite Middleware for Dev or Static Serve for Prod
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`AHAVA AUTOS server running on http://0.0.0.0:${PORT}`);
  });
}

setupServer();
