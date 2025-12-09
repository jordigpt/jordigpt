import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus, LogOut, Loader2, DollarSign, ShoppingBag, Package } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Interfaces
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

interface Order {
  id: string;
  created_at: string;
  status: string;
  amount: number;
  product_id: string;
  user_id?: string;
  mp_preference_id?: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  
  // Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  
  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    title: "",
    short_description: "",
    full_description: "",
    price: 0,
    features: [],
    cta_text: "ACCEDER",
    is_free: false,
    badge: "",
    original_price_label: "Antes:",
    original_price_display: "",
    price_display: "",
    price_microcopy: "Pago único · Acceso de por vida",
    is_featured: false,
    image_type: "chart-line-up"
  });
  const [featuresInput, setFeaturesInput] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    checkUser();
    fetchData();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/login");
    }
  };

  const fetchData = async () => {
    setLoading(true);
    // Fetch Products
    const { data: productsData, error: prodError } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (prodError) toast({ title: "Error loading products", description: prodError.message, variant: "destructive" });
    else setProducts(productsData || []);

    // Fetch Orders
    const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
        
    if (ordersError) {
        console.error("Orders error:", ordersError);
        // Don't show toast if it's just empty or RLS restriction on first load
    } else {
        setOrders(ordersData || []);
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  // --- Product Form Handlers ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!e.target.files || e.target.files.length === 0) throw new Error('You must select an image to upload.');

      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
      
      setFormData(prev => ({ ...prev, image_url: data.publicUrl }));
      toast({ title: "Image uploaded successfully" });
    } catch (error: any) {
      toast({ title: "Error uploading image", description: error.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const featuresArray = featuresInput.split('\n').filter(f => f.trim() !== '');
      const productData = {
        ...formData,
        features: featuresArray.length > 0 ? featuresArray : formData.features,
      };

      if (editingId) {
        const { error } = await supabase.from('products').update(productData).eq('id', editingId);
        if (error) throw error;
        toast({ title: "Product updated" });
      } else {
        const { error } = await supabase.from('products').insert([productData]);
        if (error) throw error;
        toast({ title: "Product created" });
      }
      
      resetForm();
      fetchData();
    } catch (error: any) {
      toast({ title: "Error saving product", description: error.message, variant: "destructive" });
    }
  };

  const resetForm = () => {
    setFormData({
        title: "",
        short_description: "",
        full_description: "",
        price: 0,
        features: [],
        cta_text: "ACCEDER",
        is_free: false,
        badge: "",
        original_price_label: "Antes:",
        original_price_display: "",
        price_display: "",
        price_microcopy: "Pago único · Acceso de por vida",
        is_featured: false,
        image_type: "chart-line-up"
    });
    setFeaturesInput("");
    setEditingId(null);
  }

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData(product);
    setFeaturesInput(product.features ? product.features.join('\n') : "");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) toast({ title: "Error deleting", description: error.message, variant: "destructive" });
    else {
        toast({ title: "Product deleted" });
        fetchData();
    }
  };

  const getProductTitle = (id: string) => {
      const p = products.find(p => p.id === id);
      return p ? p.title : id;
  }

  if (loading && !products.length) return <div className="flex justify-center items-center h-screen bg-background"><Loader2 className="animate-spin text-neon" /></div>;

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
            <TabsList className="grid w-full grid-cols-2 max-w-[400px] mb-8">
                <TabsTrigger value="products">Inventory (Productos)</TabsTrigger>
                <TabsTrigger value="orders">Sales (Ventas)</TabsTrigger>
            </TabsList>

            {/* --- PRODUCTS TAB --- */}
            <TabsContent value="products">
                <div className="grid lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-24 border-border">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Package className="w-5 h-5 text-neon" />
                            {editingId ? "Edit Product" : "Add New Product"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Basic Info */}
                        <div>
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" name="title" value={formData.title} onChange={handleInputChange} required className="bg-background/50" />
                        </div>
                        
                        <div>
                            <Label htmlFor="short_description">Short Desc.</Label>
                            <Textarea id="short_description" name="short_description" value={formData.short_description} onChange={handleInputChange} className="h-20 bg-background/50" />
                        </div>

                        <div>
                            <Label htmlFor="full_description">Full Desc.</Label>
                            <Textarea id="full_description" name="full_description" value={formData.full_description} onChange={handleInputChange} className="h-32 bg-background/50" />
                        </div>

                        {/* Pricing */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                            <Label htmlFor="price">Price (Num)</Label>
                            <Input type="number" id="price" name="price" value={formData.price} onChange={handleInputChange} className="bg-background/50" />
                            </div>
                            <div>
                            <Label htmlFor="price_display">Display</Label>
                            <Input id="price_display" name="price_display" value={formData.price_display} onChange={handleInputChange} placeholder="US$ 29.99" className="bg-background/50" />
                            </div>
                        </div>

                        {/* Marketing */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="original_price_display">Orig. Price</Label>
                                <Input id="original_price_display" name="original_price_display" value={formData.original_price_display} onChange={handleInputChange} className="bg-background/50" />
                            </div>
                            <div>
                                <Label htmlFor="badge">Badge</Label>
                                <Input id="badge" name="badge" value={formData.badge} onChange={handleInputChange} className="bg-background/50" />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="price_microcopy">Microcopy</Label>
                            <Input id="price_microcopy" name="price_microcopy" value={formData.price_microcopy} onChange={handleInputChange} className="bg-background/50" />
                        </div>

                        <div>
                            <Label htmlFor="features">Features (one per line)</Label>
                            <Textarea 
                            id="features" 
                            value={featuresInput} 
                            onChange={(e) => setFeaturesInput(e.target.value)} 
                            placeholder="- Feature 1&#10;- Feature 2"
                            className="min-h-[100px] bg-background/50"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="cta_text">CTA Button</Label>
                                <Input id="cta_text" name="cta_text" value={formData.cta_text} onChange={handleInputChange} className="bg-background/50" />
                            </div>
                             <div>
                                <Label htmlFor="image_type">Icon Fallback</Label>
                                <select 
                                    id="image_type" 
                                    name="image_type" 
                                    value={formData.image_type} 
                                    onChange={(e) => setFormData({...formData, image_type: e.target.value})}
                                    className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm"
                                >
                                    <option value="chart-line-up">Zap (Chart)</option>
                                    <option value="infinity">Infinity</option>
                                    <option value="unlock">Unlock</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="image">Image Upload</Label>
                            <Input id="image" type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="bg-background/50" />
                            {uploading && <p className="text-xs text-muted-foreground mt-1">Uploading...</p>}
                        </div>
                        
                        <div className="flex gap-4 pt-2">
                            <div className="flex items-center space-x-2">
                            <Checkbox id="is_free" checked={formData.is_free} onCheckedChange={(c) => handleCheckboxChange("is_free", c as boolean)} />
                            <label htmlFor="is_free" className="text-sm font-medium">Is Free?</label>
                            </div>
                            <div className="flex items-center space-x-2">
                            <Checkbox id="is_featured" checked={formData.is_featured} onCheckedChange={(c) => handleCheckboxChange("is_featured", c as boolean)} />
                            <label htmlFor="is_featured" className="text-sm font-medium">Featured?</label>
                            </div>
                        </div>

                        <div className="flex gap-2 pt-4">
                            <Button type="submit" className="w-full bg-neon text-black hover:bg-neon/90" disabled={loading || uploading}>
                            {loading ? <Loader2 className="animate-spin" /> : (editingId ? "Update Product" : "Create Product")}
                            </Button>
                            {editingId && (
                            <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                            )}
                        </div>
                        </form>
                    </CardContent>
                    </Card>
                </div>

                {/* List Section */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><ShoppingBag className="w-5 h-5"/> Current Inventory</h2>
                    {products.length === 0 ? (
                        <div className="text-center p-8 bg-muted/20 rounded border border-dashed border-border">
                            <p className="text-muted-foreground">No products found. Add one!</p>
                        </div>
                    ) : (
                        products.map((product) => (
                        <Card key={product.id} className="overflow-hidden group hover:border-neon/50 transition-colors">
                            <CardContent className="p-6 flex flex-col md:flex-row gap-4 items-start md:items-center">
                            {product.image_url && (
                                <img src={product.image_url} alt={product.title} className="w-16 h-16 object-cover rounded bg-muted" />
                            )}
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-lg">{product.title}</h3>
                                    {product.is_featured && <Badge className="bg-neon text-black text-[10px]">FEATURED</Badge>}
                                    {product.is_free && <Badge variant="outline" className="text-[10px]">FREE</Badge>}
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-1">{product.short_description}</p>
                                <p className="text-xs font-mono mt-1 text-neon">{product.price_display}</p>
                            </div>
                            <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0">
                                <Button variant="secondary" size="sm" onClick={() => handleEdit(product)}>Edit</Button>
                                <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(product.id)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                            </CardContent>
                        </Card>
                        ))
                    )}
                </div>
                </div>
            </TabsContent>

            {/* --- ORDERS TAB --- */}
            <TabsContent value="orders">
                <Card className="border-border">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-neon" /> Sales History
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Product</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>MP ID</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center text-muted-foreground h-24">
                                            No sales yet.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    orders.map((order) => (
                                        <TableRow key={order.id}>
                                            <TableCell className="font-mono text-xs">
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {getProductTitle(order.product_id)}
                                            </TableCell>
                                            <TableCell>${order.amount}</TableCell>
                                            <TableCell>
                                                <Badge variant={order.status === 'approved' ? 'default' : 'secondary'} className={order.status === 'approved' ? 'bg-green-500 hover:bg-green-600' : ''}>
                                                    {order.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="font-mono text-xs text-muted-foreground">
                                                {order.mp_preference_id || '-'}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>

      </div>
    </div>
  );
};

export default Admin;