import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import workerSrc from "pdfjs-dist/build/pdf.worker.mjs?url";

(GlobalWorkerOptions as any).workerSrc = workerSrc;

const DOCX_MIME = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export type ResumeExtractMeta = {
  charCount: number;
  wordCount: number;
  source: "txt" | "pdf" | "docx";
  pages?: number;
};

export async function extractResumeText(file: File): Promise<{ text: string; meta: ResumeExtractMeta }> {
  if (file.type === "text/plain") {
    const text = (await file.text()).trim();
    return { text, meta: buildMeta(text, "txt") };
  }

  if (file.type === "application/pdf") {
    const { text, pages } = await extractPdfText(file);
    if (!text || text.trim().length < 50) {
      throw new Error(
        "We couldn't extract readable text from this PDF (it may be scanned). Please upload a text-based PDF or a .txt file."
      );
    }
    const clean = text.trim();
    return { text: clean, meta: buildMeta(clean, "pdf", pages) };
  }

  if (file.type === DOCX_MIME) {
    const text = await extractDocxText(file);
    if (!text || text.trim().length < 50) {
      throw new Error("We couldn't extract enough text from this DOCX. Please try saving as .txt.");
    }
    const clean = text.trim();
    return { text: clean, meta: buildMeta(clean, "docx") };
  }

  throw new Error("Unsupported file type. Please upload PDF, DOCX, or TXT.");
}

function buildMeta(text: string, source: ResumeExtractMeta["source"], pages?: number): ResumeExtractMeta {
  const wordCount = text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;
  return {
    charCount: text.length,
    wordCount,
    source,
    ...(pages ? { pages } : {}),
  };
}

async function extractPdfText(file: File): Promise<{ text: string; pages: number }> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await getDocument({ data: arrayBuffer }).promise;

  const parts: string[] = [];
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const pageText = (content.items as any[])
      .map((it) => (typeof it?.str === "string" ? it.str : ""))
      .filter(Boolean)
      .join(" ");
    parts.push(pageText);
  }

  const text = parts.join("\n\n");
  return { text, pages: pdf.numPages };
}

async function extractDocxText(file: File): Promise<string> {
  const mammothModule: any = await import("mammoth");
  const mammoth = mammothModule?.default ?? mammothModule;
  const arrayBuffer = await file.arrayBuffer();
  const res = await mammoth.extractRawText({ arrayBuffer });
  return res?.value ?? "";
}
