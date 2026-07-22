/* ============================================
   CIUDADIA — Main Application Logic
   ============================================ */

function init() {
  highlightActiveNav();
  initNavbar();
  initThemeToggle();
  renderCategories();
  renderProperties();
  initFilters();
  initScrollAnimations();
  initModal();
  initBuyPage();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

/* ---------- Active Nav Highlight ---------- */
function highlightActiveNav() {
  const pageAttr = document.body ? document.body.getAttribute('data-page') : null;
  const pathSegments = window.location.pathname.split('/').filter(Boolean);
  const rawPage = pathSegments.length > 0 ? pathSegments[pathSegments.length - 1] : 'index';
  const currentPage = pageAttr || rawPage.replace(/\.html$/, '') || 'index';

  const links = document.querySelectorAll('nav a[href], header a[href], #mobileMenu a[href]');
  links.forEach(a => {
    const rawHref = a.getAttribute('href') || '';
    if (!rawHref || rawHref.startsWith('#') || rawHref.startsWith('http')) return;

    const hrefSegments = rawHref.split('?')[0].split('/').filter(Boolean);
    const linkPage = hrefSegments.length > 0 ? hrefSegments[hrefSegments.length - 1].replace(/\.html$/, '') : 'index';

    if (!a.classList.contains('btn-primary') && !a.classList.contains('bg-primary') && !a.querySelector('img')) {
      a.classList.add('nav-item-link');
    }

    if (linkPage === currentPage && linkPage !== 'index') {
      if (linkPage === 'colaboradores') {
        a.style.backgroundColor = 'var(--primary)';
        a.style.color = '#ffffff';
        a.style.borderColor = 'var(--primary)';
        a.style.fontWeight = '600';
      } else if (linkPage === 'contacto') {
        if (!a.classList.contains('btn-primary') && !a.classList.contains('bg-primary')) {
          a.classList.add('active', 'nav-link-active');
        }
      } else {
        a.classList.add('active', 'nav-link-active');
      }
    }
  });
}

/* ---------- Navbar ---------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');

  if (!navbar || !toggle || !links) return;

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

/* ---------- Categories ---------- */
function renderCategories() {
  const grid = document.getElementById('categoriesGrid');
  if (!grid) return;
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
  if (!grid) return;
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

  grid.innerHTML = filtered.map((prop, i) => {
    // Generate carousel slides HTML
    const slidesHtml = prop.images && prop.images.length > 0 
      ? prop.images.map((imgUrl, index) => `
          <img class="property-card__img ${index === 0 ? 'active' : ''}" src="${imgUrl}" alt="${prop.title}" loading="lazy">
        `).join('')
      : `<img class="property-card__img active" src="${prop.image}" alt="${prop.title}" loading="lazy">`;

    // Generate carousel dots HTML
    const dotsHtml = prop.images && prop.images.length > 1
      ? `
        <div class="property-card__carousel-dots">
          ${prop.images.map((_, index) => `
            <span class="property-card__carousel-dot ${index === 0 ? 'active' : ''}" data-index="${index}"></span>
          `).join('')}
        </div>
      `
      : '';

    // Prev / Next button HTML
    const navButtonsHtml = prop.images && prop.images.length > 1
      ? `
        <button class="property-card__carousel-btn property-card__carousel-btn--prev" aria-label="Anterior">❮</button>
        <button class="property-card__carousel-btn property-card__carousel-btn--next" aria-label="Siguiente">❯</button>
      `
      : '';

    return `
      <article class="property-card reveal reveal-delay-${(i % 4) + 1}" data-id="${prop.id}" id="property-${prop.id}">
        <div class="property-card__image">
          <div class="property-card__slides">
            ${slidesHtml}
          </div>
          ${navButtonsHtml}
          ${dotsHtml}
          <span class="property-card__badge">${getTypeLabel(prop.type)}</span>
          <button class="property-card__favorite" aria-label="Agregar a favoritos" data-fav="${prop.id}">♡</button>
        </div>
        <div class="property-card__body">
          <p class="property-card__price">${formatPrice(prop.price, prop.operation)}</p>
          <h3 class="property-card__title">${prop.title}</h3>
          <p class="property-card__location">📍 ${prop.location}</p>
          <div class="property-card__features">
            ${prop.bedrooms > 0 ? `
              <span class="property-card__feature" title="Habitaciones">
                <span class="property-card__feature-icon">🛏️</span> ${prop.bedrooms} ${prop.bedrooms === 1 ? 'Habitación' : 'Habitaciones'}
              </span>
            ` : ''}
            ${prop.bathrooms > 0 ? `
              <span class="property-card__feature" title="Baños">
                <span class="property-card__feature-icon">🚿</span> ${prop.bathrooms} ${prop.bathrooms === 1 ? 'Baño' : 'Baños'}
              </span>
            ` : ''}
            ${prop.builtArea > 0 ? `
              <span class="property-card__feature" title="Área Construida">
                <span class="property-card__feature-icon">📐</span> ${prop.builtArea} m² Construidos
              </span>
            ` : ''}
            ${prop.landArea > 0 ? `
              <span class="property-card__feature" title="Área de Terreno">
                <span class="property-card__feature-icon">🌳</span> ${prop.landArea} m² de Terreno
              </span>
            ` : ''}
          </div>
        </div>
      </article>
    `;
  }).join('');

  // Re-init scroll animations for new elements
  initScrollAnimations();

  // Bind carousel events for each card
  grid.querySelectorAll('.property-card').forEach(card => {
    const images = card.querySelectorAll('.property-card__img');
    const dots = card.querySelectorAll('.property-card__carousel-dot');
    const prevBtn = card.querySelector('.property-card__carousel-btn--prev');
    const nextBtn = card.querySelector('.property-card__carousel-btn--next');

    if (images.length <= 1) return;

    let currentIndex = 0;

    const showSlide = (index) => {
      images.forEach(img => img.classList.remove('active'));
      dots.forEach(dot => dot.classList.remove('active'));

      images[index].classList.add('active');
      if (dots[index]) dots[index].classList.add('active');
    };

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent opening details modal or triggering card click!
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        showSlide(currentIndex);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent opening details modal or triggering card click!
        currentIndex = (currentIndex + 1) % images.length;
        showSlide(currentIndex);
      });
    }

    dots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent opening details modal or triggering card click!
        const index = parseInt(dot.dataset.index);
        currentIndex = index;
        showSlide(currentIndex);
      });
    });
  });

  // Card click → open modal
  grid.querySelectorAll('.property-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (
        e.target.closest('.property-card__favorite') ||
        e.target.closest('.property-card__carousel-btn') ||
        e.target.closest('.property-card__carousel-dot')
      ) return;
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
  const sortSelect = document.getElementById('sortSelect');
  if (!sortSelect) return;
  document.querySelectorAll('.filters__tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const type = tab.dataset.filter;
      Filters.set('type', type);
      updateActiveTab(type);
      renderProperties();
    });
  });

  // Sort select

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
  if (!overlay) return;

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
      <p class="modal__price">${formatPrice(prop.price, prop.operation)}</p>
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
        ${prop.builtArea > 0 ? `
          <div class="modal__feature">
            <p class="modal__feature-value">${prop.builtArea} m²</p>
            <p class="modal__feature-label">Área Const.</p>
          </div>
        ` : ''}
        ${prop.landArea > 0 ? `
          <div class="modal__feature">
            <p class="modal__feature-value">${prop.landArea} m²</p>
            <p class="modal__feature-label">Área Terreno</p>
          </div>
        ` : ''}
        ${prop.parking > 0 ? `
          <div class="modal__feature">
            <p class="modal__feature-value">${prop.parking}</p>
            <p class="modal__feature-label">Cochera (Autos)</p>
          </div>
        ` : ''}
      </div>

      <div class="modal__description">
        <h3>Descripción</h3>
        <p>${prop.description}</p>
      </div>

      ${prop.amenities && prop.amenities.length > 0 ? `
        <div class="modal__amenities" style="margin-top: 1.5rem; margin-bottom: 1.5rem;">
          <h3 style="font-family: var(--font-heading); font-size: 1.1rem; font-weight: 600; margin-bottom: 0.75rem; color: var(--text-primary);">Amenidades</h3>
          <div class="modal__amenities-list" style="display: flex; flex-wrap: wrap; gap: 8px;">
            ${prop.amenities.map(amenity => `
              <span class="modal__amenity-tag" style="background: var(--bg-secondary); border: 1px solid var(--border-light); border-radius: 20px; padding: 4px 12px; font-size: 0.85rem; color: var(--text-secondary); font-weight: 500;">
                ✨ ${amenity}
              </span>
            `).join('')}
          </div>
        </div>
      ` : ''}

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

/* ---------- Buy Page Districts Helper ---------- */
const districtsByDepartment = {
  todos: [
    "San Isidro", "La Molina", "Barranco", "Máncora", "Surco", 
    "Pueblo Libre", "Cusco", "Asia", "Arequipa", "Lunahuaná"
  ],
  Lima: ["San Isidro", "La Molina", "Barranco", "Surco", "Pueblo Libre", "Asia", "Lunahuaná"],
  Arequipa: ["Arequipa"],
  Cusco: ["Cusco"],
  Piura: ["Máncora"]
};

function updateDistritoDropdown(selectedDept) {
  const distritoSelect = document.getElementById('distritoSelect');
  if (!distritoSelect) return;

  const districts = districtsByDepartment[selectedDept] || districtsByDepartment.todos;
  
  distritoSelect.innerHTML = `<option value="todos">Todos</option>` + 
    districts.map(d => `<option value="${d}">${d}</option>`).join('');
}

/* ---------- Adjust Filters For Category ---------- */
function adjustFiltersForCategory(type) {
  const groups = {
    departamento: document.getElementById('group-departamento'),
    distrito: document.getElementById('group-distrito'),
    price: document.getElementById('group-price'),
    sort: document.getElementById('group-sort'),
    bedrooms: document.getElementById('group-bedrooms'),
    bathrooms: document.getElementById('group-bathrooms'),
    parking: document.getElementById('group-parking'),
    builtArea: document.getElementById('group-builtArea'),
    landArea: document.getElementById('group-landArea'),
    amenities: document.getElementById('group-amenities')
  };

  // Helper to toggle visibility
  const toggle = (el, show) => {
    if (el) el.style.display = show ? 'flex' : 'none';
  };

  // Default: show all
  Object.values(groups).forEach(el => toggle(el, true));

  // Apply exceptions based on property type
  if (type === 'departamento') {
    toggle(groups.landArea, false);
  } else if (type === 'terreno') {
    toggle(groups.bedrooms, false);
    toggle(groups.bathrooms, false);
    toggle(groups.parking, false);
    toggle(groups.builtArea, false);
    toggle(groups.amenities, false);
  } else if (type === 'local') {
    toggle(groups.bedrooms, false);
    toggle(groups.landArea, false);
  }
}

function initBuyPage() {
  const propertiesSection = document.getElementById('properties');
  if (!propertiesSection) return;

  // Set operation type from body tag
  const pageType = document.body.dataset.page; // 'comprar' or 'alquilar'
  if (pageType) {
    Filters.set('operation', pageType);
  }

  const typeSelect = document.getElementById('typeSelect');
  const departamentoSelect = document.getElementById('departamentoSelect');
  const distritoSelect = document.getElementById('distritoSelect');
  const priceMaxSelect = document.getElementById('priceMaxSelect');
  const bedroomsSelect = document.getElementById('bedroomsSelect');
  const bathroomsSelect = document.getElementById('bathroomsSelect');
  const parkingSelect = document.getElementById('parkingSelect');
  const builtAreaSelect = document.getElementById('builtAreaSelect');
  const landAreaSelect = document.getElementById('landAreaSelect');
  const amenitySelect = document.getElementById('amenitySelect');

  // Initial districts loading
  updateDistritoDropdown('todos');

  // Helper to bind a select element to a filter key
  function bindSelectFilter(element, filterKey, isNumeric = true) {
    if (element) {
      element.addEventListener('change', () => {
        let val;
        if (isNumeric) {
          val = element.value === 'Infinity' ? Infinity : parseFloat(element.value);
        } else {
          val = element.value;
        }
        Filters.set(filterKey, val);
        renderProperties();
      });
    }
  }

  // Bind all filters
  if (typeSelect) {
    typeSelect.addEventListener('change', () => {
      const typeVal = typeSelect.value;
      Filters.set('type', typeVal);
      adjustFiltersForCategory(typeVal);
      renderProperties();
    });
  }

  if (departamentoSelect) {
    departamentoSelect.addEventListener('change', () => {
      const deptVal = departamentoSelect.value;
      Filters.set('departamento', deptVal);
      
      // Update districts dropdown dynamically
      updateDistritoDropdown(deptVal);
      
      // Reset active distrito filter to 'todos' when department changes
      Filters.set('distrito', 'todos');
      if (distritoSelect) distritoSelect.value = 'todos';
      
      renderProperties();
    });
  }

  if (distritoSelect) {
    distritoSelect.addEventListener('change', () => {
      Filters.set('distrito', distritoSelect.value);
      renderProperties();
    });
  }

  bindSelectFilter(priceMaxSelect, 'priceMax', true);
  bindSelectFilter(bedroomsSelect, 'bedrooms', true);
  bindSelectFilter(bathroomsSelect, 'bathrooms', true);
  bindSelectFilter(parkingSelect, 'parking', true);
  bindSelectFilter(builtAreaSelect, 'builtAreaMin', true);
  bindSelectFilter(landAreaSelect, 'landAreaMin', true);
  bindSelectFilter(amenitySelect, 'amenity', false);

  // Initialize properties load
  renderProperties();
}

/* ---------- Theme Toggle ---------- */
function initThemeToggle() {
  const toggleBtn = document.getElementById('themeToggle');
  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
}

