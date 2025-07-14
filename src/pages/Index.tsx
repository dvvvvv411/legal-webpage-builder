import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, LogIn, Settings, Star } from 'lucide-react';

const Index = () => {
  const { user, loading, signOut } = useAuth();

  useEffect(() => {
    document.title = "ᐅ Anwalt Portal ᐅ Bewertungen und Vorlagen für Anwälte";
    
    // Set meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Anwalt Portal - Finden Sie den passenden Anwalt durch Bewertungen und nutzen Sie unsere Vorlagen für Ihre Rechtsberatung.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Anwalt Portal - Finden Sie den passenden Anwalt durch Bewertungen und nutzen Sie unsere Vorlagen für Ihre Rechtsberatung.';
      document.head.appendChild(meta);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="text-center mx-auto">
            <img 
              className="mx-auto mb-4" 
              width="200" 
              height="38" 
              src="https://www.anwalt.de/img/anwalt.de-logo.svg" 
              alt="Anwalt.de"
            />
            <h1 className="text-3xl font-bold mb-2">Anwalt Portal</h1>
            <p className="text-muted-foreground">Bewertungen und Vorlagen für Anwälte</p>
          </div>
          
          {user && (
            <div className="flex items-center gap-4">
              <Badge variant="outline">
                {user.email}
              </Badge>
              <Button onClick={signOut} variant="outline">
                Abmelden
              </Button>
            </div>
          )}
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Bewertungen
              </CardTitle>
              <CardDescription>
                Schreiben Sie eine Bewertung für einen Anwalt
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/vorlage">
                <Button className="w-full">
                  Zur Bewertung
                </Button>
              </Link>
            </CardContent>
          </Card>

          {!user ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LogIn className="h-5 w-5" />
                  Anmelden
                </CardTitle>
                <CardDescription>
                  Melden Sie sich an oder registrieren Sie sich
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/auth">
                  <Button className="w-full" variant="outline">
                    Anmelden / Registrieren
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Administration
                </CardTitle>
                <CardDescription>
                  Verwalten Sie das Portal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/admin">
                  <Button className="w-full" variant="outline">
                    Admin Panel
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;