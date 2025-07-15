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

  const defaultReviews = [
    {
      id: "1",
      title: "Hervorragende Beratung",
      content: "Sehr kompetente und freundliche Beratung. Alle Fragen wurden ausführlich beantwortet.",
      rating: "5",
      initials: "M.S.",
      avatar_color: "#6B7280",
      review_date: "2024-01-15",
      review_time: "14:30:00",
      scope: "Verkehrsrecht",
      law_firm_id: "1",
      lawyer_id: null,
      legal_area_id: null,
      created_at: "2024-01-15T14:30:00Z"
    },
    {
      id: "2", 
      title: "Schnelle Hilfe",
      content: "Dank der schnellen und professionellen Hilfe konnte mein Problem rasch gelöst werden.",
      rating: "5",
      initials: "T.K.",
      avatar_color: "#EF4444", 
      review_date: "2024-01-10",
      review_time: "09:15:00",
      scope: "Arbeitsrecht",
      law_firm_id: "1",
      lawyer_id: null,
      legal_area_id: null,
      created_at: "2024-01-10T09:15:00Z"
    },
    {
      id: "3",
      title: "Gute Beratung",
      content: "Kompetente Beratung, allerdings etwas teurer als erwartet.",
      rating: "4",
      initials: "A.M.",
      avatar_color: "#10B981",
      review_date: "2024-01-08", 
      review_time: "16:45:00",
      scope: "Mietrecht & Wohnungseigentumsrecht",
      law_firm_id: "1",
      lawyer_id: null,
      legal_area_id: null,
      created_at: "2024-01-08T16:45:00Z"
    },
    {
      id: "4",
      title: "Durchwachsene Erfahrung",
      content: "Die Beratung war ok, aber die Kommunikation hätte besser sein können.",
      rating: "3",
      initials: "R.B.",
      avatar_color: "#F59E0B",
      review_date: "2024-01-05",
      review_time: "11:20:00", 
      scope: "Strafrecht",
      law_firm_id: "1",
      lawyer_id: null,
      legal_area_id: null,
      created_at: "2024-01-05T11:20:00Z"
    },
    {
      id: "5",
      title: "Nicht zufrieden",
      content: "Leider war ich mit der Beratung nicht zufrieden. Zu wenig Zeit für mein Anliegen.",
      rating: "2",
      initials: "L.W.",
      avatar_color: "#8B5CF6",
      review_date: "2024-01-03",
      review_time: "13:10:00",
      scope: "Versicherungsrecht", 
      law_firm_id: "1",
      lawyer_id: null,
      legal_area_id: null,
      created_at: "2024-01-03T13:10:00Z"
    },
    {
      id: "6",
      title: "Sehr enttäuschend",
      content: "Sehr schlechte Erfahrung. Unprofessionell und unfreundlich.",
      rating: "1",
      initials: "K.H.",
      avatar_color: "#EC4899",
      review_date: "2024-01-01",
      review_time: "10:00:00",
      scope: "Allgemeine Rechtsberatung",
      law_firm_id: "1", 
      lawyer_id: null,
      legal_area_id: null,
      created_at: "2024-01-01T10:00:00Z"
    }
  ]; // Beispiel-Reviews für Demo
  const defaultTotalReviews = 609;
  const defaultAverageRating = 4.9;

  return (
    <div className="min-h-screen bg-page-background">
      <Header />
      <Breadcrumb items={breadcrumbItems} />
      
       <main className="container mx-auto px-enhanced py-12 pb-[240px] lg:pb-12">
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-enhanced">
           {/* Left column - 2/3 width */}
           <div className="lg:col-span-2 space-y-enhanced">
             <RatingSummary 
               ratingData={defaultRatingData}
               totalReviews={defaultTotalReviews}
               averageRating={defaultAverageRating}
             />
             <ReviewsList 
               reviews={defaultReviews}
             />
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