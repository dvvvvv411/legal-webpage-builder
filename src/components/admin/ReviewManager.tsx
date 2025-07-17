import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "@/components/ui/star";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, MessageSquare, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ReviewMultiUpload } from "./ReviewMultiUpload";

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
}

interface LawFirm {
  id: string;
  name: string;
}

interface Lawyer {
  id: string;
  name: string;
  law_firm_id: string;
}

interface LegalArea {
  id: string;
  name: string;
}

const avatarColors = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', 
  '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e'
];

export const ReviewManager = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [lawFirms, setLawFirms] = useState<LawFirm[]>([]);
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [legalAreas, setLegalAreas] = useState<LegalArea[]>([]);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    rating: "5",
    initials: "",
    review_date: "",
    review_time: "",
    law_firm_id: "",
    lawyer_id: "",
    legal_area_id: ""
  });

  useEffect(() => {
    fetchReviews();
    fetchLawFirms();
    fetchLegalAreas();
  }, []);

  useEffect(() => {
    if (formData.law_firm_id) {
      fetchLawyers(formData.law_firm_id);
    }
  }, [formData.law_firm_id]);

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from("reviews")
      .select(`
        *,
        law_firm:law_firms(name),
        lawyer:lawyers(name),
        legal_area:legal_areas(name)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error fetching reviews", description: error.message, variant: "destructive" });
    } else {
      setReviews(data || []);
    }
  };

  const fetchLawFirms = async () => {
    const { data, error } = await supabase
      .from("law_firms")
      .select("id, name")
      .order("name");

    if (error) {
      toast({ title: "Error fetching law firms", description: error.message, variant: "destructive" });
    } else {
      setLawFirms(data || []);
    }
  };

  const fetchLawyers = async (lawFirmId: string) => {
    const { data, error } = await supabase
      .from("lawyers")
      .select("id, name, law_firm_id")
      .eq("law_firm_id", lawFirmId)
      .order("name");

    if (error) {
      toast({ title: "Error fetching lawyers", description: error.message, variant: "destructive" });
    } else {
      setLawyers(data || []);
    }
  };

  const fetchLegalAreas = async () => {
    const { data, error } = await supabase
      .from("legal_areas")
      .select("id, name")
      .order("name");

    if (error) {
      toast({ title: "Error fetching legal areas", description: error.message, variant: "destructive" });
    } else {
      setLegalAreas(data || []);
    }
  };

  const generateInitials = (text: string) => {
    const words = text.trim().split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return text.slice(0, 2).toUpperCase();
  };

  const getRandomColor = () => {
    return avatarColors[Math.floor(Math.random() * avatarColors.length)];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const reviewData = {
        title: formData.title,
        content: formData.content,
        rating: formData.rating as "1" | "2" | "3" | "4" | "5",
        initials: formData.initials || generateInitials(formData.title),
        avatar_color: selectedReview?.avatar_color || getRandomColor(),
        review_date: formData.review_date || null,
        review_time: formData.review_time || null,
        scope: null,
        law_firm_id: formData.law_firm_id,
        lawyer_id: (formData.lawyer_id && formData.lawyer_id !== "none") ? formData.lawyer_id : null,
        legal_area_id: (formData.legal_area_id && formData.legal_area_id !== "none") ? formData.legal_area_id : null
      };

      let result;
      if (selectedReview) {
        result = await supabase
          .from("reviews")
          .update(reviewData)
          .eq("id", selectedReview.id)
          .select()
          .single();
      } else {
        result = await supabase
          .from("reviews")
          .insert(reviewData)
          .select()
          .single();
      }

      if (result.error) throw result.error;

      toast({
        title: selectedReview ? "Review updated" : "Review created",
        description: "Review has been saved successfully."
      });

      resetForm();
      fetchReviews();
      setIsOpen(false);
    } catch (error: any) {
      toast({
        title: "Error saving review",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (review: Review) => {
    setSelectedReview(review);
    setFormData({
      title: review.title,
      content: review.content,
      rating: review.rating,
      initials: review.initials,
      review_date: review.review_date || "",
      review_time: review.review_time || "",
      law_firm_id: review.law_firm_id,
      lawyer_id: review.lawyer_id || "none",
      legal_area_id: review.legal_area_id || "none"
    });
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    const { error } = await supabase
      .from("reviews")
      .delete()
      .eq("id", id);

    if (error) {
      toast({ title: "Error deleting review", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Review deleted", description: "Review has been deleted successfully." });
      fetchReviews();
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      rating: "5",
      initials: "",
      review_date: "",
      review_time: "",
      law_firm_id: "",
      lawyer_id: "none",
      legal_area_id: "none"
    });
    setSelectedReview(null);
  };

  const renderStars = (rating: string) => {
    return [...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < parseInt(rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-text-dark">Bewertungen verwalten</h2>
      </div>

      <Tabs defaultValue="single" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger 
            value="single" 
            className="flex items-center gap-2 data-[state=active]:bg-orange-primary/10 data-[state=active]:text-orange-primary"
          >
            <Plus className="w-4 h-4" />
            Einzelbewertung
          </TabsTrigger>
          <TabsTrigger 
            value="bulk" 
            className="flex items-center gap-2 data-[state=active]:bg-orange-primary/10 data-[state=active]:text-orange-primary"
          >
            <Upload className="w-4 h-4" />
            Bulk Upload
          </TabsTrigger>
        </TabsList>

        <TabsContent value="single" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-text-dark">Einzelne Bewertungen verwalten</h3>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button 
                  onClick={resetForm}
                  className="bg-orange-primary hover:bg-orange-button-hover text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Bewertung hinzufügen
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold text-text-dark">
                    {selectedReview ? "Bewertung bearbeiten" : "Neue Bewertung hinzufügen"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="law_firm_id">Law Firm *</Label>
                    <Select
                      value={formData.law_firm_id}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, law_firm_id: value, lawyer_id: "" }))}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select law firm" />
                      </SelectTrigger>
                      <SelectContent>
                        {lawFirms.map((firm) => (
                          <SelectItem key={firm.id} value={firm.id}>
                            {firm.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="content">Content *</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                      rows={4}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="rating">Rating *</Label>
                      <Select
                        value={formData.rating}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, rating: value }))}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[5, 4, 3, 2, 1].map((rating) => (
                            <SelectItem key={rating} value={rating.toString()}>
                              {rating} Star{rating !== 1 ? 's' : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="initials">Initials</Label>
                      <Input
                        id="initials"
                        value={formData.initials}
                        onChange={(e) => setFormData(prev => ({ ...prev, initials: e.target.value }))}
                        placeholder="Auto-generated if empty"
                        maxLength={5}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="review_date">Review Date</Label>
                      <Input
                        id="review_date"
                        type="date"
                        value={formData.review_date}
                        onChange={(e) => setFormData(prev => ({ ...prev, review_date: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="review_time">Review Time</Label>
                      <Input
                        id="review_time"
                        type="time"
                        value={formData.review_time}
                        onChange={(e) => setFormData(prev => ({ ...prev, review_time: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="lawyer_id">Lawyer (Optional)</Label>
                    <Select
                      value={formData.lawyer_id}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, lawyer_id: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select lawyer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No specific lawyer</SelectItem>
                        {lawyers.map((lawyer) => (
                          <SelectItem key={lawyer.id} value={lawyer.id}>
                            {lawyer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="legal_area_id">Legal Area (Optional)</Label>
                    <Select
                      value={formData.legal_area_id}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, legal_area_id: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select legal area" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No specific area</SelectItem>
                        {legalAreas.map((area) => (
                          <SelectItem key={area.id} value={area.id}>
                            {area.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="bg-orange-primary hover:bg-orange-button-hover text-white"
                    >
                      {loading ? "Speichern..." : selectedReview ? "Aktualisieren" : "Erstellen"}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsOpen(false)}
                      className="border-orange-primary text-orange-primary hover:bg-orange-primary hover:text-white"
                    >
                      Abbrechen
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      {review.title}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(review)}
                        className="border-orange-primary text-orange-primary hover:bg-orange-primary hover:text-white"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(review.id)}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium"
                        style={{ backgroundColor: review.avatar_color }}
                      >
                        {review.initials}
                      </div>
                      <div className="flex items-center gap-2">
                        {renderStars(review.rating)}
                        <span className="text-sm text-muted-foreground">
                          {review.rating}/5 stars
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm">{review.content}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">
                        {review.law_firm?.name}
                      </Badge>
                      {review.lawyer && (
                        <Badge variant="outline">
                          {review.lawyer.name}
                        </Badge>
                      )}
                      {review.legal_area && (
                        <Badge variant="outline">
                          {review.legal_area.name}
                        </Badge>
                      )}
                    </div>

                    {(review.review_date || review.review_time) && (
                      <p className="text-xs text-muted-foreground">
                        {review.review_date} {review.review_time}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="bulk" className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Bulk Upload Reviews</h3>
            <ReviewMultiUpload onImportComplete={fetchReviews} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};