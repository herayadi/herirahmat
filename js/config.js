/* ============================================
   CONFIG — Environment Configuration
   ============================================ */

const CONFIG = {
  // If running locally, use localhost backend. 
  // Otherwise, set your production API URL here.
  API_BASE_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:8080/api'
    : 'https://portfolio-backend-production.up.railway.app/api' // Ganti dengan URL backend asli Anda nanti
};
