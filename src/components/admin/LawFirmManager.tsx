import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit2, Trash2, Building, X, Upload, Image, Link } from "lucide-react";
import { useLawFirms, useCreateLawFirm, useUpdateLawFirm, useDeleteLawFirm, LawFirm } from "@/hooks/use-law-firms";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const LawFirmManager = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedLawFirm, setSelectedLawFirm] = useState<LawFirm | null>(null);
  const [lawyers, setLawyers] = useState<string[]>([]);
  const [newLawyerName, setNewLawyerName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    phone: "",
    logo_url: "",
  });

  const { data: lawFirms, isLoading } = useLawFirms();
  const createLawFirm = useCreateLawFirm();
  const updateLawFirm = useUpdateLawFirm();
  const deleteLawFirm = useDeleteLawFirm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedLawFirm) {
      await updateLawFirm.mutateAsync({
        id: selectedLawFirm.id,
        ...formData,
        phone: formData.phone || undefined,
        logo_url: formData.logo_url || undefined,
      });
      setIsEditDialogOpen(false);
    } else {
      await createLawFirm.mutateAsync({
        ...formData,
        phone: formData.phone || undefined,
        logo_url: formData.logo_url || undefined,
      });
      setIsCreateDialogOpen(false);
    }
    
    // TODO: Implement lawyer creation when database is properly set up
    // For now, lawyers are just stored in the form state
    
    // Reset form
    setFormData({
      name: "",
      slug: "",
      phone: "",
      logo_url: "",
    });
    setLawyers([]);
    setSelectedLawFirm(null);
  };

  const handleEdit = (lawFirm: any) => {
    setSelectedLawFirm(lawFirm);
    setFormData({
      name: lawFirm.name,
      slug: lawFirm.slug,
      phone: lawFirm.phone || "",
      logo_url: lawFirm.logo_url || "",
    });
    // Load existing lawyers for this firm
    if (lawFirm.lawyers) {
      setLawyers(lawFirm.lawyers.map((lawyer: any) => lawyer.name));
    }
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Sind Sie sicher, dass Sie diese Kanzlei löschen möchten?")) {
      await deleteLawFirm.mutateAsync(id);
    }
  };

  const addLawyer = () => {
    if (newLawyerName.trim()) {
      setLawyers([...lawyers, newLawyerName.trim()]);
      setNewLawyerName("");
    }
  };

  const removeLawyer = (index: number) => {
    setLawyers(lawyers.filter((_, i) => i !== index));
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleNameChange = (name: string) => {
    const slug = generateSlug(name);
    setFormData({ ...formData, name, slug });
  };

  const handleLogoUpload = async (file: File) => {
    if (!file) return;
    
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error } = await supabase.storage
        .from('law-firm-logos')
        .upload(filePath, file);

      if (error) {
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('law-firm-logos')
        .getPublicUrl(filePath);

      setFormData({ ...formData, logo_url: publicUrl });
      toast({
        title: "Logo erfolgreich hochgeladen!",
        description: "Das Logo kann jetzt verwendet werden.",
      });
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast({
        title: "Fehler beim Hochladen",
        description: "Das Logo konnte nicht hochgeladen werden.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const LawFirmForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Name der Kanzlei *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleNameChange(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="slug">URL-Slug *</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="phone">Telefonnummer</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="+49 30 12345678"
        />
      </div>

      <div>
        <Label>Logo</Label>
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">
              <Upload className="h-4 w-4 mr-2" />
              Hochladen
            </TabsTrigger>
            <TabsTrigger value="url">
              <Link className="h-4 w-4 mr-2" />
              URL
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="space-y-4">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
              <div className="space-y-2">
                <div className="flex justify-center">
                  <Image className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="text-sm text-muted-foreground">
                  Klicken Sie hier oder ziehen Sie ein Bild hierher
                </div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleLogoUpload(file);
                    }
                  }}
                  className="cursor-pointer"
                  disabled={uploading}
                />
                {uploading && (
                  <div className="text-sm text-muted-foreground">
                    Wird hochgeladen...
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="url" className="space-y-4">
            <Input
              placeholder="https://example.com/logo.png"
              value={formData.logo_url}
              onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
            />
          </TabsContent>
        </Tabs>
        
        {formData.logo_url && (
          <div className="mt-4 p-4 border rounded-lg bg-muted/50">
            <Label className="text-sm font-medium">Vorschau:</Label>
            <div className="mt-2 flex items-center gap-4">
              <img 
                src={formData.logo_url} 
                alt="Logo Vorschau" 
                className="h-16 w-16 object-contain rounded border"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="flex-1">
                <div className="text-sm text-muted-foreground truncate">
                  {formData.logo_url}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setFormData({ ...formData, logo_url: "" })}
                  className="mt-1 h-auto p-0 text-red-500 hover:text-red-700"
                >
                  <X className="h-3 w-3 mr-1" />
                  Entfernen
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div>
        <Label>Anwälte</Label>
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              value={newLawyerName}
              onChange={(e) => setNewLawyerName(e.target.value)}
              placeholder="Name des Anwalts"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addLawyer();
                }
              }}
            />
            <Button type="button" onClick={addLawyer}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {lawyers.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {lawyers.map((lawyer, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {lawyer}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeLawyer(index)}
                  />
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      <Button type="submit" className="w-full">
        {selectedLawFirm ? "Kanzlei aktualisieren" : "Kanzlei erstellen"}
      </Button>
    </form>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Kanzlei-Verwaltung
            </CardTitle>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Kanzlei hinzufügen
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Neue Kanzlei hinzufügen</DialogTitle>
              </DialogHeader>
              <LawFirmForm />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">Kanzleien werden geladen...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Telefon</TableHead>
                <TableHead>Anwälte</TableHead>
                <TableHead>Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lawFirms?.map((lawFirm: any) => (
                <TableRow key={lawFirm.id}>
                  <TableCell className="font-medium">{lawFirm.name}</TableCell>
                  <TableCell>
                    <code className="text-sm bg-muted px-2 py-1 rounded">
                      {lawFirm.slug}
                    </code>
                  </TableCell>
                  <TableCell>{lawFirm.phone || "-"}</TableCell>
                  <TableCell>
                    {lawFirm.lawyers && lawFirm.lawyers.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {lawFirm.lawyers.map((lawyer: any, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {lawyer.name}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Keine Anwälte</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(lawFirm)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(lawFirm.id)}
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

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Kanzlei bearbeiten</DialogTitle>
            </DialogHeader>
            <LawFirmForm />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default LawFirmManager;