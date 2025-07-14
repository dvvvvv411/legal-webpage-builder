import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, Trash2, User } from "lucide-react";
import { useLawyers, useCreateLawyer, useUpdateLawyer, useDeleteLawyer, Lawyer } from "@/hooks/use-lawyers";
import { useLawFirms } from "@/hooks/use-law-firms";

const LawyerManager = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedLawyer, setSelectedLawyer] = useState<Lawyer | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    specialization: "",
    bio: "",
    photo_url: "",
    law_firm_id: "",
  });

  const { data: lawyers, isLoading } = useLawyers();
  const { data: lawFirms } = useLawFirms();
  const createLawyer = useCreateLawyer();
  const updateLawyer = useUpdateLawyer();
  const deleteLawyer = useDeleteLawyer();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedLawyer) {
      await updateLawyer.mutateAsync({
        id: selectedLawyer.id,
        ...formData,
        title: formData.title || undefined,
        specialization: formData.specialization || undefined,
        bio: formData.bio || undefined,
        photo_url: formData.photo_url || undefined,
      });
      setIsEditDialogOpen(false);
    } else {
      await createLawyer.mutateAsync({
        ...formData,
        title: formData.title || undefined,
        specialization: formData.specialization || undefined,
        bio: formData.bio || undefined,
        photo_url: formData.photo_url || undefined,
      });
      setIsCreateDialogOpen(false);
    }
    
    setFormData({
      name: "",
      title: "",
      specialization: "",
      bio: "",
      photo_url: "",
      law_firm_id: "",
    });
    setSelectedLawyer(null);
  };

  const handleEdit = (lawyer: Lawyer) => {
    setSelectedLawyer(lawyer);
    setFormData({
      name: lawyer.name,
      title: lawyer.title || "",
      specialization: lawyer.specialization || "",
      bio: lawyer.bio || "",
      photo_url: lawyer.photo_url || "",
      law_firm_id: lawyer.law_firm_id,
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this lawyer?")) {
      await deleteLawyer.mutateAsync(id);
    }
  };

  const LawyerForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g., Senior Partner, Associate"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="law_firm_id">Law Firm *</Label>
        <Select
          value={formData.law_firm_id}
          onValueChange={(value) => setFormData({ ...formData, law_firm_id: value })}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a law firm" />
          </SelectTrigger>
          <SelectContent>
            {lawFirms?.map((firm) => (
              <SelectItem key={firm.id} value={firm.id}>
                {firm.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="specialization">Specialization</Label>
        <Input
          id="specialization"
          value={formData.specialization}
          onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
          placeholder="e.g., Corporate Law, Criminal Defense"
        />
      </div>

      <div>
        <Label htmlFor="photo_url">Photo URL</Label>
        <Input
          id="photo_url"
          value={formData.photo_url}
          onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
          placeholder="https://example.com/photo.jpg"
        />
      </div>

      <div>
        <Label htmlFor="bio">Biography</Label>
        <Textarea
          id="bio"
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          placeholder="Professional biography..."
          rows={4}
        />
      </div>

      <Button type="submit" className="w-full">
        {selectedLawyer ? "Update Lawyer" : "Create Lawyer"}
      </Button>
    </form>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Lawyer Management
            </CardTitle>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Lawyer
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Lawyer</DialogTitle>
              </DialogHeader>
              <LawyerForm />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">Loading lawyers...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Law Firm</TableHead>
                <TableHead>Specialization</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lawyers?.map((lawyer) => (
                <TableRow key={lawyer.id}>
                  <TableCell className="font-medium">{lawyer.name}</TableCell>
                  <TableCell>
                    {lawyer.title && <Badge variant="secondary">{lawyer.title}</Badge>}
                  </TableCell>
                  <TableCell>{lawyer.law_firms.name}</TableCell>
                  <TableCell>{lawyer.specialization}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(lawyer)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(lawyer.id)}
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
              <DialogTitle>Edit Lawyer</DialogTitle>
            </DialogHeader>
            <LawyerForm />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default LawyerManager;