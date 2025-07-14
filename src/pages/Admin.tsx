import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Settings, Users, FileText, Shield } from 'lucide-react';

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Benutzer
              </CardTitle>
              <CardDescription>
                Benutzerverwaltung und -statistiken
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" disabled>
                Bald verfügbar
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Bewertungen
              </CardTitle>
              <CardDescription>
                Bewertungen verwalten und moderieren
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" disabled>
                Bald verfügbar
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Sicherheit
              </CardTitle>
              <CardDescription>
                Sicherheitseinstellungen und Logs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" disabled>
                Bald verfügbar
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Einstellungen
              </CardTitle>
              <CardDescription>
                Systemeinstellungen und Konfiguration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" disabled>
                Bald verfügbar
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Willkommen im Admin-Bereich</CardTitle>
            <CardDescription>
              Hier können Sie in Zukunft alle Aspekte Ihres Anwalt Portals verwalten.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>• Benutzer verwalten und Rollen zuweisen</p>
              <p>• Bewertungen moderieren und bearbeiten</p>
              <p>• Systemeinstellungen konfigurieren</p>
              <p>• Sicherheitseinstellungen überwachen</p>
              <p>• Berichte und Statistiken einsehen</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;