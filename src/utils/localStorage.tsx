export const authTokenName = 'authToken';

/**
 * Gets the site-stored authToken from localStorage
 */
export function getBearerToken(): string {
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
 * Clears all localStorage data for complete logout
 */
export function clearAllStorage(): void {
  localStorage.clear();
}
