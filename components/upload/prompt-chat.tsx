"use client";

import {
  useMemo,
  useState,
  useImperativeHandle,
  forwardRef,
  useRef,
  useEffect,
} from "react";
import type { FilterState } from "@/types/filters";
import type { GenerationBrief } from "@/types/generation";
import UploadFormInput from "./upload-form-input";

export type ChatMessage = { role: "user" | "assistant"; content: string };

export type PromptChatHandle = {
  flushInput: () => void;
};

interface PromptChatProps {
  filters: FilterState;
  brief: GenerationBrief | null;
  messages: ChatMessage[];
  onMessagesChange: (
    m: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])
  ) => void;
  isLoading?: boolean;
  prevIsLoading?: boolean;
  onSubmit?: (
    e: React.FormEvent<HTMLFormElement>,
    flushChatInput?: () => void
  ) => Promise<void>;
}

const PromptChat = forwardRef<PromptChatHandle, PromptChatProps>(
  (
    {
      filters,
      brief,
      messages,
      onMessagesChange,
      isLoading,
      prevIsLoading,
      onSubmit,
    },
    ref
  ) => {
    const [input, setInput] = useState("");
    const formRef = useRef<HTMLFormElement>(null);

    // Reset form when loading completes (transitions from true to false)
    useEffect(() => {
      if (prevIsLoading === true && !isLoading && formRef.current) {
        formRef.current.reset();
      }
    }, [isLoading, prevIsLoading]);

    useImperativeHandle(ref, () => ({
      flushInput: () => {
        const trimmed = input.trim();
        if (trimmed) {
          onMessagesChange((prev: ChatMessage[]) => [
            ...prev,
            { role: "user", content: trimmed },
          ]);
          setInput("");
        }
      },
    }));

    const statusLabel = useMemo(() => {
      if (brief) return "Brief ready";
      const hasUser = messages.some((m) => m.role === "user");
      return hasUser ? "Drafting" : "Drafting";
    }, [brief, messages]);

    function addUserMessage(content: string) {
      const trimmed = content.trim();
      if (!trimmed) return;
      onMessagesChange((prev: ChatMessage[]) => [
        ...prev,
        { role: "user", content: trimmed },
      ]);
      setInput("");
    }

    return (
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-2xl">Assistant Chat</h3>
          <span className="text-xs text-muted-foreground">{statusLabel}</span>
        </div>

        {/* <div className="mt-3 max-h-64 overflow-auto space-y-3 text-sm">
        {messages.map((m, i) => (
          <div
            key={i}
            className={
              m.role === "user"
                ? "ml-auto w-[90%] rounded bg-gray-100 dark:bg-gray-800 p-2"
                : "mr-auto w-[90%] rounded bg-white dark:bg-black/20 p-2 border border-gray-200 dark:border-gray-800"
            }
          >
            <div>{m.content}</div>
          </div>
        ))}
      </div> */}

        <div className="mt-3">
          <textarea
            className="w-full min-h-24 rounded border border-gray-200 dark:border-gray-800 bg-transparent px-3 py-2 text-sm resize-y"
            placeholder="Describe what you want the posts to cover…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              // Submit on Enter (without Shift), allow Shift+Enter for new lines
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                addUserMessage(input);
                setInput("");
              }
            }}
            rows={4}
          />
          <p className="mt-2 text-xs text-muted-foreground text-left">
            Tell me what you want these posts to be about. Include the
            situation, what you want to emphasize, and what to avoid.
          </p>
          <p className="text-xs text-muted-foreground text-left">
            Tip: mention the initiative, intended audience reaction, and what
            you must avoid claiming.
          </p>
        </div>

        {/* Upload section */}
        {onSubmit && (
          <>
            <div className="mt-6 relative">
              <div className="relative flex justify-center">
                <span className="bg-transparent px-3 text-muted-foreground text-sm">
                  Optional: Upload Supporting PDF
                </span>
              </div>
            </div>

            <div className="mt-4">
              <UploadFormInput
                isLoading={isLoading || false}
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
                    onSubmit(syntheticEvent, () => {
                      const trimmed = input.trim();
                      if (trimmed) {
                        onMessagesChange((prev: ChatMessage[]) => [
                          ...prev,
                          { role: "user", content: trimmed },
                        ]);
                        setInput("");
                      }
                    });
                  } else {
                    onSubmit(e, () => {
                      const trimmed = input.trim();
                      if (trimmed) {
                        onMessagesChange((prev: ChatMessage[]) => [
                          ...prev,
                          { role: "user", content: trimmed },
                        ]);
                        setInput("");
                      }
                    });
                  }
                }}
              />
            </div>
          </>
        )}
      </div>
    );
  }
);

PromptChat.displayName = "PromptChat";

export default PromptChat;
