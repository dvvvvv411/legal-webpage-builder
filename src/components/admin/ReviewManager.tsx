import React, { useState } from "react";
import { Plus, Edit, Trash2, Star, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useReviews, useCreateReview, useUpdateReview, useDeleteReview, ReviewWithDetails, ReviewRating } from "@/hooks/use-reviews";
import { useLawFirms } from "@/hooks/use-law-firms";
import { useLegalAreas } from "@/hooks/use-legal-areas";
import { useLawyers } from "@/hooks/use-lawyers";

const ReviewManager = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<ReviewWithDetails | null>(null);
  const [formData, setFormData] = useState({
    law_firm_id: "",
    legal_area_id: "",
    lawyer_id: "",
    review_type: "law_firm" as "law_firm" | "lawyer",
    initials: "",
    rating: "5" as ReviewRating,
    title: "",
    content: "",
    review_date: "",
    review_time: "",
    avatar_color: "#6B7280",
  });

  const { data: reviews, isLoading } = useReviews();
  const { data: lawFirms } = useLawFirms();
  const { data: legalAreas } = useLegalAreas();
  const { data: lawyers } = useLawyers();
  const createReview = useCreateReview();
  const updateReview = useUpdateReview();
  const deleteReview = useDeleteReview();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const reviewData = {
      ...formData,
      legal_area_id: formData.legal_area_id === "none" || !formData.legal_area_id ? undefined : formData.legal_area_id,
      lawyer_id: formData.review_type === "lawyer" && formData.lawyer_id ? formData.lawyer_id : undefined,
      review_date: formData.review_date || undefined,
      review_time: formData.review_time || undefined,
    };
    
    // Remove form-specific fields before submitting
    const { review_type, ...submitData } = reviewData;
    
    if (selectedReview) {
      await updateReview.mutateAsync({
        id: selectedReview.id,
        ...submitData,
      });
      setIsEditDialogOpen(false);
    } else {
      await createReview.mutateAsync(submitData);
      setIsCreateDialogOpen(false);
    }
    
    setFormData({
      law_firm_id: "",
      legal_area_id: "",
      lawyer_id: "",
      review_type: "law_firm" as "law_firm" | "lawyer",
      initials: "",
      rating: "5" as ReviewRating,
      title: "",
      content: "",
      review_date: "",
      review_time: "",
      avatar_color: "#6B7280",
    });
    setSelectedReview(null);
  };

  const handleEdit = (review: ReviewWithDetails) => {
    setSelectedReview(review);
    setFormData({
      law_firm_id: review.law_firm_id,
      legal_area_id: review.legal_area_id || "none",
      lawyer_id: review.lawyer_id || "",
      review_type: review.lawyer_id ? "lawyer" : "law_firm",
      initials: review.initials,
      rating: review.rating,
      title: review.title,
      content: review.content,
      review_date: review.review_date || "",
      review_time: review.review_time || "",
      avatar_color: review.avatar_color,
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      await deleteReview.mutateAsync(id);
    }
  };

  const generateRandomColor = () => {
    const colors = [
      "#EF4444", "#F97316", "#F59E0B", "#EAB308", "#84CC16",
      "#22C55E", "#10B981", "#14B8A6", "#06B6D4", "#0EA5E9",
      "#3B82F6", "#6366F1", "#8B5CF6", "#A855F7", "#D946EF",
      "#EC4899", "#F43F5E"
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const ReviewForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="law_firm_id">Law Firm *</Label>
        <Select
          value={formData.law_firm_id}
          onValueChange={(value) => setFormData(prev => ({ ...prev, law_firm_id: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a law firm" />
          </SelectTrigger>
          <SelectContent>
            {lawFirms?.map((firm) => (
              <SelectItem key={firm.id} value={firm.id}>
                {firm.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="legal_area_id">Legal Area</Label>
        <Select
          value={formData.legal_area_id}
          onValueChange={(value) => setFormData(prev => ({ ...prev, legal_area_id: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a legal area" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            {legalAreas?.map((area) => (
              <SelectItem key={area.id} value={area.id}>
                {area.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="initials">Initials *</Label>
        <Input
          id="initials"
          value={formData.initials}
          onChange={(e) => setFormData(prev => ({ ...prev, initials: e.target.value }))}
          required
          maxLength={4}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="rating">Rating *</Label>
        <Select
          value={formData.rating}
          onValueChange={(value) => setFormData(prev => ({ ...prev, rating: value as ReviewRating }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 Star</SelectItem>
            <SelectItem value="2">2 Stars</SelectItem>
            <SelectItem value="3">3 Stars</SelectItem>
            <SelectItem value="4">4 Stars</SelectItem>
            <SelectItem value="5">5 Stars</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="content">Content *</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="review_type">Review Type *</Label>
        <Select
          value={formData.review_type}
          onValueChange={(value) => setFormData(prev => ({ ...prev, review_type: value as "law_firm" | "lawyer", lawyer_id: "" }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="law_firm">Law Firm</SelectItem>
            <SelectItem value="lawyer">Specific Lawyer</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {formData.review_type === "lawyer" && (
        <div className="space-y-2">
          <Label htmlFor="lawyer_id">Lawyer *</Label>
          <Select
            value={formData.lawyer_id}
            onValueChange={(value) => setFormData(prev => ({ ...prev, lawyer_id: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a lawyer" />
            </SelectTrigger>
            <SelectContent>
              {lawyers?.filter(lawyer => lawyer.law_firm_id === formData.law_firm_id).map((lawyer) => (
                <SelectItem key={lawyer.id} value={lawyer.id}>
                  {lawyer.name} {lawyer.title && `(${lawyer.title})`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="review_date">Review Date</Label>
          <Input
            id="review_date"
            type="date"
            value={formData.review_date}
            onChange={(e) => setFormData(prev => ({ ...prev, review_date: e.target.value }))}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="review_time">Review Time</Label>
          <Input
            id="review_time"
            type="time"
            value={formData.review_time}
            onChange={(e) => setFormData(prev => ({ ...prev, review_time: e.target.value }))}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="avatar_color">Avatar Color</Label>
        <div className="flex gap-2">
          <Input
            id="avatar_color"
            type="color"
            value={formData.avatar_color}
            onChange={(e) => setFormData(prev => ({ ...prev, avatar_color: e.target.value }))}
            className="w-16"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => setFormData(prev => ({ ...prev, avatar_color: generateRandomColor() }))}
          >
            Random
          </Button>
        </div>
      </div>
      
      <Button type="submit" className="w-full">
        {selectedReview ? "Update Review" : "Create Review"}
      </Button>
    </form>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Reviews
            </CardTitle>
            <CardDescription>
              Manage client reviews and testimonials
            </CardDescription>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Review
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Review</DialogTitle>
              </DialogHeader>
              <ReviewForm />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reviewer</TableHead>
                <TableHead>Law Firm</TableHead>
                <TableHead>Legal Area</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews?.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                        style={{ backgroundColor: review.avatar_color }}
                      >
                        {review.initials}
                      </div>
                      {review.initials}
                    </div>
                  </TableCell>
                  <TableCell>{review.law_firm.name}</TableCell>
                  <TableCell>
                    {review.legal_area ? (
                      <Badge variant="secondary">{review.legal_area.name}</Badge>
                    ) : (
                      "N/A"
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {review.rating}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{review.title}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(review)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(review.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Review</DialogTitle>
          </DialogHeader>
          <ReviewForm />
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ReviewManager;