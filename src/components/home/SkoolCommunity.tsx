import { Users, Code, Rocket, Star, Zap, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export const SkoolCommunity = () => {
  return (
    <section className="py-24 border-y border-neon/20 bg-zinc-50 dark:bg-black relative overflow-hidden group transition-colors duration-500">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 dark:opacity-20 mix-blend-soft-light"></div>
      <div className="absolute right-0 top-0 w-1/2 h-full bg-neon/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
              
              {/* Content */}
              <div className="flex-1 space-y-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon text-black text-xs font-black tracking-wider uppercase shadow-sm">
                      <Users className="w-3 h-3" /> Comunidad Privada
                  </div>
                  
                  <div>
                      <h2 className="text-4xl md:text-6xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase leading-[0.9] mb-4">
                          JordiGPT <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon to-zinc-900 dark:to-white">Builders</span>
                      </h2>
                      <p className="text-xl text-zinc-600 dark:text-gray-400 font-light max-w-xl">
                          El entorno donde la tecnología se encuentra con el negocio real. Deja de construir solo.
                      </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                      <div className="flex gap-4 items-start p-4 rounded-xl bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 hover:border-neon/50 dark:hover:border-neon/30 hover:shadow-lg transition-all duration-300">
                          <Code className="w-6 h-6 text-neon shrink-0" />
                          <div>
                              <h4 className="font-bold text-zinc-900 dark:text-white mb-1">AI-Vibe Coding</h4>
                              <p className="text-sm text-zinc-600 dark:text-gray-400">Construye software y MVPs sin ser desarrollador senior.</p>
                          </div>
                      </div>
                      <div className="flex gap-4 items-start p-4 rounded-xl bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 hover:border-neon/50 dark:hover:border-neon/30 hover:shadow-lg transition-all duration-300">
                          <Rocket className="w-6 h-6 text-neon shrink-0" />
                          <div>
                              <h4 className="font-bold text-zinc-900 dark:text-white mb-1">Negocios Digitales</h4>
                              <p className="text-sm text-zinc-600 dark:text-gray-400">Estrategias de monetización y validación de ofertas.</p>
                          </div>
                      </div>
                      <div className="flex gap-4 items-start p-4 rounded-xl bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 hover:border-neon/50 dark:hover:border-neon/30 hover:shadow-lg transition-all duration-300">
                          <Star className="w-6 h-6 text-neon shrink-0" />
                          <div>
                              <h4 className="font-bold text-zinc-900 dark:text-white mb-1">Marca Personal Auténtica</h4>
                              <p className="text-sm text-zinc-600 dark:text-gray-400">Diferenciación radical en un mercado saturado.</p>
                          </div>
                      </div>
                      <div className="flex gap-4 items-start p-4 rounded-xl bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 hover:border-neon/50 dark:hover:border-neon/30 hover:shadow-lg transition-all duration-300">
                          <Zap className="w-6 h-6 text-neon shrink-0" />
                          <div>
                              <h4 className="font-bold text-zinc-900 dark:text-white mb-1">Distribución Viral</h4>
                              <p className="text-sm text-zinc-600 dark:text-gray-400">Contenido orgánico de nicho que convierte.</p>
                          </div>
                      </div>
                  </div>

                  <a 
                      href="https://www.skool.com/jordigpt/about" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block w-full sm:w-auto"
                  >
                      <Button className="w-full sm:w-auto bg-zinc-900 dark:bg-neon text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-neon/90 font-bold text-lg h-14 px-10 shadow-xl dark:shadow-[0_0_20px_rgba(212,232,58,0.4)] hover:shadow-2xl hover:-translate-y-1 transition-all uppercase">
                          UNIRSE AHORA
                          <ExternalLink className="ml-2 w-5 h-5" />
                      </Button>
                  </a>
              </div>

              {/* Visual Representation (Mockup styled) */}
              <div className="flex-1 w-full lg:w-auto flex justify-center lg:justify-end relative">
                  <div className="relative w-full max-w-md aspect-[4/5] bg-neutral-900 rounded-2xl border border-neutral-800 p-2 shadow-2xl rotate-3 hover:rotate-0 transition-all duration-500">
                      {/* Fake Browser UI */}
                      <div className="h-full w-full bg-black rounded-xl overflow-hidden relative flex flex-col">
                           <div className="absolute top-0 w-full h-12 bg-neutral-900 border-b border-neutral-800 flex items-center px-4 gap-2 z-20">
                              <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
                              <div className="w-3 h-3 rounded-full bg-yellow-500/20"></div>
                              <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
                              
                              {/* Barra de título estilo navegador */}
                              <div className="ml-4 flex-1 h-6 bg-neutral-800 rounded-full flex items-center justify-center">
                                <span className="text-[10px] text-zinc-400 font-mono flex items-center gap-1">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                    JordiGPT Builders - Skool
                                </span>
                              </div>
                           </div>
                           
                           {/* Content Mockup - Scrollable area */}
                           <div className="mt-12 px-4 py-6 space-y-6 overflow-y-auto h-full scrollbar-hide">
                              
                              {/* Banner Principal */}
                              <div className="w-full aspect-video rounded-xl overflow-hidden border border-neutral-800 shadow-lg relative group">
                                <img 
                                    src="/images/community/jordigpt-builders.png" 
                                    alt="JordiGPT Builders Community"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80"></div>
                                <div className="absolute bottom-3 left-3">
                                    <div className="h-4 w-24 bg-neon/80 rounded mb-2"></div>
                                    <div className="h-2 w-32 bg-white/20 rounded"></div>
                                </div>
                              </div>
                              
                              {/* Grilla de Recursos */}
                              <div className="grid grid-cols-2 gap-3">
                                  <div className="aspect-[4/3] bg-neutral-900 rounded-lg border border-neutral-800 overflow-hidden relative group cursor-pointer hover:border-neon/30 transition-all">
                                      <img src="/images/community/plan-1k.png" alt="Plan 1K" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                      <div className="absolute bottom-2 left-2 right-2 h-1 bg-neon/50 rounded overflow-hidden">
                                          <div className="h-full bg-neon w-3/4"></div>
                                      </div>
                                  </div>
                                  
                                  <div className="aspect-[4/3] bg-neutral-900 rounded-lg border border-neutral-800 overflow-hidden relative group cursor-pointer hover:border-neon/30 transition-all">
                                      <img src="/images/community/funnel-manychat.png" alt="Funnel Manychat" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                  </div>

                                  <div className="aspect-[4/3] bg-neutral-900 rounded-lg border border-neutral-800 overflow-hidden relative group cursor-pointer hover:border-neon/30 transition-all col-span-2">
                                      <img src="/images/community/vibecoding.png" alt="Vibecoding Mastery" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-transparent transition-all">
                                          <div className="w-10 h-10 rounded-full bg-black/50 backdrop-blur border border-white/20 flex items-center justify-center">
                                              <div className="w-0 h-0 border-l-[10px] border-l-white border-y-[6px] border-y-transparent ml-1"></div>
                                          </div>
                                      </div>
                                  </div>
                              </div>

                              {/* Loading State / Skeleton Mockup */}
                              <div className="p-4 bg-neon/5 rounded-lg border border-neon/10 animate-pulse">
                                  <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-full bg-neon/20"></div>
                                      <div className="flex-1 h-3 bg-neon/10 rounded"></div>
                                  </div>
                                  <div className="mt-3 space-y-2">
                                      <div className="h-2 w-full bg-neon/5 rounded"></div>
                                      <div className="h-2 w-5/6 bg-neon/5 rounded"></div>
                                      <div className="h-2 w-4/6 bg-neon/5 rounded"></div>
                                  </div>
                              </div>
                           </div>

                           {/* Floating Elements */}
                           <div className="absolute bottom-6 right-6 z-30">
                               <div className="bg-black border border-neon/50 text-neon px-4 py-2 rounded-full text-xs font-bold shadow-[0_0_20px_rgba(212,232,58,0.2)] flex items-center gap-2 animate-bounce">
                                   <div className="w-2 h-2 bg-neon rounded-full"></div>
                                   ÚNETE AHORA
                               </div>
                           </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </section>
  );
};