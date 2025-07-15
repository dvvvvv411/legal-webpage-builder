import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";
import RatingSummary from "@/components/RatingSummary";
import ReviewsList from "@/components/ReviewsList";
import CompanySidebar from "@/components/CompanySidebar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const Vorlage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [reviews, setReviews] = useState<any[]>([]);
  const [lawFirm, setLawFirm] = useState<any>(null);
  const [ratingData, setRatingData] = useState<any[]>([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const { toast } = useToast();

  const breadcrumbItems = [
    {
      label: lawFirm?.name || "Steinbock & Partner Rechtsanwaltskanzlei Fachanwälte - Steuerberater",
      href: `/${lawFirm?.slug || 'steinbock-partner'}`
    },
    {
      label: "Bewertungen",
      current: true
    }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch reviews with related data
      const { data: reviewsData, error: reviewsError } = await supabase
        .from("reviews")
        .select(`
          *,
          law_firm:law_firms(*),
          lawyer:lawyers(*),
          legal_area:legal_areas(*)
        `)
        .order('review_date', { ascending: false });

      if (reviewsError) {
        console.error('Error fetching reviews:', reviewsError);
        toast({
          title: "Fehler",
          description: "Bewertungen konnten nicht geladen werden.",
          variant: "destructive",
        });
        return;
      }

      // Get first law firm for demo purposes, or fetch a specific one
      const firstLawFirm = reviewsData?.[0]?.law_firm;
      if (firstLawFirm) {
        setLawFirm(firstLawFirm);
      }

      setReviews(reviewsData || []);
      setTotalReviews(reviewsData?.length || 0);

      // Calculate rating statistics
      if (reviewsData && reviewsData.length > 0) {
        const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        let totalRating = 0;

        reviewsData.forEach(review => {
          const rating = parseInt(review.rating);
          ratingCounts[rating]++;
          totalRating += rating;
        });

        const avgRating = totalRating / reviewsData.length;
        setAverageRating(Number(avgRating.toFixed(1)));

        const ratingDataArray = Object.entries(ratingCounts)
          .map(([stars, count]) => ({
            stars: parseInt(stars),
            count,
            percentage: (count / reviewsData.length) * 100
          }))
          .reverse(); // Show 5 stars first

        setRatingData(ratingDataArray);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Fehler",
        description: "Daten konnten nicht geladen werden.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-page-background">
        <Header />
        <Breadcrumb items={breadcrumbItems} />
        
        <main className="container mx-auto px-enhanced py-12 pb-[240px] lg:pb-12">
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-lg">Bewertungen werden geladen...</span>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-page-background">
      <Header />
      <Breadcrumb items={breadcrumbItems} />
      
       <main className="container mx-auto px-enhanced py-12 pb-[240px] lg:pb-12">
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-enhanced">
           {/* Left column - 2/3 width */}
           <div className="lg:col-span-2 space-y-enhanced">
             <RatingSummary 
               ratingData={ratingData}
               totalReviews={totalReviews}
               averageRating={averageRating}
             />
             <ReviewsList 
               reviews={reviews}
               lawFirm={lawFirm}
             />
          </div>
          
          {/* Right column - 1/3 width */}
          <div className="lg:col-span-1">
            <CompanySidebar 
              totalReviews={totalReviews}
              averageRating={averageRating}
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Vorlage;