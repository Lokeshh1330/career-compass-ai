import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Building2, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const sampleJobs = [
  { 
    company: "Microsoft", 
    role: "Software Engineer",
    description: "We are looking for a Software Engineer to join our team. Requirements: 3+ years experience in software development, proficiency in Python, Java, or C++, experience with cloud platforms (Azure preferred), strong problem-solving skills, knowledge of data structures and algorithms, excellent communication skills, Bachelor's degree in Computer Science or related field."
  },
  { 
    company: "Amazon", 
    role: "SDE-1",
    description: "Amazon is hiring SDE-1 candidates. Requirements: Bachelor's degree in Computer Science, strong coding skills in Java/Python/C++, understanding of OOP concepts, familiarity with databases and SQL, knowledge of distributed systems, ability to write clean and maintainable code, experience with version control systems like Git."
  },
  { 
    company: "TCS", 
    role: "System Engineer",
    description: "TCS is hiring System Engineers. Requirements: Bachelor's degree in Engineering, good analytical and problem-solving skills, knowledge of programming languages, understanding of SDLC, willingness to work in shifts, good communication skills, ability to work in a team environment."
  },
  { 
    company: "Infosys", 
    role: "Associate Software Engineer",
    description: "Infosys is looking for Associate Software Engineers. Requirements: BE/BTech in any stream, strong aptitude and logical reasoning, basic programming knowledge, good communication skills, willingness to learn new technologies, ability to work in diverse teams, flexible with locations."
  },
];

interface JobDescriptionInputProps {
  onJobDescriptionChange: (description: string, company?: string) => void;
  className?: string;
}

export function JobDescriptionInput({ onJobDescriptionChange, className }: JobDescriptionInputProps) {
  const [description, setDescription] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [showSamples, setShowSamples] = useState(false);

  const handleSampleSelect = (job: typeof sampleJobs[0]) => {
    setDescription(job.description);
    setSelectedCompany(job.company);
    onJobDescriptionChange(job.description, job.company);
    setShowSamples(false);
  };

  const handleCustomInput = (value: string) => {
    setDescription(value);
    setSelectedCompany(null);
    onJobDescriptionChange(value);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold">Job Description</h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setShowSamples(!showSamples)}
          className="gap-2"
        >
          <Building2 className="h-4 w-4" />
          Sample Companies
          <ChevronDown className={cn("h-4 w-4 transition-transform", showSamples && "rotate-180")} />
        </Button>
      </div>

      {showSamples && (
        <div className="grid gap-2 sm:grid-cols-2 animate-slide-in-up">
          {sampleJobs.map((job) => (
            <button
              key={job.company}
              onClick={() => handleSampleSelect(job)}
              className={cn(
                "flex items-center gap-3 rounded-lg border p-3 text-left transition-all hover:bg-muted/50",
                selectedCompany === job.company && "border-primary bg-primary/5"
              )}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted font-display font-bold text-sm">
                {job.company.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="font-medium">{job.company}</p>
                <p className="text-sm text-muted-foreground">{job.role}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      <div className="space-y-2">
        <Textarea
          placeholder="Paste the job description here, or select a sample company above..."
          value={description}
          onChange={(e) => handleCustomInput(e.target.value)}
          className="min-h-[200px] resize-none"
        />
        <p className="text-xs text-muted-foreground">
          Paste the complete job description including requirements, responsibilities, and qualifications.
        </p>
      </div>
    </div>
  );
}
