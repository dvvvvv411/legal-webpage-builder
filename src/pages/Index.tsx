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
        {/* Content wird hier hinzugefügt */}
      </main>
    </div>
  );
};

export default Index;
