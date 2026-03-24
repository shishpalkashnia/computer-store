import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useProduct(id) {
  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);

        const { data, error: fetchError } = await supabase
          .from('products')
          .select(`
            *,
            product_images (id, image_url, is_primary)
          `)
          .eq('id', id)
          .single();

        if (fetchError) throw fetchError;

        setProduct(data);
        setImages(data.product_images || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return { product, images, loading, error };
}
