import { supabase } from "@/integrations/supabase/client";
import { Product, ProductFormValues, ProductStatus, ProductFilters, ProductVersion, ProductVersionFormValues } from "@/types/product";
import { toast } from "@/hooks/use-toast";

// Function to fetch products with optional filters
export async function getProducts(filters?: ProductFilters): Promise<Product[]> {
  try {
    let query = supabase
      .from('products')
      .select('*')
      .order('name');
    
    if (filters) {
      // Filter by status if provided and not 'all'
      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }
      
      // Filter by category if provided
      if (filters.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }
      
      // Filter by manufacturer if provided
      if (filters.manufacturer && filters.manufacturer !== 'all') {
        query = query.eq('manufacturer', filters.manufacturer);
      }
      
      // Filter by date range if provided
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
    
    return data as Product[];
  } catch (error) {
    console.error('Error in getProducts:', error);
    return [];
  }
}

// Get unique product categories for filters
export const getProductCategories = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('category')
      .not('category', 'is', null)
      .order('category');
    
    if (error) {
      throw error;
    }
    
    return [...new Set(data.map(p => p.category).filter(Boolean))];
  } catch (error) {
    console.error('Error fetching product categories:', error);
    return [];
  }
};

// Get unique product manufacturers for filters
export const getProductManufacturers = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('manufacturer')
      .not('manufacturer', 'is', null)
      .order('manufacturer');
    
    if (error) {
      throw error;
    }
    
    return [...new Set(data.map(p => p.manufacturer).filter(Boolean))];
  } catch (error) {
    console.error('Error fetching product manufacturers:', error);
    return [];
  }
};

// Fetch a single product by ID
export const fetchProductById = async (id: string): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      throw error;
    }
    
    return {
      id: data.id,
      sku: data.sku,
      name: data.name,
      category: data.category || undefined,
      description: data.description || undefined,
      manufacturer: data.manufacturer || undefined,
      registration_number: data.registration_number || undefined,
      status: data.status as Product['status'],
      created_by: data.created_by,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    toast({
      title: "Error",
      description: "Failed to load product details. Please try again.",
      variant: "destructive",
    });
    return null;
  }
};

// Create a new product
export const createProduct = async (productData: Partial<Product>): Promise<Product | null> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData.user) {
      throw new Error("User not authenticated");
    }
    
    const product = {
      sku: productData.sku!,
      name: productData.name!,
      category: productData.category || null,
      description: productData.description || null,
      manufacturer: productData.manufacturer || null,
      registration_number: productData.registration_number || null,
      status: productData.status || "In Development",
      created_by: userData.user.id,
    };
    
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    toast({
      title: "Success",
      description: "Product created successfully.",
    });
    
    return {
      id: data.id,
      sku: data.sku,
      name: data.name,
      category: data.category || undefined,
      description: data.description || undefined,
      manufacturer: data.manufacturer || undefined,
      registration_number: data.registration_number || undefined,
      status: data.status as Product['status'],
      created_by: data.created_by,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  } catch (error) {
    console.error('Error creating product:', error);
    toast({
      title: "Error",
      description: "Failed to create product. Please try again.",
      variant: "destructive",
    });
    return null;
  }
};

// Update an existing product
export const updateProduct = async (id: string, productData: Partial<Product>): Promise<Product | null> => {
  try {
    const updateData = {
      name: productData.name,
      category: productData.category,
      description: productData.description,
      manufacturer: productData.manufacturer,
      registration_number: productData.registration_number,
      status: productData.status,
      updated_at: new Date().toISOString(),
    };
    
    const { data, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    toast({
      title: "Success",
      description: "Product updated successfully.",
    });
    
    return {
      id: data.id,
      sku: data.sku,
      name: data.name,
      category: data.category || undefined,
      description: data.description || undefined,
      manufacturer: data.manufacturer || undefined,
      registration_number: data.registration_number || undefined,
      status: data.status as Product['status'],
      created_by: data.created_by,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  } catch (error) {
    console.error('Error updating product:', error);
    toast({
      title: "Error",
      description: "Failed to update product. Please try again.",
      variant: "destructive",
    });
    return null;
  }
};

// Fetch product versions
export const fetchProductVersions = async (productId: string): Promise<ProductVersion[]> => {
  try {
    let query = supabase
      .from('product_versions')
      .select(`
        *,
        documents:linked_sop_id (number, title),
        capas:linked_capa_id (number, title)
      `)
      .eq('product_id', productId)
      .order('created_at', { ascending: false });
    
    const { data, error } = await query;
    
    if (error) {
      throw error;
    }
    
    return data.map(v => ({
      id: v.id,
      product_id: v.product_id,
      version: v.version,
      changes_summary: v.changes_summary || undefined,
      effective_date: v.effective_date || undefined,
      status: v.status as ProductVersion['status'],
      linked_sop_id: v.linked_sop_id || undefined,
      linked_capa_id: v.linked_capa_id || undefined,
      created_by: v.created_by,
      created_at: v.created_at,
      documents: v.documents,
      capas: v.capas,
    }));
  } catch (error) {
    console.error('Error fetching product versions:', error);
    toast({
      title: "Error",
      description: "Failed to load product versions. Please try again.",
      variant: "destructive",
    });
    return [];
  }
};

// Create a new product version
export const createProductVersion = async (versionData: Partial<ProductVersion>): Promise<ProductVersion | null> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData.user) {
      throw new Error("User not authenticated");
    }
    
    const version = {
      product_id: versionData.product_id!,
      version: versionData.version!,
      changes_summary: versionData.changes_summary || null,
      effective_date: versionData.effective_date || null,
      status: versionData.status || "Draft",
      linked_sop_id: versionData.linked_sop_id || null,
      linked_capa_id: versionData.linked_capa_id || null,
      created_by: userData.user.id,
    };
    
    // If status is Active, check if there are other active versions and update them
    if (version.status === "Active") {
      await supabase
        .from('product_versions')
        .update({ status: "Retired" })
        .eq('product_id', version.product_id)
        .eq('status', "Active");
    }
    
    const { data, error } = await supabase
      .from('product_versions')
      .insert([version])
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    toast({
      title: "Success",
      description: "Product version created successfully.",
    });
    
    return {
      id: data.id,
      product_id: data.product_id,
      version: data.version,
      changes_summary: data.changes_summary || undefined,
      effective_date: data.effective_date || undefined,
      status: data.status as ProductVersion['status'],
      linked_sop_id: data.linked_sop_id || undefined,
      linked_capa_id: data.linked_capa_id || undefined,
      created_by: data.created_by,
      created_at: data.created_at,
    };
  } catch (error) {
    console.error('Error creating product version:', error);
    toast({
      title: "Error",
      description: "Failed to create product version. Please try again.",
      variant: "destructive",
    });
    return null;
  }
};

// Update an existing product version
export const updateProductVersion = async (id: string, versionData: Partial<ProductVersion>): Promise<ProductVersion | null> => {
  try {
    const updateData = {
      version: versionData.version,
      changes_summary: versionData.changes_summary,
      effective_date: versionData.effective_date,
      status: versionData.status,
      linked_sop_id: versionData.linked_sop_id,
      linked_capa_id: versionData.linked_capa_id,
    };
    
    // If status is Active, check if there are other active versions and update them
    if (updateData.status === "Active") {
      const { data: versionInfo } = await supabase
        .from('product_versions')
        .select('product_id')
        .eq('id', id)
        .single();
        
      if (versionInfo) {
        await supabase
          .from('product_versions')
          .update({ status: "Retired" })
          .eq('product_id', versionInfo.product_id)
          .eq('status', "Active")
          .neq('id', id);
      }
    }
    
    const { data, error } = await supabase
      .from('product_versions')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    toast({
      title: "Success",
      description: "Product version updated successfully.",
    });
    
    return {
      id: data.id,
      product_id: data.product_id,
      version: data.version,
      changes_summary: data.changes_summary || undefined,
      effective_date: data.effective_date || undefined,
      status: data.status as ProductVersion['status'],
      linked_sop_id: data.linked_sop_id || undefined,
      linked_capa_id: data.linked_capa_id || undefined,
      created_by: data.created_by,
      created_at: data.created_at,
    };
  } catch (error) {
    console.error('Error updating product version:', error);
    toast({
      title: "Error",
      description: "Failed to update product version. Please try again.",
      variant: "destructive",
    });
    return null;
  }
};

// Function to check product status
const checkProductStatus = (status: string): boolean => {
  // Use proper status comparison with ProductStatus type
  return status === 'Approved' || status === 'Released';
};

// Fix any function that was using 'Active' comparison with the checkProductStatus function
