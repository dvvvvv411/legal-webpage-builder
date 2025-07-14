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
    <section className="mb-4 rounded-enhanced bg-white p-enhanced shadow-sm border">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between gap-y-4 lg:gap-x-8 pb-4 border-b border-neutral-200 mb-4 pe-4">
        <h1 className="text-xl font-bold mb-0 flex-1 min-w-0">
          Bewertungen von Steinbock & Partner Rechtsanwaltskanzlei Fachanwälte - Steuerberater
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
              <span className="text-3xl font-bold text-slate-900">4,9</span>
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-bold text-neutral-700 text-lg">Sehr gut</span>
              <div className="flex my-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                   <Star key={i} className="icon-enhanced fill-current" />
                ))}
              </div>
              <div className="mt-0.5">
                <span className="text-lg text-neutral-700">609 Bewertungen</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-10">
          {/* Desktop Rating Display */}
          <div className="w-[300px] hidden mr-10 py-6 bg-rating-bg-light rounded md:flex flex-col items-center justify-center self-stretch">
            <div className="text-slate-900 font-bold text-5xl mb-2">4,9</div>
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
              <p className="text-lg text-neutral-600">609 Bewertungen</p>
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
        >
          Bewertung abgeben
        </Button>
      </div>
    </section>
  );
};

export default RatingSummary;