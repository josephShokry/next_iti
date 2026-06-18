import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function ProductsPage({ products }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");

  // limit to 3 if no session
  const visibleProducts = session ? products : products.slice(0, 3);

  let filtered = visibleProducts.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (sortBy === "price_asc") filtered.sort((a, b) => a.price - b.price);
  if (sortBy === "price_desc") filtered.sort((a, b) => b.price - a.price);
  if (sortBy === "rate_asc") filtered.sort((a, b) => a.rate - b.rate);
  if (sortBy === "rate_desc") filtered.sort((a, b) => b.rate - a.rate);

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this product?")) return;

    await fetch(`/api/products/${id}`, { method: "DELETE" });
    router.replace(router.asPath);
  }

  return (
    <div style={{ padding: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Products</h1>
        {session && (
          <Link href="/products/create">
            <button style={{ padding: "0.5rem 1rem" }}>+ Add Product</button>
          </Link>
        )}
      </div>

      {!session && (
        <p style={{ color: "#888", marginBottom: "1rem" }}>
          Showing 3 of {products.length} products.{" "}
          <Link href="/login">Login</Link> to see all.
        </p>
      )}

      {/* Filter & Sort Controls */}
      <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem" }}>
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "0.5rem", width: "200px" }}
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{ padding: "0.5rem" }}
        >
          <option value="">Sort by...</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rate_asc">Rate: Low to High</option>
          <option value="rate_desc">Rate: High to Low</option>
        </select>
      </div>

      {/* Product Cards */}
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {filtered.map((product) => (
          <div
            key={product._id}
            style={{ border: "1px solid #ccc", padding: "1rem", width: "200px" }}
          >
            <h2>{product.name}</h2>
            <p>Price: ${product.price}</p>
            <p>Rate: ⭐ {product.rate}</p>
            <Link href={`/products/${product._id}`}>View Details</Link>

            {/* Only show these buttons when logged in */}
            {session && (
              <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem" }}>
                <Link href={`/products/${product._id}/edit`}>
                  <button>Edit</button>
                </Link>
                <button
                  onClick={() => handleDelete(product._id)}
                  style={{ color: "red" }}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const res = await fetch("http://localhost:3000/api/products");
  const data = await res.json();

  const products = data.map((p) => ({
    ...p,
    _id: p._id.toString(),
  }));

  return {
    props: { products },
    revalidate: 30,
  };
}