import { Link } from "react-router-dom";
import { Terminal } from "lucide-react";

const Navbar = () => {
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
        
        <div className="flex items-center gap-6">
          <a href="#products" className="text-sm font-medium text-gray-400 hover:text-neon transition-colors hidden md:block">
            ARSENAL
          </a>
          <Link to="/" className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold tracking-widest border border-white/10 rounded uppercase transition-all hover:border-neon/50">
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;