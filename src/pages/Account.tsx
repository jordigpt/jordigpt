import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Package, ArrowRight, ShoppingBag } from "lucide-react";
import { Session } from "@supabase/supabase-js";

interface Order {
  id: string;
  status: string;
  products: {
    id: string;
    title: string;
    short_description: string;
    image_url: string;
  };
}

const Account = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSessionAndData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }
      setSession(session);

      const { data: ordersData, error } = await supabase
        .from('orders')
        .select(`
          id,
          status,
          products ( id, title, short_description, image_url )
        `)
        .eq('user_id', session.user.id)
        .eq('status', 'approved');

      if (error) {
        console.error("Error fetching orders:", error);
      } else {
        setOrders(ordersData as any);
      }
      setLoading(false);
    };

    getSessionAndData();
  }, [navigate]);

  if (loading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="container mx-auto px-4 pt-32 pb-20">
        <h1 className="text-4xl font-bold mb-2">Mi Arsenal</h1>
        <p className="text-muted-foreground mb-8">Aquí están todos los productos que has adquirido.</p>

        {orders.length === 0 ? (
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
            {orders.map(order => (
              <Card key={order.id} className="overflow-hidden hover:border-neon/50 transition-colors">
                <CardHeader className="p-0">
                  <div className="aspect-video bg-muted">
                    {order.products.image_url && (
                      <img src={order.products.image_url} alt={order.products.title} className="h-full w-full object-cover" />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold">{order.products.title}</h2>
                  <p className="text-sm text-muted-foreground mt-2 mb-4 line-clamp-2">{order.products.short_description}</p>
                  <Button asChild className="w-full">
                    <Link to={`/my-products/${order.products.id}`}>
                      Acceder al Contenido <ArrowRight className="ml-2 h-4 w-4" />
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