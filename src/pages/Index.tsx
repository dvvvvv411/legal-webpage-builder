import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";

const Index = () => {
  const breadcrumbItems = [
    {
      label: "Steinbock & Partner Rechtsanwaltskanzlei Fachanwälte - Steuerberater",
      href: "/steinbock-partner"
    },
    {
      label: "Bewertungen",
      current: true
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Breadcrumb items={breadcrumbItems} />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Rechtliche Beratung finden
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Finden Sie qualifizierte Anwälte und Kanzleien in Ihrer Nähe. 
              Professionelle Rechtsberatung für alle Rechtsgebiete.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="text-xl font-semibold mb-3 text-card-foreground">
                Anwälte finden
              </h3>
              <p className="text-muted-foreground">
                Suchen Sie nach qualifizierten Anwälten in Ihrer Region für Ihr Rechtsgebiet.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="text-xl font-semibold mb-3 text-card-foreground">
                Kanzleien entdecken
              </h3>
              <p className="text-muted-foreground">
                Finden Sie etablierte Kanzleien mit Expertise in verschiedenen Rechtsbereichen.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="text-xl font-semibold mb-3 text-card-foreground">
                Rechtstipps lesen
              </h3>
              <p className="text-muted-foreground">
                Informieren Sie sich über aktuelle Rechtsentwicklungen und praktische Tipps.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
