import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, FileText, Calendar, TrendingUp, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Analysis {
  id: string;
  resume_filename: string;
  company_name: string | null;
  compatibility_score: number;
  risk_level: string;
  created_at: string;
  matched_keywords: string[];
  missing_keywords: string[];
}

const History = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchAnalyses();
    }
  }, [user]);

  const fetchAnalyses = async () => {
    try {
      const { data, error } = await supabase
        .from("analyses")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAnalyses(data || []);
    } catch (error) {
      console.error("Error fetching analyses:", error);
      toast({
        title: "Error",
        description: "Failed to load analysis history.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      const { error } = await supabase
        .from("analyses")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setAnalyses(analyses.filter((a) => a.id !== id));
      toast({
        title: "Deleted",
        description: "Analysis removed from history.",
      });
    } catch (error) {
      console.error("Error deleting analysis:", error);
      toast({
        title: "Error",
        description: "Failed to delete analysis.",
        variant: "destructive",
      });
    } finally {
      setDeleting(null);
    }
  };

  const getScoreStats = () => {
    if (analyses.length === 0) return null;
    const scores = analyses.map((a) => a.compatibility_score);
    const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    const best = Math.max(...scores);
    const latest = scores[0];
    return { avg, best, latest };
  };

  const stats = getScoreStats();

  if (authLoading || loading) {
    return (
      <div className="container py-20 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-8 px-4">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold">Analysis History</h1>
          <p className="mt-2 text-muted-foreground">
            Track your resume improvements over time.
          </p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border bg-card p-5 shadow-card">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Average Score</p>
                  <p className="font-display text-2xl font-bold">{stats.avg}%</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border bg-success/5 border-success/20 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-success">
                  <TrendingUp className="h-5 w-5 text-success-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Best Score</p>
                  <p className="font-display text-2xl font-bold text-success">{stats.best}%</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border bg-card p-5 shadow-card">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Analyses</p>
                  <p className="font-display text-2xl font-bold">{analyses.length}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analysis List */}
        {analyses.length === 0 ? (
          <div className="rounded-xl border bg-card p-12 text-center shadow-card">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 font-display text-lg font-semibold">No analyses yet</h3>
            <p className="mt-2 text-muted-foreground">
              Start by analyzing your resume to see your history here.
            </p>
            <Button 
              variant="gradient" 
              className="mt-6"
              onClick={() => navigate("/analyze")}
            >
              Analyze Resume
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {analyses.map((analysis) => (
              <div
                key={analysis.id}
                className="group rounded-xl border bg-card p-5 shadow-card transition-all hover:shadow-card-hover"
              >
                <div className="flex items-center gap-4">
                  <ScoreRing score={analysis.compatibility_score} size="sm" showLabel={false} />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold truncate">{analysis.resume_filename}</h3>
                      {analysis.company_name && (
                        <Badge variant="secondary">{analysis.company_name}</Badge>
                      )}
                      <Badge 
                        className={cn(
                          analysis.risk_level === "low" && "bg-success/20 text-success",
                          analysis.risk_level === "medium" && "bg-warning/20 text-warning",
                          analysis.risk_level === "high" && "bg-destructive/20 text-destructive"
                        )}
                      >
                        {analysis.risk_level} risk
                      </Badge>
                    </div>
                    <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(analysis.created_at).toLocaleDateString()}
                      </span>
                      <span>{analysis.matched_keywords.length} matched keywords</span>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDelete(analysis.id)}
                    disabled={deleting === analysis.id}
                  >
                    {deleting === analysis.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4 text-destructive" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
