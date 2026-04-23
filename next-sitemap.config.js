/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://sspwallet.io',
  generateRobotsTxt: false,
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 5000,
  exclude: ['/404', '/checkout_success', '/checkout_failure', '/api/*'],
  transform: async (config, path) => {
    const perPath = {
      '/': { priority: 1.0, changefreq: 'weekly' },
      '/features': { priority: 0.9, changefreq: 'monthly' },
      '/enterprise': { priority: 0.9, changefreq: 'monthly' },
      '/download': { priority: 0.9, changefreq: 'monthly' },
      '/guide': { priority: 0.8, changefreq: 'monthly' },
      '/support': { priority: 0.7, changefreq: 'weekly' },
      '/contact': { priority: 0.6, changefreq: 'monthly' },
      '/privacy-policy': { priority: 0.3, changefreq: 'yearly' },
      '/terms-of-service': { priority: 0.3, changefreq: 'yearly' },
      '/cookie-policy': { priority: 0.2, changefreq: 'yearly' },
    }
    const overrides = perPath[path] || {}
    return {
      loc: path,
      changefreq: overrides.changefreq || config.changefreq,
      priority: overrides.priority != null ? overrides.priority : config.priority,
      lastmod: new Date().toISOString(),
    }
  },
}
