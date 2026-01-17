import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { sampleCompanies } from "@/components/company/CompanyCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const CompanyResources = () => {
  const { id } = useParams();
  const company = useMemo(() => sampleCompanies.find((c) => c.id === id), [id]);

  if (!company) {
    return (
      <div className="container py-8 px-4">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-xl border bg-card p-6 text-center">No company resources found.</div>
          <div className="mt-4 text-center">
            <Link to="/companies">
              <Button variant="ghost">Back to Companies</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Simple curated links and mock tests - these can be expanded later
  const resources = [
    { title: "Practice Coding (LeetCode)", url: "https://leetcode.com/" },
    { title: "HackerRank Practice", url: "https://www.hackerrank.com/" },
    { title: "System Design Primer", url: "https://github.com/donnemartin/system-design-primer" },
    { title: "Mock Interview Platform", url: "https://interviewing.io/" },
  ];

  const mockTests = [
    { id: "mock1", title: "Timed Coding Test - 3 Problems (1hr)", link: "/mock-tests/timed-1hr" },
    { id: "mock2", title: "Data Structures Focused Test - 5 Problems (90m)", link: "/mock-tests/ds-90m" },
  ];

  return (
    <div className="container py-8 px-4">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold">{company.name} Resources</h1>
            <p className="text-sm text-muted-foreground">Curated resources, mock tests and study plan tailored for {company.name}.</p>
          </div>
          <div>
            <Link to="/companies">
              <Button variant="ghost">Back</Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <h2 className="font-medium">Recommended External Resources</h2>
            {resources.map((r) => (
              <Card key={r.url} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{r.title}</p>
                    <p className="text-sm text-muted-foreground">External resource</p>
                  </div>
                  <a href={r.url} target="_blank" rel="noreferrer">
                    <Button variant="outline">Open</Button>
                  </a>
                </div>
              </Card>
            ))}
          </div>

          <div className="space-y-4">
            <h2 className="font-medium">Mock Tests (Local)</h2>
            {mockTests.map((m) => (
              <Card key={m.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{m.title}</p>
                    <p className="text-sm text-muted-foreground">Simulated mock test (demo)</p>
                  </div>
                  <Link to={m.link}>
                    <Button variant="outline">Start</Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-xl border bg-card p-6">
          <h3 className="font-medium">Study Plan</h3>
          <ol className="mt-2 list-decimal list-inside text-sm text-muted-foreground">
            <li>Brush up on core data structures and algorithms</li>
            <li>Practice company-specific patterns (system design / distributed systems)</li>
            <li>Take timed mock tests weekly and review solutions</li>
            <li>Prepare behavioral answers using STAR format</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default CompanyResources;
