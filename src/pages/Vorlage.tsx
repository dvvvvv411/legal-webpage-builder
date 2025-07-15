import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";
import RatingSummary from "@/components/RatingSummary";
import ReviewsList from "@/components/ReviewsList";
import CompanySidebar from "@/components/CompanySidebar";
import Footer from "@/components/Footer";

const Vorlage = () => {
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

  // Default data for static template
  const defaultRatingData = [
    { stars: 5, count: 586, percentage: 96.22 },
    { stars: 4, count: 17, percentage: 2.79 },
    { stars: 3, count: 0, percentage: 0 },
    { stars: 2, count: 1, percentage: 0.16 },
    { stars: 1, count: 5, percentage: 0.82 }
  ];

  const defaultReviews = []; // Empty array for static template
  const defaultTotalReviews = 609;
  const defaultAverageRating = 4.9;

  return (
    <div className="min-h-screen bg-page-background">
      <Header />
      <Breadcrumb items={breadcrumbItems} />
      
      <main className="container mx-auto px-enhanced py-12 pb-32 lg:pb-12">
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-enhanced">
           {/* Left column - 2/3 width */}
           <div className="lg:col-span-2 space-y-enhanced">
            <RatingSummary 
              ratingData={defaultRatingData}
              totalReviews={defaultTotalReviews}
              averageRating={defaultAverageRating}
            />
            <ReviewsList reviews={defaultReviews} />
          </div>
          
          {/* Right column - 1/3 width */}
          <div className="lg:col-span-1">
            <CompanySidebar 
              totalReviews={defaultTotalReviews}
              averageRating={defaultAverageRating}
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Vorlage;