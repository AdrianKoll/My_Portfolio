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
  syncus: {
    title: 'SyncUs',
    category: 'Em desenvolvimento',
    image: null,
    description: 'API em desenvolvimento para gestão financeira de casais, com autenticação OAuth2/JWT, comunicação em tempo real via WebSockets e arquitetura com PostgreSQL e Docker Compose.',
    features: [
      'API desenvolvida com FastAPI',
      'Autenticação com OAuth2/JWT',
      'Comunicação em tempo real via WebSockets',
      'Arquitetura com PostgreSQL e Docker Compose'
    ],
    tags: ['FastAPI', 'PostgreSQL', 'WebSockets'],
    link: null
  },
  cashflow: {
    title: 'CashFlow',
    category: 'Vendido e em uso',
    image: 'assets/cashflow.png',
    description: 'Sistema mobile-first em Flask para controle de fluxo de caixa, com relatórios dinâmicos, backups automatizados e lógica de recorrência.',
    features: [
      'Aplicação mobile-first',
      'Automação de processos financeiros',
      'Relatórios dinâmicos',
      'Backups automatizados',
      'Lógica de recorrência que otimizou em mais de 80% o tempo de gestão do cliente'
    ],
    tags: ['Flask', 'SQLAlchemy', 'Relatórios'],
    link: 'https://github.com/AdrianKoll/CashFlow'
  },
  serviceflow: {
    title: 'ServiceFlow',
    category: 'Versão base vendida',
    image: 'assets/serviceflow.png',
    description: 'Versão base de um sistema de gestão operacional modular em Flask, com permissões por papel (RBAC) e landing page integrada.',
    features: [
      'Arquitetura modular em Flask',
      'Controle de acesso por papel (RBAC)',
      'Landing page integrada'
    ],
    tags: ['Flask', 'RBAC', 'Landing Page'],
    link: 'https://github.com/AdrianKoll/serviceflow'
  },
  medextract: {
    title: 'MedExtract AI',
    category: 'Protótipo entregue',
    image: null,
    description: 'Protótipo entregue para extração de dados com IA, integrando APIs da OpenAI e Azure para processamento de áudio e imagem (OCR) em ambiente farmacêutico.',
    features: [
      'Integração com APIs da OpenAI e Azure',
      'Processamento de áudio e imagem',
      'Reconhecimento óptico de caracteres (OCR) em ambiente farmacêutico'
    ],
    tags: ['OpenAI API', 'Azure AI', 'OCR'],
    link: null
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

  let isOpen = false;
  menu.inert = true;

  const closeMenu = () => {
    if (!isOpen) return;
    isOpen = false;
    button.classList.remove('open');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-label', 'Abrir menu');
    menu.classList.remove('open');
    menu.setAttribute('aria-hidden', 'true');
    menu.inert = true;
    button.focus();
  };

  button.addEventListener('click', () => {
    isOpen = !isOpen;
    button.classList.toggle('open', isOpen);
    button.setAttribute('aria-expanded', String(isOpen));
    button.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
    menu.classList.toggle('open', isOpen);
    menu.setAttribute('aria-hidden', String(!isOpen));
    menu.inert = !isOpen;
    if (isOpen) menu.querySelector('a')?.focus();
  });

  getElements('.mobile-menu a, .bottom-nav a, .nav__link').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen) closeMenu();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 680 && isOpen) closeMenu();
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
      const isActive = href === `#${sectionId}`;
      link.classList.toggle('active', isActive);
      if (isActive) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
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

function escapeHTML(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  })[character]);
}

function renderTags(tags) {
  return tags.map((tag) => `<span>${escapeHTML(tag)}</span>`).join('');
}

function renderFeatures(features) {
  return features.map((feature) => `<li>${escapeHTML(feature)}</li>`).join('');
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

  let lastFocusedElement = null;
  let modalIsOpen = false;

  const closeModal = () => {
    if (!modalIsOpen) return;
    modalIsOpen = false;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    modal.setAttribute('inert', '');
    document.body.style.overflow = '';
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
  };

  const openModal = (projectKey) => {
    const project = PROJECTS[projectKey];
    if (!project) return;

    modalFields.title.textContent = project.title;
    modalFields.category.textContent = project.category;
    if (project.image) {
      modalFields.image.src = project.image;
      modalFields.image.alt = `Preview do ${project.title}`;
      modalFields.image.hidden = false;
    } else {
      modalFields.image.removeAttribute('src');
      modalFields.image.alt = '';
      modalFields.image.hidden = true;
    }
    modalFields.text.textContent = project.description;
    modalFields.features.innerHTML = renderFeatures(project.features);
    modalFields.tags.innerHTML = renderTags(project.tags);
    if (project.link) {
      modalFields.link.href = project.link;
      modalFields.link.hidden = false;
      modalFields.link.setAttribute('aria-disabled', 'false');
    } else {
      modalFields.link.removeAttribute('href');
      modalFields.link.hidden = true;
      modalFields.link.setAttribute('aria-disabled', 'true');
    }

    lastFocusedElement = document.activeElement;
    modalIsOpen = true;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    modal.removeAttribute('inert');
    document.body.style.overflow = 'hidden';
    closeButton.focus();
  };

  getElements(SELECTORS.projectCards).forEach((card) => {
    card.addEventListener('click', (event) => {
      if (event.target.closest('a')) return;
      openModal(card.dataset.project);
    });
  });

  closeButton.addEventListener('click', closeModal);
  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
  });
  document.addEventListener('keydown', (event) => {
    if (!modalIsOpen) return;

    if (event.key === 'Escape') {
      closeModal();
      return;
    }

    if (event.key !== 'Tab') return;
    const focusable = modal.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
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
