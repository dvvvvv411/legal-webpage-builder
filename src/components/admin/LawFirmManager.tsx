import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Building2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LawyerManager } from "./LawyerManager";

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

interface LegalArea {
  id: string;
  name: string;
  slug: string;
}

export const LawFirmManager = () => {
  const [lawFirms, setLawFirms] = useState<LawFirm[]>([]);
  const [legalAreas, setLegalAreas] = useState<LegalArea[]>([]);
  const [selectedLawFirm, setSelectedLawFirm] = useState<LawFirm | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLawyerManagerOpen, setIsLawyerManagerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    logo_url: "",
    phone: "",
    slug: "",
    legal_area_ids: [] as string[]
  });

  useEffect(() => {
    fetchLawFirms();
    fetchLegalAreas();
  }, []);

  const fetchLawFirms = async () => {
    const { data, error } = await supabase
      .from("law_firms")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error fetching law firms", description: error.message, variant: "destructive" });
    } else {
      setLawFirms(data || []);
    }
  };

  const fetchLegalAreas = async () => {
    const { data, error } = await supabase
      .from("legal_areas")
      .select("*")
      .order("name");

    if (error) {
      toast({ title: "Error fetching legal areas", description: error.message, variant: "destructive" });
    } else {
      setLegalAreas(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let result;
      if (selectedLawFirm) {
        result = await supabase
          .from("law_firms")
          .update({
            name: formData.name,
            description: formData.description || null,
            logo_url: formData.logo_url || null,
            phone: formData.phone || null,
            slug: formData.slug
          })
          .eq("id", selectedLawFirm.id)
          .select()
          .single();
      } else {
        result = await supabase
          .from("law_firms")
          .insert({
            name: formData.name,
            description: formData.description || null,
            logo_url: formData.logo_url || null,
            phone: formData.phone || null,
            slug: formData.slug
          })
          .select()
          .single();
      }

      if (result.error) throw result.error;

      // Update legal areas relationship
      if (result.data) {
        // Delete existing relationships
        await supabase
          .from("law_firm_legal_areas")
          .delete()
          .eq("law_firm_id", result.data.id);

        // Insert new relationships
        if (formData.legal_area_ids.length > 0) {
          const relationships = formData.legal_area_ids.map(areaId => ({
            law_firm_id: result.data.id,
            legal_area_id: areaId
          }));

          await supabase
            .from("law_firm_legal_areas")
            .insert(relationships);
        }
      }

      toast({
        title: selectedLawFirm ? "Law firm updated" : "Law firm created",
        description: "Law firm has been saved successfully."
      });

      resetForm();
      fetchLawFirms();
      setIsOpen(false);
    } catch (error: any) {
      toast({
        title: "Error saving law firm",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (lawFirm: LawFirm) => {
    setSelectedLawFirm(lawFirm);
    setFormData({
      name: lawFirm.name,
      description: lawFirm.description || "",
      logo_url: lawFirm.logo_url || "",
      phone: lawFirm.phone || "",
      slug: lawFirm.slug,
      legal_area_ids: []
    });
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this law firm?")) return;

    const { error } = await supabase
      .from("law_firms")
      .delete()
      .eq("id", id);

    if (error) {
      toast({ title: "Error deleting law firm", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Law firm deleted", description: "Law firm has been deleted successfully." });
      fetchLawFirms();
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      logo_url: "",
      phone: "",
      slug: "",
      legal_area_ids: []
    });
    setSelectedLawFirm(null);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleNameChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      name: value,
      slug: prev.slug === "" ? generateSlug(value) : prev.slug
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-text-dark">Kanzleien</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={resetForm}
              className="bg-orange-primary hover:bg-orange-button-hover text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Kanzlei hinzufügen
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-text-dark">
                {selectedLawFirm ? "Kanzlei bearbeiten" : "Neue Kanzlei hinzufügen"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="slug">URL Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="law-firm-name"
                  required
                />
                <p className="text-sm text-muted-foreground mt-1">
                  This will be used in the URL: /{formData.slug}
                </p>
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+49 931 22222"
                />
              </div>
              <div>
                <Label htmlFor="logo_url">Logo URL</Label>
                <Input
                  id="logo_url"
                  value={formData.logo_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, logo_url: e.target.value }))}
                  placeholder="https://example.com/logo.jpg"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="bg-orange-primary hover:bg-orange-button-hover text-white"
                >
                  {loading ? "Speichern..." : selectedLawFirm ? "Aktualisieren" : "Erstellen"}
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {lawFirms.map((lawFirm) => (
          <Card key={lawFirm.id} className="relative">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                {lawFirm.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <Badge variant="secondary">/{lawFirm.slug}</Badge>
                </div>
                {lawFirm.phone && (
                  <p className="text-sm text-muted-foreground">
                    Phone: {lawFirm.phone}
                  </p>
                )}
                {lawFirm.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {lawFirm.description}
                  </p>
                )}
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(lawFirm)}
                    className="border-orange-primary text-orange-primary hover:bg-orange-primary hover:text-white"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedLawFirm(lawFirm);
                      setIsLawyerManagerOpen(true);
                    }}
                    className="border-orange-primary text-orange-primary hover:bg-orange-primary hover:text-white"
                  >
                    Anwälte
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(lawFirm.id)}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedLawFirm && (
        <LawyerManager
          lawFirm={selectedLawFirm}
          isOpen={isLawyerManagerOpen}
          onClose={() => {
            setIsLawyerManagerOpen(false);
            setSelectedLawFirm(null);
          }}
        />
      )}
    </div>
  );
};