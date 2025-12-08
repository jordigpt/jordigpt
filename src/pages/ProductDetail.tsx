import { useParams, Link, Navigate } from "react-router-dom";
import { products } from "@/data/products";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, ShieldCheck, Zap } from "lucide-react";
import { useEffect } from "react";

const ProductDetail = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) {
    return <Navigate to="/" replace />;
  }

  const handleCheckout = () => {
    // Aquí iría la integración real con MercadoPago
    console.log(`Iniciando checkout para: ${product.title}`);
    alert("Redirigiendo a MercadoPago... (Simulación)");
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <Navbar />

      <main className="pt-32 pb-24 container mx-auto px-4">
        <Link to="/" className="inline-flex items-center text-gray-500 hover:text-neon mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Volver al arsenal
        </Link>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-24 items-start">
          {/* Left Column: Visuals & Guarantee */}
          <div className="space-y-8">
            <div className="aspect-square bg-zinc-900 border border-white/10 rounded-none flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-800 via-black to-black opacity-50"></div>
              {/* Abstract Representation of Product */}
              <div className="relative z-10 text-center p-8">
                 <h1 className="text-5xl md:text-6xl font-bold text-white/10 group-hover:text-neon/20 transition-colors duration-500 select-none">
                    {product.title.split(' ')[0]}
                 </h1>
                 <Zap className="w-24 h-24 mx-auto text-neon mt-4 drop-shadow-[0_0_15px_rgba(212,232,58,0.5)]" />
              </div>
            </div>

            <div className="bg-zinc-900/50 p-6 border border-white/5 rounded-none flex gap-4 items-start">
              <ShieldCheck className="text-neon w-8 h-8 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-white mb-1">Garantía de Calidad JordiGPT</h4>
                <p className="text-sm text-gray-400">
                  Contenido verificado y actualizado. Si la técnica deja de funcionar, actualizo el material gratis.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Copy & Checkout */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-4 mb-4">
                {product.isFree ? (
                  <span className="bg-neon text-black text-xs font-bold px-3 py-1 uppercase">
                    Regalo Exclusivo
                  </span>
                ) : (
                  <span className="bg-white/10 text-neon text-xs font-bold px-3 py-1 uppercase border border-neon/20">
                    Producto Premium
                  </span>
                )}
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                {product.title}
              </h1>
              
              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-3xl font-mono text-neon">
                  {product.price === 0 ? "GRATIS" : `$${product.price} USD`}
                </span>
                {!product.isFree && (
                  <span className="text-gray-500 line-through text-lg decoration-neon/50">
                    ${(product.price * 2).toFixed(2)}
                  </span>
                )}
              </div>

              <p className="text-gray-300 text-lg leading-relaxed mb-8 border-l-2 border-neon pl-6">
                {product.fullDescription}
              </p>
            </div>

            <div className="space-y-4">
               <h3 className="text-white font-bold uppercase tracking-wider text-sm">Lo que obtienes dentro:</h3>
               <ul className="space-y-3">
                 {product.features.map((feature, idx) => (
                   <li key={idx} className="flex items-start gap-3 text-gray-300">
                     <Check className="text-neon w-5 h-5 flex-shrink-0 mt-0.5" />
                     <span>{feature}</span>
                   </li>
                 ))}
               </ul>
            </div>

            <div className="pt-8 border-t border-white/10">
              <Button 
                onClick={handleCheckout}
                className="w-full bg-neon text-black hover:bg-neon/90 font-bold text-xl py-8 rounded-none transition-all shadow-[0_0_20px_rgba(212,232,58,0.2)] hover:shadow-[0_0_30px_rgba(212,232,58,0.4)]"
              >
                {product.ctaText}
              </Button>
              <p className="text-center text-xs text-gray-500 mt-4">
                {product.isFree ? "Descarga inmediata a tu correo." : "Pago seguro vía MercadoPago. Acceso inmediato."}
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;