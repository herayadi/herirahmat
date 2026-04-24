/* ============================================
   APP — Main Entry Point
   ============================================ */

document.addEventListener('DOMContentLoaded', async () => {
  console.log('[App] Initializing with dynamic data...');

  // 1. Fetch data from Backend
  // We fetch in parallel for better performance
  const [profile, experiences, projects, skillCategories] = await Promise.all([
    API.getProfile(),
    API.getExperiences(),
    API.getProjects(),
    API.getSkills()
  ]);

  // 2. Prepare Data Object (Merge Backend data with static fallbacks if needed)
  const appData = {
    personal: profile || DATA.personal,
    about: DATA.about, // Bio is inside profile in backend
    experience: experiences || DATA.experience,
    projects: projects || DATA.projects,
    skills: skillCategories || DATA.skills
  };

  // 3. Update bio from profile if available
  if (profile) {
    appData.about.bio = [profile.bioEn, profile.bioId]; // Simplified merge
  }

  // 4. Initialize Modules
  Theme.init();
  Navigation.init();
  Hero.init(appData);
  About.init(appData);
  Timeline.init(appData);
  Projects.init(appData);
  Skills.init(appData);
  Contact.init(appData);
  Footer.init(appData);
  Animations.init();

  console.log('[App] Successfully initialized with Backend data');
});
