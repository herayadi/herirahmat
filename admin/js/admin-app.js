/* ============================================
   ADMIN APP LOGIC — Arctic Frost 🧊
   Core Routing and Module Loading for CMS
   ============================================ */

const AdminApp = {
    modules: {},
    currentModule: null,

    async init() {
        console.log('AdminApp initializing...');
        
        // Security Check
        if (!AdminAPI.isAuthenticated()) {
            window.location.href = 'index.html';
            return;
        }

        // Initialize UI Elements
        this.cacheElements();
        this.bindEvents();
        this.updateUserInfo();

        // Handle Routing
        window.addEventListener('hashchange', () => this.handleRouting());
        this.handleRouting();
    },

    cacheElements() {
        this.contentArea = document.getElementById('content-area');
        this.pageTitle = document.getElementById('page-title');
        this.navItems = document.querySelectorAll('.nav-item');
        this.logoutBtn = document.getElementById('logout-btn');
        this.adminNameDisplay = document.getElementById('admin-name');
    },

    bindEvents() {
        this.logoutBtn.addEventListener('click', () => {
            AdminAPI.removeToken();
            window.location.href = 'index.html';
        });

        // Mobile menu toggle (if needed)
        const menuToggle = document.getElementById('menu-toggle');
        const sidebar = document.querySelector('.admin-sidebar');
        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                sidebar.classList.toggle('open');
            });
        }
    },

    updateUserInfo() {
        const username = localStorage.getItem('admin_user') || 'Admin';
        this.adminNameDisplay.textContent = username;
    },

    async handleRouting() {
        const hash = window.location.hash.replace('#', '') || 'dashboard';
        
        // Auto-close sidebar on mobile after clicking a link
        const sidebar = document.querySelector('.admin-sidebar');
        if (sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
        }

        this.loadModule(hash);
    },

    async loadModule(moduleName) {
        if (this.currentModule === moduleName) return;

        // Update Nav UI
        this.navItems.forEach(item => {
            if (item.dataset.module === moduleName) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Update Page Title
        const titleMap = {
            'dashboard': 'Dashboard Overview',
            'profile': 'Edit Personal Profile',
            'experiences': 'Work Experience Manager',
            'projects': 'Portfolio Projects',
            'skills': 'Skills & Competencies',
            'blog': 'Blog Content Manager',
            'messages': 'Inquiry Inbox'
        };
        this.pageTitle.textContent = titleMap[moduleName] || 'Admin Dashboard';

        // Show Loading
        this.contentArea.innerHTML = `
            <div class="loading-state">
                <div class="loading-spinner"></div>
                <p>Loading ${moduleName} module...</p>
            </div>
        `;

        try {
            // Check if script already loaded, otherwise load it
            if (!document.getElementById(`script-${moduleName}`)) {
                await this.loadScript(`js/admin-${moduleName}.js`, `script-${moduleName}`);
            }

            // Initialize module if it exists
            const moduleInit = window[`Admin${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}`];
            if (moduleInit && typeof moduleInit.init === 'function') {
                await moduleInit.init(this.contentArea);
            } else {
                this.contentArea.innerHTML = `<div class="error-message">Module ${moduleName} not found or initialized incorrectly.</div>`;
            }

            this.currentModule = moduleName;
        } catch (error) {
            console.error(`Failed to load module: ${moduleName}`, error);
            this.contentArea.innerHTML = `<div class="error-message">Error loading module: ${error.message}</div>`;
        }
    },

    loadScript(src, id) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.id = id;
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
        });
    },

    showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <span class="toast-icon">${type === 'success' ? '✅' : '❌'}</span>
            <span class="toast-msg">${message}</span>
        `;
        
        container.appendChild(toast);
        
        // Remove after delay
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(20px)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
};

document.addEventListener('DOMContentLoaded', () => AdminApp.init());
