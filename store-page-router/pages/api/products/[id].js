import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export default async function handler(req, res) {
  await connectDB();

  const { id } = req.query;

  if (req.method === "GET") {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    return res.status(200).json(product);
  }

  if (req.method === "PUT") {
    const updated = await Product.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Product not found" });
    return res.status(200).json(updated);
  }

  if (req.method === "DELETE") {
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Product not found" });
    return res.status(200).json({ message: "Product deleted" });
  }

  res.status(405).json({ error: "Method not allowed" });
}