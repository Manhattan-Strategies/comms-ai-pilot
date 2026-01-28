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
import { cn } from "@/lib/utils";
import styles from "./prompt-chat.module.css";

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
    { brief, messages, onMessagesChange, isLoading, prevIsLoading, onSubmit },
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
      <div className={cn("card card--paddedMd", "textLeft")}>
        <div className={styles.header}>
          <h3 className={styles.title}>Assistant Chat</h3>
          <span className={styles.status}>{statusLabel}</span>
        </div>

        <div className={styles.body}>
          <textarea
            className="textarea"
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
          <p className={styles.helperText}>
            Tell me what you want these posts to be about. Include the
            situation, what you want to emphasize, and what to avoid.
          </p>
          <p className={styles.helperText}>
            Tip: mention the initiative, intended audience reaction, and what
            you must avoid claiming.
          </p>
        </div>

        {/* Upload section */}
        {onSubmit && (
          <>
            <div className={styles.uploadSection}>
              <div className="divider divider--center">
                <span className="divider__label">Optional: Upload Supporting PDF</span>
              </div>

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
