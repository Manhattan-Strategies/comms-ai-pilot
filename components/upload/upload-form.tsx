"use client";

import { z } from "zod";
import UploadFormInput from "./upload-form-input";
import { useUploadThing } from "@/utils/uploadthing";
import { toast } from "sonner";
import { generatePdfSummary } from "@/actions/upload-actions";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SummaryDisplay } from "./summary-display";

// Add this interface for the result
interface SummaryResult {
  success: boolean;
  message: string;
  data: {
    summary: string;
    title?: string;
  } | null;
}

//schema with zod
const schema = z.object({
  file: z
    .instanceof(File, { message: "Invalid file" })
    .refine(
      (file) => file.size <= 20 * 1024 * 1024,
      "File size must be less than 20MB"
    )
    .refine(
      (file) => file.type.startsWith("application/pdf"),
      "File must be a PDF"
    ),
});

export default function UploadForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  // Add state for storing the result
  const [summaryResult, setSummaryResult] = useState<SummaryResult | null>(
    null
  );
  const router = useRouter();

  const { startUpload, routeConfig } = useUploadThing("pdfUploader", {
    onClientUploadComplete: () => {
      console.log("uploaded successfully!");
    },
    onUploadError: (err) => {
      console.log("error occurred while uploading", err);
      toast(" Error occurred while uploading", {
        description: err.message,
      });
    },
    onUploadBegin: (data) => {
      console.log("upload has begun for", data);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setSummaryResult(null);
      console.log("Starting upload process...");

      const formData = new FormData(e.currentTarget);
      const file = formData.get("file") as File;
      console.log("File selected:", file.name, "Size:", file.size);

      // ... rest of validation code ...

      console.log("Starting file upload to UploadThing...");
      const uploadResponse = await startUpload([file]);
      console.log("UploadThing response:", uploadResponse);

      if (!uploadResponse || !uploadResponse[0]) {
        console.error("UploadThing returned empty response");
        toast("Upload failed", {
          description: "Please use a different file",
          style: { color: "red" },
        });
        setIsLoading(false);
        return;
      }

      const uploadFileUrl = uploadResponse[0].serverData.fileUrl;
      console.log("File uploaded successfully. URL:", uploadFileUrl);

      console.log("Calling generatePdfSummary...");
      const result = await generatePdfSummary({
        fileUrl: uploadFileUrl,
        fileName: file.name,
      });

      console.log("generatePdfSummary result:", result);

      // Store the result in state
      setSummaryResult(result);

      if (result.success && result.data) {
        toast("✨ Summary Generated!", {
          description: "Your summary has been successfully generated!",
        });
        formRef.current?.reset();
      } else {
        console.error("generatePdfSummary failed:", result.message);
        toast("❌ Failed to generate summary", {
          description: result.message || "Something went wrong",
          style: { color: "red" },
        });
      }
    } catch (error) {
      console.error("Unexpected error in handleSubmit:", error);
      setIsLoading(false);
      formRef.current?.reset();

      toast("❌ Unexpected Error", {
        description: "An unexpected error occurred. Please try again.",
        style: { color: "red" },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-200 dark:border-gray-800" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-3 text-muted-foreground text-sm">
            Upload PDF
          </span>
        </div>
      </div>

      <UploadFormInput
        isLoading={isLoading}
        ref={formRef}
        onSubmit={handleSubmit}
      />

      {/* Display the summary result */}
      {summaryResult && summaryResult.data && (
        <SummaryDisplay
          title={summaryResult.data.title}
          summary={summaryResult.data.summary}
          message={summaryResult.message}
        />
      )}

      {/* Show error if summary generation failed */}
      {summaryResult && !summaryResult.data && (
        <div className="mt-8 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
          <p className="text-red-600 dark:text-red-400 font-medium">
            ❌ Failed to generate summary
          </p>
          <p className="text-red-500 dark:text-red-300 text-sm mt-1">
            {summaryResult.message}
          </p>
        </div>
      )}

      {isLoading && (
        <>
          <div className="relative">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-gray-200 dark:border-gray-800" />
            </div>

            <div className="relative flex justify-center">
              <span className="bg-background px-3 text-muted-foreground text-sm">
                Processing
              </span>
            </div>
          </div>

          {/* You can add a loading skeleton here */}
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6"></div>
          </div>
        </>
      )}
    </div>
  );
}
