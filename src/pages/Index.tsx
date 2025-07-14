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
      <Header />
      <Breadcrumb items={breadcrumbItems} />
      
       <main className="container mx-auto px-enhanced py-12">
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-enhanced">
           {/* Left column - 2/3 width */}
           <div className="lg:col-span-2 space-y-enhanced">
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
