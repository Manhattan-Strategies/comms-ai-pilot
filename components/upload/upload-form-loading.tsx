/**
 * Loading state component for upload form
 */
export default function UploadFormLoading() {
  return (
    <div className="spacerTopLg">
      <div className="divider divider--center">
        <span className="divider__label">Processing &amp; Generating Posts</span>
      </div>

      <div className="skeletonGroup">
        <div className="skeletonLine skeletonLine--w3_4" />
        <div className="skeletonLine" />
        <div className="skeletonLine skeletonLine--w5_6" />
      </div>
    </div>
  );
}
