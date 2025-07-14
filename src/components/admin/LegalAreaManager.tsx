import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit2, Trash2, Scale } from "lucide-react";
import { useLegalAreas, useCreateLegalArea, useUpdateLegalArea, useDeleteLegalArea, LegalArea } from "@/hooks/use-legal-areas";

const LegalAreaManager = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedLegalArea, setSelectedLegalArea] = useState<LegalArea | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
  });

  const { data: legalAreas, isLoading } = useLegalAreas();
  const createLegalArea = useCreateLegalArea();
  const updateLegalArea = useUpdateLegalArea();
  const deleteLegalArea = useDeleteLegalArea();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedLegalArea) {
      await updateLegalArea.mutateAsync({
        id: selectedLegalArea.id,
        ...formData,
      });
      setIsEditDialogOpen(false);
    } else {
      await createLegalArea.mutateAsync({
        ...formData,
      });
      setIsCreateDialogOpen(false);
    }
    
    setFormData({
      name: "",
      slug: "",
    });
    setSelectedLegalArea(null);
  };

  const handleEdit = (legalArea: LegalArea) => {
    setSelectedLegalArea(legalArea);
    setFormData({
      name: legalArea.name,
      slug: legalArea.slug,
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Sind Sie sicher, dass Sie dieses Rechtsgebiet löschen möchten?")) {
      await deleteLegalArea.mutateAsync(id);
    }
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

  const LegalAreaForm = () => (
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
        <Label htmlFor="slug">Slug *</Label>
        <Input
          id="slug"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          required
        />
      </div>

      <Button type="submit" className="w-full">
        {selectedLegalArea ? "Rechtsgebiet aktualisieren" : "Rechtsgebiet erstellen"}
      </Button>
    </form>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5" />
              Rechtsgebiete-Verwaltung
            </CardTitle>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Rechtsgebiet hinzufügen
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Neues Rechtsgebiet hinzufügen</DialogTitle>
              </DialogHeader>
              <LegalAreaForm />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">Rechtsgebiete werden geladen...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {legalAreas?.map((area) => (
                <TableRow key={area.id}>
                  <TableCell className="font-medium">{area.name}</TableCell>
                  <TableCell>
                    <code className="text-sm bg-muted px-2 py-1 rounded">
                      {area.slug}
                    </code>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(area)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(area.id)}
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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rechtsgebiet bearbeiten</DialogTitle>
            </DialogHeader>
            <LegalAreaForm />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default LegalAreaManager;