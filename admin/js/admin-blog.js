/* ============================================
   ADMIN BLOG MODULE — Arctic Frost 🧊
   Article & Content Manager
   ============================================ */

const AdminBlog = {
    async init(container) {
        this.container = container;
        this.posts = [];
        this.renderLayout();
        await this.loadPosts();
    },

    renderLayout() {
        this.container.innerHTML = `
            <div class="module-header">
                <div class="module-title">
                    <h3>Blog Articles</h3>
                    <p>Share your technical insights and updates with your audience.</p>
                </div>
                <button id="add-post-btn" class="btn btn-primary">+ Write New Article</button>
            </div>

            <div id="blog-list" class="management-grid">
                <!-- Blog cards loaded here -->
            </div>

            <!-- Modal for Blog Post -->
            <div id="blog-modal" class="modal-overlay hidden">
                <div class="modal-content" style="max-width: 900px">
                    <div class="modal-header">
                        <h4 id="blog-modal-title">Write New Post</h4>
                        <button class="close-modal">✕</button>
                    </div>
                    <div class="modal-body">
                        <form id="blog-form" class="admin-form">
                            <input type="hidden" id="blog-id" name="id">
                            <div class="form-grid">
                                <div class="section-divider">Article Essentials</div>
                                <div class="form-group full-width">
                                    <label for="blog-title">Headline / Title</label>
                                    <input type="text" id="blog-title" name="title" placeholder="e.g. 5 Tips for Building Scalable APIs" required>
                                </div>
                                <div class="form-group">
                                    <label for="blog-slug">URL Slug</label>
                                    <input type="text" id="blog-slug" name="slug" placeholder="e.g. 5-tips-building-scalable-apis" required>
                                </div>
                                <div class="form-group">
                                    <label for="blog-isPublished">Status</label>
                                    <select id="blog-isPublished" name="isPublished">
                                        <option value="false">🟠 Draft (Hidden)</option>
                                        <option value="true">🟢 Published (Live)</option>
                                    </select>
                                </div>
                                <div class="form-group full-width">
                                    <label for="blog-summary">Teaser / Summary (SEO)</label>
                                    <textarea id="blog-summary" name="summary" placeholder="Write a short hook to engage readers..." style="min-height: 80px"></textarea>
                                </div>

                                <div class="section-divider">Main Content</div>
                                <div class="form-group full-width">
                                    <label>Article Body (Rich Text Editor)</label>
                                    <div id="blog-editor-container" style="min-height: 400px"></div>
                                    <input type="hidden" id="blog-content" name="content">
                                </div>

                                <div class="section-divider">Metadata</div>
                                <div class="form-group">
                                    <label for="blog-author">Author Name</label>
                                    <input type="text" id="blog-author" name="author" placeholder="Your name">
                                </div>
                                <div class="form-group">
                                    <label for="blog-date">Date of Publication</label>
                                    <input type="date" id="blog-date" name="publishedAt">
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary close-modal">Cancel</button>
                        <button type="submit" form="blog-form" class="btn btn-primary">Save Article</button>
                    </div>
                </div>
            </div>
        `;

        this.bindEvents();
    },

    bindEvents() {
        // Initialize Quill
        this.quill = new Quill('#blog-editor-container', {
            theme: 'snow',
            placeholder: 'Start writing your story here...',
            modules: {
                toolbar: [
                    [{ 'header': [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    ['blockquote', 'code-block'],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    ['link', 'image'],
                    ['clean']
                ]
            }
        });

        document.getElementById('add-post-btn').addEventListener('click', () => this.openModal());
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => this.closeModal());
        });

        const form = document.getElementById('blog-form');
        form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Auto-slug generation
        const titleInput = document.getElementById('blog-title');
        const slugInput = document.getElementById('blog-slug');
        titleInput.addEventListener('input', () => {
            if (!this.editingId) {
                slugInput.value = titleInput.value
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)/g, '');
            }
        });
    },

    async loadPosts() {
        try {
            const data = await AdminAPI.get('/admin/posts');
            this.posts = data;
            this.renderTable();
        } catch (error) {
            AdminApp.showToast('Error loading blog posts', 'error');
        }
    },

    renderTable() {
        const list = document.getElementById('blog-list');
        
        if (this.posts.length === 0) {
            list.innerHTML = `<div class="empty-state" style="grid-column: 1/-1; text-align:center; padding:60px">
                <p style="font-size:40px">✍️</p>
                <p style="color:var(--text-muted)">Your blog is quiet. Start writing your first post!</p>
            </div>`;
            return;
        }

        list.innerHTML = this.posts.map(post => `
            <div class="item-card">
                <div class="item-card-header">
                    <div style="flex:1">
                        <h4 class="item-card-title">${post.title}</h4>
                        <p class="item-card-subtitle">by ${post.author || 'Admin'} • ${post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Draft'}</p>
                    </div>
                    <span class="badge ${post.isPublished ? 'badge-published' : 'badge-draft'}">
                        ${post.isPublished ? 'Published' : 'Draft'}
                    </span>
                </div>
                <div class="item-card-body">
                    <p style="display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
                        ${post.summary || 'No summary available.'}
                    </p>
                </div>
                <div class="item-card-footer">
                    <div style="font-size:12px; color:var(--text-muted)">
                        Slug: /${post.slug}
                    </div>
                    <div class="actions-cell">
                        <button class="btn-icon" onclick="AdminBlog.editPost(${post.id})">✏️</button>
                        <button class="btn-icon btn-delete" onclick="AdminBlog.deletePost(${post.id})">🗑️</button>
                    </div>
                </div>
            </div>
        `).join('');
    },

    openModal(post = null) {
        const modal = document.getElementById('blog-modal');
        const form = document.getElementById('blog-form');
        form.reset();
        
        this.editingId = post ? post.id : null;
        document.getElementById('blog-id').value = post ? post.id : '';
        
        if (post) {
            document.getElementById('blog-modal-title').textContent = 'Edit Article';
            form.elements['title'].value = post.title;
            form.elements['slug'].value = post.slug;
            form.elements['isPublished'].value = post.isPublished.toString();
            form.elements['summary'].value = post.summary;
            this.quill.root.innerHTML = post.content || ''; // Set Quill content
            form.elements['author'].value = post.author;
            
            if (post.publishedAt) {
                form.elements['publishedAt'].value = post.publishedAt.split('T')[0];
            }
        } else {
            document.getElementById('blog-modal-title').textContent = 'Write New Post';
            this.quill.root.innerHTML = ''; // Clear Quill
            form.elements['publishedAt'].value = new Date().toISOString().split('T')[0];
            form.elements['author'].value = 'Heri Rahmat';
        }
        
        modal.classList.remove('hidden');
    },

    closeModal() {
        document.getElementById('blog-modal').classList.add('hidden');
    },

    async editPost(id) {
        const post = this.posts.find(p => p.id === id);
        if (post) this.openModal(post);
    },

    async deletePost(id) {
        if (confirm('Delete this article forever?')) {
            try {
                await AdminAPI.delete(`/admin/posts/${id}`);
                AdminApp.showToast('Article deleted');
                await this.loadPosts();
            } catch (error) {
                AdminApp.showToast('Delete failed', 'error');
            }
        }
    },

    async handleSubmit(e) {
        e.preventDefault();
        const id = document.getElementById('blog-id').value;
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        data.isPublished = data.isPublished === 'true';
        data.content = this.quill.root.innerHTML; // Get Quill content

        try {
            if (id) {
                await AdminAPI.put(`/admin/posts/${id}`, data);
                AdminApp.showToast('Article updated!');
            } else {
                await AdminAPI.post('/admin/posts', data);
                AdminApp.showToast('Article published!');
            }
            this.closeModal();
            await this.loadPosts();
        } catch (error) {
            AdminApp.showToast('Save failed: ' + error.message, 'error');
        }
    }
};

window.AdminBlog = AdminBlog;
