import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, CheckCircle2, XCircle, Star, Loader2 } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { PillButton } from "@/components/PillButton";

interface Product {
  id: string;
  slug: string;
  title: string;
  short_description: string;
  full_description: string;
  price: number;
  features: string[];
  cta_text: string;
  is_free: boolean;
  image_url?: string;
  gallery_images?: string[];
  badge?: string;
  original_price_label?: string;
  original_price_display?: string;
  price_display: string;
  price_microcopy: string;
  is_featured?: boolean;
  image_type?: string;
  sort_order?: number;
}

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });
      
      if (!error && data) {
         setProducts(data);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

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
            LA ERA DE LA IA YA ARRANCÓ · APROVECHALA
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 leading-tight">
            FACTURÁ <span className="text-neon">CON IA</span>
            <br />
            <span className="text-3xl md:text-6xl text-muted-foreground">MIENTRAS OTROS DUDAN</span>
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-4 leading-relaxed">
            Guías y sistemas IA probados para que tus ideas y habilidades se vuelvan ingresos reales.
          </p>

          <p className="text-sm font-medium text-foreground/80 mb-10">
            Guías desde USD 9.99 · Pago único · Acceso inmediato y de por vida
          </p>
          
          <div className="flex flex-col items-center gap-4">
            <a href="#products">
              <PillButton>
                <span className="flex items-center justify-center">
                  EMPEZAR A FACTURAR CON IA
                  <ArrowRight className="ml-3 h-5 w-5" />
                </span>
              </PillButton>
            </a>
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              <span className="bg-muted/50 text-muted-foreground px-2 py-1 rounded text-[10px] border border-border">Procesos paso a paso</span>
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

      {/* About Me Section (New) */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="container mx-auto px-4">
           <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              
              {/* Image Side */}
              <div className="relative order-2 md:order-1 group">
                 <div className="absolute inset-0 bg-neon blur-[80px] opacity-20 rounded-full group-hover:opacity-30 transition-opacity duration-700"></div>
                 <div className="relative aspect-[4/5] md:aspect-square w-full max-w-md mx-auto rounded-2xl overflow-hidden border border-border shadow-2xl bg-muted/20">
                    <img 
                      src="/jordi-profile.png" 
                      alt="Jordi" 
                      className="w-full h-full object-cover transition-all duration-700 transform group-hover:scale-105" 
                    />
                 </div>
                 {/* Decorativo */}
                 <div className="absolute -bottom-6 -right-6 bg-background border border-border p-4 rounded-lg shadow-xl hidden md:block z-10">
                    <p className="text-neon font-bold text-xl font-mono">Excelencia</p>
                    <p className="text--[10px] text-muted-foreground uppercase tracking-widest">Operativa</p>
                 </div>
              </div>

              {/* Text Side */}
              <div className="order-1 md:order-2 space-y-6">
                 <div className="inline-block">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tighter uppercase mb-2">
                       No soy un <br/> <span className="text-neon">Gurú de la IA.</span>
                    </h2>
                    <div className="h-1 w-20 bg-neon"></div>
                 </div>
                 
                 <div className="prose prose-invert text-muted-foreground text-lg leading-relaxed">
                    <p>
                       Soy Jordi, y al igual que vos, me cansé de ver cómo la tecnología avanzaba mientras mis ingresos se quedaban estancados.
                    </p>
                    <p>
                       No te voy a vender humo ni promesas de millonario de la noche a la mañana. Lo que vas a encontrar acá son <strong>los mismos sistemas exactos</strong> que desarrollé para automatizar mi propio trabajo y multiplicar mi facturación sin clonarme a mí mismo.
                    </p>
                    <p>
                       Mi obsesión es simple: <span className="text-foreground font-medium">Transformar complejidad técnica en dinero real en tu cuenta.</span> Si estás listo para dejar de jugar con ChatGPT y empezar a construir activos digitales serios, estás en el lugar correcto.
                    </p>
                 </div>
              </div>

           </div>
        </div>
      </section>

      {/* Products Grid */}
      <section id="products" className="py-24 relative bg-muted/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">TUS RECURSOS IA</h2>
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
                    to={`/${product.slug || product.id}`}
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
                              <span className="text-neon text-4xl">JG</span>
                          </div>
                      )}
                    </div>

                    <div className="p-6 flex flex-col flex-1 relative z-20 -mt-12">
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
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">¿POR QUÉ <span className="text-neon">MIS SISTEMAS</span>?</h2>
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
               <ul className="space-y-4 text-muted-foreground flex-1 text-base">
                 <li className="flex gap-3 items-start"><span className="text-red-500 mt-1 font-bold">✕</span> <span>Pagar Ads sin validar oferta.</span></li>
                 <li className="flex gap-3 items-start"><span className="text-red-500 mt-1 font-bold">✕</span> <span>Crear contenido manualmente 24/7.</span></li>
                 <li className="flex gap-3 items-start"><span className="text-red-500 mt-1 font-bold">✕</span> <span>Suscripciones mensuales que joden el cash flow.</span></li>
               </ul>
            </div>

            {/* The New Way */}
            <div className="p-8 border border-neon/30 bg-neon/5 rounded-lg shadow-[0_0_50px_rgba(212,232,58,0.05)] flex flex-col">
               <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                 <CheckCircle2 className="text-neon w-5 h-5" /> JORDIGPT WAY
               </h3>
               <ul className="space-y-4 text-foreground/90 flex-1 text-base">
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
                
                {/* Nuevas FAQs Persuasivas */}
                <AccordionItem value="item-3" className="border border-border rounded-lg px-4 data-[state=open]:border-neon/30">
                <AccordionTrigger className="text-foreground hover:text-neon hover:no-underline font-medium text-left">
                    ¿Es diferente a lo que hay gratis en YouTube?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                    YouTube te da piezas sueltas; yo te doy el rompecabezas armado. Además, muchos de mis métodos y estrategias no están en YouTube; literalmente nadie los enseña públicamente. No pierdas meses filtrando ruido. Aquí tienes la estrategia exacta, los prompts probados y la estructura validada. El tiempo que te ahorras en prueba y error paga la inversión el primer día.
                </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4" className="border border-border rounded-lg px-4 data-[state=open]:border-neon/30">
                <AccordionTrigger className="text-foreground hover:text-neon hover:no-underline font-medium text-left">
                    No tengo tiempo para aprender algo nuevo ahora.
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                    Justamente por eso lo necesitas. No son cursos teóricos de 20 horas. Son sistemas de implementación rápida: copias, pegas y recuperas semanas de trabajo manual en una tarde. Si no tienes tiempo, es urgente que automatices.
                </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5" className="border border-border rounded-lg px-4 data-[state=open]:border-neon/30">
                <AccordionTrigger className="text-foreground hover:text-neon hover:no-underline font-medium text-left">
                    ¿Qué pasa si la IA cambia el mes que viene?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                    El sistema incluye garantía de actualización 2025. Mis estrategias se basan en fundamentos de negocio, no en "hacks" temporales. Si la tecnología cambia, actualizo el producto y tú recibes la mejora gratis. Estás cubierto.
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