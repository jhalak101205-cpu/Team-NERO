/**
 * Centralized API configuration for BhumiNexus.
 * Dynamically resolves the API base URL to match the client's current hostname.
 * This ensures smooth operation both on localhost and across the local network (LAN / Wi-Fi).
 */
export const API_BASE_URL = typeof window !== 'undefined' && window.location.hostname
  ? `http://${window.location.hostname}:8000`
  : 'http://localhost:8000';

export default API_BASE_URL;
