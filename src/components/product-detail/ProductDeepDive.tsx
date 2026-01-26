import { Badge } from "@/components/ui/badge";
import { Zap, Image as ImageIcon, Check, XCircle, CheckCircle2 } from "lucide-react";
import { Product } from "@/types/admin";

interface ProductDeepDiveProps {
  product: Product;
}

export const ProductDeepDive = ({ product }: ProductDeepDiveProps) => {
  return (
    <section className="bg-muted/5 border-y border-border py-24">
         <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <Badge variant="outline" className="mb-4 border-neon/30 text-neon bg-neon/5">ANATOMÍA DEL SISTEMA</Badge>
                    <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-6">
                        ¿Por qué esto <span className="text-neon">funciona?</span>
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        No es solo "información". Es un sistema diseñado para la ejecución.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
                    <div className="order-2 md:order-1 prose prose-invert">
                         <h3 className="text-2xl font-bold text-white mb-4">La Estrategia Detrás</h3>
                         <div className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                            {product.full_description}
                         </div>
                    </div>
                    <div className="order-1 md:order-2">
                        <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl border border-border shadow-2xl relative overflow-hidden">
                             <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-neon/10 rounded-full blur-[80px]"></div>
                             <div className="relative z-10 space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-neon/20 flex items-center justify-center text-neon border border-neon/30">
                                        <Zap className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white">Velocidad de Implementación</h4>
                                        <p className="text-sm text-muted-foreground">Diseñado para ejecutar en menos de 24hs.</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/30">
                                        <ImageIcon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white">Activos Incluidos</h4>
                                        <p className="text-sm text-muted-foreground">Templates, prompts y scripts listos.</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 border border-purple-500/30">
                                        <Check className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white">Sin Relleno</h4>
                                        <p className="text-sm text-muted-foreground">Directo al grano. Cero teoría innecesaria.</p>
                                    </div>
                                </div>
                             </div>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-8">
                        <h3 className="flex items-center gap-2 text-xl font-bold text-red-500 mb-6">
                            <XCircle className="w-6 h-6" /> NO ES PARA VOS SI...
                        </h3>
                        <ul className="space-y-4">
                            <li className="flex gap-3 text-muted-foreground">
                                <span className="text-red-500 font-bold">✕</span> Buscas fórmulas mágicas sin trabajo.
                            </li>
                            <li className="flex gap-3 text-muted-foreground">
                                <span className="text-red-500 font-bold">✕</span> No estás dispuesto a probar cosas nuevas.
                            </li>
                            <li className="flex gap-3 text-muted-foreground">
                                <span className="text-red-500 font-bold">✕</span> Prefieres la teoría académica sobre la práctica.
                            </li>
                        </ul>
                    </div>

                    <div className="bg-neon/5 border border-neon/20 rounded-xl p-8">
                        <h3 className="flex items-center gap-2 text-xl font-bold text-neon mb-6">
                            <CheckCircle2 className="w-6 h-6" /> SÍ ES PARA VOS SI...
                        </h3>
                        <ul className="space-y-4 text-foreground">
                            <li className="flex gap-3 text-foreground">
                                <span className="text-neon font-bold">✓</span> Quieres resultados tangibles y rápidos.
                            </li>
                            <li className="flex gap-3 text-foreground">
                                <span className="text-neon font-bold">✓</span> Entiendes que la IA es una herramienta, no magia.
                            </li>
                            <li className="flex gap-3 text-foreground">
                                <span className="text-neon font-bold">✓</span> Valoras tu tiempo y quieres atajos probados.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
         </div>
      </section>
  );
};