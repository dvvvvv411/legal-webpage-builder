import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit2, Trash2, Building, X, Upload, Image, Link, ExternalLink, Copy } from "lucide-react";
import { useLawFirms, useCreateLawFirm, useUpdateLawFirm, useDeleteLawFirm, LawFirm } from "@/hooks/use-law-firms";
import { useCreateLawyer, useDeleteLawyer } from "@/hooks/use-lawyers";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

const LawFirmManager = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedLawFirm, setSelectedLawFirm] = useState<(LawFirm & { lawyers: Array<{ id: string; name: string; title?: string; specialization?: string; bio?: string; photo_url?: string; }> }) | null>(null);
  const [lawyers, setLawyers] = useState<string[]>([]);
  const [newLawyerName, setNewLawyerName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
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
  const createLawyer = useCreateLawyer();
  const deleteLawyer = useDeleteLawyer();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isProcessing) return;
    
    setIsProcessing(true);
    console.log('Starting law firm submission with lawyers:', lawyers);
    
    try {
      let lawFirmId: string;
      let successfulLawyers = 0;
      let failedLawyers = 0;
      
      // Step 1: Create or update law firm
      if (selectedLawFirm) {
        console.log('Updating existing law firm:', selectedLawFirm.id);
        const updatedLawFirm = await updateLawFirm.mutateAsync({
          id: selectedLawFirm.id,
          ...formData,
          phone: formData.phone || undefined,
          logo_url: formData.logo_url || undefined,
        });
        lawFirmId = selectedLawFirm.id;
        console.log('Law firm updated successfully');
        
        // Handle lawyers for existing law firm
        const existingLawyers = selectedLawFirm.lawyers || [];
        const existingLawyerNames = existingLawyers.map((lawyer: any) => lawyer.name);
        
        // Remove lawyers that are no longer in the list
        console.log('Removing lawyers not in new list...');
        for (const existingLawyer of existingLawyers) {
          if (!lawyers.includes(existingLawyer.name)) {
            try {
              await deleteLawyer.mutateAsync(existingLawyer.id);
              console.log('Deleted lawyer:', existingLawyer.name);
            } catch (error) {
              console.error('Failed to delete lawyer:', existingLawyer.name, error);
            }
          }
        }
        
        // Add new lawyers
        console.log('Adding new lawyers...');
        for (const lawyerName of lawyers) {
          if (!existingLawyerNames.includes(lawyerName)) {
            try {
              await createLawyer.mutateAsync({
                name: lawyerName,
                law_firm_id: lawFirmId,
              });
              successfulLawyers++;
              console.log('Created lawyer:', lawyerName);
            } catch (error) {
              failedLawyers++;
              console.error('Failed to create lawyer:', lawyerName, error);
            }
          }
        }
        
        setIsEditDialogOpen(false);
      } else {
        console.log('Creating new law firm...');
        const newLawFirm = await createLawFirm.mutateAsync({
          ...formData,
          phone: formData.phone || undefined,
          logo_url: formData.logo_url || undefined,
        });
        lawFirmId = newLawFirm.id;
        console.log('New law firm created with ID:', lawFirmId);
        
        // Create lawyers for new law firm
        console.log('Creating lawyers for new law firm...');
        for (const lawyerName of lawyers) {
          try {
            await createLawyer.mutateAsync({
              name: lawyerName,
              law_firm_id: lawFirmId,
            });
            successfulLawyers++;
            console.log('Created lawyer:', lawyerName);
          } catch (error) {
            failedLawyers++;
            console.error('Failed to create lawyer:', lawyerName, error);
          }
        }
        
        setIsCreateDialogOpen(false);
      }
      
      // Step 2: Force refresh queries to ensure UI updates
      console.log('Invalidating queries...');
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['law-firms'] }),
        queryClient.invalidateQueries({ queryKey: ['lawyers'] }),
      ]);
      
      // Step 3: Wait a bit for queries to refresh
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log('Process completed. Success:', successfulLawyers, 'Failed:', failedLawyers);
      
      // Show success message
      let description = `Kanzlei wurde erfolgreich gespeichert.`;
      if (successfulLawyers > 0) {
        description += ` ${successfulLawyers} Anwälte wurden erfolgreich hinzugefügt.`;
      }
      if (failedLawyers > 0) {
        description += ` ${failedLawyers} Anwälte konnten nicht erstellt werden.`;
      }
      
      toast({
        title: "Erfolgreich gespeichert",
        description,
        variant: failedLawyers > 0 ? "destructive" : "default",
      });
      
      // Reset form
      setFormData({
        name: "",
        slug: "",
        phone: "",
        logo_url: "",
      });
      setLawyers([]);
      setSelectedLawFirm(null);
      
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast({
        title: "Fehler beim Speichern",
        description: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Link kopiert!",
      description: "Der Link wurde in die Zwischenablage kopiert.",
    });
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

      <Button type="submit" className="w-full" disabled={isProcessing}>
        {isProcessing ? "Wird gespeichert..." : (selectedLawFirm ? "Kanzlei aktualisieren" : "Kanzlei erstellen")}
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
                <TableHead>Link</TableHead>
                <TableHead>Anwälte</TableHead>
                <TableHead>Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lawFirms?.map((lawFirm: any) => {
                const firmUrl = `${window.location.origin}/${lawFirm.slug}`;
                return (
                  <TableRow key={lawFirm.id}>
                    <TableCell className="font-medium">{lawFirm.name}</TableCell>
                    <TableCell>
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        {lawFirm.slug}
                      </code>
                    </TableCell>
                    <TableCell>{lawFirm.phone || "-"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <a
                          href={firmUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Ansehen
                        </a>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(firmUrl)}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
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
                );
              })}
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