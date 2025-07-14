import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { LawFirmManager } from '@/components/admin/LawFirmManager';
import { ReviewManager } from '@/components/admin/ReviewManager';

const Admin = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="text-muted-foreground mt-1">
              Verwalten Sie Ihr Anwalt Portal
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline">
              {user.email}
            </Badge>
            <Button onClick={handleSignOut} variant="outline">
              Abmelden
            </Button>
          </div>
        </div>

        <Tabs defaultValue="law-firms" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="law-firms">Law Firms</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="law-firms" className="mt-6">
            <LawFirmManager />
          </TabsContent>
          <TabsContent value="reviews" className="mt-6">
            <ReviewManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;