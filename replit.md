# Українське Право (Ukrainian Law)

An Angular 21 news website about Ukrainian law with Server-Side Rendering (SSR).

## Tech Stack

- **Framework**: Angular 21 with SSR (`@angular/ssr`)
- **Styling**: Tailwind CSS 4 with PostCSS
- **Language**: TypeScript 5.9
- **SSR Server**: Express 5 (served via `@angular/ssr/node`)
- **Package Manager**: npm

## Project Structure

```
src/
  app/
    components/
      article-page/   - Article detail page
      footer/         - Footer component
      header/         - Header with search/nav
      hero/           - Hero section
      home/           - Home page
      main-content/   - Main content area
      navigation/     - Navigation bar
      sidebar-left/   - Left sidebar
      sidebar-right/  - Right sidebar
    app.ts            - Root component
    app.routes.ts     - Routes (/, /news/:id)
    app.config.ts     - App configuration
  main.ts             - Browser entry point
  main.server.ts      - Server entry point
  server.ts           - Express SSR server
public/               - Static assets (logo, favicon)
```

## Routes

- `/` - Home page
- `/news/:id` - Article page

## Development

The workflow `Start application` runs:
```
npm run start -- --host 0.0.0.0 --port 5000
```

## Key Configuration

### angular.json

- `serve.options.allowedHosts`: Allows `localhost`, `127.0.0.1`, `.replit.dev`, `.repl.co` for Replit proxy compatibility
- `serve.options.host`: `0.0.0.0` (required for Replit)
- `serve.options.port`: `5000` (required for Replit webview)
- `build.options.security.allowedHosts`: Also set for SSR SSRF protection bypass

## Deployment

- Target: `autoscale`
- Build: `npm run build`
- Run: `node dist/client/server/server.mjs`
