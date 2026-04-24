/* ============================================
   ADMIN PROFILE MODULE — Arctic Frost 🧊
   Personal Information Editor
   ============================================ */

const AdminProfile = {
    async init(container) {
        this.container = container;
        this.renderLayout();
        await this.loadProfileData();
    },

    renderLayout() {
        this.container.innerHTML = `
            <div class="module-header">
                <div class="module-title">
                    <h3>Personal Profile</h3>
                    <p>Update your name, bio, and social media links.</p>
                </div>
            </div>

            <div class="form-card">
                <form id="profile-form" class="admin-form">
                    <div class="form-grid">
                        <div class="section-divider">Identity & Branding</div>
                        <div class="form-group">
                            <label for="name">Full Name</label>
                            <input type="text" id="name" name="name" placeholder="e.g. Heri Rahmat" required>
                        </div>
                        <div class="form-group">
                            <label for="role">Main Headline / Role</label>
                            <input type="text" id="role" name="role" placeholder="e.g. Middleware Developer" required>
                        </div>
                        <div class="form-group full-width">
                            <label for="tagline">Personal Tagline</label>
                            <input type="text" id="tagline" name="tagline" placeholder="Brief catchphrase about your work">
                        </div>
                        
                        <div class="section-divider">Biography (Bilingual)</div>
                        <div class="form-group">
                            <label for="bioId">Indonesian Bio</label>
                            <textarea id="bioId" name="bioId" placeholder="Tulis biografi dalam Bahasa Indonesia..."></textarea>
                        </div>
                        <div class="form-group">
                            <label for="bioEn">English Bio</label>
                            <textarea id="bioEn" name="bioEn" placeholder="Write your biography in English..."></textarea>
                        </div>

                        <div class="section-divider">Contact & Assets</div>
                        <div class="form-group">
                            <label for="email">Public Email</label>
                            <input type="email" id="email" name="email" placeholder="hello@herirahmat.com">
                        </div>
                        <div class="form-group">
                            <label for="avatarUrl">Avatar Image URL</label>
                            <input type="text" id="avatarUrl" name="avatarUrl" placeholder="https://...">
                        </div>
                        <div class="form-group full-width">
                            <label for="cvUrl">CV / Resume Link (PDF)</label>
                            <input type="text" id="cvUrl" name="cvUrl" placeholder="Link to your Google Drive or Dropbox PDF">
                        </div>
                        
                        <div class="section-divider">Social Presence</div>
                        <div class="form-group">
                            <label for="linkedin">LinkedIn Profile URL</label>
                            <input type="text" id="linkedin" name="linkedin" placeholder="https://linkedin.com/in/...">
                        </div>
                        <div class="form-group">
                            <label for="github">GitHub Profile URL</label>
                            <input type="text" id="github" name="github" placeholder="https://github.com/...">
                        </div>
                    </div>

                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">Update Profile Information</button>
                    </div>
                </form>
            </div>
        `;

        this.form = document.getElementById('profile-form');
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    },

    async loadProfileData() {
        try {
            const profile = await AdminAPI.get('/admin/profile');
            if (profile) {
                // Fill form fields
                Object.keys(profile).forEach(key => {
                    const input = this.form.elements[key];
                    if (input) {
                        input.value = profile[key] || '';
                    }
                });
            }
        } catch (error) {
            console.error('Failed to load profile data:', error);
            AdminApp.showToast('Failed to load profile data', 'error');
        }
    },

    async handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData.entries());

        const submitBtn = this.form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Saving...';

        try {
            await AdminAPI.put('/admin/profile', data);
            AdminApp.showToast('Profile updated successfully!');
        } catch (error) {
            console.error('Failed to update profile:', error);
            AdminApp.showToast('Update failed: ' + error.message, 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Save Profile Changes';
        }
    }
};

window.AdminProfile = AdminProfile;
