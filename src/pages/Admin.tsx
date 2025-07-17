import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Building2, MessageSquare, Settings, Shield, LogOut, Users } from 'lucide-react';
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
      <div className="min-h-screen bg-page-background flex items-center justify-center">
        <div className="bg-white rounded-enhanced shadow-sm p-8 flex items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-orange-primary" />
          <span className="text-lg font-medium text-text-dark">
            Admin Panel wird geladen...
          </span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-page-background">
      {/* Professional Header */}
      <div className="bg-white border-b border-divider shadow-sm">
        <div className="container mx-auto px-enhanced py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="bg-orange-primary/10 rounded-enhanced p-3">
                  <Shield className="h-8 w-8 text-orange-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-text-dark">
                    Anwalt.de Admin Panel
                  </h1>
                  <p className="text-text-muted">
                    Verwalten Sie Ihr Anwalt Portal
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge 
                variant="outline" 
                className="bg-sehr-gut-bg text-sehr-gut-text border-sehr-gut-outline px-4 py-2"
              >
                <Users className="h-4 w-4 mr-2" />
                {user.email}
              </Badge>
              <Button 
                onClick={handleSignOut} 
                variant="outline"
                className="border-orange-primary text-orange-primary hover:bg-orange-primary hover:text-white"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Abmelden
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-enhanced py-8">
        {/* Dashboard Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white border-divider shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-text-dark">
                  Kanzleien
                </CardTitle>
                <Building2 className="h-6 w-6 text-orange-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-text-dark mb-1">
                Verwalten
              </div>
              <p className="text-text-muted text-sm">
                Kanzleien und Anwälte verwalten
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-divider shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-text-dark">
                  Bewertungen
                </CardTitle>
                <MessageSquare className="h-6 w-6 text-orange-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-text-dark mb-1">
                Moderieren
              </div>
              <p className="text-text-muted text-sm">
                Bewertungen prüfen und verwalten
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-divider shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-text-dark">
                  System
                </CardTitle>
                <Settings className="h-6 w-6 text-orange-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-text-dark mb-1">
                Einstellungen
              </div>
              <p className="text-text-muted text-sm">
                Systemkonfiguration
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Card className="bg-white border-divider shadow-sm">
          <Tabs defaultValue="law-firms" className="w-full">
            <div className="border-b border-divider">
              <TabsList className="bg-transparent h-auto p-0 w-full justify-start">
                <TabsTrigger 
                  value="law-firms" 
                  className="flex items-center gap-2 px-6 py-4 text-base font-medium border-b-2 border-transparent data-[state=active]:border-orange-primary data-[state=active]:text-orange-primary data-[state=active]:bg-transparent rounded-none bg-transparent"
                >
                  <Building2 className="h-5 w-5" />
                  Kanzleien & Anwälte
                </TabsTrigger>
                <TabsTrigger 
                  value="reviews" 
                  className="flex items-center gap-2 px-6 py-4 text-base font-medium border-b-2 border-transparent data-[state=active]:border-orange-primary data-[state=active]:text-orange-primary data-[state=active]:bg-transparent rounded-none bg-transparent"
                >
                  <MessageSquare className="h-5 w-5" />
                  Bewertungen
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="law-firms" className="p-6 mt-0">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-text-dark">
                      Kanzleien verwalten
                    </h3>
                    <p className="text-text-muted">
                      Verwalten Sie Kanzleien und deren Anwälte
                    </p>
                  </div>
                </div>
                <LawFirmManager />
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="p-6 mt-0">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-text-dark">
                      Bewertungen moderieren
                    </h3>
                    <p className="text-text-muted">
                      Prüfen und verwalten Sie Bewertungen
                    </p>
                  </div>
                </div>
                <ReviewManager />
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Admin;