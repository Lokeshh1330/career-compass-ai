import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
  variant?: "default" | "primary" | "success" | "warning" | "danger";
  onClick?: () => void;
}

const variantStyles = {
  default: "bg-card hover:shadow-card-hover",
  primary: "bg-primary/5 border-primary/20 hover:bg-primary/10",
  success: "bg-success/5 border-success/20 hover:bg-success/10",
  warning: "bg-warning/5 border-warning/20 hover:bg-warning/10",
  danger: "bg-destructive/5 border-destructive/20 hover:bg-destructive/10",
};

const iconStyles = {
  default: "bg-muted text-foreground",
  primary: "gradient-primary text-primary-foreground",
  success: "gradient-success text-success-foreground",
  warning: "gradient-warning text-warning-foreground",
  danger: "gradient-danger text-destructive-foreground",
};

export function FeatureCard({ 
  icon: Icon, 
  title, 
  description, 
  className,
  variant = "default",
  onClick
}: FeatureCardProps) {
  return (
    <div 
      className={cn(
        "group relative rounded-xl border p-6 transition-all duration-300 cursor-pointer",
        "hover:-translate-y-1",
        variantStyles[variant],
        className
      )}
      onClick={onClick}
    >
      <div className={cn(
        "mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl shadow-md transition-transform group-hover:scale-110",
        iconStyles[variant]
      )}>
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mb-2 font-display text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
