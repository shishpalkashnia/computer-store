import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export function useProducts(filters = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('products')
        .select(`
          *,
          product_images (id, image_url, is_primary)
        `)
        .order('created_at', { ascending: false });

      if (filters.brand && filters.brand !== 'all') {
        query = query.eq('brand', filters.brand);
      }
      if (filters.ram && filters.ram !== 'all') {
        query = query.eq('ram', filters.ram);
      }
      if (filters.storage && filters.storage !== 'all') {
        query = query.eq('storage', filters.storage);
      }
      if (filters.minPrice) {
        query = query.gte('price', filters.minPrice);
      }
      if (filters.maxPrice) {
        query = query.lte('price', filters.maxPrice);
      }
      if (filters.inStock !== undefined && filters.inStock !== null) {
        query = query.eq('in_stock', filters.inStock);
      }
      if (filters.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }
      if (filters.category) {
        query = query.contains('categories', [filters.category]);
      }

      const { data, error: fetchError } = await query;
      if (fetchError) throw fetchError;
      setProducts(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters.brand, filters.ram, filters.storage, filters.minPrice, filters.maxPrice, filters.inStock, filters.search, filters.category]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, refetch: fetchProducts };
}
