import { Star, Phone, Video, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const CompanySidebar = () => {
  const [showFullNumber, setShowFullNumber] = useState(false);
  const [isOnlineConsultationOpen, setIsOnlineConsultationOpen] = useState(false);

  return (
    <aside className="sticky top-16 z-20">
      <div className="border border-neutral-100 bg-white rounded-enhanced shadow-lg overflow-hidden">
        {/* Company Info */}
        <div className="p-4 pb-0 flex justify-items-start">
          <div className="mb-3 flex gap-4">
            <div className="avatar-enhanced-lg flex-shrink-0">
              <a href="https://www.anwalt.de/steinbock-partner" title="Steinbock & Partner Rechtsanwaltskanzlei Fachanwälte - Steuerberater" className="inline-block">
                <img 
                  alt="Kanzleilogo Steinbock & Partner Rechtsanwaltskanzlei Fachanwälte - Steuerberater" 
                  src="https://www.anwalt.de/cdn-cgi/image/fit=contain,width=80/upload/company/9b/9bde51a88bde31ae1c0ce33c48ff0b98/Logo-Quadrat_RGB-300ppi_Anwaelte_62c6ff9ca63946.09830762.jpg" 
                   className="aspect-square rounded-enhanced object-contain outline outline-1 outline-[rgba(0,0,0,0.08)]" 
                   width="88" 
                   height="88"
                />
              </a>
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-base text-neutral-600">Kanzlei</p>
              <a 
                href="https://www.anwalt.de/steinbock-partner" 
                title="Steinbock & Partner Rechtsanwaltskanzlei Fachanwälte - Steuerberater" 
                className="text-pretty font-bold text-blue-600 hover:text-blue-700 text-xl"
              >
                Steinbock & Partner Rechtsanwaltskanzlei Fachanwälte - Steuerberater
              </a>
              <a href="https://www.anwalt.de/steinbock-partner/bewertungen.php" className="text-blue-600 hover:text-blue-700">
                <div className="my-1 flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="icon-enhanced fill-current" />
                  ))}
                </div>
                <div className="text-neutral-700 mt-1">
                  <span className="font-semibold">4,9</span> • <span>609 Bewertungen</span>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-4 py-4 border-t border-neutral-200 flex flex-col gap-2.5">
          <Button variant="orange" className="w-full text-xl">
            Anliegen schildern
          </Button>
          
          <div className="flex gap-2.5">
            <Button variant="orange-outline" className="md:hidden flex-1">
              <Phone className="w-4 h-4" />
              <span className="sr-only">Anrufen</span>
            </Button>
            <Button variant="orange-outline" className="flex-1 text-xl">
              Bewertung abgeben
            </Button>
          </div>

          {/* Phone Number */}
          <div className="flex gap-3 items-center justify-center hidden md:flex">
            <Phone className="w-4 h-4 mt-0.5" />
            <span>+49 931 22{showFullNumber ? "222" : "..."}</span>
            <Button 
              variant="link" 
              className="text-blue-600 font-semibold hover:underline p-0 h-auto"
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
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Video className="w-4 h-4 text-green-600" />
              </div>
            </div>
            <span className="flex-1">Online-Rechtsberatung</span>
             <ChevronDown 
               className={`icon-enhanced text-blue-600 transition-transform ${
                 isOnlineConsultationOpen ? 'rotate-180' : ''
               }`}
            />
          </button>
          
          {isOnlineConsultationOpen && (
             <div className="px-4 pb-4 text-neutral-500 text-lg">
               Steinbock & Partner Rechtsanwaltskanzlei Fachanwälte - Steuerberater bietet Online-Rechtsberatung an.
             </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default CompanySidebar;