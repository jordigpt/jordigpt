import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Loader2, Plus, Trash2, Upload, Video, FileText, Link as LinkIcon, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

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

  const handleAddContent = async () => {
    if (!product || !newContent.title) {
      toast.error("El título es requerido.");
      return;
    }
    
    setLoading(true);
    const { error } = await supabase
      .from('product_content')
      .insert({
        product_id: product.id,
        sort_order: content.length,
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
      // If it's a file, try to delete from storage
      if (contentItem.content_type === 'file' && contentItem.content_url) {
        try {
            const url = new URL(contentItem.content_url);
            const pathParts = url.pathname.split('/');
            // Supabase storage URLs usually look like /storage/v1/object/public/{bucket_name}/{path}
            // We search for the bucket name to know where the path starts
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
    
    // Sanitize filename
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
            Agrega archivos descargables, videos o texto para los compradores.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden h-full">
          {/* Add New Content Form - Left Panel */}
          <div className="w-full md:w-1/3 p-6 border-r border-border bg-card overflow-y-auto shrink-0">
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
                <Label>Título (Visible para el usuario)</Label>
                <Input 
                    value={newContent.title} 
                    onChange={e => setNewContent(p => ({ ...p, title: e.target.value }))}
                    placeholder="Ej: Guía PDF, Video Módulo 1..."
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
                    <Label>URL del Video (Embed)</Label>
                    <Input 
                    placeholder="https://www.youtube.com/embed/..." 
                    value={newContent.content_url} 
                    onChange={e => setNewContent(p => ({ ...p, content_url: e.target.value }))}
                    className="bg-background/50"
                    />
                </div>
                )}

                {newContent.content_type === 'text' && (
                <div>
                    <Label>Contenido (Soporta HTML)</Label>
                    <Textarea 
                    className="h-32 bg-background/50 font-mono text-xs" 
                    value={newContent.content_text} 
                    onChange={e => setNewContent(p => ({ ...p, content_text: e.target.value }))}
                    placeholder="<p>Texto de instrucciones...</p>"
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
          
          {/* Existing Content List - Right Panel */}
          <div className="flex-1 bg-muted/5 flex flex-col overflow-hidden w-full md:w-2/3">
             <div className="p-6 border-b border-border shrink-0">
                <h3 className="font-bold flex items-center justify-between">
                    <span>Contenido Existente</span>
                    <Badge variant="outline">{content.length} items</Badge>
                </h3>
             </div>
             
             <ScrollArea className="flex-1 p-6 h-full w-full">
                {content.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-border rounded-lg p-12 min-h-[200px]">
                    <AlertCircle className="w-10 h-10 mb-4 opacity-50" />
                    <p>Este producto aún no tiene contenido.</p>
                </div>
                ) : (
                <div className="space-y-3 pb-12">
                    {content.map((item, index) => (
                    <div 
                        key={item.id} 
                        className="group flex items-center gap-3 p-4 bg-card border border-border rounded-xl shadow-sm hover:shadow-md hover:border-neon/30 transition-all relative overflow-hidden w-full"
                    >
                        {/* Icon Container */}
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0 border border-border group-hover:bg-neon/10 group-hover:text-neon transition-colors">
                            {item.content_type === 'file' && <FileText className="h-5 w-5" />}
                            {item.content_type === 'video' && <Video className="h-5 w-5" />}
                            {item.content_type === 'text' && <FileText className="h-5 w-5" />}
                        </div>

                        {/* Text Content - min-w-0 ensures truncation works */}
                        <div className="flex-1 min-w-0 pr-2">
                            <div className="flex items-center gap-2 mb-0.5">
                                <Badge variant="secondary" className="text-[10px] h-4 px-1 rounded-sm uppercase shrink-0">
                                    {index + 1}
                                </Badge>
                                <h4 className="font-bold text-sm truncate" title={item.title}>
                                    {item.title}
                                </h4>
                            </div>
                            <p className="text-xs text-muted-foreground truncate font-mono opacity-70 block w-full" title={item.content_url || 'Texto'}>
                                {item.content_type === 'text' ? '(Contenido de texto)' : item.content_url}
                            </p>
                        </div>

                        {/* Actions - Fixed width ensuring it's never covered */}
                        <div className="shrink-0 flex items-center pl-2 border-l border-border">
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-9 w-9 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors z-10"
                                onClick={() => handleDeleteContent(item)}
                                disabled={loading}
                                title="Eliminar contenido"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    ))}
                </div>
                )}
             </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};