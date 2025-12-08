export interface Product {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  features: string[];
  ctaText: string;
  isFree: boolean;
  image: string;
  // New fields for the updated design
  badge?: string;
  originalPriceLabel?: string;
  originalPriceDisplay?: string;
  priceDisplay: string;
  priceMicrocopy: string;
  isFeatured?: boolean;
}

export const products: Product[] = [
  {
    id: "plan-1k",
    title: "PLAN 1K",
    shortDescription: "Blueprint completo para hacer tus primeros USD 1.000 con IA en 14 días o menos, vendiendo servicios y productos aunque hoy sientas que recién estás arrancando.",
    fullDescription: "No es teoría. Es el sistema exacto que utilizo. El PLAN 1K es una intervención quirúrgica a tu economía. Te enseño paso a paso cómo configurar una oferta irresistible con IA y cerrar tus primeros clientes high-ticket en tiempo récord. Si sigues las instrucciones, el fracaso es matemáticamente imposible.",
    price: 29.99,
    priceDisplay: "US$ 29.99",
    originalPriceLabel: "Antes:",
    originalPriceDisplay: "US$ 97",
    priceMicrocopy: "Pago único · Acceso de por vida · Incluye 5 bonus de alto impacto (voz, infraestructura, marketing de webapps y más)",
    features: [
      "Roadmap día por día (Día 1 a Día 14)",
      "Scripts de venta copiables",
      "Configuración de IA para delivery automático",
      "Acceso a templates privados"
    ],
    ctaText: "ACCEDER AL PLAN 1K",
    isFree: false,
    image: "chart-line-up",
    badge: "EMPEZÁ ACÁ",
    isFeatured: true
  },
  {
    id: "n8n-infinite",
    title: "N8N 100% FREE",
    shortDescription: "Guía paso a paso para lanzar instancias ilimitadas de n8n en la nube sin pagar hosting. Ideal para agencias, freelancers y makers que quieren vender automatizaciones con costo fijo 0.",
    fullDescription: "Las automatizaciones son el nuevo petróleo, pero los costos de servidor te comen las ganancias. He descubierto un exploit legítimo en la infraestructura cloud que te permite levantar instancias de n8n con capacidad ilimitada. Olvídate de Hostinger, olvídate de AWS. Esto es pura ganancia neta.",
    price: 9.99,
    priceDisplay: "US$ 9.99",
    originalPriceLabel: "Antes:",
    originalPriceDisplay: "US$ 47",
    priceMicrocopy: "Convertí n8n en tu propia “fábrica de automatizaciones” sin sumar suscripciones.",
    features: [
      "Setup en menos de 15 minutos",
      "Sin tarjetas de crédito requeridas",
      "Escalabilidad infinita",
      "Actualizaciones de por vida"
    ],
    ctaText: "ACCEDER A LA GUÍA",
    isFree: false,
    image: "infinity"
  },
  {
    id: "google-pro-hack",
    title: "GOOGLE PRO + IA SUITE",
    shortDescription: "Atajo para activar el ecosistema Google Pro + herramientas IA avanzadas durante 12 meses sin pagar licencia. Perfecto para testear ideas, prototipos y productos sin miedo al costo.",
    fullDescription: "Deja de pagar suscripciones ridículas. Con esta guía, te muestro cómo obtener el estatus Pro en el ecosistema de Google y acceder a las herramientas de IA más potentes del mercado sin sacar la billetera por un año entero. Es mi regalo de bienvenida al futuro.",
    price: 0,
    priceDisplay: "US$ 0",
    originalPriceLabel: "Valor real:",
    originalPriceDisplay: "mucho más que US$ 29",
    priceMicrocopy: "Te lo regalo para que pruebes mi forma de trabajar antes de invertir un dólar.",
    features: [
      "Acceso a Gemini Advanced",
      "2TB de Almacenamiento Cloud",
      "Suite de herramientas IA premium",
      "Método 100% legal y verificado"
    ],
    ctaText: "DESCARGAR GRATIS",
    isFree: true,
    image: "unlock",
    badge: "GRATIS"
  }
];