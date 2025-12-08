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
}

export const products: Product[] = [
  {
    id: "plan-1k",
    title: "PLAN 1K",
    shortDescription: "El blueprint exacto para generar $1,000 USD en 14 días.",
    fullDescription: "No es teoría. Es el sistema exacto que utilizo. El PLAN 1K es una intervención quirúrgica a tu economía. Te enseño paso a paso cómo configurar una oferta irresistible con IA y cerrar tus primeros clientes high-ticket en tiempo récord. Si sigues las instrucciones, el fracaso es matemáticamente imposible.",
    price: 29.99,
    features: [
      "Roadmap día por día (Día 1 a Día 14)",
      "Scripts de venta copiables",
      "Configuración de IA para delivery automático",
      "Acceso a templates privados"
    ],
    ctaText: "ACCEDER AL PLAN AHORA",
    isFree: false,
    image: "chart-line-up"
  },
  {
    id: "n8n-infinite",
    title: "N8N 100% FREE",
    shortDescription: "Rompe la matrix: Instancias infinitas de n8n sin pagar un centavo.",
    fullDescription: "Las automatizaciones son el nuevo petróleo, pero los costos de servidor te comen las ganancias. He descubierto un exploit legítimo en la infraestructura cloud que te permite levantar instancias de n8n con capacidad ilimitada. Olvídate de Hostinger, olvídate de AWS. Esto es pura ganancia neta.",
    price: 9.99,
    features: [
      "Setup en menos de 15 minutos",
      "Sin tarjetas de crédito requeridas",
      "Escalabilidad infinita",
      "Actualizaciones de por vida"
    ],
    ctaText: "DESBLOQUEAR MÉTODO",
    isFree: false,
    image: "infinity"
  },
  {
    id: "google-pro-hack",
    title: "GOOGLE PRO + IA SUITE",
    shortDescription: "Herramientas IA ilimitadas por 12 meses. Gratis.",
    fullDescription: "Deja de pagar suscripciones ridículas. Con esta guía, te muestro cómo obtener el estatus Pro en el ecosistema de Google y acceder a las herramientas de IA más potentes del mercado sin sacar la billetera por un año entero. Es mi regalo de bienvenida al futuro.",
    price: 0,
    features: [
      "Acceso a Gemini Advanced",
      "2TB de Almacenamiento Cloud",
      "Suite de herramientas IA premium",
      "Método 100% legal y verificado"
    ],
    ctaText: "DESCARGAR GRATIS",
    isFree: true,
    image: "unlock"
  }
];