import { AbstractApiClient, getApiClient } from "../api/AbstractApiClient";

/**
 * Interface representing the search parameters accepted by the backend /search endpoint.
 */
export interface SearchParams {
  query: string;
  limit?: number;
  offset?: number;
  categoryId?: number;
  categorySlug?: string;
  minLimit?: number;
  maxLimit?: number;
}

export const searchService = {
  /**
   * Searches products by title with optional filtering and pagination.
   * Matches the updated Go backend which expects q, categoryId, categorySlug, minLimit, and maxLimit.
   */
  searchProducts: async ({
    query,
    limit,
    offset,
    categoryId,
    categorySlug,
    minLimit,
    maxLimit
  }: SearchParams) => {
    // Always include 'q' (maps to 'title' on the backend) even if it's an empty string.
    const params: Record<string, any> = { q: query };

    // Add optional pagination parameters
    if (limit !== undefined) params.limit = limit;
    if (offset !== undefined) params.offset = offset;

    // Add optional category filters [cite: 1]
    if (categoryId !== undefined) params.categoryId = categoryId;
    if (categorySlug !== undefined) params.categorySlug = categorySlug;

    // Add optional price range filters (mapped to minLimit/maxLimit in main.go) [cite: 1]
    if (minLimit !== undefined) params.minLimit = minLimit;
    if (maxLimit !== undefined) params.maxLimit = maxLimit;

    

    const { data } = await getApiClient(1).get('/search', { params });
    return data;
  },
};