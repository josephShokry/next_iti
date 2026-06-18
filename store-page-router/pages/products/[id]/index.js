import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function ProductPage({ product }) {
  const { data: session } = useSession();
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this product?")) return;

    await fetch(`/api/products/${product._id}`, { method: "DELETE" });
    router.push("/products");
  }

  return (
    <div style={{ padding: "1rem" }}>
      <Link href="/products">← Back to Products</Link>
      <h1>{product.name}</h1>
      <p>Price: ${product.price}</p>
      <p>Rate: ⭐ {product.rate}</p>
      <p>{product.description}</p>

      {session && (
        <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
          <Link href={`/products/${product._id}/edit`}>
            <button>Edit</button>
          </Link>
          <button onClick={handleDelete} style={{ color: "red" }}>
            Delete
          </button>
        </div>
      )}
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