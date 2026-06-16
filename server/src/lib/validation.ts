// Zod schemas — the single source of truth for request validation.
// These intentionally mirror the frontend payload contracts in lib/api.ts.

import { z } from "zod"

/* ----------------------------- Auth ----------------------------- */

const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+?\d[\d\s-]{8,}$/, "Invalid phone number")

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(80),
  email: z.string().trim().toLowerCase().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters").max(128),
  phone: phoneSchema.optional(),
})

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email"),
  password: z.string().min(1, "Password is required").max(128),
})

export const updateProfileSchema = z
  .object({
    name: z.string().trim().min(2, "Name is too short").max(80).optional(),
    phone: phoneSchema.optional(),
  })
  .refine((data) => data.name !== undefined || data.phone !== undefined, {
    message: "Nothing to update",
  })

/* ----------------------------- Orders ---------------------------- */

const orderItemSchema = z.object({
  productId: z.string().min(1),
  name: z.string().min(1).max(300),
  price: z.number().nonnegative(),
  quantity: z.number().int().positive().max(999),
})

const deliverySchema = z.object({
  service: z.enum([
    "nova_poshta",
    "ukr_poshta",
    "meest",
    "other",
    "not_required_for_quick_order",
  ]),
  type: z.enum(["branch", "home", "not_required_for_quick_order"]),
  city: z.string().trim().max(120).optional(),
  branchNumber: z.string().trim().max(40).optional(),
  street: z.string().trim().max(160).optional(),
  building: z.string().trim().max(40).optional(),
  apartment: z.string().trim().max(40).optional(),
})

export const orderSchema = z
  .object({
    type: z.enum(["checkout", "quick_order"]),
    customer: z.object({
      name: z.string().trim().min(2, "Name is too short").max(80),
      // Accepts +380..., spaces and dashes.
      phone: z
        .string()
        .trim()
        .regex(/^\+?\d[\d\s-]{8,}$/, "Invalid phone number"),
      email: z.string().trim().toLowerCase().email("Invalid email").optional(),
    }),
    delivery: deliverySchema,
    payment: z.object({
      method: z.enum(["cod", "bank_transfer", "manager_confirmation"]),
    }),
    items: z.array(orderItemSchema).min(1, "Order must contain at least one item").max(100),
    totals: z.object({
      subtotal: z.number().nonnegative(),
      shipping: z.number().nonnegative(),
      total: z.number().nonnegative(),
    }),
    comment: z.string().trim().max(2000).optional(),
    language: z.enum(["ua", "ru", "en"]),
    source: z.enum(["checkout_page", "buy_now_modal"]),
  })
  // Full checkout orders must include delivery destination details.
  .superRefine((data, ctx) => {
    if (data.type !== "checkout") return
    if (data.delivery.type === "branch" && !data.delivery.branchNumber) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["delivery", "branchNumber"], message: "Branch number is required" })
    }
    if (data.delivery.type === "home") {
      if (!data.delivery.street)
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["delivery", "street"], message: "Street is required" })
      if (!data.delivery.building)
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["delivery", "building"], message: "Building is required" })
    }
  })

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
export type OrderInput = z.infer<typeof orderSchema>
