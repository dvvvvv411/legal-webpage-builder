import { Phone, Video, ChevronDown } from "lucide-react";
import { Star } from "@/components/ui/star";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

interface CompanySidebarProps {
  lawFirm?: LawFirm;
}

const CompanySidebar = ({ lawFirm }: CompanySidebarProps) => {
  const [showFullNumber, setShowFullNumber] = useState(false);
  const [isOnlineConsultationOpen, setIsOnlineConsultationOpen] = useState(false);
  const [totalReviews, setTotalReviews] = useState(609);
  const [averageRating, setAverageRating] = useState(4.9);
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

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
        const totalSum = reviews.reduce((sum, review) => sum + parseInt(review.rating), 0);
        const avgRating = totalSum / reviews.length;
        
        setTotalReviews(reviews.length);
        setAverageRating(Math.round(avgRating * 10) / 10);
      }
    } catch (error) {
      console.error('Error processing rating data:', error);
    }
  };

  // Use lawFirm data or fallback to static data
  const displayName = lawFirm?.name || "Steinbock & Partner Rechtsanwaltskanzlei Fachanwälte - Steuerberater";
  const displayPhone = lawFirm?.phone || "+49 931 22222";
  const displayLogo = lawFirm?.logo_url || "https://www.anwalt.de/cdn-cgi/image/fit=contain,width=80/upload/company/9b/9bde51a88bde31ae1c0ce33c48ff0b98/Logo-Quadrat_RGB-300ppi_Anwaelte_62c6ff9ca63946.09830762.jpg";
  const profileLink = lawFirm ? `/law-firm/${lawFirm.slug}` : "/vorlage";
  const messageLink = lawFirm ? `/law-firm/${lawFirm.slug}/nachricht` : "/vorlage/nachricht";
  const reviewLink = lawFirm ? `/law-firm/${lawFirm.slug}/bewertung/schreiben` : "/vorlage/bewertung/schreiben";

  return (
    <aside className="sticky top-16 z-20">
      <div className="border border-neutral-100 bg-white rounded-enhanced shadow-lg overflow-hidden">
        {/* Company Info */}
        <div className="p-4 pb-0 flex justify-items-start">
          <div className="mb-3 flex gap-4">
            <div className="avatar-enhanced-lg flex-shrink-0">
              <a href={profileLink} title={displayName} className="inline-block">
                <img 
                  alt={`Kanzleilogo ${displayName}`} 
                  src={displayLogo} 
                   className="aspect-square rounded-enhanced object-contain outline outline-1 outline-[rgba(0,0,0,0.08)]" 
                   width="88" 
                   height="88"
                />
              </a>
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-base text-neutral-600">Kanzlei</p>
              <a 
                href={profileLink} 
                title={displayName} 
                className="text-pretty font-bold hover:text-blue-700 text-xl"
                style={{ color: '#1d4ed8' }}
              >
                {displayName}
              </a>
              <a href={profileLink} className="text-blue-600 hover:text-blue-700">
                <div className="my-1 flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="icon-enhanced fill-current" />
                  ))}
                </div>
                <div className="text-neutral-700 mt-1">
                  <span className="font-semibold">{averageRating}</span> • <span>{totalReviews} Bewertungen</span>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-4 py-4 border-t border-neutral-200 flex flex-col gap-2.5">
          <Button 
            variant="orange" 
            className="w-full text-lg py-6 rounded-lg"
            onClick={() => navigate(messageLink)}
          >
            Anliegen schildern
          </Button>
          
          <div className="flex gap-2.5">
            <Button variant="orange-outline" className="md:hidden flex-1">
              <Phone className="w-4 h-4" />
              <span className="sr-only">Anrufen</span>
            </Button>
            <Button 
              variant="orange-outline-no-hover" 
              className="flex-1 text-lg py-6 rounded-lg"
              onClick={() => navigate(reviewLink)}
            >
              Bewertung abgeben
            </Button>
          </div>

          {/* Phone Number */}
          <div className="flex gap-3 items-center justify-center hidden md:flex">
            <Phone className="w-4 h-4 mt-0.5" />
            <span>{displayPhone.slice(0, -3)}{showFullNumber ? displayPhone.slice(-3) : "..."}</span>
            <Button 
              variant="link" 
              className="hover:underline p-0 h-auto text-base"
              style={{ color: '#1d4ed8', fontWeight: 600 }}
              onClick={() => setShowFullNumber(!showFullNumber)}
            >
              {showFullNumber ? "verbergen" : "anzeigen"}
            </Button>
          </div>
        </div>

        {/* Online Consultation */}
        <div className="border-t border-neutral-200">
          <button
            className="w-full flex items-center gap-2.5 p-4 text-left hover:bg-neutral-50 transition-colors"
            onClick={() => setIsOnlineConsultationOpen(!isOnlineConsultationOpen)}
          >
            <div className="relative">
              <div className="w-[37px] h-[37px] bg-green-100 rounded-full flex items-center justify-center">
                <Video className="w-[18px] h-[18px] text-green-600" />
              </div>
            </div>
            <span className="flex-1">Online-Rechtsberatung</span>
             <ChevronDown 
                className={`icon-enhanced transition-transform ${
                  isOnlineConsultationOpen ? 'rotate-180' : ''
                }`}
                style={{ color: '#0f172a' }}
             />
          </button>
          
          {isOnlineConsultationOpen && (
             <div className="px-4 pb-4 text-neutral-500 text-lg">
               {displayName} bietet Online-Rechtsberatung an.
             </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default CompanySidebar;