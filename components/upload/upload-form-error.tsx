/**
 * Error display component for upload form
 */
interface UploadFormErrorProps {
  error: string;
}

export default function UploadFormError({ error }: UploadFormErrorProps) {
  return (
    <div className="alert alert--error">
      <p className="alert__title">Failed to generate posts</p>
      <p className="alert__message">{error}</p>
    </div>
  );
}
