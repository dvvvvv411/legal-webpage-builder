import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, Trash2, Building, X } from "lucide-react";
import { useLawFirms, useCreateLawFirm, useUpdateLawFirm, useDeleteLawFirm, LawFirm } from "@/hooks/use-law-firms";

const LawFirmManager = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedLawFirm, setSelectedLawFirm] = useState<LawFirm | null>(null);
  const [lawyers, setLawyers] = useState<string[]>([]);
  const [newLawyerName, setNewLawyerName] = useState("");
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
        <Label htmlFor="logo_url">Logo URL</Label>
        <Input
          id="logo_url"
          value={formData.logo_url}
          onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
          placeholder="https://example.com/logo.png"
        />
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