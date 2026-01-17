import { useParams, Link } from "react-router-dom";
import { defaultRoadmapSteps } from "@/data/roadmapData";
import { Button } from "@/components/ui/button";

const RoadmapStep = () => {
  const { id } = useParams();
  const step = defaultRoadmapSteps.find(s => s.id === id);

  if (!step) {
    return (
      <div className="container py-8 px-4">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-xl border bg-card p-6 text-center">Step not found.</div>
          <div className="mt-4 text-center">
            <Link to="/roadmap">
              <Button variant="ghost">Back to Roadmap</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 px-4">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold">{step.title}</h1>
          <p className="text-sm text-muted-foreground">Duration: {step.duration} • Priority: {step.priority}</p>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-card">
          <h3 className="font-medium mb-2">Overview</h3>
          <p className="text-sm text-muted-foreground">{step.description}</p>

          <h3 className="mt-4 font-medium">Resources</h3>
          <ul className="mt-2 list-disc list-inside text-sm">
            {step.resources.map(r => (
              <li key={r}><a href={`https://${r.replace(/\s+/g, '').toLowerCase()}`} target="_blank" rel="noreferrer" className="text-primary hover:underline">{r}</a></li>
            ))}
          </ul>

          {step.problems && step.problems.length > 0 && (
            <div className="mt-6">
              <h3 className="font-medium">Problems & Exercises</h3>
              <div className="mt-3 space-y-3">
                {step.problems.map((p) => (
                  <div key={p.id} className="rounded-md border bg-muted p-3 flex items-center justify-between">
                    <div>
                      <div className="font-medium">{p.title}</div>
                      <div className="text-xs text-muted-foreground">{p.difficulty} • ~{p.timeLimitMinutes ?? "N/A"} min</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link to={`/mock-tests/${p.id}`}>
                        <Button variant="outline" size="sm">Start</Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex gap-2">
            <Link to="/roadmap"><Button variant="ghost">Back</Button></Link>
            <Button variant="secondary">Start Learning</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapStep;
