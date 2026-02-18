import { ArrowRight, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PillButton } from "@/components/PillButton";

export const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-neon opacity-20 blur-[100px]"></div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon/10 border border-neon/20 text-neon text-xs font-bold tracking-wider mb-8 uppercase animate-fade-in">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-neon"></span>
          </span>
          LA ERA DE LA IA YA ARRANCÓ · APROVECHALA
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 leading-tight">
          FACTURÁ <span className="text-neon">CON IA</span>
          <br />
          <span className="text-3xl md:text-6xl text-muted-foreground">MIENTRAS OTROS DUDAN</span>
        </h1>
        
        <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
          Guías y sistemas IA probados para que tus ideas y habilidades se vuelvan ingresos reales.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <a href="#products">
            <PillButton>
              <span className="flex items-center justify-center">
                RECURSOS GRATUITOS
                <ArrowRight className="ml-3 h-5 w-5" />
              </span>
            </PillButton>
          </a>
          
          <a 
            href="https://www.skool.com/jordigpt/about" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full md:w-auto"
          >
            <Button 
              variant="outline" 
              className="w-full md:w-auto h-[58px] rounded-full px-8 border-neon/30 text-neon hover:bg-neon hover:text-black font-bold tracking-wide uppercase text-sm transition-all shadow-[0_0_15px_rgba(212,232,58,0.05)] hover:shadow-[0_0_25px_rgba(212,232,58,0.3)] bg-black/50 backdrop-blur-sm"
            >
              <Users className="mr-2 h-5 w-5" />
              COMUNIDAD SKOOL
            </Button>
          </a>
        </div>
        
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          <span className="bg-muted/50 text-muted-foreground px-2 py-1 rounded text-[10px] border border-border">Procesos paso a paso</span>
          <span className="bg-muted/50 text-muted-foreground px-2 py-1 rounded text-[10px] border border-border">Actualizado 2026</span>
        </div>
      </div>
    </section>
  );
};