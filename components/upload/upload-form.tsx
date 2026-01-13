// components/upload/upload-form.tsx
"use client";

import { useUploadForm } from "@/hooks/use-upload-form";
import UploadFormContent from "./upload-form-content";
import UploadFormSidebar from "./upload-form-sidebar";

/**
 * Main upload form component
 * Orchestrates the upload form UI and logic
 */
export default function UploadForm() {
  const {
    isLoading,
    result,
    brief,
    messages,
    filters,
    setBrief,
    setMessages,
    setFilters,
    handleSubmit,
  } = useUploadForm();

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl mx-auto">
      {/* Left column - Upload form content */}
      <UploadFormContent
        isLoading={isLoading}
        brief={brief}
        messages={messages}
        filters={filters}
        result={result}
        onMessagesChange={setMessages}
        onBriefChange={setBrief}
        onSubmit={handleSubmit}
      />

      {/* Right column - Filter controls sidebar */}
      <UploadFormSidebar filters={filters} onFiltersChange={setFilters} />
    </div>
  );
}
