import { useState } from "react";
import { Star, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Review {
  id: number;
  author: string;
  initials: string;
  rating: number;
  date: string;
  title: string;
  category: string;
  text: string;
  lawyer?: string;
  bgColor: string;
}

const ReviewsList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 10;

  // Mock-Daten für die Bewertungen
  const allReviews: Review[] = [
    {
      id: 1,
      author: "H. H.",
      initials: "HH",
      rating: 5,
      date: "10.07.2025 um 13:58 Uhr",
      title: "Schadensersatz",
      category: "Verkehrsrecht",
      text: "Danke an Herrn Pfeil und Mitarbeiter für die unkomplizierte und prompte Bearbeitung des Falles.",
      lawyer: "Rechtsanwalt Julian Pfeil",
      bgColor: "bg-red-500"
    },
    {
      id: 2,
      author: "A. T.",
      initials: "AT",
      rating: 5,
      date: "03.07.2025 um 09:11 Uhr",
      title: "RAin Frau Laas",
      category: "Verwaltungsrecht",
      text: "Sehr engagiert. Empfehlenswert!",
      lawyer: "Steinbock & Partner Rechtsanwaltskanzlei Fachanwälte - Steuerberater",
      bgColor: "bg-blue-500"
    },
    {
      id: 3,
      author: "W. S.",
      initials: "WS",
      rating: 5,
      date: "01.07.2025 um 19:30 Uhr",
      title: "Hervorragende fachliche Beratung",
      category: "Erbrecht",
      text: "Durch Frau RAin Selina Hohe erhielten wir im konkreten Streitfall eine ausgezeichnete Beratung. Durch ihr präzises Fachwissen konnten bei Unklarheiten (und vielleicht auch Missverständnisse) in der Beratung durch das Nachlassgericht (zur Wirkung eines sog. Berliner Testaments) ausgeräumt werden und unberechtigte Forderungen der Gegenseite geklärt werden.",
      lawyer: "Steinbock & Partner Rechtsanwaltskanzlei Fachanwälte - Steuerberater",
      bgColor: "bg-cyan-500"
    },
    {
      id: 4,
      author: "B. W.",
      initials: "BW",
      rating: 5,
      date: "30.06.2025 um 15:34 Uhr",
      title: "Audi A1 - Delle in Fahrertür",
      category: "Schadensersatzrecht & Schmerzensgeldrecht",
      text: "Gut",
      lawyer: "Rechtsanwalt Julian Pfeil",
      bgColor: "bg-blue-500"
    },
    {
      id: 5,
      author: "M. S.",
      initials: "MS",
      rating: 5,
      date: "23.06.2025 um 18:25 Uhr",
      title: "alles gut",
      category: "Erbrecht",
      text: "frau hohe hat gute arbeit geleistet, sehr gute fachkenntnis.",
      lawyer: "Steinbock & Partner Rechtsanwaltskanzlei Fachanwälte - Steuerberater",
      bgColor: "bg-red-500"
    },
    {
      id: 6,
      author: "S. H.",
      initials: "SH",
      rating: 5,
      date: "04.06.2025 um 21:16 Uhr",
      title: "Alles top!",
      category: "Forderungseinzug & Inkassorecht",
      text: "Alles top und zu meiner Zufriedenheit gelaufen. Danke :)",
      lawyer: "Rechtsanwalt Ingo Hochheim",
      bgColor: "bg-green-500"
    },
    {
      id: 7,
      author: "M. H.",
      initials: "MH",
      rating: 5,
      date: "02.06.2025 um 20:32 Uhr",
      title: "Falsche Grundsteuerberechnung vom Finanzamt",
      category: "Steuerrecht",
      text: "Die Steuerkanzlei Steinbock & Partner hat uns sehr geholfen die Grundsteuerberechnung zu korrigieren und hiermit eine niedrigeren Grundsteuerbetrag festgesetzt. Herzlichen Dank für Ihre Unterstützung kann man nur weiterempfehlen.",
      lawyer: "Steinbock & Partner Rechtsanwaltskanzlei Fachanwälte - Steuerberater",
      bgColor: "bg-blue-500"
    },
    {
      id: 8,
      author: "M. L.",
      initials: "ML",
      rating: 5,
      date: "29.05.2025 um 11:34 Uhr",
      title: "Unkompliziert und professionell",
      category: "Verkehrsrecht",
      text: "Ich wurde von Herrn Pfeil und seiner Kollegin Frau Kohlhepp von der Kanzlei Steinbock & Partner nach einem Verkehrsunfall hervorragend betreut. Bereits vor der eigentlichen Beauftragung erhielt ich eine unkomplizierte und realistische Ersteinschätzung zu meinem Fall.",
      lawyer: "Steinbock & Partner Rechtsanwaltskanzlei Fachanwälte - Steuerberater",
      bgColor: "bg-blue-500"
    },
    {
      id: 9,
      author: "C. H.",
      initials: "CH",
      rating: 5,
      date: "27.05.2025 um 23:11 Uhr",
      title: "Kompetente Beratung und Vertretung",
      category: "Zivilrecht",
      text: "Wir waren sehr zufrieden mit der Beratung und Vertretung von Herrn Hochheim von der Kanzlei Steinbock & Partner. Unser Anliegen wurde schnell bearbeitet und die Kommunikation per Telefon war sehr einfach und unkompliziert. Sehr zu empfehlen.",
      lawyer: "Rechtsanwalt Ingo Hochheim",
      bgColor: "bg-green-500"
    },
    {
      id: 10,
      author: "S. K.",
      initials: "SK",
      rating: 5,
      date: "24.05.2025 um 20:57 Uhr",
      title: "Erfolgreich Forderung abgewehrt",
      category: "Zivilrecht",
      text: "Herzlichen Dank, dass Sie die gegen mich gerichtete Forderung erfolgreich abgewehrt haben. Das hat mir viel Geld erspart und wieder etwas schlauer gemacht. Ich komme gerne wieder zu Ihnen, wenn ich wieder Unterstützung benötige.",
      lawyer: "Rechtsanwalt Ingo Hochheim",
      bgColor: "bg-cyan-500"
    },
    // Weitere Mock-Daten für weitere Seiten
    {
      id: 11,
      author: "P. M.",
      initials: "PM",
      rating: 5,
      date: "20.05.2025 um 14:22 Uhr",
      title: "Sehr zufrieden",
      category: "Arbeitsrecht",
      text: "Kompetente Beratung und schnelle Bearbeitung meines Falls.",
      lawyer: "Steinbock & Partner Rechtsanwaltskanzlei Fachanwälte - Steuerberater",
      bgColor: "bg-purple-500"
    },
    {
      id: 12,
      author: "L. K.",
      initials: "LK",
      rating: 4,
      date: "18.05.2025 um 09:15 Uhr",
      title: "Gute Arbeit",
      category: "Mietrecht",
      text: "Die Beratung war hilfreich und professionell.",
      lawyer: "Rechtsanwalt Julian Pfeil",
      bgColor: "bg-yellow-500"
    }
  ];

  // Berechne die aktuellen Bewertungen für die Seite
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = allReviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(allReviews.length / reviewsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        className="h-5 w-5 fill-amber-400 text-amber-400" 
      />
    ));
  };

  return (
    <section className="rounded bg-white p-5 shadow-sm border">
      {/* Header */}
      <div className="sticky top-0 pt-4 -mt-4 mb-3 bg-white z-10 border-b border-neutral-200 flex flex-col sm:flex-row">
        <h2 className="mb-2 flex items-center gap-2 text-lg font-semibold pb-3 flex-auto pe-4">
          Bewertungen 
          <Badge variant="secondary" className="rounded-full border border-neutral-200 bg-page-background text-neutral-700 text-sm py-0.5 px-2.5 -ml-0.5 font-normal">
            609
          </Badge>
        </h2>
        <div className="relative text-neutral-700 font-semibold text-sm flex-none mb-3">
          <Button variant="outline" className="flex items-center gap-1 px-3 py-2 bg-white border border-neutral-300 rounded-md shadow-sm">
            <Filter className="h-4 w-4" />
            <span>Rechtsgebiete</span>
          </Button>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-2">
        {currentReviews.map((review) => (
          <div 
            key={review.id}
            className="w-full p-5 bg-page-background rounded-lg border border-neutral-100"
          >
            <div className="sm:flex sm:items-center">
              <div className="flex items-center mb-2 sm:mb-0">
                {/* Initials Badge */}
                <div className="mr-3.5">
                  <div className={`${review.bgColor} text-white rounded-full w-10 h-10 flex items-center justify-center text-sm font-semibold`}>
                    {review.initials}
                  </div>
                </div>
                
                {/* Stars */}
                <div className="flex text-amber-400 mr-3.5">
                  {renderStars(review.rating)}
                </div>
              </div>
              
              {/* Date and Lawyer Info */}
              <p className="text-neutral-500 text-sm mr-3.5">
                von {review.author} am {review.date}
                {review.lawyer && (
                  <span>
                    {" "}für{" "}
                    <a href="#" className="text-neutral-500 hover:text-neutral-700 underline">
                      {review.lawyer}
                    </a>
                  </span>
                )}
              </p>
            </div>
            
            {/* Review Content */}
            <div className="lg:pl-14 mt-1">
              <div>
                <span className="inline-block mr-3 text-slate-900 text-base font-semibold leading-normal mb-1.5">
                  {review.title}
                </span>
                <div className="inline-flex mb-2">
                  <Badge variant="secondary" className="bg-white border border-neutral-200 text-neutral-700">
                    {review.category}
                  </Badge>
                </div>
              </div>
              <div className="text-slate-700 text-base font-normal leading-normal">
                {review.text}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-1 mt-6">
          <Button
            variant="ghost"
            size="lg"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-3 text-pagination-active hover:bg-transparent hover:text-pagination-active/80 disabled:text-neutral-400"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          
          {[...Array(totalPages)].map((_, i) => {
            const pageNumber = i + 1;
            const isActive = currentPage === pageNumber;
            return (
              <Button
                key={pageNumber}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                onClick={() => handlePageChange(pageNumber)}
                className={isActive 
                  ? "bg-pagination-active text-white border-pagination-active hover:bg-pagination-active/90 h-8 w-8 text-sm rounded-sm p-0" 
                  : "text-pagination-active hover:bg-transparent hover:text-pagination-active/80 h-8 w-8 text-sm p-0"
                }
              >
                {pageNumber}
              </Button>
            );
          })}
          
          <Button
            variant="ghost"
            size="lg"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-3 text-pagination-active hover:bg-transparent hover:text-pagination-active/80 disabled:text-neutral-400"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      )}
    </section>
  );
};

export default ReviewsList;