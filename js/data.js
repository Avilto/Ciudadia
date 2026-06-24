/* ============================================
   CIUDADIA — Mock Property Data
   ============================================ */

const properties = [
  {
    id: 1,
    title: "Penthouse con Vista Panorámica",
    type: "departamento",
    price: 4500000,
    currency: "MXN",
    location: "Polanco, Ciudad de México",
    bedrooms: 3,
    bathrooms: 3,
    area: 210,
    parking: 2,
    description: "Espectacular penthouse en la zona más exclusiva de Polanco. Cuenta con acabados de lujo, pisos de mármol italiano, cocina integral equipada con electrodomésticos de alta gama y terraza privada con vista panorámica a la ciudad. Amenidades del edificio incluyen gimnasio, roof garden y seguridad 24/7.",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop",
    featured: true,
    isNew: true
  },
  {
    id: 2,
    title: "Casa Moderna en Zona Residencial",
    type: "casa",
    price: 6800000,
    currency: "MXN",
    location: "Juriquilla, Querétaro",
    bedrooms: 4,
    bathrooms: 3,
    area: 350,
    parking: 3,
    description: "Hermosa casa moderna con diseño arquitectónico de vanguardia. Amplios espacios, jardín con alberca, cocina gourmet, sala de TV, estudio y cuarto de servicio. Ubicada en fraccionamiento privado con campo de golf, casa club y vigilancia.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop",
    featured: true,
    isNew: false
  },
  {
    id: 3,
    title: "Loft Industrial Renovado",
    type: "departamento",
    price: 2200000,
    currency: "MXN",
    location: "Roma Norte, Ciudad de México",
    bedrooms: 1,
    bathrooms: 1,
    area: 85,
    parking: 1,
    description: "Loft de diseño industrial con techos altos de doble altura, muros de ladrillo expuesto y grandes ventanales. Ubicado en el corazón de la colonia Roma, a pasos de restaurantes, galerías y vida nocturna. Ideal para jóvenes profesionales.",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop",
    featured: false,
    isNew: true
  },
  {
    id: 4,
    title: "Terreno Premium frente al Mar",
    type: "terreno",
    price: 3500000,
    currency: "MXN",
    location: "Puerto Vallarta, Jalisco",
    bedrooms: 0,
    bathrooms: 0,
    area: 800,
    parking: 0,
    description: "Terreno premium con frente de playa de 25 metros lineales. Ubicación privilegiada en zona de alto crecimiento turístico. Ideal para desarrollo residencial o boutique hotel. Cuenta con todos los servicios y acceso pavimentado.",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop",
    featured: false,
    isNew: false
  },
  {
    id: 5,
    title: "Local Comercial en Plaza Premium",
    type: "local",
    price: 1800000,
    currency: "MXN",
    location: "Santa Fe, Ciudad de México",
    bedrooms: 0,
    bathrooms: 2,
    area: 120,
    parking: 4,
    description: "Local comercial en planta baja de plaza comercial de alto tráfico en Santa Fe. Excelente visibilidad, acabados de primera, aire acondicionado central y estacionamiento para clientes. Ideal para restaurante, boutique o showroom.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop",
    featured: false,
    isNew: false
  },
  {
    id: 6,
    title: "Villa de Lujo con Alberca",
    type: "casa",
    price: 12500000,
    currency: "MXN",
    location: "San Pedro Garza García, Monterrey",
    bedrooms: 5,
    bathrooms: 5,
    area: 520,
    parking: 4,
    description: "Impresionante villa de lujo en la zona más exclusiva de Monterrey. Diseño contemporáneo con materiales de importación, alberca infinity, jardín con áreas lounge, cava de vinos, sala de cine y sistema domótico integral. Vista espectacular a la Sierra Madre.",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&h=400&fit=crop",
    featured: true,
    isNew: false
  },
  {
    id: 7,
    title: "Departamento en Zona Universitaria",
    type: "departamento",
    price: 980000,
    currency: "MXN",
    location: "Coyoacán, Ciudad de México",
    bedrooms: 2,
    bathrooms: 1,
    area: 72,
    parking: 1,
    description: "Acogedor departamento cerca de Ciudad Universitaria. Remodelado con diseño moderno, excelente iluminación natural y balcón con vista a áreas verdes. Cerca de transporte público, centros comerciales y áreas culturales.",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop",
    featured: false,
    isNew: true
  },
  {
    id: 8,
    title: "Casa Colonial Restaurada",
    type: "casa",
    price: 5200000,
    currency: "MXN",
    location: "Centro Histórico, Mérida",
    bedrooms: 3,
    bathrooms: 2,
    area: 280,
    parking: 2,
    description: "Magnífica casa colonial del siglo XIX completamente restaurada con respeto a su arquitectura original. Altos techos con vigas de madera, pisos de pasta, patio central con fuente, y alberca en jardín trasero. Combinación perfecta de historia y confort moderno.",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop",
    featured: true,
    isNew: false
  },
  {
    id: 9,
    title: "Terreno para Desarrollo",
    type: "terreno",
    price: 8900000,
    currency: "MXN",
    location: "Playa del Carmen, Quintana Roo",
    bedrooms: 0,
    bathrooms: 0,
    area: 2500,
    parking: 0,
    description: "Gran terreno con uso de suelo mixto en zona de altísimo crecimiento. Ideal para desarrollo de condominios o plaza comercial. Ubicación estratégica sobre avenida principal, a minutos de la Quinta Avenida y la playa.",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop&q=80",
    featured: false,
    isNew: false
  },
  {
    id: 10,
    title: "Suite Ejecutiva en Torre AAA",
    type: "departamento",
    price: 3800000,
    currency: "MXN",
    location: "Paseo de la Reforma, CDMX",
    bedrooms: 2,
    bathrooms: 2,
    area: 130,
    parking: 2,
    description: "Elegante suite ejecutiva en torre de lujo sobre Reforma. Acabados de primer nivel, piso de madera, cocina italiana y vista icónica al Ángel de la Independencia. Amenidades: alberca, gym, spa, business center, concierge y valet parking.",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop",
    featured: false,
    isNew: true
  },
  {
    id: 11,
    title: "Local Esquinero en Avenida Principal",
    type: "local",
    price: 2400000,
    currency: "MXN",
    location: "Guadalajara Centro, Jalisco",
    bedrooms: 0,
    bathrooms: 1,
    area: 95,
    parking: 0,
    description: "Excelente local esquinero con doble frente y alta visibilidad en avenida principal del centro de Guadalajara. Zona de alto tráfico peatonal y vehicular. Ideal para sucursal bancaria, farmacia o tienda de conveniencia.",
    image: "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=600&h=400&fit=crop",
    featured: false,
    isNew: false
  },
  {
    id: 12,
    title: "Residencia de Autor con Jardín",
    type: "casa",
    price: 9200000,
    currency: "MXN",
    location: "Valle de Bravo, Estado de México",
    bedrooms: 4,
    bathrooms: 4,
    area: 420,
    parking: 3,
    description: "Espectacular residencia de autor rodeada de naturaleza con vista al lago. Arquitectura orgánica que integra espacios interiores y exteriores. Materiales nobles, chimenea, sala de estar con doble altura, terraza panorámica y muelle privado.",
    image: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=600&h=400&fit=crop",
    featured: true,
    isNew: false
  }
];

/* ---------- Helper Functions ---------- */
function formatPrice(price) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
}

function getTypeLabel(type) {
  const labels = {
    casa: 'Casa',
    departamento: 'Departamento',
    terreno: 'Terreno',
    local: 'Local Comercial'
  };
  return labels[type] || type;
}

function getTypeEmoji(type) {
  const emojis = {
    casa: '🏠',
    departamento: '🏢',
    terreno: '🌳',
    local: '🏪'
  };
  return emojis[type] || '🏠';
}
