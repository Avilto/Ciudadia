/* ============================================
   CIUDADIA — Filters & Search Logic
   ============================================ */

const Filters = (() => {
  let currentFilters = {
    type: 'todos',
    search: '',
    sort: 'default',
    priceMin: 0,
    priceMax: Infinity
  };

  /**
   * Apply all active filters to the properties array
   * @param {Array} data - Array of property objects
   * @returns {Array} Filtered and sorted array
   */
  function apply(data) {
    let results = [...data];

    // Filter by type
    if (currentFilters.type !== 'todos') {
      if (currentFilters.type === 'proyecto') {
        results = results.filter(p => p.isNew === true);
      } else {
        results = results.filter(p => p.type === currentFilters.type);
      }
    }

    // Filter by search text
    if (currentFilters.search.trim()) {
      const query = currentFilters.search.toLowerCase().trim();
      results = results.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.location.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      );
    }

    // Filter by price range
    results = results.filter(p =>
      p.price >= currentFilters.priceMin &&
      p.price <= currentFilters.priceMax
    );

    // Sort
    switch (currentFilters.sort) {
      case 'price-asc':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'area-desc':
        results.sort((a, b) => b.area - a.area);
        break;
      case 'newest':
        results.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default:
        // Featured first, then by id
        results.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return results;
  }

  /**
   * Set a filter value
   * @param {string} key - Filter key
   * @param {*} value - Filter value
   */
  function set(key, value) {
    if (key in currentFilters) {
      currentFilters[key] = value;
    }
  }

  /**
   * Get current filter state
   * @returns {Object} Current filters
   */
  function get() {
    return { ...currentFilters };
  }

  /**
   * Reset all filters to defaults
   */
  function reset() {
    currentFilters = {
      type: 'todos',
      search: '',
      sort: 'default',
      priceMin: 0,
      priceMax: Infinity
    };
  }

  /**
   * Get count of properties by type
   * @param {Array} data - Property data
   * @returns {Object} Counts per type
   */
  function getCounts(data) {
    const counts = { todos: data.length, proyecto: 0 };
    data.forEach(p => {
      counts[p.type] = (counts[p.type] || 0) + 1;
      if (p.isNew) {
        counts['proyecto']++;
      }
    });
    return counts;
  }

  return { apply, set, get, reset, getCounts };
})();
