/* ============================================
   ADMIN SKILLS MODULE — Arctic Frost 🧊
   Skills & Competency Manager
   ============================================ */

const AdminSkills = {
    async init(container) {
        this.container = container;
        this.categories = [];
        this.renderLayout();
        await this.loadSkills();
    },

    renderLayout() {
        this.container.innerHTML = `
            <div class="module-header">
                <div class="module-title">
                    <h3>Skills & Technologies</h3>
                    <p>Organize your technical stack by category and proficiency level.</p>
                </div>
                <button id="add-category-btn" class="btn btn-primary">+ Add Category</button>
            </div>

            <div id="skills-container" class="skills-grid">
                <!-- Category cards loaded here -->
            </div>

            <!-- Category Modal -->
            <div id="cat-modal" class="modal-overlay hidden">
                <div class="modal-content" style="max-width: 480px">
                    <div class="modal-header">
                        <h4 id="cat-modal-title">Category Settings</h4>
                        <button class="close-modal">✕</button>
                    </div>
                    <div class="modal-body">
                        <form id="cat-form" class="admin-form">
                            <input type="hidden" id="cat-id" name="id">
                            <div class="form-group">
                                <label for="cat-title">Category Name</label>
                                <input type="text" id="cat-title" name="title" placeholder="e.g. Backend Development" required>
                            </div>
                            <div class="form-group">
                                <label for="cat-icon">Category Icon (Emoji)</label>
                                <input type="text" id="cat-icon" name="icon" placeholder="e.g. ⚙️, 💻, 🚀">
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary close-modal">Cancel</button>
                        <button type="submit" form="cat-form" class="btn btn-primary">Save Category</button>
                    </div>
                </div>
            </div>

            <!-- Skill Item Modal -->
            <div id="skill-modal" class="modal-overlay hidden">
                <div class="modal-content" style="max-width: 400px">
                    <div class="modal-header">
                        <h4>Skill Details</h4>
                        <button class="close-modal">✕</button>
                    </div>
                    <div class="modal-body">
                        <form id="skill-form" class="admin-form">
                            <input type="hidden" id="skill-cat-id">
                            <input type="hidden" id="skill-id">
                            <div class="form-group">
                                <label for="skill-name">Technology Name</label>
                                <input type="text" id="skill-name" placeholder="e.g. Java, Python" required>
                            </div>
                            <div class="form-group">
                                <label for="skill-level">Proficiency Level (%)</label>
                                <div style="display:flex; align-items:center; gap:10px">
                                    <input type="range" id="skill-level-range" min="0" max="100" style="flex:1">
                                    <input type="number" id="skill-level" min="0" max="100" style="width:70px">
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary close-modal">Cancel</button>
                        <button type="button" id="save-skill-btn" class="btn btn-primary">Save Skill</button>
                    </div>
                </div>
            </div>
        `;

        this.bindEvents();
    },

    bindEvents() {
        document.getElementById('add-category-btn').addEventListener('click', () => this.openCatModal());
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                document.getElementById('cat-modal').classList.add('hidden');
                document.getElementById('skill-modal').classList.add('hidden');
            });
        });

        document.getElementById('cat-form').addEventListener('submit', (e) => this.handleCatSubmit(e));
        document.getElementById('save-skill-btn').addEventListener('click', () => this.handleSkillSave());

        // Sync Range and Number
        const range = document.getElementById('skill-level-range');
        const num = document.getElementById('skill-level');
        range.addEventListener('input', () => num.value = range.value);
        num.addEventListener('input', () => range.value = num.value);
    },

    async loadSkills() {
        try {
            const data = await AdminAPI.get('/admin/skills');
            this.categories = data;
            this.renderCategories();
        } catch (error) {
            AdminApp.showToast('Error loading skills', 'error');
        }
    },

    renderCategories() {
        const container = document.getElementById('skills-container');
        container.innerHTML = this.categories.map(cat => `
            <div class="action-card" style="display:flex; flex-direction:column; gap:15px">
                <div style="display:flex; justify-content:space-between; align-items:center">
                    <h4 style="margin:0">${cat.icon || '🛠️'} ${cat.title}</h4>
                    <div class="actions-cell">
                        <button class="btn-icon" onclick="AdminSkills.openCatModal(${cat.id})" title="Edit Category">✏️</button>
                        <button class="btn-icon btn-delete" onclick="AdminSkills.deleteCategory(${cat.id})" title="Delete Category">🗑️</button>
                    </div>
                </div>
                
                <div class="action-list">
                    ${(cat.items || []).map(item => `
                        <div class="btn-outline" style="display:flex; justify-content:space-between; align-items:center">
                            <span>${item.name} (${item.level}%)</span>
                            <div style="display:flex; gap:5px">
                                <button onclick="AdminSkills.openSkillModal(${cat.id}, ${JSON.stringify(item).replace(/"/g, '&quot;')})" style="font-size:12px">✏️</button>
                                <button onclick="AdminSkills.deleteSkill(${cat.id}, ${item.id})" style="font-size:12px; color:#ef4444">✕</button>
                            </div>
                        </div>
                    `).join('')}
                    <button class="btn-outline" style="border-style:dashed; text-align:center" onclick="AdminSkills.openSkillModal(${cat.id})">+ Add Skill</button>
                </div>
            </div>
        `).join('');
    },

    openCatModal(id = null) {
        const modal = document.getElementById('cat-modal');
        const form = document.getElementById('cat-form');
        form.reset();
        
        if (id) {
            const cat = this.categories.find(c => c.id === id);
            document.getElementById('cat-id').value = id;
            document.getElementById('cat-title').value = cat.title;
            document.getElementById('cat-icon').value = cat.icon;
            document.getElementById('cat-modal-title').textContent = 'Edit Category';
        } else {
            document.getElementById('cat-id').value = '';
            document.getElementById('cat-modal-title').textContent = 'Add Skill Category';
        }
        
        modal.classList.remove('hidden');
    },

    async handleCatSubmit(e) {
        e.preventDefault();
        const id = document.getElementById('cat-id').value;
        const data = {
            title: document.getElementById('cat-title').value,
            icon: document.getElementById('cat-icon').value
        };

        try {
            if (id) await AdminAPI.put(`/admin/skills/categories/${id}`, data);
            else await AdminAPI.post('/admin/skills/categories', data);
            
            document.getElementById('cat-modal').classList.add('hidden');
            AdminApp.showToast('Category saved');
            await this.loadSkills();
        } catch (error) {
            AdminApp.showToast('Save failed: ' + error.message, 'error');
        }
    },

    async deleteCategory(id) {
        if (confirm('Delete category and all its skills?')) {
            try {
                await AdminAPI.delete(`/admin/skills/categories/${id}`);
                AdminApp.showToast('Category deleted');
                await this.loadSkills();
            } catch (error) {
                AdminApp.showToast('Delete failed', 'error');
            }
        }
    },

    openSkillModal(catId, item = null) {
        document.getElementById('skill-cat-id').value = catId;
        document.getElementById('skill-id').value = item ? item.id : '';
        document.getElementById('skill-name').value = item ? item.name : '';
        
        const level = item ? item.level : 80;
        document.getElementById('skill-level').value = level;
        document.getElementById('skill-level-range').value = level;
        
        document.getElementById('skill-modal').classList.remove('hidden');
    },

    async handleSkillSave() {
        const catId = document.getElementById('skill-cat-id').value;
        const skillId = document.getElementById('skill-id').value;
        const data = {
            name: document.getElementById('skill-name').value,
            level: parseInt(document.getElementById('skill-level').value)
        };

        try {
            if (skillId) {
                await AdminAPI.put(`/admin/skills/items/${skillId}`, data);
            } else {
                await AdminAPI.post(`/admin/skills/categories/${catId}/items`, data);
            }
            
            document.getElementById('skill-modal').classList.add('hidden');
            AdminApp.showToast('Skill saved');
            await this.loadSkills();
        } catch (error) {
            AdminApp.showToast('Save failed: ' + error.message, 'error');
        }
    },

    async deleteSkill(catId, skillId) {
        if (confirm('Remove this skill?')) {
            try {
                await AdminAPI.delete(`/admin/skills/items/${skillId}`);
                AdminApp.showToast('Skill removed');
                await this.loadSkills();
            } catch (error) {
                AdminApp.showToast('Delete failed', 'error');
            }
        }
    }
};

window.AdminSkills = AdminSkills;
