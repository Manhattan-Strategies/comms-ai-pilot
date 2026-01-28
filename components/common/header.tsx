import NavLink from "./nav-link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
// import PlanBadge from "./plan-badge";
export default function Header() {
  return (
    <nav className="container headerNav">
      <div className="headerNav__left">
        <NavLink href="/" className="headerNav__brand">
          <img src="/mhtn-logo.svg" className="headerNav__logo" />
        </NavLink>
      </div>

      <div className="headerNav__center">
        <NavLink href="/#pricing">Pricing</NavLink>

        <SignedIn>
          <NavLink href="/dashboard">Your Posts</NavLink>
        </SignedIn>
      </div>

      <div className="headerNav__right">
        <SignedIn>
          <div className="headerNav__actions">
            <NavLink href="/upload">Start Planning Content</NavLink>
            {/* <PlanBadge /> */}
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </SignedIn>

        <SignedOut>
          <NavLink href="/sign-in">Sign In</NavLink>
        </SignedOut>
      </div>
    </nav>
  );
}
