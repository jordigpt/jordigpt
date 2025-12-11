import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Mic, MicOff, Wand2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AdminAIAssistantProps {
  onGenerate: (data: any) => void;
}

export function AdminAIAssistant({ onGenerate }: AdminAIAssistantProps) {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      // @ts-ignore
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'es-ES'; // Default to Spanish

      recognitionInstance.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        if (finalTranscript) {
            setPrompt(prev => prev + " " + finalTranscript);
        }
      };

      recognitionInstance.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
        toast.error("Error con el micrófono. Intenta escribir.");
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  const toggleListening = () => {
    if (!recognition) {
      toast.error("Tu navegador no soporta dictado por voz.");
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
      toast.info("Escuchando... (Hablale a JordiGPT)");
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-product-copy', {
        body: { prompt }
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      // Pass data back to parent
      onGenerate(data);
      toast.success("¡Magia realizada! Formulario completado.");
      setOpen(false);
      setPrompt(""); // Reset
      
    } catch (error: any) {
      console.error(error);
      toast.error("Error generando copy: " + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
            variant="outline" 
            className="border-neon/50 text-neon hover:bg-neon hover:text-black gap-2 transition-all shadow-[0_0_10px_rgba(212,232,58,0.1)] hover:shadow-[0_0_20px_rgba(212,232,58,0.4)]"
        >
          <Sparkles className="w-4 h-4" /> 
          <span>ASISTENTE IA</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] border-neon/20 bg-black/95 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Wand2 className="w-6 h-6 text-neon" />
            <span>JORDI-GPT Auto-Creator</span>
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Dictale o escribile tu idea. El agente creará el título, copy persuasivo, precio y características automáticamente.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="relative">
            <Textarea
              id="prompt"
              placeholder="Ej: Quiero vender un pack de prompts para arquitectos que les ahorre tiempo en Midjourney. Que sea caro, premium..."
              className="h-40 pr-12 bg-gray-900 border-gray-700 focus:border-neon resize-none text-base"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <Button
              size="icon"
              variant="ghost"
              onClick={toggleListening}
              className={`absolute bottom-2 right-2 transition-all duration-300 ${
                isListening 
                  ? "bg-red-500/20 text-red-500 hover:bg-red-500/30 animate-pulse" 
                  : "text-gray-400 hover:text-neon"
              }`}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </Button>
          </div>
          
          {isListening && (
            <p className="text-xs text-neon animate-pulse text-center">
              ● Escuchando... (Pausa para terminar)
            </p>
          )}
        </div>

        <DialogFooter>
          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating || !prompt.trim()}
            className="w-full bg-neon text-black font-bold hover:bg-neon/80"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creando Copy Persuasivo...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                GENERAR PRODUCTO
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}