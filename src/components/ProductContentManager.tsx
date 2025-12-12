import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Loader2, Plus, Trash2, Upload, Video, FileText, GripVertical } from "lucide-react";
import { toast } from "sonner";

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
      toast.error("Title is required.");
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
      toast.success("Content added!");
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
    if (!confirm("Are you sure? This will permanently delete this content.")) return;
    
    setLoading(true);
    
    try {
      // If it's a file, delete it from storage first
      if (contentItem.content_type === 'file' && contentItem.content_url) {
        // Extract the file path from the URL
        const url = new URL(contentItem.content_url);
        const pathParts = url.pathname.split('/');
        const storageIndex = pathParts.indexOf('product-images');
        
        if (storageIndex !== -1) {
          const filePath = pathParts.slice(storageIndex).join('/');
          
          const { error: storageError } = await supabase
            .storage
            .from('product-images')
            .remove([filePath]);
          
          if (storageError) {
            console.error("Error deleting file from storage:", storageError);
            // We continue anyway to delete the database record
          }
        }
      }
      
      // Delete the database record
      const { error: dbError } = await supabase
        .from('product_content')
        .delete()
        .eq('id', contentItem.id);
      
      if (dbError) {
        throw dbError;
      }
      
      toast.success("Content deleted successfully.");
      fetchContent();
    } catch (error: any) {
      toast.error("Error deleting content: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploading(true);
    const file = e.target.files[0];
    
    // Sanitize the filename to prevent "Invalid key" errors
    const sanitizedFileName = file.name
      .normalize("NFD") // Decompose accented characters
      .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/[^a-zA-Z0-9.-]/g, ''); // Remove remaining special characters
    
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
      toast.success("File uploaded!");
    }
    setIsUploading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Content for "{product?.title}"</DialogTitle>
          <DialogDescription>
            Add, remove, and reorder the deliverables for this product.
          </DialogDescription>
        </DialogHeader>
        <div className="grid md:grid-cols-2 gap-8 py-4">
          {/* Add New Content Form */}
          <div className="space-y-4 p-4 border rounded-lg sticky top-0 bg-background">
            <h3 className="font-bold">Add New Content</h3>
            <div>
              <Label>Content Type</Label>
              <Select 
                value={newContent.content_type} 
                onValueChange={(v) => setNewContent(p => ({
                  ...p, 
                  content_type: v as any
                }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="file">File Download</SelectItem>
                  <SelectItem value="video">Video Embed</SelectItem>
                  <SelectItem value="text">Text / HTML</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Title</Label>
              <Input 
                value={newContent.title} 
                onChange={e => setNewContent(p => ({
                  ...p, 
                  title: e.target.value
                }))}
              />
            </div>
            {newContent.content_type === 'file' && (
              <div>
                <Label>Upload File</Label>
                <Input 
                  type="file" 
                  onChange={handleFileUpload} 
                  disabled={isUploading}
                />
                {isUploading && <Loader2 className="animate-spin mt-2" />}
                {newContent.content_url && (
                  <p className="text-xs mt-2 text-muted-foreground truncate">
                    URL: {newContent.content_url}
                  </p>
                )}
              </div>
            )}
            {newContent.content_type === 'video' && (
              <div>
                <Label>Video Embed URL</Label>
                <Input 
                  placeholder="e.g., https://www.youtube.com/embed/..." 
                  value={newContent.content_url} 
                  onChange={e => setNewContent(p => ({
                    ...p, 
                    content_url: e.target.value
                  }))}
                />
              </div>
            )}
            {newContent.content_type === 'text' && (
              <div>
                <Label>Content (HTML supported)</Label>
                <Textarea 
                  className="h-32" 
                  value={newContent.content_text} 
                  onChange={e => setNewContent(p => ({
                    ...p, 
                    content_text: e.target.value
                  }))}
                />
              </div>
            )}
            <Button 
              onClick={handleAddContent} 
              disabled={loading || isUploading}
              className="w-full"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" /> Add Content
                </>
              )}
            </Button>
          </div>
          
          {/* Existing Content List */}
          <div className="space-y-4">
            <h3 className="font-bold">Existing Content</h3>
            {content.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">
                No content yet.
              </p>
            ) : (
              content.map(item => (
                <div 
                  key={item.id} 
                  className="flex items-center gap-4 p-3 border rounded-lg bg-muted/30"
                >
                  <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                  {item.content_type === 'file' && <Upload className="h-5 w-5 text-muted-foreground" />}
                  {item.content_type === 'video' && <Video className="h-5 w-5 text-muted-foreground" />}
                  {item.content_type === 'text' && <FileText className="h-5 w-5 text-muted-foreground" />}
                  <div className="flex-1">
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-xs">
                      {item.content_url || "Text Content"}
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDeleteContent(item)}
                    disabled={loading}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};