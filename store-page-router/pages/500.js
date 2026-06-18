import Link from "next/link";

export default function ServerError() {
  return (
    <div style={{ padding: "1rem" }}>
      <h1>500 - Server Error</h1>
      <p>Something went wrong on our end.</p>
      <Link href="/">Go Home</Link>
    </div>
  );
}

ServerError.hideNavbar = true;