import { useParams, Link, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, ShieldCheck, Zap, ArrowRight, XCircle, CheckCircle2, Lock, Loader2, Timer, Star, Download, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { AuthModal } from "@/components/AuthModal";
import { Session } from "@supabase/supabase-js";
import { useCart } from "@/context/CartContext";
import { CartSheet } from "@/components/CartSheet";

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
  const { slug, id } = useParams(); // Puede venir por :slug o :id
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [otherProducts, setOtherProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSticky, setShowSticky] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [userHasProduct, setUserHasProduct] = useState(false);
  
  const [session, setSession] = useState<Session | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const { addItem, setIsOpen } = useCart();

  useEffect(() => {
    const fetchProductAndStatus = async () => {
        setLoading(true);

        let query = supabase.from('products').select('*');
        
        // Prioridad: Buscar por slug, sino por ID
        if (slug) {
            query = query.eq('slug', slug);
        } else if (id) {
            query = query.eq('id', id);
        } else {
            setLoading(false);
            return;
        }

        const { data: currentProduct, error } = await query.single();

        if (error || !currentProduct) {
            setLoading(false);
            return;
        }
        
        setProduct(currentProduct);

        // Fetch User Session & Ownership
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);

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

        // Fetch related
        const { data: others } = await supabase
            .from('products')
            .select('*')
            .neq('id', currentProduct.id)
            .limit(2);
        
        if (others) setOtherProducts(others);
        setLoading(false);
    };

    fetchProductAndStatus();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        setAuthModalOpen(false);
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
  }, [slug, id]);

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
  }, [slug, id]);

  const handleAddToCart = () => {
      if (!product) return;
      
      // Auth Guard
      if (!session) {
          setAuthModalOpen(true);
          return;
      }

      addItem({
          id: product.id,
          title: product.title,
          price: product.price,
          image_url: product.image_url
      });
  };

  const handleGetFreeProduct = async () => {
    if (!product || !session) return;
    if (userHasProduct) {
        navigate(`/my-products/${product.id}`);
        return;
    }

    setIsProcessing(true);
    toast.info("Procesando acceso...");

    try {
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

  const handlePrimaryAction = async () => {
    if (!product) return;

    if (userHasProduct) {
        navigate(`/my-products/${product.id}`);
        return;
    }

    // Auth Guard Global
    if (!session) {
        setAuthModalOpen(true);
        return;
    }

    // Free product logic (direct access)
    if (product.is_free) {
        await handleGetFreeProduct();
        return;
    }

    // Paid product -> Add to cart
    handleAddToCart();
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="w-8 h-8 animate-spin text-neon" /></div>;
  if (!product) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-20 md:pb-0">
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
      <CartSheet />
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
                  </div>
                  
                  {product.original_price_display && !product.is_free && (
                     <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider animate-pulse">
                        Oferta Limitada
                     </div>
                  )}
               </div>

               <Button 
                onClick={handlePrimaryAction}
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
                        : (
                            product.is_free 
                            ? <span>DESCARGAR GRATIS</span>
                            : <span className="flex items-center"><ShoppingCart className="mr-2 w-6 h-6"/> AGREGAR AL CARRITO</span>
                        )
                )} 
              </Button>
              
              <div className="flex justify-center gap-6 mt-6 text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
                 <span>🔒 Pago Seguro</span>
                 <span>⚡ Entrega Inmediata</span>
              </div>
            </div>

            <div className="mt-12">
               {/* Features list... */}
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
      </main>
      
      {/* Sticky Mobile Button */}
      <div 
        className={`fixed bottom-0 left-0 w-full bg-background/80 backdrop-blur-xl border-t border-neon/20 p-4 md:hidden z-50 transition-transform duration-300 ${showSticky ? 'translate-y-0' : 'translate-y-full'}`}
      >
          <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col">
                  <span className="text-[10px] text-muted-foreground font-bold uppercase truncate max-w-[120px]">{product.title}</span>
                  <span className="text-xl font-mono text-neon font-black">{product.price === 0 ? "GRATIS" : `$${product.price}`}</span>
              </div>
              <Button 
                onClick={handlePrimaryAction} 
                disabled={isProcessing}
                size="sm" 
                className={`font-bold rounded-md px-6 shadow-[0_0_15px_rgba(212,232,58,0.4)] disabled:opacity-70 ${userHasProduct ? "bg-secondary text-secondary-foreground" : "bg-neon text-black hover:bg-neon/90"}`}
              >
                 {isProcessing ? <Loader2 className="animate-spin" /> : (userHasProduct ? "ACCEDER" : (product.is_free ? "GRATIS" : <ShoppingCart className="w-5 h-5" />))}
              </Button>
          </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;