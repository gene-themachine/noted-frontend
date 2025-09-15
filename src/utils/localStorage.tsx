export const authTokenName = 'authToken';

/**
 * Gets the site-stored authToken from localStorage
 */
export function getBearerToken(): string {
  // Prefer a token kept in localStorage by the Supabase auth listener
  // (see src/lib/authToken.ts). Falls back to the legacy key if present.
  return localStorage.getItem(authTokenName) ?? '';
}

/**
 * Sets a returned token in localStorage for attachment to later network requests
 * @param {*} token - A valid JWT authentication token
 */
export function setBearerToken(token: string) {
  localStorage.setItem(authTokenName, token);
}

/**
 * Removes the bearer token from localStorage
 */
export function removeBearerToken(): void {
  localStorage.removeItem(authTokenName);
}

/**
 * Clears all localStorage data for complete logout
 */
export function clearAllStorage(): void {
  localStorage.clear();
}
