import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <section className="section">
      <div className="sectionInner">
        <SignUp />
      </div>
    </section>
  );
}
