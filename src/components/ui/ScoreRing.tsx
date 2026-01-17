import { cn } from "@/lib/utils";

interface ScoreRingProps {
  score: number;
  size?: "sm" | "md" | "lg" | "xl";
  showLabel?: boolean;
  label?: string;
  className?: string;
}

const sizeConfig = {
  sm: { dimension: 60, strokeWidth: 4, fontSize: "text-sm" },
  md: { dimension: 80, strokeWidth: 5, fontSize: "text-lg" },
  lg: { dimension: 120, strokeWidth: 6, fontSize: "text-2xl" },
  xl: { dimension: 160, strokeWidth: 8, fontSize: "text-4xl" },
};

export function ScoreRing({ 
  score, 
  size = "md", 
  showLabel = true, 
  label,
  className 
}: ScoreRingProps) {
  const { dimension, strokeWidth, fontSize } = sizeConfig[size];
  const radius = (dimension - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = (score: number) => {
    if (score >= 75) return "stroke-success";
    if (score >= 50) return "stroke-warning";
    return "stroke-destructive";
  };

  const getScoreGradient = (score: number) => {
    if (score >= 75) return "text-success";
    if (score >= 50) return "text-warning";
    return "text-destructive";
  };

  return (
    <div className={cn("relative inline-flex flex-col items-center", className)}>
      <svg
        width={dimension}
        height={dimension}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/30"
        />
        {/* Score circle */}
        <circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={cn("score-ring transition-all duration-1000", getScoreColor(score))}
          style={{ 
            strokeDashoffset,
            transition: "stroke-dashoffset 1.5s ease-out"
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("font-display font-bold", fontSize, getScoreGradient(score))}>
          {score}
        </span>
        {size !== "sm" && (
          <span className="text-xs text-muted-foreground">/ 100</span>
        )}
      </div>
      {showLabel && label && (
        <span className="mt-2 text-sm font-medium text-muted-foreground">
          {label}
        </span>
      )}
    </div>
  );
}
