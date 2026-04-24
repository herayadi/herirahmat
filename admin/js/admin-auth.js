/* ============================================
   ADMIN AUTH LOGIC — Arctic Frost 🧊
   Login Handling for Heri Rahmat's Portfolio
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const loginBtn = document.getElementById('login-btn');
    const loginError = document.getElementById('login-error');
    const btnText = loginBtn.querySelector('.btn-text');
    const spinner = loginBtn.querySelector('.loading-spinner');

    // If already authenticated, go to dashboard
    // Note: dashboard.html hasn't been created yet, but this is the goal.
    if (AdminAPI.isAuthenticated()) {
        window.location.href = 'dashboard.html';
    }

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Reset state
        loginError.classList.add('hidden');
        setLoading(true);

        try {
            const response = await AdminAPI.post('/auth/login', { username, password });

            if (response && response.token) {
                AdminAPI.saveToken(response.token);
                localStorage.setItem('admin_user', response.username);
                
                // Success! Redirect to dashboard
                window.location.href = 'dashboard.html';
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (error) {
            console.error('Login error:', error);
            loginError.textContent = error.message || 'Connection to server failed';
            loginError.classList.remove('hidden');
        } finally {
            setLoading(false);
        }
    });

    function setLoading(isLoading) {
        if (isLoading) {
            loginBtn.disabled = true;
            btnText.classList.add('hidden');
            spinner.classList.remove('hidden');
        } else {
            loginBtn.disabled = false;
            btnText.classList.remove('hidden');
            spinner.classList.add('hidden');
        }
    }
});
