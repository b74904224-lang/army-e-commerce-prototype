// High-level API operations for the ARMY storefront, backed by the external
// OVHcloud server. Each function maps to a REST endpoint on NEXT_PUBLIC_API_URL.

import { apiRequest, setToken, clearToken } from "./api-client"
import type { Product } from "./store-context"

/* -------------------------------------------------------------------------- */
/*  Auth ( /api/auth/* )                                                      */
/* -------------------------------------------------------------------------- */

export interface AuthResponse {
  token: string
  user: {
    name: string
    email: string
  }
}

/** POST /api/auth/register — create an account and receive a JWT. */
export async function registerRequest(name: string, email: string, password: string): Promise<AuthResponse> {
  const data = await apiRequest<AuthResponse>("/api/auth/register", {
    method: "POST",
    auth: false,
    body: { name, email, password },
  })
  if (data?.token) setToken(data.token)
  return data
}

/** POST /api/auth/login — authenticate and receive a JWT. */
export async function loginRequest(email: string, password: string): Promise<AuthResponse> {
  const data = await apiRequest<AuthResponse>("/api/auth/login", {
    method: "POST",
    auth: false,
    body: { email, password },
  })
  if (data?.token) setToken(data.token)
  return data
}

/** Clears the persisted JWT (server is stateless for logout). */
export function logoutRequest(): void {
  clearToken()
}

/* -------------------------------------------------------------------------- */
/*  Products ( /api/products )                                                */
/* -------------------------------------------------------------------------- */

export const PRODUCTS_ENDPOINT = "/api/products"

/* -------------------------------------------------------------------------- */
/*  Orders ( /api/orders )                                                    */
/* -------------------------------------------------------------------------- */

export interface OrderItemPayload {
  productId: string
  name: string
  price: number
  quantity: number
}

export interface OrderPayload {
  customer: {
    name: string
    phone: string
    email: string
  }
  delivery: {
    service: string // novaPoshta | ukrPoshta | meest
    type: "branch" | "home"
    city: string
    branchNumber?: string
    street?: string
    building?: string
    apartment?: string
  }
  payment: {
    method: "cod" | "fullCard" | "partial"
    // Card data is sent only when a card method is selected. In production this
    // must travel over HTTPS to a PCI-compliant endpoint / tokenization service.
    card?: {
      number: string
      expiry: string
      holder: string
    }
    prepaymentAmount?: number
  }
  items: OrderItemPayload[]
  totals: {
    subtotal: number
    shipping: number
    total: number
  }
}

export interface OrderResponse {
  orderNumber: string
  status: string
}

/** POST /api/orders — submit a new order to the OVHcloud backend. */
export async function createOrder(payload: OrderPayload): Promise<OrderResponse> {
  return apiRequest<OrderResponse>("/api/orders", {
    method: "POST",
    body: payload,
  })
}

export type { Product }
