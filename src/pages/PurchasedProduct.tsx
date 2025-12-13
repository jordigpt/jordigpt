import { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Loader2, Lock, Download, Video, FileText, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
          <div className="aspect-video">
            <iframe
              src={item.content_url}
              className="w-full h-full rounded-lg border"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        );
      case 'file':
        return (
          <a href={item.content_url} download target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="w-full justify-start h-14 text-base">
              <Download className="mr-4 h-5 w-5 text-neon" /> {item.title}
            </Button>
          </a>
        );
      case 'text':
        return (
            <div className="prose prose-invert max-w-none rounded-lg border bg-muted/20 p-6" dangerouslySetInnerHTML={{ __html: item.content_text || '' }} />
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
        
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{product?.title}</h1>
        <p className="text-lg text-muted-foreground mb-12">Accede a todo el contenido de tu producto a continuación.</p>

        {content.length > 0 ? (
          <div className="space-y-8">
            {content.map(item => (
              <div key={item.id}>
                <h2 className="text-xl font-bold mb-4 flex items-center">
                    {item.content_type === 'video' && <Video className="mr-3 h-5 w-5 text-muted-foreground"/>}
                    {item.content_type === 'file' && <Download className="mr-3 h-5 w-5 text-muted-foreground"/>}
                    {item.content_type === 'text' && <FileText className="mr-3 h-5 w-5 text-muted-foreground"/>}
                    {item.title}
                </h2>
                {renderContentItem(item)}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-12 border border-dashed rounded-lg">Aún no hay contenido disponible para este producto.</p>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default PurchasedProduct;