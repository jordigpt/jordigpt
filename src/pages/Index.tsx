import { Link } from "react-router-dom";
import { products } from "@/data/products";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, Zap, CheckCircle2, Lock, XCircle, Star, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Index = () => {
  const testimonials = [
    {
      name: "Carlos M.",
      role: "Freelancer",
      content: "El script de n8n me ahorró literalmente $200 dólares al mes en suscripciones. Es absurdo que esta información sea casi gratis.",
      initials: "CM"
    },
    {
      name: "Sofia R.",
      role: "Agencia de Marketing",
      content: "Implementé el PLAN 1K un lunes. El jueves cerré mi primer cliente de $800. No es magia, es proceso puro.",
      initials: "SR"
    },
    {
      name: "David K.",
      role: "Developer",
      content: "Pensé que sabía de IA hasta que vi la suite de herramientas del pack de Google Pro. Jordi juega en otra liga.",
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
            La era de la IA ya empezó
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-muted-foreground">
            FACTURA CON IA <br />
            <span className="text-neon">O QUÉDATE ATRÁS</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Las herramientas definitivas para dominar el mercado digital. 
            Sin relleno. Sin teoría obsoleta. Solo métodos probados para generar ingresos.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <a href="#products">
              <Button className="bg-neon text-black hover:bg-neon/80 font-bold text-lg px-8 py-6 h-auto rounded-none border border-transparent hover:border-foreground/20 transition-all">
                ACCEDER AL ARSENAL <Zap className="ml-2 w-5 h-5" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Authority Banner */}
      <section className="border-y border-border bg-muted/30 py-8 overflow-hidden">
        <div className="container mx-auto px-4 flex flex-wrap justify-center gap-8 md:gap-16 items-center text-muted-foreground font-mono text-sm uppercase tracking-widest">
          <span className="flex items-center gap-2"><CheckCircle2 className="text-neon w-4 h-4"/> 100% Verificado</span>
          <span className="flex items-center gap-2"><CheckCircle2 className="text-neon w-4 h-4"/> Resultados Reales</span>
          <span className="flex items-center gap-2"><CheckCircle2 className="text-neon w-4 h-4"/> Acceso Inmediato</span>
          <span className="flex items-center gap-2"><CheckCircle2 className="text-neon w-4 h-4"/> Soporte Vitalicio</span>
        </div>
      </section>

      {/* Comparison Section (Why Me?) */}
      <section className="py-24 bg-muted/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">¿POR QUÉ MIS SISTEMAS?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              La mayoría vende humo. Yo vendo sistemas de ingeniería inversa para hackear el crecimiento.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* The Old Way */}
            <div className="p-8 border border-border bg-background rounded-lg relative overflow-hidden opacity-70 hover:opacity-100 transition-opacity">
               <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                 <XCircle className="text-red-500 w-5 h-5" /> MÉTODOS OBSOLETOS
               </h3>
               <ul className="space-y-4 text-muted-foreground">
                 <li className="flex gap-3"><span className="text-red-500">✕</span> Pagar Ads carísimos sin retorno</li>
                 <li className="flex gap-3"><span className="text-red-500">✕</span> Crear contenido manual 8 horas al día</li>
                 <li className="flex gap-3"><span className="text-red-500">✕</span> Contratar agencias que no saben de IA</li>
                 <li className="flex gap-3"><span className="text-red-500">✕</span> Gastar $500/mes en software SaaS</li>
               </ul>
            </div>

            {/* The New Way */}
            <div className="p-8 border border-neon/30 bg-neon/5 rounded-lg relative overflow-hidden shadow-[0_0_50px_rgba(212,232,58,0.05)]">
               <div className="absolute top-0 right-0 p-2 bg-neon text-black text-xs font-bold uppercase">JordiGPT Way</div>
               <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                 <CheckCircle2 className="text-neon w-5 h-5" /> EL NUEVO ESTÁNDAR
               </h3>
               <ul className="space-y-4 text-foreground/80">
                 <li className="flex gap-3"><span className="text-neon">✓</span> Tráfico orgánico viral con IA</li>
                 <li className="flex gap-3"><span className="text-neon">✓</span> Automatización total con n8n (GRATIS)</li>
                 <li className="flex gap-3"><span className="text-neon">✓</span> Workflows que trabajan mientras duermes</li>
                 <li className="flex gap-3"><span className="text-neon">✓</span> Stack tecnológico de $0 de costo mensual</li>
               </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-background border-t border-border">
        <div className="container mx-auto px-4">
           <h2 className="text-3xl font-bold text-foreground mb-12 text-center">INTELIGENCIA COLECTIVA</h2>
           <div className="grid md:grid-cols-3 gap-6">
             {testimonials.map((t, i) => (
               <div key={i} className="bg-muted/30 border border-border p-6 rounded-lg relative">
                 <Quote className="absolute top-6 right-6 text-neon/20 w-8 h-8" />
                 <div className="flex items-center gap-3 mb-4">
                   <Avatar>
                     <AvatarFallback className="bg-neon text-black font-bold">{t.initials}</AvatarFallback>
                   </Avatar>
                   <div>
                     <p className="font-bold text-foreground text-sm">{t.name}</p>
                     <p className="text-xs text-muted-foreground">{t.role}</p>
                   </div>
                 </div>
                 <div className="flex gap-1 mb-3">
                   {[...Array(5)].map((_, i) => (
                     <Star key={i} className="w-3 h-3 text-neon fill-neon" />
                   ))}
                 </div>
                 <p className="text-muted-foreground text-sm leading-relaxed">"{t.content}"</p>
               </div>
             ))}
           </div>
        </div>
      </section>

      {/* Products Grid */}
      <section id="products" className="py-24 relative bg-muted/5 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">EL ARSENAL</h2>
              <p className="text-muted-foreground">Herramientas tácticas para tu crecimiento.</p>
            </div>
            <div className="h-1 w-full md:w-auto flex-1 bg-border mx-4 self-center"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((product) => (
              <Link 
                key={product.id} 
                to={`/product/${product.id}`}
                className="group relative bg-card border border-border overflow-hidden hover:border-neon/50 transition-all duration-300 flex flex-col h-full rounded-md"
              >
                {/* Image Placeholder area */}
                <div className="h-48 bg-muted/50 flex items-center justify-center border-b border-border group-hover:bg-muted transition-colors relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-background/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {product.image === 'chart-line-up' && <Zap className="w-16 h-16 text-muted-foreground/50 group-hover:text-neon transition-colors duration-500 group-hover:scale-110 transform" />}
                  {product.image === 'infinity' && <div className="text-6xl font-bold text-muted-foreground/50 group-hover:text-neon transition-colors duration-500 group-hover:scale-110 transform">∞</div>}
                  {product.image === 'unlock' && <Lock className="w-16 h-16 text-muted-foreground/50 group-hover:text-neon transition-colors duration-500 group-hover:scale-110 transform" />}
                  
                  {product.isFree && (
                    <div className="absolute top-4 right-4 bg-neon text-black text-xs font-bold px-2 py-1 uppercase shadow-[0_0_10px_rgba(212,232,58,0.5)]">
                      Gratis
                    </div>
                  )}
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-neon transition-colors">
                    {product.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6 line-clamp-3">
                    {product.shortDescription}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                    <span className="text-lg font-mono font-medium text-foreground">
                      {product.price === 0 ? "FREE" : `$${product.price} USD`}
                    </span>
                    <span className="text-neon text-sm font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      ACCEDER <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 border-t border-border">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">PREGUNTAS FRECUENTES</h2>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-border">
              <AccordionTrigger className="text-foreground hover:text-neon hover:no-underline">
                ¿Cómo recibo el acceso a los productos?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                El acceso es inmediato y automático. En cuanto el pago es procesado por MercadoPago, recibirás un correo electrónico con tus credenciales de acceso a la plataforma o los enlaces de descarga directa. Sin esperas.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2" className="border-border">
              <AccordionTrigger className="text-foreground hover:text-neon hover:no-underline">
                ¿Necesito conocimientos de programación para usar n8n?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                No. Mi guía de "N8N 100% FREE" está diseñada para que cualquier persona pueda copiar y pegar los comandos necesarios. Es un tutorial paso a paso donde literalmente solo tienes que seguir las instrucciones.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3" className="border-border">
              <AccordionTrigger className="text-foreground hover:text-neon hover:no-underline">
                ¿El PLAN 1K garantiza resultados?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Te doy el sistema exacto, los scripts y la estrategia. El resultado depende de tu ejecución. Sin embargo, si aplicas el sistema tal cual está explicado, es matemáticamente improbable que no veas resultados. Es física pura: Acción masiva = Resultados masivos.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border-border">
              <AccordionTrigger className="text-foreground hover:text-neon hover:no-underline">
                ¿Qué métodos de pago aceptas?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Procesamos todo a través de MercadoPago para tu seguridad. Aceptamos tarjetas de crédito, débito y saldo en cuenta. Si estás fuera de la región, el sistema también acepta tarjetas internacionales.
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