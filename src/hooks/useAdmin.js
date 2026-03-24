import { supabase } from '../lib/supabase';

export function useAdmin() {

  const getSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    console.log('Current session:', session ? `Authenticated as ${session.user.email}` : 'NO SESSION');
    if (!session) {
      throw new Error('Not authenticated. Please log in again.');
    }
    return session;
  };

  const createProduct = async (productData) => {
    await getSession();
    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select()
      .single();
    if (error) {
      console.error('Insert error details:', JSON.stringify(error));
      throw error;
    }
    return data;
  };

  const updateProduct = async (id, productData) => {
    await getSession();
    const { data, error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  };

  const deleteProduct = async (id) => {
    await getSession();
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    if (error) throw error;
  };

  const toggleStock = async (id, currentStatus) => {
    await getSession();
    const { data, error } = await supabase
      .from('products')
      .update({ in_stock: !currentStatus })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  };

  const toggleFeatured = async (id, currentStatus) => {
    await getSession();
    const { data, error } = await supabase
      .from('products')
      .update({ featured: !currentStatus })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  };

  const uploadImage = async (file) => {
    await getSession();
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file);
    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const addProductImage = async (productId, imageUrl, isPrimary = false) => {
    await getSession();
    const { data, error } = await supabase
      .from('product_images')
      .insert([{ product_id: productId, image_url: imageUrl, is_primary: isPrimary }])
      .select()
      .single();
    if (error) throw error;
    return data;
  };

  const deleteProductImage = async (imageId) => {
    await getSession();
    const { error } = await supabase
      .from('product_images')
      .delete()
      .eq('id', imageId);
    if (error) throw error;
  };

  const fetchAllProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        product_images (id, image_url, is_primary)
      `)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  };

  return {
    createProduct,
    updateProduct,
    deleteProduct,
    toggleStock,
    toggleFeatured,
    uploadImage,
    addProductImage,
    deleteProductImage,
    fetchAllProducts,
  };
}
