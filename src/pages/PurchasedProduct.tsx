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

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    
    // Si ya es un embed, devolver tal cual
    if (url.includes('/embed/')) return url;

    // YouTube regex para detectar ID
    const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^#&?]*)/);
    if (ytMatch && ytMatch[1]) {
      return `https://www.youtube.com/embed/${ytMatch[1]}`;
    }

    // Vimeo regex simple
    if (url.includes('vimeo.com')) {
       const vimeoId = url.split('/').pop();
       // Si no es numérico, puede ser un link de evento, pero asumimos video standard
       if (vimeoId && !isNaN(Number(vimeoId))) {
           return `https://player.vimeo.com/video/${vimeoId}`;
       }
    }

    return url; 
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
          <div className="aspect-video bg-black rounded-lg overflow-hidden border border-border">
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
            <Button variant="outline" className="w-full justify-start h-14 text-base hover:border-neon/50 group transition-all">
              <div className="bg-muted p-2 rounded mr-4 group-hover:bg-neon/20 group-hover:text-neon transition-colors">
                 <Download className="h-5 w-5" /> 
              </div>
              {item.title}
            </Button>
          </a>
        );
      case 'text':
        return (
            <div className="prose prose-invert max-w-none rounded-lg border border-border bg-card p-6 shadow-sm" dangerouslySetInnerHTML={{ __html: item.content_text || '' }} />
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
        
        <h1 className="text-4xl md:text-5xl font-bold mb-4 uppercase tracking-tight">{product?.title}</h1>
        <p className="text-lg text-muted-foreground mb-12 border-b border-border pb-8">
            Accede a todo el contenido de tu producto a continuación.
        </p>

        {content.length > 0 ? (
          <div className="space-y-12">
            {content.map((item, index) => (
              <div key={item.id} className="scroll-mt-32">
                <div className="flex items-center gap-4 mb-4">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-xs font-bold text-muted-foreground">
                        {index + 1}
                    </span>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        {item.title}
                    </h2>
                </div>
                <div className="pl-12">
                    {renderContentItem(item)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-12 border border-dashed rounded-lg bg-muted/5">Aún no hay contenido disponible para este producto.</p>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default PurchasedProduct;
</dyad-file>

### 3. Implementar Drag & Drop en el Admin

Ahora modifico el `ProductContentManager.tsx`. Voy a:
1.  Importar los componentes de `dnd-kit`.
2.  Crear un componente `SortableItem` para cada fila de contenido.
3.  Agregar la lógica para guardar el nuevo orden en Supabase cuando sueltes el ítem.

<dyad-write path="src/components/ProductContentManager.tsx" description="Implementing Drag and Drop functionality for reordering content items using dnd-kit.">
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Loader2, Plus, Trash2, Video, FileText, Link as LinkIcon, AlertCircle, GripVertical } from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

// DND Kit Imports
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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
  sort_order: number;
}

interface ProductContentManagerProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// --- Sortable Item Component ---
interface SortableItemProps {
  item: ProductContent;
  index: number;
  onDelete: (item: ProductContent) => void;
  loading: boolean;
}

const SortableItem = ({ item, index, onDelete, loading }: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  const getDisplayInfo = (item: ProductContent) => {
      if (item.content_type === 'text') return '(Contenido de texto/HTML)';
      if (!item.content_url) return '';
      try {
          if (item.content_type === 'file') {
              const parts = item.content_url.split('/');
              const fileNameWithTimestamp = parts[parts.length - 1];
              const cleanName = fileNameWithTimestamp.replace(/^\d+-/, '');
              return decodeURIComponent(cleanName);
          }
          return item.content_url;
      } catch {
          return item.content_url;
      }
  };

  return (
    <div 
        ref={setNodeRef} 
        style={style}
        className="group flex items-center gap-3 p-3 bg-card border border-border rounded-xl shadow-sm hover:shadow-md hover:border-neon/30 transition-all w-full select-none"
    >
        {/* Drag Handle */}
        <div 
            {...attributes} 
            {...listeners} 
            className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground p-1"
        >
            <GripVertical className="w-5 h-5" />
        </div>

        {/* Left side: Icon + Text Content */}
        <div className="flex items-center gap-3 flex-1 min-w-0 overflow-hidden">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0 border border-border group-hover:bg-neon/10 group-hover:text-neon transition-colors">
                {item.content_type === 'file' && <FileText className="h-5 w-5" />}
                {item.content_type === 'video' && <Video className="h-5 w-5" />}
                {item.content_type === 'text' && <FileText className="h-5 w-5" />}
            </div>

            <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-[10px] h-4 px-1 rounded-sm uppercase shrink-0">
                        {index + 1}
                    </Badge>
                    <h4 className="font-bold text-sm truncate" title={item.title}>
                        {item.title}
                    </h4>
                </div>
                <p className="text-xs text-muted-foreground truncate font-mono opacity-70 block w-full" title={item.content_url || ''}>
                    {getDisplayInfo(item)}
                </p>
            </div>
        </div>

        {/* Actions */}
        <div className="shrink-0 flex items-center pl-2 border-l border-border ml-2">
            <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                onClick={() => onDelete(item)}
                disabled={loading}
                title="Eliminar contenido"
            >
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    </div>
  );
};

// --- Main Component ---

export const ProductContentManager = ({ product, open, onOpenChange }: ProductContentManagerProps) => {
  const [content, setContent] = useState<ProductContent[]>([]);
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [newContent, setNewContent] = useState({
    content_type: 'file' as 'file' | 'video' | 'text',
    title: '',
    content_url: '',
    content_text: ''
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (product) {
      fetchContent();
    }
  }, [product]);

  const fetchContent = async () => {
    if (!product) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('product_content')
      .select('*')
      .eq('product_id', product.id)
      .order('sort_order', { ascending: true });
    
    if (error) {
      toast.error("Error fetching content: " + error.message);
    } else {
      setContent(data || []);
    }
    setLoading(false);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setContent((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        const newItems = arrayMove(items, oldIndex, newIndex);
        
        // Update sort_order in database for all affected items
        // We use a simplified approach: update everyone's index based on new array order
        const updates = newItems.map((item, index) => ({
            id: item.id,
            sort_order: index
        }));
        
        // Optimistic update done, now sync DB
        syncSortOrder(updates);

        return newItems;
      });
    }
  };

  const syncSortOrder = async (updates: {id: string, sort_order: number}[]) => {
      // We process updates in parallel
      const promises = updates.map(u => 
          supabase.from('product_content').update({ sort_order: u.sort_order }).eq('id', u.id)
      );
      
      try {
          await Promise.all(promises);
      } catch (e) {
          console.error("Error reordering items", e);
          toast.error("Error guardando el orden.");
      }
  };

  const handleAddContent = async () => {
    if (!product || !newContent.title) {
      toast.error("El título es requerido.");
      return;
    }
    
    setLoading(true);
    // New item goes to the end
    const sort_order = content.length;

    const { error } = await supabase
      .from('product_content')
      .insert({
        product_id: product.id,
        sort_order: sort_order,
        ...newContent
      });
    
    if (error) {
      toast.error("Error adding content: " + error.message);
    } else {
      toast.success("Contenido agregado correctamente!");
      setNewContent({ 
        content_type: 'file', 
        title: '', 
        content_url: '', 
        content_text: '' 
      });
      fetchContent();
    }
    setLoading(false);
  };

  const handleDeleteContent = async (contentItem: ProductContent) => {
    if (!confirm("¿Estás seguro? Esto eliminará permanentemente este contenido.")) return;
    
    setLoading(true);
    
    try {
      if (contentItem.content_type === 'file' && contentItem.content_url) {
        try {
            const url = new URL(contentItem.content_url);
            const pathParts = url.pathname.split('/');
            const bucketIndex = pathParts.indexOf('product-images');
            if (bucketIndex !== -1) {
                const filePath = pathParts.slice(bucketIndex + 1).join('/');
                await supabase.storage.from('product-images').remove([filePath]);
            }
        } catch (e) {
            console.error("Error parsing URL for deletion", e);
        }
      }
      
      const { error: dbError } = await supabase
        .from('product_content')
        .delete()
        .eq('id', contentItem.id);
      
      if (dbError) throw dbError;
      
      toast.success("Contenido eliminado.");
      fetchContent();
    } catch (error: any) {
      toast.error("Error al eliminar: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploading(true);
    const file = e.target.files[0];
    
    const sanitizedFileName = file.name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9.-]/g, '');
    
    const filePath = `deliverables/${product?.id}/${Date.now()}-${sanitizedFileName}`;
    
    const { error } = await supabase.storage
      .from('product-images')
      .upload(filePath, file);
    
    if (error) {
      toast.error("Upload failed: " + error.message);
    } else {
      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);
      
      setNewContent(prev => ({
        ...prev,
        content_url: urlData.publicUrl
      }));
      toast.success("Archivo subido correctamente!");
    }
    setIsUploading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl h-[85vh] flex flex-col p-0 gap-0 bg-background border-border overflow-hidden">
        <DialogHeader className="p-6 border-b border-border bg-muted/10 shrink-0">
          <DialogTitle className="flex items-center gap-2 text-xl">
             Gestor de Contenido: <span className="text-neon">{product?.title}</span>
          </DialogTitle>
          <DialogDescription>
            Agrega y reordena (arrastrando) archivos, videos o texto.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden h-full">
          {/* Add New Content Form - Left Panel */}
          <div className="w-full md:w-1/3 p-6 border-r border-border bg-card overflow-y-auto shrink-0 z-10">
            <h3 className="font-bold mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4 text-neon" /> Nuevo Contenido
            </h3>
            <div className="space-y-4">
                <div>
                <Label>Tipo de Contenido</Label>
                <Select 
                    value={newContent.content_type} 
                    onValueChange={(v) => setNewContent(p => ({ ...p, content_type: v as any }))}
                >
                    <SelectTrigger className="bg-background/50">
                    <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="file">Archivo Descargable</SelectItem>
                    <SelectItem value="video">Video Embed (YouTube/Vimeo)</SelectItem>
                    <SelectItem value="text">Texto / HTML / Links</SelectItem>
                    </SelectContent>
                </Select>
                </div>
                <div>
                <Label>Título</Label>
                <Input 
                    value={newContent.title} 
                    onChange={e => setNewContent(p => ({ ...p, title: e.target.value }))}
                    placeholder="Ej: Módulo 1..."
                    className="bg-background/50"
                />
                </div>

                {newContent.content_type === 'file' && (
                <div className="p-4 border border-dashed border-border rounded-lg bg-muted/20">
                    <Label className="mb-2 block">Subir Archivo</Label>
                    <Input 
                        type="file" 
                        onChange={handleFileUpload} 
                        disabled={isUploading}
                        className="cursor-pointer text-xs"
                    />
                    {isUploading && (
                        <div className="flex items-center gap-2 mt-2 text-xs text-neon animate-pulse">
                            <Loader2 className="w-3 h-3 animate-spin" /> Subiendo archivo...
                        </div>
                    )}
                    {newContent.content_url && !isUploading && (
                        <div className="mt-2 text-xs text-green-500 flex items-center gap-1 font-medium bg-green-500/10 p-2 rounded break-all">
                            <LinkIcon className="w-3 h-3 shrink-0" /> Archivo listo
                        </div>
                    )}
                </div>
                )}

                {newContent.content_type === 'video' && (
                <div>
                    <Label>URL del Video</Label>
                    <Input 
                    placeholder="youtube.com/watch?v=..." 
                    value={newContent.content_url} 
                    onChange={e => setNewContent(p => ({ ...p, content_url: e.target.value }))}
                    className="bg-background/50"
                    />
                    <p className="text-[10px] text-muted-foreground mt-1">Soporta enlaces normales de YouTube y Vimeo.</p>
                </div>
                )}

                {newContent.content_type === 'text' && (
                <div>
                    <Label>Contenido (HTML)</Label>
                    <Textarea 
                    className="h-32 bg-background/50 font-mono text-xs" 
                    value={newContent.content_text} 
                    onChange={e => setNewContent(p => ({ ...p, content_text: e.target.value }))}
                    placeholder="<p>Texto...</p>"
                    />
                </div>
                )}

                <Button 
                onClick={handleAddContent} 
                disabled={loading || isUploading}
                className="w-full bg-neon text-black font-bold hover:bg-neon/90 mt-4"
                >
                {loading ? <Loader2 className="animate-spin" /> : "AGREGAR AL PRODUCTO"}
                </Button>
            </div>
          </div>
          
          {/* List - Right Panel */}
          <div className="flex-1 bg-muted/5 flex flex-col overflow-hidden w-full md:w-2/3">
             <div className="p-6 border-b border-border shrink-0 flex justify-between items-center">
                <h3 className="font-bold">Contenido y Orden</h3>
                <Badge variant="outline">{content.length} items</Badge>
             </div>
             
             <ScrollArea className="flex-1 p-6 h-full w-full">
                {content.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-border rounded-lg p-12 min-h-[200px]">
                        <AlertCircle className="w-10 h-10 mb-4 opacity-50" />
                        <p>Este producto aún no tiene contenido.</p>
                    </div>
                ) : (
                    <DndContext 
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext 
                            items={content.map(c => c.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="space-y-3 pb-12">
                                {content.map((item, index) => (
                                    <SortableItem 
                                        key={item.id} 
                                        item={item} 
                                        index={index}
                                        onDelete={handleDeleteContent}
                                        loading={loading}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                )}
             </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};