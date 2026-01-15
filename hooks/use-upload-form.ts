import { useEffect, useRef, useState } from "react";
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
  const messagesRef = useRef(messages);
  const filtersRef = useRef(filters);
  const briefRef = useRef(brief);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  useEffect(() => {
    briefRef.current = brief;
  }, [brief]);
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
    const latestMessages = messagesRef.current;
    const latestFilters = filtersRef.current;

    console.log("=== generateBriefFromChat called ===");
    console.log("Latest messages from ref:", latestMessages);
    console.log("Latest messages length:", latestMessages.length);

    // Only proceed if we have at least one non-empty user message
    const userMessages = latestMessages.filter(
      (m) => m.role === "user" && m.content.trim().length > 0
    );

    console.log("User messages found:", userMessages.length);
    if (userMessages.length > 0) {
      console.log(
        "User messages content:",
        userMessages.map((m) => m.content)
      );
    }

    if (userMessages.length === 0) {
      console.log("No user messages, returning null");
      return null;
    }

    const requestBody = {
      filters: latestFilters,
      messages: latestMessages,
    };

    console.log("=== Calling /api/generate-brief ===");
    console.log("Request body:", JSON.stringify(requestBody, null, 2));

    try {
      const res = await fetch("/api/generate-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      console.log("Brief API response status:", res.status);
      const data = await res.json();
      console.log("Brief API response data:", data);

      if (!res.ok || data?.success !== true) {
        console.error("Brief generation failed:", data?.error);
        throw new Error(data?.error || "Failed to generate brief");
      }

      const briefObj = data?.brief;
      console.log("Brief object from response:", briefObj);

      if (!briefObj) {
        console.error("Brief is null or undefined in response");
        throw new Error("Brief was not generated");
      }

      // Ensure a usable topic exists
      const topic =
        typeof briefObj.topic === "string" ? briefObj.topic.trim() : "";

      console.log("Brief topic:", topic);

      if (!topic) {
        console.warn("Brief topic is empty, setting from user message");
        briefObj.topic =
          userMessages[0].content.slice(0, 200) || "Social media posts";
        console.log("Set brief topic to:", briefObj.topic);
      }

      console.log("Returning brief:", briefObj);
      return briefObj as GenerationBrief;
    } catch (error) {
      console.error("Error in generateBriefFromChat:", error);
      throw error;
    }
  };

  /**
   * Handle form submission
   * Supports both with and without PDF file
   */
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    flushChatInput?: () => void
  ) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      // FORCE commit any pending chat input before submit
      let messagesAfterFlush = messages;
      if (flushChatInput) {
        console.log("=== Flushing chat input before submit ===");
        console.log("Messages before flush:", messagesRef.current);
        flushChatInput();
        // Wait for state to update
        await new Promise((resolve) => setTimeout(resolve, 50));
        // Read from state directly after flush - it's updated immediately
        // The useEffect will update messagesRef.current, but state is more reliable here
        messagesAfterFlush = messages;
        console.log("Messages after flush:", messagesAfterFlush);
        console.log("=== End flush ===");
      }

      // Use the flushed messages, or refs if no flush happened
      const latestMessages = messagesAfterFlush;
      const latestFilters = filtersRef.current;
      const latestBrief = briefRef.current;

      console.log("=== CLIENT: Right Before Submit (After Flush) ===");
      console.log("Latest messages from ref:", latestMessages);
      console.log("Latest messages count:", latestMessages.length);
      console.log("Latest brief from ref:", latestBrief);
      console.log("Latest filters from ref:", latestFilters);
      console.log("=== END CLIENT LOG ===");

      // Get form element safely - handle case where currentTarget might not be a form
      let formElement: HTMLFormElement | null = null;

      // Try multiple ways to get the form element
      if (e.currentTarget instanceof HTMLFormElement) {
        formElement = e.currentTarget;
      } else if (e.target instanceof HTMLFormElement) {
        formElement = e.target;
      } else if (e.target instanceof HTMLElement) {
        formElement = e.target.closest("form");
      } else if (e.currentTarget && typeof e.currentTarget === "object") {
        // If currentTarget is an input, get its form property
        const input = e.currentTarget as HTMLInputElement;
        if (input.form) {
          formElement = input.form;
        }
      }

      // Get file from form if we have a form element
      let file: File | null = null;
      if (formElement) {
        try {
          const formData = new FormData(formElement);
          file = formData.get("file") as File | null;
        } catch (error) {
          console.error("Error creating FormData:", error);
          // Fallback: try to get file input directly
          const fileInput = formElement.querySelector(
            'input[type="file"]'
          ) as HTMLInputElement;
          if (fileInput && fileInput.files && fileInput.files.length > 0) {
            file = fileInput.files[0];
          }
        }
      } else {
        // No form element found - this is OK, we can proceed without a file
        console.log("No form element found, proceeding without file");
      }

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
      // Use latest messages from ref (after flush)
      let briefToUse = latestBrief;
      try {
        if (!briefToUse) {
          console.log("Generating brief from chat...");
          console.log("Using latest messages from ref:", latestMessages);
          briefToUse = await generateBriefFromChat();
          console.log("Brief generated:", briefToUse);
          if (briefToUse) {
            setBrief(briefToUse);
            briefRef.current = briefToUse;
          }
        }
      } catch (e) {
        console.error("Brief generation error:", e);
        toast.error("Brief generation failed", {
          description: e instanceof Error ? e.message : "Please try again",
        });
        setIsLoading(false);
        return;
      }

      // CLIENT LOG: After brief generation
      console.log("=== CLIENT: After Brief Generation ===");
      console.log("Final briefToUse:", briefToUse);
      console.log("Final messages from ref:", messagesRef.current);
      console.log("=== END CLIENT LOG ===");

      // If no file, generate posts directly via API
      if (!file || file.size === 0) {
        // Use latest state from refs (after flush)
        const currentMessages = messagesRef.current;
        const currentBrief = briefToUse;
        const currentFilters = filtersRef.current;

        console.log("=== CLIENT: About to call /api/generate-posts ===");
        console.log("Sending messages:", currentMessages);
        console.log("Sending brief:", currentBrief);
        console.log("Sending filters:", currentFilters);

        const response = await fetch("/api/generate-posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filters: currentFilters,
            brief: currentBrief,
            messages: currentMessages,
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
      // Use latest state from refs (after flush)
      const currentMessages = messagesRef.current;
      const currentBrief = briefToUse;
      const currentFilters = filtersRef.current;

      console.log("=== CLIENT: About to call startUpload ===");
      console.log("Sending messages:", currentMessages);
      console.log("Sending brief:", currentBrief);
      console.log("Sending filters:", currentFilters);

      const uploadResponse = await startUpload([file], {
        filters: currentFilters,
        brief: currentBrief as GenerationBrief,
        messages: currentMessages,
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
