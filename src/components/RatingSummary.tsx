import { ThumbsUp } from "lucide-react";
import { Star } from "@/components/ui/star";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useReviewsByLawFirm } from "@/hooks/use-reviews";

interface RatingSummaryProps {
  lawFirm?: any;
}

const RatingSummary = ({ lawFirm }: RatingSummaryProps) => {
  const { data: reviews = [] } = useReviewsByLawFirm(lawFirm?.id || '');
  
  // Calculate rating statistics from real reviews
  const calculateRatingStats = () => {
    if (!reviews.length) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingBreakdown: [
          { stars: 5, count: 0, percentage: 0 },
          { stars: 4, count: 0, percentage: 0 },
          { stars: 3, count: 0, percentage: 0 },
          { stars: 2, count: 0, percentage: 0 },
          { stars: 1, count: 0, percentage: 0 }
        ]
      };
    }

    const totalReviews = reviews.length;
    const ratingCounts = [0, 0, 0, 0, 0]; // [1-star, 2-star, 3-star, 4-star, 5-star]
    
    reviews.forEach(review => {
      const rating = parseInt(review.rating);
      if (rating >= 1 && rating <= 5) {
        ratingCounts[rating - 1]++;
      }
    });

    const averageRating = reviews.reduce((sum, review) => sum + parseInt(review.rating), 0) / totalReviews;
    
    const ratingBreakdown = ratingCounts.map((count, index) => ({
      stars: index + 1,
      count,
      percentage: totalReviews > 0 ? (count / totalReviews) * 100 : 0
    })).reverse(); // Reverse to show 5-star first

    return {
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews,
      ratingBreakdown
    };
  };

  const { averageRating, totalReviews, ratingBreakdown } = calculateRatingStats();
  
  // Fallback to mock data if no law firm data
  const displayName = lawFirm?.name || "Steinbock & Partner Rechtsanwaltskanzlei Fachanwälte - Steuerberater";
  const reviewLink = lawFirm?.slug ? `/${lawFirm.slug}/bewertung/schreiben` : "/vorlage/bewertung/schreiben";
  
  // Use fallback data if no reviews
  const ratingData = totalReviews > 0 ? ratingBreakdown : [
    { stars: 5, count: 586, percentage: 96.22 },
    { stars: 4, count: 17, percentage: 2.79 },
    { stars: 3, count: 0, percentage: 0 },
    { stars: 2, count: 1, percentage: 0.16 },
    { stars: 1, count: 5, percentage: 0.82 }
  ];
  
  const displayRating = totalReviews > 0 ? averageRating : 4.9;
  const displayTotal = totalReviews > 0 ? totalReviews : 609;

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
              <span className="text-3xl font-bold text-slate-900">{displayRating}</span>
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-bold text-neutral-700 text-lg">Sehr gut</span>
              <div className="flex my-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                   <Star key={i} className="icon-enhanced fill-current" />
                ))}
              </div>
              <div className="mt-0.5">
                <span className="text-lg text-neutral-700">{displayTotal} Bewertungen</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-10">
          {/* Desktop Rating Display */}
          <div className="w-[300px] hidden mr-10 py-6 bg-rating-bg-light rounded md:flex flex-col items-center justify-center self-stretch">
            <div className="text-slate-900 font-bold text-5xl mb-2">{displayRating}</div>
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
              <p className="text-lg text-neutral-600">{displayTotal} Bewertungen</p>
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