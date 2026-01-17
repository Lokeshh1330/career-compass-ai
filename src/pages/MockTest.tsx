import { useParams, Link } from "react-router-dom";
import { allProblems } from "@/data/roadmapData";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const MockTest = () => {
  const { id } = useParams();
  const problem = allProblems.find(p => p.id === id);
  const [showSolution, setShowSolution] = useState(false);

  if (!problem) {
    return (
      <div className="container py-8 px-4">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-xl border bg-card p-6 text-center">Mock test not found.</div>
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
          <h1 className="font-display text-2xl font-bold">{problem.title}</h1>
          <p className="text-sm text-muted-foreground">Difficulty: {problem.difficulty} • Time limit: {problem.timeLimitMinutes ?? "N/A"} minutes</p>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-card">
          <h3 className="font-medium mb-2">Problem Statement</h3>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{problem.prompt}</p>

          {problem.sampleInput && (
            <div className="mt-4">
              <h4 className="font-medium">Sample Input</h4>
              <pre className="bg-muted p-3 rounded mt-2 text-sm">{problem.sampleInput}</pre>
            </div>
          )}

          {problem.sampleOutput && (
            <div className="mt-4">
              <h4 className="font-medium">Sample Output</h4>
              <pre className="bg-muted p-3 rounded mt-2 text-sm">{problem.sampleOutput}</pre>
            </div>
          )}

          <div className="mt-6 flex gap-2">
            <Button variant="ghost" asChild>
              <Link to="/roadmap">Back</Link>
            </Button>
            <Button onClick={() => setShowSolution(!showSolution)}>{showSolution ? "Hide Solution" : "Show Solution"}</Button>
          </div>

          {showSolution && (
            <div className="mt-4 rounded-md bg-muted p-4">
              <h4 className="font-medium">Solution Sketch</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{problem.solution || "No solution provided."}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MockTest;
