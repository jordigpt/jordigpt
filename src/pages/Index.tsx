import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Product } from "@/types/admin";

// Modular components
import { Hero } from "@/components/home/Hero";
import { AuthorityBanner } from "@/components/home/AuthorityBanner";
import { AboutMe } from "@/components/home/AboutMe";
import { SkoolCommunity } from "@/components/home/SkoolCommunity";
import { ProductsGrid } from "@/components/home/ProductsGrid";
import { ComparisonSection } from "@/components/home/ComparisonSection";
import { FAQSection } from "@/components/home/FAQSection";

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });
      
      if (!error && data) {
         setProducts(data as Product[]);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-neon selection:text-black font-sans">
      <Navbar />
      
      <Hero />
      <AuthorityBanner />
      <AboutMe />
      <SkoolCommunity />
      <ProductsGrid products={products} loading={loading} />
      <ComparisonSection />
      <FAQSection />

      <Footer />
    </div>
  );
};

export default Index;