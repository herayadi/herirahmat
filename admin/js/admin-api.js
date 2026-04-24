/* ============================================
   ADMIN API UTILITY — Arctic Frost 🧊
   CMS API Helper for Heri Rahmat's Portfolio
   ============================================ */

const AdminAPI = {
    BASE_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:8080/api'
        : 'https://portfolio-backend-production.up.railway.app/api',

    getToken: () => localStorage.getItem('admin_token'),
    
    saveToken: (token) => localStorage.setItem('admin_token', token),
    
    removeToken: () => localStorage.removeItem('admin_token'),

    isAuthenticated: () => !!localStorage.getItem('admin_token'),

    async request(endpoint, options = {}) {
        const token = this.getToken();
        
        const headers = {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers
        };

        const config = {
            ...options,
            headers
        };

        try {
            const response = await fetch(`${this.BASE_URL}${endpoint}`, config);
            
            // Handle unauthorized (expired token)
            if (response.status === 401 && !endpoint.includes('/auth/login')) {
                this.removeToken();
                window.location.href = 'index.html'; // Redirect to login
                return null;
            }

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || data.message || 'API Request Failed');
            }

            return data;
        } catch (error) {
            console.error(`API Error [${endpoint}]:`, error);
            throw error;
        }
    },

    get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    },

    post(endpoint, body) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(body)
        });
    },

    put(endpoint, body) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body)
        });
    },

    delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }
};
