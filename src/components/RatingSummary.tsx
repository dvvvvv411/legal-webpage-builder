import { useEffect, useState } from "react";
import { ThumbsUp } from "lucide-react";
import { Star } from "@/components/ui/star";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

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

interface RatingSummaryProps {
  lawFirm?: LawFirm;
}

const RatingSummary = ({ lawFirm }: RatingSummaryProps) => {
  const { slug } = useParams<{ slug: string }>();
  const [ratingData, setRatingData] = useState([
    { stars: 5, count: 586, percentage: 96.22 },
    { stars: 4, count: 17, percentage: 2.79 },
    { stars: 3, count: 0, percentage: 0 },
    { stars: 2, count: 1, percentage: 0.16 },
    { stars: 1, count: 5, percentage: 0.82 }
  ]);
  const [totalReviews, setTotalReviews] = useState(609);
  const [averageRating, setAverageRating] = useState(4.9);

  useEffect(() => {
    if (lawFirm) {
      fetchRatingData();
    }
  }, [lawFirm]);

  const fetchRatingData = async () => {
    if (!lawFirm) return;

    try {
      const { data: reviews, error } = await supabase
        .from('reviews')
        .select('rating')
        .eq('law_firm_id', lawFirm.id);

      if (error) {
        console.error('Error fetching ratings:', error);
        return;
      }

      if (reviews && reviews.length > 0) {
        const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        let totalSum = 0;

        reviews.forEach(review => {
          const rating = parseInt(review.rating);
          ratingCounts[rating as keyof typeof ratingCounts]++;
          totalSum += rating;
        });

        const total = reviews.length;
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
    } catch (error) {
      console.error('Error processing rating data:', error);
    }
  };

  // Use lawFirm data or fallback to static data
  const displayName = lawFirm?.name || "Steinbock & Partner Rechtsanwaltskanzlei Fachanwälte - Steuerberater";
  const reviewLink = lawFirm ? `/law-firm/${lawFirm.slug}/bewertung/schreiben` : "/vorlage/bewertung/schreiben";

  return (
    <section className="mb-4 rounded-enhanced bg-white p-enhanced shadow-sm">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between gap-y-4 lg:gap-x-8 pb-4 border-b border-neutral-200 mb-4 pe-4">
        <h1 className="text-xl font-bold mb-0 flex-1 min-w-0">
          Bewertungen von {displayName}
        </h1>
        <div className="flex-shrink-0">
          <a href="/pdf/anwalt.de_bewertungsrichtlinien.pdf" className="inline-block whitespace-nowrap font-semibold text-lg text-blue-600 hover:text-blue-700">
            So funktionieren Bewertungen
          </a>
        </div>
      </div>

      <div className="relative">
        {/* Mobile Rating Display */}
        <div className="mb-6 md:hidden">
          <div className="flex items-center gap-4 p-0">
            <div className="bg-rating-bg-light rounded-full w-16 h-16 flex items-center justify-center">
              <span className="text-3xl font-bold text-slate-900">{averageRating}</span>
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-bold text-neutral-700 text-lg">Sehr gut</span>
              <div className="flex my-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                   <Star key={i} className="icon-enhanced fill-current" />
                ))}
              </div>
              <div className="mt-0.5">
                <span className="text-lg text-neutral-700">{totalReviews} Bewertungen</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-10">
          {/* Desktop Rating Display */}
          <div className="w-[300px] hidden mr-10 py-6 bg-rating-bg-light rounded md:flex flex-col items-center justify-center self-stretch">
            <div className="text-slate-900 font-bold text-5xl mb-2">{averageRating}</div>
            <div className="my-2 flex text-amber-400 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="icon-enhanced fill-current" />
              ))}
            </div>
             <div className="px-4 py-1.5 bg-sehr-gut-bg rounded-full border border-sehr-gut-outline flex items-center gap-2">
               <div className="text-sehr-gut-text text-lg">Sehr gut</div>
               <ThumbsUp className="w-4 h-4 text-sehr-gut-text" />
             </div>
          </div>

          {/* Rating Breakdown */}
          <div className="flex-1 flex flex-col justify-end">
            <div className="text-right mb-4 hidden md:block">
              <p className="text-lg text-neutral-600">{totalReviews} Bewertungen</p>
            </div>
            <div className="grid gap-y-2.5 grid-cols-[auto_1fr_auto] items-center grid-rows-5">
              {ratingData.map((rating) => (
                <div key={rating.stars} className="contents">
                  <div>
                    <div className="flex mr-3 items-center">
                      <span className="text-lg font-semibold mr-1">{rating.stars}</span>
                      <Star className="icon-enhanced fill-amber-400 text-amber-400" />
                    </div>
                  </div>
                  <div className="w-full bg-neutral-100 rounded-full h-2.5">
                    <div 
                      className="bg-amber-400 h-2.5 rounded-full" 
                      style={{ width: `${rating.percentage}%` }}
                    />
                  </div>
                  <div className={`text-lg ml-3 ${rating.count === 0 ? 'text-neutral-400' : 'text-neutral-500'}`}>
                    ({rating.count})
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Button 
          variant="orange-outline" 
          className="w-full mt-5 2xl:hidden text-xl"
          asChild
        >
          <Link to={reviewLink}>Bewertung abgeben</Link>
        </Button>
      </div>
    </section>
  );
};

export default RatingSummary;