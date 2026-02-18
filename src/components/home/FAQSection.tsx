import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const FAQSection = () => {
  return (
    <section id="faq" className="py-24 border-t border-border bg-background">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-3xl font-bold text-foreground mb-4 text-center">PREGUNTAS FRECUENTES</h2>
        <div className="space-y-4 mt-8">
          <Accordion type="single" collapsible className="w-full space-y-4">
              <AccordionItem value="item-1" className="border border-border rounded-lg px-4 data-[state=open]:border-neon/30">
              <AccordionTrigger className="text-foreground hover:text-neon hover:no-underline font-medium text-left">
                  ¿Cómo recibo el acceso?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                  Acceso inmediato por email post-compra. Panel privado de descargas.
              </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="border border-border rounded-lg px-4 data-[state=open]:border-neon/30">
              <AccordionTrigger className="text-foreground hover:text-neon hover:no-underline font-medium text-left">
                  ¿Sirve si no se programar?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                  100%. Todo está pensado para Low-Code / No-Code. Copiar, pegar, configurar.
              </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3" className="border border-border rounded-lg px-4 data-[state=open]:border-neon/30">
              <AccordionTrigger className="text-foreground hover:text-neon hover:no-underline font-medium text-left">
                  ¿Es diferente a lo que hay gratis en YouTube?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                  YouTube te da piezas sueltas; yo te doy el rompecabezas armado. Además, muchos de mis métodos y estrategias no están en YouTube; literalmente nadie los enseña públicamente. No pierdas meses filtrando ruido. Aquí tienes la estrategia exacta, los prompts probados y la estructura validada. El tiempo que te ahorras en prueba y error paga la inversión el primer día.
              </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border border-border rounded-lg px-4 data-[state=open]:border-neon/30">
              <AccordionTrigger className="text-foreground hover:text-neon hover:no-underline font-medium text-left">
                  No tengo tiempo para aprender algo nuevo ahora.
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                  Justamente por eso lo necesitas. No son cursos teóricos de 20 horas. Son sistemas de implementación rápida: copias, pegas y recuperas semanas de trabajo manual en una tarde. Si no tienes tiempo, es urgente que automatices.
              </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border border-border rounded-lg px-4 data-[state=open]:border-neon/30">
              <AccordionTrigger className="text-foreground hover:text-neon hover:no-underline font-medium text-left">
                  ¿Qué pasa si la IA cambia el mes que viene?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                  El sistema incluye garantía de actualización 2025. Mis estrategias se basan en fundamentos de negocio, no en "hacks" temporales. Si la tecnología cambia, actualizo el producto y tú recibes la mejora gratis. Estás cubierto.
              </AccordionContent>
              </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  );
};