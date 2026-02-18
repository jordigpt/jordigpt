import { CheckCircle2, XCircle } from "lucide-react";

export const ComparisonSection = () => {
  return (
    <section className="py-24 bg-background border-t border-border">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">¿POR QUÉ <span className="text-neon">MIS SISTEMAS</span>?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            La mayoría vende promesas. Yo te vendo los sistemas que uso para facturar.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
          {/* The Old Way */}
          <div className="p-8 border border-border bg-muted/20 rounded-lg flex flex-col">
             <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
               <XCircle className="text-red-500 w-5 h-5" /> MÉTODOS VIEJOS
             </h3>
             <ul className="space-y-4 text-muted-foreground flex-1 text-base">
               <li className="flex gap-3 items-start"><span className="text-red-500 mt-1 font-bold">✕</span> <span>Pagar Ads sin validar oferta.</span></li>
               <li className="flex gap-3 items-start"><span className="text-red-500 mt-1 font-bold">✕</span> <span>Crear contenido manualmente 24/7.</span></li>
               <li className="flex gap-3 items-start"><span className="text-red-500 mt-1 font-bold">✕</span> <span>Suscripciones mensuales que joden el cash flow.</span></li>
             </ul>
          </div>

          {/* The New Way */}
          <div className="p-8 border border-neon/30 bg-neon/5 rounded-lg shadow-[0_0_50px_rgba(212,232,58,0.05)] flex flex-col">
             <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
               <CheckCircle2 className="text-neon w-5 h-5" /> JORDIGPT WAY
             </h3>
             <ul className="space-y-4 text-foreground/90 flex-1 text-base">
               <li className="flex gap-3 items-start"><span className="text-neon mt-1 font-bold">✓</span> <span>Tráfico orgánico + IA.</span></li>
               <li className="flex gap-3 items-start"><span className="text-neon mt-1 font-bold">✓</span> <span>Automatizaciones Costo Cero.</span></li>
               <li className="flex gap-3 items-start"><span className="text-neon mt-1 font-bold">✓</span> <span>Pago único y acceso de por vida.</span></li>
             </ul>
          </div>
        </div>
      </div>
    </section>
  );
};