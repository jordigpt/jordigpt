import { useParams, Link, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AuthModal } from "@/components/AuthModal";
import { Session } from "@supabase/supabase-js";
import { useCart } from "@/context/CartContext";
import { Product } from "@/types/admin";

// Sub-components
import { ProductGallery } from "@/components/product-detail/ProductGallery";
import { ProductInfo } from "@/components/product-detail/ProductInfo";
import { ProductDeepDive } from "@/components/product-detail/ProductDeepDive";
import { ProductFinalCTA } from "@/components/product-detail/ProductFinalCTA";
import { StickyMobileCTA } from "@/components/product-detail/StickyMobileCTA";

const ProductDetail = () => {
  const { slug, id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSticky, setShowSticky] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [userHasProduct, setUserHasProduct] = useState(false);
  
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
    if (product.is_out_of_stock && !userHasProduct) return;
    
    if (userHasProduct) {
        navigate(`/my-products/${product.id}`);
        return;
    }

    if (product.gumroad_link) {
        window.open(product.gumroad_link, '_blank');
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

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="w-8 h-8 animate-spin text-neon" /></div>;
  if (!product) return <Navigate to="/" replace />;

  const isOutOfStock = product.is_out_of_stock && !userHasProduct;
  const isGumroadProduct = !!product.gumroad_link && !product.is_free;
  const allImages = [product.image_url, ...(product.gallery_images || [])].filter(Boolean);

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
          <div className="lg:col-span-7">
            <ProductGallery 
                images={allImages}
                title={product.title}
                isOutOfStock={isOutOfStock}
                isFree={product.is_free}
                isGumroad={isGumroadProduct}
            />
          </div>

          {/* RIGHT: COPY & ACTION (5 Cols) */}
          <div className="lg:col-span-5">
            <ProductInfo 
                product={product}
                userHasProduct={userHasProduct}
                isOutOfStock={isOutOfStock}
                isProcessing={isProcessing}
                onAction={handlePrimaryAction}
                isGumroad={isGumroadProduct}
            />
          </div>
        </div>
      </main>

      {/* --- DEEP DIVE SECTION --- */}
      <ProductDeepDive product={product} />

      {/* --- FINAL CTA --- */}
      <ProductFinalCTA 
          product={product}
          userHasProduct={userHasProduct}
          isOutOfStock={isOutOfStock}
          isGumroad={isGumroadProduct}
          onAction={handlePrimaryAction}
      />
      
      {/* --- STICKY MOBILE CTA --- */}
      <StickyMobileCTA 
          product={product}
          isVisible={showSticky}
          userHasProduct={userHasProduct}
          isProcessing={isProcessing}
          isOutOfStock={isOutOfStock}
          isGumroad={isGumroadProduct}
          onAction={handlePrimaryAction}
      />

      <Footer />
    </div>
  );
};

export default ProductDetail;