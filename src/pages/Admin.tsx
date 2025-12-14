import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Loader2, Settings, Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Product } from "@/types/admin";
import { AdminProductsTab } from "@/components/admin/AdminProductsTab";
import { AdminOrdersTab } from "@/components/admin/AdminOrdersTab";
import { AdminPromptsTab } from "@/components/admin/AdminPromptsTab";
import { AdminSettingsTab } from "@/components/admin/AdminSettingsTab";

const ADMIN_EMAIL = "jordithecreative@gmail.com";

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const initializeAdmin = async () => {
      await checkUser();
      fetchProducts();
    };
    initializeAdmin();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/login");
      return;
    }
    if (session.user.email !== ADMIN_EMAIL) {
      toast({ title: "Acceso Denegado", description: "No tienes permisos para ver esta página.", variant: "destructive" });
      navigate("/account");
      return;
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    const { data: productsData, error: prodError } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (prodError) toast({ title: "Error loading products", description: prodError.message, variant: "destructive" });
    else setProducts(productsData || []);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (loading && products.length === 0) return <div className="flex justify-center items-center h-screen bg-background"><Loader2 className="animate-spin text-neon" /></div>;

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button variant="destructive" onClick={handleLogout} className="gap-2">
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </div>

        <Tabs defaultValue="products" className="w-full">
            <TabsList className="grid w-full grid-cols-4 max-w-[800px] mb-8">
                <TabsTrigger value="products">Inventory</TabsTrigger>
                <TabsTrigger value="prompts">
                    <Sparkles className="w-4 h-4 mr-2" /> Gallery
                </TabsTrigger>
                <TabsTrigger value="orders">Sales</TabsTrigger>
                <TabsTrigger value="settings" className="data-[state=active]:text-neon">
                    <Settings className="w-4 h-4 mr-2" /> Config
                </TabsTrigger>
            </TabsList>

            <TabsContent value="products">
                <AdminProductsTab products={products} onRefresh={fetchProducts} />
            </TabsContent>

            <TabsContent value="prompts">
                <AdminPromptsTab />
            </TabsContent>

            <TabsContent value="orders">
                <AdminOrdersTab products={products} />
            </TabsContent>

            <TabsContent value="settings">
                 <AdminSettingsTab />
            </TabsContent>
        </Tabs>

      </div>
    </div>
  );
};

export default Admin;