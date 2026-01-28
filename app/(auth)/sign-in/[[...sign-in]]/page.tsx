import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <section className="section">
      <div className="sectionInner">
        <SignIn />
      </div>
    </section>
  );
}
