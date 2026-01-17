import { useState, useCallback } from "react";
import { Upload, FileText, X, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ResumeUploadProps {
  onFileSelect: (file: File) => void;
  className?: string;
}

export function ResumeUpload({ onFileSelect, className }: ResumeUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type === "application/pdf" || 
        droppedFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
      setFile(droppedFile);
      onFileSelect(droppedFile);
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      onFileSelect(selectedFile);
    }
  }, [onFileSelect]);

  const removeFile = () => {
    setFile(null);
  };

  return (
    <div className={cn("w-full", className)}>
      {!file ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 transition-all duration-300",
            isDragging 
              ? "border-primary bg-primary/5 scale-[1.02]" 
              : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
          )}
        >
          <div className={cn(
            "mb-4 flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300",
            isDragging ? "gradient-primary shadow-glow" : "bg-muted"
          )}>
            <Upload className={cn(
              "h-8 w-8 transition-colors",
              isDragging ? "text-primary-foreground" : "text-muted-foreground"
            )} />
          </div>
          <h3 className="mb-2 font-display text-lg font-semibold">
            {isDragging ? "Drop your resume here" : "Upload your resume"}
          </h3>
          <p className="mb-4 text-sm text-muted-foreground text-center">
            Drag and drop your PDF or DOCX file, or click to browse
          </p>
          <label htmlFor="resume-upload">
            <Button variant="gradient" className="cursor-pointer" asChild>
              <span>Browse Files</span>
            </Button>
          </label>
          <input
            id="resume-upload"
            type="file"
            accept=".pdf,.docx"
            className="hidden"
            onChange={handleFileInput}
          />
          <p className="mt-4 text-xs text-muted-foreground">
            Supported formats: PDF, DOCX (Max 5MB)
          </p>
        </div>
      ) : (
        <div className="flex items-center justify-between rounded-xl border bg-success/5 border-success/20 p-4 animate-scale-in">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-success">
              <FileText className="h-6 w-6 text-success-foreground" />
            </div>
            <div>
              <p className="font-medium">{file.name}</p>
              <p className="text-sm text-muted-foreground">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-success" />
            <Button variant="ghost" size="icon" onClick={removeFile}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
