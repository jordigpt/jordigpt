import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Loader2, Heart, Copy, Share2, X, Terminal, Maximize2 } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface GalleryItem {
  id: string;
  image_url: string;
  prompt: string;
  model_info: string;
  likes_count: number;
  created_at: string;
}

const PromptGallery = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('prompt_gallery_items')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error(error);
      toast.error("Error cargando la galería");
    } else {
      setItems(data || []);
    }
    setLoading(false);
  };

  const handleLike = async (e: React.MouseEvent, item: GalleryItem) => {
    e.stopPropagation();
    // Optimistic update
    const newItems = items.map(i => i.id === item.id ? { ...i, likes_count: i.likes_count + 1 } : i);
    setItems(newItems);
    if (selectedItem?.id === item.id) {
        setSelectedItem({ ...selectedItem, likes_count: selectedItem.likes_count + 1 });
    }

    // Call DB
    const { error } = await supabase.rpc('increment_gallery_likes', { row_id: item.id });
    if (error) console.error("Error liking:", error);
  };

  const handleCopyPrompt = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Prompt copiado al portapapeles");
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-neon selection:text-black">
      <Navbar />
      
      {/* Header */}
      <div className="pt-32 pb-12 container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 uppercase">
            Prompt <span className="text-neon">Gallery</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Una colección curada de generaciones de alta calidad. 
            Copiá el prompt, pegalo en tu modelo favorito y creá magia.
        </p>
      </div>

      {/* Gallery Grid */}
      <div className="container mx-auto px-4 pb-24">
        {loading ? (
           <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-neon" />
           </div>
        ) : items.length === 0 ? (
           <div className="text-center py-20 border border-dashed border-border rounded-lg bg-muted/10">
              <Terminal className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Aún no hay prompts en la galería.</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {items.map((item) => (
              <Dialog key={item.id} onOpenChange={(open) => !open && setSelectedItem(null)}>
                <DialogTrigger asChild onClick={() => setSelectedItem(item)}>
                  <div className="group relative aspect-[3/4] overflow-hidden rounded-xl bg-muted cursor-pointer border border-transparent hover:border-neon/50 transition-all shadow-sm hover:shadow-[0_0_20px_rgba(212,232,58,0.15)]">
                    {/* Image */}
                    <img 
                      src={item.image_url} 
                      alt="Generación IA" 
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                      <div className="flex justify-between items-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                         <div className="flex items-center gap-1.5 text-white/90">
                            <Heart className="w-4 h-4 fill-white text-white" />
                            <span className="text-xs font-bold">{item.likes_count}</span>
                         </div>
                         <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border-none text-[10px] uppercase tracking-wider">
                            {item.model_info}
                         </Badge>
                      </div>
                    </div>
                  </div>
                </DialogTrigger>
                
                {/* Modal Content */}
                <DialogContent className="max-w-5xl w-[95vw] h-[85vh] md:h-auto p-0 border-none bg-background/95 backdrop-blur-xl overflow-hidden rounded-2xl shadow-2xl flex flex-col md:flex-row gap-0">
                    <button 
                        className="absolute right-4 top-4 z-50 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 md:hidden"
                        onClick={(e) => {
                            // close dialog logic is handled by DialogClose inside usually, 
                            // but here we are inside content. We need to rely on Radix default close or this button.
                        }}
                    >
                       <DialogClose><X className="w-5 h-5" /></DialogClose>
                    </button>

                    {/* Left: Image (Full height) */}
                    <div className="relative w-full md:w-[60%] h-[40vh] md:h-[80vh] bg-black flex items-center justify-center overflow-hidden">
                        <img 
                           src={item.image_url} 
                           alt="Full view" 
                           className="w-full h-full object-contain"
                        />
                        <div className="absolute bottom-4 left-4 md:hidden">
                            <Button 
                                size="sm" 
                                variant="secondary" 
                                className="bg-white/10 backdrop-blur-md text-white hover:bg-white/20 border-none gap-2"
                                onClick={(e) => handleLike(e, item)}
                            >
                                <Heart className="w-4 h-4" /> {item.likes_count}
                            </Button>
                        </div>
                    </div>

                    {/* Right: Details */}
                    <div className="flex-1 flex flex-col h-[60vh] md:h-[80vh] border-l border-border/10">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-border flex justify-between items-start">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon to-yellow-500 flex items-center justify-center text-black font-bold">
                                 JG
                              </div>
                              <div>
                                 <h3 className="font-bold text-sm">JordiGPT</h3>
                                 <p className="text-xs text-muted-foreground">Admin Author</p>
                              </div>
                           </div>
                           <DialogClose className="hidden md:block text-muted-foreground hover:text-foreground">
                              <X className="w-6 h-6" />
                           </DialogClose>
                        </div>

                        {/* Scrollable Content */}
                        <ScrollArea className="flex-1 p-6">
                           <div className="space-y-6">
                              {/* Prompt Section */}
                              <div className="space-y-3">
                                 <div className="flex items-center justify-between">
                                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                        <Terminal className="w-3 h-3" /> Prompt
                                    </h4>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="h-7 text-xs gap-1.5 hover:bg-neon hover:text-black border-border"
                                        onClick={() => handleCopyPrompt(item.prompt)}
                                    >
                                        <Copy className="w-3 h-3" /> Copy
                                    </Button>
                                 </div>
                                 <div className="bg-muted/30 p-4 rounded-lg border border-border/50 text-sm leading-relaxed font-mono text-foreground/90 break-words whitespace-pre-wrap">
                                     {item.prompt}
                                 </div>
                              </div>

                              {/* Info Section */}
                              <div className="space-y-4">
                                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Información</h4>
                                  <div className="grid grid-cols-2 gap-4">
                                      <div className="bg-muted/10 p-3 rounded border border-border/30">
                                          <p className="text-xs text-muted-foreground mb-1">Modelo</p>
                                          <p className="text-sm font-medium">{item.model_info}</p>
                                      </div>
                                      <div className="bg-muted/10 p-3 rounded border border-border/30">
                                          <p className="text-xs text-muted-foreground mb-1">Fecha</p>
                                          <p className="text-sm font-medium">{new Date(item.created_at).toLocaleDateString()}</p>
                                      </div>
                                      <div className="bg-muted/10 p-3 rounded border border-border/30">
                                          <p className="text-xs text-muted-foreground mb-1">Dimensiones</p>
                                          <p className="text-sm font-medium">Variable</p>
                                      </div>
                                      <div className="bg-muted/10 p-3 rounded border border-border/30">
                                          <p className="text-xs text-muted-foreground mb-1">Calidad</p>
                                          <p className="text-sm font-medium">Upscaled</p>
                                      </div>
                                  </div>
                              </div>
                           </div>
                        </ScrollArea>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-border bg-muted/5 mt-auto">
                            <Button 
                                className="w-full bg-neon text-black hover:bg-neon/90 font-bold"
                                onClick={() => handleCopyPrompt(item.prompt)}
                            >
                                <Copy className="mr-2 h-4 w-4" /> COPIAR PROMPT
                            </Button>
                            <div className="flex justify-center mt-4">
                                <Button 
                                    variant="ghost" 
                                    className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10 gap-2 transition-colors"
                                    onClick={(e) => handleLike(e, item)}
                                >
                                    <Heart className={`w-5 h-5 ${item.likes_count > 0 ? "fill-current" : ""}`} /> 
                                    <span className="text-sm font-medium">{item.likes_count} likes</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default PromptGallery;