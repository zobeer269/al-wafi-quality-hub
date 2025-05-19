import { supabase } from "@/integrations/supabase/client";

// Function to seed demo data
export const seedDemoData = async () => {
  try {
    // Check if data already exists to avoid duplicates
    const { data: existingUsers, error: userCheckError } = await supabase
      .from('profiles')
      .select('count')
      .single();

    if (userCheckError) {
      console.error("Error checking existing users:", userCheckError);
      return { success: false, message: "Error checking existing data" };
    }

    // If we already have users, don't seed
    if (existingUsers && existingUsers.count > 0) {
      return { success: false, message: "Seed data already exists. Skipping seed operation." };
    }

    // 1. Create test users (this is simulated - actual user creation happens through auth)
    // This just creates the profiles, assuming auth users are created separately
    
    const usersToCreate = [
      {
        id: '00000000-0000-0000-0000-000000000001', // placeholder ID
        first_name: 'Admin',
        last_name: 'User',
        department: 'IT',
        job_title: 'System Administrator'
      },
      {
        id: '00000000-0000-0000-0000-000000000002', // placeholder ID
        first_name: 'QA',
        last_name: 'Manager',
        department: 'Quality Assurance',
        job_title: 'QA Manager'
      },
      {
        id: '00000000-0000-0000-0000-000000000003', // placeholder ID
        first_name: 'Regular',
        last_name: 'User',
        department: 'Operations',
        job_title: 'Operations Specialist'
      }
    ];
    
    // Insert profiles
    const { error: profilesError } = await supabase
      .from('profiles')
      .insert(usersToCreate);
      
    if (profilesError) {
      console.error("Error creating profiles:", profilesError);
      return { success: false, message: "Failed to create user profiles" };
    }
    
    // 2. Create user roles
    const rolesToCreate = [
      { user_id: '00000000-0000-0000-0000-000000000001', role: 'admin' },
      { user_id: '00000000-0000-0000-0000-000000000002', role: 'qa' },
      { user_id: '00000000-0000-0000-0000-000000000003', role: 'user' }
    ];
    
    await createUserRoles(rolesToCreate);
    
    // 3. Create sample products
    const adminUserId = '00000000-0000-0000-0000-000000000001';
    
    const productsToCreate = [
      {
        name: 'Medical Ventilator XS2000',
        sku: 'MV-XS2000',
        description: 'High-performance medical ventilator for critical care',
        category: 'Medical Device',
        manufacturer: 'AL-WAFI Medical',
        registration_number: 'MD-202305-001',
        status: 'Active',
        created_by: adminUserId
      },
      {
        name: 'Pulse Oximeter PO300',
        sku: 'PO-300',
        description: 'Non-invasive pulse oximeter for SpO2 monitoring',
        category: 'Medical Device',
        manufacturer: 'AL-WAFI Medical',
        registration_number: 'MD-202305-002',
        status: 'In Development',
        created_by: adminUserId
      }
    ];
    
    const { data: products, error: productsError } = await supabase
      .from('products')
      .insert(productsToCreate)
      .select();
      
    if (productsError || !products) {
      console.error("Error creating products:", productsError);
      return { success: false, message: "Failed to create products" };
    }
    
    // 4. Create product versions
    const productVersionsToCreate = products.map(product => ({
      product_id: product.id,
      version: '1.0.0',
      status: 'Draft',
      changes_summary: 'Initial version',
      created_by: adminUserId
    }));
    
    const { error: versionsError } = await supabase
      .from('product_versions')
      .insert(productVersionsToCreate);
      
    if (versionsError) {
      console.error("Error creating product versions:", versionsError);
      return { success: false, message: "Failed to create product versions" };
    }
    
    // 5. Create CAPAs
    const capasToCreate = [
      {
        number: 'CAPA-' + new Date().getFullYear() + '0501-1001',
        title: 'Ventilator Alarm System Improvement',
        description: 'Address inconsistent alarm triggering in low battery scenarios',
        capa_type: 'Corrective',
        priority: 2,
        status: 'Open',
        assigned_to: '00000000-0000-0000-0000-000000000002', // QA Manager
        created_by: adminUserId,
        due_date: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString()
      },
      {
        number: 'CAPA-' + new Date().getFullYear() + '0501-1002',
        title: 'Oximeter Display Calibration',
        description: 'Preventive action to ensure display accuracy across temperature ranges',
        capa_type: 'Preventive',
        priority: 3,
        status: 'Open',
        assigned_to: '00000000-0000-0000-0000-000000000002', // QA Manager
        created_by: adminUserId,
        due_date: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString()
      }
    ];
    
    const { data: capas, error: capasError } = await supabase
      .from('capas')
      .insert(capasToCreate)
      .select();
      
    if (capasError || !capas) {
      console.error("Error creating CAPAs:", capasError);
      return { success: false, message: "Failed to create CAPAs" };
    }
    
    // 6. Create Non-Conformance linked to CAPA
    const ncToCreate = {
      nc_number: 'NC-' + new Date().getFullYear() + '-0001',
      title: 'Ventilator Alarm Failure',
      description: 'Alarm failed to trigger at 15% battery level during validation testing',
      severity: 'Major',
      status: 'Open',
      category: 'Device',
      source: 'Internal Testing',
      reported_by: adminUserId,
      assigned_to: '00000000-0000-0000-0000-000000000002', // QA Manager
      linked_capa_id: capas[0].id, // Link to first CAPA
      capa_required: true,
      due_date: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString()
    };
    
    const { data: nc, error: ncError } = await supabase
      .from('non_conformances')
      .insert(ncToCreate)
      .select()
      .single();
      
    if (ncError || !nc) {
      console.error("Error creating non-conformance:", ncError);
      return { success: false, message: "Failed to create non-conformance" };
    }
    
    // Update CAPA with linked NC
    const { error: capaUpdateError } = await supabase
      .from('capas')
      .update({ linked_nc_id: nc.id })
      .eq('id', capas[0].id);
      
    if (capaUpdateError) {
      console.error("Error updating CAPA with NC link:", capaUpdateError);
    }
    
    // 7. Create a complaint linked to product
    const complaintToCreate = {
      complaint_number: 'COMP-' + new Date().getFullYear() + '-0001',
      title: 'Display Flickering Issue',
      description: 'Customer reported intermittent display flickering on the oximeter',
      severity: 'Minor',
      status: 'Open',
      product_id: products[1].id, // Oximeter product
      customer_name: 'Al Shifa Hospital',
      customer_contact: 'dr.ahmed@alshifa.org',
      reported_by: '00000000-0000-0000-0000-000000000003', // Regular user
      assigned_to: '00000000-0000-0000-0000-000000000002', // QA Manager
      due_date: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString()
    };
    
    const { error: complaintError } = await supabase
      .from('complaints')
      .insert(complaintToCreate);
      
    if (complaintError) {
      console.error("Error creating complaint:", complaintError);
      return { success: false, message: "Failed to create complaint" };
    }
    
    return { 
      success: true, 
      message: "Successfully seeded demo data with users, products, CAPAs, non-conformance, and complaint" 
    };
    
  } catch (error) {
    console.error("Error seeding demo data:", error);
    return { success: false, message: "An unexpected error occurred while seeding data" };
  }
};

// Update the function that's inserting user roles
async function createUserRoles(roles: { user_id: string; role: string }[]): Promise<void> {
  try {
    // Insert roles one by one to avoid type issues
    for (const roleData of roles) {
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: roleData.user_id,
          role: roleData.role
        });
      
      if (error) {
        console.error('Error creating user role:', error);
      }
    }
    
    console.log('User roles created successfully');
  } catch (error) {
    console.error('Error in createUserRoles:', error);
  }
}

export async function seedCAPAData() {
  console.log("Seeding CAPA data...");

  try {
    const existingCapas = await supabase
      .from('capas')
      .select('*');

    if (existingCapas.data && existingCapas.data.length > 0) {
      console.log(`Found ${existingCapas.data.length} existing CAPAs, skipping seed`);
      return;
    }

    // Get a user to assign as creator
    const { data: user } = await supabase.auth.getUser();
    const userId = user?.user?.id || '00000000-0000-0000-0000-000000000000';

    // Create some sample CAPAs with the right structure to match the database
    const capaItems = [
      {
        number: 'CAPA-20250101-1001',
        title: 'CAPA for Process Deviation',
        description: 'Corrective action required for manufacturing process deviation',
        capa_type: 'Corrective' as CAPAType,
        priority: 3 as CAPAPriority,
        status: 'Open' as const,
        assigned_to: userId,
        created_by: userId,
        due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        tags: ['process', 'deviation']
      },
      {
        number: 'CAPA-20250101-1002',
        title: 'CAPA for Equipment Calibration',
        description: 'Preventive action for equipment calibration processes',
        capa_type: 'Preventive' as CAPAType,
        priority: 2 as CAPAPriority,
        status: 'Investigation' as const,
        assigned_to: userId,
        created_by: userId,
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        tags: ['equipment', 'calibration']
      }
    ];

    // Insert CAPAs one by one to avoid type issues
    for (const capa of capaItems) {
      const { error } = await supabase
        .from('capas')
        .insert(capa);
      
      if (error) {
        console.error("Error inserting CAPA:", error);
      }
    }

    console.log("CAPA data seeded successfully!");
  } catch (error) {
    console.error("Error seeding CAPA data:", error);
  }
}

export async function seedUserRoles() {
  console.log("Seeding user roles data...");

  try {
    const existingRoles = await supabase
      .from('user_roles')
      .select('*');

    if (existingRoles.data && existingRoles.data.length > 0) {
      console.log(`Found ${existingRoles.data.length} existing user roles, skipping seed`);
      return;
    }

    // Get the current user to assign roles
    const { data: user } = await supabase.auth.getUser();
    const userId = user?.user?.id;

    if (userId) {
      // Insert admin role for current user
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: 'admin'
        });
      
      if (error) {
        console.error("Error inserting user role:", error);
      } else {
        console.log(`Added admin role to user ${userId}`);
      }
    } else {
      console.log("No authenticated user found, skipping user roles seed");
    }

  } catch (error) {
    console.error("Error seeding user roles:", error);
  }
}
