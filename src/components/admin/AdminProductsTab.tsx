import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Loader2, Package, ShoppingBag, FolderKanban, Link as LinkIcon, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AdminAIAssistant } from "@/components/AdminAIAssistant";
import { ProductContentManager } from "@/components/ProductContentManager";
import { Product } from "@/types/admin";

interface AdminProductsTabProps {
  products: Product[];
  onRefresh: () => void;
}

export function AdminProductsTab({ products, onRefresh }: AdminProductsTabProps) {
  const { toast } = useToast();
  
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
    image_type: "chart-line-up",
    gallery_images: []
  });
  const [featuresInput, setFeaturesInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  // Content Manager State
  const [contentManagerOpen, setContentManagerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isGallery = false) => {
    try {
      setUploading(true);
      if (!e.target.files || e.target.files.length === 0) throw new Error('Selecciona una imagen.');

      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `products/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);
      
      if (isGallery) {
          setFormData(prev => ({
              ...prev,
              gallery_images: [...(prev.gallery_images || []), data.publicUrl]
          }));
          toast({ title: "Imagen añadida a la galería" });
      } else {
          setFormData(prev => ({ ...prev, image_url: data.publicUrl }));
          toast({ title: "Imagen principal actualizada" });
      }

    } catch (error: any) {
      toast({ title: "Error al subir imagen", description: error.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const removeGalleryImage = (indexToRemove: number) => {
      setFormData(prev => ({
          ...prev,
          gallery_images: prev.gallery_images?.filter((_, index) => index !== indexToRemove) || []
      }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const featuresArray = featuresInput.split('\n').filter(f => f.trim() !== '');
      
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
      onRefresh();
    } catch (error: any) {
      toast({ title: "Error saving product", description: error.message, variant: "destructive" });
    } finally {
        setLoading(false);
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
        image_type: "chart-line-up",
        gallery_images: []
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
        onRefresh();
    }
  };

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

  return (
    <>
      <ProductContentManager product={selectedProduct} open={contentManagerOpen} onOpenChange={setContentManagerOpen} />
      
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
                        placeholder="ej: plan-1k"
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

                {/* IMAGES SECTION */}
                <div className="border-t border-border pt-4 mt-4">
                    <Label className="mb-2 block font-bold text-neon">Gestión de Imágenes</Label>
                    
                    {/* Main Image */}
                    <div className="mb-4">
                        <Label className="text-xs mb-1 block text-muted-foreground">Imagen Principal</Label>
                        <div className="flex gap-2">
                            <Input 
                                type="file" 
                                accept="image/*" 
                                onChange={(e) => handleImageUpload(e, false)} 
                                disabled={uploading} 
                                className="text-xs" 
                            />
                        </div>
                        {formData.image_url && (
                            <div className="relative mt-2 w-20 h-20 rounded overflow-hidden border border-border">
                                <img src={formData.image_url} className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>

                    {/* Gallery */}
                    <div>
                        <Label className="text-xs mb-1 block text-muted-foreground">Galería Adicional</Label>
                        <Input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => handleImageUpload(e, true)} 
                            disabled={uploading} 
                            className="text-xs mb-2" 
                        />
                        
                        {formData.gallery_images && formData.gallery_images.length > 0 && (
                            <div className="grid grid-cols-3 gap-2 mt-2">
                                {formData.gallery_images.map((img, idx) => (
                                    <div key={idx} className="relative aspect-square rounded overflow-hidden border border-border group">
                                        <img src={img} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Button 
                                                type="button" 
                                                size="icon" 
                                                variant="destructive" 
                                                className="h-6 w-6" 
                                                onClick={() => removeGalleryImage(idx)}
                                            >
                                                <X className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="flex gap-4 pt-4 border-t border-border mt-4">
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
    </>
  );
}