import Link from "next/link";

export default function Home() {
  return (
    <div style={{ padding: "1rem" }}>
      <h1>Welcome to the Store</h1>
      <p>Browse our products or read some quotes!</p>
      <Link href="/products">Go to Products</Link>
    </div>
  );
}