/* ============================================
   ADMIN DASHBOARD MODULE — Arctic Frost 🧊
   Overview Stats and Quick Actions
   ============================================ */

const AdminDashboard = {
    async init(container) {
        this.container = container;
        this.renderLayout();
        await this.loadStats();
    },

    renderLayout() {
        this.container.innerHTML = `
            <div class="module-header">
                <div class="module-title">
                    <h3>Welcome back, <span id="welcome-name">Admin</span>!</h3>
                    <p>Here's what's happening with your portfolio today.</p>
                </div>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon">💼</div>
                    <div class="stat-info">
                        <div id="stat-experiences" class="stat-value">--</div>
                        <div class="stat-label">Experiences</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">🚀</div>
                    <div class="stat-info">
                        <div id="stat-projects" class="stat-value">--</div>
                        <div class="stat-label">Projects</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">✍️</div>
                    <div class="stat-info">
                        <div id="stat-posts" class="stat-value">--</div>
                        <div class="stat-label">Blog Posts</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">✉️</div>
                    <div class="stat-info">
                        <div id="stat-messages" class="stat-value">--</div>
                        <div class="stat-label">Messages</div>
                    </div>
                </div>
            </div>

            <div class="quick-actions">
                <div class="action-card">
                    <h4>Quick Content Actions</h4>
                    <div class="action-list">
                        <a href="#projects" class="btn-outline">🚀 Add New Project</a>
                        <a href="#blog" class="btn-outline">✍️ Write Blog Post</a>
                        <a href="#experiences" class="btn-outline">💼 Update Experience</a>
                    </div>
                </div>
                <div class="action-card">
                    <h4>System Status</h4>
                    <div class="action-list">
                        <div class="btn-outline">🟢 API Status: Connected</div>
                        <div class="btn-outline">📅 Last Backup: Today, 10:00 AM</div>
                        <a href="#profile" class="btn-outline">👤 Edit Profile Info</a>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('welcome-name').textContent = localStorage.getItem('admin_user') || 'Admin';
    },

    async loadStats() {
        try {
            // Fetch counts from various endpoints
            // Note: We use the admin endpoints which we created in Step 1
            const [experiences, projects, posts, messages] = await Promise.all([
                AdminAPI.get('/admin/experiences'),
                AdminAPI.get('/admin/projects'),
                AdminAPI.get('/admin/posts'),
                AdminAPI.get('/admin/messages')
            ]);

            document.getElementById('stat-experiences').textContent = experiences.length;
            document.getElementById('stat-projects').textContent = projects.length;
            document.getElementById('stat-posts').textContent = posts.length;
            document.getElementById('stat-messages').textContent = messages.length;

            // Update sidebar badge if there are messages
            const badge = document.getElementById('msg-badge');
            if (messages.length > 0) {
                badge.textContent = messages.length;
                badge.classList.remove('hidden');
            } else {
                badge.classList.add('hidden');
            }

        } catch (error) {
            console.error('Failed to load dashboard stats:', error);
            // Don't crash the whole UI, just show error in stats
            const statValues = document.querySelectorAll('.stat-value');
            statValues.forEach(el => el.textContent = '!');
        }
    }
};

// Expose to window for AdminApp to find it
window.AdminDashboard = AdminDashboard;
