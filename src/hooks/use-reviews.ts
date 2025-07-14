import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export type ReviewRating = "1" | "2" | "3" | "4" | "5";

export interface Review {
  id: string;
  law_firm_id: string;
  legal_area_id?: string;
  initials: string;
  rating: ReviewRating;
  title: string;
  content: string;
  scope?: string;
  avatar_color: string;
  created_at: string;
  updated_at: string;
}

export interface ReviewWithDetails extends Review {
  law_firm: {
    name: string;
    slug: string;
  };
  legal_area?: {
    name: string;
  };
}

export const useReviews = () => {
  return useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select(`
          *,
          law_firm:law_firms(name, slug),
          legal_area:legal_areas(name)
        `)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as ReviewWithDetails[];
    },
  });
};

export const useReviewsByLawFirm = (lawFirmId: string) => {
  return useQuery({
    queryKey: ["reviews", "law-firm", lawFirmId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select(`
          *,
          legal_area:legal_areas(name)
        `)
        .eq("law_firm_id", lawFirmId)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!lawFirmId,
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (review: Omit<Review, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("reviews")
        .insert([review])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      toast({
        title: "Success",
        description: "Review created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create review: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Review> & { id: string }) => {
      const { data, error } = await supabase
        .from("reviews")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      toast({
        title: "Success",
        description: "Review updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update review: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("reviews")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      toast({
        title: "Success",
        description: "Review deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete review: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};