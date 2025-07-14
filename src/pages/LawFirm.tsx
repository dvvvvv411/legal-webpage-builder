import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";
import RatingSummary from "@/components/RatingSummary";
import ReviewsList from "@/components/ReviewsList";
import CompanySidebar from "@/components/CompanySidebar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

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

const LawFirm = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [lawFirm, setLawFirm] = useState<LawFirm | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) {
      navigate('/');
      return;
    }

    const fetchLawFirm = async () => {
      try {
        const { data, error } = await supabase
          .from('law_firms')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            // No rows returned
            navigate('/');
            return;
          }
          throw error;
        }

        setLawFirm(data);
      } catch (error: any) {
        console.error('Error fetching law firm:', error);
        toast({
          title: "Error",
          description: "Failed to load law firm data",
          variant: "destructive"
        });
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchLawFirm();
  }, [slug, navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!lawFirm) {
    return null;
  }

  const breadcrumbItems = [
    {
      label: lawFirm.name,
      href: `/law-firm/${lawFirm.slug}`
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
          {/* Left column - 2/3 width */}
          <div className="lg:col-span-2 space-y-enhanced">
            <RatingSummary lawFirm={lawFirm} />
            <ReviewsList lawFirm={lawFirm} />
          </div>
          
          {/* Right column - 1/3 width */}
          <div className="lg:col-span-1">
            <CompanySidebar lawFirm={lawFirm} />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default LawFirm;