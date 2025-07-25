import { Phone, Video, ChevronDown } from "lucide-react";
import { Star } from "@/components/ui/star";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
  totalReviews: number;
  averageRating: number;
}

const CompanySidebar = ({ lawFirm, totalReviews, averageRating }: CompanySidebarProps) => {
  const [showFullNumber, setShowFullNumber] = useState(false);
  const [isOnlineConsultationOpen, setIsOnlineConsultationOpen] = useState(false);
  const navigate = useNavigate();

  // Use lawFirm data or fallback to static data
  const displayName = lawFirm?.name || "Steinbock & Partner Rechtsanwaltskanzlei Fachanwälte - Steuerberater";
  const displayPhone = lawFirm?.phone || "+49 931 22222";
  const displayLogo = lawFirm?.logo_url || "https://www.anwalt.de/cdn-cgi/image/fit=contain,width=80/upload/company/9b/9bde51a88bde31ae1c0ce33c48ff0b98/Logo-Quadrat_RGB-300ppi_Anwaelte_62c6ff9ca63946.09830762.jpg";
  const profileLink = lawFirm ? `/${lawFirm.slug}` : "/vorlage";
  const messageLink = lawFirm ? `/${lawFirm.slug}/nachricht` : "/vorlage/nachricht";
  const reviewLink = lawFirm ? `/${lawFirm.slug}/bewertung/schreiben` : "/vorlage/bewertung/schreiben";

  return (
    <aside className="lg:sticky lg:top-16 lg:z-20 fixed bottom-0 left-0 right-0 z-50 lg:relative lg:bottom-auto lg:left-auto lg:right-auto">
      <div className="border border-neutral-100 bg-white lg:rounded-enhanced shadow-lg overflow-hidden lg:shadow-lg shadow-xl border-t-2 lg:border-t border-x-0 lg:border-x">
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
          
          <div className="flex gap-2.5 lg:flex-col">
            <Button 
              variant="orange-outline-no-hover" 
              className="flex-1 text-lg py-6 rounded-lg lg:order-2"
              onClick={() => navigate(reviewLink)}
            >
              <span className="lg:hidden">Bewerten</span>
              <span className="hidden lg:inline">Bewertung abgeben</span>
            </Button>
            <Button variant="orange-outline" className="lg:hidden flex-1">
              <Phone className="w-4 h-4" />
              <span className="sr-only">Anrufen</span>
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
        <div className="border-t border-neutral-200 hidden lg:block">
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