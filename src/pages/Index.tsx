import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, Zap, CheckCircle2, Lock, XCircle, Star, Quote, Loader2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
         // Sort explicitly just in case
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
        {/* Background Grid Effect */}
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
            <span className="text-neon">ANTES DE QUE TE PASEN POR ARRIBA</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-4 leading-relaxed">
            Accedé a mi arsenal de guías, sistemas y plantillas IA (como PLAN 1K) para convertir chats, automatizaciones y apps en ingresos reales. Sin humo, sin teoría vieja: solo lo que ya usé para facturar.
          </p>

          <p className="text-sm font-medium text-foreground/80 mb-10">
            Guías desde USD 9.99 · Pago único · Acceso inmediato y de por vida
          </p>
          
          <div className="flex flex-col items-center gap-4">
            <a href="#products">
              <Button className="bg-neon text-black hover:bg-neon/80 font-bold text-lg px-8 py-6 h-auto rounded-none border border-transparent hover:border-foreground/20 transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(212,232,58,0.4)]">
                ACCEDER AL ARSENAL ⚡
              </Button>
            </a>
            <p className="text-xs text-muted-foreground max-w-md text-center">
              Implementables aunque recién estés empezando con IA. Nada de suscripciones, nada de plataformas raras.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              <span className="bg-muted/50 text-muted-foreground px-2 py-1 rounded text-[10px] border border-border">+1500 implementadores</span>
              <span className="bg-muted/50 text-muted-foreground px-2 py-1 rounded text-[10px] border border-border">Contenido actualizado 2025</span>
              <span className="bg-muted/50 text-muted-foreground px-2 py-1 rounded text-[10px] border border-border">Sin suscripciones mensuales</span>
            </div>
          </div>
        </div>
      </section>

      {/* Authority Banner */}
      <section className="border-y border-border bg-muted/30 py-8 overflow-hidden">
        <div className="container mx-auto px-4 flex flex-wrap justify-center gap-x-8 gap-y-4 items-center text-muted-foreground font-mono text-sm uppercase tracking-widest text-center">
          <span className="flex items-center gap-2"><CheckCircle2 className="text-neon w-4 h-4"/> 100% probado en negocios reales</span>
          <span className="flex items-center gap-2"><CheckCircle2 className="text-neon w-4 h-4"/> Resultados medibles, no likes</span>
          <span className="flex items-center gap-2"><CheckCircle2 className="text-neon w-4 h-4"/> Acceso inmediato y actualizaciones</span>
          <span className="flex items-center gap-2"><CheckCircle2 className="text-neon w-4 h-4"/> Soporte por mail/DM</span>
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
                    className="group relative bg-card border border-border overflow-hidden hover:border-neon/50 transition-all duration-300 flex flex-col h-full rounded-md shadow-sm hover:shadow-lg hover:shadow-neon/5"
                >
                    {/* Badge destacado */}
                    {(product.badge) && (
                         <div className={`absolute top-0 right-0 z-20 px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-bl-lg shadow-md ${product.is_featured ? 'bg-neon text-black' : 'bg-foreground text-background'}`}>
                            {product.badge}
                         </div>
                    )}
                    
                    {/* Image Placeholder area */}
                    <div className="h-56 bg-muted/30 flex items-center justify-center border-b border-border group-hover:bg-muted/50 transition-colors relative overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neon/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      {product.image_url ? (
                          <img src={product.image_url} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                          <div className="relative z-10">
                              {(product.image_type === 'chart-line-up' || !product.image_type) && <Zap className="w-20 h-20 text-muted-foreground/30 group-hover:text-neon transition-colors duration-500 group-hover:scale-110 transform" />}
                              {product.image_type === 'infinity' && <div className="text-7xl font-bold text-muted-foreground/30 group-hover:text-neon transition-colors duration-500 group-hover:scale-110 transform">∞</div>}
                              {product.image_type === 'unlock' && <Lock className="w-20 h-20 text-muted-foreground/30 group-hover:text-neon transition-colors duration-500 group-hover:scale-110 transform" />}
                          </div>
                      )}

                      {/* Free Tag if specific */}
                      {product.is_free && !product.badge && (
                        <div className="absolute top-4 left-4 bg-muted-foreground/20 backdrop-blur-md border border-white/10 text-foreground px-2 py-1 rounded text-xs font-bold">
                          FREE
                        </div>
                      )}
                    </div>

                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-neon transition-colors flex items-start justify-between gap-2">
                          {product.title}
                          {product.is_featured && <Star className="w-4 h-4 text-neon fill-neon flex-shrink-0 mt-1" />}
                      </h3>
                      
                      <p className="text-muted-foreground text-sm mb-6 line-clamp-3 leading-relaxed">
                          {product.short_description}
                      </p>
                      
                      <div className="mt-auto pt-5 border-t border-border/50">
                          <div className="flex items-end justify-between">
                            <div className="flex flex-col">
                              {product.original_price_display && (
                                <span className="text-xs text-muted-foreground/70 line-through decoration-red-500/50 mb-0.5 font-mono">
                                  {product.original_price_display}
                                </span>
                              )}
                              <span className="text-2xl font-mono font-bold text-foreground tracking-tight">
                                {product.price_display || (product.price === 0 ? "GRATIS" : `$${product.price}`)}
                              </span>
                            </div>
                            
                            <Button size="sm" className="bg-foreground text-background hover:bg-neon hover:text-black font-bold text-xs px-4 h-9 rounded-sm transition-all shadow-none group-hover:shadow-[0_0_15px_rgba(212,232,58,0.3)]">
                              VER MÁS <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </div>
                      </div>
                    </div>
                </Link>
                ))}
            </div>
          )}
        </div>
      </section>

      {/* Comparison Section (Why Me?) */}
      <section className="py-24 bg-background border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">¿POR QUÉ MIS SISTEMAS Y NO OTRO CURSO MÁS?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              La mayoría vende promesas vacías. Yo documento los sistemas reales que uso para crecer mis propios negocios y los de mis clientes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
            {/* The Old Way */}
            <div className="p-8 border border-border bg-muted/20 rounded-lg relative overflow-hidden opacity-90 hover:opacity-100 transition-opacity flex flex-col order-1 md:order-1 h-full">
               <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                 <XCircle className="text-red-500 w-5 h-5" /> MÉTODOS OBSOLETOS
               </h3>
               <ul className="space-y-4 text-muted-foreground flex-1 text-sm">
                 <li className="flex gap-3 items-start"><span className="text-red-500 mt-1 font-bold">✕</span> <span>Pagar Ads carísimos sin saber si van a convertir.</span></li>
                 <li className="flex gap-3 items-start"><span className="text-red-500 mt-1 font-bold">✕</span> <span>Pasarte 8 horas por día creando contenido que nadie ve.</span></li>
                 <li className="flex gap-3 items-start"><span className="text-red-500 mt-1 font-bold">✕</span> <span>Contratar “agencias de IA” que tercerizan todo.</span></li>
                 <li className="flex gap-3 items-start"><span className="text-red-500 mt-1 font-bold">✕</span> <span>Pagar +USD 500/mes en software SaaS innecesario.</span></li>
               </ul>
            </div>

            {/* The New Way */}
            <div className="p-8 border border-neon/30 bg-neon/5 rounded-lg relative overflow-hidden shadow-[0_0_50px_rgba(212,232,58,0.05)] flex flex-col order-2 md:order-2 h-full transform hover:-translate-y-1 transition-transform duration-300">
               <div className="absolute top-0 right-0 px-3 py-1 bg-neon text-black text-[10px] font-bold uppercase tracking-widest">JordiGPT Way</div>
               <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                 <CheckCircle2 className="text-neon w-5 h-5" /> EL NUEVO ESTÁNDAR
               </h3>
               <ul className="space-y-4 text-foreground/90 flex-1 text-sm">
                 <li className="flex gap-3 items-start"><span className="text-neon mt-1 font-bold">✓</span> <span>Sistemas de tráfico orgánico apalancados con IA.</span></li>
                 <li className="flex gap-3 items-start"><span className="text-neon mt-1 font-bold">✓</span> <span>Automatizaciones n8n con costo fijo 0.</span></li>
                 <li className="flex gap-3 items-start"><span className="text-neon mt-1 font-bold">✓</span> <span>Productos High-Ticket creados en días, no meses.</span></li>
                 <li className="flex gap-3 items-start"><span className="text-neon mt-1 font-bold">✓</span> <span>Plantillas plug & play para copiar y pegar.</span></li>
               </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-muted/5 border-t border-border">
        <div className="container mx-auto px-4">
           <h2 className="text-3xl font-bold text-foreground mb-2 text-center">INTELIGENCIA COLECTIVA</h2>
           <p className="text-muted-foreground text-center mb-12">Personas reales facturando con estos sistemas.</p>
           
           <div className="grid md:grid-cols-3 gap-6">
             {testimonials.map((t, i) => (
               <div key={i} className="bg-card border border-border p-8 rounded-lg relative hover:shadow-lg transition-all hover:-translate-y-1 hover:border-neon/30 group">
                 <Quote className="absolute top-6 right-6 text-neon/10 w-10 h-10 group-hover:text-neon/20 transition-colors" />
                 <div className="flex items-center gap-3 mb-6">
                   <Avatar className="h-10 w-10 border border-neon/20">
                     <AvatarFallback className="bg-neon text-black font-bold text-xs">{t.initials}</AvatarFallback>
                   </Avatar>
                   <div>
                     <div className="flex gap-1 items-center">
                        <p className="font-bold text-foreground text-sm">{t.name}</p>
                        <div className="flex">
                            {[...Array(5)].map((_, idx) => (
                                <Star key={idx} className="w-2 h-2 fill-neon text-neon" />
                            ))}
                        </div>
                     </div>
                     <p className="text-xs text-muted-foreground">{t.role}</p>
                   </div>
                 </div>
                 <p className="text-muted-foreground text-sm leading-relaxed relative z-10">"{t.content}"</p>
               </div>
             ))}
           </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 border-t border-border bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-foreground mb-4 text-center">PREGUNTAS FRECUENTES</h2>
          <p className="text-center text-muted-foreground mb-12 text-sm">
            Si todavía te queda alguna duda, escribime por Instagram a <a href="https://instagram.com/jordigpt" target="_blank" rel="noopener noreferrer" className="text-neon hover:underline">@jordigpt</a>.
          </p>
          
          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="item-1" className="border border-border rounded-lg px-4 data-[state=open]:border-neon/30">
              <AccordionTrigger className="text-foreground hover:text-neon hover:no-underline font-medium text-left">
                ¿Cómo recibo el acceso a los productos?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Apenas completes el pago vas a ver en pantalla el botón de acceso y, en menos de un minuto, te llega también un correo con el enlace directo a tu panel de descargas.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2" className="border border-border rounded-lg px-4 data-[state=open]:border-neon/30">
              <AccordionTrigger className="text-foreground hover:text-neon hover:no-underline font-medium text-left">
                ¿Necesito conocimientos de programación?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                No. Si sabés usar un navegador y copiar/pegar, estás del otro lado. Las guías están diseñadas para no-programadores.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3" className="border border-border rounded-lg px-4 data-[state=open]:border-neon/30">
              <AccordionTrigger className="text-foreground hover:text-neon hover:no-underline font-medium text-left">
                ¿El PLAN 1K garantiza resultados?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Te garantizo el sistema exacto. Los resultados dependen de tu ejecución.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;