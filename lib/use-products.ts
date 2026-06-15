"use client"

// Fetches the product catalog from the OVHcloud backend (`/api/products`)
// using SWR for caching + revalidation. Falls back to the bundled catalog
// when NEXT_PUBLIC_API_URL is not configured, so the storefront always renders.

import useSWR from "swr"
import { swrFetcher, isApiConfigured } from "./api-client"
import { PRODUCTS_ENDPOINT } from "./api"
import { products as fallbackProducts, type Product } from "./store-context"

interface UseProductsResult {
  products: Product[]
  isLoading: boolean
  isError: boolean
  /** True when data is served from the local fallback rather than the API. */
  isFallback: boolean
}

export function useProducts(): UseProductsResult {
  const { data, error, isLoading } = useSWR<Product[]>(
    isApiConfigured ? PRODUCTS_ENDPOINT : null,
    swrFetcher,
    {
      revalidateOnFocus: false,
      // Show the bundled catalog instantly while the API request resolves.
      fallbackData: fallbackProducts,
      keepPreviousData: true,
    },
  )

  // When the API is not configured we never trigger a request; serve local data.
  if (!isApiConfigured) {
    return { products: fallbackProducts, isLoading: false, isError: false, isFallback: true }
  }

  return {
    products: data && data.length > 0 ? data : fallbackProducts,
    isLoading,
    isError: Boolean(error),
    isFallback: Boolean(error) || !data,
  }
}
