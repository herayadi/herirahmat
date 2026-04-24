/* ============================================
   CONFIG — Environment Configuration
   ============================================ */

const CONFIG = {
  // If running locally, use localhost backend. 
  // Otherwise, set your production API URL here.
  API_BASE_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:8080/api'
    : 'https://YOUR_VM_IP_OR_DOMAIN/api' // TODO: Ganti dengan IP Oracle VM atau domain api.yourdomain.com
};
