'use strict';

/* =========================================
   CNA — COSMODENT NATIONAL ACADEMY
   Vanilla JavaScript Content & UI Engine
========================================= */

/* 1. ROUTES */
const ROUTES = {
  home: '/',
  about: '/about',
  courses: '/courses',
  courseDetails: '/course-details',
  workshops: '/workshops',
  workshopDetails: '/workshop-details',
  faculty: '/faculty',
  infrastructure: '/infrastructure',
  gallery: '/gallery',
  contact: '/contact',
  notFound: '/404'
};

/* 2. LOCAL CONTENT */
const SiteSettings = {
  name: 'Cosmodent National Academy',
  shortName: 'CNA',
  location: 'Pune, Maharashtra, India',
  logo: '/images/logo.png',
  address: null,
  phone: null,
  email: null,
  whatsapp: null,
  mapsUrl: null,
  socialLinks: [],
  about: null,
  mission: null,
  vision: null,
  teachingPhilosophy: null
};

const HomePageContent = {
  eyebrow: 'COSMODENT NATIONAL ACADEMY',
  heading: 'A new perspective on dental education.',
  description: 'Discover Cosmodent National Academy. A place to explore dental education, learning opportunities and the people behind CNA in Pune.',
  heroImage: null,
  aboutImage: null,
  aboutPreview: null,
  whyChoose: []
};

const DESIGN_IMAGES = {
  dentalEducation: 'images/image.png'
};

const Courses = [];
const Workshops = [];
const Faculty = [];
const Infrastructure = [];
const Gallery = [];
const Testimonials = [];
const Achievements = [];

/* 3. API CONFIGURATION */
const API_CONFIG = {
  API_BASE_URL: 'https://cna-api.sovicle.com',
  USE_API: true,
  CONTENT_ENDPOINT: '/api/public/content',
  TIMEOUT_MS: 15000
};

const COLLECTION_KEYS = [
  'Courses',
  'Workshops',
  'Faculty',
  'Infrastructure',
  'Gallery',
  'Testimonials',
  'Achievements'
];

const LOCAL_CONTENT = {
  SiteSettings,
  HomePageContent,
  Courses,
  Workshops,
  Faculty,
  Infrastructure,
  Gallery,
  Testimonials,
  Achievements
};

let content = LOCAL_CONTENT;
let galleryItems = [];
let galleryIndex = 0;
let lightboxReturnFocus = null;
let courseQuery = '';
let courseCategory = 'All';
let galleryCategory = 'All';

const main = document.getElementById('main-content');
const page = document.body.dataset.page || 'home';

/* 4. NAVIGATION */

const NAV = [
  ['home', 'Home', ROUTES.home],
  ['about', 'About', ROUTES.about],
  ['courses', 'Courses', ROUTES.courses],
  ['workshops', 'Workshops', ROUTES.workshops],
  ['faculty', 'Faculty', ROUTES.faculty],
  ['gallery', 'Gallery', ROUTES.gallery],
  ['contact', 'Contact', ROUTES.contact]
];

const PAGE_COPY = {
  about: [
    'THE ACADEMY',
    'Get to know CNA.',
    'An introduction to Cosmodent National Academy, Pune.'
  ],
  courses: [
    'EXPLORE & LEARN',
    'Your next chapter starts here.',
    'Explore the courses at Cosmodent National Academy.'
  ],
  workshops: [
    'LEARNING IN FOCUS',
    'Discover our workshops.',
    'Explore workshops and academy activities as they are announced.'
  ],
  faculty: [
    'THE PEOPLE BEHIND CNA',
    'Meet our faculty.',
    'Get to know the educators at Cosmodent National Academy.'
  ],
  infrastructure: [
    'SPACES FOR LEARNING',
    'Inside the academy.',
    'Explore CNA’s learning spaces, training facilities and equipment.'
  ],
  gallery: [
    'LIFE AT CNA',
    'A closer look.',
    'A visual collection of academy moments, activities and spaces.'
  ],
  contact: [
    'LET’S CONNECT',
    'Find us in Pune.',
    'Available contact information for Cosmodent National Academy.'
  ]
};

/* 5. UTILITIES */

const escapeHTML = (value) =>
  String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));

const nonEmpty = (value) =>
  typeof value === 'string'
    ? Boolean(value.trim())
    : value !== null && value !== undefined;

const list = (value) =>
  Array.isArray(value)
    ? value.filter((item) => item && typeof item === 'object')
    : [];

function safeURL(value, fallback = '') {
  if (typeof value !== 'string' || !value.trim()) return fallback;

  try {
    const url = new URL(value, window.location.origin);

    return ['http:', 'https:'].includes(url.protocol)
      ? value
      : fallback;

  } catch {
    return fallback;
  }
}

/* 6. ICONS */

function icon(name = 'arrow', className = '') {
  const paths = {
    arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
    book: '<path d="M12 6c-3-3-7-3-10-1v14c3-2 7-2 10 1 3-3 7-3 10-1V5c-3-2-7-2-10 1Zm0 0v14"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    spark: '<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z"/>',
    people: '<circle cx="9" cy="8" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3m1-16a3 3 0 0 1 0 6m2 4a5 5 0 0 1 3 5"/>',
    image: '<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="1.5"/><path d="m3 17 5-5 4 4 4-6 5 7"/>',
    search: '<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>',
    close: '<path d="m6 6 12 12M6 18 18 6"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
    phone: '<path d="M8 3H4v5c0 7 5 12 12 12h4v-4l-5-2-2 2a12 12 0 0 1-5-5l2-2-2-6Z"/>'
  };

  return `
    <svg class="icon ${escapeHTML(className)}"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true">
      ${paths[name] || paths.arrow}
    </svg>
  `;
}

/* 7. BUTTONS AND IMAGES */

function button(label, href, variant = 'primary') {
  return `
    <a class="btn btn-${variant}"
       href="${escapeHTML(safeURL(href, ROUTES.home))}">
      ${escapeHTML(label)}
      ${icon()}
    </a>
  `;
}

function imageMarkup(src, alt, className = '', eager = false) {
  const url = safeURL(src);

  if (!url) return '';

  return `
    <img
      src="${escapeHTML(url)}"
      alt="${escapeHTML(alt || '')}"
      class="${escapeHTML(className)}"
      loading="${eager ? 'eager' : 'lazy'}"
      decoding="async">
  `;
}

/* 8. BRAND */

function brand(footer = false) {
  return `
    <a class="brand ${footer ? 'brand-footer' : ''}"
       href="${ROUTES.home}"
       aria-label="CNA — home">

      ${imageMarkup(
        content.SiteSettings.logo,
        'CNA official tooth logo',
        'brand-logo',
        true
      )}

      <span class="brand-name">
        CNA
        <span class="brand-full">
          COSMODENT NATIONAL ACADEMY
        </span>
      </span>

    </a>
  `;
}

/* 9. HEADER */

function renderHeader() {
  const active =
    page === 'course-details' ? 'courses' :
    page === 'workshop-details' ? 'workshops' :
    page;

  document.getElementById('site-header').innerHTML = `
    <div class="container header-inner">

      ${brand()}

      <button
        id="menu-toggle"
        class="icon-btn menu-toggle"
        type="button"
        aria-label="Open navigation"
        aria-controls="primary-navigation"
        aria-expanded="false">

        ${icon('menu')}

      </button>

      <nav id="primary-navigation" aria-label="Main navigation">

        ${NAV.map(([id, label, href]) => `
          <a href="${href}"
             ${active === id ? 'class="active" aria-current="page"' : ''}>
            ${label}
          </a>
        `).join('')}

        <a class="nav-cta" href="${ROUTES.courses}">
          Explore CNA ${icon()}
        </a>

      </nav>

    </div>
  `;

  document.getElementById('menu-toggle')
    .addEventListener('click', () => {
      setMenu(!document.body.classList.contains('menu-open'));
    });

  document.getElementById('primary-navigation')
    .addEventListener('click', (event) => {
      if (event.target.closest('a')) setMenu(false);
    });
}

function setMenu(open) {
  document.body.classList.toggle('menu-open', open);

  const toggle = document.getElementById('menu-toggle');

  toggle.setAttribute('aria-expanded', String(open));

  toggle.setAttribute(
    'aria-label',
    open ? 'Close navigation' : 'Open navigation'
  );

  toggle.innerHTML = icon(open ? 'close' : 'menu');
}

/* 10. FOOTER */

function socialMarkup() {
  return list(content.SiteSettings.socialLinks)
    .filter((item) => nonEmpty(item.label) && safeURL(item.url))
    .map((item) => `
      <a href="${escapeHTML(safeURL(item.url))}"
         target="_blank"
         rel="noopener noreferrer">

        ${escapeHTML(item.label)}
        ${icon()}

      </a>
    `).join('');
}

function renderFooter() {
  const settings = content.SiteSettings;

  document.getElementById('site-footer').innerHTML = `
    <div class="container">

      <div class="footer-top">

        <div class="footer-brand">

          ${brand(true)}

          <p>Dental education. A fresh perspective.</p>

          <span class="footer-location">
            ${icon('pin')}
            ${escapeHTML(settings.location)}
          </span>

        </div>

        <div class="footer-links">

          <h2>Explore the academy</h2>

          <div>
            ${NAV.slice(0, 4).map(([, label, href]) => `
              <a href="${href}">${label}</a>
            `).join('')}
          </div>

        </div>

        <div class="footer-links">

          <h2>Discover more</h2>

          <div>
            <a href="${ROUTES.faculty}">Faculty</a>
            <a href="${ROUTES.infrastructure}">Infrastructure</a>
            <a href="${ROUTES.gallery}">Gallery</a>
            <a href="${ROUTES.contact}">Contact</a>
          </div>

        </div>

        ${socialMarkup() ? `
          <div class="footer-links">
            <h2>Follow CNA</h2>
            <div>${socialMarkup()}</div>
          </div>
        ` : ''}

      </div>

      <div class="footer-bottom">

        <span>
          © ${new Date().getFullYear()}
          ${escapeHTML(settings.name)}.
        </span>

        <span>Pune, Maharashtra, India</span>

      </div>

    </div>
  `;
}

/* 11. PAGE COMPONENTS */

function pageHero(key) {
  const [eyebrow, title, description] = PAGE_COPY[key];

  return `
    <section class="page-hero">

      <div class="container">

        <a class="breadcrumb" href="${ROUTES.home}">Home</a>

        <span class="breadcrumb-separator">/</span>

        <span class="breadcrumb">
          ${escapeHTML(key.charAt(0).toUpperCase() + key.slice(1))}
        </span>

        <div class="eyebrow">${eyebrow}</div>

        <h1>${title}</h1>

        <p>${description}</p>

      </div>

    </section>
  `;
}

function emptyState(title, description, type = 'book', action = '') {
  return `
    <div class="empty-state">

      <span class="empty-icon">
        ${icon(type)}
      </span>

      <h2>${escapeHTML(title)}</h2>

      <p>${escapeHTML(description)}</p>

      ${action}

    </div>
  `;
}

function sectionHeading(eyebrow, title, link = '', linkLabel = 'View all') {
  return `
    <div class="section-heading">

      <div>
        <span class="eyebrow">${escapeHTML(eyebrow)}</span>
        <h2>${escapeHTML(title)}</h2>
      </div>

      ${link ? `
        <a class="text-link"
           href="${escapeHTML(link)}">

          ${escapeHTML(linkLabel)}
          ${icon()}

        </a>
      ` : ''}

    </div>
  `;
}

function paragraph(text) {
  return nonEmpty(text)
    ? String(text).split(/\n\s*\n/)
        .map((part) => `
          <p>${escapeHTML(part).replace(/\n/g, '<br>')}</p>
        `).join('')
    : '';
}

function contentBlock(title, text) {
  return nonEmpty(text)
    ? `
      <section class="detail-section">
        <h2>${escapeHTML(title)}</h2>
        ${paragraph(text)}
      </section>
    `
    : '';
}

function collectionSection(
  items,
  heading,
  eyebrow,
  renderer,
  link = '',
  className = ''
) {
  if (!items.length) return '';

  return `
    <section class="section ${className}">

      <div class="container">

        ${sectionHeading(eyebrow, heading, link)}

        <div class="card-grid">
          ${items.map(renderer).join('')}
        </div>

      </div>

    </section>
  `;
}

/* 12. CONTENT CARDS */

function programCard(item, type = 'course') {
  const href = type === 'course'
    ? `${ROUTES.courseDetails}?slug=${encodeURIComponent(item.slug || '')}`
    : `${ROUTES.workshopDetails}?slug=${encodeURIComponent(item.slug || '')}`;

  const metadata = type === 'course'
    ? item.duration
    : item.date;

  return `
    <article class="content-card reveal">

      ${imageMarkup(
        item.image || item.coverImage,
        item.imageAlt || item.title,
        'card-image'
      )}

      <div class="card-body">

        ${item.category ? `
          <span class="tag">${escapeHTML(item.category)}</span>
        ` : ''}

        <h3>
          <a href="${href}">
            ${escapeHTML(item.title)}
          </a>
        </h3>

        ${paragraph(item.shortDescription || item.description)}

        ${metadata ? `
          <span class="card-meta">
            ${escapeHTML(metadata)}
          </span>
        ` : ''}

        <a class="text-link" href="${href}">
          View ${type} ${icon()}
        </a>

      </div>

    </article>
  `;
}

function facultyCard(item) {
  return `
    <article class="content-card faculty-card reveal">

      ${imageMarkup(
        item.image || item.photograph,
        item.name,
        'card-image'
      )}

      <div class="card-body">

        <h3>${escapeHTML(item.name)}</h3>

        ${item.designation ? `
          <p class="designation">${escapeHTML(item.designation)}</p>
        ` : ''}

        ${item.qualifications ? `
          <p>
            ${escapeHTML(
              Array.isArray(item.qualifications)
                ? item.qualifications.join(', ')
                : item.qualifications
            )}
          </p>
        ` : ''}

        ${item.experience ? `
          <p>${escapeHTML(item.experience)}</p>
        ` : ''}

        ${paragraph(item.biography)}

        ${Array.isArray(item.expertise) && item.expertise.length ? `
          <div class="expertise">

            ${item.expertise.map((value) => `
              <span class="tag">${escapeHTML(value)}</span>
            `).join('')}

          </div>
        ` : ''}

      </div>

    </article>
  `;
}

function facilityCard(item) {
  return `
    <article class="content-card reveal">

      ${imageMarkup(
        item.image,
        item.imageAlt || item.title,
        'card-image'
      )}

      <div class="card-body">

        <h3>${escapeHTML(item.title)}</h3>

        ${paragraph(item.description)}

      </div>

    </article>
  `;
}

/* 13. HOME PAGE */

function renderHome() {
  const home = content.HomePageContent;
  const why = list(home.whyChoose);
  const about = home.aboutPreview || content.SiteSettings.about;

  main.innerHTML = `

    <section class="home-hero container">

      <div class="hero-panel">

        <div class="hero-copy">

          <span class="eyebrow">
            <span class="eyebrow-line"></span>
            ${escapeHTML(home.eyebrow)}
          </span>

          <h1>
            ${escapeHTML(home.heading).replace(
              'dental education.',
              '<span>dental education.</span>'
            )}
          </h1>

          <p>${escapeHTML(home.description)}</p>

          <div class="button-group">

            ${button('Explore Courses', ROUTES.courses)}

            ${button('About CNA', ROUTES.about, 'outline')}

          </div>

          <div class="hero-location">

            ${icon('pin')}

            <span>${escapeHTML(content.SiteSettings.location)}</span>

          </div>

        </div>

        <figure class="hero-media">

          ${imageMarkup(
            home.heroImage || DESIGN_IMAGES.dentalEducation,
            'Illustrative dental education image: gloved hands demonstrating a dental study model',
            'hero-image',
            true
          )}

          <div class="image-label">

            <span>${icon('book')}</span>

            <div>
              See learning differently.
              <small>Explore the world of dental education</small>
            </div>

          </div>

          <figcaption>
            Illustrative dental education imagery. Not a CNA facility.
          </figcaption>

        </figure>

      </div>

    </section>

    <section class="intro-ribbon container" aria-label="Academy introduction">

      <span class="ribbon-label">A WORLD OF LEARNING</span>

      <p>Curiosity. Knowledge. <span>A new perspective.</span></p>

      <a href="${ROUTES.about}" aria-label="Discover CNA">
        ${icon()}
      </a>

    </section>

    <section class="section home-discover">

      <div class="container">

        ${sectionHeading(
          'DISCOVER CNA',
          'Take a closer look.',
          ROUTES.about,
          'Meet the academy'
        )}

        <div class="discover-grid">

          <a class="discover-card reveal" href="${ROUTES.courses}">

            <span class="discover-icon">${icon('book')}</span>
            <span class="card-number">01</span>

            <h3>Explore courses</h3>

            <p>Find your next learning opportunity.</p>

            <span class="text-link">
              Discover courses ${icon()}
            </span>

          </a>

          <a class="discover-card reveal" href="${ROUTES.workshops}">

            <span class="discover-icon">${icon('spark')}</span>
            <span class="card-number">02</span>

            <h3>Workshops & activities</h3>

            <p>Stay connected to learning at CNA.</p>

            <span class="text-link">
              Explore workshops ${icon()}
            </span>

          </a>

          <a class="discover-card reveal" href="${ROUTES.faculty}">

            <span class="discover-icon">${icon('people')}</span>
            <span class="card-number">03</span>

            <h3>The people behind CNA</h3>

            <p>Get to know the academy’s educators.</p>

            <span class="text-link">
              Meet our faculty ${icon()}
            </span>

          </a>

        </div>

      </div>

    </section>

    ${about ? `

      <section class="section soft-section">

        <div class="container about-grid">

          <div>

            ${imageMarkup(
              home.aboutImage,
              'Illustrative dental education imagery',
              'rounded-image'
            )}

            <span class="media-caption">
              Illustrative dental education imagery.
            </span>

          </div>

          <div>

            <span class="eyebrow">ABOUT THE ACADEMY</span>

            <h2>A closer look at CNA.</h2>

            ${paragraph(about)}

            ${button('Read More', ROUTES.about)}

          </div>

        </div>

      </section>

    ` : ''}

    ${collectionSection(
      content.Courses.slice(0, 3),
      'Explore our courses.',
      'LEARNING OPPORTUNITIES',
      (item) => programCard(item),
      ROUTES.courses
    )}

    ${collectionSection(
      content.Workshops.slice(0, 3),
      'Workshops & activities.',
      'LEARN & CONNECT',
      (item) => programCard(item, 'workshop'),
      ROUTES.workshops
    )}

    ${collectionSection(
      why,
      'Why choose CNA.',
      'THE CNA APPROACH',
      (item) => `
        <article class="content-card">
          <div class="card-body">
            <h3>${escapeHTML(item.title)}</h3>
            ${paragraph(item.description)}
          </div>
        </article>
      `
    )}

    ${collectionSection(
      content.Faculty.slice(0, 3),
      'Meet our faculty.',
      'OUR EDUCATORS',
      facultyCard,
      ROUTES.faculty
    )}

    ${collectionSection(
      content.Infrastructure.slice(0, 3),
      'Spaces for learning.',
      'INFRASTRUCTURE',
      facilityCard,
      ROUTES.infrastructure
    )}

    ${content.Gallery.length ? `

      <section class="section">

        <div class="container">

          ${sectionHeading(
            'LIFE AT CNA',
            'Academy moments.',
            ROUTES.gallery
          )}

          <div class="gallery-grid">

            ${content.Gallery.slice(0, 4).map((item) => `
              <a href="${ROUTES.gallery}" class="gallery-preview">
                ${imageMarkup(
                  item.image,
                  item.caption || item.title || 'Academy gallery image'
                )}
              </a>
            `).join('')}

          </div>

        </div>

      </section>

    ` : ''}

    ${collectionSection(
      content.Testimonials.filter((item) => item.quote && item.name),
      'In their own words.',
      'TESTIMONIALS',
      (item) => `
        <figure class="testimonial content-card">

          <blockquote>${escapeHTML(item.quote)}</blockquote>

          <figcaption>
            ${escapeHTML(item.name)}
            ${item.designation ? `
              <span>${escapeHTML(item.designation)}</span>
            ` : ''}
          </figcaption>

        </figure>
      `
    )}

    <section class="section visit-section">

      <div class="container visit-panel">

        <div>

          <span class="eyebrow">COSMODENT NATIONAL ACADEMY</span>

          <h2>
            A fresh perspective.<br>
            A place to begin.
          </h2>

          <p>Discover more about CNA in Pune.</p>

        </div>

        ${button('Discover the Academy', ROUTES.about, 'secondary')}

      </div>

    </section>

  `;
}

/* 14. ABOUT PAGE */

function renderAbout() {
  const settings = content.SiteSettings;

  main.innerHTML = `

    ${pageHero('about')}

    <section class="section">

      <div class="container about-grid">

        <figure class="about-media">

          ${imageMarkup(
            content.HomePageContent.aboutImage ||
            content.HomePageContent.heroImage ||
            DESIGN_IMAGES.dentalEducation,
            'Illustrative demonstration using a dental study model',
            'rounded-image'
          )}

          <figcaption class="media-caption">
            Illustrative dental education imagery. Not a CNA facility.
          </figcaption>

        </figure>

        <div>

          <span class="eyebrow">COSMODENT NATIONAL ACADEMY</span>

          <h2>Introducing CNA.</h2>

          <p class="lead">
            ${escapeHTML(settings.name)} is a dental education academy
            located in ${escapeHTML(settings.location)}.
          </p>

          ${settings.about
            ? paragraph(settings.about)
            : '<p>Further information about the academy, its approach and teaching programs will be shared here when available.</p>'
          }

          ${button('Explore Courses', ROUTES.courses)}

        </div>

      </div>

    </section>

    ${settings.mission || settings.vision ? `

      <section class="section soft-section">

        <div class="container two-grid">

          ${settings.mission ? `

            <article class="statement-card">

              <span class="eyebrow">OUR PURPOSE</span>

              <h2>Our mission</h2>

              ${paragraph(settings.mission)}

            </article>

          ` : ''}

          ${settings.vision ? `

            <article class="statement-card">

              <span class="eyebrow">LOOKING AHEAD</span>

              <h2>Our vision</h2>

              ${paragraph(settings.vision)}

            </article>

          ` : ''}

        </div>

      </section>

    ` : ''}

    ${settings.teachingPhilosophy ? `

      <section class="section">

        <div class="container prose">

          ${contentBlock(
            'Our teaching philosophy',
            settings.teachingPhilosophy
          )}

        </div>

      </section>

    ` : ''}

    ${collectionSection(
      content.Faculty.slice(0, 3),
      'Meet our faculty.',
      'OUR EDUCATORS',
      facultyCard,
      ROUTES.faculty
    )}

    ${collectionSection(
      content.Infrastructure.slice(0, 3),
      'Spaces for learning.',
      'INFRASTRUCTURE',
      facilityCard,
      ROUTES.infrastructure
    )}

    ${collectionSection(
      content.Achievements,
      'Academy achievements.',
      'MILESTONES',
      facilityCard
    )}

  `;
}

/* 15. FILTERS */

function categories(items) {
  return [
    'All',
    ...new Set(
      items.map((item) => item.category).filter(nonEmpty)
    )
  ];
}

function filterPills(values, selected, name) {
  return `
    <div class="filter-pills"
         aria-label="${escapeHTML(name)} categories">

      ${values.map((value) => `

        <button
          type="button"
          class="filter-pill ${value === selected ? 'selected' : ''}"
          data-filter="${escapeHTML(name)}"
          data-category="${escapeHTML(value)}"
          aria-pressed="${value === selected}">

          ${escapeHTML(value)}

        </button>

      `).join('')}

    </div>
  `;
}

/* 16. COURSES */

function renderCourses() {
  main.innerHTML = `

    ${pageHero('courses')}

    <section class="section listing-section">

      <div class="container">

        <div class="listing-tools">

          <label class="search-field">

            ${icon('search')}

            <span class="sr-only">Search courses</span>

            <input
              id="course-search"
              type="search"
              placeholder="Search for a course…"
              autocomplete="off"
              value="${escapeHTML(courseQuery)}">

          </label>

          <span id="course-count"
                class="results-count"
                role="status"
                aria-live="polite"></span>

        </div>

        <div id="course-filters">
          ${filterPills(
            categories(content.Courses),
            courseCategory,
            'course'
          )}
        </div>

        <div id="course-results"></div>

      </div>

    </section>

  `;

  document.getElementById('course-search')
    .addEventListener('input', (event) => {

      courseQuery = event.target.value;

      renderCourseResults();

    });

  renderCourseResults();
}

function renderCourseResults() {
  const query = courseQuery.trim().toLocaleLowerCase();

  const matches = content.Courses.filter((item) =>

    (courseCategory === 'All' || item.category === courseCategory) &&

    [
      item.title,
      item.shortDescription,
      item.description,
      item.category
    ]
      .filter(Boolean)
      .join(' ')
      .toLocaleLowerCase()
      .includes(query)

  );

  document.getElementById('course-count').textContent =
    `${matches.length} ${matches.length === 1 ? 'course' : 'courses'}`;

  document.getElementById('course-results').innerHTML =

    matches.length

      ? `
        <div class="card-grid">
          ${matches.map((item) => programCard(item)).join('')}
        </div>
      `

      : content.Courses.length

        ? emptyState(
            'No matching courses',
            'Try another search term or clear your filters.',
            'search',
            '<button class="btn btn-outline" id="reset-courses" type="button">Clear filters</button>'
          )

        : emptyState(
            'New learning opportunities are on the way.',
            'Course details will be published here when they are available. Explore the academy in the meantime.',
            'book',
            button('About CNA', ROUTES.about, 'outline')
          );

  document.getElementById('reset-courses')?.addEventListener(
    'click',
    () => {

      courseQuery = '';
      courseCategory = 'All';

      renderCourses();

      document.getElementById('course-search').focus();

    }
  );

  observeSections();
}

/* 17. WORKSHOPS */

function renderWorkshops() {
  main.innerHTML = `

    ${pageHero('workshops')}

    <section class="section">

      <div class="container">

        ${content.Workshops.length

          ? `
            <div class="card-grid">
              ${content.Workshops.map((item) =>
                programCard(item, 'workshop')
              ).join('')}
            </div>
          `

          : emptyState(
              'More moments to learn and connect.',
              'Workshop details and dates will appear here when announced by the academy.',
              'spark',
              button('Explore CNA', ROUTES.about, 'outline')
            )

        }

      </div>

    </section>

  `;
}

/* 18. DETAIL PAGE HELPERS */

function itemList(title, items) {
  if (!Array.isArray(items) || !items.length) return '';

  return `

    <section class="detail-section">

      <h2>${escapeHTML(title)}</h2>

      <ul class="detail-list">

        ${items.map((item) =>

          typeof item === 'object' && item !== null

            ? `
              <li>

                <h3>${escapeHTML(item.title || '')}</h3>

                ${paragraph(item.description)}

              </li>
            `

            : `<li>${escapeHTML(item)}</li>`

        ).join('')}

      </ul>

    </section>

  `;
}

function supportingImages(items) {
  if (!Array.isArray(items)) return '';

  const images = items
    .map((item) =>
      typeof item === 'string'
        ? { image: item, caption: '' }
        : item
    )
    .filter((item) => item && safeURL(item.image));

  return images.length

    ? `

      <section class="detail-section">

        <h2>In focus</h2>

        <div class="two-grid">

          ${images.map((item) => `

            <figure>

              ${imageMarkup(
                item.image,
                item.alt || item.caption || 'Supporting education image',
                'rounded-image'
              )}

              ${item.caption ? `
                <figcaption class="media-caption">
                  ${escapeHTML(item.caption)}
                </figcaption>
              ` : ''}

            </figure>

          `).join('')}

        </div>

      </section>

    `

    : '';
}

/* 19. COURSE / WORKSHOP DETAILS */

function renderDetail(type) {
  const slug = new URLSearchParams(window.location.search).get('slug');

  const item = (
    type === 'course'
      ? content.Courses
      : content.Workshops
  ).find((entry) => entry.slug === slug);

  const plural = type === 'course' ? 'courses' : 'workshops';

  const listingRoute = type === 'course'
    ? ROUTES.courses
    : ROUTES.workshops;

  if (!item) {

    document.title =
      `${type === 'course' ? 'Course' : 'Workshop'} not found | CNA`;

    main.innerHTML = `

      <section class="section">

        <div class="container">

          ${emptyState(
            `${type === 'course' ? 'Course' : 'Workshop'} not found`,
            `This ${type} may not be available or the link may have changed. Browse the academy’s ${plural} for current information.`,
            'search',
            button(
              `Back to ${plural.charAt(0).toUpperCase() + plural.slice(1)}`,
              listingRoute
            )
          )}

        </div>

      </section>

    `;

    return;
  }

  document.title = `${item.title} | CNA`;

  const summary = item.shortDescription || item.description || '';

  document.querySelector('meta[name="description"]')
    .setAttribute('content', String(summary).slice(0, 160));

  document.querySelector('meta[property="og:title"]')
    .setAttribute('content', document.title);

  document.querySelector('meta[property="og:description"]')
    .setAttribute('content', String(summary).slice(0, 160));

  const metadata = type === 'course'

    ? [
        ['Duration', item.duration],
        ['Fee', item.fee],
        ['Eligibility', item.eligibility]
      ]

    : [
        ['Date', item.date],
        ['Location', item.location]
      ];

  main.innerHTML = `

    <section class="page-hero detail-hero">

      <div class="container">

        <a class="text-link" href="${listingRoute}">
          ← Back to ${plural}
        </a>

        <div class="eyebrow">
          ${escapeHTML(item.category || type)}
        </div>

        <h1>${escapeHTML(item.title)}</h1>

        ${summary ? `<p>${escapeHTML(summary)}</p>` : ''}

      </div>

    </section>

    <section class="section">

      <div class="container detail-layout">

        <div class="detail-main">

          ${imageMarkup(
            item.coverImage || item.image,
            item.imageAlt || item.title,
            'detail-cover',
            true
          )}

          ${contentBlock(
            'Overview',
            item.fullDescription || item.description
          )}

          ${itemList('Curriculum', item.curriculum)}

          ${itemList('Learning modules', item.modules)}

          ${contentBlock(
            'Practical training',
            item.practicalTraining
          )}

          ${supportingImages(item.supportingImages)}

          ${contentBlock(
            'Additional information',
            item.additionalInformation
          )}

        </div>

        ${metadata.some(([, value]) => nonEmpty(value)) ? `

          <aside class="detail-facts">

            <h2>
              ${type === 'course' ? 'Course' : 'Workshop'} at a glance
            </h2>

            <dl>

              ${metadata
                .filter(([, value]) => nonEmpty(value))
                .map(([label, value]) => `

                  <div>

                    <dt>${label}</dt>

                    <dd>${escapeHTML(value)}</dd>

                  </div>

                `).join('')}

            </dl>

          </aside>

        ` : ''}

      </div>

    </section>

  `;
}

/* 20. FACULTY */

function renderFaculty() {
  main.innerHTML = `

    ${pageHero('faculty')}

    <section class="section">

      <div class="container">

        ${content.Faculty.length

          ? `
            <div class="card-grid">
              ${content.Faculty.map(facultyCard).join('')}
            </div>
          `

          : emptyState(
              'Meet the people behind the learning.',
              'Verified faculty profiles, qualifications and biographies will be shared here when available.',
              'people',
              button('About the Academy', ROUTES.about, 'outline')
            )

        }

      </div>

    </section>

  `;
}

/* 21. INFRASTRUCTURE */

function renderInfrastructure() {
  main.innerHTML = `

    ${pageHero('infrastructure')}

    <section class="section">

      <div class="container">

        ${content.Infrastructure.length

          ? `
            <div class="card-grid">
              ${content.Infrastructure.map(facilityCard).join('')}
            </div>
          `

          : emptyState(
              'A closer look is coming.',
              'Actual photographs and information about CNA’s facilities will be added here. No illustrative images are presented as academy infrastructure.',
              'image',
              button('About CNA', ROUTES.about, 'outline')
            )

        }

      </div>

    </section>

  `;
}

/* 22. GALLERY */

function renderGallery() {
  main.innerHTML = `

    ${pageHero('gallery')}

    <section class="section">

      <div class="container">

        <div id="gallery-filters">

          ${filterPills(
            categories(content.Gallery),
            galleryCategory,
            'gallery'
          )}

        </div>

        <div id="gallery-results"></div>

      </div>

    </section>

    <dialog
      id="gallery-lightbox"
      class="lightbox"
      aria-labelledby="lightbox-caption">

      <div class="lightbox-inner">

        <button
          type="button"
          class="icon-btn lightbox-close"
          id="lightbox-close"
          aria-label="Close gallery">

          ${icon('close')}

        </button>

        <button
          type="button"
          class="icon-btn lightbox-prev"
          id="lightbox-prev"
          aria-label="Previous image">

          ←

        </button>

        <figure>

          <img id="lightbox-image" alt="">

          <figcaption id="lightbox-caption"></figcaption>

          <span id="lightbox-counter" aria-live="polite"></span>

        </figure>

        <button
          type="button"
          class="icon-btn lightbox-next"
          id="lightbox-next"
          aria-label="Next image">

          →

        </button>

      </div>

    </dialog>

  `;

  renderGalleryResults();

  const dialog = document.getElementById('gallery-lightbox');

  document.getElementById('lightbox-close')
    .addEventListener('click', closeLightbox);

  document.getElementById('lightbox-prev')
    .addEventListener('click', () => changeImage(-1));

  document.getElementById('lightbox-next')
    .addEventListener('click', () => changeImage(1));

  dialog.addEventListener('click', (event) => {

    if (
      event.target === dialog ||
      event.target.classList.contains('lightbox-inner')
    ) {
      closeLightbox();
    }

  });

  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeLightbox();
  });
}

function renderGalleryResults() {
  galleryItems = content.Gallery.filter((item) =>
    safeURL(item.image) &&
    (galleryCategory === 'All' || item.category === galleryCategory)
  );

  document.getElementById('gallery-results').innerHTML =

    galleryItems.length

      ? `

        <p class="results-count" role="status">
          ${galleryItems.length} images
        </p>

        <div class="gallery-grid">

          ${galleryItems.map((item, index) => `

            <button
              class="gallery-item reveal"
              type="button"
              data-gallery-index="${index}"
              aria-label="Open image: ${escapeHTML(
                item.caption || item.title || `Gallery image ${index + 1}`
              )}">

              ${imageMarkup(
                item.image,
                item.alt || item.caption || item.title || 'Academy gallery image'
              )}

              <span class="gallery-overlay">

                ${escapeHTML(item.caption || item.title || 'View image')}

                ${icon('image')}

              </span>

            </button>

          `).join('')}

        </div>

      `

      : emptyState(
          'Academy moments, soon in focus.',
          content.Gallery.length
            ? 'No images are available in this category.'
            : 'Photographs of CNA activities and spaces will be shared here when available.',
          'image'
        );

  observeSections();
}

function openLightbox(index, trigger) {
  if (!galleryItems[index]) return;

  galleryIndex = index;
  lightboxReturnFocus = trigger;

  updateLightbox();

  document.getElementById('gallery-lightbox').showModal();

  document.body.classList.add('lightbox-open');

  document.getElementById('lightbox-close').focus();
}

function updateLightbox() {
  const item = galleryItems[galleryIndex];

  const image = document.getElementById('lightbox-image');

  image.hidden = false;
  image.src = safeURL(item.image);
  image.alt = item.alt || item.caption || item.title || 'Academy gallery image';

  document.getElementById('lightbox-caption').textContent =
    item.caption || item.title || 'Academy gallery image';

  document.getElementById('lightbox-counter').textContent =
    `${galleryIndex + 1} / ${galleryItems.length}`;

  document.getElementById('lightbox-prev').disabled =
    galleryItems.length < 2;

  document.getElementById('lightbox-next').disabled =
    galleryItems.length < 2;
}

function changeImage(direction) {
  galleryIndex =
    (galleryIndex + direction + galleryItems.length) %
    galleryItems.length;

  updateLightbox();
}

function closeLightbox() {
  document.getElementById('gallery-lightbox').close();

  document.body.classList.remove('lightbox-open');

  lightboxReturnFocus?.focus();
}

/* 23. CONTACT */

function renderContact() {
  const settings = content.SiteSettings;

  const phone = settings.phone
    ? String(settings.phone).replace(/[^+\d]/g, '')
    : '';

  const email = settings.email &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.email)
      ? settings.email
      : '';

  const whatsapp = settings.whatsapp
    ? String(settings.whatsapp).replace(/\D/g, '')
    : '';

  const cards = [

    `
      <article class="contact-card">

        <span class="discover-icon">${icon('pin')}</span>

        <h2>Our location</h2>

        ${settings.address ? paragraph(settings.address) : ''}

        <p>${escapeHTML(settings.location)}</p>

        ${safeURL(settings.mapsUrl) ? `

          <a class="text-link"
             href="${escapeHTML(safeURL(settings.mapsUrl))}"
             target="_blank"
             rel="noopener noreferrer">

            Open in Google Maps ${icon()}

          </a>

        ` : ''}

      </article>
    `,

    phone ? `

      <article class="contact-card">

        <span class="discover-icon">${icon('phone')}</span>

        <h2>Call CNA</h2>

        <a class="text-link" href="tel:${escapeHTML(phone)}">
          ${escapeHTML(settings.phone)}
        </a>

      </article>

    ` : '',

    email ? `

      <article class="contact-card">

        <span class="discover-icon">${icon('mail')}</span>

        <h2>Email CNA</h2>

        <a class="text-link" href="mailto:${escapeHTML(email)}">
          ${escapeHTML(email)}
        </a>

      </article>

    ` : '',

    whatsapp ? `

      <article class="contact-card">

        <h2>Connect on WhatsApp</h2>

        <a class="text-link"
           href="https://wa.me/${whatsapp}"
           target="_blank"
           rel="noopener noreferrer">

          Open WhatsApp ${icon()}

        </a>

      </article>

    ` : '',

    socialMarkup() ? `

      <article class="contact-card">

        <h2>Follow CNA</h2>

        <div class="contact-socials">
          ${socialMarkup()}
        </div>

      </article>

    ` : ''

  ].filter(Boolean);

  main.innerHTML = `

    ${pageHero('contact')}

    <section class="section">

      <div class="container">

        <div class="contact-grid">
          ${cards.join('')}
        </div>

        ${!settings.address || (!phone && !email && !whatsapp) ? `

          <div class="contact-note">

            <span class="eyebrow">CONTACT INFORMATION</span>

            <h2>More details will be shared soon.</h2>

            <p>
              The academy’s full address and direct contact
              details will appear here once available.
            </p>

          </div>

        ` : ''}

      </div>

    </section>

  `;
}

/* 24. 404 */

function render404() {
  main.innerHTML = `

    <section class="not-found container">

      <span class="error-code" aria-hidden="true">404</span>

      <span class="eyebrow">A LITTLE OFF COURSE</span>

      <h1>
        Let’s get you back<br>
        to the academy.
      </h1>

      <p>
        The page you’re looking for couldn’t be found.<br>
        Your next chapter is still a click away.
      </p>

      ${button('Back to Home', ROUTES.home)}

    </section>

  `;
}

/* 25. PAGE RENDERERS */

const RENDERERS = {

  home: renderHome,
  about: renderAbout,
  courses: renderCourses,
  workshops: renderWorkshops,

  'course-details': () => renderDetail('course'),
  'workshop-details': () => renderDetail('workshop'),

  faculty: renderFaculty,
  infrastructure: renderInfrastructure,
  gallery: renderGallery,
  contact: renderContact,
  '404': render404

};

/* 26. CONTENT SERVICE */

const ContentService = {

  async getContent() {

    if (!API_CONFIG.USE_API) {
      return LOCAL_CONTENT;
    }

    if (!API_CONFIG.API_BASE_URL) {
      throw new Error('The content service is not configured.');
    }

    const controller = new AbortController();

    const timeout = setTimeout(
      () => controller.abort(),
      API_CONFIG.TIMEOUT_MS
    );

    try {

      const base = new URL(API_CONFIG.API_BASE_URL);

      if (!['http:', 'https:'].includes(base.protocol)) {
        throw new Error('Invalid content service address.');
      }

      const response = await fetch(
        `${base.href.replace(/\/$/, '')}${API_CONFIG.CONTENT_ENDPOINT}`,
        {
          signal: controller.signal,
          headers: {
            Accept: 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Academy content is temporarily unavailable.');
      }

      return this.normalize(await response.json());

    } finally {

      clearTimeout(timeout);

    }

  },

  normalize(data) {

    if (
      !data ||
      typeof data !== 'object' ||
      Array.isArray(data)
    ) {
      throw new Error('Invalid academy content response.');
    }

    const result = {

      SiteSettings: {
        ...SiteSettings,
        ...(
          data.SiteSettings &&
          typeof data.SiteSettings === 'object' &&
          !Array.isArray(data.SiteSettings)
            ? data.SiteSettings
            : {}
        )
      },

      HomePageContent: {
        ...HomePageContent,
        ...(
          data.HomePageContent &&
          typeof data.HomePageContent === 'object' &&
          !Array.isArray(data.HomePageContent)
            ? data.HomePageContent
            : {}
        )
      }

    };

    COLLECTION_KEYS.forEach((key) => {
      result[key] = list(data[key]);
    });

    result.Courses = result.Courses.filter(
      (item) => nonEmpty(item.title) && nonEmpty(item.slug)
    );

    result.Workshops = result.Workshops.filter(
      (item) => nonEmpty(item.title) && nonEmpty(item.slug)
    );

    result.Faculty = result.Faculty.filter(
      (item) => nonEmpty(item.name)
    );

    return result;

  },

  async getCollection(name) {

    const data = await this.getContent();

    return list(data[name]);

  },

  async getBySlug(name, slug) {

    return (
      await this.getCollection(name)
    ).find((item) => item.slug === slug) || null;

  }

};

/* 27. SCROLL ANIMATIONS */

let revealObserver;

function observeSections() {

  if (
    !('IntersectionObserver' in window) ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    return;
  }

  revealObserver?.disconnect();

  revealObserver = new IntersectionObserver(

    (entries) => {

      entries.forEach((entry) => {

        if (entry.isIntersecting) {

          entry.target.classList.add('revealed');

          revealObserver.unobserve(entry.target);

        }

      });

    },

    { threshold: 0.08 }

  );

  document.querySelectorAll('.reveal').forEach((element) => {
    revealObserver.observe(element);
  });

}

/* 28. INITIALIZATION */

async function initialize() {

  renderHeader();

  renderFooter();

  main.setAttribute('aria-busy', 'true');

  if (API_CONFIG.USE_API) {

    main.innerHTML = `
      <div class="container loading-state" role="status">
        Loading academy content…
      </div>
    `;

  }

  try {

    content = await ContentService.getContent();

    renderHeader();

    renderFooter();

    (RENDERERS[page] || render404)();

    observeSections();

  } catch (error) {

    console.error('[CNA] Content loading failed:', error);

    main.innerHTML = `

      <section class="section">

        <div class="container">

          ${emptyState(
            'We couldn’t load this page.',
            'Academy content is temporarily unavailable. Please try again.',
            'book',
            '<button type="button" id="retry-content" class="btn btn-primary">Try again</button>'
          )}

        </div>

      </section>

    `;

    document.getElementById('retry-content')
      .addEventListener('click', initialize);

  } finally {

    main.setAttribute('aria-busy', 'false');

  }

}

/* 29. GLOBAL CLICK HANDLERS */

document.addEventListener('click', (event) => {

  const filter = event.target.closest('[data-filter]');

  if (filter) {

    const name = filter.dataset.filter;

    if (name === 'course') {

      courseCategory = filter.dataset.category;

      document.getElementById('course-filters').innerHTML =
        filterPills(
          categories(content.Courses),
          courseCategory,
          'course'
        );

      renderCourseResults();

    } else {

      galleryCategory = filter.dataset.category;

      document.getElementById('gallery-filters').innerHTML =
        filterPills(
          categories(content.Gallery),
          galleryCategory,
          'gallery'
        );

      renderGalleryResults();

    }

    const scope = document.getElementById(
      name === 'course'
        ? 'course-filters'
        : 'gallery-filters'
    );

    Array.from(scope.querySelectorAll('button'))
      .find((element) =>
        element.dataset.category === filter.dataset.category
      )?.focus();

  }

  const galleryButton = event.target.closest('[data-gallery-index]');

  if (galleryButton) {

    openLightbox(
      Number(galleryButton.dataset.galleryIndex),
      galleryButton
    );

  }

  if (
    document.body.classList.contains('menu-open') &&
    !event.target.closest('#site-header')
  ) {

    setMenu(false);

  }

});

/* 30. KEYBOARD HANDLERS */

document.addEventListener('keydown', (event) => {

  if (
    event.key === 'Escape' &&
    document.body.classList.contains('menu-open')
  ) {

    setMenu(false);

    document.getElementById('menu-toggle').focus();

  }

  const dialog = document.getElementById('gallery-lightbox');

  if (!dialog?.open) return;

  if (event.key === 'ArrowLeft') {

    event.preventDefault();

    changeImage(-1);

  }

  if (event.key === 'ArrowRight') {

    event.preventDefault();

    changeImage(1);

  }

  if (event.key === 'Tab') {

    const focusable = Array.from(
      dialog.querySelectorAll('button:not([disabled])')
    );

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (
      event.shiftKey &&
      document.activeElement === first
    ) {

      event.preventDefault();

      last.focus();

    } else if (
      !event.shiftKey &&
      document.activeElement === last
    ) {

      event.preventDefault();

      first.focus();

    }

  }

});

/* 31. RESPONSIVE NAVIGATION */

window.matchMedia('(min-width: 1101px)')
  .addEventListener('change', (event) => {

    if (event.matches) {
      setMenu(false);
    }

  });

/* 32. IMAGE ERROR HANDLING */

document.addEventListener('error', (event) => {

  if (event.target instanceof HTMLImageElement) {

    event.target.hidden = true;

    const figure = event.target.closest('figure');

    if (figure) {
      figure.classList.add('image-unavailable');
    }

  }

}, true);

/* 33. START APPLICATION */

initialize();
