import { Lightbulb, Code, Briefcase, FileText, Award, ArrowRight, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Suggestion {
  category: string;
  icon?: LucideIcon;
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  action: string;
}

interface ImprovementSuggestionsProps {
  suggestions: Suggestion[];
  className?: string;
}

const priorityConfig = {
  high: {
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    borderColor: "border-destructive/20",
    label: "High Priority"
  },
  medium: {
    color: "text-warning",
    bgColor: "bg-warning/10",
    borderColor: "border-warning/20",
    label: "Medium Priority"
  },
  low: {
    color: "text-success",
    bgColor: "bg-success/10",
    borderColor: "border-success/20",
    label: "Low Priority"
  }
};

const categoryIcons: Record<string, LucideIcon> = {
  Skills: Code,
  Experience: Briefcase,
  Projects: Award,
  Format: FileText,
};

export function ImprovementSuggestions({ suggestions, className }: ImprovementSuggestionsProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
          <Lightbulb className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-display text-lg font-bold">Improvement Suggestions</h3>
          <p className="text-sm text-muted-foreground">Actionable steps to strengthen your resume</p>
        </div>
      </div>

      <div className="space-y-3">
        {suggestions.map((suggestion, index) => {
          const Icon = suggestion.icon || categoryIcons[suggestion.category] || FileText;
          const priority = priorityConfig[suggestion.priority];
          
          return (
            <div 
              key={index}
              className={cn(
                "rounded-xl border bg-card p-5 transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5",
                priority.borderColor
              )}
            >
              <div className="flex items-start gap-4">
                <div className={cn(
                  "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg",
                  priority.bgColor
                )}>
                  <Icon className={cn("h-5 w-5", priority.color)} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{suggestion.title}</h4>
                    <span className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-medium",
                      priority.bgColor,
                      priority.color
                    )}>
                      {priority.label}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {suggestion.description}
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-sm font-medium text-primary">
                    <ArrowRight className="h-4 w-4" />
                    {suggestion.action}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const defaultSuggestions: Suggestion[] = [
  {
    category: "Skills",
    priority: "high",
    title: "Add Missing Technical Skills",
    description: "Your resume is missing key technical skills mentioned in the job description like Python, AWS, and Docker.",
    action: "Add these skills with relevant project examples"
  },
  {
    category: "Experience",
    priority: "medium",
    title: "Quantify Your Achievements",
    description: "Add metrics and numbers to your experience section to demonstrate impact.",
    action: "Include percentages, numbers, and measurable outcomes"
  },
  {
    category: "Format",
    priority: "low",
    title: "Improve Resume Structure",
    description: "Consider using bullet points and consistent formatting for better ATS parsing.",
    action: "Use standard section headings and bullet points"
  },
  {
    category: "Projects",
    priority: "high",
    title: "Highlight Relevant Projects",
    description: "Add projects that demonstrate the required skills for this role.",
    action: "Include project descriptions with technologies used"
  }
];
