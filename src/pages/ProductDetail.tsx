import { useParams, Link, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, ShieldCheck, Zap, ArrowRight, XCircle, CheckCircle2, Lock, Loader2 } from "lucide-react";

interface Product {
  id: string;
  title: string;
  short_description: string;
  full_description: string;
  price: number;
  features: string[];
  cta_text: string;
  is_free: boolean;
  image_url: string;
  badge: string;
  original_price_label: string;
  original_price_display: string;
  price_display: string;
  price_microcopy: string;
  is_featured: boolean;
  image_type: string;
}

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [otherProducts, setOtherProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
        if(!id) return;
        setLoading(true);

        // Fetch current product
        const { data: currentProduct, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !currentProduct) {
            setLoading(false);
            return;
        }
        
        setProduct(currentProduct);

        // Fetch recommendations (random 2 or simple limit)
        const { data: others } = await supabase
            .from('products')
            .select('*')
            .neq('id', id)
            .limit(2);
        
        if (others) setOtherProducts(others);
        setLoading(false);
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const handleScroll = () => {
      const heroSection = document.getElementById('hero-action');
      if (heroSection) {
        const rect = heroSection.getBoundingClientRect();
        setShowSticky(rect.bottom < 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [id]);

  if (loading) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-background">
              <Loader2 className="w-8 h-8 animate-spin text-neon" />
          </div>
      );
  }

  if (!product) {
    return <Navigate to="/" replace />;
  }

  const handleCheckout = () => {
    console.log(`Iniciando checkout para: ${product.title}`);
    alert("Redirigiendo a MercadoPago... (Simulación)");
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-20 md:pb-0">
      <Navbar />

      <main className="pt-32 pb-12 container mx-auto px-4">
        <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-neon mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Volver al arsenal
        </Link>

        {/* --- HERO PRODUCT SECTION --- */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-24 items-start mb-24">
          {/* Left Column: Visuals */}
          <div className="space-y-8 md:sticky md:top-24">
            <div className="aspect-square bg-card border border-border rounded-none flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-muted/50 via-background to-background opacity-50"></div>
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
              
              {product.image_url ? (
                  <img src={product.image_url} alt={product.title} className="w-full h-full object-cover relative z-10" />
              ) : (
                <div className="relative z-10 text-center p-8 transform group-hover:scale-105 transition-transform duration-700">
                    <h1 className="text-5xl md:text-7xl font-bold text-foreground/5 group-hover:text-neon/10 transition-colors duration-500 select-none tracking-tighter">
                        {product.title.split(' ')[0]}
                    </h1>
                    {(product.image_type === 'chart-line-up' || !product.image_type) && <Zap className="w-32 h-32 mx-auto text-neon mt-4 drop-shadow-[0_0_25px_rgba(212,232,58,0.6)] animate-pulse-glow" />}
                    {product.image_type === 'infinity' && <div className="text-8xl font-bold text-neon mt-4 drop-shadow-[0_0_25px_rgba(212,232,58,0.6)] animate-pulse-glow">∞</div>}
                    {product.image_type === 'unlock' && <Lock className="w-32 h-32 mx-auto text-neon mt-4 drop-shadow-[0_0_25px_rgba(212,232,58,0.6)] animate-pulse-glow" />}
                </div>
              )}
            </div>

            <div className="bg-card/30 p-6 border border-border flex gap-4 items-start backdrop-blur-sm rounded-md">
              <ShieldCheck className="text-neon w-8 h-8 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-foreground mb-1 text-sm uppercase tracking-wide">Garantía JordiGPT</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Contenido verificado. Sin relleno. Si la técnica deja de funcionar por cambios en la plataforma, actualizo el material gratis para todos los compradores.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Copy & Checkout */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-4 mb-6">
                {product.is_free ? (
                  <span className="bg-neon text-black text-xs font-bold px-3 py-1 uppercase tracking-widest">
                    Regalo Exclusivo
                  </span>
                ) : (
                  <span className="bg-muted text-neon text-xs font-bold px-3 py-1 uppercase border border-neon/20 tracking-widest shadow-[0_0_10px_rgba(212,232,58,0.2)]">
                    Producto Premium
                  </span>
                )}
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-none tracking-tight">
                {product.title}
              </h1>
              
              <div className="flex items-baseline gap-3 mb-8">
                <span className="text-4xl font-mono text-neon font-bold">
                  {product.price_display || (product.price === 0 ? "GRATIS" : `$${product.price} USD`)}
                </span>
                {!product.is_free && product.original_price_display && (
                  <span className="text-muted-foreground line-through text-xl decoration-neon/50">
                    {product.original_price_display}
                  </span>
                )}
              </div>

              <div className="prose prose-invert max-w-none">
                <p className="text-foreground/80 text-lg leading-relaxed mb-8 border-l-4 border-neon pl-6 italic">
                  "{product.full_description}"
                </p>
              </div>
            </div>

            <div className="space-y-6 bg-card/20 p-6 border border-border rounded-lg">
               <h3 className="text-foreground font-bold uppercase tracking-wider text-sm border-b border-border pb-2">Lo que obtienes dentro:</h3>
               <ul className="space-y-4">
                 {product.features?.map((feature, idx) => (
                   <li key={idx} className="flex items-start gap-3 text-foreground/80">
                     <div className="bg-neon/10 p-1 rounded-full mt-0.5">
                       <Check className="text-neon w-3 h-3 flex-shrink-0" />
                     </div>
                     <span className="text-sm md:text-base">{feature}</span>
                   </li>
                 ))}
               </ul>
            </div>

            <div className="pt-8" id="hero-action">
              <Button 
                onClick={handleCheckout}
                className="w-full bg-neon text-black hover:bg-neon/90 hover:scale-[1.01] font-bold text-xl py-8 rounded-sm transition-all shadow-[0_0_20px_rgba(212,232,58,0.2)] hover:shadow-[0_0_40px_rgba(212,232,58,0.5)] active:scale-[0.98]"
              >
                {product.cta_text} <ArrowRight className="ml-2 w-6 h-6" />
              </Button>
              <div className="flex items-center justify-center gap-4 mt-4 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                 {/* Fake Trust Badges */}
                 <div className="text-[10px] text-muted-foreground uppercase tracking-widest flex gap-4">
                    <span>🔒 Pago Seguro SSL</span>
                    <span>⚡ Entrega Inmediata</span>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- WHO IS THIS FOR SECTION --- */}
        <section className="py-12 border-t border-border mb-12">
            <h3 className="text-2xl font-bold text-foreground mb-8 text-center">¿ESTO ES PARA TI?</h3>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <div className="bg-red-500/5 border border-red-500/20 p-6 rounded-lg">
                    <h4 className="flex items-center gap-2 text-red-500 font-bold mb-4">
                        <XCircle className="w-5 h-5"/> NO ES PARA TI SI:
                    </h4>
                    <ul className="space-y-2 text-muted-foreground text-sm">
                        <li className="flex gap-2"><span>•</span> Buscas botones mágicos sin trabajo.</li>
                        <li className="flex gap-2"><span>•</span> No estás dispuesto a seguir instrucciones.</li>
                        <li className="flex gap-2"><span>•</span> Prefieres la teoría universitaria a la práctica.</li>
                    </ul>
                </div>
                <div className="bg-neon/5 border border-neon/20 p-6 rounded-lg">
                    <h4 className="flex items-center gap-2 text-neon font-bold mb-4">
                        <CheckCircle2 className="w-5 h-5"/> SÍ ES PARA TI SI:
                    </h4>
                    <ul className="space-y-2 text-foreground/80 text-sm">
                        <li className="flex gap-2"><span>•</span> Quieres resultados rápidos y medibles.</li>
                        <li className="flex gap-2"><span>•</span> Entiendes que la IA es el apalancamiento definitivo.</li>
                        <li className="flex gap-2"><span>•</span> Estás listo para ejecutar hoy mismo.</li>
                    </ul>
                </div>
            </div>
        </section>

        {/* --- CROSS SELL SECTION --- */}
        {otherProducts.length > 0 && (
          <section className="border-t border-border pt-16">
            <h3 className="text-xl font-bold text-muted-foreground mb-8 uppercase tracking-widest text-center">Completa tu Arsenal</h3>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {otherProducts.map((p) => (
                <Link key={p.id} to={`/product/${p.id}`} className="group flex bg-card border border-border hover:border-neon/40 transition-all p-4 items-center gap-4 rounded-md">
                  <div className="w-16 h-16 bg-muted flex items-center justify-center flex-shrink-0 text-muted-foreground/50 group-hover:text-neon transition-colors rounded-sm overflow-hidden relative">
                     {p.image_url ? (
                        <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" />
                     ) : (
                         <>
                            {(p.image_type === 'chart-line-up' || !p.image_type) && <Zap className="w-8 h-8" />}
                            {p.image_type === 'infinity' && <div className="text-2xl font-bold">∞</div>}
                            {p.image_type === 'unlock' && <Lock className="w-8 h-8" />}
                         </>
                     )}
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground group-hover:text-neon transition-colors">{p.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{p.price === 0 ? "GRATIS" : `$${p.price} USD`}</p>
                  </div>
                  <div className="ml-auto">
                    <ArrowRight className="text-muted-foreground group-hover:text-neon w-5 h-5 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      
      {/* --- MOBILE STICKY CTA --- */}
      <div 
        className={`fixed bottom-0 left-0 w-full bg-background/90 backdrop-blur-lg border-t border-neon/20 p-4 md:hidden z-40 transition-transform duration-300 ${showSticky ? 'translate-y-0' : 'translate-y-full'}`}
      >
          <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground font-bold uppercase">{product.title}</span>
                  <span className="text-lg font-mono text-neon font-bold">{product.price === 0 ? "GRATIS" : `$${product.price}`}</span>
              </div>
              <Button onClick={handleCheckout} size="sm" className="bg-neon text-black font-bold hover:bg-neon/90 rounded-none px-6">
                  {product.cta_text}
              </Button>
          </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;