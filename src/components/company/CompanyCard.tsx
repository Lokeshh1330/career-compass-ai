import { Building2, Users, Code, BookOpen, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface CompanyInfo {
  id: string;
  name: string;
  logo?: string;
  industry: string;
  expectedSkills: string[];
  interviewRounds: string[];
  focusAreas: {
    coding: number;
    aptitude: number;
    communication: number;
  };
  difficulty: "Easy" | "Medium" | "Hard";
  avgPackage: string;
}

interface CompanyCardProps {
  company: CompanyInfo;
  onClick?: () => void;
  className?: string;
}

export function CompanyCard({ company, onClick, className }: CompanyCardProps) {
  const difficultyColors = {
    Easy: "bg-success/10 text-success",
    Medium: "bg-warning/10 text-warning",
    Hard: "bg-destructive/10 text-destructive"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 180, damping: 14 }}
      className={cn(
        "group rounded-xl border bg-card p-6 transition-all duration-300 cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted font-display text-xl font-bold">
            {company.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h3 className="font-display text-lg font-bold">{company.name}</h3>
            <p className="text-sm text-muted-foreground">{company.industry}</p>
          </div>
        </div>
        <Badge className={difficultyColors[company.difficulty]}>
          {company.difficulty}
        </Badge>
      </div>

      <div className="mt-4 space-y-3">
        {/* Focus Areas */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1">
              <Code className="h-3 w-3" /> Coding
            </span>
            <span className="font-medium">{company.focusAreas.coding}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div 
              className="h-full rounded-full gradient-primary"
              style={{ width: `${company.focusAreas.coding}%` }}
            />
          </div>
        </div>

        {/* Expected Skills */}
        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground">Top Skills Required</p>
          <div className="flex flex-wrap gap-1.5">
            {company.expectedSkills.slice(0, 4).map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {company.expectedSkills.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{company.expectedSkills.length - 4}
              </Badge>
            )}
          </div>
        </div>

        {/* Interview Rounds */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Interview Rounds</span>
          <span className="font-medium">{company.interviewRounds.length}</span>
        </div>
      </div>

      <Button 
        variant="ghost" 
        className="mt-4 w-full justify-between group-hover:bg-primary/5"
        onClick={(e) => { e.stopPropagation(); onClick?.(); }}
      >
        View Preparation Guide
        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Button>
    </motion.div>
  );
}

export const sampleCompanies: CompanyInfo[] = [
  {
    id: "microsoft",
    name: "Microsoft",
    industry: "Technology",
    expectedSkills: ["C++", "Python", "System Design", "Data Structures", "Algorithms", "Cloud Computing"],
    interviewRounds: ["Online Assessment", "Technical Round 1", "Technical Round 2", "HR Round"],
    focusAreas: { coding: 70, aptitude: 20, communication: 10 },
    difficulty: "Hard",
    avgPackage: "₹40-50 LPA"
  },
  {
    id: "amazon",
    name: "Amazon",
    industry: "E-commerce / Cloud",
    expectedSkills: ["Java", "Python", "AWS", "Distributed Systems", "Leadership Principles"],
    interviewRounds: ["Online Assessment", "Phone Screen", "Onsite (4-5 rounds)", "Bar Raiser"],
    focusAreas: { coding: 60, aptitude: 15, communication: 25 },
    difficulty: "Hard",
    avgPackage: "₹35-45 LPA"
  },
  {
    id: "tcs",
    name: "TCS",
    industry: "IT Services",
    expectedSkills: ["Java", "SQL", "Python", "Communication", "Aptitude"],
    interviewRounds: ["TCS NQT", "Technical Interview", "HR Interview"],
    focusAreas: { coding: 40, aptitude: 40, communication: 20 },
    difficulty: "Easy",
    avgPackage: "₹3.5-7 LPA"
  },
  {
    id: "infosys",
    name: "Infosys",
    industry: "IT Services",
    expectedSkills: ["Java", "C", "SQL", "Problem Solving", "Communication"],
    interviewRounds: ["InfyTQ", "Technical Interview", "HR Interview"],
    focusAreas: { coding: 35, aptitude: 45, communication: 20 },
    difficulty: "Easy",
    avgPackage: "₹3.6-8 LPA"
  },
  {
    id: "google",
    name: "Google",
    industry: "Technology",
    expectedSkills: ["Python", "C++", "Algorithms", "System Design", "Machine Learning"],
    interviewRounds: ["Phone Screen", "Onsite (4-5 rounds)", "Team Match"],
    focusAreas: { coding: 75, aptitude: 15, communication: 10 },
    difficulty: "Hard",
    avgPackage: "₹45-60 LPA"
  },
  {
    id: "wipro",
    name: "Wipro",
    industry: "IT Services",
    expectedSkills: ["Java", "Python", "SQL", "Communication", "Teamwork"],
    interviewRounds: ["NLTH Test", "Technical Interview", "HR Interview"],
    focusAreas: { coding: 35, aptitude: 40, communication: 25 },
    difficulty: "Easy",
    avgPackage: "₹3.5-6 LPA"
  }
];
