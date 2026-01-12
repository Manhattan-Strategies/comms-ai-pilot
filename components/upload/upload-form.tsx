"use client";
import { useUploadThing } from "@/utils/uploadthing";
import { Button } from "../ui/button";
import UploadFormInput from "./upload-form-input";
import { z } from "zod";
import { toast } from "sonner";

const schema = z.object({
  file: z
    .instanceof(File, { message: "Invalid file" })
    .refine(
      (file) => file.size <= 24 * 1024 * 1024,
      "File size must be less than 20MB"
    )
    .refine(
      (file) => file.type.startsWith("application/pdf"),
      "File must be a PDF"
    ),
});
export default function UploadForm() {
  const { startUpload, routeConfig } = useUploadThing("pdfUploader", {
    onClientUploadComplete: () => {
      console.log("uploaded successfully!");
    },
    onUploadError: (err) => {
      console.log("error occurred while uploading", err);
    },
    onUploadBegin: (data) => {
      console.log("upload has begun for", data);
    },
  });
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = formData.get("file") as File;
    // validating the fields if the file is valid
    const validatedFields = schema.safeParse({ file });

    if (!validatedFields.success) {
      toast("❌ Something went wrong", {
        description:
          validatedFields.error.flatten().fieldErrors.file?.[0] ??
          "Invalid file.",
        style: { color: "red" },
      });
      // setIsLoading(false);
      return;
    }

    toast("📄 Uploading PDF...", {
      description: "We are uploading your PDF! ",
    });
    // schema with zod
    //upload the file to uploadthing
    const uploadResponse = await startUpload([file]);
    if (!uploadResponse) {
      toast("Something went wrong", {
        description: "Please use a different file",
        style: { color: "red" },
      });
      // setIsLoading(false);
      return;
    }

    toast("⏳ Processing PDF...", {
      description: "Hang tight! Our AI is reading through your document!",
    });

    const uploadFileUrl = uploadResponse[0].serverData.fileUrl;
    // parse the pdf using langchain
    // summarize the pdf using AI
    // save the summary to the database
    // redirect to the {id} summary page

    // console.log(file, "Submitted");
  };
  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
      <UploadFormInput onSubmit={handleSubmit} />
    </div>
  );
}
