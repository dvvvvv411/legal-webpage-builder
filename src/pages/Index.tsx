import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";
import RatingSummary from "@/components/RatingSummary";
import ReviewsList from "@/components/ReviewsList";
import CompanySidebar from "@/components/CompanySidebar";

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
    <div className="min-h-screen bg-page-background">
      <div className="transform scale-110 origin-top">
        <Header />
      </div>
      <div className="transform scale-110 origin-top">
        <Breadcrumb items={breadcrumbItems} />
      </div>
      
      <main className="container mx-auto px-4 py-12 transform scale-110 origin-top">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            <RatingSummary />
            <ReviewsList />
          </div>
          
          {/* Right column - 1/3 width */}
          <div className="lg:col-span-1">
            <CompanySidebar />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
