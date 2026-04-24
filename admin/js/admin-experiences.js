/* ============================================
   ADMIN EXPERIENCE MODULE — Arctic Frost 🧊
   Work Experience Manager
   ============================================ */

const AdminExperiences = {
    async init(container) {
        this.container = container;
        this.experiences = [];
        this.renderLayout();
        await this.loadExperiences();
    },

    renderLayout() {
        this.container.innerHTML = `
            <div class="module-header">
                <div class="module-title">
                    <h3>Work Experience</h3>
                    <p>Manage your professional career timeline and achievements.</p>
                </div>
                <button id="add-exp-btn" class="btn btn-primary">+ Add Experience</button>
            </div>

            <div id="exp-list" class="management-grid">
                <!-- Cards loaded here -->
            </div>

            <!-- Modal for Add/Edit -->
            <div id="exp-modal" class="modal-overlay hidden">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 id="modal-title">Add New Experience</h4>
                        <button class="close-modal">✕</button>
                    </div>
                    <div class="modal-body">
                        <form id="exp-form" class="admin-form">
                            <input type="hidden" id="exp-id" name="id">
                            <div class="form-grid">
                                <div class="section-divider">Company Information</div>
                                <div class="form-group full-width">
                                    <label for="company">Company Name</label>
                                    <input type="text" id="company" name="company" placeholder="e.g. Google, Tech Solutions Inc." required>
                                </div>
                                <div class="form-group">
                                    <label for="roleEn">Role (English)</label>
                                    <input type="text" id="roleEn" name="roleEn" placeholder="e.g. Senior Developer" required>
                                </div>
                                <div class="form-group">
                                    <label for="roleId">Role (Indonesian)</label>
                                    <input type="text" id="roleId" name="roleId" placeholder="e.g. Pengembang Senior" required>
                                </div>
                                <div class="form-group">
                                    <label for="startDate">Start Date</label>
                                    <input type="date" id="startDate" name="startDate" required>
                                </div>
                                <div class="form-group">
                                    <label for="endDate">End Date</label>
                                    <input type="date" id="endDate" name="endDate">
                                    <div style="margin-top:5px; display:flex; align-items:center; gap:8px">
                                        <input type="checkbox" id="isCurrent" name="isCurrent" style="width:auto">
                                        <label for="isCurrent" style="margin:0; font-size:12px">I currently work here</label>
                                    </div>
                                </div>

                                <div class="section-divider">Responsibilities & Description</div>
                                <div class="form-group">
                                    <label for="descriptionEn">English Description</label>
                                    <textarea id="descriptionEn" name="descriptionEn" placeholder="Briefly describe your main role..."></textarea>
                                </div>
                                <div class="form-group">
                                    <label for="descriptionId">Indonesian Description</label>
                                    <textarea id="descriptionId" name="descriptionId" placeholder="Deskripsikan peran utama Anda..."></textarea>
                                </div>

                                <div class="section-divider">Key Achievements</div>
                                <div class="form-group full-width">
                                    <label>What impacts did you make?</label>
                                    <div id="impact-list" class="dynamic-list-container">
                                        <!-- Impact items added here -->
                                    </div>
                                    <button type="button" id="add-impact-btn" class="btn-outline" style="margin-top:10px; width:fit-content">+ Add Achievement Point</button>
                                </div>

                                <div class="section-divider">Technical Stack</div>
                                <div class="form-group full-width">
                                    <label>Core technologies used in this role</label>
                                    <div class="list-item-input">
                                        <input type="text" id="tech-input" placeholder="e.g. Java, Docker, Kubernetes">
                                        <button type="button" id="add-tech-btn" class="btn btn-primary">Add Tech</button>
                                    </div>
                                    <div id="tech-tags" class="tag-container"></div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary close-modal">Cancel</button>
                        <button type="submit" form="exp-form" class="btn btn-primary">Save Experience</button>
                    </div>
                </div>
            </div>
        `;

        this.bindEvents();
    },

    bindEvents() {
        document.getElementById('add-exp-btn').addEventListener('click', () => this.openModal());
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => this.closeModal());
        });

        const expForm = document.getElementById('exp-form');
        expForm.addEventListener('submit', (e) => this.handleSubmit(e));

        // Impact list management
        document.getElementById('add-impact-btn').addEventListener('click', () => this.addImpactItem(''));
        
        // Tech tags management
        const techInput = document.getElementById('tech-input');
        const addTechBtn = document.getElementById('add-tech-btn');
        
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

        // Handle isCurrent toggle
        const isCurrentCheck = document.getElementById('isCurrent');
        const endDateInput = document.getElementById('endDate');
        isCurrentCheck.addEventListener('change', () => {
            if (isCurrentCheck.checked) {
                endDateInput.value = '';
                endDateInput.disabled = true;
                endDateInput.removeAttribute('required');
            } else {
                endDateInput.disabled = false;
                endDateInput.setAttribute('required', 'required');
            }
        });
    },

    async loadExperiences() {
        try {
            const data = await AdminAPI.get('/admin/experiences');
            this.experiences = data;
            this.renderTable();
        } catch (error) {
            console.error('Failed to load experiences:', error);
            AdminApp.showToast('Error loading experiences', 'error');
        }
    },

    formatPeriod(exp) {
        if (!exp.startDate) return exp.period || 'Not set';
        const start = new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        if (exp.current) return `${start} — Present`;
        if (!exp.endDate) return `${start}`;
        const end = new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        return `${start} — ${end}`;
    },

    renderTable() {
        const list = document.getElementById('exp-list');
        
        if (this.experiences.length === 0) {
            list.innerHTML = `<div class="empty-state" style="grid-column: 1/-1; text-align:center; padding:60px">
                <p style="font-size:40px">💼</p>
                <p style="color:var(--text-muted)">No experience records found. Add your first job!</p>
            </div>`;
            return;
        }

        list.innerHTML = this.experiences.map(exp => `
            <div class="item-card">
                <div class="item-card-header">
                    <div>
                        <h4 class="item-card-title">${exp.company}</h4>
                        <p class="item-card-subtitle">${exp.roleEn} / ${exp.roleId}</p>
                    </div>
                    <span class="mini-tag" style="background:rgba(6,182,212,0.1); border-color:var(--accent-primary)">${this.formatPeriod(exp)}</span>
                </div>
                <div class="item-card-body">
                    <p style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                        ${exp.descriptionEn || 'No description provided.'}
                    </p>
                    <div class="item-tags" style="margin-top:12px">
                        ${(exp.tech || []).slice(0, 4).map(tech => `<span class="mini-tag">${tech}</span>`).join('')}
                        ${(exp.tech || []).length > 4 ? `<span class="mini-tag">+${exp.tech.length - 4}</span>` : ''}
                    </div>
                </div>
                <div class="item-card-footer">
                    <div style="font-size:12px; color:var(--text-muted)">
                        ${(exp.impact || []).length} Achievements
                    </div>
                    <div class="actions-cell">
                        <button class="btn-icon" onclick="AdminExperiences.editExp(${exp.id})">✏️</button>
                        <button class="btn-icon btn-delete" onclick="AdminExperiences.deleteExp(${exp.id})">🗑️</button>
                    </div>
                </div>
            </div>
        `).join('');
    },

    openModal(exp = null) {
        const modal = document.getElementById('exp-modal');
        const form = document.getElementById('exp-form');
        const title = document.getElementById('modal-title');
        
        form.reset();
        document.getElementById('exp-id').value = exp ? exp.id : '';
        document.getElementById('impact-list').innerHTML = '';
        document.getElementById('tech-tags').innerHTML = '';
        
        const isCurrentCheck = document.getElementById('isCurrent');
        const endDateInput = document.getElementById('endDate');

        if (exp) {
            title.textContent = 'Edit Experience';
            form.elements['company'].value = exp.company;
            form.elements['roleEn'].value = exp.roleEn;
            form.elements['roleId'].value = exp.roleId;
            form.elements['startDate'].value = exp.startDate;
            form.elements['endDate'].value = exp.endDate || '';
            form.elements['isCurrent'].checked = exp.current;
            form.elements['descriptionEn'].value = exp.descriptionEn;
            form.elements['descriptionId'].value = exp.descriptionId;

            // Trigger checkbox logic
            isCurrentCheck.dispatchEvent(new Event('change'));

            (exp.impact || []).forEach(item => this.addImpactItem(item));
            (exp.tech || []).forEach(tag => this.addTechTag(tag));
        } else {
            title.textContent = 'Add New Experience';
            isCurrentCheck.checked = false;
            isCurrentCheck.dispatchEvent(new Event('change'));
            this.addImpactItem(''); // Start with one empty impact
        }
        
        modal.classList.remove('hidden');
    },

    closeModal() {
        document.getElementById('exp-modal').classList.add('hidden');
    },

    addImpactItem(value) {
        const container = document.getElementById('impact-list');
        const div = document.createElement('div');
        div.className = 'list-item-input';
        div.innerHTML = `
            <input type="text" name="impact[]" value="${value.replace(/"/g, '&quot;')}" placeholder="Enter achievement...">
            <button type="button" class="btn-icon btn-delete" onclick="this.parentElement.remove()">✕</button>
        `;
        container.appendChild(div);
    },

    addTechTag(value) {
        const container = document.getElementById('tech-tags');
        // Prevent duplicates
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

    async editExp(id) {
        const exp = this.experiences.find(e => e.id === id);
        if (exp) this.openModal(exp);
    },

    async deleteExp(id) {
        if (confirm('Are you sure you want to delete this experience?')) {
            try {
                await AdminAPI.delete(`/admin/experiences/${id}`);
                AdminApp.showToast('Experience deleted');
                await this.loadExperiences();
            } catch (error) {
                AdminApp.showToast('Delete failed: ' + error.message, 'error');
            }
        }
    },

    async handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const id = document.getElementById('exp-id').value;
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Handle arrays manually
        data.impact = Array.from(form.querySelectorAll('input[name="impact[]"]'))
            .map(input => input.value.trim())
            .filter(val => val !== '');
            
        data.tech = Array.from(document.querySelectorAll('#tech-tags .tag-text'))
            .map(el => el.textContent);

        data.current = document.getElementById('isCurrent').checked;
        if (data.current) data.endDate = null;

        try {
            if (id) {
                await AdminAPI.put(`/admin/experiences/${id}`, data);
                AdminApp.showToast('Experience updated!');
            } else {
                await AdminAPI.post('/admin/experiences', data);
                AdminApp.showToast('Experience added!');
            }
            this.closeModal();
            await this.loadExperiences();
        } catch (error) {
            AdminApp.showToast('Save failed: ' + error.message, 'error');
        }
    }
};

window.AdminExperiences = AdminExperiences;
