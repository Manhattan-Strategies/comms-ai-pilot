"use client";
import { Button } from "../ui/button";
import UploadFormInput from "./upload-form-input";

export default function UploadForm() {
  const handleSubmit = () => {
    console.log("Submitted");
  };
  return (
    <div>
      <UploadFormInput onSubmit={handleSubmit} />;
    </div>
  );
}
