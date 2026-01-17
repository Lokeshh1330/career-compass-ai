import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/StatCard";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { 
  FileText, 
  BarChart3, 
  Building2, 
  GraduationCap,
  Upload,
  Target,
  TrendingUp,
  Shield,
  Zap,
  ArrowRight
} from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-hero py-20 lg:py-28">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="container relative px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white/80 backdrop-blur-sm">
              <Zap className="h-4 w-4" />
              AI-Powered Placement Readiness
            </div>
            <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Land Your Dream Job with{" "}
              <span className="text-gradient bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                CareerReady-AI
              </span>
            </h1>
            <p className="mt-6 text-lg text-white/70 sm:text-xl max-w-2xl mx-auto">
              Understand why resumes get rejected, how ATS systems work, and prepare strategically for your target companies.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/analyze">
                <Button size="xl" variant="gradient" className="gap-2 w-full sm:w-auto">
                  <Upload className="h-5 w-5" />
                  Analyze Your Resume
                </Button>
              </Link>
              <Link to="/companies">
                <Button size="xl" variant="outline" className="gap-2 w-full sm:w-auto bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <Building2 className="h-5 w-5" />
                  Explore Companies
                </Button>
              </Link>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute -bottom-1 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Stats Section */}
      <section className="container -mt-10 relative z-10 px-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={FileText}
            label="Resumes Analyzed"
            value="10,000+"
            trend={{ value: 23, isPositive: true }}
          />
          <StatCard
            icon={Target}
            label="Avg. Score Improvement"
            value="32%"
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard
            icon={Building2}
            label="Companies Covered"
            value="50+"
          />
          <StatCard
            icon={GraduationCap}
            label="Students Placed"
            value="2,500+"
            trend={{ value: 15, isPositive: true }}
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-20 px-4">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            Everything You Need to{" "}
            <span className="text-gradient">Succeed</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Our AI-powered platform helps you understand the gap between your resume and your dream job.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Link to="/analyze">
            <FeatureCard
              icon={BarChart3}
              title="ATS Compatibility Score"
              description="Get a detailed compatibility score showing how well your resume matches the job description."
              variant="primary"
            />
          </Link>
          <Link to="/analyze">
            <FeatureCard
              icon={Shield}
              title="Rejection Risk Predictor"
              description="Understand why your resume might get rejected before you apply, with actionable insights."
              variant="warning"
            />
          </Link>
          <Link to="/analyze">
            <FeatureCard
              icon={TrendingUp}
              title="Improvement Suggestions"
              description="Get personalized recommendations to strengthen your resume for specific roles."
              variant="success"
            />
          </Link>
          <Link to="/companies">
            <FeatureCard
              icon={Building2}
              title="Company Preparation"
              description="Access company-specific interview guides with expected skills and round details."
              variant="primary"
            />
          </Link>
          <Link to="/roadmap">
            <FeatureCard
              icon={GraduationCap}
              title="Learning Roadmap"
              description="Follow a personalized study plan based on your skill gaps and target companies."
              variant="success"
            />
          </Link>
          <FeatureCard
            icon={FileText}
            title="Resume Parser"
            description="Our NLP engine extracts and analyzes every section of your resume automatically."
            variant="default"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="container pb-20 px-4">
        <div className="rounded-2xl gradient-primary p-8 md:p-12 text-center shadow-glow">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-white">
            Ready to Boost Your Placement Chances?
          </h2>
          <p className="mt-4 text-white/80 max-w-xl mx-auto">
            Join thousands of students who improved their resumes and landed their dream jobs.
          </p>
          <Link to="/analyze">
            <Button size="lg" variant="secondary" className="mt-8 gap-2">
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="container pb-12 px-4">
        <div className="rounded-xl border bg-muted/30 p-6 text-center">
          <p className="text-sm text-muted-foreground">
            <strong>Educational Purpose:</strong> This system simulates ATS-like logic for learning purposes. 
            It does not replicate real company hiring systems and does not guarantee job placement.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Index;
