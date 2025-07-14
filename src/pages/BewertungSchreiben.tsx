import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star } from "@/components/ui/star";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { useLawFirmBySlug } from "@/hooks/use-law-firms";
import { useLegalAreas } from "@/hooks/use-legal-areas";
import { useCreateReview } from "@/hooks/use-reviews";
import { Loader2, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type ReviewRating = "1" | "2" | "3" | "4" | "5";

const BewertungSchreiben = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    initials: "",
    rating: "" as ReviewRating,
    title: "",
    content: "",
    legal_area_id: "",
  });

  const { data: lawFirm, isLoading: firmLoading, error: firmError } = useLawFirmBySlug(slug || "");
  const { data: legalAreas, isLoading: legalAreasLoading, error: legalAreasError } = useLegalAreas();
  
  console.log("BewertungSchreiben page - slug:", slug);
  console.log("BewertungSchreiben page - lawFirm:", lawFirm);
  console.log("BewertungSchreiben page - legalAreas:", legalAreas);
  const createReview = useCreateReview();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!lawFirm) return;

    try {
      await createReview.mutateAsync({
        law_firm_id: lawFirm.id,
        legal_area_id: formData.legal_area_id === "not-specified" ? undefined : formData.legal_area_id || undefined,
        initials: formData.initials,
        rating: formData.rating,
        title: formData.title,
        content: formData.content,
        avatar_color: generateRandomColor(),
      });

      setIsSubmitted(true);
      toast({
        title: "Review submitted successfully!",
        description: "Thank you for your feedback.",
      });
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const generateRandomColor = () => {
    const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  if (firmLoading || legalAreasLoading) {
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

  if (firmError || legalAreasError) {
    console.error("Error loading data:", firmError || legalAreasError);
    return (
      <div className="min-h-screen bg-page-background">
        <Header />
        <div className="container mx-auto px-enhanced py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Error Loading Data</h1>
            <p className="text-muted-foreground mb-4">
              There was an error loading the required information.
            </p>
            <Button onClick={() => navigate("/")}>Return Home</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!lawFirm) {
    return (
      <div className="min-h-screen bg-page-background">
        <Header />
        <div className="container mx-auto px-enhanced py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Law Firm Not Found</h1>
            <p className="text-muted-foreground mb-4">
              The law firm with slug "{slug}" could not be found.
            </p>
            <Button onClick={() => navigate("/")}>Return Home</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const breadcrumbItems = [
    { label: lawFirm.name, href: `/${lawFirm.slug}` },
    { label: "Bewertung schreiben", current: true },
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-page-background">
        <Header />
        <Breadcrumb items={breadcrumbItems} />
        
        <main className="container mx-auto px-enhanced py-12">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="text-center py-12">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold mb-4">Review Submitted Successfully!</h1>
                <p className="text-muted-foreground mb-6">
                  Thank you for taking the time to share your experience with {lawFirm.name}.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={() => navigate(`/${lawFirm.slug}`)}>
                    View All Reviews
                  </Button>
                  <Button variant="outline" onClick={() => navigate("/")}>
                    Return Home
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-page-background">
      <Header />
      <Breadcrumb items={breadcrumbItems} />
      
      <main className="container mx-auto px-enhanced py-12">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Review {lawFirm.name}</CardTitle>
              <p className="text-muted-foreground">
                Share your experience to help others make informed decisions.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="initials">Your Initials *</Label>
                  <Input
                    id="initials"
                    value={formData.initials}
                    onChange={(e) => setFormData({ ...formData, initials: e.target.value })}
                    placeholder="e.g., J.D."
                    maxLength={10}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="legal_area_id">Legal Area</Label>
                  <Select
                    value={formData.legal_area_id}
                    onValueChange={(value) => setFormData({ ...formData, legal_area_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a legal area (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="not-specified">Not specified</SelectItem>
                      {legalAreas && legalAreas.length > 0 ? (
                        legalAreas.map((area) => (
                          <SelectItem key={area.id} value={area.id}>
                            {area.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="not-specified" disabled>
                          No legal areas available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Rating *</Label>
                  <div className="flex gap-2 mt-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: rating.toString() as ReviewRating })}
                        className="focus:outline-none"
                      >
                        <Star 
                          className="h-8 w-8 cursor-pointer transition-colors" 
                          filled={parseInt(formData.rating) >= rating}
                        />
                      </button>
                    ))}
                  </div>
                  {formData.rating && (
                    <div className="mt-2">
                      <Badge variant="secondary">
                        {formData.rating} star{formData.rating !== "1" ? "s" : ""}
                      </Badge>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="title">Review Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Summarize your experience..."
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="content">Review Content *</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Tell us about your experience with this law firm..."
                    rows={6}
                    required
                  />
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Review Guidelines</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Be honest and constructive in your feedback</li>
                    <li>• Focus on your personal experience with the services</li>
                    <li>• Avoid sharing confidential information</li>
                    <li>• Reviews are moderated for quality and compliance</li>
                  </ul>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={createReview.isPending}
                >
                  {createReview.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Review"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BewertungSchreiben;