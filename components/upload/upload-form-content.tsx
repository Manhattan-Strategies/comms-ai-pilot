import { useRef, useEffect } from "react";
import PromptChat, { type PromptChatHandle } from "./prompt-chat";
import { PostsDisplay } from "./posts-display";
import UploadFormLoading from "./upload-form-loading";
import UploadFormError from "./upload-form-error";
import type { FilterState } from "@/types/filters";
import type { GenerationBrief } from "@/types/generation";
import type { ChatMessage } from "./prompt-chat";

/**
 * Hook to track previous value
 */
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

/**
 * Main content area for upload form
 */
interface UploadFormContentProps {
  isLoading: boolean;
  brief: GenerationBrief | null;
  messages: ChatMessage[];
  filters: FilterState;
  result: any;
  onMessagesChange: (
    messages: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])
  ) => void;
  onBriefChange: (brief: GenerationBrief | null) => void;
  onSubmit: (
    e: React.FormEvent<HTMLFormElement>,
    flushChatInput?: () => void
  ) => Promise<void>;
}

export default function UploadFormContent({
  isLoading,
  brief,
  messages,
  filters,
  result,
  onMessagesChange,
  onBriefChange,
  onSubmit,
}: UploadFormContentProps) {
  const promptChatRef = useRef<PromptChatHandle>(null);
  const prevIsLoading = usePrevious(isLoading);

  const handleMessagesChange = (
    updater: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])
  ) => {
    onMessagesChange(updater);
    // Invalidate brief whenever chat changes
    onBriefChange(null);
  };

  // Note: Form reset is now handled within the PromptChat component

  return (
    <div className="lg:w-2/3">
      {/* Prompt chat */}
      <PromptChat
        ref={promptChatRef}
        filters={filters}
        brief={brief}
        messages={messages}
        onMessagesChange={handleMessagesChange}
        isLoading={isLoading}
        prevIsLoading={prevIsLoading}
        onSubmit={onSubmit}
      />

      {/* Display generated posts */}
      {/* Use current filters, not stale result.filters */}
      {result && result.posts && (
        <div className="mt-8">
          <PostsDisplay
            posts={result.posts}
            filters={filters}
            fileName={result.fileName}
            title={result.title}
          />
        </div>
      )}

      {/* Show error if posts generation failed */}
      {result && result.error && <UploadFormError error={result.error} />}

      {/* Loading state */}
      {isLoading && <UploadFormLoading />}
    </div>
  );
}
