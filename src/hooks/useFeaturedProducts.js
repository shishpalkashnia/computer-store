import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useFeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            product_images (id, image_url, is_primary)
          `)
          .eq('featured', true)
          .eq('in_stock', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setFeaturedProducts(data || []);
      } catch (err) {
        console.error('Error fetching featured products:', err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchFeatured();
  }, []);

  return { featuredProducts, loading };
}
