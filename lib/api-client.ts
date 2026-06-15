// Centralized API client for the external OVHcloud backend server.
//
// Configure the production endpoint by setting NEXT_PUBLIC_API_URL to the
// OVHcloud server IP or custom API subdomain, e.g.:
//   NEXT_PUBLIC_API_URL=https://api.army-store.com
//   NEXT_PUBLIC_API_URL=https://51.x.x.x
//
// When the variable is not set, the app gracefully falls back to local
// mock data / mock auth so the UI keeps working in preview and CI builds.

export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "")

/** True when an external OVHcloud backend has been configured. */
export const isApiConfigured = API_BASE_URL.length > 0

const TOKEN_KEY = "army_auth_token"

/* -------------------------------------------------------------------------- */
/*  JWT session token helpers (client side only)                              */
/* -------------------------------------------------------------------------- */

export function getToken(): string | null {
  if (typeof window === "undefined") return null
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function setToken(token: string): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(TOKEN_KEY, token)
  } catch {
    /* ignore storage errors */
  }
}

export function clearToken(): void {
  if (typeof window === "undefined") return
  try {
    localStorage.removeItem(TOKEN_KEY)
  } catch {
    /* ignore storage errors */
  }
}

/* -------------------------------------------------------------------------- */
/*  Core request wrapper                                                      */
/* -------------------------------------------------------------------------- */

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown
  /** Attach the stored JWT as a Bearer token. Defaults to true. */
  auth?: boolean
}

/**
 * Typed fetch wrapper that targets the OVHcloud backend.
 * Automatically serializes JSON bodies and attaches the JWT bearer token.
 */
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  if (!isApiConfigured) {
    throw new ApiError("NEXT_PUBLIC_API_URL is not configured", 0)
  }

  const { body, auth = true, headers, ...rest } = options

  const finalHeaders: Record<string, string> = {
    Accept: "application/json",
    ...(headers as Record<string, string>),
  }

  if (body !== undefined) {
    finalHeaders["Content-Type"] = "application/json"
  }

  if (auth) {
    const token = getToken()
    if (token) finalHeaders["Authorization"] = `Bearer ${token}`
  }

  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...rest,
      headers: finalHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch (err) {
    throw new ApiError(err instanceof Error ? err.message : "Network request failed", 0)
  }

  const isJson = response.headers.get("content-type")?.includes("application/json")
  const payload = isJson ? await response.json().catch(() => null) : null

  if (!response.ok) {
    const message =
      (payload && (payload.message || payload.error)) || `Request failed with status ${response.status}`
    throw new ApiError(message, response.status)
  }

  return payload as T
}

/** SWR-compatible fetcher: `useSWR(path, fetcher)`. */
export const swrFetcher = <T>(path: string) => apiRequest<T>(path, { method: "GET" })
