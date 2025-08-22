# SSP Wallet - Website

[![CI](https://github.com/RunOnFlux/ssp-website/actions/workflows/ci.yml/badge.svg)](https://github.com/RunOnFlux/ssp-website/actions/workflows/ci.yml)

A modern, responsive website for SSP Wallet - the secure, simple, and powerful cryptocurrency wallet featuring true 2-of-2 multisignature technology with mobile authentication.

## 🚀 Key Features

- **🎨 Modern Design**: Beautiful, responsive UI with dark/light theme support and smooth animations
- **⚡ Performance Optimized**: Built with Next.js 15 + React 19, optimized images, and advanced code splitting
- ♿ **Accessibility First**: WCAG compliant with proper contrast, keyboard navigation, and screen reader support
- **🔍 SEO Excellence**: Comprehensive meta tags, Open Graph, Twitter Cards, structured data, and sitemap
- **📱 Mobile Responsive**: Flawless mobile experience with touch-friendly interactions
- **🎭 Interactive Demo**: Built-in wallet setup demonstration with realistic transaction flow
- **📞 Integrated Contact System**: Working contact and support forms with email integration
- **🛠️ Developer Experience**: ESLint, Prettier, TypeScript ready with modern tooling

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4.x](https://tailwindcss.com/) with custom design system
- **Animations**: [Framer Motion](https://www.framer.com/motion/) for smooth interactions
- **Icons**: [Lucide React](https://lucide.dev/) for consistent iconography
- **Theme**: [next-themes](https://github.com/pacocoursey/next-themes) with system preference detection
- **Forms**: React Hook Form with validation and real-time error handling
- **Images**: Next.js Image component with WebP/AVIF optimization
- **Code Quality**: ESLint, Prettier, TypeScript support
- **Performance**: Intersection Observer API for lazy loading

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/RunOnFlux/ssp-website.git
   cd ssp-website
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
ssp-website/
├── components/          # React components
│   ├── features/       # Feature sections (comparison, security, etc.)
│   ├── home/          # Homepage components (hero, interactive demo)
│   ├── InteractiveDemo/ # Wallet setup demonstration
│   ├── Footer.js      # Site footer with navigation
│   ├── Header.js      # Main navigation with theme toggle
│   └── Layout.js      # Page layout wrapper
├── pages/             # Next.js pages and API routes
│   ├── api/          # Backend API endpoints
│   │   ├── contact.js # Contact form handler
│   │   └── support.js # Support ticket handler
│   ├── index.js      # Homepage
│   ├── features.js   # Features showcase
│   ├── guide.js      # Setup guide
│   ├── support.js    # FAQ and support center
│   ├── contact.js    # Contact page
│   └── download.js   # Download instructions
├── public/            # Static assets
│   ├── images/       # Optimized images and icons
│   ├── sitemap.xml   # SEO sitemap
│   ├── robots.txt    # Search engine directives
│   └── favicon files # Various icon formats
├── styles/            # Global styles and Tailwind config
├── package.json       # Package config
└── config files       # Next.js, ESLint, Prettier, etc.
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

## 📋 SEO & Performance

### SEO Features ✅

- **Meta Tags**: Dynamic titles, descriptions, and keywords for each page
- **Open Graph**: Rich social media previews with custom images
- **Twitter Cards**: Optimized sharing for Twitter/X platform
- **Canonical URLs**: Proper URL canonicalization to prevent duplicate content
- **Structured Data**: Schema.org markup for better search engine understanding
- **Sitemap**: Complete XML sitemap with proper priorities and update frequencies
- **Robots.txt**: Search engine crawling directives

### Performance Optimizations ✅

- **Next.js Image**: Automatic WebP/AVIF conversion and responsive sizing
- **Code Splitting**: Automatic route-based and component-level splitting
- **Lazy Loading**: Intersection Observer for images and animations
- **Bundle Optimization**: Tree shaking and modern JS output
- **Caching**: Long-term caching for static assets (1 year)
- **Core Web Vitals**: Optimized for Google's performance metrics

### Form Integration ✅

- **Contact Form**: Real-time validation with email delivery to tadeas@sspwallet.io
- **Support Form**: Freshdesk ticket creation with comprehensive FAQ
- **Error Handling**: Graceful error states with retry functionality
- **Security**: Challenge headers and rate limiting protection

## 🔧 Configuration

### Environment Variables

Create `.env.local` for local development:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_GA_ID=your-google-analytics-id

# Form endpoints (configured to use SSP Relay)
NEXT_PUBLIC_CONTACT_API=https://relay.ssp.runonflux.io/v1/contact
NEXT_PUBLIC_SUPPORT_API=https://relay.ssp.runonflux.io/v1/ticket
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
6. **Open Pull Request** to [RunOnFlux/ssp-website](https://github.com/RunOnFlux/ssp-website)

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

This project is licensed under the [GNU Affero General Public License v3.0 (AGPL-3.0)](https://www.gnu.org/licenses/agpl-3.0.en.html) - see the [LICENSE](LICENSE) file for details.

The AGPL-3.0 license ensures that any modifications to this software, including those used in web services, remain open source and available to the community.

## 🌟 Website Pages

- **🏠 Homepage**: Interactive demo, feature highlights, and getting started
- **✨ Features**: Comprehensive feature comparison and security details
- **📖 Guide**: Step-by-step wallet setup with video tutorial
- **🛠️ Download**: Installation instructions for browser and mobile
- **❓ Support**: Extensive FAQ, community resources, and help center
- **📞 Contact**: Multiple contact methods and working contact form
- **⚖️ Legal**: Privacy policy, terms of service, and cookie policy

## 🔗 Links

- **🌐 Website**: [https://sspwallet.io](https://sspwallet.io)
- **🛒 Browser Extensions**: [Chrome Web Store](https://chromewebstore.google.com/detail/ssp-wallet/mgfbabcnedcejkfibpafadgkhmkifhbd) | [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/ssp-wallet)
- **📱 Mobile App**: [SSP Key](https://sspwallet.io/download) (iOS & Android)
- **💾 GitHub**: [RunOnFlux Organization](https://github.com/RunOnFlux)
- **🐦 Twitter**: [@sspwallet_io](https://twitter.com/sspwallet_io)
- **💬 Discord**: [Community Chat](https://discord.gg/runonflux)

## 🆘 Support & Resources

- **📚 Documentation**: [Complete Setup Guide](https://sspwallet.io/guide)
- **❓ FAQ**: [Support Center](https://sspwallet.io/support) with extensive Q&A
- **📧 Contact**: [Get in Touch](https://sspwallet.io/contact) - Working contact form
- **🎫 Support Tickets**: Integrated Freshdesk ticketing system
- **🐛 Issues**: [GitHub Issues](https://github.com/RunOnFlux/ssp-website/issues)
- **👥 Community**: [Discord Server](https://discord.gg/runonflux) for real-time help

---

## 🏆 Production Status

✅ **Fully Functional** - All features implemented and tested  
✅ **SEO Optimized** - Complete meta tags, structured data, and performance  
✅ **Forms Working** - Contact and support forms with email integration  
✅ **Mobile Ready** - Responsive design tested across devices  
✅ **Performance Optimized** - Core Web Vitals and loading speeds optimized  
✅ **Content Complete** - Comprehensive information and user guides

**Status: Ready for Production Deployment** 🚀

Built with ❤️ by the [RunOnFlux](https://github.com/RunOnFlux) team
