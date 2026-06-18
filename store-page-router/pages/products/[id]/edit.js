import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function EditProductPage({ product }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [form, setForm] = useState({
    name: product.name,
    price: product.price,
    description: product.description,
    rate: product.rate,
  });
  const [error, setError] = useState("");

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

    const res = await fetch(`/api/products/${product._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: Number(form.price),
        rate: Number(form.rate),
      }),
    });

    if (!res.ok) {
      setError("Failed to update product");
      return;
    }

    router.push(`/products/${product._id}`);
  }

  return (
    <div style={{ padding: "1rem", maxWidth: "400px" }}>
      <Link href={`/products/${product._id}`}>← Back</Link>
      <h1>Edit Product</h1>
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
        <button type="submit" style={{ padding: "0.5rem 1rem" }}>Update</button>
      </form>
    </div>
  );
}

export async function getStaticPaths() {
  const res = await fetch("http://localhost:3000/api/products");
  const products = await res.json();

  const paths = products.map((p) => ({
    params: { id: p._id.toString() },
  }));

  return { paths, fallback: "blocking" };
}

export async function getStaticProps({ params }) {
  const res = await fetch(`http://localhost:3000/api/products/${params.id}`);
  if (!res.ok) return { notFound: true };

  const data = await res.json();
  const product = { ...data, _id: data._id.toString() };

  return {
    props: { product },
    revalidate: 30,
  };
}