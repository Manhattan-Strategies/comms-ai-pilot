import { useRef, useEffect } from "react";
import UploadFormInput from "./upload-form-input";
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
  const formRef = useRef<HTMLFormElement>(null);
  const promptChatRef = useRef<PromptChatHandle>(null);
  const prevIsLoading = usePrevious(isLoading);

  const handleMessagesChange = (
    updater: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])
  ) => {
    onMessagesChange(updater);
    // Invalidate brief whenever chat changes
    onBriefChange(null);
  };

  // Reset form when loading completes (transitions from true to false)
  useEffect(() => {
    if (prevIsLoading === true && !isLoading && formRef.current) {
      formRef.current.reset();
    }
  }, [isLoading, prevIsLoading]);

  return (
    <div className="lg:w-2/3">
      {/* Prompt chat */}
      <PromptChat
        ref={promptChatRef}
        filters={filters}
        brief={brief}
        messages={messages}
        onMessagesChange={handleMessagesChange}
      />
      {/* Upload section divider */}
      <div className="mt-8 relative">
        <div className="relative flex justify-center">
          <span className="bg-transparent px-3 text-muted-foreground text-sm">
            Optional: Upload Supporting PDF
          </span>
        </div>
      </div>

      {/* Upload form input */}
      <div className="mt-8">
        <UploadFormInput
          isLoading={isLoading}
          ref={formRef}
          onSubmit={(e) => {
            // Ensure currentTarget is set to the form element
            if (formRef.current && e.currentTarget !== formRef.current) {
              // Create a synthetic event with the correct currentTarget
              const syntheticEvent = {
                ...e,
                currentTarget: formRef.current,
                target: e.target,
                preventDefault: e.preventDefault.bind(e),
                stopPropagation: e.stopPropagation.bind(e),
              } as React.FormEvent<HTMLFormElement>;
              onSubmit(syntheticEvent, () =>
                promptChatRef.current?.flushInput()
              );
            } else {
              onSubmit(e, () => promptChatRef.current?.flushInput());
            }
          }}
        />
      </div>

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
