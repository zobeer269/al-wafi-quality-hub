import { supabase } from '@/integrations/supabase/client';
import type { Product, ProductStatus, ProductVersion, ProductFormValues, ProductFilters } from '@/types/product';

/**
 * Get products with optional filtering
 */
export async function getProducts(filters?: ProductFilters): Promise<Product[]> {
  try {
    let query = supabase.from('products').select('*');

    // Apply filters if present
    if (filters) {
      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      if (filters.category) {
        query = query.eq('category', filters.category);
      }

      if (filters.manufacturer) {
        query = query.eq('manufacturer', filters.manufacturer);
      }

      if (filters.dateFrom) {
        query = query.gte('created_at', filters.dateFrom);
      }

      if (filters.dateTo) {
        query = query.lte('created_at', filters.dateTo);
      }
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

/**
 * Fetch a product by ID
 */
export async function fetchProductById(id: string): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching product by ID:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    return null;
  }
}

/**
 * Create a new product
 */
export async function createProduct(product: ProductFormValues): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([
        {
          ...product,
          created_by: (await supabase.auth.getUser()).data?.user?.id,
        },
      ])
      .select();

    if (error) {
      console.error('Error creating product:', error);
      return null;
    }

    return data ? data[0] : null;
  } catch (error) {
    console.error('Error creating product:', error);
    return null;
  }
}

/**
 * Update an existing product
 */
export async function updateProduct(id: string, updates: Partial<ProductFormValues>): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating product:', error);
      return null;
    }

    return data ? data[0] : null;
  } catch (error) {
    console.error('Error updating product:', error);
    return null;
  }
}

/**
 * Delete a product by ID
 */
export async function deleteProduct(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting product:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
}

// Update specific functions that have status comparison issues
export async function getActiveProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .in('status', ['Approved', 'Released']);

    if (error) {
      console.error('Error fetching active products:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching active products:', error);
    return [];
  }
}

/**
 * Get all product versions for a specific product
 */
export async function getProductVersions(productId: string): Promise<ProductVersion[]> {
  try {
    const { data, error } = await supabase
      .from('product_versions')
      .select('*')
      .eq('product_id', productId);

    if (error) {
      console.error('Error fetching product versions:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching product versions:', error);
    return [];
  }
}

/**
 * Create a new product version
 */
export async function createProductVersion(version: ProductVersion): Promise<ProductVersion | null> {
  try {
    const { data, error } = await supabase
      .from('product_versions')
      .insert([version])
      .select();

    if (error) {
      console.error('Error creating product version:', error);
      return null;
    }

    return data ? data[0] : null;
  } catch (error) {
    console.error('Error creating product version:', error);
    return null;
  }
}

/**
 * Update an existing product version
 */
export async function updateProductVersion(id: string, updates: Partial<ProductVersion>): Promise<ProductVersion | null> {
  try {
    const { data, error } = await supabase
      .from('product_versions')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating product version:', error);
      return null;
    }

    return data ? data[0] : null;
  } catch (error) {
    console.error('Error updating product version:', error);
    return null;
  }
}

/**
 * Delete a product version by ID
 */
export async function deleteProductVersion(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('product_versions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting product version:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting product version:', error);
    return false;
  }
}
