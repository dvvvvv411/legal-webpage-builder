import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface LawFirm {
  id: string;
  name: string;
  slug: string;
  phone?: string;
  logo_url?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface LawFirmWithDetails extends LawFirm {
  lawyers: Array<{
    id: string;
    name: string;
    title?: string;
    specialization?: string;
    bio?: string;
    photo_url?: string;
  }>;
  legal_areas: Array<{
    id: string;
    name: string;
    slug: string;
    description?: string;
  }>;
  reviews: Array<{
    id: string;
    initials: string;
    rating: string;
    title: string;
    content: string;
    scope?: string;
    avatar_color: string;
    created_at: string;
    legal_area?: {
      name: string;
    };
  }>;
}

export const useLawFirms = () => {
  return useQuery({
    queryKey: ["law-firms"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("law_firms")
        .select(`
          *,
          lawyers:lawyers(*)
        `)
        .order("name");
      
      if (error) throw error;
      return data as (LawFirm & { lawyers: Array<{ id: string; name: string; title?: string; specialization?: string; bio?: string; photo_url?: string; }> })[];
    },
  });
};

export const useLawFirmBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["law-firm", slug],
    queryFn: async () => {
      console.log("Fetching law firm with slug:", slug);
      
      const { data, error } = await supabase
        .from("law_firms")
        .select(`
          *,
          lawyers:lawyers(*),
          legal_areas:law_firm_legal_areas(
            legal_area:legal_areas(*)
          ),
          reviews:reviews(
            *,
            legal_area:legal_areas(name)
          )
        `)
        .eq("slug", slug)
        .maybeSingle();
      
      if (error) {
        console.error("Error fetching law firm:", error);
        throw error;
      }
      
      if (!data) {
        console.log("No law firm found with slug:", slug);
        return null;
      }
      
      console.log("Raw law firm data:", data);
      
      // Transform the data to match our interface
      const transformed = {
        ...data,
        legal_areas: data.legal_areas?.map((la: any) => la.legal_area) || [],
        reviews: data.reviews?.map((review: any) => ({
          ...review,
          legal_area: review.legal_area
        })) || []
      };
      
      console.log("Transformed law firm data:", transformed);
      
      return transformed as LawFirmWithDetails;
    },
    enabled: !!slug,
  });
};

export const useCreateLawFirm = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (lawFirm: Omit<LawFirm, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("law_firms")
        .insert([lawFirm])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["law-firms"] });
      toast({
        title: "Success",
        description: "Law firm created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create law firm: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateLawFirm = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<LawFirm> & { id: string }) => {
      const { data, error } = await supabase
        .from("law_firms")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["law-firms"] });
      toast({
        title: "Success",
        description: "Law firm updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update law firm: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteLawFirm = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("law_firms")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["law-firms"] });
      toast({
        title: "Success",
        description: "Law firm deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete law firm: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};