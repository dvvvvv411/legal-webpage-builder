import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Settings, Users, FileText, Shield, Building2, MessageSquare, Scale, TrendingUp } from 'lucide-react';
import LawFirmManager from '@/components/admin/LawFirmManager';
import ReviewManager from '@/components/admin/ReviewManager';
import LegalAreaManager from '@/components/admin/LegalAreaManager';

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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="law-firms">Kanzleien</TabsTrigger>
            <TabsTrigger value="reviews">Bewertungen</TabsTrigger>
            <TabsTrigger value="legal-areas">Rechtsgebiete</TabsTrigger>
            <TabsTrigger value="analytics">Statistiken</TabsTrigger>
          </TabsList>
          
          <TabsContent value="law-firms" className="mt-6">
            <LawFirmManager />
          </TabsContent>
          
          <TabsContent value="reviews" className="mt-6">
            <ReviewManager />
          </TabsContent>
          
          <TabsContent value="legal-areas" className="mt-6">
            <LegalAreaManager />
          </TabsContent>
          
          <TabsContent value="analytics" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Kanzleien</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">
                    Aktive Kanzleien
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Bewertungen</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2,350</div>
                  <p className="text-xs text-muted-foreground">
                    +15.3% vom letzten Monat
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Durchschnittsbewertung</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4.8</div>
                  <p className="text-xs text-muted-foreground">
                    Ausgezeichnete Leistung
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;