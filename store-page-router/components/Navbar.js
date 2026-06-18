import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav style={{ padding: "1rem", borderBottom: "1px solid #ccc", marginBottom: "1rem", display: "flex", justifyContent: "space-between" }}>
      <div>
        <Link href="/" style={{ marginRight: "1rem" }}>Home</Link>
        <Link href="/products" style={{ marginRight: "1rem" }}>Products</Link>
        <Link href="/quotes" style={{ marginRight: "1rem" }}>Quotes</Link>
      </div>
      <div>
        {session ? (
          <>
            <span style={{ marginRight: "1rem" }}>👤 {session.user.email}</span>
            <button onClick={() => signOut({ callbackUrl: "/" })}>Logout</button>
          </>
        ) : (
          <>
            <Link href="/login" style={{ marginRight: "1rem" }}>Login</Link>
            <Link href="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}