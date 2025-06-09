# React + Vite + Tailwind CSS v4

This project was set up with React, Vite, and Tailwind CSS v4 (beta).

## Features

- ⚡ **Vite** - Lightning fast build tool and dev server
- ⚛️ **React** - Modern component-based UI library
- 🎨 **Tailwind CSS v4** - Next-generation utility-first CSS framework
- 🔥 **Hot Module Replacement** - Instant updates during development

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

Dependencies are already installed. To run the project:

```bash
npm run dev
```

This will start the development server at `http://localhost:5173/`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint code with ESLint

## Tailwind CSS v4

This project uses Tailwind CSS v4 (beta), which features:

- Faster build times
- Smaller bundle sizes
- Improved performance
- New features and optimizations

The configuration is minimal - just import Tailwind in your CSS:

```css
@import "tailwindcss";
```

## Project Structure

```
src/
├── App.jsx          # Main App component with Tailwind demo
├── main.jsx         # React entry point
├── index.css        # Tailwind CSS import
└── assets/          # Static assets
```

## Customization

To customize Tailwind CSS, you can create a `tailwind.config.js` file in the root directory. However, Tailwind CSS v4 aims to require minimal configuration out of the box.

## Learn More

- [Vite Documentation](https://vite.dev/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)

## Original Vite Template Information

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
