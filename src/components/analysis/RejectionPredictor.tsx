import { AlertTriangle, Shield, AlertOctagon, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface RejectionPredictorProps {
  riskLevel: "low" | "medium" | "high";
  reasons: string[];
  probability: number;
  className?: string;
}

const riskConfig = {
  low: {
    icon: CheckCircle,
    color: "text-success",
    bgColor: "bg-success/10",
    borderColor: "border-success/30",
    label: "Low Risk",
    description: "Your resume is well-aligned with the job requirements"
  },
  medium: {
    icon: AlertTriangle,
    color: "text-warning",
    bgColor: "bg-warning/10",
    borderColor: "border-warning/30",
    label: "Medium Risk",
    description: "Some gaps exist that may affect your application"
  },
  high: {
    icon: AlertOctagon,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    borderColor: "border-destructive/30",
    label: "High Risk",
    description: "Significant gaps detected - improvements recommended"
  }
};

export function RejectionPredictor({
  riskLevel,
  reasons,
  probability,
  className,
}: RejectionPredictorProps) {
  const config = riskConfig[riskLevel];
  const Icon = config.icon;

  return (
    <div className={cn("rounded-xl border bg-card p-6 shadow-card", className)}>
      <div className="flex items-start gap-4">
        <div className={cn(
          "flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl",
          config.bgColor
        )}>
          <Icon className={cn("h-7 w-7", config.color)} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h3 className="font-display text-xl font-bold">Rejection Risk Analysis</h3>
            <span className={cn(
              "rounded-full px-3 py-1 text-sm font-semibold",
              config.bgColor,
              config.color
            )}>
              {config.label}
            </span>
          </div>
          <p className="mt-1 text-muted-foreground">{config.description}</p>
          
          {/* Probability meter */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Rejection Probability</span>
              <span className={cn("font-semibold", config.color)}>{probability}%</span>
            </div>
            <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-muted">
              <div 
                className={cn(
                  "h-full rounded-full transition-all duration-1000",
                  riskLevel === "low" ? "gradient-success" :
                  riskLevel === "medium" ? "gradient-warning" : "gradient-danger"
                )}
                style={{ width: `${probability}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Reasons */}
      {reasons.length > 0 && (
        <div className="mt-6">
          <h4 className="mb-3 font-semibold">Key Factors Affecting Your Application:</h4>
          <ul className="space-y-2">
            {reasons.map((reason, index) => (
              <li 
                key={index}
                className={cn(
                  "flex items-start gap-3 rounded-lg p-3",
                  config.bgColor,
                  config.borderColor,
                  "border"
                )}
              >
                <span className={cn("mt-0.5 text-lg", config.color)}>•</span>
                <span className="text-sm">{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
