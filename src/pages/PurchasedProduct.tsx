import { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Loader2, Download, Video, FileText, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Product {
    id: string;
    title: string;
}

interface ProductContent {
  id: string;
  content_type: 'file' | 'video' | 'text';
  title: string;
  content_url?: string;
  content_text?: string;
}

const PurchasedProduct = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [content, setContent] = useState<ProductContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }

    const checkAccessAndFetchContent = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return; // Redirect handled below
      }

      // 1. Check for a valid order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .eq('status', 'approved')
        .limit(1);

      if (orderError || !orderData || orderData.length === 0) {
        setHasAccess(false);
        setLoading(false);
        return;
      }

      setHasAccess(true);

      // 2. Fetch product details and content
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('id, title')
        .eq('id', productId)
        .single();
      
      if (productError) {
          console.error("Error fetching product", productError);
          setLoading(false);
          return;
      }
      setProduct(productData);

      const { data: contentData, error: contentError } = await supabase
        .from('product_content')
        .select('*')
        .eq('product_id', productId)
        .order('sort_order', { ascending: true });

      if (contentError) {
        console.error("Error fetching content:", contentError);
      } else {
        setContent(contentData);
      }

      setLoading(false);
    };

    checkAccessAndFetchContent();
  }, [productId]);

  // Helper para convertir URLs de YouTube normales a Embed
  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    try {
        // Si ya es embed, devolver
        if (url.includes('/embed/')) return url;

        let videoId = '';
        
        // Formato: youtube.com/watch?v=ID
        if (url.includes('v=')) {
            const urlParams = new URLSearchParams(new URL(url).search);
            videoId = urlParams.get('v') || '';
        } 
        // Formato: youtu.be/ID
        else if (url.includes('youtu.be/')) {
            const parts = url.split('/');
            videoId = parts[parts.length - 1]?.split('?')[0] || '';
        }

        if (videoId) {
            return `https://www.youtube.com/embed/${videoId}`;
        }
        
        return url;
    } catch (e) {
        return url;
    }
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-neon" /></div>;
  }

  if (!hasAccess) {
    return <Navigate to="/account" replace />;
  }

  const renderContentItem = (item: ProductContent) => {
    switch (item.content_type) {
      case 'video':
        return (
          <div className="aspect-video w-full max-w-4xl mx-auto bg-black rounded-lg overflow-hidden border border-border shadow-lg">
            <iframe
              src={getEmbedUrl(item.content_url || '')}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={item.title}
            ></iframe>
          </div>
        );
      case 'file':
        return (
          <a href={item.content_url} download target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="w-full justify-start h-16 text-base bg-card hover:bg-neon/10 border-border hover:border-neon/50 group transition-all">
              <div className="bg-muted group-hover:bg-neon p-2 rounded mr-4 transition-colors">
                  <Download className="h-5 w-5 text-foreground group-hover:text-black" />
              </div>
              <span className="font-medium">{item.title}</span>
            </Button>
          </a>
        );
      case 'text':
        return (
            <div className="prose prose-invert max-w-none rounded-lg border border-border bg-card/50 p-8 shadow-sm" dangerouslySetInnerHTML={{ __html: item.content_text || '' }} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="container mx-auto max-w-4xl px-4 pt-32 pb-20">
        <Link to="/account" className="inline-flex items-center text-muted-foreground hover:text-neon mb-8 transition-colors text-sm font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" /> VOLVER A MIS PRODUCTOS
        </Link>
        
        <div className="mb-10 border-b border-border pb-6">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 uppercase">{product?.title}</h1>
            <p className="text-lg text-muted-foreground">Accede a todo el contenido de tu producto a continuación.</p>
        </div>

        {content.length > 0 ? (
          <div className="space-y-12">
            {content.map((item, index) => (
              <div key={item.id} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="flex items-center gap-3 mb-4">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-xs font-bold text-muted-foreground border border-border">
                        {index + 1}
                    </span>
                    <h2 className="text-xl font-bold flex items-center">
                        {item.title}
                    </h2>
                </div>
                {renderContentItem(item)}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-12 border border-dashed rounded-lg bg-muted/5">
              Aún no hay contenido disponible para este producto.
          </p>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default PurchasedProduct;