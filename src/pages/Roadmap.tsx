import { useState } from "react";
import { LearningRoadmap } from "@/components/roadmap/LearningRoadmap";
import { defaultRoadmapSteps } from "@/data/roadmapData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Plus, X } from "lucide-react";

const Roadmap = () => {
  const [steps, setSteps] = useState(defaultRoadmapSteps);
  const [skillGaps, setSkillGaps] = useState([
    "AWS",
    "Docker",
    "System Design",
    "Machine Learning",
    "Kubernetes"
  ]);
  const [newSkill, setNewSkill] = useState("");

  const toggleStepCompletion = (stepId: string) => {
    setSteps(steps.map(step => 
      step.id === stepId ? { ...step, completed: !step.completed } : step
    ));
  };

  const addSkillGap = () => {
    if (newSkill.trim() && !skillGaps.includes(newSkill.trim())) {
      setSkillGaps([...skillGaps, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkillGap = (skill: string) => {
    setSkillGaps(skillGaps.filter(s => s !== skill));
  };

  const resetProgress = () => {
    setSteps(steps.map(step => ({ ...step, completed: false })));
  };

  return (
    <div className="container py-8 px-4">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold">Learning Roadmap</h1>
            <p className="mt-2 text-muted-foreground">
              Your personalized preparation plan based on identified skill gaps.
            </p>
          </div>
          <Button variant="outline" onClick={resetProgress} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Reset Progress
          </Button>
        </div>

        {/* Skill Gap Editor */}
        <div className="mb-8 rounded-xl border bg-card p-6 shadow-card">
          <h2 className="mb-4 font-display text-lg font-semibold">Customize Your Skill Gaps</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {skillGaps.map((skill) => (
              <Badge 
                key={skill} 
                variant="secondary"
                className="gap-1 pr-1"
              >
                {skill}
                <button
                  onClick={() => removeSkillGap(skill)}
                  className="ml-1 rounded-full p-0.5 hover:bg-muted"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Add a skill to focus on..."
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addSkillGap()}
              className="max-w-xs"
            />
            <Button onClick={addSkillGap} size="icon" variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Learning Roadmap */}
        <div onClick={(e) => {
          const target = e.target as HTMLElement;
          // ignore clicks on interactive elements
          if (target.closest('a, button, input, textarea, select')) return;
          const stepElement = target.closest('[data-step-id]');
          if (stepElement) {
            const stepId = stepElement.getAttribute('data-step-id');
            if (stepId) toggleStepCompletion(stepId);
          }
        }}>
          <LearningRoadmap 
            steps={steps.map(s => ({ ...s, id: s.id }))} 
            skillGaps={skillGaps} 
          />
        </div>

        {/* Tips Section */}
        <div className="mt-8 rounded-xl border bg-primary/5 border-primary/20 p-6">
          <h3 className="font-display text-lg font-semibold mb-3">💡 Preparation Tips</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Focus on understanding concepts, not just memorizing solutions</li>
            <li>• Practice explaining your thought process out loud</li>
            <li>• Aim for consistency over intensity - 2 hours daily is better than 10 hours once a week</li>
            <li>• Join study groups or find an accountability partner</li>
            <li>• Review your rejected problems after a few days</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
