import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function CreateProductPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", price: "", description: "", rate: "" });
  const [error, setError] = useState("");

  // redirect if not logged in
  if (status === "loading") return <p>Loading...</p>;
  if (!session) {
    router.push("/login");
    return null;
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: Number(form.price),
        rate: Number(form.rate),
      }),
    });

    if (!res.ok) {
      setError("Failed to create product");
      return;
    }

    router.push("/products");
  }

  return (
    <div style={{ padding: "1rem", maxWidth: "400px" }}>
      <Link href="/products">← Back</Link>
      <h1>Add Product</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        {["name", "price", "description", "rate"].map((field) => (
          <div key={field} style={{ marginBottom: "1rem" }}>
            <label style={{ textTransform: "capitalize" }}>{field}</label><br />
            <input
              name={field}
              value={form[field]}
              onChange={handleChange}
              style={{ width: "100%", padding: "0.5rem" }}
              required
            />
          </div>
        ))}
        <button type="submit" style={{ padding: "0.5rem 1rem" }}>Create</button>
      </form>
    </div>
  );
}