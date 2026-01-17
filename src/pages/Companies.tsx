import { useState } from "react";
import { CompanyCard, sampleCompanies, CompanyInfo } from "@/components/company/CompanyCard";
import { CompanyPreparation } from "@/components/company/CompanyPreparation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";

const Companies = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<CompanyInfo | null>(null);
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");

  const filteredCompanies = sampleCompanies.filter((company) => {
    const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.industry.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = difficultyFilter === "all" || company.difficulty === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  if (selectedCompany) {
    return (
      <div className="container py-8 px-4">
        <div className="mx-auto max-w-4xl">
          <CompanyPreparation 
            company={selectedCompany} 
            onBack={() => setSelectedCompany(null)} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 px-4">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold">Company Preparation</h1>
          <p className="mt-2 text-muted-foreground">
            Select a company to view interview preparation guides, expected skills, and process details.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <div className="flex gap-2">
              {["all", "Easy", "Medium", "Hard"].map((filter) => (
                <Button
                  key={filter}
                  variant={difficultyFilter === filter ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDifficultyFilter(filter)}
                >
                  {filter === "all" ? "All" : filter}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Company Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCompanies.map((company) => (
            <CompanyCard
              key={company.id}
              company={company}
              onClick={() => setSelectedCompany(company)}
            />
          ))}
        </div>

        {filteredCompanies.length === 0 && (
          <div className="rounded-xl border bg-card p-12 text-center">
            <p className="text-muted-foreground">No companies found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Companies;
