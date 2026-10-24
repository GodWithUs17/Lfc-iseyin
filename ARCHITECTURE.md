# Architecture - Living Faith Church Iseyin

## Overview

This project follows **feature-sliced design** principles adapted for a church website, prioritizing:
- **Scalability:** Easy to add new sections, pages, ministries
- **Maintainability:** Clear separation, single source of truth
- **Performance:** 95kb gzipped, lazy loading, no heavy deps
- **DX:** Path aliases, reusable UI, hot reload

## Layers

```
1. Config (src/config/)          - Site-wide constants, single source of truth
   ↓
2. Lib (src/lib/)                - Pure helpers, no side effects
   ↓
3. UI (src/components/ui/)       - Dumb, reusable, no business logic
   ↓
4. Brand/Layout (src/components/brand/, layout/) - Uses UI + Config
   ↓
5. Sections (src/components/sections/) - Composes UI + data + lib
   ↓
6. Pages (src/pages/)            - Composes sections + layout
   ↓
7. App (src/App.jsx)             - Router + Providers
```

## Data Flow

```
data.json (static) 
  → SiteDataContext (global state, localStorage override)
    → useSiteData() hook
      → Sections (Hero, Sermons, etc.)
        → UI components

Contact Form:
  User input → handleSubmit
    → localStorage (always)
    → Formspree (if configured)
    → Google Sheets (if configured)
    → WhatsApp prompt
```

## Key Decisions

### Why Context API not Redux?
- Small app, simple state (sermons, events, live)
- No need for Redux boilerplate
- Easy to migrate to Zustand/Jotai later if needed
- Ready for Supabase real-time subscriptions

### Why Hash Routing not React Router?
- No extra dependency (95kb total)
- Simple: #admin vs home
- Easy to replace with react-router-dom later:
  ```bash
  npm install react-router-dom
  # Replace App.jsx hash logic with <BrowserRouter>
  ```

### Why Tailwind v4 with @theme?
- No tailwind.config.js needed
- Colors defined in CSS, co-located with styles
- Faster build, smaller CSS (51kb → 9.6kb gzipped)

### Why Inline SVG Logo?
- No external file, crisp at any size
- No broken images, works offline
- Easy to replace with official PNG when available
- Can be animated, themed

## Adding New Features

### New Ministry Page

1. Create `src/components/sections/MinistryDetail.jsx`
2. Create `src/pages/MinistryPage.jsx` that uses it
3. Add route in `App.jsx`:
   ```jsx
   if (route === "ministry") return <MinistryPage />;
   ```
4. Add link in `config/site.js` navLinks

### Real Backend (Supabase)

1. `npm install @supabase/supabase-js`
2. Create `src/lib/supabase.js`:
   ```js
   import { createClient } from '@supabase/supabase-js';
   export const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);
   ```
3. In `SiteDataContext.jsx`, replace fetch with:
   ```js
   const { data } = await supabase.from('sermons').select('*');
   ```
4. Add real-time:
   ```js
   supabase.channel('sermons').on('postgres_changes', { event: '*', table: 'sermons' }, payload => {
     setData(prev => ({ ...prev, sermons: [payload.new, ...prev.sermons] }));
   }).subscribe();
   ```

### TypeScript Migration

1. `npm install -D typescript`
2. Rename `js` → `tsx`, add `tsconfig.json`
3. Add types in `src/types/`:
   ```ts
   type Sermon = { id: number; title: string; youtubeUrl: string; ... }
   ```

### PWA

1. `npm install vite-plugin-pwa`
2. Add to vite.config.js:
   ```js
   import { VitePWA } from 'vite-plugin-pwa';
   plugins: [react(), tailwindcss(), VitePWA({ registerType: 'autoUpdate' })]
   ```

## Performance

- **Bundle:** 324kb JS (95kb gzipped), 51kb CSS (9.6kb gzipped)
- **Images:** Unsplash CDN, lazy loading, aspect-ratio to prevent CLS
- **Fonts:** Preconnect to Google Fonts, display=swap
- **No heavy deps:** No lodash, moment, etc.

## Security

- Admin password in config, not hardcoded in component
- Form validation: required fields, phone regex
- No XSS: React escapes by default, no dangerouslySetInnerHTML
- Future: Add rate limiting via Formspree, Supabase RLS

## Testing (Future)

- Unit: Vitest + React Testing Library
- E2E: Playwright
- Visual: Chromatic

## Deployment

- **Vercel:** Zero config, auto deploy on git push
- **Netlify:** Drag dist/ or connect GitHub
- **cPanel:** Upload dist/ contents
- **Env:** Use .env.example → .env for secrets
