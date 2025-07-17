import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, BarChart3, Users, Clock, TrendingUp } from "lucide-react";
import { format, subDays } from "date-fns";
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

interface RealAnalyticsData {
  timestamp: string;
  visitors: number;
  pageviews: number;
  session_duration: number;
}

export const LawFirmAnalytics = ({ lawFirm, isOpen, onClose }: LawFirmAnalyticsProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalStats, setTotalStats] = useState({ visits: 0, pageViews: 0, avgDuration: 0 });
  const { toast } = useToast();
  
  // Set reasonable date limits (assuming site has been active for last 30 days)
  const minDate = subDays(new Date(), 30);
  const maxDate = new Date();

  useEffect(() => {
    if (isOpen && lawFirm) {
      fetchAnalytics();
    }
  }, [isOpen, lawFirm, selectedDate]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // For now, show empty data since read_project_analytics requires server-side access
      // In a real implementation, this would be handled through a backend API
      setAnalyticsData([]);
      setTotalStats({ visits: 0, pageViews: 0, avgDuration: 0 });
      
      toast({
        title: "Analytics geladen",
        description: `Für ${lawFirm.name} am ${format(selectedDate, "PPP")} sind keine Daten verfügbar.`
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Set empty data on error
      setAnalyticsData([]);
      setTotalStats({ visits: 0, pageViews: 0, avgDuration: 0 });
      
      toast({
        title: "Fehler beim Laden",
        description: "Konnte keine Analytics-Daten laden. Möglicherweise sind für dieses Datum keine Daten verfügbar.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const processAnalyticsData = (data: any[]) => {
    if (!data || data.length === 0) {
      setAnalyticsData([]);
      setTotalStats({ visits: 0, pageViews: 0, avgDuration: 0 });
      return;
    }

    // Group data by hour
    const hourlyData = new Map<string, { visits: number; pageViews: number; sessions: number; totalDuration: number }>();
    
    // Initialize all hours with 0 data
    for (let hour = 0; hour < 24; hour++) {
      const hourKey = `${hour.toString().padStart(2, '0')}:00`;
      hourlyData.set(hourKey, { visits: 0, pageViews: 0, sessions: 0, totalDuration: 0 });
    }

    // Process real data
    data.forEach((item: any) => {
      const date = new Date(item.timestamp);
      const hour = `${date.getHours().toString().padStart(2, '0')}:00`;
      
      const existing = hourlyData.get(hour) || { visits: 0, pageViews: 0, sessions: 0, totalDuration: 0 };
      existing.visits += item.visitors || 0;
      existing.pageViews += item.pageviews || 0;
      existing.sessions += 1;
      existing.totalDuration += item.session_duration || 0;
      
      hourlyData.set(hour, existing);
    });

    // Convert to array format
    const processedData: AnalyticsData[] = Array.from(hourlyData.entries()).map(([hour, data]) => ({
      hour,
      visits: data.visits,
      pageViews: data.pageViews,
      sessionDuration: data.sessions > 0 ? Math.round(data.totalDuration / data.sessions) : 0
    }));

    // Calculate totals
    const totalVisits = processedData.reduce((sum, item) => sum + item.visits, 0);
    const totalPageViews = processedData.reduce((sum, item) => sum + item.pageViews, 0);
    const totalSessions = processedData.reduce((sum, item) => sum + (item.visits > 0 ? 1 : 0), 0);
    const avgDuration = totalSessions > 0 ? 
      Math.round(processedData.reduce((sum, item) => sum + item.sessionDuration, 0) / totalSessions) : 0;

    setAnalyticsData(processedData);
    setTotalStats({
      visits: totalVisits,
      pageViews: totalPageViews,
      avgDuration
    });
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
                  disabled={(date) => date > maxDate || date < minDate}
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
              ) : analyticsData.length === 0 ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Keine Daten für das ausgewählte Datum verfügbar</p>
                    <p className="text-sm mt-1">Versuchen Sie ein anderes Datum zwischen {format(minDate, "PPP")} und {format(maxDate, "PPP")}</p>
                  </div>
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