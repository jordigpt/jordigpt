import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight, ShoppingBag, LogOut } from "lucide-react";
import { Session } from "@supabase/supabase-js";

interface Product {
    id: string;
    title: string;
    short_description: string;
    image_url: string;
}

interface Order {
  id: string;
  status: string;
  product_id: string;
}

const Account = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [purchasedProducts, setPurchasedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSessionAndData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }
      setSession(session);
      
      try {
          // 1. Fetch Orders first (simpler query, no join risks)
          const { data: ordersData, error: orderError } = await supabase
            .from('orders')
            .select('id, product_id, status')
            .eq('user_id', session.user.id)
            .eq('status', 'approved');

          if (orderError) throw orderError;

          if (!ordersData || ordersData.length === 0) {
              setPurchasedProducts([]);
              setLoading(false);
              return;
          }

          // 2. Get Product IDs
          const productIds = ordersData.map(o => o.product_id);

          // 3. Fetch Products based on IDs
          const { data: productsData, error: productsError } = await supabase
             .from('products')
             .select('id, title, short_description, image_url')
             .in('id', productIds);

          if (productsError) throw productsError;

          setPurchasedProducts(productsData || []);

      } catch (error) {
          console.error("Error fetching account data:", error);
      } finally {
          setLoading(false);
      }
    };
    
    getSessionAndData();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-neon" /></div>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="container mx-auto px-4 pt-32 pb-20">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Mi Arsenal</h1>
            <p className="text-muted-foreground">Aquí están todos los productos que has adquirido.</p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="gap-2">
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </Button>
        </div>
        
        {purchasedProducts.length === 0 ? (
          <div className="text-center py-20 border border-dashed rounded-lg">
            <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No has adquirido productos todavía.</h3>
            <p className="mt-1 text-sm text-muted-foreground">Explora el arsenal para empezar.</p>
            <Button asChild className="mt-6">
              <Link to="/">Ver Productos</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {purchasedProducts.map(product => (
              <Card key={product.id} className="overflow-hidden hover:border-neon/50 transition-colors">
                <CardHeader className="p-0">
                  <div className="aspect-video bg-muted relative">
                    {product.image_url ? (
                      <img 
                        src={product.image_url} 
                        alt={product.title} 
                        className="h-full w-full object-cover" 
                      />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                             <span className="text-2xl font-bold text-gray-700">JG</span>
                        </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold">{product.title}</h2>
                  <p className="text-sm text-muted-foreground mt-2 mb-4 line-clamp-2">
                    {product.short_description}
                  </p>
                  <Button asChild className="w-full bg-secondary hover:bg-neon hover:text-black font-bold transition-all">
                    <Link to={`/my-products/${product.id}`}>
                      Acceder al Contenido
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Account;