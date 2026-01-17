import { CheckCircle, Circle, ArrowRight, BookOpen, Code, Award, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { defaultRoadmapSteps } from "@/data/roadmapData";
import { Link } from "react-router-dom";

interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  duration: string;
  priority: "critical" | "high" | "medium";
  resources: string[];
  completed: boolean;
}

interface LearningRoadmapProps {
  steps: RoadmapStep[];
  skillGaps: string[];
  className?: string;
}

const priorityConfig = {
  critical: {
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    borderColor: "border-l-destructive",
    label: "Critical"
  },
  high: {
    color: "text-warning",
    bgColor: "bg-warning/10",
    borderColor: "border-l-warning",
    label: "High"
  },
  medium: {
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-l-primary",
    label: "Medium"
  }
};

export function LearningRoadmap({ steps, skillGaps, className }: LearningRoadmapProps) {
  const completedCount = steps.filter(s => s.completed).length;
  const progress = (completedCount / steps.length) * 100;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Progress Overview */}
      <div className="rounded-xl border bg-card p-6 shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-bold">Your Learning Journey</h2>
            <p className="text-muted-foreground">
              {completedCount} of {steps.length} steps completed
            </p>
          </div>
          <div className="text-right">
            <span className="font-display text-3xl font-bold text-primary">{Math.round(progress)}%</span>
            <p className="text-sm text-muted-foreground">Progress</p>
          </div>
        </div>
        <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-muted">
          <div 
            className="h-full rounded-full gradient-primary transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Skill Gaps Summary */}
      {skillGaps.length > 0 && (
        <div className="rounded-xl border border-warning/30 bg-warning/5 p-5">
          <h3 className="mb-3 font-semibold flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-warning" />
            Skills to Develop
          </h3>
          <div className="flex flex-wrap gap-2">
            {skillGaps.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-warning/20 px-3 py-1 text-sm font-medium text-warning"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Roadmap Steps */}
      <div className="space-y-4">
        {steps.map((step, index) => {
          const priority = priorityConfig[step.priority];
          
          return (
            <div
              key={step.id}
              data-step-id={step.id}
              className={cn(
                "relative rounded-xl border-l-4 bg-card p-5 shadow-card transition-all duration-300 hover:shadow-card-hover",
                priority.borderColor,
                step.completed && "opacity-60"
              )}
            >
              <div className="flex items-start gap-4">
                <div className={cn(
                  "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2",
                  step.completed 
                    ? "bg-success border-success" 
                    : "border-muted-foreground/30"
                )}>
                  {step.completed ? (
                    <CheckCircle className="h-5 w-5 text-success-foreground" />
                  ) : (
                    <span className="font-display font-bold text-muted-foreground">
                      {index + 1}
                    </span>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className={cn(
                      "font-display text-lg font-semibold",
                      step.completed && "line-through"
                    )}>
                      {step.title}
                    </h3>
                    <span className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-medium",
                      priority.bgColor,
                      priority.color
                    )}>
                      {priority.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ~{step.duration}
                    </span>
                  </div>
                  
                  <p className="mt-2 text-sm text-muted-foreground">
                    {step.description}
                  </p>
                  
                  {step.resources.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {step.resources.map((resource) => (
                        <span
                          key={resource}
                          className="rounded-md bg-muted px-2 py-1 text-xs"
                        >
                          {resource}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-3 flex items-center gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link to={`/roadmap/steps/${step.id}`}>Open</Link>
                    </Button>
                    <Button size="sm" variant={step.completed ? "ghost" : "secondary"} onClick={() => { /* no-op here */ }}>
                      {step.completed ? "Completed" : "Mark"}
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="absolute -bottom-4 left-[27px] h-4 w-0.5 bg-border" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// defaultRoadmapSteps now provided from @/data/roadmapData
