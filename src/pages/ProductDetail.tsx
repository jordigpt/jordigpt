import { useParams, Link, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, ShieldCheck, Zap, ArrowRight, XCircle, CheckCircle2, Lock, Loader2, Timer, Star, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { AuthModal } from "@/components/AuthModal";
import { Session } from "@supabase/supabase-js";

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
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [otherProducts, setOtherProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSticky, setShowSticky] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [userHasProduct, setUserHasProduct] = useState(false);
  
  const [session, setSession] = useState<Session | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    const fetchProductAndStatus = async () => {
        if(!id) return;
        setLoading(true);

        // 1. Fetch Product
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

        // 2. Fetch User Session
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);

        // 3. Check if user already owns product
        if (session && currentProduct) {
            const { data: existingOrder } = await supabase
                .from('orders')
                .select('id')
                .eq('user_id', session.user.id)
                .eq('product_id', currentProduct.id)
                .eq('status', 'approved')
                .maybeSingle();
            
            if (existingOrder) {
                setUserHasProduct(true);
            }
        }

        // 4. Fetch related
        const { data: others } = await supabase
            .from('products')
            .select('*')
            .neq('id', id)
            .limit(2);
        
        if (others) setOtherProducts(others);
        setLoading(false);
    };

    fetchProductAndStatus();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        setAuthModalOpen(false);
        // Re-check ownership if user logs in on this page
        if (product) {
             supabase
                .from('orders')
                .select('id')
                .eq('user_id', session.user.id)
                .eq('product_id', product.id)
                .eq('status', 'approved')
                .maybeSingle()
                .then(({ data }) => {
                    if (data) setUserHasProduct(true);
                });
        }
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
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

  const handleGetFreeProduct = async () => {
    if (!product || !session) return;
    
    // Double check just in case UI state is stale
    if (userHasProduct) {
        navigate(`/my-products/${product.id}`);
        return;
    }

    setIsProcessing(true);
    toast.info("Procesando acceso...");

    try {
        // Check duplication again before insert to prevent DB errors
        const { data: existing } = await supabase
            .from('orders')
            .select('id')
            .eq('user_id', session.user.id)
            .eq('product_id', product.id)
            .eq('status', 'approved')
            .maybeSingle();

        if (!existing) {
            const { error } = await supabase.from('orders').insert({
                user_id: session.user.id,
                product_id: product.id,
                amount: 0,
                status: 'approved'
            });
            if (error) throw error;
        }

        toast.success("¡Producto añadido a tu arsenal!");
        // Redirect to the content page
        setTimeout(() => {
            navigate(`/my-products/${product.id}`);
        }, 1000);
        
    } catch (error: any) {
        console.error("Error creating order for free product:", error);
        toast.error("Error al registrar el producto: " + error.message);
    } finally {
        setIsProcessing(false);
    }
  };

  const handleCheckout = async () => {
    if (!product) return;

    if (userHasProduct) {
        navigate(`/my-products/${product.id}`);
        return;
    }

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        setAuthModalOpen(true);
        return;
    }

    if (product.is_free) {
        await handleGetFreeProduct();
        return;
    }

    try {
        setIsProcessing(true);
        toast.info("Conectando con pasarela de pago...");

        const { data, error } = await supabase.functions.invoke('create-checkout', {
            body: { productId: product.id }
        });

        if (error) throw new Error(error.message);
        if (data?.error) throw new Error(data.error);

        if (data?.url) {
            window.location.href = data.url;
        } else {
            throw new Error("No se recibió URL de pago");
        }

    } catch (error: any) {
        console.error("Checkout error:", error);
        toast.error("Error al iniciar pago: " + (error.message || "Intente nuevamente"));
    } finally {
        setIsProcessing(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="w-8 h-8 animate-spin text-neon" /></div>;
  if (!product) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-20 md:pb-0">
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
      <Navbar />

      <main className="pt-32 pb-12 container mx-auto px-4">
        <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-neon mb-8 transition-colors text-sm font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" /> VOLVER AL ARSENAL
        </Link>

        {/* --- HERO PRODUCT SECTION --- */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start mb-24">
          
          {/* Left Column: Visuals */}
          <div className="space-y-6 lg:sticky lg:top-24">
            <div className="w-full rounded-xl overflow-hidden border border-border relative bg-muted/20 group shadow-2xl shadow-neon/5">
              {product.image_url ? (
                  <img src={product.image_url} alt={product.title} className="w-full h-auto object-contain max-h-[600px] mx-auto" />
              ) : (
                <div className="aspect-[4/3] w-full flex items-center justify-center bg-card">
                    {(product.image_type === 'chart-line-up' || !product.image_type) && <Zap className="w-32 h-32 text-neon animate-pulse-glow" />}
                    {product.image_type === 'infinity' && <div className="text-9xl font-bold text-neon animate-pulse-glow">∞</div>}
                    {product.image_type === 'unlock' && <Lock className="w-32 h-32 text-neon animate-pulse-glow" />}
                </div>
              )}
            </div>

            <div className="flex gap-4 items-center justify-center text-xs text-muted-foreground border border-border p-4 rounded-lg bg-card/50">
              <ShieldCheck className="text-neon w-5 h-5" />
              <span>Garantía de contenido actualizado 2025</span>
              <div className="w-px h-4 bg-border"></div>
              <span>Acceso de por vida</span>
            </div>
          </div>

          {/* Right Column: Copy & Pricing */}
          <div className="flex flex-col">
            <div className="mb-6">
               <div className="flex items-center gap-3 mb-4">
                  {product.is_free ? (
                    <Badge className="bg-neon text-black hover:bg-neon border-none text-xs px-3 py-1">REGALO EXCLUSIVO</Badge>
                  ) : (
                    <Badge variant="outline" className="text-neon border-neon/50 text-xs px-3 py-1 bg-neon/5">SISTEMA PREMIUM</Badge>
                  )}
                  {product.is_featured && <span className="flex items-center text-xs text-muted-foreground"><Star className="w-3 h-3 mr-1 text-neon fill-neon"/> Más vendido</span>}
               </div>
               
               <h1 className="text-4xl md:text-6xl font-black text-foreground mb-6 leading-[0.9] tracking-tighter uppercase">
                 {product.title}
               </h1>
               
               <div className="prose prose-invert prose-lg max-w-none mb-8">
                 <p className="text-foreground/80 leading-relaxed text-lg border-l-2 border-neon pl-4 whitespace-pre-wrap">
                   {product.full_description}
                 </p>
               </div>
            </div>

            {/* --- PRICING BOX --- */}
            <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-xl relative overflow-hidden group" id="hero-action">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon to-transparent opacity-50"></div>
               
               <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                  <div>
                      <p className="text-sm text-muted-foreground font-medium mb-1">Precio total hoy:</p>
                      <div className="flex items-baseline gap-3 flex-wrap">
                        {product.original_price_display && !product.is_free && (
                            <span className="text-xl text-muted-foreground/60 line-through decoration-destructive/50 font-mono">
                                {product.original_price_display}
                            </span>
                        )}
                        <span className="text-5xl font-black text-foreground font-mono tracking-tight">
                            {product.price_display || (product.price === 0 ? "GRATIS" : `$${product.price}`)}
                        </span>
                      </div>
                      <p className="text-xs text-neon mt-2 font-medium flex items-center gap-1.5">
                          <Timer className="w-3 h-3" /> {product.price_microcopy}
                      </p>
                  </div>
                  
                  {product.original_price_display && !product.is_free && (
                     <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider animate-pulse">
                        Oferta Limitada
                     </div>
                  )}
               </div>

               <Button 
                onClick={handleCheckout}
                disabled={isProcessing}
                className={`w-full font-bold text-xl h-16 rounded-lg transition-all shadow-[0_0_25px_rgba(212,232,58,0.3)] hover:shadow-[0_0_40px_rgba(212,232,58,0.6)] active:scale-[0.98] uppercase tracking-wide disabled:opacity-70 disabled:cursor-not-allowed ${
                    userHasProduct 
                    ? "bg-secondary text-secondary-foreground hover:bg-secondary/90" 
                    : "bg-neon text-black hover:bg-neon/90 hover:scale-[1.01]"
                }`}
              >
                {isProcessing ? <Loader2 className="animate-spin mr-2" /> : null}
                {isProcessing ? "Procesando..." : (
                    userHasProduct 
                        ? <span className="flex items-center"><Download className="mr-2 w-6 h-6"/> ACCEDER AHORA</span> 
                        : (<span>{product.cta_text} { !isProcessing && <ArrowRight className="inline ml-2 w-6 h-6" />}</span>)
                )} 
              </Button>
              
              <div className="flex justify-center gap-6 mt-6 text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
                 <span>🔒 Pago Seguro</span>
                 <span>⚡ Entrega Inmediata</span>
              </div>
            </div>

            <div className="mt-12">
               <h3 className="text-sm font-bold text-foreground uppercase tracking-widest mb-6">Lo que incluye el sistema:</h3>
               <ul className="grid gap-4">
                 {product.features?.map((feature, idx) => (
                   <li key={idx} className="flex items-start gap-3 p-4 rounded-lg bg-muted/20 border border-border/50">
                     <div className="bg-neon/10 p-1 rounded-full mt-0.5 shrink-0">
                       <Check className="text-neon w-4 h-4" />
                     </div>
                     <span className="text-sm md:text-base font-medium text-foreground/90">{feature}</span>
                   </li>
                 ))}
               </ul>
            </div>
          </div>
        </div>

        <section className="py-12 border-t border-border mb-12">
            <h3 className="text-2xl font-bold text-foreground mb-8 text-center uppercase">¿Es para vos?</h3>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <div className="bg-card/50 border border-red-500/10 p-6 rounded-lg">
                    <h4 className="flex items-center gap-2 text-red-400 font-bold mb-4">
                        <XCircle className="w-5 h-5"/> NO, SI BUSCAS:
                    </h4>
                    <ul className="space-y-3 text-muted-foreground text-sm">
                        <li className="flex gap-2"><span>•</span> Botones mágicos sin trabajo real.</li>
                        <li className="flex gap-2"><span>•</span> Teoría académica sin práctica.</li>
                    </ul>
                </div>
                <div className="bg-neon/5 border border-neon/20 p-6 rounded-lg">
                    <h4 className="flex items-center gap-2 text-neon font-bold mb-4">
                        <CheckCircle2 className="w-5 h-5"/> SÍ, SI QUERÉS:
                    </h4>
                    <ul className="space-y-3 text-foreground/90 text-sm font-medium">
                        <li className="flex gap-2"><span>•</span> Resultados rápidos y medibles.</li>
                        <li className="flex gap-2"><span>•</span> Sistemas copiables para tu negocio.</li>
                    </ul>
                </div>
            </div>
        </section>

        {otherProducts.length > 0 && (
          <section className="border-t border-border pt-16">
            <h3 className="text-xl font-bold text-muted-foreground mb-8 uppercase tracking-widest text-center">Completa tu Arsenal</h3>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {otherProducts.map((p) => (
                <Link key={p.id} to={`/product/${p.id}`} className="group flex bg-card border border-border hover:border-neon/40 transition-all p-4 items-center gap-4 rounded-lg">
                  <div className="w-20 h-20 bg-muted flex items-center justify-center shrink-0 rounded overflow-hidden relative">
                     {p.image_url ? (
                        <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" />
                     ) : (
                         <Zap className="w-8 h-8 text-muted-foreground/50" />
                     )}
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground group-hover:text-neon transition-colors">{p.title}</h4>
                    <p className="text-sm font-mono text-muted-foreground mt-1">{p.price === 0 ? "GRATIS" : `$${p.price}`}</p>
                  </div>
                  <div className="ml-auto">
                    <ArrowRight className="text-muted-foreground group-hover:text-neon w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      
      <div 
        className={`fixed bottom-0 left-0 w-full bg-background/80 backdrop-blur-xl border-t border-neon/20 p-4 md:hidden z-50 transition-transform duration-300 ${showSticky ? 'translate-y-0' : 'translate-y-full'}`}
      >
          <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col">
                  <span className="text-[10px] text-muted-foreground font-bold uppercase truncate max-w-[120px]">{product.title}</span>
                  <span className="text-xl font-mono text-neon font-black">{product.price === 0 ? "GRATIS" : `$${product.price}`}</span>
              </div>
              <Button 
                onClick={handleCheckout} 
                disabled={isProcessing}
                size="sm" 
                className={`font-bold rounded-md px-6 shadow-[0_0_15px_rgba(212,232,58,0.4)] disabled:opacity-70 ${userHasProduct ? "bg-secondary text-secondary-foreground" : "bg-neon text-black hover:bg-neon/90"}`}
              >
                 {isProcessing ? <Loader2 className="animate-spin" /> : (userHasProduct ? "ACCEDER" : product.cta_text)}
              </Button>
          </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;