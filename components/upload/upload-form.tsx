// components/upload/upload-form.tsx
"use client";

import { z } from "zod";
import UploadFormInput from "./upload-form-input";
import { useUploadThing } from "@/utils/uploadthing";
import { toast } from "sonner";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PostsDisplay } from "./posts-display";
import FilterControls from "@/components/upload/filter-control";
import type { FilterState } from "@/types/filters";

// Schema with zod
const schema = z.object({
  file: z
    .instanceof(File, { message: "Invalid file" })
    .refine(
      (file) => file.size <= 32 * 1024 * 1024,
      "File size must be less than 32MB"
    )
    .refine(
      (file) => file.type.startsWith("application/pdf"),
      "File must be a PDF"
    ),
});

export default function UploadForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const router = useRouter();

  // Add filter state
  const [filters, setFilters] = useState<FilterState>({
    executive: "ceo",
    department: "engineering",
    voice: ["clear", "confident", "pragmatic"],
    audience: ["peers", "operators", "partners"],
    platform: "linkedin",
  });

  const { startUpload, routeConfig } = useUploadThing("pdfUploader", {
    onClientUploadComplete: (data) => {
      console.log("uploaded successfully!", data);

      if (data && data[0]?.serverData) {
        setResult(data[0].serverData);

        toast("✨ Posts Generated!", {
          description: "5 social media posts have been successfully generated!",
        });
      }
    },
    onUploadError: (err) => {
      console.log("error occurred while uploading", err);
      toast("Error occurred while uploading", {
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
      setResult(null);
      console.log("Starting upload process...");

      const formData = new FormData(e.currentTarget);
      const file = formData.get("file") as File;
      console.log("File selected:", file.name, "Size:", file.size);

      // Validation
      const validationResult = schema.safeParse({ file });
      if (!validationResult.success) {
        const error = validationResult.error.errors[0];
        toast("Invalid file", {
          description: error.message,
          style: { color: "blue" },
        });
        setIsLoading(false);
        return;
      }

      console.log("Starting file upload to UploadThing...");
      // Pass filters as input
      const uploadResponse = await startUpload([file], { filters });
      console.log("UploadThing response:", uploadResponse);

      if (!uploadResponse || !uploadResponse[0]) {
        console.error("UploadThing returned empty response");
        toast("Upload failed", {
          description: "Please try again",
          style: { color: "red" },
        });
        setIsLoading(false);
        return;
      }

      formRef.current?.reset();
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
    <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl mx-auto">
      {/* Left column - Upload form */}
      <div className="lg:w-2/3">
        <div className="relative">
          <div
            className="absolute inset-0 flex items-center"
            aria-hidden="true"
          >
            <div className="w-full border-t border-gray-200 dark:border-gray-800" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-transparent px-3 text-muted-foreground text-sm">
              Upload PDF
            </span>
          </div>
        </div>

        <div className="mt-8">
          <UploadFormInput
            isLoading={isLoading}
            ref={formRef}
            onSubmit={handleSubmit}
          />
        </div>

        {/* Display the generated posts */}
        {result && result.posts && (
          <div className="mt-8">
            <PostsDisplay
              posts={result.posts}
              filters={result.filters}
              fileName={result.fileName}
            />
          </div>
        )}

        {/* Show error if posts generation failed */}
        {result && result.error && (
          <div className="mt-8 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <p className="text-red-600 dark:text-red-400 font-medium">
              ❌ Failed to generate posts
            </p>
            <p className="text-red-500 dark:text-red-300 text-sm mt-1">
              {result.error}
            </p>
          </div>
        )}

        {isLoading && (
          <div className="mt-8">
            <div className="relative">
              <div
                className="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div className="w-full border-t border-gray-200 dark:border-gray-800" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-background px-3 text-muted-foreground text-sm">
                  Processing & Generating Posts
                </span>
              </div>
            </div>

            <div className="animate-pulse space-y-4 mt-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6"></div>
            </div>
          </div>
        )}
      </div>

      {/* Right column - Filter controls */}
      <div className="lg:w-1/3">
        <div className="sticky top-24">
          <FilterControls filters={filters} onFiltersChange={setFilters} />

          {/* Active filters summary */}
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
              Active Settings
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Executive:
                </span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {filters.executive.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Department:
                </span>
                <span className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                  {filters.department}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Platform:
                </span>
                <span className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                  {filters.platform.replace("_", " ")}
                </span>
              </div>
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  These settings are applied during post generation
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
