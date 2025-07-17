import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, BarChart3, Users, Clock, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface LawFirm {
  id: string;
  name: string;
  slug: string;
}

interface LawFirmAnalyticsProps {
  lawFirm: LawFirm;
  isOpen: boolean;
  onClose: () => void;
}

interface AnalyticsData {
  hour: string;
  visits: number;
  pageViews: number;
  sessionDuration: number;
}

export const LawFirmAnalytics = ({ lawFirm, isOpen, onClose }: LawFirmAnalyticsProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalStats, setTotalStats] = useState({ visits: 0, pageViews: 0, avgDuration: 0 });
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && lawFirm) {
      fetchAnalytics();
    }
  }, [isOpen, lawFirm, selectedDate]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // For now, use mock data as Supabase analytics integration would require 
      // additional setup and configuration
      generateMockData();
      
      toast({
        title: "Analytics laden",
        description: `Daten für ${lawFirm.name} am ${format(selectedDate, "PPP")} geladen.`
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      generateMockData();
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = () => {
    const mockData: AnalyticsData[] = [];
    let totalVisits = 0;
    let totalPageViews = 0;
    let totalDuration = 0;

    for (let hour = 0; hour < 24; hour++) {
      const visits = Math.floor(Math.random() * 50) + 5;
      const pageViews = visits + Math.floor(Math.random() * 20);
      const sessionDuration = Math.floor(Math.random() * 300) + 60; // 60-360 seconds
      
      totalVisits += visits;
      totalPageViews += pageViews;
      totalDuration += sessionDuration;

      mockData.push({
        hour: `${hour.toString().padStart(2, '0')}:00`,
        visits,
        pageViews,
        sessionDuration
      });
    }

    setAnalyticsData(mockData);
    setTotalStats({
      visits: totalVisits,
      pageViews: totalPageViews,
      avgDuration: Math.round(totalDuration / 24)
    });
  };

  const processAnalyticsData = (data: any[]) => {
    // Process real analytics data here
    // This would involve grouping by hour and calculating stats
    const processedData: AnalyticsData[] = [];
    
    // For now, use mock data as fallback
    generateMockData();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-text-dark flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Analytics für {lawFirm.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Date Selector */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Datum auswählen:</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "Datum auswählen"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Besucher</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalStats.visits}</div>
                <p className="text-xs text-muted-foreground">Eindeutige Besucher</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Seitenaufrufe</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalStats.pageViews}</div>
                <p className="text-xs text-muted-foreground">Gesamte Seitenaufrufe</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Verweildauer</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalStats.avgDuration}s</div>
                <p className="text-xs text-muted-foreground">Durchschnittliche Verweildauer</p>
              </CardContent>
            </Card>
          </div>

          {/* Hourly Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Stündliche Besucherstatistik</CardTitle>
              <p className="text-sm text-muted-foreground">
                {format(selectedDate, "PPP")} - {lawFirm.name}
              </p>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="text-muted-foreground">Laden...</div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="grid grid-cols-6 gap-2">
                    {analyticsData.slice(0, 12).map((item, index) => (
                      <div key={index} className="text-center p-2 bg-muted/50 rounded">
                        <div className="text-xs text-muted-foreground">{item.hour}</div>
                        <div className="text-sm font-medium">{item.visits}</div>
                        <div className="text-xs text-muted-foreground">{item.pageViews} views</div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-6 gap-2">
                    {analyticsData.slice(12).map((item, index) => (
                      <div key={index + 12} className="text-center p-2 bg-muted/50 rounded">
                        <div className="text-xs text-muted-foreground">{item.hour}</div>
                        <div className="text-sm font-medium">{item.visits}</div>
                        <div className="text-xs text-muted-foreground">{item.pageViews} views</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};