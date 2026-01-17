import { ScoreRing } from "@/components/ui/ScoreRing";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface CompatibilityScoreProps {
  score: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  sectionScores: {
    name: string;
    score: number;
  }[];
  className?: string;
}

export function CompatibilityScore({
  score,
  matchedKeywords,
  missingKeywords,
  sectionScores,
  className,
}: CompatibilityScoreProps) {
  const getScoreLabel = (score: number) => {
    if (score >= 75) return { text: "Excellent Match", color: "text-success" };
    if (score >= 50) return { text: "Moderate Match", color: "text-warning" };
    return { text: "Needs Improvement", color: "text-destructive" };
  };

  const label = getScoreLabel(score);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Main Score */}
      <div className="flex flex-col items-center rounded-2xl border bg-card p-8 shadow-card">
        <ScoreRing score={score} size="xl" showLabel={false} />
        <h2 className={cn("mt-4 font-display text-2xl font-bold", label.color)}>
          {label.text}
        </h2>
        <p className="mt-2 text-center text-muted-foreground">
          Your resume has a {score}% compatibility with this job description
        </p>
      </div>

      {/* Section Breakdown */}
      <div className="rounded-xl border bg-card p-6 shadow-card">
        <h3 className="mb-4 font-display text-lg font-semibold">Section Analysis</h3>
        <div className="space-y-4">
          {sectionScores.map((section) => (
            <div key={section.name} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{section.name}</span>
                <span className={cn(
                  "font-semibold",
                  section.score >= 75 ? "text-success" :
                  section.score >= 50 ? "text-warning" : "text-destructive"
                )}>
                  {section.score}%
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div 
                  className={cn(
                    "h-full rounded-full transition-all duration-1000",
                    section.score >= 75 ? "gradient-success" :
                    section.score >= 50 ? "gradient-warning" : "gradient-danger"
                  )}
                  style={{ width: `${section.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Keywords */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Matched Keywords */}
        <div className="rounded-xl border border-success/20 bg-success/5 p-5">
          <div className="mb-3 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-success" />
            <h4 className="font-semibold">Matched Keywords</h4>
            <Badge variant="secondary" className="ml-auto">{matchedKeywords.length}</Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            {matchedKeywords.map((keyword) => (
              <Badge key={keyword} className="bg-success/20 text-success hover:bg-success/30">
                {keyword}
              </Badge>
            ))}
          </div>
        </div>

        {/* Missing Keywords */}
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-5">
          <div className="mb-3 flex items-center gap-2">
            <XCircle className="h-5 w-5 text-destructive" />
            <h4 className="font-semibold">Missing Keywords</h4>
            <Badge variant="secondary" className="ml-auto">{missingKeywords.length}</Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            {missingKeywords.map((keyword) => (
              <Badge key={keyword} variant="destructive" className="bg-destructive/20 text-destructive hover:bg-destructive/30">
                {keyword}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
