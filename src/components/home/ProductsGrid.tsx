import { Link } from "react-router-dom";
import { ArrowRight, Ban, Download, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/admin";

interface ProductsGridProps {
  products: Product[];
  loading: boolean;
}

export const ProductsGrid = ({ products, loading }: ProductsGridProps) => {
  return (
    <section id="products" className="py-24 relative bg-muted/5">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">TUS RECURSOS IA</h2>
            <p className="text-muted-foreground">Herramientas tácticas para tu crecimiento.</p>
          </div>
          <div className="h-1 w-full md:w-auto flex-1 bg-border mx-4 self-center"></div>
        </div>

        {loading ? (
           <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-neon" />
           </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-8">
              {products.map((product) => (
              <Link 
                  key={product.id} 
                  to={`/${product.slug || product.id}`}
                  className={`group relative bg-card border flex flex-col h-full rounded-xl shadow-sm transition-all duration-300 overflow-hidden ${product.is_out_of_stock ? 'border-red-500/20 opacity-90' : 'border-border hover:shadow-2xl hover:shadow-neon/10 hover:-translate-y-1'}`}
              >
                  {/* Featured/Badge Overlay */}
                  {(product.badge || product.is_out_of_stock) && (
                       <div className={`absolute top-0 right-0 z-20 px-2 py-0.5 md:px-4 md:py-1 text-[9px] md:text-xs font-bold uppercase tracking-wider rounded-bl-lg shadow-md ${product.is_out_of_stock ? 'bg-red-500 text-white' : product.is_featured ? 'bg-neon text-black' : 'bg-foreground text-background'}`}>
                          {product.is_out_of_stock ? 'AGOTADO' : product.badge}
                       </div>
                  )}

                  {/* Image Area - UPDATED to aspect-square and object-cover */}
                  <div className="aspect-square w-full bg-black/40 relative overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent opacity-20 z-10 pointer-events-none"></div>
                    
                    {product.image_url ? (
                        <img 
                          src={product.image_url} 
                          alt={product.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center z-0 bg-muted/30">
                            <span className="text-neon text-4xl">JG</span>
                        </div>
                    )}
                  </div>

                  <div className="p-3 md:p-6 flex flex-col flex-1 relative z-20 -mt-8 md:-mt-12">
                    {/* Product Card Body */}
                    <div className="bg-card border border-border rounded-lg p-3 md:p-5 shadow-lg flex-1 flex flex-col">
                        <h3 className="text-sm md:text-lg font-bold text-foreground mb-1 md:mb-2 group-hover:text-neon transition-colors leading-tight line-clamp-2">
                            {product.title}
                        </h3>
                        <p className="text-muted-foreground text-[10px] md:text-xs leading-relaxed mb-3 md:mb-4 line-clamp-2 md:line-clamp-3">
                            {product.short_description}
                        </p>
                        
                        {/* Divider */}
                        <div className="w-full h-px bg-border/50 my-auto"></div>

                        {/* Pricing Section - No Brainer Style */}
                        <div className="pt-3 md:pt-4 mt-2">
                           <div className="flex items-center justify-between">
                              <div className="flex flex-col">
                                  {product.original_price_display && !product.is_free && (
                                      <div className="flex items-center gap-1 md:gap-2 mb-1">
                                          <span className="text-[10px] md:text-xs text-muted-foreground line-through decoration-destructive/60">
                                              {product.original_price_display}
                                          </span>
                                          <Badge variant="outline" className="text-[8px] md:text-[10px] h-3 md:h-4 px-1 py-0 border-neon/30 text-neon bg-neon/5">
                                              OFERTA
                                          </Badge>
                                      </div>
                                  )}
                                  <div className="flex items-baseline gap-1">
                                      <span className={`text-lg md:text-2xl font-black text-foreground tracking-tighter group-hover:text-neon transition-colors ${product.is_out_of_stock ? 'text-muted-foreground' : ''}`}>
                                          {product.price_display || (product.price === 0 ? "GRATIS" : `$${product.price}`)}
                                      </span>
                                  </div>
                                  
                                  {/* DOWNLOADS COUNT DISPLAY */}
                                  {product.downloads_count && product.downloads_count > 0 ? (
                                     <span className="flex items-center gap-1 text-[9px] md:text-[10px] text-neon font-mono mt-1">
                                        <Download className="w-3 h-3" /> {product.downloads_count} ventas
                                     </span>
                                  ) : (
                                     !product.is_free && (
                                        <span className="text-[9px] md:text-[10px] text-muted-foreground font-medium hidden sm:inline-block mt-1">
                                            {product.price_microcopy ? "Pago único" : "Acceso inmediato"}
                                        </span>
                                     )
                                  )}
                              </div>
                              
                              <div className={`h-8 w-8 md:h-10 md:w-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${product.is_out_of_stock ? 'bg-muted text-muted-foreground' : 'bg-secondary group-hover:bg-neon group-hover:scale-110'}`}>
                                  {product.is_out_of_stock ? <Ban className="w-4 h-4 md:w-5 md:h-5" /> : <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-foreground group-hover:text-black" />}
                              </div>
                           </div>
                        </div>
                    </div>
                  </div>
              </Link>
              ))}
          </div>
        )}
      </div>
    </section>
  );
};