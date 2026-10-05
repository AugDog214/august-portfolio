import { portfolioContent, siteMeta } from './content'

/**
 * Header and footer for the pages outside the home scroll (Archive, project
 * pages). Same nav links as the home page; in-page anchors point back at it.
 */
export const subPageLinks = portfolioContent.navigation.links.map((link) => ({
  label: link.label,
  href: link.href.startsWith('#') ? `./index.html${link.href}` : link.href,
}))

export const subNavHtml = (options: { brand: string; brandHref: string; light?: boolean; current?: string }) => `
    <header class="site-nav scrolled sub-nav${options.light ? ' nav--light' : ''}" data-nav>
      <a class="nav-brand sub-nav-brand" href="${options.brandHref}">${options.brand}</a>
      <nav class="nav-links" aria-label="Primary">
        ${subPageLinks
          .map(
            (link, index) =>
              `${index > 0 ? '<span class="nav-separator" aria-hidden="true">|</span>' : ''}<a href="${link.href}"${link.label === options.current ? ' aria-current="page"' : ''}>${link.label}</a>`,
          )
          .join('')}
      </nav>
    </header>`

export const subFooterHtml = () => `
      <footer class="sub-footer">
        <a class="sub-footer-email" href="mailto:${siteMeta.email}">${siteMeta.email}</a>
        <p class="sub-footer-links">
          <a href="./index.html">Portfolio</a>
          <a href="./archive.html">Archive</a>
          <a href="./leveraging-ai.html">Leveraging AI</a>
          ${siteMeta.socials.map((social) => `<a href="${social.href}" target="_blank" rel="noreferrer">${social.label}</a>`).join('')}
        </p>
        <p class="sub-footer-sign">${portfolioContent.contact.signoff.join(' · ')}</p>
      </footer>`
