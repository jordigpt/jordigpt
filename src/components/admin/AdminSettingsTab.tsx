import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Settings, Save, Loader2, RefreshCw } from "lucide-react";

export function AdminSettingsTab() {
  const [aiSystemPrompt, setAiSystemPrompt] = useState("");
  const [savingSettings, setSavingSettings] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data: settingsData } = await supabase
        .from('admin_settings')
        .select('value')
        .eq('key', 'ai_system_prompt')
        .single();
    
    if (settingsData) setAiSystemPrompt(settingsData.value);
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

  return (
     <div className="grid lg:grid-cols-2 gap-8">
        <Card className="border-neon/30 bg-neon/5 lg:col-span-2">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-neon">
                    <Settings className="w-5 h-5" /> Configuración del Agente IA
                </CardTitle>
                <CardDescription>
                    Define la personalidad, restricciones y formato de salida del creador de productos.
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
                        onClick={() => fetchSettings()}
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
  );
}