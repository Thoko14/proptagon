# Proptagon Landing Page

A static marketing landing page for Proptagon - a comprehensive property investment platform for Australia.

## Overview

This is a standalone static website showcasing Proptagon's modules and features. It serves as a marketing site with landing pages for each module:

- **Grow** - Property growth analysis with interactive maps (Live)
- **Invest** - Investment decisions and planning (Coming Soon)
- **Strategise** - Strategic portfolio management and analytics (Coming Soon)
- **Manage** - Property management operations and administration (Coming Soon)
- **Sell** - Strategic selling and market timing (In Development)

## Features

- Responsive design with Tailwind CSS
- Modern React 18 with TypeScript
- Static site generation with Vite
- Clean, professional UI components
- Mobile-first design approach

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
cd platform
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

The built files will be in the `platform/dist` directory, ready for deployment to any static hosting service.

### Preview

```bash
npm run preview
```

## Project Structure

```
propbase-landing/
├── platform/           # Main React application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Landing pages
│   │   └── styles/     # Global styles
│   └── public/         # Static assets
├── modules/            # Module-specific landing pages
│   ├── grow/          # Grow module landing page
│   ├── invest/        # Invest module landing page
│   ├── strategise/    # Strategise module landing page
│   ├── manage/        # Manage module landing page
│   └── sell/          # Sell module landing page
└── shared/            # Shared utilities and types
```

## Deployment

This is a static site that can be deployed to:

- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Any static hosting service

Simply build the project and upload the `platform/dist` directory contents.

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Router** - Client-side routing

## License

MIT License - see LICENSE file for details.