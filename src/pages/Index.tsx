import { useEffect } from "react";
import { Link } from "react-router-dom";
import { products } from "@/data/products";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, Zap, CheckCircle2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-neon selection:text-black font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Background Grid Effect */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-neon opacity-20 blur-[100px]"></div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon/10 border border-neon/20 text-neon text-xs font-bold tracking-wider mb-8 uppercase animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-neon"></span>
            </span>
            La era de la IA ya empezó
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
            FACTURA CON IA <br />
            <span className="text-neon">O QUÉDATE ATRÁS</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Las herramientas definitivas para dominar el mercado digital. 
            Sin relleno. Sin teoría obsoleta. Solo métodos probados para generar ingresos.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <a href="#products">
              <Button className="bg-neon text-black hover:bg-neon/80 font-bold text-lg px-8 py-6 h-auto rounded-none border border-transparent hover:border-white/20 transition-all">
                ACCEDER AL ARSENAL <Zap className="ml-2 w-5 h-5" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Authority Banner */}
      <section className="border-y border-white/10 bg-white/5 py-8">
        <div className="container mx-auto px-4 flex flex-wrap justify-center gap-8 md:gap-16 items-center text-gray-500 font-mono text-sm uppercase tracking-widest">
          <span className="flex items-center gap-2"><CheckCircle2 className="text-neon w-4 h-4"/> 100% Verificado</span>
          <span className="flex items-center gap-2"><CheckCircle2 className="text-neon w-4 h-4"/> Resultados Reales</span>
          <span className="flex items-center gap-2"><CheckCircle2 className="text-neon w-4 h-4"/> Acceso Inmediato</span>
        </div>
      </section>

      {/* Products Grid */}
      <section id="products" className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">PRODUCTOS DISPONIBLES</h2>
              <p className="text-gray-400">Herramientas tácticas para tu crecimiento.</p>
            </div>
            <div className="h-1 w-full md:w-auto flex-1 bg-white/10 mx-4 self-center"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((product) => (
              <Link 
                key={product.id} 
                to={`/product/${product.id}`}
                className="group relative bg-zinc-900 border border-white/10 overflow-hidden hover:border-neon/50 transition-all duration-300"
              >
                {/* Image Placeholder area */}
                <div className="h-48 bg-zinc-800/50 flex items-center justify-center border-b border-white/5 group-hover:bg-zinc-800 transition-colors relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent"></div>
                  {product.image === 'chart-line-up' && <Zap className="w-16 h-16 text-white/20 group-hover:text-neon transition-colors duration-500" />}
                  {product.image === 'infinity' && <div className="text-6xl font-bold text-white/20 group-hover:text-neon transition-colors duration-500">∞</div>}
                  {product.image === 'unlock' && <Lock className="w-16 h-16 text-white/20 group-hover:text-neon transition-colors duration-500" />}
                  
                  {product.isFree && (
                    <div className="absolute top-4 right-4 bg-neon text-black text-xs font-bold px-2 py-1 uppercase">
                      Gratis
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-neon transition-colors">
                    {product.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-6 line-clamp-2">
                    {product.shortDescription}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-lg font-mono font-medium text-white">
                      {product.price === 0 ? "FREE" : `$${product.price} USD`}
                    </span>
                    <span className="text-neon text-sm font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      VER DETALLES <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;