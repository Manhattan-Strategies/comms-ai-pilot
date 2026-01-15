"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { forwardRef } from "react";

interface UploadFormInputProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}
const UploadFormInput = forwardRef<HTMLFormElement, UploadFormInputProps>(
  ({ onSubmit, isLoading }, ref) => {
    return (
      <form ref={ref} className="flex flex-col gap-6" onSubmit={onSubmit}>
        <div className="flex justify-end items-center gap-1.5">
          <Input
            id="file"
            type="file"
            name="file"
            accept="application/pdf"
            className={cn(isLoading && "opacity-50 cursor-not-allowed")}
            disabled={isLoading}
          />
          <Button
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-500"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin bg-blue-600" />
                Processing...
              </>
            ) : (
              "Generate Social Posts"
            )}
          </Button>
        </div>
      </form>
    );
  }
);
UploadFormInput.displayName = "UploadFormInput";
export default UploadFormInput;
