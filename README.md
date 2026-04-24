# Portfolio Frontend

Static frontend for Middleware Developer CV Portfolio.

## Tech Stack
- HTML5 / CSS3 / Vanilla JavaScript
- Responsive design with dark mode
- Admin CMS dashboard (JWT-protected)

## Structure
```
├── index.html          # Main portfolio page
├── css/                # Stylesheets
│   ├── index.css       # Design system & variables
│   ├── components.css  # Reusable components
│   ├── sections.css    # Section-specific styles
│   └── responsive.css  # Media queries
├── js/                 # JavaScript modules
│   ├── config.js       # API configuration
│   ├── api.js          # Backend API client
│   ├── app.js          # App initialization
│   └── ...             # Section modules
├── admin/              # Admin dashboard
│   ├── index.html      # Login page
│   ├── dashboard.html  # Dashboard page
│   ├── css/            # Admin styles
│   └── js/             # Admin modules
└── assets/             # Images & files
```

## Configuration

Edit `js/config.js` to set your backend API URL:

```javascript
const CONFIG = {
  API_BASE_URL: window.location.hostname === 'localhost'
    ? 'http://localhost:8080/api'
    : 'https://YOUR_BACKEND_URL/api'
};
```

## Deployment

Deployed to **Cloudflare Pages** (auto-deploy on push to `main`).

### Setup
1. Connect this repo to Cloudflare Pages
2. Build command: _(leave empty — static site)_
3. Build output directory: `/`

## Related
- Backend repo: [portfolio-backend](https://github.com/herayadi/portfolio-backend)
