import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { useLawFirmBySlug } from "@/hooks/use-law-firms";
import { useLegalAreas } from "@/hooks/use-legal-areas";
import { Loader2, CheckCircle, MessageSquare, Phone, Mail } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Nachricht = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    legal_area_id: "",
    urgency: "normal",
    subject: "",
    message: "",
  });

  const { data: lawFirm, isLoading: firmLoading, error: firmError } = useLawFirmBySlug(slug || "");
  const { data: legalAreas, isLoading: legalAreasLoading, error: legalAreasError } = useLegalAreas();
  
  console.log("Nachricht page - slug:", slug);
  console.log("Nachricht page - lawFirm:", lawFirm);
  console.log("Nachricht page - legalAreas:", legalAreas);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!lawFirm) return;

    // Simulate sending message (in real app, this would be an API call)
    try {
      // Here you would typically send the message to the law firm
      // For now, we'll just simulate success
      setTimeout(() => {
        setIsSubmitted(true);
        toast({
          title: "Message sent successfully!",
          description: "The law firm will contact you soon.",
        });
      }, 1000);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (firmLoading || legalAreasLoading) {
    return (
      <div className="min-h-screen bg-page-background">
        <Header />
        <div className="container mx-auto px-enhanced py-12">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (firmError || legalAreasError) {
    console.error("Error loading data:", firmError || legalAreasError);
    return (
      <div className="min-h-screen bg-page-background">
        <Header />
        <div className="container mx-auto px-enhanced py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Error Loading Data</h1>
            <p className="text-muted-foreground mb-4">
              There was an error loading the required information.
            </p>
            <Button onClick={() => navigate("/")}>Return Home</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!lawFirm) {
    return (
      <div className="min-h-screen bg-page-background">
        <Header />
        <div className="container mx-auto px-enhanced py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Law Firm Not Found</h1>
            <p className="text-muted-foreground mb-4">
              The law firm with slug "{slug}" could not be found.
            </p>
            <Button onClick={() => navigate("/")}>Return Home</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const breadcrumbItems = [
    { label: lawFirm.name, href: `/${lawFirm.slug}` },
    { label: "Nachricht senden", current: true },
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-page-background">
        <Header />
        <Breadcrumb items={breadcrumbItems} />
        
        <main className="container mx-auto px-enhanced py-12">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="text-center py-12">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold mb-4">Message Sent Successfully!</h1>
                <p className="text-muted-foreground mb-6">
                  Your message has been sent to {lawFirm.name}. They will contact you soon.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={() => navigate(`/${lawFirm.slug}`)}>
                    View Law Firm Profile
                  </Button>
                  <Button variant="outline" onClick={() => navigate("/")}>
                    Return Home
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-page-background">
      <Header />
      <Breadcrumb items={breadcrumbItems} />
      
      <main className="container mx-auto px-enhanced py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-enhanced">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <MessageSquare className="h-6 w-6" />
                    Contact {lawFirm.name}
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Send a message to get legal advice or schedule a consultation.
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="legal_area_id">Legal Area</Label>
                        <Select
                          value={formData.legal_area_id}
                          onValueChange={(value) => setFormData({ ...formData, legal_area_id: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a legal area" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Not specified</SelectItem>
                            {legalAreas && legalAreas.length > 0 ? (
                              legalAreas.map((area) => (
                                <SelectItem key={area.id} value={area.id}>
                                  {area.name}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="" disabled>
                                No legal areas available
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="urgency">Urgency</Label>
                        <Select
                          value={formData.urgency}
                          onValueChange={(value) => setFormData({ ...formData, urgency: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="Brief description of your legal matter"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Please describe your legal matter in detail..."
                        rows={6}
                        required
                      />
                    </div>

                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Privacy Notice</h4>
                      <p className="text-sm text-muted-foreground">
                        Your information is confidential and will only be used to respond to your inquiry. 
                        This initial contact does not establish an attorney-client relationship.
                      </p>
                    </div>

                    <Button type="submit" className="w-full">
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    {lawFirm.logo_url && (
                      <img 
                        src={lawFirm.logo_url} 
                        alt={lawFirm.name} 
                        className="h-16 w-auto mx-auto mb-4"
                      />
                    )}
                    <h3 className="font-semibold">{lawFirm.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {lawFirm.description}
                    </p>
                  </div>

                  {lawFirm.phone && (
                    <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                      <Phone className="h-4 w-4" />
                      <span className="text-sm">{lawFirm.phone}</span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <h4 className="font-medium">Response Time</h4>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {formData.urgency === "urgent" ? "Within 2 hours" :
                         formData.urgency === "high" ? "Within 24 hours" :
                         "Within 48 hours"}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">What to Expect</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Initial consultation discussion</li>
                      <li>• Assessment of your legal matter</li>
                      <li>• Explanation of next steps</li>
                      <li>• Fee structure information</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Nachricht;