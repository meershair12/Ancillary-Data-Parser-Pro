import { useEffect, useState } from 'react';
import { Code2, Terminal, Sparkles } from 'lucide-react';

const ProfessionalFooter = () => {
  const [currentStyle, setCurrentStyle] = useState(1);

  useEffect(() => {
    // Auto-switch styles every 4 seconds for demo
    const interval = setInterval(() => {
      setCurrentStyle(prev => (prev % 3) + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    setCurrentStyle(prev => (prev % 3) + 1);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Style 1 */}
      <div 
        className={`flex items-center gap-2.5 p-3 rounded-2xl bg-black/85 backdrop-blur-md border border-blue-500/30 shadow-lg max-w-[280px] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:border-blue-500/50 hover:bg-black/90 cursor-pointer ${currentStyle !== 1 && 'hidden'}`}
        onClick={handleClick}
      >
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110">
          <Code2 className="w-4 h-4 text-white" />
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] text-gray-400/80 uppercase tracking-wider font-medium">Developed by</span>
          <span className="text-[13px] text-white font-semibold tracking-wide"><a href="https://www.linkedin.com/in/shair-muhammad/" target='_blank'>Shair Muhammad</a></span>
        </div>
        <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
      </div>

      {/* Style 2 */}
      <div 
        className={`flex items-center gap-2.5 p-3 rounded-xl bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-md border border-gray-600/40 shadow-lg max-w-[280px] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:border-green-500/60 hover:shadow-green-500/15 cursor-pointer ${currentStyle !== 2 && 'hidden'}`}
        onClick={handleClick}
      >
        <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110">
          <Terminal className="w-4 h-4 text-white" />
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] text-gray-400/80 uppercase tracking-wider font-medium">Built with ❤️ by</span>
          <span className="text-[13px] text-white font-semibold tracking-wide">Shair Muhammad</span>
        </div>
        <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
      </div>

      {/* Style 3 */}
      <div 
        className={`flex items-center gap-2.5 p-3 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg max-w-[280px] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:border-purple-500/40 hover:bg-white/15 hover:shadow-purple-500/20 cursor-pointer ${currentStyle !== 3 && 'hidden'}`}
        onClick={handleClick}
      >
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] text-gray-300/80 uppercase tracking-wider font-medium">Crafted by</span>
          <span className="text-[13px] text-white font-semibold tracking-wide">Shair Muhammad</span>
        </div>
        <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
      </div>
    </div>
  );
};

export default ProfessionalFooter;