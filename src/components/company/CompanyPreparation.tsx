import { CompanyInfo } from "./CompanyCard";
import { Link } from "react-router-dom";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  CheckCircle, 
  Code, 
  Brain, 
  MessageSquare,
  Layers,
  Target,
  Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CompanyPreparationProps {
  company: CompanyInfo;
  onBack: () => void;
  className?: string;
}

export function CompanyPreparation({ company, onBack, className }: CompanyPreparationProps) {
  const preparationChecklist = [
    { task: "Complete Data Structures basics", done: false },
    { task: "Practice 50+ LeetCode problems", done: false },
    { task: "Study System Design fundamentals", done: false },
    { task: "Review company's leadership principles", done: false },
    { task: "Prepare STAR format answers", done: false },
    { task: "Mock interviews (technical)", done: false },
    { task: "Mock interviews (behavioral)", done: false },
    { task: "Research recent company news", done: false },
  ];

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-muted font-display text-2xl font-bold">
            {company.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">{company.name}</h1>
            <p className="text-muted-foreground">{company.industry} • {company.avgPackage}</p>
          </div>
        </div>
      </div>

      {/* Focus Areas */}
      <div className="rounded-xl border bg-card p-6 shadow-card">
        <h2 className="mb-4 font-display text-lg font-semibold">Interview Focus Areas</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="flex flex-col items-center">
            <ScoreRing score={company.focusAreas.coding} size="lg" showLabel={false} />
            <div className="mt-2 flex items-center gap-2">
              <Code className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Coding</span>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <ScoreRing score={company.focusAreas.aptitude} size="lg" showLabel={false} />
            <div className="mt-2 flex items-center gap-2">
              <Brain className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Aptitude</span>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <ScoreRing score={company.focusAreas.communication} size="lg" showLabel={false} />
            <div className="mt-2 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Communication</span>
            </div>
          </div>
        </div>
      </div>

      {/* Resources / Mock Tests */}
      <div className="rounded-xl border bg-card p-6 shadow-card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Resources & Mock Tests</h2>
          <Link to={`/companies/${company.id}/resources`}>
            <Button variant="outline">Open Mock Tests</Button>
          </Link>
        </div>
        <p className="text-sm text-muted-foreground">Open curated resources, coding mock tests and practice problems tailored for {company.name}.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Required Skills */}
        <div className="rounded-xl border bg-card p-6 shadow-card">
          <div className="mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            <h2 className="font-display text-lg font-semibold">Expected Skills</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {company.expectedSkills.map((skill) => (
              <Badge key={skill} variant="secondary" className="px-3 py-1">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Interview Process */}
        <div className="rounded-xl border bg-card p-6 shadow-card">
          <div className="mb-4 flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            <h2 className="font-display text-lg font-semibold">Interview Rounds</h2>
          </div>
          <div className="space-y-3">
            {company.interviewRounds.map((round, index) => (
              <div key={round} className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {index + 1}
                </div>
                <span className="text-sm">{round}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Preparation Checklist */}
      <div className="rounded-xl border bg-card p-6 shadow-card">
        <div className="mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <h2 className="font-display text-lg font-semibold">Preparation Checklist</h2>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {preparationChecklist.map((item, index) => (
            <label
              key={index}
              className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
            >
              <div className={cn(
                "flex h-5 w-5 items-center justify-center rounded-md border-2",
                item.done ? "bg-success border-success" : "border-muted-foreground/30"
              )}>
                {item.done && <CheckCircle className="h-3 w-3 text-success-foreground" />}
              </div>
              <span className={cn("text-sm", item.done && "line-through text-muted-foreground")}>
                {item.task}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
