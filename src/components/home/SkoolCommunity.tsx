import { Users, Code, Rocket, Star, Zap, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export const SkoolCommunity = () => {
  return (
    <section className="py-24 border-y border-neon/20 bg-black relative overflow-hidden group">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      <div className="absolute right-0 top-0 w-1/2 h-full bg-neon/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
              
              {/* Content */}
              <div className="flex-1 space-y-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon text-black text-xs font-black tracking-wider uppercase">
                      <Users className="w-3 h-3" /> Comunidad Privada
                  </div>
                  
                  <div>
                      <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-[0.9] mb-4">
                          JordiGPT <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon to-white">Builders</span>
                      </h2>
                      <p className="text-xl text-gray-400 font-light max-w-xl">
                          El entorno donde la tecnología se encuentra con el negocio real. Deja de construir solo.
                      </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                      <div className="flex gap-4 items-start p-4 rounded-lg bg-white/5 border border-white/10 hover:border-neon/30 transition-colors">
                          <Code className="w-6 h-6 text-neon shrink-0" />
                          <div>
                              <h4 className="font-bold text-white mb-1">AI-Vibe Coding</h4>
                              <p className="text-sm text-gray-400">Construye software y MVPs sin ser desarrollador senior.</p>
                          </div>
                      </div>
                      <div className="flex gap-4 items-start p-4 rounded-lg bg-white/5 border border-white/10 hover:border-neon/30 transition-colors">
                          <Rocket className="w-6 h-6 text-neon shrink-0" />
                          <div>
                              <h4 className="font-bold text-white mb-1">Negocios Digitales</h4>
                              <p className="text-sm text-gray-400">Estrategias de monetización y validación de ofertas.</p>
                          </div>
                      </div>
                      <div className="flex gap-4 items-start p-4 rounded-lg bg-white/5 border border-white/10 hover:border-neon/30 transition-colors">
                          <Star className="w-6 h-6 text-neon shrink-0" />
                          <div>
                              <h4 className="font-bold text-white mb-1">Marca Personal Auténtica</h4>
                              <p className="text-sm text-gray-400">Diferenciación radical en un mercado saturado.</p>
                          </div>
                      </div>
                      <div className="flex gap-4 items-start p-4 rounded-lg bg-white/5 border border-white/10 hover:border-neon/30 transition-colors">
                          <Zap className="w-6 h-6 text-neon shrink-0" />
                          <div>
                              <h4 className="font-bold text-white mb-1">Distribución Viral</h4>
                              <p className="text-sm text-gray-400">Contenido orgánico de nicho que convierte.</p>
                          </div>
                      </div>
                  </div>

                  <a 
                      href="https://www.skool.com/jordigpt/about" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block w-full sm:w-auto"
                  >
                      <Button className="w-full sm:w-auto bg-neon text-black hover:bg-neon/90 font-bold text-lg h-14 px-10 shadow-[0_0_20px_rgba(212,232,58,0.4)] hover:shadow-[0_0_40px_rgba(212,232,58,0.6)] transition-all uppercase">
                          UNIRSE AHORA
                          <ExternalLink className="ml-2 w-5 h-5" />
                      </Button>
                  </a>
              </div>

              {/* Visual Representation (Mockup styled) */}
              <div className="flex-1 w-full lg:w-auto flex justify-center lg:justify-end relative">
                  <div className="relative w-full max-w-md aspect-[4/5] bg-neutral-900 rounded-2xl border border-neutral-800 p-2 shadow-2xl rotate-3 hover:rotate-0 transition-all duration-500">
                      {/* Fake Browser UI */}
                      <div className="h-full w-full bg-black rounded-xl overflow-hidden relative">
                           <div className="absolute top-0 w-full h-12 bg-neutral-900 border-b border-neutral-800 flex items-center px-4 gap-2">
                              <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
                              <div className="w-3 h-3 rounded-full bg-yellow-500/20"></div>
                              <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
                              <div className="ml-4 h-6 w-32 bg-neutral-800 rounded-full"></div>
                           </div>
                           
                           {/* Content Mockup */}
                           <div className="mt-16 px-6 space-y-6">
                              <div className="w-16 h-16 rounded-xl bg-neon flex items-center justify-center">
                                  <span className="text-black font-black text-2xl">JG</span>
                              </div>
                              <div className="space-y-2">
                                  <div className="h-8 w-3/4 bg-neutral-800 rounded animate-pulse"></div>
                                  <div className="h-4 w-1/2 bg-neutral-900 rounded"></div>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-3 mt-8">
                                  <div className="aspect-video bg-neutral-900 rounded border border-neutral-800"></div>
                                  <div className="aspect-video bg-neutral-900 rounded border border-neutral-800"></div>
                                  <div className="aspect-video bg-neutral-900 rounded border border-neutral-800"></div>
                                  <div className="aspect-video bg-neutral-900 rounded border border-neutral-800 flex items-center justify-center text-neon text-xs font-mono">+120 Clases</div>
                              </div>

                              <div className="mt-8 p-4 bg-neon/10 rounded border border-neon/20">
                                  <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-full bg-white/10"></div>
                                      <div className="flex-1 h-3 bg-white/10 rounded"></div>
                                  </div>
                                  <div className="mt-3 h-2 w-full bg-white/5 rounded"></div>
                                  <div className="mt-2 h-2 w-2/3 bg-white/5 rounded"></div>
                              </div>
                           </div>

                           {/* Floating Elements */}
                           <div className="absolute bottom-8 right-8 bg-black border border-neon/50 text-neon px-4 py-2 rounded-lg text-xs font-bold shadow-[0_0_20px_rgba(212,232,58,0.2)]">
                               @jordigpt
                           </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </section>
  );
};