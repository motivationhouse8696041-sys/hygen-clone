document.addEventListener('DOMContentLoaded', () => {
    // === Views ===
    const landingView = document.getElementById('landingView');
    const authView = document.getElementById('authView');
    const mainWorkspace = document.getElementById('mainWorkspace');
    const homeSidebar = document.getElementById('homeSidebar');
    const homeView = document.getElementById('homeView');
    const editorView = document.getElementById('editorView');
    
    // === Landing Page Logic ===
    const navSigninBtn = document.getElementById('navSigninBtn');
    const heroGoogleBtn = document.getElementById('heroGoogleBtn');
    const heroGetStartedBtn = document.getElementById('heroGetStartedBtn');
    const showSignupBtn = document.getElementById('showSignupBtn');

    function goToAuth() {
        landingView.classList.remove('view-active');
        landingView.classList.add('view-hidden');
        
        authView.classList.remove('view-hidden');
        authView.classList.add('view-active');
    }

    navSigninBtn.addEventListener('click', goToAuth);
    heroGoogleBtn.addEventListener('click', goToAuth);
    heroGetStartedBtn.addEventListener('click', goToAuth);
    let isSignupMode = false;
    const authTitle = document.querySelector('.auth-title');
    const authSubtitle = document.querySelector('.auth-subtitle');
    const nameFieldContainer = document.getElementById('nameFieldContainer');
    const nameInput = document.getElementById('nameInput');
    const authSubmitBtn = document.getElementById('authSubmitBtn');
    const authSwitchText = document.getElementById('authSwitchText');

    showSignupBtn.addEventListener('click', () => {
        isSignupMode = !isSignupMode;
        if (isSignupMode) {
            authTitle.textContent = "Create an account";
            authSubtitle.textContent = "Sign up to start creating AI videos";
            nameFieldContainer.style.display = "block";
            nameInput.required = true;
            authSubmitBtn.innerHTML = 'Sign Up <i class="fa-solid fa-arrow-right ml-2"></i>';
            authSwitchText.textContent = "Already have an account?";
            showSignupBtn.textContent = "Sign in";
        } else {
            authTitle.textContent = "Welcome back";
            authSubtitle.textContent = "Log in to your HyGen account to continue";
            nameFieldContainer.style.display = "none";
            nameInput.required = false;
            authSubmitBtn.innerHTML = 'Sign In <i class="fa-solid fa-arrow-right ml-2"></i>';
            authSwitchText.textContent = "Don't have an account?";
            showSignupBtn.textContent = "Sign up";
        }
    });

    // === Auth Logic (Real API Connection) ===
    const loginForm = document.getElementById('loginForm');
    const logoutBtn = document.getElementById('logoutBtn');
    const socialBtn = document.querySelector('.social-btn');
    const emailInput = document.getElementById('emailInput');
    const passwordInput = document.getElementById('passwordInput');

    function executeLoginSuccess(user) {
        // Show success, switch to dashboard
        authView.classList.remove('view-active');
        authView.classList.add('view-hidden');
        
        mainWorkspace.classList.remove('view-hidden');
        homeSidebar.style.display = 'flex';
        
        // You could display user's name on dashboard here:
        // document.querySelector('.avatar-circle').textContent = user.name ? user.name[0].toUpperCase() : 'U';
    }

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = emailInput.value;
        const password = passwordInput.value;
        const name = nameInput.value;

        try {
            const endpoint = isSignupMode ? '/api/signup' : '/api/login';
            const bodyData = isSignupMode ? { name, email, password } : { email, password };

            const response = await fetch('http://localhost:3000' + endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyData)
            });

            const result = await response.json();

            if (result.success) {
                alert(result.message); // Show success alert
                executeLoginSuccess(result.user);
            } else {
                alert("Error: " + result.message);
            }
        } catch (error) {
            console.error("Backend not running yet:", error);
            alert("Backend is not running! Please start the Node.js server first.");
        }
    });

    socialBtn.addEventListener('click', () => {
        alert("Google Login requires a Google Cloud API Key (OAuth). For now, please use Email/Password sign up!");
    });

    // Simulate Logout
    logoutBtn.addEventListener('click', () => {
        mainWorkspace.classList.add('view-hidden');
        homeSidebar.style.display = 'none';
        
        landingView.classList.remove('view-hidden');
        landingView.classList.add('view-active');
        
        // Ensure home view is active when logging back in later
        homeView.classList.add('view-active');
        homeView.classList.remove('view-hidden');
        editorView.classList.add('view-hidden');
        editorView.classList.remove('view-active');
    });

    // === View Toggling Logic (Home -> Editor) ===
    const openEditorBtn = document.getElementById('openEditorBtn');
    const backToHomeBtn = document.getElementById('backToHomeBtn');

    // Open Editor
    openEditorBtn.addEventListener('click', () => {
        homeView.classList.remove('view-active');
        homeView.classList.add('view-hidden');
        homeSidebar.style.display = 'none';
        
        editorView.classList.remove('view-hidden');
        editorView.classList.add('view-active');
    });

    // Go Back Home
    backToHomeBtn.addEventListener('click', () => {
        editorView.classList.remove('view-active');
        editorView.classList.add('view-hidden');
        
        homeView.classList.remove('view-hidden');
        homeView.classList.add('view-active');
        homeSidebar.style.display = 'flex';
    });

    // === Editor Action Logic ===
    const scriptInput = document.querySelector('.script-textarea');
    const submitVideoBtn = document.querySelector('.generate-btn-disabled');
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin text-4xl mb-4"></i><span>Synthesizing AI Video...</span>';
    document.querySelector('.canvas-portrait').appendChild(loadingOverlay);

    scriptInput.addEventListener('input', () => {
        if (scriptInput.value.length > 0) {
            submitVideoBtn.classList.remove('generate-btn-disabled');
            submitVideoBtn.style.background = '#00b4d8';
            submitVideoBtn.style.color = 'white';
            submitVideoBtn.style.cursor = 'pointer';
        } else {
            submitVideoBtn.classList.add('generate-btn-disabled');
            submitVideoBtn.style.background = '#f4f4f5';
            submitVideoBtn.style.color = '#a0a0a0';
            submitVideoBtn.style.cursor = 'not-allowed';
        }
    });

    submitVideoBtn.addEventListener('click', () => {
        if (scriptInput.value.trim() === '') return;
        
        loadingOverlay.classList.add('active');
        setTimeout(() => {
            loadingOverlay.classList.remove('active');
            alert('Video Generated Successfully! (Mockup)');
        }, 2000);
    });
});
