import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, CheckCircle2, XCircle, Star, Loader2, Ban, Download, Users, Code, Rocket, Zap, ExternalLink } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  is_out_of_stock?: boolean;
  gumroad_link?: string;
  downloads_count?: number;
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
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <a href="#products">
              <PillButton>
                <span className="flex items-center justify-center">
                  RECURSOS GRATUITOS
                  <ArrowRight className="ml-3 h-5 w-5" />
                </span>
              </PillButton>
            </a>
            
            <a 
              href="https://www.skool.com/jordigpt/about" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full md:w-auto"
            >
              <Button 
                variant="outline" 
                className="w-full md:w-auto h-[58px] rounded-full px-8 border-neon/30 text-neon hover:bg-neon hover:text-black font-bold tracking-wide uppercase text-sm transition-all shadow-[0_0_15px_rgba(212,232,58,0.05)] hover:shadow-[0_0_25px_rgba(212,232,58,0.3)] bg-black/50 backdrop-blur-sm"
              >
                <Users className="mr-2 h-5 w-5" />
                COMUNIDAD SKOOL
              </Button>
            </a>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <span className="bg-muted/50 text-muted-foreground px-2 py-1 rounded text-[10px] border border-border">Procesos paso a paso</span>
            <span className="bg-muted/50 text-muted-foreground px-2 py-1 rounded text-[10px] border border-border">Actualizado 2025</span>
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

      {/* About Me Section */}
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

      {/* SKOOL COMMUNITY SECTION */}
      <section className="py-24 border-y border-neon/20 bg-black relative overflow-hidden group">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        <div className="absolute right-0 top-0 w-1/2 h-full bg-neon/5 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
                
                {/* Content */}
                <div className="flex-1 space-y-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon text-black text-xs font-black tracking-wider uppercase">
                        <Users className="w-3 h-3" /> Comunidad Privada
                    </div>
                    
                    <div>
                        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-[0.9] mb-4">
                            JordiGPT <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon to-white">Builders</span>
                        </h2>
                        <p className="text-xl text-gray-400 font-light max-w-xl">
                            El entorno donde la tecnología se encuentra con el negocio real. Deja de construir solo.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                        <div className="flex gap-4 items-start p-4 rounded-lg bg-white/5 border border-white/10 hover:border-neon/30 transition-colors">
                            <Code className="w-6 h-6 text-neon shrink-0" />
                            <div>
                                <h4 className="font-bold text-white mb-1">AI-Vibe Coding</h4>
                                <p className="text-sm text-gray-400">Construye software y MVPs sin ser desarrollador senior.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start p-4 rounded-lg bg-white/5 border border-white/10 hover:border-neon/30 transition-colors">
                            <Rocket className="w-6 h-6 text-neon shrink-0" />
                            <div>
                                <h4 className="font-bold text-white mb-1">Negocios Digitales</h4>
                                <p className="text-sm text-gray-400">Estrategias de monetización y validación de ofertas.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start p-4 rounded-lg bg-white/5 border border-white/10 hover:border-neon/30 transition-colors">
                            <Star className="w-6 h-6 text-neon shrink-0" />
                            <div>
                                <h4 className="font-bold text-white mb-1">Marca Personal Auténtica</h4>
                                <p className="text-sm text-gray-400">Diferenciación radical en un mercado saturado.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start p-4 rounded-lg bg-white/5 border border-white/10 hover:border-neon/30 transition-colors">
                            <Zap className="w-6 h-6 text-neon shrink-0" />
                            <div>
                                <h4 className="font-bold text-white mb-1">Distribución Viral</h4>
                                <p className="text-sm text-gray-400">Contenido orgánico de nicho que convierte.</p>
                            </div>
                        </div>
                    </div>

                    <a 
                        href="https://www.skool.com/jordigpt/about" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-block w-full sm:w-auto"
                    >
                        <Button className="w-full sm:w-auto bg-neon text-black hover:bg-neon/90 font-bold text-lg h-14 px-10 shadow-[0_0_20px_rgba(212,232,58,0.4)] hover:shadow-[0_0_40px_rgba(212,232,58,0.6)] transition-all uppercase">
                            UNIRSE AHORA
                            <ExternalLink className="ml-2 w-5 h-5" />
                        </Button>
                    </a>
                </div>

                {/* Visual Representation (Mockup styled) */}
                <div className="flex-1 w-full lg:w-auto flex justify-center lg:justify-end relative">
                    <div className="relative w-full max-w-md aspect-[4/5] bg-neutral-900 rounded-2xl border border-neutral-800 p-2 shadow-2xl rotate-3 hover:rotate-0 transition-all duration-500">
                        {/* Fake Browser UI */}
                        <div className="h-full w-full bg-black rounded-xl overflow-hidden relative">
                             <div className="absolute top-0 w-full h-12 bg-neutral-900 border-b border-neutral-800 flex items-center px-4 gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500/20"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
                                <div className="ml-4 h-6 w-32 bg-neutral-800 rounded-full"></div>
                             </div>
                             
                             {/* Content Mockup */}
                             <div className="mt-16 px-6 space-y-6">
                                <div className="w-16 h-16 rounded-xl bg-neon flex items-center justify-center">
                                    <span className="text-black font-black text-2xl">JG</span>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-8 w-3/4 bg-neutral-800 rounded animate-pulse"></div>
                                    <div className="h-4 w-1/2 bg-neutral-900 rounded"></div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-3 mt-8">
                                    <div className="aspect-video bg-neutral-900 rounded border border-neutral-800"></div>
                                    <div className="aspect-video bg-neutral-900 rounded border border-neutral-800"></div>
                                    <div className="aspect-video bg-neutral-900 rounded border border-neutral-800"></div>
                                    <div className="aspect-video bg-neutral-900 rounded border border-neutral-800 flex items-center justify-center text-neon text-xs font-mono">+120 Clases</div>
                                </div>

                                <div className="mt-8 p-4 bg-neon/10 rounded border border-neon/20">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-white/10"></div>
                                        <div className="flex-1 h-3 bg-white/10 rounded"></div>
                                    </div>
                                    <div className="mt-3 h-2 w-full bg-white/5 rounded"></div>
                                    <div className="mt-2 h-2 w-2/3 bg-white/5 rounded"></div>
                                </div>
                             </div>

                             {/* Floating Elements */}
                             <div className="absolute bottom-8 right-8 bg-black border border-neon/50 text-neon px-4 py-2 rounded-lg text-xs font-bold shadow-[0_0_20px_rgba(212,232,58,0.2)]">
                                 @jordigpt
                             </div>
                        </div>
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
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-8">
                {products.map((product) => (
                <Link 
                    key={product.id} 
                    to={`/${product.slug || product.id}`}
                    className={`group relative bg-card border flex flex-col h-full rounded-xl shadow-sm transition-all duration-300 overflow-hidden ${product.is_out_of_stock ? 'border-red-500/20 opacity-90' : 'border-border hover:shadow-2xl hover:shadow-neon/10 hover:-translate-y-1'}`}
                >
                    {/* Featured/Badge Overlay */}
                    {(product.badge || product.is_out_of_stock) && (
                         <div className={`absolute top-0 right-0 z-20 px-2 py-0.5 md:px-4 md:py-1 text-[9px] md:text-xs font-bold uppercase tracking-wider rounded-bl-lg shadow-md ${product.is_out_of_stock ? 'bg-red-500 text-white' : product.is_featured ? 'bg-neon text-black' : 'bg-foreground text-background'}`}>
                            {product.is_out_of_stock ? 'AGOTADO' : product.badge}
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

                    <div className="p-3 md:p-6 flex flex-col flex-1 relative z-20 -mt-8 md:-mt-12">
                      {/* Product Card Body */}
                      <div className="bg-card border border-border rounded-lg p-3 md:p-5 shadow-lg flex-1 flex flex-col">
                          <h3 className="text-sm md:text-lg font-bold text-foreground mb-1 md:mb-2 group-hover:text-neon transition-colors leading-tight line-clamp-2">
                              {product.title}
                          </h3>
                          <p className="text-muted-foreground text-[10px] md:text-xs leading-relaxed mb-3 md:mb-4 line-clamp-2 md:line-clamp-3">
                              {product.short_description}
                          </p>
                          
                          {/* Divider */}
                          <div className="w-full h-px bg-border/50 my-auto"></div>

                          {/* Pricing Section - No Brainer Style */}
                          <div className="pt-3 md:pt-4 mt-2">
                             <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                    {product.original_price_display && !product.is_free && (
                                        <div className="flex items-center gap-1 md:gap-2 mb-1">
                                            <span className="text-[10px] md:text-xs text-muted-foreground line-through decoration-destructive/60">
                                                {product.original_price_display}
                                            </span>
                                            <Badge variant="outline" className="text-[8px] md:text-[10px] h-3 md:h-4 px-1 py-0 border-neon/30 text-neon bg-neon/5">
                                                OFERTA
                                            </Badge>
                                        </div>
                                    )}
                                    <div className="flex items-baseline gap-1">
                                        <span className={`text-lg md:text-2xl font-black text-foreground tracking-tighter group-hover:text-neon transition-colors ${product.is_out_of_stock ? 'text-muted-foreground' : ''}`}>
                                            {product.price_display || (product.price === 0 ? "GRATIS" : `$${product.price}`)}
                                        </span>
                                    </div>
                                    
                                    {/* DOWNLOADS COUNT DISPLAY */}
                                    {product.downloads_count && product.downloads_count > 0 ? (
                                       <span className="flex items-center gap-1 text-[9px] md:text-[10px] text-neon font-mono mt-1">
                                          <Download className="w-3 h-3" /> {product.downloads_count} ventas
                                       </span>
                                    ) : (
                                       !product.is_free && (
                                          <span className="text-[9px] md:text-[10px] text-muted-foreground font-medium hidden sm:inline-block mt-1">
                                              {product.price_microcopy ? "Pago único" : "Acceso inmediato"}
                                          </span>
                                       )
                                    )}
                                </div>
                                
                                <div className={`h-8 w-8 md:h-10 md:w-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${product.is_out_of_stock ? 'bg-muted text-muted-foreground' : 'bg-secondary group-hover:bg-neon group-hover:scale-110'}`}>
                                    {product.is_out_of_stock ? <Ban className="w-4 h-4 md:w-5 md:h-5" /> : <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-foreground group-hover:text-black" />}
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