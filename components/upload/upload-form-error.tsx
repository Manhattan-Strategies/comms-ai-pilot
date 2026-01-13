/**
 * Error display component for upload form
 */
interface UploadFormErrorProps {
  error: string;
}

export default function UploadFormError({ error }: UploadFormErrorProps) {
  return (
    <div className="mt-8 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
      <p className="text-red-600 dark:text-red-400 font-medium">
        ❌ Failed to generate posts
      </p>
      <p className="text-red-500 dark:text-red-300 text-sm mt-1">{error}</p>
    </div>
  );
}
