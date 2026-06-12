/* =========================================================
   Adrian Kauã Portfolio — JavaScript refatorado
   Funções isoladas para facilitar manutenção
   ========================================================= */

const SELECTORS = {
  header: '#siteHeader',
  menuButton: '#menuButton',
  mobileMenu: '#mobileMenu',
  cursorGlow: '#cursorGlow',
  revealItems: '.reveal',
  sections: 'section[id]',
  navLinks: '.nav__link, .mobile-menu a, .bottom-nav a',
  projectCards: '.project-card',
  modal: '#projectModal',
  modalClose: '#modalClose',
  modalTitle: '#modalTitle',
  modalCategory: '#modalCategory',
  modalImage: '#modalImage',
  modalText: '#modalText',
  modalFeatures: '#modalFeatures',
  modalTags: '#modalTags',
  modalLink: '#modalLink'
};

const PROJECTS = {
  cashflow: {
    title: 'CashFlow',
    category: 'Finanças',
    image: 'assets/cashflow.png',
    description: 'Aplicação completa para controle financeiro pessoal e operacional. Permite registrar entradas e saídas, acompanhar saldo, categorizar despesas e visualizar indicadores.',
    features: [
      'Dashboard com visão geral',
      'Controle de entradas e saídas',
      'Categorias e metas financeiras',
      'Relatórios gráficos detalhados',
      'Estrutura pensada para uso mobile'
    ],
    tags: ['Python', 'Flask', 'SQLAlchemy', 'PostgreSQL', 'Chart.js'],
    link: 'https://github.com/AdrianKoll/CashFlow'
  },
  serviceflow: {
    title: 'ServiceFlow',
    category: 'Gestão operacional',
    image: 'assets/serviceflow.png',
    description: 'Sistema para controle de serviços, produtividade e rotina operacional, com foco em organização, indicadores e visual profissional para gestão.',
    features: [
      'Painel de indicadores',
      'Gestão de serviços e equipe',
      'Controle operacional',
      'Relatórios e visão gerencial',
      'Base escalável para SaaS'
    ],
    tags: ['Python', 'Flask', 'SQLAlchemy', 'Jinja2', 'MVC'],
    link: 'https://github.com/AdrianKoll/serviceflow'
  },
  inventory: {
    title: 'Inventory Manager',
    category: 'Estoque',
    image: 'assets/inventory.png',
    description: 'Aplicação para controle de estoque, categorias, produtos, movimentações e alertas de nível mínimo.',
    features: [
      'Cadastro de produtos',
      'Controle de estoque mínimo',
      'Movimentações e categorias',
      'Alertas de produtos críticos',
      'Arquitetura organizada'
    ],
    tags: ['Python', 'SQLite', 'MVC', 'DAO', 'Desktop'],
    link: 'https://github.com/AdrianKoll/inventory-manager-python'
  },
  vehicle: {
    title: 'Vehicle Access',
    category: 'Controle veicular',
    image: 'assets/vehicle.png',
    description: 'Sistema para registrar e acompanhar entradas e saídas de veículos, com dashboard e visão de acessos recentes.',
    features: [
      'Registro de entradas e saídas',
      'Painel de ocupação',
      'Histórico de acessos',
      'Indicadores operacionais',
      'Interface objetiva e responsiva'
    ],
    tags: ['Python', 'Flask', 'CRUD', 'Dashboard', 'SQLite'],
    link: 'https://github.com/AdrianKoll/VehicleAccessManager'
  }
};

function getElement(selector) {
  return document.querySelector(selector);
}

function getElements(selector) {
  return [...document.querySelectorAll(selector)];
}

function initHeaderScroll() {
  const header = getElement(SELECTORS.header);
  if (!header) return;

  const updateHeader = () => {
    header.classList.toggle('scrolled', window.scrollY > 24);
  };

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
}

function initMobileMenu() {
  const button = getElement(SELECTORS.menuButton);
  const menu = getElement(SELECTORS.mobileMenu);
  if (!button || !menu) return;

  const closeMenu = () => {
    button.classList.remove('open');
    button.setAttribute('aria-expanded', 'false');
    menu.classList.remove('open');
    menu.setAttribute('aria-hidden', 'true');
  };

  button.addEventListener('click', () => {
    const isOpen = button.classList.toggle('open');
    button.setAttribute('aria-expanded', String(isOpen));
    menu.classList.toggle('open', isOpen);
    menu.setAttribute('aria-hidden', String(!isOpen));
  });

  getElements('.mobile-menu a, .bottom-nav a, .nav__link').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });
}

function initCursorGlow() {
  const glow = getElement(SELECTORS.cursorGlow);
  if (!glow || window.matchMedia('(max-width: 680px)').matches) return;

  window.addEventListener('mousemove', (event) => {
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
  }, { passive: true });
}

function initRevealAnimation() {
  const items = getElements(SELECTORS.revealItems);
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  items.forEach((item) => observer.observe(item));
}

function initActiveNavigation() {
  const links = getElements(SELECTORS.navLinks);

  const sectionIds = links
    .map((link) => link.getAttribute('href'))
    .filter((href) => href && href.startsWith('#'))
    .map((href) => href.replace('#', ''));

  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  if (!sections.length || !links.length) return;

  const setActiveLink = (sectionId) => {
    links.forEach((link) => {
      const href = link.getAttribute('href');
      link.classList.toggle('active', href === `#${sectionId}`);
    });
  };

  const updateActiveLink = () => {
    const scrollPosition = window.scrollY + 260;
    const pageBottom =
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 20;

    let currentSection = sections[0].id;

    sections.forEach((section) => {
      if (scrollPosition >= section.offsetTop) {
        currentSection = section.id;
      }
    });

    if (pageBottom) {
      currentSection = sections[sections.length - 1].id;
    }

    setActiveLink(currentSection);
  };

  links.forEach((link) => {
    link.addEventListener('click', () => {
      const sectionId = link.getAttribute('href')?.replace('#', '');

      if (!sectionId) return;

      setActiveLink(sectionId);

      setTimeout(() => {
        setActiveLink(sectionId);
      }, 500);
    });
  });

  updateActiveLink();

  window.addEventListener('scroll', updateActiveLink, { passive: true });
}

function renderTags(tags) {
  return tags.map((tag) => `<span>${tag}</span>`).join('');
}

function renderFeatures(features) {
  return features.map((feature) => `<li>${feature}</li>`).join('');
}

function initProjectModal() {
  const modal = getElement(SELECTORS.modal);
  const closeButton = getElement(SELECTORS.modalClose);
  if (!modal || !closeButton) return;

  const modalFields = {
    title: getElement(SELECTORS.modalTitle),
    category: getElement(SELECTORS.modalCategory),
    image: getElement(SELECTORS.modalImage),
    text: getElement(SELECTORS.modalText),
    features: getElement(SELECTORS.modalFeatures),
    tags: getElement(SELECTORS.modalTags),
    link: getElement(SELECTORS.modalLink)
  };

  const closeModal = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  const openModal = (projectKey) => {
    const project = PROJECTS[projectKey];
    if (!project) return;

    modalFields.title.textContent = project.title;
    modalFields.category.textContent = project.category;
    modalFields.image.src = project.image;
    modalFields.image.alt = `Preview do ${project.title}`;
    modalFields.text.textContent = project.description;
    modalFields.features.innerHTML = renderFeatures(project.features);
    modalFields.tags.innerHTML = renderTags(project.tags);
    modalFields.link.href = project.link;

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  getElements(SELECTORS.projectCards).forEach((card) => {
    card.addEventListener('click', () => openModal(card.dataset.project));
  });

  closeButton.addEventListener('click', closeModal);
  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeModal();
  });
}

function initPortfolio() {
  initHeaderScroll();
  initMobileMenu();
  initCursorGlow();
  initRevealAnimation();
  initActiveNavigation();
  initProjectModal();
}

document.addEventListener('DOMContentLoaded', initPortfolio);
