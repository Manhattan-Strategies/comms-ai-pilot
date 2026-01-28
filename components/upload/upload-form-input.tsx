"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { forwardRef } from "react";
import styles from "./upload-form-input.module.css";

interface UploadFormInputProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}
const UploadFormInput = forwardRef<HTMLFormElement, UploadFormInputProps>(
  ({ onSubmit, isLoading }, ref) => {
    return (
      <form ref={ref} className="stack stack--gapLg" onSubmit={onSubmit}>
        <div className={styles.formRow}>
          <Input
            id="file"
            type="file"
            name="file"
            accept="application/pdf"
            className={cn(isLoading && "isDisabled")}
            disabled={isLoading}
          />
          <Button disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className={cn("icon icon--sm icon--spin", styles.loader)} />
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
