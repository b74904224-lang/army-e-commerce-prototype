// GET /api/products — returns the full catalog (array, matching the frontend
// `useProducts` SWR hook which expects Product[]).

import { Router } from "express"
import { products } from "../data/products.js"

export const productsRouter = Router()

productsRouter.get("/", (_req, res) => {
  res.json(products)
})

productsRouter.get("/:id", (req, res) => {
  const product = products.find((p) => p.id === req.params.id)
  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found" })
  }
  res.json(product)
})
