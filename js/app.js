/* ============================================
   CIUDADIA — Main Application Logic
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHeroSearch();
  renderCategories();
  renderProperties();
  initFilters();
  initScrollAnimations();
  initModal();
});

/* ---------- Navbar ---------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');

  // Scroll effect
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });

  // Mobile toggle
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    links.classList.toggle('open');
  });

  // Close mobile menu on link click
  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      links.classList.remove('open');
    });
  });
}

/* ---------- Hero Search ---------- */
function initHeroSearch() {
  const searchInput = document.getElementById('searchLocation');
  const searchType = document.getElementById('searchPropType');
  const searchBtn = document.getElementById('btnApplyFilters');

  if (!searchBtn) return;

  // Tabs (Buy/Rent)
  const tabBuy = document.getElementById('tabBuy');
  const tabRent = document.getElementById('tabRent');
  if (tabBuy && tabRent) {
    tabBuy.addEventListener('click', () => {
      tabBuy.classList.add('active');
      tabRent.classList.remove('active');
    });
    tabRent.addEventListener('click', () => {
      tabRent.classList.add('active');
      tabBuy.classList.remove('active');
    });
  }

  // Segmented Controls (Habitaciones, Baños)
  document.querySelectorAll('.segmented-control').forEach(control => {
    control.querySelectorAll('.segmented-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        control.querySelectorAll('.segmented-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  });

  // Range Slider Drag Logic
  const sliderContainer = document.querySelector('.search-panel__slider-container');
  if (sliderContainer) {
    const handleLeft = sliderContainer.querySelector('.slider-handle.left');
    const handleRight = sliderContainer.querySelector('.slider-handle.right');
    const rangeBar = sliderContainer.querySelector('.slider-range');
    const labels = document.querySelector('.slider-labels span');

    let minPercent = 0;
    let maxPercent = 100;

    const minPrice = 500000;
    const maxPrice = 15000000;

    function updateSlider() {
      handleLeft.style.left = minPercent + '%';
      handleRight.style.left = maxPercent + '%';
      rangeBar.style.left = minPercent + '%';
      rangeBar.style.right = (100 - maxPercent) + '%';

      const currentMin = Math.round(minPrice + (maxPrice - minPrice) * (minPercent / 100));
      const currentMax = Math.round(minPrice + (maxPrice - minPrice) * (maxPercent / 100));

      labels.textContent = `$${currentMin.toLocaleString()} - $${currentMax.toLocaleString()}`;
      
      Filters.set('priceMin', currentMin);
      Filters.set('priceMax', currentMax);
    }

    function onDrag(e, handle, isLeft) {
      e.preventDefault();
      const rect = sliderContainer.getBoundingClientRect();
      
      const onMove = (moveEvent) => {
        const clientX = moveEvent.touches ? moveEvent.touches[0].clientX : moveEvent.clientX;
        let pct = ((clientX - rect.left) / rect.width) * 100;
        pct = Math.max(0, Math.min(100, pct));

        if (isLeft) {
          minPercent = Math.min(pct, maxPercent - 5);
        } else {
          maxPercent = Math.max(pct, minPercent + 5);
        }
        updateSlider();
      };

      const onUp = () => {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('touchend', onUp);
      };

      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
      document.addEventListener('touchmove', onMove, { passive: true });
      document.addEventListener('touchend', onUp);
    }

    handleLeft.addEventListener('mousedown', (e) => onDrag(e, handleLeft, true));
    handleRight.addEventListener('mousedown', (e) => onDrag(e, handleRight, false));
    handleLeft.addEventListener('touchstart', (e) => onDrag(e, handleLeft, true), { passive: true });
    handleRight.addEventListener('touchstart', (e) => onDrag(e, handleRight, false), { passive: true });

    updateSlider();
  }

  // Apply filters button
  searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const query = searchInput ? searchInput.value.trim() : '';
    const type = searchType ? searchType.value : 'todos';

    Filters.set('search', query === 'Piura' ? '' : query);
    Filters.set('type', type);
    
    renderProperties();
    document.getElementById('properties').scrollIntoView({ behavior: 'smooth' });
  });

  if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        searchBtn.click();
      }
    });
  }

  // Popular categories links
  document.querySelectorAll('.pop-cat-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const cat = link.dataset.cat;
      Filters.set('type', cat);
      renderProperties();
      updateActiveTab(cat);
      document.getElementById('properties').scrollIntoView({ behavior: 'smooth' });
    });
  });
}

/* ---------- Categories ---------- */
function renderCategories() {
  const grid = document.getElementById('categoriesGrid');
  const counts = Filters.getCounts(properties);

  const categories = [
    { type: 'casa', icon: '🏠', title: 'Casas', count: counts.casa || 0 },
    { type: 'departamento', icon: '🏢', title: 'Departamentos', count: counts.departamento || 0 },
    { type: 'terreno', icon: '🌳', title: 'Terrenos', count: counts.terreno || 0 },
    { type: 'local', icon: '🏪', title: 'Proyectos', count: counts.local || 0 }
  ];

  grid.innerHTML = categories.map((cat, i) => `
    <div class="category-card reveal reveal-delay-${i + 1}" data-type="${cat.type}" id="category-${cat.type}">
      <div class="category-card__icon">${cat.icon}</div>
      <h3 class="category-card__title">${cat.title}</h3>
      <p class="category-card__count">${cat.count} disponibles</p>
    </div>
  `).join('');

  // Click to filter
  grid.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
      const type = card.dataset.type;
      Filters.set('type', type);
      renderProperties();
      updateActiveTab(type);
      document.getElementById('properties').scrollIntoView({ behavior: 'smooth' });
    });
  });
}

/* ---------- Properties Grid ---------- */
function renderProperties() {
  const grid = document.getElementById('propertiesGrid');
  const countEl = document.getElementById('propertiesCount');
  const filtered = Filters.apply(properties);

  countEl.textContent = `${filtered.length} inmueble${filtered.length !== 1 ? 's' : ''} encontrado${filtered.length !== 1 ? 's' : ''}`;

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem;">
        <p style="font-size: 3rem; margin-bottom: 1rem;">🏗️</p>
        <h3 style="font-family: var(--font-heading); font-size: 1.3rem; margin-bottom: 0.5rem;">No se encontraron inmuebles</h3>
        <p style="color: var(--text-muted);">Intenta con otros filtros de búsqueda</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map((prop, i) => `
    <article class="property-card reveal reveal-delay-${(i % 4) + 1}" data-id="${prop.id}" id="property-${prop.id}">
      <div class="property-card__image">
        <img class="property-card__img" src="${prop.image}" alt="${prop.title}" loading="lazy">
        <span class="property-card__badge">${getTypeLabel(prop.type)}</span>
        <button class="property-card__favorite" aria-label="Agregar a favoritos" data-fav="${prop.id}">♡</button>
      </div>
      <div class="property-card__body">
        <p class="property-card__price">${formatPrice(prop.price)}</p>
        <h3 class="property-card__title">${prop.title}</h3>
        <p class="property-card__location">📍 ${prop.location}</p>
        <div class="property-card__features">
          ${prop.bedrooms > 0 ? `
            <span class="property-card__feature">
              <span class="property-card__feature-icon">🛏️</span> ${prop.bedrooms} hab.
            </span>
          ` : ''}
          ${prop.bathrooms > 0 ? `
            <span class="property-card__feature">
              <span class="property-card__feature-icon">🚿</span> ${prop.bathrooms} baño${prop.bathrooms > 1 ? 's' : ''}
            </span>
          ` : ''}
          <span class="property-card__feature">
            <span class="property-card__feature-icon">📐</span> ${prop.area} m²
          </span>
        </div>
      </div>
    </article>
  `).join('');

  // Re-init scroll animations for new elements
  initScrollAnimations();

  // Card click → open modal
  grid.querySelectorAll('.property-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.property-card__favorite')) return;
      const id = parseInt(card.dataset.id);
      openModal(id);
    });
  });

  // Favorite buttons
  grid.querySelectorAll('.property-card__favorite').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      btn.classList.toggle('liked');
      btn.textContent = btn.classList.contains('liked') ? '♥' : '♡';
    });
  });
}

/* ---------- Filters UI ---------- */
function initFilters() {
  // Type tabs
  document.querySelectorAll('.filters__tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const type = tab.dataset.filter;
      Filters.set('type', type);
      updateActiveTab(type);
      renderProperties();
    });
  });

  // Sort select
  const sortSelect = document.getElementById('sortSelect');
  sortSelect.addEventListener('change', () => {
    Filters.set('sort', sortSelect.value);
    renderProperties();
  });
}

function updateActiveTab(type) {
  document.querySelectorAll('.filters__tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.filter === type);
  });
}

/* ---------- Modal ---------- */
function initModal() {
  const overlay = document.getElementById('modalOverlay');

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

function openModal(id) {
  const prop = properties.find(p => p.id === id);
  if (!prop) return;

  const overlay = document.getElementById('modalOverlay');
  const content = document.getElementById('modalContent');

  content.innerHTML = `
    <div style="position: relative;">
      <img class="modal__image" src="${prop.image}" alt="${prop.title}">
      <button class="modal__close" onclick="closeModal()" aria-label="Cerrar">✕</button>
    </div>
    <div class="modal__body">
      <p class="modal__price">${formatPrice(prop.price)}</p>
      <h2 class="modal__title">${prop.title}</h2>
      <p class="modal__location">📍 ${prop.location}</p>

      <div class="modal__features">
        ${prop.bedrooms > 0 ? `
          <div class="modal__feature">
            <p class="modal__feature-value">${prop.bedrooms}</p>
            <p class="modal__feature-label">Habitaciones</p>
          </div>
        ` : ''}
        ${prop.bathrooms > 0 ? `
          <div class="modal__feature">
            <p class="modal__feature-value">${prop.bathrooms}</p>
            <p class="modal__feature-label">Baños</p>
          </div>
        ` : ''}
        <div class="modal__feature">
          <p class="modal__feature-value">${prop.area}</p>
          <p class="modal__feature-label">m²</p>
        </div>
        ${prop.parking > 0 ? `
          <div class="modal__feature">
            <p class="modal__feature-value">${prop.parking}</p>
            <p class="modal__feature-label">Estacionamientos</p>
          </div>
        ` : ''}
      </div>

      <div class="modal__description">
        <h3>Descripción</h3>
        <p>${prop.description}</p>
      </div>

      <div class="modal__contact">
        <button class="modal__contact-btn modal__contact-btn--primary">
          📞 Contactar Agente
        </button>
        <button class="modal__contact-btn modal__contact-btn--secondary">
          📅 Agendar Visita
        </button>
      </div>
    </div>
  `;

  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const overlay = document.getElementById('modalOverlay');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

/* ---------- Scroll Reveal Animations ---------- */
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
    observer.observe(el);
  });
}

