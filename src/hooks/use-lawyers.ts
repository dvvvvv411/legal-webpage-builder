import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Lawyer {
  id: string;
  name: string;
  title?: string;
  specialization?: string;
  bio?: string;
  photo_url?: string;
  law_firm_id: string;
  created_at: string;
  updated_at: string;
}

export const useLawyers = () => {
  return useQuery({
    queryKey: ["lawyers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lawyers")
        .select(`
          *,
          law_firms!lawyers_law_firm_id_fkey(name)
        `)
        .order("name");
      
      if (error) throw error;
      return data as (Lawyer & { law_firms: { name: string } })[];
    },
  });
};

export const useCreateLawyer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (lawyer: Omit<Lawyer, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("lawyers")
        .insert([lawyer])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lawyers"] });
      toast({
        title: "Success",
        description: "Lawyer created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create lawyer: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateLawyer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Lawyer> & { id: string }) => {
      const { data, error } = await supabase
        .from("lawyers")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lawyers"] });
      toast({
        title: "Success",
        description: "Lawyer updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update lawyer: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteLawyer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("lawyers")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lawyers"] });
      toast({
        title: "Success",
        description: "Lawyer deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete lawyer: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};