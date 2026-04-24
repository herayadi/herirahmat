/* ============================================
   ADMIN PROJECTS MODULE — Arctic Frost 🧊
   Portfolio Projects Manager
   ============================================ */

const AdminProjects = {
    async init(container) {
        this.container = container;
        this.projects = [];
        this.renderLayout();
        await this.loadProjects();
    },

    renderLayout() {
        this.container.innerHTML = `
            <div class="module-header">
                <div class="module-title">
                    <h3>Portfolio Projects</h3>
                    <p>Showcase your best work with images, descriptions, and technical links.</p>
                </div>
                <button id="add-proj-btn" class="btn btn-primary">+ Add New Project</button>
            </div>

            <div id="proj-list" class="management-grid">
                <!-- Project cards loaded here -->
            </div>

            <!-- Modal -->
            <div id="project-modal" class="modal-overlay hidden">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 id="proj-modal-title">Add New Project</h4>
                        <button class="close-modal">✕</button>
                    </div>
                    <div class="modal-body">
                        <form id="project-form" class="admin-form">
                            <input type="hidden" id="proj-id" name="id">
                            <div class="form-grid">
                                <div class="section-divider">General Information</div>
                                <div class="form-group full-width">
                                    <label for="title">Project Title</label>
                                    <input type="text" id="title" name="title" placeholder="e.g. E-Commerce Platform" required>
                                </div>
                                <div class="form-group full-width">
                                    <label for="description">Detailed Description</label>
                                    <textarea id="description" name="description" placeholder="Explain what this project is about..." required></textarea>
                                </div>
                                <div class="form-group">
                                    <label for="category">Category</label>
                                    <input type="text" id="category" name="category" placeholder="e.g. Web App, Mobile, API">
                                </div>
                                <div class="form-group">
                                    <label for="isPublished">Visibility Status</label>
                                    <select id="isPublished" name="isPublished">
                                        <option value="true">🟢 Published (Visible to public)</option>
                                        <option value="false">🟠 Draft (Internal only)</option>
                                    </select>
                                </div>

                                <div class="section-divider">Media & Links</div>
                                <div class="form-group">
                                    <label for="imageUrl">Preview Image URL</label>
                                    <input type="text" id="imageUrl" name="imageUrl" placeholder="https://unsplash.com/...">
                                </div>
                                <div class="form-group">
                                    <label for="githubUrl">GitHub Repository</label>
                                    <input type="text" id="githubUrl" name="githubUrl" placeholder="https://github.com/user/repo">
                                </div>
                                <div class="form-group full-width">
                                    <label for="demoUrl">Live Demo / Production URL</label>
                                    <input type="text" id="demoUrl" name="demoUrl" placeholder="https://myproject.com">
                                </div>

                                <div class="section-divider">Technologies</div>
                                <div class="form-group full-width">
                                    <label>Stack used in this project</label>
                                    <div class="list-item-input">
                                        <input type="text" id="proj-tech-input" placeholder="e.g. React, Node.js, PostgreSQL">
                                        <button type="button" id="proj-add-tech-btn" class="btn btn-primary">Add Tag</button>
                                    </div>
                                    <div id="proj-tech-tags" class="tag-container"></div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary close-modal">Cancel</button>
                        <button type="submit" form="project-form" class="btn btn-primary">Save Project</button>
                    </div>
                </div>
            </div>
        `;

        this.bindEvents();
    },

    bindEvents() {
        document.getElementById('add-proj-btn').addEventListener('click', () => this.openModal());
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => this.closeModal());
        });

        const form = document.getElementById('project-form');
        form.addEventListener('submit', (e) => this.handleSubmit(e));

        const techInput = document.getElementById('proj-tech-input');
        const addTechBtn = document.getElementById('proj-add-tech-btn');
        
        const handleAddTech = () => {
            const val = techInput.value.trim();
            if (val) {
                this.addTechTag(val);
                techInput.value = '';
            }
        };

        addTechBtn.addEventListener('click', handleAddTech);
        techInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') { e.preventDefault(); handleAddTech(); }
        });
    },

    async loadProjects() {
        try {
            const data = await AdminAPI.get('/admin/projects');
            this.projects = data;
            this.renderTable();
        } catch (error) {
            AdminApp.showToast('Error loading projects', 'error');
        }
    },

    renderTable() {
        const list = document.getElementById('proj-list');
        
        if (this.projects.length === 0) {
            list.innerHTML = `<div class="empty-state" style="grid-column: 1/-1; text-align:center; padding:60px">
                <p style="font-size:40px">🚀</p>
                <p style="color:var(--text-muted)">Your portfolio is empty. Time to showcase some projects!</p>
            </div>`;
            return;
        }

        list.innerHTML = this.projects.map(proj => `
            <div class="item-card">
                <div class="project-preview ${!proj.imageUrl ? 'no-image-placeholder' : ''}" 
                     style="${proj.imageUrl ? `background-image: url('${proj.imageUrl}')` : ''}">
                    ${!proj.imageUrl ? '🖼️' : ''}
                </div>
                <div class="item-card-header">
                    <div>
                        <h4 class="item-card-title">${proj.title}</h4>
                        <p class="item-card-subtitle">${proj.category || 'Uncategorized'}</p>
                    </div>
                    <span class="badge ${proj.isPublished ? 'badge-published' : 'badge-draft'}">
                        ${proj.isPublished ? 'Published' : 'Draft'}
                    </span>
                </div>
                <div class="item-card-body">
                    <p style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                        ${proj.description}
                    </p>
                    <div class="item-tags" style="margin-top:12px">
                        ${(proj.techStack || []).slice(0, 3).map(tech => `<span class="mini-tag">${tech}</span>`).join('')}
                    </div>
                </div>
                <div class="item-card-footer">
                    <div style="display:flex; gap:10px">
                        ${proj.githubUrl ? `<a href="${proj.githubUrl}" target="_blank" style="text-decoration:none">📂</a>` : ''}
                        ${proj.demoUrl ? `<a href="${proj.demoUrl}" target="_blank" style="text-decoration:none">🌐</a>` : ''}
                    </div>
                    <div class="actions-cell">
                        <button class="btn-icon" onclick="AdminProjects.editProject(${proj.id})">✏️</button>
                        <button class="btn-icon btn-delete" onclick="AdminProjects.deleteProject(${proj.id})">🗑️</button>
                    </div>
                </div>
            </div>
        `).join('');
    },

    addTechTag(value) {
        const container = document.getElementById('proj-tech-tags');
        const existing = Array.from(container.querySelectorAll('.tag-text')).map(el => el.textContent);
        if (existing.includes(value)) return;

        const span = document.createElement('span');
        span.className = 'tag';
        span.innerHTML = `
            <span class="tag-text">${value}</span>
            <span class="tag-remove" onclick="this.parentElement.remove()">✕</span>
        `;
        container.appendChild(span);
    },

    openModal(proj = null) {
        const modal = document.getElementById('project-modal');
        const form = document.getElementById('project-form');
        const title = document.getElementById('proj-modal-title');
        
        form.reset();
        document.getElementById('proj-id').value = proj ? proj.id : '';
        document.getElementById('proj-tech-tags').innerHTML = '';
        
        if (proj) {
            title.textContent = 'Edit Project';
            form.elements['title'].value = proj.title;
            form.elements['description'].value = proj.description;
            form.elements['category'].value = proj.category;
            form.elements['isPublished'].value = proj.isPublished.toString();
            form.elements['imageUrl'].value = proj.imageUrl;
            form.elements['githubUrl'].value = proj.githubUrl;
            form.elements['demoUrl'].value = proj.demoUrl;
            
            (proj.techStack || []).forEach(tag => this.addTechTag(tag));
        } else {
            title.textContent = 'Add New Project';
        }
        
        modal.classList.remove('hidden');
    },

    closeModal() {
        document.getElementById('project-modal').classList.add('hidden');
    },

    async editProject(id) {
        const proj = this.projects.find(p => p.id === id);
        if (proj) this.openModal(proj);
    },

    async deleteProject(id) {
        if (confirm('Delete this project?')) {
            try {
                await AdminAPI.delete(`/admin/projects/${id}`);
                AdminApp.showToast('Project deleted');
                await this.loadProjects();
            } catch (error) {
                AdminApp.showToast('Delete failed', 'error');
            }
        }
    },

    async handleSubmit(e) {
        e.preventDefault();
        const id = document.getElementById('proj-id').value;
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        data.isPublished = data.isPublished === 'true';
        data.techStack = Array.from(document.querySelectorAll('#proj-tech-tags .tag-text'))
            .map(el => el.textContent);

        try {
            if (id) {
                await AdminAPI.put(`/admin/projects/${id}`, data);
                AdminApp.showToast('Project updated!');
            } else {
                await AdminAPI.post('/admin/projects', data);
                AdminApp.showToast('Project added!');
            }
            this.closeModal();
            await this.loadProjects();
        } catch (error) {
            AdminApp.showToast('Save failed: ' + error.message, 'error');
        }
    }
};

window.AdminProjects = AdminProjects;
