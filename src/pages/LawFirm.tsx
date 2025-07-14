import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";
import RatingSummary from "@/components/RatingSummary";
import ReviewsList from "@/components/ReviewsList";
import CompanySidebar from "@/components/CompanySidebar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface LawFirm {
  id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  phone: string | null;
  slug: string;
  created_at: string;
  updated_at: string;
}

const LawFirm = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [lawFirm, setLawFirm] = useState<LawFirm | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [ratingData, setRatingData] = useState([
    { stars: 5, count: 586, percentage: 96.22 },
    { stars: 4, count: 17, percentage: 2.79 },
    { stars: 3, count: 0, percentage: 0 },
    { stars: 2, count: 1, percentage: 0.16 },
    { stars: 1, count: 5, percentage: 0.82 }
  ]);
  const [totalReviews, setTotalReviews] = useState(609);
  const [averageRating, setAverageRating] = useState(4.9);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) {
      navigate('/');
      return;
    }

    const fetchAllData = async () => {
      try {
        setLoading(true);
        
        // Fetch law firm data
        const { data: lawFirmData, error: lawFirmError } = await supabase
          .from('law_firms')
          .select('*')
          .eq('slug', slug)
          .single();

        if (lawFirmError) {
          if (lawFirmError.code === 'PGRST116') {
            // No rows returned
            navigate('/');
            return;
          }
          throw lawFirmError;
        }

        setLawFirm(lawFirmData);

        // Fetch reviews data
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select(`
            *,
            law_firm:law_firms(name),
            lawyer:lawyers(name),
            legal_area:legal_areas(name)
          `)
          .eq('law_firm_id', lawFirmData.id)
          .order('created_at', { ascending: false });

        if (reviewsError) {
          console.error('Error fetching reviews:', reviewsError);
          // Continue with empty reviews instead of failing
          setReviews([]);
        } else {
          setReviews(reviewsData || []);
        }

        // Calculate rating data
        if (reviewsData && reviewsData.length > 0) {
          const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
          let totalSum = 0;

          reviewsData.forEach(review => {
            const rating = parseInt(review.rating);
            ratingCounts[rating as keyof typeof ratingCounts]++;
            totalSum += rating;
          });

          const total = reviewsData.length;
          const avgRating = totalSum / total;

          const newRatingData = [
            { stars: 5, count: ratingCounts[5], percentage: (ratingCounts[5] / total) * 100 },
            { stars: 4, count: ratingCounts[4], percentage: (ratingCounts[4] / total) * 100 },
            { stars: 3, count: ratingCounts[3], percentage: (ratingCounts[3] / total) * 100 },
            { stars: 2, count: ratingCounts[2], percentage: (ratingCounts[2] / total) * 100 },
            { stars: 1, count: ratingCounts[1], percentage: (ratingCounts[1] / total) * 100 }
          ];

          setRatingData(newRatingData);
          setTotalReviews(total);
          setAverageRating(Math.round(avgRating * 10) / 10);
        }

      } catch (error: any) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to load data",
          variant: "destructive"
        });
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [slug, navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!lawFirm) {
    return null;
  }

  const breadcrumbItems = [
    {
      label: lawFirm.name,
      href: `/law-firm/${lawFirm.slug}`
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
            <RatingSummary 
              lawFirm={lawFirm} 
              ratingData={ratingData}
              totalReviews={totalReviews}
              averageRating={averageRating}
            />
            <ReviewsList 
              lawFirm={lawFirm} 
              reviews={reviews}
            />
          </div>
          
          {/* Right column - 1/3 width */}
          <div className="lg:col-span-1">
            <CompanySidebar 
              lawFirm={lawFirm} 
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

export default LawFirm;