import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Star } from "@/components/ui/star";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Review {
  id: string;
  title: string;
  content: string;
  rating: string;
  initials: string;
  avatar_color: string;
  review_date: string | null;
  review_time: string | null;
  scope: string | null;
  law_firm_id: string;
  lawyer_id: string | null;
  legal_area_id: string | null;
  law_firm?: { name: string };
  lawyer?: { name: string };
  legal_area?: { name: string };
  created_at: string;
}

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

interface ReviewsListProps {
  lawFirm?: LawFirm;
  reviews: Review[];
}

const ReviewsList = ({ lawFirm, reviews }: ReviewsListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [tempSelectedFilters, setTempSelectedFilters] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const reviewsPerPage = 10;

  // Dynamically generate legal areas from reviews
  const generateLegalAreas = () => {
    const legalAreaCounts = new Map<string, number>();
    
    reviews.forEach(review => {
      // Get legal area name from either scope or legal_area.name
      const legalAreaName = review.legal_area?.name || review.scope;
      
      if (legalAreaName && legalAreaName.trim() !== '') {
        legalAreaCounts.set(legalAreaName, (legalAreaCounts.get(legalAreaName) || 0) + 1);
      }
    });

    // Convert to array and sort by count (descending) then by name (ascending)
    return Array.from(legalAreaCounts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => {
        if (b.count !== a.count) {
          return b.count - a.count; // Sort by count descending
        }
        return a.name.localeCompare(b.name); // Then by name ascending
      });
  };

  const practiceAreas = generateLegalAreas();

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setTempSelectedFilters(selectedFilters);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectedFilters]);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setTempSelectedFilters(selectedFilters);
  };

  const handleFilterChange = (filterName: string) => {
    if (tempSelectedFilters.includes(filterName)) {
      setTempSelectedFilters(tempSelectedFilters.filter(f => f !== filterName));
    } else {
      setTempSelectedFilters([...tempSelectedFilters, filterName]);
    }
  };

  const handleApplyFilters = () => {
    setSelectedFilters(tempSelectedFilters);
    setCurrentPage(1); // Reset to first page when filters are applied
    setIsDropdownOpen(false);
  };

  const handleCancelFilters = () => {
    setTempSelectedFilters(selectedFilters);
    setIsDropdownOpen(false);
  };

  const handleResetFilters = () => {
    setTempSelectedFilters([]);
    setSelectedFilters([]);
    setCurrentPage(1); // Reset to first page when filters are reset
    setIsDropdownOpen(false);
  };

  const removeFilter = (filterName: string) => {
    setSelectedFilters(selectedFilters.filter(f => f !== filterName));
    setCurrentPage(1); // Reset to first page when filter is removed
  };

  // Filtere Reviews basierend auf ausgewählten Filtern
  let filteredReviews = reviews;
  
  // Anwenden der Rechtsgebiets-Filter
  if (selectedFilters.length > 0) {
    filteredReviews = filteredReviews.filter(review => {
      const legalAreaName = review.legal_area?.name || review.scope;
      return selectedFilters.includes(legalAreaName || '');
    });
  }

  // Sortiere Reviews chronologisch (neuste zuerst)
  filteredReviews = filteredReviews.sort((a, b) => {
    const dateA = new Date(`${a.review_date}T${a.review_time || '00:00:00'}`);
    const dateB = new Date(`${b.review_date}T${b.review_time || '00:00:00'}`);
    return dateB.getTime() - dateA.getTime();
  });

  // Paginierung
  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);
  const startIndex = (currentPage - 1) * reviewsPerPage;
  const endIndex = startIndex + reviewsPerPage;
  const currentReviews = filteredReviews.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Pagination Helper Functions
  const getPaginationRange = () => {
    const maxPagesToShow = 4; // Reduziert von 5 auf 4
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    // Adjust if we're near the end
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    const pages = [];
    
    // Immer erste Seite hinzufügen
    pages.push(1);
    
    // Wenn startPage > 2, dann beginnen wir direkt mit den Seiten ohne Ellipsis davor
    if (startPage > 2) {
      // Füge Seiten ab startPage hinzu, aber maximal bis endPage
      for (let i = Math.max(2, startPage); i <= endPage; i++) {
        pages.push(i);
      }
    } else {
      // Füge Seiten von 2 bis endPage hinzu
      for (let i = 2; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    // Add ellipsis and last page only if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      // Nur letzte Seite hinzufügen wenn sie nicht bereits enthalten ist
      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const renderStars = (rating: string) => {
    return [...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        className={`icon-enhanced ${i < parseInt(rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
      />
    ));
  };

  const formatDate = (dateString: string | null, timeString: string | null) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    
    if (timeString) {
      // Remove seconds from time format (XX:XX:XX -> XX:XX)
      const timeWithoutSeconds = timeString.slice(0, 5);
      return `${formattedDate} um ${timeWithoutSeconds} Uhr`;
    }
    
    return formattedDate;
  };


  return (
    <section className="rounded-enhanced bg-white p-enhanced">
      {/* Header */}
      <div className="sticky top-0 pt-4 -mt-4 mb-3 bg-white z-10 border-b border-neutral-200 flex flex-col sm:flex-row">
        <h2 className="mb-2 flex items-center gap-2 text-2xl font-semibold pb-3 flex-auto pe-4">
          Bewertungen 
          <Badge variant="secondary" className="rounded-full border border-neutral-200 bg-page-background text-neutral-700 text-lg py-0.5 px-2.5 -ml-0.5 font-normal">
            {selectedFilters.length > 0 ? `${filteredReviews.length} von ${reviews.length}` : reviews.length}
          </Badge>
        </h2>
        <div className="relative font-semibold text-xl flex-none mb-3" style={{ color: '#334155' }} ref={dropdownRef}>
          <Button 
            variant="outline" 
            className="flex items-center gap-1 px-3 py-2 bg-white border border-neutral-300 rounded-md shadow-sm hover:bg-white hover:border-neutral-300" 
            style={{ color: '#334155' }}
            onClick={handleDropdownToggle}
          >
            <svg className="w-4 h-4" viewBox="0 0 448 512" fill="currentColor">
              <path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM64 256c0-17.7 14.3-32 32-32H352c17.7 0 32 14.3 32 32s-14.3 32-32 32H96c-17.7 0-32-14.3-32-32zM288 416c0 17.7-14.3 32-32 32H192c-17.7 0-32-14.3-32-32s14.3-32 32-32h64c17.7 0 32 14.3 32 32z"/>
            </svg>
            <span>Rechtsgebiete</span>
          </Button>

          {/* Dropdown */}
          {isDropdownOpen && (
            <div className="fixed md:absolute top-0 md:top-full right-0 md:right-0 w-screen md:w-[390px] max-h-dvh z-[1040] flex flex-col gap-4 md:rounded-[5px] bg-white p-4 shadow-2xl border">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
                <p className="text-base font-semibold text-neutral-700">Rechtsgebiete</p>
                <Button 
                  variant="link" 
                  className="!bg-transparent !text-gray-400 p-0 h-auto text-base hover:underline"
                  onClick={handleResetFilters}
                >
                  Zurücksetzen
                </Button>
              </div>

              {/* Checkboxes */}
              <div className="flex flex-col gap-4 font-normal text-base max-h-[288px] overflow-auto pr-4">
                {practiceAreas.length > 0 ? (
                  practiceAreas.map((area) => (
                    <div key={area.name} className="pl-7 relative flex">
                      <input
                        type="checkbox"
                        id={area.name}
                        checked={tempSelectedFilters.includes(area.name)}
                        onChange={() => handleFilterChange(area.name)}
                        className="peer checked:border-[#666] checked:bg-[#F0F0F0] absolute left-0.5 top-[1em] -mt-px -translate-y-[50%] appearance-none rounded h-5 w-5 cursor-pointer border-2 border-solid border-[#666] transition-colors duration-200 focus:shadow-sm hover:bg-[#F0F0F0] hover:transition-colors hover:duration-200"
                        style={{
                          backgroundImage: tempSelectedFilters.includes(area.name) ? 
                            "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDI1NiAyNTYiPjxwYXRoIGQ9Ik0yMzIuNDksODAuNDlsLTEyOCwxMjhhMTIsMTIsMCwwLDEtMTcsMGwtNTYtNTZhMTIsMTIsMCwxLDEsMTctMTdMOTYsMTgzLDIxNS41MSw2My41MWExMiwxMiwwLDAsMSwxNywxN1oiIGZpbGw9IiM2NjY2NjYiIHN0cm9rZT0iIzY2NjY2NiIgc3Ryb2tlLXdpZHRoPSIxMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+')" : 
                            'none',
                          backgroundSize: 'contain'
                        }}
                      />
                      <label 
                        htmlFor={area.name} 
                        className={`text-[#333] ml-1 mt-[0.2em] inline-block text-pretty cursor-pointer ${
                          tempSelectedFilters.includes(area.name) ? 'font-semibold' : ''
                        }`}
                      >
                        {area.name} ({area.count})
                      </label>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 text-center py-4">
                    Keine Rechtsgebiete verfügbar
                  </div>
                )}
              </div>

              {/* Footer Buttons */}
              <div className="flex justify-around gap-2 mt-auto border-t border-neutral-200 pt-4">
                <Button 
                  variant="link" 
                  className="text-base hover:underline p-0 h-auto"
                  style={{ color: '#1d4ed8', fontWeight: 600 }}
                  onClick={handleCancelFilters}
                >
                  Abbrechen
                </Button>
                <Button 
                  variant="orange" 
                  className="px-[60px] py-2"
                  onClick={handleApplyFilters}
                >
                  Anwenden
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Active Filter Badges */}
      {selectedFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedFilters.map((filter) => (
            <Badge 
              key={filter} 
              variant="secondary" 
              className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full"
            >
              {filter}
              <X 
                className="w-3 h-3 cursor-pointer hover:text-blue-900" 
                onClick={() => removeFilter(filter)}
              />
            </Badge>
          ))}
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-2">
        {currentReviews.length > 0 ? (
          currentReviews.map((review) => (
            <div 
              key={review.id}
              className="w-full p-enhanced bg-page-background rounded-enhanced border border-neutral-100"
            >
              <div className="sm:flex sm:items-center">
                <div className="flex items-center mb-2 sm:mb-0">
                  {/* Initials Badge */}
                  <div className="mr-3.5">
                    <div 
                      className="text-white rounded-full avatar-enhanced flex items-center justify-center text-lg font-normal"
                      style={{ backgroundColor: review.avatar_color }}
                    >
                      {review.initials.replace(/[\.\s]/g, '')}
                    </div>
                  </div>
                  
                  {/* Stars */}
                  <div className="flex text-amber-400 mr-3.5">
                    {renderStars(review.rating)}
                  </div>
                </div>
                
                {/* Date and Lawyer Info */}
                <p className="text-neutral-500 text-lg mr-3.5">
                  von {review.initials} am {formatDate(review.review_date, review.review_time)}
                  {review.lawyer ? (
                    <span>
                      {" "}für{" "}
                      <span className="text-neutral-500">
                        {review.lawyer.name}
                      </span>
                    </span>
                  ) : (
                    <span>
                      {" "}für{" "}
                      <span className="text-neutral-500">
                        {lawFirm?.name || "Anwaltskanzlei"}
                      </span>
                    </span>
                  )}
                </p>
              </div>
              
              {/* Review Content */}
              <div className="lg:pl-14 mt-1">
                <div>
                  <span className="inline-block mr-3 text-slate-900 text-xl font-semibold leading-normal mb-1.5">
                    {review.title}
                  </span>
                  <div className="inline-flex mb-2">
                    <Badge variant="secondary" className="bg-white border border-neutral-200 font-light text-base" style={{ color: 'rgb(51, 65, 85)' }}>
                      {review.scope || review.legal_area?.name || 'Allgemein'}
                    </Badge>
                  </div>
                </div>
                <div className="text-slate-700 text-xl font-normal leading-normal">
                  {review.content}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              {selectedFilters.length > 0 
                ? "Keine Bewertungen für die ausgewählten Filter gefunden."
                : "Keine Bewertungen verfügbar."
              }
            </div>
            {selectedFilters.length > 0 && (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSelectedFilters([]);
                  setCurrentPage(1);
                }}
              >
                Alle Filter entfernen
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-1 mt-6">
          <Button
            variant="ghost"
            size="lg"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-3 text-pagination-active hover:bg-pagination-active/10 hover:text-pagination-active disabled:text-neutral-400"
          >
            <ChevronLeft className="icon-enhanced-lg" />
          </Button>
          
          {getPaginationRange().map((page, index) => {
            if (page === '...') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="h-11 w-11 flex items-center justify-center text-neutral-500"
                >
                  ...
                </span>
              );
            }
            
            const pageNumber = page as number;
            const isActive = currentPage === pageNumber;
            return (
              <Button
                key={pageNumber}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                onClick={() => handlePageChange(pageNumber)}
                className={isActive 
                  ? "bg-pagination-active text-white border-pagination-active hover:bg-pagination-active/90 h-11 w-11 text-sm rounded-sm p-0" 
                  : "hover:bg-pagination-active/10 hover:text-[rgb(29,78,216)] h-11 w-11 text-sm p-0"
                }
                style={!isActive ? { color: 'rgb(29, 78, 216)' } : {}}
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
            className="p-3 text-pagination-active hover:bg-pagination-active/10 hover:text-pagination-active disabled:text-neutral-400"
          >
            <ChevronRight className="icon-enhanced-lg" />
          </Button>
        </div>
      )}
    </section>
  );
};

export default ReviewsList;