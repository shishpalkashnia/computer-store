-- ============================================
-- Online Computers Sirsa — Supabase Schema
-- Run this in your Supabase SQL Editor
-- ============================================

-- Products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  price INTEGER NOT NULL,
  original_price INTEGER,
  ram TEXT,
  storage TEXT,
  processor TEXT,
  screen_size TEXT,
  condition TEXT DEFAULT 'Good',
  description TEXT,
  categories TEXT[] DEFAULT '{}',
  in_stock BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Product images table
CREATE TABLE product_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read products" ON products
  FOR SELECT USING (true);

CREATE POLICY "Public read images" ON product_images
  FOR SELECT USING (true);

-- Authenticated (admin) write access
CREATE POLICY "Admin insert products" ON products
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Admin update products" ON products
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin delete products" ON products
  FOR DELETE TO authenticated USING (true);

CREATE POLICY "Admin insert images" ON product_images
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Admin update images" ON product_images
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin delete images" ON product_images
  FOR DELETE TO authenticated USING (true);

-- Storage bucket for product images (run separately if needed)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

-- Storage policy: allow authenticated users to upload
-- CREATE POLICY "Admin upload images" ON storage.objects
--   FOR INSERT TO authenticated WITH CHECK (bucket_id = 'product-images');

-- CREATE POLICY "Admin delete storage" ON storage.objects
--   FOR DELETE TO authenticated USING (bucket_id = 'product-images');

-- CREATE POLICY "Public read storage" ON storage.objects
--   FOR SELECT USING (bucket_id = 'product-images');
