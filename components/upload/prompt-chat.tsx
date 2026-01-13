"use client";

import { useMemo, useState } from "react";
import type { FilterState } from "@/types/filters";
import type { GenerationBrief } from "@/types/generation";

export type ChatMessage = { role: "user" | "assistant"; content: string };

export default function PromptChat({
  filters,
  brief,
  messages,
  onMessagesChange,
}: {
  filters: FilterState;
  brief: GenerationBrief | null;
  messages: ChatMessage[];
  onMessagesChange: (m: ChatMessage[]) => void;
}) {
  const [input, setInput] = useState("");

  const statusLabel = useMemo(() => {
    if (brief) return "Brief ready";
    const hasUser = messages.some((m) => m.role === "user");
    return hasUser ? "Drafting" : "Drafting";
  }, [brief, messages]);

  function addUserMessage(content: string) {
    const trimmed = content.trim();
    if (!trimmed) return;
    onMessagesChange([...messages, { role: "user", content: trimmed }]);
  }

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-2xl">Assistant Chat</h3>
        <span className="text-xs text-muted-foreground">{statusLabel}</span>
      </div>

      <div className="mt-3 max-h-64 overflow-auto space-y-3 text-sm">
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
      </div>

      <div className="mt-3">
        <input
          className="w-full rounded border border-gray-200 dark:border-gray-800 bg-transparent px-3 py-2 text-sm"
          placeholder="Describe what you want the posts to cover… (Press Enter)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addUserMessage(input);
              setInput("");
            }
          }}
        />
        <p className="mt-2 text-xs text-muted-foreground text-center">
          Tip: mention the initiative, intended audience reaction, and what you
          must avoid claiming.
        </p>
      </div>
    </div>
  );
}
