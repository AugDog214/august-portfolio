import { archiveDisciplines, archiveIntro, archiveNumber, archiveProjects, projectHref, type ArchiveProject } from './archive-data'
import { subFooterHtml, subNavHtml } from './chrome'
import { resolvePublicUrl } from './urls'
import './styles.css'
import './archive.css'

const app = document.querySelector<HTMLDivElement>('#app')
if (!app) throw new Error('App root not found.')

type Filter = { id: string; label: string; test: (project: ArchiveProject) => boolean }

// "Client work" is the default view: paid work is what an employer sees first
const filters: Filter[] = [
  { id: 'client', label: 'Client work', test: (project) => project.kind === 'Client' },
  { id: 'all', label: 'All', test: () => true },
  ...archiveDisciplines.map((discipline) => ({
    id: discipline.toLowerCase().replace(/[^a-z]+/g, '-'),
    label: discipline,
    test: (project: ArchiveProject) => project.discipline.includes(discipline),
  })),
]

const kindLabel = (project: ArchiveProject) => project.kind

const cardHtml = (project: ArchiveProject, index: number) => `
        <li class="arc-item${project.wide ? ' arc-item--wide' : ''}" data-arc-item data-index="${index}">
          <a class="arc-card" href="${projectHref(project.slug)}" style="--accent: ${project.accent}" aria-label="${project.name}, ${project.year}. ${kindLabel(project)} work.">
            <span class="arc-media">
              <img src="${resolvePublicUrl(project.card)}" alt="" loading="${index < 6 ? 'eager' : 'lazy'}" decoding="async" />
              <span class="arc-reveal" aria-hidden="true">
                <span class="arc-title">${project.name}</span>
                <span class="arc-year">${project.year}</span>
              </span>
              ${project.cover.kind === 'video' ? '<span class="arc-film" aria-hidden="true">Film</span>' : ''}
            </span>
            <span class="arc-meta" aria-hidden="true">
              <span class="arc-num">${archiveNumber(index)}</span>
              <span class="arc-tag">${project.discipline[0]}</span>
              <span class="arc-kind arc-kind--${project.kind.toLowerCase()}">${kindLabel(project)}</span>
            </span>
          </a>
        </li>`

app.innerHTML = `
    <a class="skip-link" href="#archive-grid">Skip to projects</a>
    <div class="grain" aria-hidden="true"></div>
    ${subNavHtml({ brand: 'Archive', brandHref: './index.html', current: 'Archive' })}

    <main class="arc-page">
      <header class="arc-intro">
        <p class="kicker">${archiveIntro.kicker}</p>
        <h1 class="arc-headline">${archiveIntro.headline}</h1>
        <p class="arc-lead">${archiveIntro.lead}</p>
      </header>

      <div class="arc-filters" role="group" aria-label="Filter projects">
        ${filters
          .map(
            (filter, index) =>
              `<button class="arc-chip${index === 0 ? ' is-active' : ''}" type="button" data-arc-filter="${filter.id}" aria-pressed="${index === 0}">${filter.label}<span class="arc-chip-count">${archiveProjects.filter(filter.test).length}</span></button>`,
          )
          .join('')}
      </div>

      <ol class="arc-grid" id="archive-grid" data-arc-grid>
        ${archiveProjects.map(cardHtml).join('')}
      </ol>
      <p class="arc-status" role="status" aria-live="polite" data-arc-status></p>
    </main>
    ${subFooterHtml()}
`

const items = Array.from(document.querySelectorAll<HTMLElement>('[data-arc-item]'))
const chips = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-arc-filter]'))
const status = document.querySelector<HTMLElement>('[data-arc-status]')

const apply = (id: string, announce = true) => {
  const filter = filters.find((entry) => entry.id === id) ?? filters[0]
  let shown = 0
  items.forEach((item, index) => {
    const on = filter.test(archiveProjects[index])
    item.hidden = !on
    if (on) {
      // restart the stagger so the visible set arrives in order
      item.style.setProperty('--arc-i', String(shown))
      shown += 1
    }
  })
  chips.forEach((chip) => {
    const active = chip.dataset.arcFilter === filter.id
    chip.classList.toggle('is-active', active)
    chip.setAttribute('aria-pressed', String(active))
  })
  if (status && announce) status.textContent = `${shown} project${shown === 1 ? '' : 's'} shown: ${filter.label}.`
  // the view is part of the URL, so a filtered archive can be shared
  const url = new URL(window.location.href)
  if (filter.id === filters[0].id) url.searchParams.delete('view')
  else url.searchParams.set('view', filter.id)
  window.history.replaceState(null, '', url)
}

chips.forEach((chip) => chip.addEventListener('click', () => apply(chip.dataset.arcFilter ?? '')))
apply(new URL(window.location.href).searchParams.get('view') ?? filters[0].id, false)
