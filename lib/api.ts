// High-level API operations for the ARMY storefront, backed by the external
// OVHcloud server. Each function maps to a REST endpoint on NEXT_PUBLIC_API_URL.

import { apiRequest, setToken, clearToken } from "./api-client"
import type { Product } from "./catalog"

/* -------------------------------------------------------------------------- */
/*  Auth ( /api/auth/* )                                                      */
/* -------------------------------------------------------------------------- */

export interface AuthUserDto {
  name: string
  email: string
  phone?: string
}

export interface AuthResponse {
  token: string
  user: AuthUserDto
}

/** GET /api/auth/me — fetch the current authenticated profile. */
export async function fetchMe(): Promise<AuthUserDto> {
  const data = await apiRequest<{ user: AuthUserDto }>("/api/auth/me", { method: "GET" })
  return data.user
}

/** PATCH /api/auth/me — update the current authenticated profile. */
export async function updateMe(input: { name?: string; phone?: string }): Promise<AuthUserDto> {
  const data = await apiRequest<{ user: AuthUserDto }>("/api/auth/me", {
    method: "PATCH",
    body: input,
  })
  return data.user
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

export type OrderType = "checkout" | "quick_order"
export type OrderSource = "checkout_page" | "buy_now_modal"
export type DeliveryService =
  | "nova_poshta"
  | "ukr_poshta"
  | "meest"
  | "other"
  | "not_required_for_quick_order"
export type DeliveryType = "branch" | "home" | "not_required_for_quick_order"
/** Safe payment methods only — no card data is ever collected on the frontend. */
export type PaymentMethod = "cod" | "bank_transfer" | "manager_confirmation"

export interface OrderItemPayload {
  productId: string
  name: string
  price: number
  quantity: number
}

export interface OrderPayload {
  type: OrderType
  customer: {
    name: string
    phone: string
    email?: string
  }
  delivery: {
    service: DeliveryService
    type: DeliveryType
    city?: string
    branchNumber?: string
    street?: string
    building?: string
    apartment?: string
  }
  payment: {
    method: PaymentMethod
  }
  items: OrderItemPayload[]
  totals: {
    subtotal: number
    shipping: number
    total: number
  }
  comment?: string
  language: "ua" | "ru" | "en"
  source: OrderSource
}

export interface OrderResponse {
  success: boolean
  orderNumber: string
  status: string
  message?: string
}

/** POST /api/orders — submit a new order to the OVHcloud backend. */
export async function createOrder(payload: OrderPayload): Promise<OrderResponse> {
  return apiRequest<OrderResponse>("/api/orders", {
    method: "POST",
    // Attach the JWT when present so authenticated orders link to the account.
    auth: true,
    body: payload,
  })
}

/* -------------------------------------------------------------------------- */
/*  Account orders ( /api/orders/me, /api/orders/stats )                      */
/* -------------------------------------------------------------------------- */

export interface AccountOrderItem {
  productId: string
  name: string
  price: number
  quantity: number
  lineTotal: number
}

export interface AccountOrder {
  orderNumber: string
  status: string
  createdAt: string
  type: OrderType
  source: OrderSource
  language: "ua" | "ru" | "en"
  customer: {
    name: string
    phone: string
    email?: string
  }
  items: AccountOrderItem[]
  totals: {
    subtotal: number
    shipping: number
    total: number
  }
  comment?: string
}

/** GET /api/orders/me — list the authenticated user's own orders. */
export async function fetchMyOrders(): Promise<AccountOrder[]> {
  const data = await apiRequest<{ orders: AccountOrder[] }>("/api/orders/me", { method: "GET" })
  return data.orders
}

export interface OrderStats {
  totalOrders: number
  totalSpent: number
  totalItems: number
  lastOrder: { orderNumber: string; createdAt: string; total: number } | null
  mostPurchased: { productId: string; name: string; quantity: number } | null
}

/** GET /api/orders/stats — basic stats for the authenticated user. */
export async function fetchOrderStats(): Promise<OrderStats> {
  const data = await apiRequest<{ stats: OrderStats }>("/api/orders/stats", { method: "GET" })
  return data.stats
}

export type { Product }
