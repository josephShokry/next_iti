import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    const products = await Product.find();
    return res.status(200).json(products);
  }

  if (req.method === "POST") {
    const { name, price, description, rate } = req.body;
    const product = await Product.create({ name, price, description, rate });
    return res.status(201).json(product);
  }

  res.status(405).json({ error: "Method not allowed" });
}