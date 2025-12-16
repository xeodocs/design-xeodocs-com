# XeoContext

XeoContext is a modern "System Design" visualization tool built with Next.js and Tailwind CSS. It is designed to be a lightweight, self-contained viewer for:

- **System Design documents**: Markdown files with Mermaid diagram support.
- **OpenAPI definitions**: visualized using Swagger UI.
- **AsyncAPI definitions**: visualized using AsyncAPI React component.

The application is designed to be deployed as a Docker container with a read-only volume mounted to provide the content.

## Features

- **Theme Support**: Light, Dark, and System modes.
- **Static Export**: Runs entirely client-side, no backend required.
- **Dynamic Content**: Content is loaded from the `/content` directory at runtime.
- **Docker Ready**: Designed for volume mounting content.

## Usage

### Development

1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Run development server:
   ```bash
   pnpm dev
   ```
3. Open [http://localhost:3000](http://localhost:3000).

### Content Configuration

The application reads from the `public/content` directory (which becomes `/content` in the production build).

**Directory Structure:**
```
/content
├── xeocontext.config.json  # Main configuration
├── system-design.md        # System design markdown
├── openapi.yaml           # OpenAPI specification
└── asyncapi.yaml          # AsyncAPI specification
```

**xeocontext.config.json Example:**
```json
{
  "title": "My API Documentation",
  "files": {
    "systemDesign": "system-design.md",
    "openapi": "openapi.yaml",
    "asyncapi": "asyncapi.yaml"
  }
}
```

### Docker Deployment

To update the content without rebuilding the image, mount a volume to `/app/public/content` (or wherever the static assets are served from, usually just `/content` relative to the web root if served via Nginx, but for Next.js static export `out`, it would be inside the web root).

When running the static export, the output is in `out`.
If serving via Nginx:
```bash
docker run -v $(pwd)/my-content:/usr/share/nginx/html/content my-xeocontext-image
```

## AI Integration

This repository is designed to be the "Source of Truth" for system design. The `public/content` directory is intended to be read by AI Coding Agents (via MCP Servers or direct access) to scaffold and maintain other repositories based on the designs defined here.
