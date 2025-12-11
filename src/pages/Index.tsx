import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, Zap, CheckCircle2, Lock, XCircle, Star, Quote, Loader2, Timer, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonColorful } from "@/components/ui/button-colorful";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Product {
  id: string;
  title: string;
  short_description: string;
  full_description: string;
  price: number;
  features: string[];
  cta_text: string;
  is_free: boolean;
  image_url?: string;
  badge?: string;
  original_price_label?: string;
  original_price_display?: string;
  price_display: string;
  price_microcopy: string;
  is_featured?: boolean;
  image_type?: string;
}

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });
      
      if (!error && data) {
         const sorted = [...data].sort((a, b) => (Number(b.is_featured) - Number(a.is_featured)));
         setProducts(sorted);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const testimonials = [
    {
      name: "Carlos M.",
      role: "Freelancer",
      content: "Con el flujo de n8n de la guía dejé de pagar cuatro herramientas y me ahorré más de USD 200 al mes. Es absurdo que esto cueste menos que una cena. Siento que por primera vez tengo un sistema, no un truquito.",
      initials: "CM"
    },
    {
      name: "Sofia R.",
      role: "Agencia de Marketing",
      content: "Implementé el PLAN 1K un lunes. El jueves ya había cerrado mi primer cliente de USD 800 con un servicio de IA armado solo con las plantillas. No fue magia, fue seguir el paso a paso y animarme a ofrecerlo.",
      initials: "SR"
    },
    {
      name: "David K.",
      role: "Developer",
      content: "Pensé que ya sabía de IA hasta que vi cómo empaquetar y vender infraestructura completa, no solo scripts sueltos. Con el primer cliente recuperé más de diez veces lo que pagué por el pack. Jordi está jugando otro juego.",
      initials: "DK"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-neon selection:text-black font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-neon opacity-20 blur-[100px]"></div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon/10 border border-neon/20 text-neon text-xs font-bold tracking-wider mb-8 uppercase animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-neon"></span>
            </span>
            La era de la IA ya arrancó (vos decidís si la aprovechás)
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 leading-tight">
            <span className="text-foreground">FACTURÁ </span>
            <span className="text-neon">CON IA</span>
            <br />
            <span className="text-neon">ANTES DE QUE SEA TARDE</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-4 leading-relaxed">
            Guías y sistemas IA probados (como PLAN 1K) para que tus ideas y habilidades se vuelvan ingresos reales.
          </p>

          <p className="text-sm font-medium text-foreground/80 mb-10">
            Guías desde USD 9.99 · Pago único · Acceso inmediato y de por vida
          </p>
          
          <div className="flex flex-col items-center gap-4">
            <a href="#products">
              <ButtonColorful 
                label="ACCEDER AL ARSENAL ⚡" 
                className="w-full sm:w-auto h-auto px-8 py-6 text-lg hover:scale-105 transition-transform"
              />
            </a>
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              <span className="bg-muted/50 text-muted-foreground px-2 py-1 rounded text-[10px] border border-border">+1500 implementadores</span>
              <span className="bg-muted/50 text-muted-foreground px-2 py-1 rounded text-[10px] border border-border">Actualizado 2025</span>
            </div>
          </div>
        </div>
      </section>

      {/* Authority Banner */}
      <section className="border-y border-border bg-muted/30 py-8 overflow-hidden">
        <div className="container mx-auto px-4 flex flex-wrap justify-center gap-x-8 gap-y-4 items-center text-muted-foreground font-mono text-sm uppercase tracking-widest text-center">
          <span className="flex items-center gap-2"><CheckCircle2 className="text-neon w-4 h-4"/> 100% probado en negocios reales</span>
          <span className="flex items-center gap-2"><CheckCircle2 className="text-neon w-4 h-4"/> Resultados medibles</span>
          <span className="flex items-center gap-2"><CheckCircle2 className="text-neon w-4 h-4"/> Acceso inmediato</span>
        </div>
      </section>

      {/* Products Grid */}
      <section id="products" className="py-24 relative bg-muted/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">EL ARSENAL</h2>
              <p className="text-muted-foreground">Herramientas tácticas para tu crecimiento.</p>
            </div>
            <div className="h-1 w-full md:w-auto flex-1 bg-border mx-4 self-center"></div>
          </div>

          {loading ? (
             <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-neon" />
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {products.map((product) => (
                <Link 
                    key={product.id} 
                    to={`/product/${product.id}`}
                    className="group relative bg-card border border-border flex flex-col h-full rounded-xl shadow-sm hover:shadow-2xl hover:shadow-neon/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                    {/* Featured/Badge Overlay */}
                    {(product.badge) && (
                         <div className={`absolute top-0 right-0 z-20 px-4 py-1 text-xs font-bold uppercase tracking-wider rounded-bl-lg shadow-md ${product.is_featured ? 'bg-neon text-black' : 'bg-foreground text-background'}`}>
                            {product.badge}
                         </div>
                    )}

                    {/* Image Area - UPDATED to aspect-square and object-cover */}
                    <div className="aspect-square w-full bg-black/40 relative overflow-hidden flex items-center justify-center">
                      <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent opacity-20 z-10 pointer-events-none"></div>
                      
                      {product.image_url ? (
                          <img 
                            src={product.image_url} 
                            alt={product.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                          />
                      ) : (
                          <div className="absolute inset-0 flex items-center justify-center z-0 bg-muted/30">
                              {(product.image_type === 'chart-line-up' || !product.image_type) && <Zap className="w-16 h-16 text-muted-foreground/20 group-hover:text-neon/50 transition-colors" />}
                              {product.image_type === 'infinity' && <div className="text-6xl font-bold text-muted-foreground/20 group-hover:text-neon/50 transition-colors">∞</div>}
                              {product.image_type === 'unlock' && <Lock className="w-16 h-16 text-muted-foreground/20 group-hover:text-neon/50 transition-colors" />}
                          </div>
                      )}
                    </div>

                    <div className="p-6 flex flex-col flex-1 relative z-20 -mt-6">
                      {/* Product Card Body */}
                      <div className="bg-card border border-border rounded-lg p-5 shadow-lg flex-1 flex flex-col">
                          <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-neon transition-colors leading-tight">
                              {product.title}
                          </h3>
                          <p className="text-muted-foreground text-xs leading-relaxed mb-4 line-clamp-3">
                              {product.short_description}
                          </p>
                          
                          {/* Divider */}
                          <div className="w-full h-px bg-border/50 my-auto"></div>

                          {/* Pricing Section - No Brainer Style */}
                          <div className="pt-4 mt-2">
                             <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                    {product.original_price_display && !product.is_free && (
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs text-muted-foreground line-through decoration-destructive/60">
                                                {product.original_price_display}
                                            </span>
                                            <Badge variant="outline" className="text-[10px] h-4 px-1 py-0 border-neon/30 text-neon bg-neon/5">
                                                OFERTA
                                            </Badge>
                                        </div>
                                    )}
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-2xl font-black text-foreground tracking-tighter group-hover:text-neon transition-colors">
                                            {product.price_display || (product.price === 0 ? "GRATIS" : `$${product.price}`)}
                                        </span>
                                    </div>
                                    {!product.is_free && (
                                        <span className="text-[10px] text-muted-foreground font-medium">
                                            {product.price_microcopy ? "Pago único" : "Acceso inmediato"}
                                        </span>
                                    )}
                                </div>
                                
                                <div className="h-10 w-10 rounded-full bg-secondary group-hover:bg-neon flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-sm">
                                    <ArrowRight className="w-5 h-5 text-foreground group-hover:text-black" />
                                </div>
                             </div>
                          </div>
                      </div>
                    </div>
                </Link>
                ))}
            </div>
          )}
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-24 bg-background border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">¿POR QUÉ MIS SISTEMAS?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              La mayoría vende promesas. Yo te vendo los sistemas que uso para facturar.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
            {/* The Old Way */}
            <div className="p-8 border border-border bg-muted/20 rounded-lg flex flex-col">
               <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                 <XCircle className="text-red-500 w-5 h-5" /> MÉTODOS VIEJOS
               </h3>
               <ul className="space-y-4 text-muted-foreground flex-1 text-sm">
                 <li className="flex gap-3 items-start"><span className="text-red-500 mt-1 font-bold">✕</span> <span>Pagar Ads sin validar oferta.</span></li>
                 <li className="flex gap-3 items-start"><span className="text-red-500 mt-1 font-bold">✕</span> <span>Crear contenido manualmente 24/7.</span></li>
                 <li className="flex gap-3 items-start"><span className="text-red-500 mt-1 font-bold">✕</span> <span>Suscripciones mensuales que sangran tu caja.</span></li>
               </ul>
            </div>

            {/* The New Way */}
            <div className="p-8 border border-neon/30 bg-neon/5 rounded-lg shadow-[0_0_50px_rgba(212,232,58,0.05)] flex flex-col">
               <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                 <CheckCircle2 className="text-neon w-5 h-5" /> JORDIGPT WAY
               </h3>
               <ul className="space-y-4 text-foreground/90 flex-1 text-sm">
                 <li className="flex gap-3 items-start"><span className="text-neon mt-1 font-bold">✓</span> <span>Tráfico orgánico + IA.</span></li>
                 <li className="flex gap-3 items-start"><span className="text-neon mt-1 font-bold">✓</span> <span>Automatizaciones Costo Cero.</span></li>
                 <li className="flex gap-3 items-start"><span className="text-neon mt-1 font-bold">✓</span> <span>Pago único y acceso de por vida.</span></li>
               </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 border-t border-border bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-foreground mb-4 text-center">PREGUNTAS FRECUENTES</h2>
          <div className="space-y-4 mt-8">
            <Accordion type="single" collapsible className="w-full space-y-4">
                <AccordionItem value="item-1" className="border border-border rounded-lg px-4 data-[state=open]:border-neon/30">
                <AccordionTrigger className="text-foreground hover:text-neon hover:no-underline font-medium text-left">
                    ¿Cómo recibo el acceso?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                    Acceso inmediato por email post-compra. Panel privado de descargas.
                </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2" className="border border-border rounded-lg px-4 data-[state=open]:border-neon/30">
                <AccordionTrigger className="text-foreground hover:text-neon hover:no-underline font-medium text-left">
                    ¿Sirve si no se programar?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                    100%. Todo está pensado para Low-Code / No-Code. Copiar, pegar, configurar.
                </AccordionContent>
                </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;