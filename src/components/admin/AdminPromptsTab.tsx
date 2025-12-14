import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Loader2, Upload, Sparkles } from "lucide-react";
import { PromptItem } from "@/types/admin";

export function AdminPromptsTab() {
  const [promptItems, setPromptItems] = useState<PromptItem[]>([]);
  const [promptForm, setPromptForm] = useState({
      image_url: "",
      prompt: "",
      model_info: "NanoBanana PRO"
  });
  const [promptUploading, setPromptUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    const { data: promptsData, error: promptsError } = await supabase
        .from('prompt_gallery_items')
        .select('*')
        .order('created_at', { ascending: false });
    
    if (!promptsError) setPromptItems(promptsData || []);
  };

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
        fetchPrompts();
    }
  };

  const handleDeletePrompt = async (id: string) => {
      if(!confirm("Borrar este prompt?")) return;
      const { error } = await supabase.from('prompt_gallery_items').delete().eq('id', id);
      if(!error) {
          toast({ title: "Borrado" });
          fetchPrompts();
      }
  };

  return (
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
  );
}