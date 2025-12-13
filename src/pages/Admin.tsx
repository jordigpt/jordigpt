import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus, LogOut, Loader2, DollarSign, ShoppingBag, Package, Settings, Save, RefreshCw, Upload, Image as ImageIcon, Sparkles, Terminal, FolderKanban, User, Link as LinkIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AdminAIAssistant } from "@/components/AdminAIAssistant";
import { ProductContentManager } from "@/components/ProductContentManager";

// Interfaces
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

interface AdminOrder {
  id: string;
  created_at: string;
  status: string;
  amount: number;
  product_id: string;
  mp_preference_id?: string;
  user_email?: string;
  first_name?: string;
  last_name?: string;
}

interface PromptItem {
    id: string;
    image_url: string;
    prompt: string;
    model_info: string;
    created_at: string;
}

const ADMIN_EMAIL = "jordithecreative@gmail.com";

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  
  // Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [promptItems, setPromptItems] = useState<PromptItem[]>([]);
  
  // Settings State
  const [aiSystemPrompt, setAiSystemPrompt] = useState("");
  const [savingSettings, setSavingSettings] = useState(false);
  
  // Product Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    title: "",
    slug: "",
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

  // Prompt Form State
  const [promptForm, setPromptForm] = useState({
      image_url: "",
      prompt: "",
      model_info: "NanoBanana PRO"
  });
  const [promptUploading, setPromptUploading] = useState(false);

  // Content Manager State
  const [contentManagerOpen, setContentManagerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const initializeAdmin = async () => {
      await checkUser();
      fetchData();
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

  const fetchData = async () => {
    setLoading(true);
    // Fetch Products
    const { data: productsData, error: prodError } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (prodError) toast({ title: "Error loading products", description: prodError.message, variant: "destructive" });
    else setProducts(productsData || []);

    // Fetch Orders using Secure RPC
    const { data: ordersData, error: ordersError } = await supabase
        .rpc('get_admin_orders');
        
    if (ordersError) {
        console.error("Error fetching orders:", ordersError);
        toast({ title: "Error loading orders", description: ordersError.message, variant: "destructive" });
    } else {
        setOrders(ordersData || []);
    }

    // Fetch Prompt Items
    const { data: promptsData, error: promptsError } = await supabase
        .from('prompt_gallery_items')
        .select('*')
        .order('created_at', { ascending: false });
    
    if (!promptsError) setPromptItems(promptsData || []);

    // Fetch Settings
    const { data: settingsData } = await supabase
        .from('admin_settings')
        .select('value')
        .eq('key', 'ai_system_prompt')
        .single();
    
    if (settingsData) setAiSystemPrompt(settingsData.value);

    setLoading(false);
  };

  const handleSaveSettings = async () => {
      setSavingSettings(true);
      const { error } = await supabase
        .from('admin_settings')
        .upsert({ key: 'ai_system_prompt', value: aiSystemPrompt });

      if (error) {
          toast({ title: "Error saving settings", description: error.message, variant: "destructive" });
      } else {
          toast({ title: "Configuración guardada", description: "El agente IA ahora usará estas instrucciones." });
      }
      setSavingSettings(false);
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
      const fileName = `products/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);
      
      setFormData(prev => ({ ...prev, image_url: data.publicUrl }));
      toast({ title: "Imagen subida exitosamente" });
    } catch (error: any) {
      toast({ title: "Error al subir imagen", description: error.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const featuresArray = featuresInput.split('\n').filter(f => f.trim() !== '');
      
      // Auto-generate slug if empty
      let slug = formData.slug;
      if (!slug && formData.title) {
          slug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      }

      const productData = {
        ...formData,
        slug,
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
        slug: "",
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

  const handleAIGenerated = (aiData: any) => {
    setFormData(prev => ({
      ...prev,
      ...aiData
    }));
    if (aiData.features && Array.isArray(aiData.features)) {
      setFeaturesInput(aiData.features.join('\n'));
    }
  };

  const openContentManager = (product: Product) => {
    setSelectedProduct(product);
    setContentManagerOpen(true);
  };

  // --- PROMPT GALLERY HANDLERS ---
  const handlePromptImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setPromptUploading(true);
      if (!e.target.files || e.target.files.length === 0) throw new Error('Select an image.');

      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `gallery/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);
      
      setPromptForm(prev => ({ ...prev, image_url: data.publicUrl }));
      toast({ title: "Imagen de galería subida" });
    } catch (error: any) {
      toast({ title: "Error upload", description: error.message, variant: "destructive" });
    } finally {
      setPromptUploading(false);
    }
  };

  const handlePromptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptForm.image_url || !promptForm.prompt) {
        toast({ title: "Faltan datos", variant: "destructive" });
        return;
    }

    const { error } = await supabase.from('prompt_gallery_items').insert([promptForm]);
    if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
        toast({ title: "Prompt agregado a la galería" });
        setPromptForm({ image_url: "", prompt: "", model_info: "NanoBanana PRO" });
        fetchData();
    }
  };

  const handleDeletePrompt = async (id: string) => {
      if(!confirm("Borrar este prompt?")) return;
      const { error } = await supabase.from('prompt_gallery_items').delete().eq('id', id);
      if(!error) {
          toast({ title: "Borrado" });
          fetchData();
      }
  };

  if (loading && !products.length && !aiSystemPrompt) return <div className="flex justify-center items-center h-screen bg-background"><Loader2 className="animate-spin text-neon" /></div>;

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <Navbar />
      <ProductContentManager product={selectedProduct} open={contentManagerOpen} onOpenChange={setContentManagerOpen} />
      
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

            {/* --- PRODUCTS TAB --- */}
            <TabsContent value="products">
                <div className="grid lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-24 border-border">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="flex items-center gap-2">
                            <Package className="w-5 h-5 text-neon" />
                            {editingId ? "Edit Product" : "Nuevo Producto"}
                        </CardTitle>
                        <AdminAIAssistant onGenerate={handleAIGenerated} />
                    </CardHeader>
                    <CardContent className="pt-4">
                        <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Basic Info */}
                        <div>
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" name="title" value={formData.title} onChange={handleInputChange} required className="bg-background/50" />
                        </div>
                        
                        <div>
                            <Label htmlFor="slug" className="flex items-center gap-2">
                                <LinkIcon className="w-3 h-3 text-neon" /> URL Slug (jordigpt.com/...)
                            </Label>
                            <Input 
                                id="slug" 
                                name="slug" 
                                value={formData.slug} 
                                onChange={handleInputChange} 
                                placeholder="ej: plan-1k (se autogenera si está vacío)"
                                className="bg-background/50 font-mono text-sm text-neon" 
                            />
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
                            <Label htmlFor="image">Imagen del Producto</Label>
                            <div className="flex flex-col gap-2 mt-1">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    className="w-full border-dashed border-2 border-border h-20 relative hover:border-neon/50 transition-colors"
                                    onClick={() => document.getElementById('image')?.click()}
                                    disabled={uploading}
                                >
                                    {uploading ? (
                                        <div className="flex items-center text-muted-foreground"><Loader2 className="animate-spin mr-2 h-4 w-4"/> Subiendo...</div>
                                    ) : (
                                        <div className="flex flex-col items-center text-muted-foreground">
                                            <Upload className="h-6 w-6 mb-1"/>
                                            <span className="text-xs">Click para subir imagen</span>
                                        </div>
                                    )}
                                </Button>
                                <Input 
                                    id="image" 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleImageUpload} 
                                    disabled={uploading} 
                                    className="hidden" 
                                />
                                
                                {formData.image_url && (
                                    <div className="relative rounded-lg overflow-hidden border border-border mt-2 h-40 bg-muted/30 flex items-center justify-center group">
                                        <img src={formData.image_url} alt="Preview" className="h-full w-full object-cover" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Button type="button" size="sm" variant="destructive" onClick={() => setFormData({...formData, image_url: ""})}>
                                                <Trash2 className="w-4 h-4 mr-2"/> Quitar
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
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
                                <div className="flex items-center gap-2 text-xs font-mono text-neon mt-1">
                                    <span>/{product.slug}</span>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-1 mt-1">{product.short_description}</p>
                            </div>
                            <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0">
                                <Button variant="secondary" size="sm" onClick={() => openContentManager(product)} className="gap-2">
                                    <FolderKanban className="w-4 h-4" /> Contenido
                                </Button>
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

             {/* --- PROMPT GALLERY TAB --- */}
             <TabsContent value="prompts">
                {/* ... (Prompt Gallery content remains mostly the same, elided for brevity if unchanged) ... */}
                <div className="grid lg:grid-cols-3 gap-8">
                     <div className="lg:col-span-1">
                        <Card className="sticky top-24 border-border">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-neon" /> Nuevo Prompt
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handlePromptSubmit} className="space-y-4">
                                    {/* Image Upload */}
                                    <div>
                                        <Label>Imagen Generada</Label>
                                        <div className="mt-2">
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                className="w-full border-dashed border-2 border-border h-32 relative hover:border-neon/50"
                                                onClick={() => document.getElementById('prompt-image')?.click()}
                                                disabled={promptUploading}
                                            >
                                                {promptUploading ? <Loader2 className="animate-spin"/> : (promptForm.image_url ? <img src={promptForm.image_url} className="h-full w-full object-cover rounded" /> : <div className="flex flex-col items-center"><Upload className="mb-2"/>Subir Imagen</div>)}
                                            </Button>
                                            <Input id="prompt-image" type="file" className="hidden" accept="image/*" onChange={handlePromptImageUpload} />
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <Label>Prompt</Label>
                                        <Textarea 
                                            value={promptForm.prompt}
                                            onChange={(e) => setPromptForm({...promptForm, prompt: e.target.value})}
                                            placeholder="Pegar el prompt aquí..."
                                            className="h-32 font-mono text-xs bg-background/50"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label>Modelo</Label>
                                        <Input 
                                            value={promptForm.model_info}
                                            onChange={(e) => setPromptForm({...promptForm, model_info: e.target.value})}
                                            placeholder="ej: Midjourney v6"
                                            className="bg-background/50"
                                        />
                                    </div>

                                    <Button type="submit" className="w-full bg-neon text-black font-bold" disabled={promptUploading}>
                                        AGREGAR A GALERÍA
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                     </div>

                     <div className="lg:col-span-2">
                         <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                             {promptItems.map((item) => (
                                 <div key={item.id} className="relative group rounded-lg overflow-hidden border border-border">
                                     <img src={item.image_url} className="aspect-square object-cover w-full" />
                                     <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                         <Button variant="destructive" size="icon" onClick={() => handleDeletePrompt(item.id)}>
                                             <Trash2 className="w-4 h-4" />
                                         </Button>
                                     </div>
                                     <div className="absolute bottom-0 left-0 w-full bg-black/80 p-2 text-xs truncate text-muted-foreground font-mono">
                                         {item.model_info}
                                     </div>
                                 </div>
                             ))}
                         </div>
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
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Product</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
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
                                            <TableCell className="font-mono text-xs text-muted-foreground">
                                                {new Date(order.created_at).toLocaleDateString()} <br/>
                                                {new Date(order.created_at).toLocaleTimeString()}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div className="bg-muted p-1 rounded-full">
                                                        <User className="w-3 h-3 text-muted-foreground" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium">{order.user_email || "Anon/No Email"}</span>
                                                        {(order.first_name || order.last_name) && (
                                                            <span className="text-xs text-muted-foreground">
                                                                {order.first_name} {order.last_name}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {getProductTitle(order.product_id)}
                                            </TableCell>
                                            <TableCell className="text-neon font-mono">${order.amount}</TableCell>
                                            <TableCell>
                                                <Badge variant={order.status === 'approved' ? 'default' : 'secondary'} className={order.status === 'approved' ? 'bg-green-500 hover:bg-green-600' : ''}>
                                                    {order.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>

            {/* --- AI CONFIG TAB --- */}
            <TabsContent value="settings">
                 <div className="grid lg:grid-cols-2 gap-8">
                    <Card className="border-neon/30 bg-neon/5 lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-neon">
                                <Settings className="w-5 h-5" /> Configuración del Agente IA
                            </CardTitle>
                            <CardDescription>
                                Define la personalidad, restricciones y formato de salida del creador de productos.
                                <br />
                                <strong>ADVERTENCIA:</strong> No borres la estructura JSON del final, o la IA dejará de funcionar.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Textarea 
                                className="font-mono text-sm bg-background/80 min-h-[500px] border-border focus:border-neon"
                                value={aiSystemPrompt}
                                onChange={(e) => setAiSystemPrompt(e.target.value)}
                            />
                            <div className="flex justify-end gap-2">
                                <Button 
                                    variant="outline" 
                                    onClick={() => fetchData()}
                                    className="gap-2"
                                >
                                    <RefreshCw className="w-4 h-4" /> Recargar Original
                                </Button>
                                <Button 
                                    onClick={handleSaveSettings} 
                                    disabled={savingSettings}
                                    className="bg-neon text-black hover:bg-neon/90 gap-2 font-bold"
                                >
                                    {savingSettings ? <Loader2 className="animate-spin w-4 h-4"/> : <Save className="w-4 h-4" />}
                                    GUARDAR CONFIGURACIÓN
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                 </div>
            </TabsContent>
        </Tabs>

      </div>
    </div>
  );
};

export default Admin;