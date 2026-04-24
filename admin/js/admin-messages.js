/* ============================================
   ADMIN MESSAGES MODULE — Arctic Frost 🧊
   Contact Form Inbox Manager
   ============================================ */

const AdminMessages = {
    async init(container) {
        this.container = container;
        this.messages = [];
        this.renderLayout();
        await this.loadMessages();
    },

    renderLayout() {
        this.container.innerHTML = `
            <div class="module-header">
                <div class="module-title">
                    <h3>Messages Inbox</h3>
                    <p>Read and manage inquiries from your portfolio visitors.</p>
                </div>
            </div>

            <div class="table-card">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Sender</th>
                            <th>Subject</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="msg-table-body">
                        <!-- Data loaded here -->
                    </tbody>
                </table>
            </div>

            <!-- Modal for Reading Message -->
            <div id="msg-modal" class="modal-overlay hidden">
                <div class="modal-content" style="max-width: 600px">
                    <div class="modal-header">
                        <h4>Inquiry Details</h4>
                        <button class="close-modal">✕</button>
                    </div>
                    <div class="modal-body">
                        <div class="msg-detail">
                            <div style="margin-bottom:20px; border-bottom:1px solid var(--border-color); padding-bottom:15px">
                                <p><strong>From:</strong> <span id="msg-from"></span></p>
                                <p><strong>Email:</strong> <span id="msg-email"></span></p>
                                <p><strong>Subject:</strong> <span id="msg-subject"></span></p>
                                <p><strong>Received:</strong> <span id="msg-date"></span></p>
                            </div>
                            <div class="msg-content-box" style="white-space: pre-wrap; background:rgba(0,0,0,0.2); padding:15px; border-radius:8px">
                                <p id="msg-body"></p>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <a id="msg-reply-btn" href="" class="btn btn-primary">Reply via Email</a>
                        <button type="button" class="btn btn-secondary close-modal">Close</button>
                    </div>
                </div>
            </div>
        `;

        this.bindEvents();
    },

    bindEvents() {
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                document.getElementById('msg-modal').classList.add('hidden');
            });
        });
    },

    async loadMessages() {
        try {
            const data = await AdminAPI.get('/admin/messages');
            this.messages = data;
            this.renderTable();
            
            // Update sidebar badge
            const badge = document.getElementById('msg-badge');
            if (data.length > 0) {
                badge.textContent = data.length;
                badge.classList.remove('hidden');
            } else {
                badge.classList.add('hidden');
            }
        } catch (error) {
            AdminApp.showToast('Error loading messages', 'error');
        }
    },

    renderTable() {
        const tbody = document.getElementById('msg-table-body');
        
        if (this.messages.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:40px; color:var(--text-muted)">Inbox is empty.</td></tr>`;
            return;
        }

        tbody.innerHTML = this.messages.map(msg => `
            <tr>
                <td>
                    <div style="display:flex; flex-direction:column">
                        <span style="font-weight:600">${msg.name}</span>
                        <span style="font-size:11px; color:var(--text-muted)">${msg.email}</span>
                    </div>
                </td>
                <td>${msg.subject || '(No Subject)'}</td>
                <td>${msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : '-'}</td>
                <td>
                    <div class="actions-cell">
                        <button class="btn-icon btn-edit" onclick="AdminMessages.viewMessage(${msg.id})" title="Read">👁️</button>
                        <button class="btn-icon btn-delete" onclick="AdminMessages.deleteMessage(${msg.id})" title="Delete">🗑️</button>
                    </div>
                </td>
            </tr>
        `).join('');
    },

    viewMessage(id) {
        const msg = this.messages.find(m => m.id === id);
        if (!msg) return;

        document.getElementById('msg-from').textContent = msg.name;
        document.getElementById('msg-email').textContent = msg.email;
        document.getElementById('msg-subject').textContent = msg.subject || '(No Subject)';
        document.getElementById('msg-date').textContent = msg.createdAt ? new Date(msg.createdAt).toLocaleString() : '-';
        document.getElementById('msg-body').textContent = msg.message;
        
        document.getElementById('msg-reply-btn').href = `mailto:${msg.email}?subject=Re: ${msg.subject || 'Portfolio Inquiry'}`;
        
        document.getElementById('msg-modal').classList.remove('hidden');
    },

    async deleteMessage(id) {
        if (confirm('Delete this message?')) {
            try {
                await AdminAPI.delete(`/admin/messages/${id}`);
                AdminApp.showToast('Message deleted');
                await this.loadMessages();
            } catch (error) {
                AdminApp.showToast('Delete failed', 'error');
            }
        }
    }
};

window.AdminMessages = AdminMessages;
