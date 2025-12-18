import { useParams, Link, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, ShieldCheck, Zap, ArrowRight, XCircle, CheckCircle2, Lock, Loader2, Star, Download, ShoppingCart, Image as ImageIcon, Ban } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { AuthModal } from "@/components/AuthModal";
import { Session } from "@supabase/supabase-js";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";

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
  gallery_images: string[];
  badge: string;
  original_price_label: string;
  original_price_display: string;
  price_display: string;
  price_microcopy: string;
  is_featured: boolean;
  image_type: string;
  is_out_of_stock: boolean; // Agregado
}

const ProductDetail = () => {
  const { slug, id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSticky, setShowSticky] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [userHasProduct, setUserHasProduct] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const [session, setSession] = useState<Session | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const { addItem } = useCart();

  useEffect(() => {
    const fetchProductAndStatus = async () => {
        setLoading(true);

        let query = supabase.from('products').select('*');
        
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
    if (product.is_out_of_stock && !userHasProduct) return; // Bloqueo extra por seguridad
    
    if (userHasProduct) {
        navigate(`/my-products/${product.id}`);
        return;
    }
    if (!session) {
        setAuthModalOpen(true);
        return;
    }
    if (product.is_free) {
        await handleGetFreeProduct();
        return;
    }
    handleAddToCart();
  };

  // Gallery Logic
  const allImages = product ? [product.image_url, ...(product.gallery_images || [])].filter(Boolean) : [];

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="w-8 h-8 animate-spin text-neon" /></div>;
  if (!product) return <Navigate to="/" replace />;

  const isOutOfStock = product.is_out_of_stock && !userHasProduct;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-20 md:pb-0 selection:bg-neon selection:text-black">
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
      <Navbar />

      <main className="pt-32 container mx-auto px-4">
        {/* Breadcrumb / Back */}
        <div className="mb-8">
            <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-neon transition-colors text-sm font-medium">
                <ArrowLeft className="w-4 h-4 mr-2" /> VOLVER AL ARSENAL
            </Link>
        </div>

        {/* --- HERO SECTION: GALLERY + COPY --- */}
        <div className="grid lg:grid-cols-12 gap-12 mb-24">
          
          {/* LEFT: GALLERY (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Image Viewport */}
            <div className="w-full aspect-video md:aspect-[16/10] rounded-xl overflow-hidden border border-border bg-black/40 relative group">
                {allImages.length > 0 ? (
                    <img 
                        src={allImages[currentImageIndex]} 
                        alt={product.title} 
                        className={`w-full h-full object-contain transition-all duration-300 ${isOutOfStock ? 'grayscale opacity-70' : ''}`}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-neon/20">
                        <Zap className="w-20 h-20" />
                    </div>
                )}
                
                {isOutOfStock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
                        <Badge variant="destructive" className="text-xl px-6 py-2 uppercase tracking-widest">
                            AGOTADO / CERRADO
                        </Badge>
                    </div>
                )}
                
                {/* Fallback overlay text if no images */}
                {allImages.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-muted-foreground text-sm">Sin imagen</span>
                    </div>
                )}
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {allImages.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            className={cn(
                                "relative w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-lg overflow-hidden border transition-all",
                                currentImageIndex === idx 
                                    ? "border-neon ring-2 ring-neon/20 opacity-100" 
                                    : "border-border opacity-60 hover:opacity-100 hover:border-neon/50"
                            )}
                        >
                            <img src={img} className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
            
            {/* Value Proposition Under Image */}
            <div className="hidden md:flex justify-between items-center py-6 border-t border-border mt-8">
                <div className="flex items-center gap-3">
                    <div className="bg-neon/10 p-2 rounded-full"><ShieldCheck className="w-5 h-5 text-neon" /></div>
                    <div className="flex flex-col">
                        <span className="font-bold text-sm">Garantía de Calidad</span>
                        <span className="text-xs text-muted-foreground">Probado en campo</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-neon/10 p-2 rounded-full"><Zap className="w-5 h-5 text-neon" /></div>
                    <div className="flex flex-col">
                        <span className="font-bold text-sm">Entrega Inmediata</span>
                        <span className="text-xs text-muted-foreground">Todo digital</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-neon/10 p-2 rounded-full"><Lock className="w-5 h-5 text-neon" /></div>
                    <div className="flex flex-col">
                        <span className="font-bold text-sm">Pago Seguro</span>
                        <span className="text-xs text-muted-foreground">Encriptado SSL</span>
                    </div>
                </div>
            </div>
          </div>

          {/* RIGHT: COPY & ACTION (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="mb-8">
               <div className="flex items-center gap-3 mb-4">
                  {product.is_free ? (
                    <Badge className="bg-neon text-black hover:bg-neon border-none text-xs px-3 py-1 font-bold">REGALO EXCLUSIVO</Badge>
                  ) : (
                    <Badge variant="outline" className="text-neon border-neon/50 text-xs px-3 py-1 bg-neon/5 font-bold uppercase tracking-wider">Sistema Premium</Badge>
                  )}
                  {product.is_featured && <span className="flex items-center text-xs text-amber-400 font-bold"><Star className="w-3 h-3 mr-1 fill-current"/> TOP SELLER</span>}
                  {isOutOfStock && <Badge variant="destructive" className="uppercase">Ventas Cerradas</Badge>}
               </div>
               
               <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-6 leading-[0.9] tracking-tighter uppercase">
                 {product.title}
               </h1>
               
               <div className="prose prose-invert max-w-none mb-8">
                 <p className="text-lg text-muted-foreground leading-relaxed border-l-2 border-neon pl-4">
                   {product.short_description}
                 </p>
               </div>

               {/* Pricing Box - Sticky on Mobile via other logic, but here is desktop */}
               <div className="bg-card border border-border rounded-xl p-6 shadow-2xl relative overflow-hidden group" id="hero-action">
                   <div className="flex items-baseline gap-2 mb-2">
                       <span className={`text-4xl font-black text-white tracking-tight ${isOutOfStock ? 'opacity-50' : ''}`}>
                           {product.price_display || (product.price === 0 ? "GRATIS" : `$${product.price}`)}
                       </span>
                       {product.original_price_display && !product.is_free && (
                           <span className="text-lg text-muted-foreground line-through decoration-destructive/50">
                               {product.original_price_display}
                           </span>
                       )}
                   </div>
                   
                   <p className="text-xs text-muted-foreground mb-6 uppercase tracking-wider font-medium">
                       {product.price_microcopy || "Pago único · Acceso de por vida"}
                   </p>

                   <Button 
                    onClick={handlePrimaryAction}
                    disabled={isProcessing || isOutOfStock}
                    className={`w-full font-bold text-lg h-14 rounded-lg transition-all uppercase tracking-wide disabled:opacity-70 ${
                        userHasProduct 
                        ? "bg-secondary text-secondary-foreground hover:bg-secondary/90" 
                        : isOutOfStock
                            ? "bg-muted text-muted-foreground cursor-not-allowed border border-border"
                            : "bg-neon text-black hover:bg-neon/90 hover:scale-[1.01] shadow-[0_0_20px_rgba(212,232,58,0.3)] hover:shadow-[0_0_30px_rgba(212,232,58,0.5)]"
                    }`}
                  >
                    {isProcessing ? <Loader2 className="animate-spin mr-2" /> : null}
                    {isProcessing ? "Procesando..." : (
                        userHasProduct 
                            ? <span className="flex items-center"><Download className="mr-2 w-5 h-5"/> ACCEDER AHORA</span> 
                            : isOutOfStock 
                                ? <span className="flex items-center"><Ban className="mr-2 w-5 h-5"/> NO DISPONIBLE</span>
                                : (
                                    product.is_free 
                                    ? "DESCARGAR GRATIS"
                                    : <span className="flex items-center"><ShoppingCart className="mr-2 w-5 h-5"/> AGREGAR AL CARRITO</span>
                                )
                    )} 
                  </Button>
                  {isOutOfStock && <p className="text-xs text-red-400 mt-2 text-center font-bold">Actualmente no aceptamos nuevos miembros para este producto.</p>}
               </div>
            </div>

            {/* Features List */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Lo que incluye:</h3>
                <ul className="space-y-3">
                    {product.features?.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="text-neon w-5 h-5 shrink-0 mt-0.5" />
                        <span className="text-sm font-medium text-foreground/90">{feature}</span>
                    </li>
                    ))}
                </ul>
            </div>
          </div>
        </div>
      </main>

      {/* --- NEW SECTION: THE DEEP DIVE (Persuasion) --- */}
      <section className="bg-muted/5 border-y border-border py-24">
         <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <Badge variant="outline" className="mb-4 border-neon/30 text-neon bg-neon/5">ANATOMÍA DEL SISTEMA</Badge>
                    <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-6">
                        ¿Por qué esto <span className="text-neon">funciona?</span>
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        No es solo "información". Es un sistema diseñado para la ejecución.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
                    <div className="order-2 md:order-1 prose prose-invert">
                         <h3 className="text-2xl font-bold text-white mb-4">La Estrategia Detrás</h3>
                         <div className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                            {product.full_description}
                         </div>
                    </div>
                    <div className="order-1 md:order-2">
                        <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl border border-border shadow-2xl relative overflow-hidden">
                             <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-neon/10 rounded-full blur-[80px]"></div>
                             <div className="relative z-10 space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-neon/20 flex items-center justify-center text-neon border border-neon/30">
                                        <Zap className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white">Velocidad de Implementación</h4>
                                        <p className="text-sm text-muted-foreground">Diseñado para ejecutar en menos de 24hs.</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/30">
                                        <ImageIcon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white">Activos Incluidos</h4>
                                        <p className="text-sm text-muted-foreground">Templates, prompts y scripts listos.</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 border border-purple-500/30">
                                        <Check className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white">Sin Relleno</h4>
                                        <p className="text-sm text-muted-foreground">Directo al grano. Cero teoría innecesaria.</p>
                                    </div>
                                </div>
                             </div>
                        </div>
                    </div>
                </div>

                {/* OBJECTION HANDLING: FOR WHO / NOT FOR WHO */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-8">
                        <h3 className="flex items-center gap-2 text-xl font-bold text-red-500 mb-6">
                            <XCircle className="w-6 h-6" /> NO ES PARA VOS SI...
                        </h3>
                        <ul className="space-y-4">
                            <li className="flex gap-3 text-muted-foreground">
                                <span className="text-red-500 font-bold">✕</span> Buscas fórmulas mágicas sin trabajo.
                            </li>
                            <li className="flex gap-3 text-muted-foreground">
                                <span className="text-red-500 font-bold">✕</span> No estás dispuesto a probar cosas nuevas.
                            </li>
                            <li className="flex gap-3 text-muted-foreground">
                                <span className="text-red-500 font-bold">✕</span> Prefieres la teoría académica sobre la práctica.
                            </li>
                        </ul>
                    </div>

                    <div className="bg-neon/5 border border-neon/20 rounded-xl p-8">
                        <h3 className="flex items-center gap-2 text-xl font-bold text-neon mb-6">
                            <CheckCircle2 className="w-6 h-6" /> SÍ ES PARA VOS SI...
                        </h3>
                        <ul className="space-y-4 text-foreground">
                            <li className="flex gap-3 text-foreground">
                                <span className="text-neon font-bold">✓</span> Quieres resultados tangibles y rápidos.
                            </li>
                            <li className="flex gap-3 text-foreground">
                                <span className="text-neon font-bold">✓</span> Entiendes que la IA es una herramienta, no magia.
                            </li>
                            <li className="flex gap-3 text-foreground">
                                <span className="text-neon font-bold">✓</span> Valoras tu tiempo y quieres atajos probados.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
         </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto bg-card border border-border rounded-2xl p-12 shadow-2xl relative overflow-hidden">
               <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
               <div className="relative z-10">
                   <h2 className="text-3xl font-black mb-4 uppercase">¿Listo para empezar?</h2>
                   <p className="text-muted-foreground mb-8">
                       El acceso es inmediato. No dejes que la competencia te gane de mano.
                   </p>
                   <Button 
                    onClick={handlePrimaryAction}
                    disabled={isOutOfStock}
                    className={`font-bold text-lg px-8 py-6 rounded-lg transition-all ${
                        isOutOfStock 
                            ? "bg-muted text-muted-foreground cursor-not-allowed" 
                            : "bg-neon text-black hover:bg-neon/90 shadow-[0_0_20px_rgba(212,232,58,0.4)] hover:shadow-[0_0_40px_rgba(212,232,58,0.6)]"
                    }`}
                   >
                       {userHasProduct ? "ACCEDER AHORA" : isOutOfStock ? "NO DISPONIBLE" : (product.is_free ? "DESCARGAR GRATIS" : "COMPRAR AHORA")}
                   </Button>
               </div>
          </div>
      </section>
      
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
                disabled={isProcessing || isOutOfStock}
                size="sm" 
                className={`font-bold rounded-md px-6 shadow-[0_0_15px_rgba(212,232,58,0.4)] disabled:opacity-70 ${userHasProduct ? "bg-secondary text-secondary-foreground" : isOutOfStock ? "bg-muted text-muted-foreground" : "bg-neon text-black hover:bg-neon/90"}`}
              >
                 {isProcessing ? <Loader2 className="animate-spin" /> : (userHasProduct ? "ACCEDER" : isOutOfStock ? "AGOTADO" : (product.is_free ? "GRATIS" : <ShoppingCart className="w-5 h-5" />))}
              </Button>
          </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;