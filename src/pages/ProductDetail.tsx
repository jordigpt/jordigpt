import { useParams, Link, Navigate } from "react-router-dom";
import { products } from "@/data/products";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, ShieldCheck, Zap, ArrowRight, XCircle, CheckCircle2, Lock } from "lucide-react";
import { useEffect, useState } from "react";

const ProductDetail = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const otherProducts = products.filter((p) => p.id !== id).slice(0, 2); // Show max 2 other products
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const handleScroll = () => {
      const heroSection = document.getElementById('hero-action');
      if (heroSection) {
        const rect = heroSection.getBoundingClientRect();
        setShowSticky(rect.bottom < 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [id]);

  if (!product) {
    return <Navigate to="/" replace />;
  }

  const handleCheckout = () => {
    console.log(`Iniciando checkout para: ${product.title}`);
    alert("Redirigiendo a MercadoPago... (Simulación)");
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans pb-20 md:pb-0">
      <Navbar />

      <main className="pt-32 pb-12 container mx-auto px-4">
        <Link to="/" className="inline-flex items-center text-gray-500 hover:text-neon mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Volver al arsenal
        </Link>

        {/* --- HERO PRODUCT SECTION --- */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-24 items-start mb-24">
          {/* Left Column: Visuals */}
          {/* FIXED: sticky only on md screens */}
          <div className="space-y-8 md:sticky md:top-24">
            <div className="aspect-square bg-zinc-900 border border-white/10 rounded-none flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-800 via-black to-black opacity-50"></div>
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
              
              <div className="relative z-10 text-center p-8 transform group-hover:scale-105 transition-transform duration-700">
                 <h1 className="text-5xl md:text-7xl font-bold text-white/5 group-hover:text-neon/10 transition-colors duration-500 select-none tracking-tighter">
                    {product.title.split(' ')[0]}
                 </h1>
                 {product.image === 'chart-line-up' && <Zap className="w-32 h-32 mx-auto text-neon mt-4 drop-shadow-[0_0_25px_rgba(212,232,58,0.6)] animate-pulse-glow" />}
                 {product.image === 'infinity' && <div className="text-8xl font-bold text-neon mt-4 drop-shadow-[0_0_25px_rgba(212,232,58,0.6)] animate-pulse-glow">∞</div>}
                 {product.image === 'unlock' && <Lock className="w-32 h-32 mx-auto text-neon mt-4 drop-shadow-[0_0_25px_rgba(212,232,58,0.6)] animate-pulse-glow" />}
              </div>
            </div>

            <div className="bg-zinc-900/30 p-6 border border-white/5 flex gap-4 items-start backdrop-blur-sm">
              <ShieldCheck className="text-neon w-8 h-8 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-white mb-1 text-sm uppercase tracking-wide">Garantía JordiGPT</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Contenido verificado. Sin relleno. Si la técnica deja de funcionar por cambios en la plataforma, actualizo el material gratis para todos los compradores.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Copy & Checkout */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-4 mb-6">
                {product.isFree ? (
                  <span className="bg-neon text-black text-xs font-bold px-3 py-1 uppercase tracking-widest">
                    Regalo Exclusivo
                  </span>
                ) : (
                  <span className="bg-white/10 text-neon text-xs font-bold px-3 py-1 uppercase border border-neon/20 tracking-widest shadow-[0_0_10px_rgba(212,232,58,0.2)]">
                    Producto Premium
                  </span>
                )}
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-none tracking-tight">
                {product.title}
              </h1>
              
              <div className="flex items-baseline gap-3 mb-8">
                <span className="text-4xl font-mono text-neon font-bold">
                  {product.price === 0 ? "GRATIS" : `$${product.price} USD`}
                </span>
                {!product.isFree && (
                  <span className="text-gray-600 line-through text-xl decoration-neon/50">
                    ${(product.price * 2).toFixed(2)}
                  </span>
                )}
              </div>

              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 text-lg leading-relaxed mb-8 border-l-4 border-neon pl-6 italic">
                  "{product.fullDescription}"
                </p>
              </div>
            </div>

            <div className="space-y-6 bg-zinc-900/20 p-6 border border-white/5 rounded-lg">
               <h3 className="text-white font-bold uppercase tracking-wider text-sm border-b border-white/10 pb-2">Lo que obtienes dentro:</h3>
               <ul className="space-y-4">
                 {product.features.map((feature, idx) => (
                   <li key={idx} className="flex items-start gap-3 text-gray-300">
                     <div className="bg-neon/10 p-1 rounded-full mt-0.5">
                       <Check className="text-neon w-3 h-3 flex-shrink-0" />
                     </div>
                     <span className="text-sm md:text-base">{feature}</span>
                   </li>
                 ))}
               </ul>
            </div>

            <div className="pt-8" id="hero-action">
              <Button 
                onClick={handleCheckout}
                className="w-full bg-neon text-black hover:bg-neon/90 hover:scale-[1.01] font-bold text-xl py-8 rounded-sm transition-all shadow-[0_0_20px_rgba(212,232,58,0.2)] hover:shadow-[0_0_40px_rgba(212,232,58,0.5)] active:scale-[0.98]"
              >
                {product.ctaText} <ArrowRight className="ml-2 w-6 h-6" />
              </Button>
              <div className="flex items-center justify-center gap-4 mt-4 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                 {/* Fake Trust Badges */}
                 <div className="text-[10px] text-gray-500 uppercase tracking-widest flex gap-4">
                    <span>🔒 Pago Seguro SSL</span>
                    <span>⚡ Entrega Inmediata</span>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- WHO IS THIS FOR SECTION --- */}
        <section className="py-12 border-t border-white/10 mb-12">
            <h3 className="text-2xl font-bold text-white mb-8 text-center">¿ESTO ES PARA TI?</h3>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <div className="bg-red-950/10 border border-red-900/30 p-6 rounded-lg">
                    <h4 className="flex items-center gap-2 text-red-500 font-bold mb-4">
                        <XCircle className="w-5 h-5"/> NO ES PARA TI SI:
                    </h4>
                    <ul className="space-y-2 text-gray-400 text-sm">
                        <li className="flex gap-2"><span>•</span> Buscas botones mágicos sin trabajo.</li>
                        <li className="flex gap-2"><span>•</span> No estás dispuesto a seguir instrucciones.</li>
                        <li className="flex gap-2"><span>•</span> Prefieres la teoría universitaria a la práctica.</li>
                    </ul>
                </div>
                <div className="bg-neon/5 border border-neon/20 p-6 rounded-lg">
                    <h4 className="flex items-center gap-2 text-neon font-bold mb-4">
                        <CheckCircle2 className="w-5 h-5"/> SÍ ES PARA TI SI:
                    </h4>
                    <ul className="space-y-2 text-gray-300 text-sm">
                        <li className="flex gap-2"><span>•</span> Quieres resultados rápidos y medibles.</li>
                        <li className="flex gap-2"><span>•</span> Entiendes que la IA es el apalancamiento definitivo.</li>
                        <li className="flex gap-2"><span>•</span> Estás listo para ejecutar hoy mismo.</li>
                    </ul>
                </div>
            </div>
        </section>

        {/* --- CROSS SELL SECTION --- */}
        {otherProducts.length > 0 && (
          <section className="border-t border-white/10 pt-16">
            <h3 className="text-xl font-bold text-gray-400 mb-8 uppercase tracking-widest text-center">Completa tu Arsenal</h3>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {otherProducts.map((p) => (
                <Link key={p.id} to={`/product/${p.id}`} className="group flex bg-zinc-900 border border-white/10 hover:border-neon/40 transition-all p-4 items-center gap-4">
                  <div className="w-16 h-16 bg-black flex items-center justify-center flex-shrink-0 text-white/20 group-hover:text-neon transition-colors">
                     {p.image === 'chart-line-up' && <Zap className="w-8 h-8" />}
                     {p.image === 'infinity' && <div className="text-2xl font-bold">∞</div>}
                     {p.image === 'unlock' && <Lock className="w-8 h-8" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-white group-hover:text-neon transition-colors">{p.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">{p.price === 0 ? "GRATIS" : `$${p.price} USD`}</p>
                  </div>
                  <div className="ml-auto">
                    <ArrowRight className="text-gray-600 group-hover:text-neon w-5 h-5 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      
      {/* --- MOBILE STICKY CTA --- */}
      {/* Solo se muestra si el botón principal ya no es visible (scroll down) */}
      <div 
        className={`fixed bottom-0 left-0 w-full bg-black/90 backdrop-blur-lg border-t border-neon/20 p-4 md:hidden z-40 transition-transform duration-300 ${showSticky ? 'translate-y-0' : 'translate-y-full'}`}
      >
          <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col">
                  <span className="text-xs text-gray-400 font-bold uppercase">{product.title}</span>
                  <span className="text-lg font-mono text-neon font-bold">{product.price === 0 ? "GRATIS" : `$${product.price}`}</span>
              </div>
              <Button onClick={handleCheckout} size="sm" className="bg-neon text-black font-bold hover:bg-neon/90 rounded-none px-6">
                  {product.ctaText}
              </Button>
          </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;