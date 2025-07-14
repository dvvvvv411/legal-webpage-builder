import { Star, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const RatingSummary = () => {
  const ratingData = [
    { stars: 5, count: 586, percentage: 96.22 },
    { stars: 4, count: 17, percentage: 2.79 },
    { stars: 3, count: 0, percentage: 0 },
    { stars: 2, count: 1, percentage: 0.16 },
    { stars: 1, count: 5, percentage: 0.82 }
  ];

  return (
    <section className="mb-4 rounded bg-white p-5 shadow-sm border">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between gap-y-1 pb-4 border-b mb-4 pe-4">
        <h1 className="text-base font-bold mb-0">
          Bewertungen von Steinbock & Partner Rechtsanwaltskanzlei Fachanwälte - Steuerberater
        </h1>
        <div>
          <a href="/pdf/anwalt.de_bewertungsrichtlinien.pdf" className="inline-block whitespace-nowrap font-semibold text-sm">
            So funktionieren Bewertungen
          </a>
        </div>
      </div>

      <div className="relative">
        {/* Mobile Rating Display */}
        <div className="mb-6 md:hidden">
          <div className="flex items-center gap-4 p-0">
            <div className="bg-rating-bg-light rounded-full w-16 h-16 flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-700">4,9</span>
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-bold text-neutral-700">Sehr gut</span>
              <div className="flex my-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <div className="mt-0.5">
                <span className="text-sm text-neutral-700">609 Bewertungen</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-10">
          {/* Desktop Rating Display */}
          <div className="w-[255px] hidden mr-10 py-6 bg-rating-bg-light rounded md:grid place-items-center">
            <div className="text-blue-700 font-bold text-4xl mb-0">4,9</div>
            <div className="my-1 flex text-amber-400 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-current" />
              ))}
            </div>
            <div className="px-4 py-1.5 bg-blue-50 rounded-full border border-blue-100 flex items-center gap-2">
              <div className="text-blue-700 text-sm">Sehr gut</div>
              <ThumbsUp className="h-4 w-4 text-blue-700" />
            </div>
          </div>

          {/* Rating Breakdown */}
          <div className="flex-1 flex flex-col justify-end">
            <div className="text-right mb-4 hidden md:block">
              <p className="text-sm text-neutral-600">609 Bewertungen</p>
            </div>
            <div className="grid gap-y-2.5 grid-cols-[auto_1fr_auto] items-center grid-rows-5">
              {ratingData.map((rating) => (
                <div key={rating.stars} className="contents">
                  <div>
                    <div className="flex mr-3 items-center">
                      <span className="text-sm font-semibold mr-1">{rating.stars}</span>
                      <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                    </div>
                  </div>
                  <div className="w-full bg-neutral-100 rounded-full h-2.5">
                    <div 
                      className="bg-amber-400 h-2.5 rounded-full" 
                      style={{ width: `${rating.percentage}%` }}
                    />
                  </div>
                  <div className={`text-sm ml-3 ${rating.count === 0 ? 'text-neutral-400' : 'text-neutral-500'}`}>
                    ({rating.count})
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Button 
          variant="orange-outline" 
          className="w-full mt-5 2xl:hidden"
        >
          Bewertung abgeben
        </Button>
      </div>
    </section>
  );
};

export default RatingSummary;