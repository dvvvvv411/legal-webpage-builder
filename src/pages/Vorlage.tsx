import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";
import RatingSummary from "@/components/RatingSummary";
import ReviewsList from "@/components/ReviewsList";
import CompanySidebar from "@/components/CompanySidebar";
import Footer from "@/components/Footer";
import { useLawFirmBySlug } from "@/hooks/use-law-firms";
import { Loader2 } from "lucide-react";
import NotFound from "./NotFound";

const Vorlage = () => {
  const { slug } = useParams<{ slug: string }>();
  
  // Default to template mode if no slug is provided
  const isTemplateMode = !slug || slug === 'vorlage';
  
  const { data: lawFirm, isLoading, error } = useLawFirmBySlug(slug || '');

  // Template mode - show static content
  if (isTemplateMode) {
    const breadcrumbItems = [
      {
        label: "Steinbock & Partner Rechtsanwaltskanzlei Fachanwälte - Steuerberater",
        href: "/steinbock-partner"
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
            <div className="lg:col-span-2 space-y-enhanced">
              <RatingSummary />
              <ReviewsList />
            </div>
            
            <div className="lg:col-span-1">
              <CompanySidebar />
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  // Dynamic mode - show loading, error, or dynamic content
  if (isLoading) {
    return (
      <div className="min-h-screen bg-page-background">
        <Header />
        <div className="container mx-auto px-enhanced py-12">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !lawFirm) {
    return <NotFound />;
  }

  const breadcrumbItems = [
    {
      label: lawFirm.name,
      href: `/${lawFirm.slug}`
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
          <div className="lg:col-span-2 space-y-enhanced">
            <RatingSummary lawFirm={lawFirm} />
            <ReviewsList lawFirm={lawFirm} />
          </div>
          
          <div className="lg:col-span-1">
            <CompanySidebar lawFirm={lawFirm} />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Vorlage;