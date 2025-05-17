
import { supabase } from "@/integrations/supabase/client";
import { Product, ProductVersion } from "@/types/product";
import { toast } from "@/components/ui/use-toast";

export const fetchProducts = async (filters: Record<string, any> = {}) => {
  try {
    let query = supabase.from("products").select("*");

    // Apply filters if provided
    if (filters.status && filters.status !== "all") {
      query = query.eq("status", filters.status);
    }

    if (filters.category && filters.category !== "all") {
      query = query.eq("category", filters.category);
    }

    if (filters.manufacturer && filters.manufacturer !== "all") {
      query = query.eq("manufacturer", filters.manufacturer);
    }

    if (filters.dateFrom) {
      query = query.gte("created_at", filters.dateFrom);
    }

    if (filters.dateTo) {
      query = query.lte("created_at", filters.dateTo);
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data as Product[];
  } catch (error) {
    console.error("Error fetching products:", error);
    toast({
      title: "Error",
      description: "Failed to fetch products. Please try again.",
      variant: "destructive",
    });
    return [];
  }
};

export const fetchProductById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw error;
    }

    return data as Product;
  } catch (error) {
    console.error("Error fetching product:", error);
    toast({
      title: "Error",
      description: "Failed to fetch product details. Please try again.",
      variant: "destructive",
    });
    return null;
  }
};

export const fetchProductVersions = async (productId: string) => {
  try {
    const { data, error } = await supabase
      .from("product_versions")
      .select(`
        *,
        documents:linked_sop_id (id, title, number),
        capas:linked_capa_id (id, title, number)
      `)
      .eq("product_id", productId)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data as (ProductVersion & { documents: any; capas: any })[];
  } catch (error) {
    console.error("Error fetching product versions:", error);
    toast({
      title: "Error",
      description: "Failed to fetch product versions. Please try again.",
      variant: "destructive",
    });
    return [];
  }
};

export const createProduct = async (product: Omit<Product, "id" | "created_at" | "updated_at" | "created_by">) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .insert([product])
      .select();

    if (error) {
      throw error;
    }

    toast({
      title: "Success",
      description: "Product created successfully.",
    });

    return data[0] as Product;
  } catch (error) {
    console.error("Error creating product:", error);
    toast({
      title: "Error",
      description: "Failed to create product. Please try again.",
      variant: "destructive",
    });
    return null;
  }
};

export const updateProduct = async (id: string, updates: Partial<Product>) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select();

    if (error) {
      throw error;
    }

    toast({
      title: "Success",
      description: "Product updated successfully.",
    });

    return data[0] as Product;
  } catch (error) {
    console.error("Error updating product:", error);
    toast({
      title: "Error",
      description: "Failed to update product. Please try again.",
      variant: "destructive",
    });
    return null;
  }
};

export const createProductVersion = async (
  productVersion: Omit<ProductVersion, "id" | "created_at" | "created_by">
) => {
  try {
    const { data, error } = await supabase
      .from("product_versions")
      .insert([productVersion])
      .select();

    if (error) {
      throw error;
    }

    toast({
      title: "Success",
      description: "Product version created successfully.",
    });

    return data[0] as ProductVersion;
  } catch (error) {
    console.error("Error creating product version:", error);
    toast({
      title: "Error",
      description: "Failed to create product version. Please try again.",
      variant: "destructive",
    });
    return null;
  }
};

export const updateProductVersion = async (id: string, updates: Partial<ProductVersion>) => {
  try {
    const { data, error } = await supabase
      .from("product_versions")
      .update(updates)
      .eq("id", id)
      .select();

    if (error) {
      throw error;
    }

    toast({
      title: "Success",
      description: "Product version updated successfully.",
    });

    return data[0] as ProductVersion;
  } catch (error) {
    console.error("Error updating product version:", error);
    toast({
      title: "Error",
      description: "Failed to update product version. Please try again.",
      variant: "destructive",
    });
    return null;
  }
};

export const getProductCategories = async () => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("category")
      .not("category", "is", null);

    if (error) {
      throw error;
    }

    return [...new Set(data.map((item) => item.category).filter(Boolean))];
  } catch (error) {
    console.error("Error fetching product categories:", error);
    return [];
  }
};

export const getProductManufacturers = async () => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("manufacturer")
      .not("manufacturer", "is", null);

    if (error) {
      throw error;
    }

    return [...new Set(data.map((item) => item.manufacturer).filter(Boolean))];
  } catch (error) {
    console.error("Error fetching product manufacturers:", error);
    return [];
  }
};
