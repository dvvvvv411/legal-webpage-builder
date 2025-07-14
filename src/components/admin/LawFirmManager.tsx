import React, { useState } from "react";
import { Plus, Edit, Trash2, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useLawFirms, useCreateLawFirm, useUpdateLawFirm, useDeleteLawFirm, LawFirm } from "@/hooks/use-law-firms";
import { toast } from "@/hooks/use-toast";

const LawFirmManager = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedLawFirm, setSelectedLawFirm] = useState<LawFirm | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    phone: "",
    logo_url: "",
    description: "",
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
      });
      setIsEditDialogOpen(false);
    } else {
      await createLawFirm.mutateAsync(formData);
      setIsCreateDialogOpen(false);
    }
    
    setFormData({
      name: "",
      slug: "",
      phone: "",
      logo_url: "",
      description: "",
    });
    setSelectedLawFirm(null);
  };

  const handleEdit = (lawFirm: LawFirm) => {
    setSelectedLawFirm(lawFirm);
    setFormData({
      name: lawFirm.name,
      slug: lawFirm.slug,
      phone: lawFirm.phone || "",
      logo_url: lawFirm.logo_url || "",
      description: lawFirm.description || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this law firm?")) {
      await deleteLawFirm.mutateAsync(id);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }));
  };

  const LawFirmForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleNameChange(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="slug">Slug *</Label>
        <Input
          id="slug"
          value={formData.slug}
          onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="logo_url">Logo URL</Label>
        <Input
          id="logo_url"
          value={formData.logo_url}
          onChange={(e) => setFormData(prev => ({ ...prev, logo_url: e.target.value }))}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
        />
      </div>
      
      <Button type="submit" className="w-full">
        {selectedLawFirm ? "Update Law Firm" : "Create Law Firm"}
      </Button>
    </form>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Law Firms
            </CardTitle>
            <CardDescription>
              Manage law firm profiles and information
            </CardDescription>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Law Firm
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Law Firm</DialogTitle>
              </DialogHeader>
              <LawFirmForm />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lawFirms?.map((lawFirm) => (
                <TableRow key={lawFirm.id}>
                  <TableCell className="font-medium">{lawFirm.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{lawFirm.slug}</Badge>
                  </TableCell>
                  <TableCell>{lawFirm.phone || "N/A"}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">Active</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(lawFirm)}
                      >
                        <Edit className="h-4 w-4" />
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
      </CardContent>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Law Firm</DialogTitle>
          </DialogHeader>
          <LawFirmForm />
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default LawFirmManager;