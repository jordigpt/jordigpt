import { CheckCircle2 } from "lucide-react";

export const AuthorityBanner = () => {
  return (
    <section className="border-y border-border bg-muted/30 py-8 overflow-hidden">
      <div className="container mx-auto px-4 flex flex-wrap justify-center gap-x-8 gap-y-4 items-center text-muted-foreground font-mono text-sm uppercase tracking-widest text-center">
        <span className="flex items-center gap-2"><CheckCircle2 className="text-neon w-4 h-4"/> 100% probado en negocios reales</span>
        <span className="flex items-center gap-2"><CheckCircle2 className="text-neon w-4 h-4"/> Resultados medibles</span>
        <span className="flex items-center gap-2"><CheckCircle2 className="text-neon w-4 h-4"/> Acceso inmediato</span>
      </div>
    </section>
  );
};