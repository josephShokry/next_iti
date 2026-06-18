import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ padding: "1rem" }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link href="/">Go Home</Link>
    </div>
  );
}

NotFound.hideNavbar = true;