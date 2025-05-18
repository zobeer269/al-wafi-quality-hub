
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Alert, 
  AlertTitle, 
  AlertDescription 
} from '@/components/ui/alert';
import { 
  Database, 
  RefreshCcw, 
  Users, 
  AlertCircle, 
  CheckCircle2, 
  LanguagesIcon 
} from 'lucide-react';
import { toast } from 'sonner';
import DashboardLayout from '@/layouts/DashboardLayout';
import PageHeader from '@/components/ui/PageHeader';
import { seedDemoData } from '@/utils/seedDataService';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

const StagingAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const { language, setLanguage } = useLanguage();

  const handleSeedData = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      const seedResult = await seedDemoData();
      setResult(seedResult);
      
      if (seedResult.success) {
        toast.success("Demo data seeded successfully!");
      } else {
        toast.warning(seedResult.message);
      }
    } catch (error) {
      console.error("Error seeding data:", error);
      setResult({ success: false, message: "An unexpected error occurred" });
      toast.error("Failed to seed demo data");
    } finally {
      setLoading(false);
    }
  };

  const handleResetDemoData = async () => {
    // This would typically involve deleting all data and re-seeding
    // For this demo, we'll just show a message
    toast.info("This feature would reset all demo data in a real implementation");
  };

  const createTestUser = async (email: string, role: 'admin' | 'qa' | 'user') => {
    setLoading(true);
    
    try {
      // In a real implementation, you would use Auth API to create users
      // This is a placeholder for demonstration
      toast.info(`In production, this would create a user with email ${email} and role ${role}`);
      
      // Show success message
      toast.success(`Test user credentials ready: ${email} / testpassword123`);
    } catch (error) {
      console.error("Error creating test user:", error);
      toast.error("Failed to create test user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <PageHeader 
        title="Staging Environment Administration" 
        description="Manage the QMS staging environment setup and configuration"
        icon={<Database className="h-6 w-6" />}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="mr-2 h-5 w-5" /> Demo Data Management
            </CardTitle>
            <CardDescription>
              Seed or reset the staging environment with sample data for testing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              Configure the staging environment with sample data including users, products,
              CAPAs, non-conformances, and more for end-to-end testing.
            </p>
            
            {result && (
              <Alert className={result.success ? "bg-green-50" : "bg-amber-50"}>
                {result.success ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                )}
                <AlertTitle className={result.success ? "text-green-600" : "text-amber-600"}>
                  {result.success ? "Success" : "Information"}
                </AlertTitle>
                <AlertDescription>
                  {result.message}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button onClick={handleSeedData} disabled={loading}>
              <Database className="mr-2 h-4 w-4" />
              Seed Demo Data
            </Button>
            <Button onClick={handleResetDemoData} variant="outline" disabled={loading}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Reset Data
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" /> Test User Management
            </CardTitle>
            <CardDescription>
              Create and manage test user accounts for different roles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              Generate test users with different permission levels to validate role-based access control.
            </p>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-md">
                <div className="font-medium">Admin User</div>
                <div className="text-sm text-gray-600">Full system access</div>
                <Button 
                  size="sm" 
                  className="mt-2"
                  onClick={() => createTestUser('admin@wafi.test', 'admin')}
                  disabled={loading}
                >
                  Create Admin
                </Button>
              </div>
              
              <div className="p-3 bg-purple-50 rounded-md">
                <div className="font-medium">QA Manager</div>
                <div className="text-sm text-gray-600">Quality system management</div>
                <Button 
                  size="sm" 
                  className="mt-2"
                  onClick={() => createTestUser('qa@wafi.test', 'qa')}
                  disabled={loading}
                >
                  Create QA User
                </Button>
              </div>
              
              <div className="p-3 bg-green-50 rounded-md">
                <div className="font-medium">Regular User</div>
                <div className="text-sm text-gray-600">Basic system access</div>
                <Button 
                  size="sm" 
                  className="mt-2"
                  onClick={() => createTestUser('user@wafi.test', 'user')}
                  disabled={loading}
                >
                  Create Regular User
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <LanguagesIcon className="mr-2 h-5 w-5" /> Language Settings
            </CardTitle>
            <CardDescription>
              Configure multilingual support for the QMS platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              Test the multilingual capabilities by switching between English and Arabic interfaces.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant={language === 'en' ? 'default' : 'outline'} 
                className="w-full"
                onClick={() => setLanguage('en')}
              >
                <span className="mr-2">🇺🇸</span>
                English
              </Button>
              <Button 
                variant={language === 'ar' ? 'default' : 'outline'} 
                className="w-full"
                onClick={() => setLanguage('ar')}
              >
                <span className="mr-2">🇸🇦</span>
                العربية
              </Button>
            </div>
            {language === 'ar' && (
              <Alert className="bg-blue-50 mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>RTL Support Active</AlertTitle>
                <AlertDescription>
                  The interface is now displayed in right-to-left mode for Arabic language.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Staging Environment Information</CardTitle>
            <CardDescription>
              Details about the current staging deployment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Deployment URL</h3>
                <p className="mt-1">qms-staging.alwafi.lovableproject.com</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Environment</h3>
                <p className="mt-1">Staging / Test</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Version</h3>
                <p className="mt-1">0.9.0-beta</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Build Date</h3>
                <p className="mt-1">{new Date().toLocaleDateString()}</p>
              </div>
              
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Test Environment</AlertTitle>
                <AlertDescription>
                  This is a staging environment for testing purposes only. Data will be reset periodically.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StagingAdmin;
