/* ============================================
   APP — Main Entry Point
   ============================================ */

document.addEventListener('DOMContentLoaded', async () => {
  console.log('[App] Initializing with dynamic data...');

  // 1. Fetch data from Backend
  // We fetch in parallel for better performance
  const [profile, experiences, projects, skillCategories, blogPosts] = await Promise.all([
    API.getProfile(),
    API.getExperiences(),
    API.getProjects(),
    API.getSkills(),
    API.getPosts()
  ]);

  // 2. Prepare Data Object (Merge Backend data with static fallbacks if needed)
  const appData = {
    personal: profile || DATA.personal,
    about: DATA.about, 
    experience: experiences || DATA.experience,
    projects: projects || DATA.projects,
    skills: skillCategories || DATA.skills,
    posts: blogPosts || []
  };

  // 3. Initialize Modules
  Theme.init();
  Navigation.init();
  
  // Initialize i18n before UI modules
  I18n.init(appData);
  
  Hero.init(appData);
  About.init(appData);
  Timeline.init(appData);
  Projects.init(appData);
  Skills.init(appData);
  Blog.init(appData);
  Contact.init(appData);
  Footer.init(appData);
  Animations.init();

  console.log('[App] Successfully initialized with Backend data and Multi-language support');
});
