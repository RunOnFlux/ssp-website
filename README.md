# SSP Wallet - Modern Website

[![CI](https://github.com/your-org/ssp-modern/actions/workflows/ci.yml/badge.svg)](https://github.com/your-org/ssp-modern/actions/workflows/ci.yml)

A modern, responsive website for SSP Wallet - the secure, simple, and powerful crypto wallet with multi-signature support and mobile authentication.

## 🚀 Features

- **Modern Design**: Beautiful, responsive UI with dark/light theme support
- **Performance Optimized**: Built with Next.js 15, optimized images and code splitting
- **Accessibility**: WCAG compliant with proper contrast and keyboard navigation
- **SEO Ready**: Comprehensive meta tags, Open Graph, and structured data
- **Developer Experience**: ESLint, Prettier, TypeScript ready, and GitHub Actions CI

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Theme**: [next-themes](https://github.com/pacocoursey/next-themes)
- **Code Quality**: ESLint, Prettier, Husky (optional)

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ssp-modern
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open in browser**
   Visit [http://localhost:3000](http://localhost:3000)

## 🧑‍💻 Development

### Available Scripts

| Command                | Description                         |
| ---------------------- | ----------------------------------- |
| `npm run dev`          | Start development server            |
| `npm run build`        | Build for production                |
| `npm run start`        | Start production server             |
| `npm run lint`         | Run ESLint checks                   |
| `npm run lint:fix`     | Fix auto-fixable ESLint issues      |
| `npm run format`       | Format code with Prettier           |
| `npm run format:check` | Check if code is formatted          |
| `npm run type-check`   | Run TypeScript checks               |
| `npm run pre-commit`   | Run lint fixes and formatting       |
| `npm run check-all`    | Run all checks (type, lint, format) |

### Code Quality Tools

#### ESLint Configuration

- **Extends**: Next.js recommended, React best practices, accessibility rules
- **Rules**: Import ordering, unused variables, quote consistency
- **Plugins**: React, React Hooks, JSX A11y, Import, Prettier integration

#### Prettier Configuration

- **Style**: Single quotes, no semicolons, trailing commas
- **Integration**: Tailwind CSS class sorting
- **Line Length**: 100 characters
- **Indentation**: 2 spaces

#### VS Code Setup

The project includes VS Code settings for optimal development experience:

- Format on save enabled
- ESLint auto-fix on save
- Recommended extensions list
- Tailwind CSS IntelliSense configuration

### Pre-commit Workflow

```bash
# Run before committing
npm run pre-commit

# Or run individual checks
npm run type-check
npm run lint
npm run format:check
```

## 📁 Project Structure

```
ssp-modern/
├── components/          # React components
│   ├── features/       # Feature-specific components
│   ├── home/          # Home page components
│   └── ui/            # Reusable UI components
├── hooks/             # Custom React hooks
├── lib/               # Utility functions
├── pages/             # Next.js pages
├── public/            # Static assets (images, icons)
├── styles/            # Global styles
└── config files       # ESLint, Prettier, Tailwind, etc.
```

## 🎨 Design System

### Colors

- **Primary**: Blue/Purple gradient theme
- **Secondary**: Complementary accent colors
- **Neutral**: Gray scale for text and backgrounds
- **Status**: Success (green), Warning (yellow), Error (red)

### Typography

- **Headings**: Responsive scale with proper hierarchy
- **Body**: Optimized for readability across devices
- **Code**: Monospace font for technical content

### Components

- **Responsive**: Mobile-first design approach
- **Consistent**: Reusable component library
- **Accessible**: ARIA labels and keyboard navigation
- **Animated**: Smooth transitions with Framer Motion

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `.next`
4. Deploy automatically on commits

### Manual Build

```bash
npm run build
npm run start
```

### Docker (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📋 SEO & Analytics

### SEO Features

- Meta tags for all pages
- Open Graph and Twitter Cards
- Canonical URLs
- Structured data markup
- Sitemap generation (add sitemap.xml)

### Performance

- Image optimization with Next.js Image component
- Code splitting and lazy loading
- Core Web Vitals optimization
- Service worker ready

## 🔧 Configuration

### Environment Variables

Create `.env.local` for local development:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

### Tailwind CSS

Customize theme in `tailwind.config.js`:

- Colors, fonts, spacing
- Responsive breakpoints
- Custom utilities

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Run quality checks**: `npm run check-all`
4. **Commit changes**: `git commit -m 'Add amazing feature'`
5. **Push to branch**: `git push origin feature/amazing-feature`
6. **Open Pull Request**

### Commit Convention

Use conventional commits for automated changelog generation:

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation updates
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test updates
- `chore:` Build process or auxiliary tool changes

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Website**: [https://sspwallet.io](https://sspwallet.io)
- **Chrome Extension**: [SSP Wallet](https://chromewebstore.google.com/detail/ssp-wallet/mgfbabcnedcejkfibpafadgkhmkifhbd)
- **GitHub**: [RunOnFlux](https://github.com/RunOnFlux)
- **Twitter**: [@sspwallet_io](https://twitter.com/sspwallet_io)

## 🆘 Support

- **Documentation**: [Setup Guide](https://sspwallet.io/guide)
- **FAQ**: [Support Center](https://sspwallet.io/support)
- **Contact**: [Get in Touch](https://sspwallet.io/contact)
- **Issues**: [GitHub Issues](https://github.com/your-org/ssp-modern/issues)

---

Built with ❤️ by the SSP Wallet team
