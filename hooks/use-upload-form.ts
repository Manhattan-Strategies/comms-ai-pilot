import { useState } from "react";
import { toast } from "sonner";
import { useUploadThing } from "@/utils/uploadthing";
import { uploadFormSchema } from "@/lib/upload-form-schema";
import type { FilterState } from "@/types/filters";
import type { GenerationBrief } from "@/types/generation";
import type { ChatMessage } from "@/components/upload/prompt-chat";

/**
 * Custom hook for managing upload form state and logic
 */
export function useUploadForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [brief, setBrief] = useState<GenerationBrief | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Tell me what you want these posts to be about. Include the situation, what you want to emphasize, and what to avoid.",
    },
  ]);
  const [filters, setFilters] = useState<FilterState>({
    executive: undefined,
    department: undefined,
    voice: undefined,
    audience: undefined,
    platform: undefined,
    selectedExecutive: undefined,
  });

  const { startUpload } = useUploadThing("pdfUploader", {
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

  /**
   * Generate brief from chat messages
   */
  const generateBriefFromChat = async (): Promise<GenerationBrief | null> => {
    const hasUserMessage = messages.some(
      (m) => m.role === "user" && m.content.trim().length > 0
    );

    // If user never typed anything, let uploads proceed without a brief
    if (!hasUserMessage) return null;

    const res = await fetch("/api/generate-brief", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filters, messages }),
    });

    const data = await res.json();

    if (!res.ok || !data?.success || !data?.brief) {
      throw new Error(data?.error || "Failed to generate brief");
    }

    return data.brief as GenerationBrief;
  };

  /**
   * Handle form submission
   * Supports both with and without PDF file
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      const formData = new FormData(e.currentTarget);
      const file = formData.get("file") as File | null;

      // Validate file if provided
      if (file && file.size > 0) {
        const validationResult = uploadFormSchema.safeParse({ file });
        if (!validationResult.success) {
          const error = validationResult.error.errors[0];
          toast.error("Invalid file", { description: error.message });
          setIsLoading(false);
          return;
        }
      }

      // Generate brief if not already available
      let briefToUse = brief;
      try {
        if (!briefToUse) {
          briefToUse = await generateBriefFromChat();
          setBrief(briefToUse);
        }
      } catch (e) {
        toast.error("Brief generation failed", {
          description: e instanceof Error ? e.message : "Please try again",
        });
        setIsLoading(false);
        return;
      }

      // If no file, generate posts directly via API
      if (!file || file.size === 0) {
        const response = await fetch("/api/generate-posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filters,
            brief: briefToUse,
          }),
        });

        const data = await response.json();

        if (data.success && data.posts) {
          setResult({
            posts: data.posts,
            fileName: null,
            filters: data.filters,
            success: true,
          });

          toast.success("Posts Generated!", {
            description: `Created ${data.posts.length} social media posts`,
          });
        } else {
          setResult({
            ...result,
            error: data.error || "Failed to generate posts",
            success: false,
          });
          toast.error("Generation Failed", {
            description: data.error || "Please try again",
          });
        }
        return;
      }

      // If file exists, use upload flow
      const uploadResponse = await startUpload([file], {
        filters,
        brief: briefToUse as GenerationBrief,
      });

      if (uploadResponse?.[0]?.serverData) {
        const serverData = uploadResponse[0].serverData;

        if (serverData.success && serverData.posts) {
          setResult({
            posts: serverData.posts,
            fileName: serverData.fileName,
            filters: serverData.filters,
            success: true,
          });

          toast.success("Posts Generated!", {
            description: `Created ${serverData.posts.length} social media posts`,
          });
        } else {
          setResult({
            ...result,
            error: serverData.error || "Failed to generate posts",
            success: false,
          });
          toast.error("Generation Failed", {
            description: serverData.error || "Please try again",
          });
        }
      }
    } catch (error) {
      console.error("Upload error:", error);
      setResult({
        ...result,
        error: error instanceof Error ? error.message : "Unknown error",
        success: false,
      });
      toast.error("Upload Failed", {
        description: "Please try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle retry generation
   */
  const handleRetryGeneration = async (fileUrl: string, fileName: string) => {
    try {
      const response = await fetch("/api/regenerate-posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileUrl, fileName, filters }),
      });

      const data = await response.json();

      if (data.success) {
        setResult({
          posts: data.data.posts,
          fileName: data.data.fileName,
          filters: data.data.filters,
          status: "success",
        });
        toast.success("Posts Regenerated!");
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast.error("Regeneration Failed", {
        description:
          error instanceof Error ? error.message : "Please try again",
      });
    }
  };

  return {
    isLoading,
    result,
    brief,
    messages,
    filters,
    setBrief,
    setMessages,
    setFilters,
    handleSubmit,
    handleRetryGeneration,
  };
}
