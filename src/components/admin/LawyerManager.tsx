import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Lawyer {
  id: string;
  name: string;
  title: string | null;
  specialization: string | null;
  bio: string | null;
  photo_url: string | null;
  law_firm_id: string;
}

interface LawFirm {
  id: string;
  name: string;
}

interface LawyerManagerProps {
  lawFirm: LawFirm;
  isOpen: boolean;
  onClose: () => void;
}

export const LawyerManager = ({ lawFirm, isOpen, onClose }: LawyerManagerProps) => {
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [selectedLawyer, setSelectedLawyer] = useState<Lawyer | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    title: "",
    specialization: "",
    bio: "",
    photo_url: ""
  });

  useEffect(() => {
    if (isOpen && lawFirm) {
      fetchLawyers();
    }
  }, [isOpen, lawFirm]);

  const fetchLawyers = async () => {
    const { data, error } = await supabase
      .from("lawyers")
      .select("*")
      .eq("law_firm_id", lawFirm.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error fetching lawyers", description: error.message, variant: "destructive" });
    } else {
      setLawyers(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let result;
      if (selectedLawyer) {
        result = await supabase
          .from("lawyers")
          .update({
            name: formData.name,
            title: formData.title || null,
            specialization: formData.specialization || null,
            bio: formData.bio || null,
            photo_url: formData.photo_url || null
          })
          .eq("id", selectedLawyer.id)
          .select()
          .single();
      } else {
        result = await supabase
          .from("lawyers")
          .insert({
            name: formData.name,
            title: formData.title || null,
            specialization: formData.specialization || null,
            bio: formData.bio || null,
            photo_url: formData.photo_url || null,
            law_firm_id: lawFirm.id
          })
          .select()
          .single();
      }

      if (result.error) throw result.error;

      toast({
        title: selectedLawyer ? "Lawyer updated" : "Lawyer created",
        description: "Lawyer has been saved successfully."
      });

      resetForm();
      fetchLawyers();
      setIsFormOpen(false);
    } catch (error: any) {
      toast({
        title: "Error saving lawyer",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (lawyer: Lawyer) => {
    setSelectedLawyer(lawyer);
    setFormData({
      name: lawyer.name,
      title: lawyer.title || "",
      specialization: lawyer.specialization || "",
      bio: lawyer.bio || "",
      photo_url: lawyer.photo_url || ""
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lawyer?")) return;

    const { error } = await supabase
      .from("lawyers")
      .delete()
      .eq("id", id);

    if (error) {
      toast({ title: "Error deleting lawyer", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Lawyer deleted", description: "Lawyer has been deleted successfully." });
      fetchLawyers();
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      title: "",
      specialization: "",
      bio: "",
      photo_url: ""
    });
    setSelectedLawyer(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Lawyers - {lawFirm.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Lawyers</h3>
            <Button onClick={() => { resetForm(); setIsFormOpen(true); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Lawyer
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {lawyers.map((lawyer) => (
              <Card key={lawyer.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {lawyer.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {lawyer.title && (
                      <p className="text-sm font-medium">{lawyer.title}</p>
                    )}
                    {lawyer.specialization && (
                      <p className="text-sm text-muted-foreground">
                        Specialization: {lawyer.specialization}
                      </p>
                    )}
                    {lawyer.bio && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {lawyer.bio}
                      </p>
                    )}
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(lawyer)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(lawyer.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedLawyer ? "Edit Lawyer" : "Add New Lawyer"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Rechtsanwalt, Partner, etc."
                />
              </div>
              <div>
                <Label htmlFor="specialization">Specialization</Label>
                <Input
                  id="specialization"
                  value={formData.specialization}
                  onChange={(e) => setFormData(prev => ({ ...prev, specialization: e.target.value }))}
                  placeholder="Family Law, Corporate Law, etc."
                />
              </div>
              <div>
                <Label htmlFor="photo_url">Photo URL</Label>
                <Input
                  id="photo_url"
                  value={formData.photo_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, photo_url: e.target.value }))}
                  placeholder="https://example.com/photo.jpg"
                />
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  rows={3}
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : selectedLawyer ? "Update" : "Create"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
};