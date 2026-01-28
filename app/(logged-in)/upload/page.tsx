import BgGradient from "@/components/common/bg-gradient";
import { MotionDiv } from "@/components/common/motion-wrapper";
import UploadForm from "@/components/upload/upload-form";
import UploadHeader from "@/components/upload/upload-header";
// import { hasReachedUploadLimit } from "@/lib/user";
import { containerVariants } from "@/utils/constants";

import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
export default async function UploadPage() {
  const user = await currentUser();

  if (!user?.id) {
    redirect("/sign-in");
  }

  // const userId = user.id;
  //   const { hasReachedLimit } = await hasReachedUploadLimit(userId);

  //   if (hasReachedLimit) {
  //     redirect("/dashboard");
  //   }

  return (
    <section className="section">
      <BgGradient />
      <MotionDiv
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="sectionInner sectionInner--wide"
      >
        <div className="stack stack--gapLg centerStack">
          <UploadHeader />
          <UploadForm />
        </div>
      </MotionDiv>
    </section>
  );
}
