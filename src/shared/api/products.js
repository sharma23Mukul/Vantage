/**
 * Product/Scene/Material API functions.
 */
import { api } from './client';

/**
 * Fetch paginated product list.
 * @param {number} page
 * @param {number} limit
 * @returns {Promise<{items: Array, total: number, page: number, limit: number}>}
 */
export async function fetchProducts(page = 1, limit = 10) {
  return api.get(`/api/products?page=${page}&limit=${limit}`);
}

/**
 * Fetch full scene config (with materials + regions) for a product.
 * @param {string} productId - UUID string
 * @returns {Promise<Object>}
 */
export async function fetchProductScene(productId) {
  return api.get(`/api/products/${productId}/scene`);
}

/**
 * Fetch material variants for a scene.
 * @param {string} sceneId - UUID string
 * @returns {Promise<Array>}
 */
export async function fetchMaterials(sceneId) {
  return api.get(`/api/materials/${sceneId}`);
}

/**
 * Fire-and-forget analytics event.
 * @param {{ scene_id?: string, event_type: string, payload?: object }} event
 * @returns {Promise<{status: string}>}
 */
export async function postAnalyticsEvent(event) {
  return api.post('/api/analytics/event', event);
}
