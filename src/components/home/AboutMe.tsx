export const AboutMe = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4">
         <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            
            {/* Image Side */}
            <div className="relative order-2 md:order-1 group">
               <div className="absolute inset-0 bg-neon blur-[80px] opacity-20 rounded-full group-hover:opacity-30 transition-opacity duration-700"></div>
               <div className="relative aspect-[4/5] md:aspect-square w-full max-w-md mx-auto rounded-2xl overflow-hidden border border-border shadow-2xl bg-muted/20">
                  <img 
                    src="/jordi-profile.png" 
                    alt="Jordi" 
                    className="w-full h-full object-cover transition-all duration-700 transform group-hover:scale-105" 
                  />
               </div>
               {/* Decorativo */}
               <div className="absolute -bottom-6 -right-6 bg-background border border-border p-4 rounded-lg shadow-xl hidden md:block z-10">
                  <p className="text-neon font-bold text-xl font-mono">Excelencia</p>
                  <p className="text--[10px] text-muted-foreground uppercase tracking-widest">Operativa</p>
               </div>
            </div>

            {/* Text Side */}
            <div className="order-1 md:order-2 space-y-6">
               <div className="inline-block">
                  <h2 className="text-3xl md:text-5xl font-bold tracking-tighter uppercase mb-2">
                     No soy un <br/> <span className="text-neon">Gurú de la IA.</span>
                  </h2>
                  <div className="h-1 w-20 bg-neon"></div>
               </div>
               
               <div className="prose prose-invert text-muted-foreground text-lg leading-relaxed">
                  <p>
                     Soy Jordi, y al igual que vos, me cansé de ver cómo la tecnología avanzaba mientras mis ingresos se quedaban estancados.
                  </p>
                  <p>
                     No te voy a vender humo ni promesas de millonario de la noche a la mañana. Lo que vas a encontrar acá son <strong>los mismos sistemas exactos</strong> que desarrollé para automatizar mi propio trabajo y multiplicar mi facturación sin clonarme a mí mismo.
                  </p>
                  <p>
                     Mi obsesión es simple: <span className="text-foreground font-medium">Transformar complejidad técnica en dinero real en tu cuenta.</span> Si estás listo para dejar de jugar con ChatGPT y empezar a construir activos digitales serios, estás en el lugar correcto.
                  </p>
               </div>
            </div>

         </div>
      </div>
    </section>
  );
};