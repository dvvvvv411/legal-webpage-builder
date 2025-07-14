import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface LegalArea {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export const useLegalAreas = () => {
  return useQuery({
    queryKey: ["legal-areas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("legal_areas")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data as LegalArea[];
    },
  });
};

export const useCreateLegalArea = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (legalArea: Omit<LegalArea, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("legal_areas")
        .insert([legalArea])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["legal-areas"] });
      toast({
        title: "Success",
        description: "Legal area created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create legal area: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateLegalArea = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<LegalArea> & { id: string }) => {
      const { data, error } = await supabase
        .from("legal_areas")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["legal-areas"] });
      toast({
        title: "Success",
        description: "Legal area updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update legal area: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteLegalArea = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("legal_areas")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["legal-areas"] });
      toast({
        title: "Success",
        description: "Legal area deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete legal area: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};