import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileText, CheckCircle, AlertCircle, Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ParsedReview {
  law_firm_name: string;
  title: string;
  content: string;
  rating: string;
  initials: string;
  review_date?: string;
  review_time?: string;
  lawyer_name?: string;
  legal_area_name?: string;
}

interface ValidationResult {
  valid: boolean;
  errors: string[];
}

interface LawFirm {
  id: string;
  name: string;
}

interface Lawyer {
  id: string;
  name: string;
  law_firm_id: string;
}

interface LegalArea {
  id: string;
  name: string;
}

const avatarColors = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', 
  '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e'
];

interface ReviewMultiUploadProps {
  onImportComplete?: () => void;
}

export const ReviewMultiUpload = ({ onImportComplete }: ReviewMultiUploadProps) => {
  const [textInput, setTextInput] = useState("");
  const [parsedReviews, setParsedReviews] = useState<ParsedReview[]>([]);
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const { toast } = useToast();

  const generateInitials = (text: string) => {
    const words = text.trim().split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return text.slice(0, 2).toUpperCase();
  };

  const getRandomColor = () => {
    return avatarColors[Math.floor(Math.random() * avatarColors.length)];
  };

  const parseReviewText = (text: string): ParsedReview[] => {
    const lines = text.split('\n').filter(line => line.trim());
    const reviews: ParsedReview[] = [];

    for (const line of lines) {
      const parts = line.split('|').map(part => part.trim());
      
      if (parts.length >= 5) {
        const review: ParsedReview = {
          law_firm_name: parts[0],
          title: parts[1],
          content: parts[2],
          rating: parts[3],
          initials: parts[4] || generateInitials(parts[1])
        };

        // Optional fields
        if (parts[5]) review.review_date = parts[5];
        if (parts[6]) review.review_time = parts[6];
        if (parts[7]) review.lawyer_name = parts[7];
        if (parts[8]) review.legal_area_name = parts[8];

        reviews.push(review);
      }
    }

    return reviews;
  };

  const validateReview = (review: ParsedReview): ValidationResult => {
    const errors: string[] = [];

    if (!review.law_firm_name) errors.push("Law firm name is required");
    if (!review.title) errors.push("Title is required");
    if (!review.content) errors.push("Content is required");
    
    const rating = parseInt(review.rating);
    if (!review.rating || isNaN(rating) || rating < 1 || rating > 5) {
      errors.push("Rating must be between 1 and 5");
    }

    if (!review.initials) errors.push("Initials are required");

    if (review.review_date && !/^\d{4}-\d{2}-\d{2}$/.test(review.review_date)) {
      errors.push("Date must be in YYYY-MM-DD format");
    }

    if (review.review_time && !/^\d{2}:\d{2}$/.test(review.review_time)) {
      errors.push("Time must be in HH:MM format");
    }

    return {
      valid: errors.length === 0,
      errors
    };
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/plain') {
      toast({
        title: "Invalid file type",
        description: "Please upload a .txt file",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setTextInput(content);
    };
    reader.readAsText(file);
  };

  const handleParseReviews = () => {
    if (!textInput.trim()) {
      toast({
        title: "No input",
        description: "Please enter review data or upload a file",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const reviews = parseReviewText(textInput);
      const validations = reviews.map(validateReview);
      
      setParsedReviews(reviews);
      setValidationResults(validations);
      
      const validCount = validations.filter(v => v.valid).length;
      const invalidCount = validations.length - validCount;
      
      toast({
        title: "Parsing complete",
        description: `Found ${reviews.length} reviews (${validCount} valid, ${invalidCount} invalid)`
      });
    } catch (error) {
      toast({
        title: "Parsing error",
        description: "Failed to parse review data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBulkImport = async () => {
    const validReviews = parsedReviews.filter((_, index) => validationResults[index]?.valid);
    
    if (validReviews.length === 0) {
      toast({
        title: "No valid reviews",
        description: "Please fix validation errors before importing",
        variant: "destructive"
      });
      return;
    }

    setImporting(true);

    try {
      // Fetch reference data
      const { data: lawFirms } = await supabase.from("law_firms").select("id, name");
      const { data: lawyers } = await supabase.from("lawyers").select("id, name, law_firm_id");
      const { data: legalAreas } = await supabase.from("legal_areas").select("id, name");

      const reviewsToInsert = [];

      for (const review of validReviews) {
        // Find law firm
        const lawFirm = lawFirms?.find(lf => 
          lf.name.toLowerCase() === review.law_firm_name.toLowerCase()
        );

        if (!lawFirm) {
          toast({
            title: "Law firm not found",
            description: `Law firm "${review.law_firm_name}" not found in database`,
            variant: "destructive"
          });
          continue;
        }

        // Find lawyer (optional)
        let lawyer: Lawyer | undefined;
        if (review.lawyer_name) {
          lawyer = lawyers?.find(l => 
            l.name.toLowerCase() === review.lawyer_name.toLowerCase() &&
            l.law_firm_id === lawFirm.id
          );
        }

        // Find legal area (optional)
        let legalArea: LegalArea | undefined;
        if (review.legal_area_name) {
          legalArea = legalAreas?.find(la => 
            la.name.toLowerCase() === review.legal_area_name.toLowerCase()
          );
        }

        reviewsToInsert.push({
          title: review.title,
          content: review.content,
          rating: review.rating as "1" | "2" | "3" | "4" | "5",
          initials: review.initials,
          avatar_color: getRandomColor(),
          review_date: review.review_date || null,
          review_time: review.review_time || null,
          scope: null,
          law_firm_id: lawFirm.id,
          lawyer_id: lawyer?.id || null,
          legal_area_id: legalArea?.id || null
        });
      }

      if (reviewsToInsert.length === 0) {
        toast({
          title: "No reviews to import",
          description: "All reviews had validation or reference errors",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from("reviews")
        .insert(reviewsToInsert);

      if (error) throw error;

      toast({
        title: "Import successful",
        description: `Successfully imported ${reviewsToInsert.length} reviews`
      });

      // Clear form
      setTextInput("");
      setParsedReviews([]);
      setValidationResults([]);

      // Notify parent component
      onImportComplete?.();

    } catch (error: any) {
      toast({
        title: "Import failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Format Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            Format Guide
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Each line represents one review. Use the pipe character (|) to separate fields.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-2">
            <h4 className="font-medium">Required Format:</h4>
            <code className="block bg-muted p-2 rounded text-sm">
              Law Firm Name | Title | Content | Rating | Initials | Date | Time | Lawyer Name | Legal Area
            </code>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h5 className="font-medium text-green-600">Required Fields:</h5>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Law Firm Name (must exist in database)</li>
                <li>Title</li>
                <li>Content</li>
                <li>Rating (1-5)</li>
                <li>Initials (2-3 characters)</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium text-blue-600">Optional Fields:</h5>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Date (YYYY-MM-DD format)</li>
                <li>Time (HH:MM format)</li>
                <li>Lawyer Name (must exist for the law firm)</li>
                <li>Legal Area (must exist in database)</li>
              </ul>
            </div>
          </div>

          <div className="space-y-2">
            <h5 className="font-medium">Example:</h5>
            <code className="block bg-muted p-2 rounded text-sm">
              Müller & Partner | Excellent Service | Very professional and helpful throughout the process | 5 | JD | 2024-01-15 | 14:30 | Dr. Müller | Verkehrsrecht
            </code>
          </div>
        </CardContent>
      </Card>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload Reviews
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="file-upload" className="block text-sm font-medium mb-2">
              Upload .txt file (optional)
            </label>
            <input
              id="file-upload"
              type="file"
              accept=".txt"
              onChange={handleFileUpload}
              className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            />
          </div>

          <div>
            <label htmlFor="text-input" className="block text-sm font-medium mb-2">
              Or paste review data here
            </label>
            <Textarea
              id="text-input"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Paste your review data here, one review per line..."
              rows={10}
              className="font-mono text-sm"
            />
          </div>

          <Button onClick={handleParseReviews} disabled={loading || !textInput.trim()}>
            {loading ? "Parsing..." : "Parse Reviews"}
            <FileText className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>

      {/* Preview Section */}
      {parsedReviews.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Preview ({parsedReviews.length} reviews)</span>
              <Button 
                onClick={handleBulkImport} 
                disabled={importing || validationResults.every(v => !v.valid)}
              >
                {importing ? "Importing..." : "Import Valid Reviews"}
                <CheckCircle className="w-4 h-4 ml-2" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {parsedReviews.map((review, index) => {
                const validation = validationResults[index];
                return (
                  <div 
                    key={index} 
                    className={`p-3 rounded border ${validation?.valid ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={validation?.valid ? "default" : "destructive"}>
                            {validation?.valid ? "Valid" : "Invalid"}
                          </Badge>
                          <span className="font-medium">{review.title}</span>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p><strong>Law Firm:</strong> {review.law_firm_name}</p>
                          <p><strong>Content:</strong> {review.content.substring(0, 100)}...</p>
                          <p><strong>Rating:</strong> {review.rating}/5</p>
                          <p><strong>Initials:</strong> {review.initials}</p>
                          {review.review_date && <p><strong>Date:</strong> {review.review_date}</p>}
                          {review.lawyer_name && <p><strong>Lawyer:</strong> {review.lawyer_name}</p>}
                        </div>
                      </div>
                    </div>
                    {!validation?.valid && validation?.errors && (
                      <div className="mt-2 text-sm text-red-600">
                        <strong>Errors:</strong>
                        <ul className="list-disc list-inside">
                          {validation.errors.map((error, i) => (
                            <li key={i}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};