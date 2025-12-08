import { Link } from "react-router-dom";
import { Terminal, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

const Navbar = () => {
  const navLinks = [
    { name: "ARSENAL", href: "/#products" },
    { name: "FAQ", href: "/#faq" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-neon/10 p-2 rounded border border-neon/20 group-hover:border-neon/50 transition-colors">
            <Terminal className="text-neon w-6 h-6" />
          </div>
          <span className="font-bold text-xl tracking-tighter text-white">
            JORDI<span className="text-neon">GPT</span>
          </span>
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name}
              href={link.href} 
              className="text-sm font-medium text-gray-400 hover:text-neon transition-colors"
            >
              {link.name}
            </a>
          ))}
          <Link to="/" className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold tracking-widest border border-white/10 rounded uppercase transition-all hover:border-neon/50">
            Login
          </Link>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:text-neon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-black border-l border-white/10 w-[300px] p-0">
              <div className="flex flex-col h-full p-6">
                <div className="flex items-center gap-2 mb-12">
                   <div className="bg-neon/10 p-2 rounded border border-neon/20">
                    <Terminal className="text-neon w-5 h-5" />
                  </div>
                  <span className="font-bold text-xl tracking-tighter text-white">
                    JORDI<span className="text-neon">GPT</span>
                  </span>
                </div>

                <div className="flex flex-col gap-6">
                  {navLinks.map((link) => (
                    <SheetClose key={link.name} asChild>
                      <a 
                        href={link.href}
                        className="text-lg font-medium text-gray-400 hover:text-neon transition-colors"
                      >
                        {link.name}
                      </a>
                    </SheetClose>
                  ))}
                  <SheetClose asChild>
                    <Link to="/" className="text-lg font-medium text-gray-400 hover:text-neon transition-colors">
                      LOGIN
                    </Link>
                  </SheetClose>
                </div>

                <div className="mt-auto pt-8 border-t border-white/10">
                  <p className="text-xs text-gray-600">
                    © {new Date().getFullYear()} JordiGPT System
                  </p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;