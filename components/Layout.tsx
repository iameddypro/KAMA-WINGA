
import React from 'react';
import { ViewState, Language } from '../types';
import { Home, PlusSquare, User, Search, PlayCircle } from 'lucide-react';
import { translations } from '../utils/translations';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  setView: (view: ViewState) => void;
  lang: Language;
  logo?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, setView, lang, logo }) => {
  const t = translations[lang];

  return (
    <div className="min-h-screen bg-black pb-20 max-w-md mx-auto border-x border-zinc-800 relative font-sans">
      
      {/* Top Header - Snapchat Style (Centered or Big Left) */}
      {currentView !== ViewState.MEMES && currentView !== ViewState.SEARCH && (
        <header className="bg-black/95 backdrop-blur-md px-4 py-3 sticky top-0 z-30 border-b border-zinc-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
             {/* Avatar Placeholder for Menu */}
            <div className="w-9 h-9 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400 border border-zinc-700">
               <User size={18} />
            </div>
            
            {/* Logo or Title */}
            {logo ? (
                <img src={logo} alt={t.appName} className="h-8 max-w-[150px] object-contain" />
            ) : (
                <h1 className="text-xl font-extrabold text-white tracking-tight">
                {t.appName}
                </h1>
            )}
          </div>
          
          <button 
            onClick={() => setView(ViewState.SEARCH)}
            className="w-9 h-9 bg-zinc-900 rounded-full flex items-center justify-center text-zinc-400 border border-zinc-800 hover:bg-zinc-800 hover:text-yellow-400 transition-colors"
          >
              <Search size={18} />
          </button>
        </header>
      )}

      {/* Main Content Area */}
      <main className={`p-0 relative z-10 min-h-screen bg-black`}>
        {children}
      </main>

      {/* Bottom Navigation - Glassy */}
      <nav className="fixed bottom-0 left-0 right-0 border-t border-zinc-900 pb-safe z-40 max-w-md mx-auto bg-black/95 backdrop-blur-lg text-zinc-500">
        <div className="flex justify-around items-center h-16 px-2">
          <button 
            onClick={() => setView(ViewState.FEED)}
            className={`flex flex-col items-center justify-center w-full h-full transition-colors ${currentView === ViewState.FEED ? 'text-yellow-400' : 'hover:text-zinc-300'}`}
          >
            <Home size={26} strokeWidth={currentView === ViewState.FEED ? 3 : 2} />
          </button>

          <button 
            onClick={() => setView(ViewState.MEMES)}
            className={`flex flex-col items-center justify-center w-full h-full transition-colors ${currentView === ViewState.MEMES ? 'text-yellow-400' : 'hover:text-zinc-300'}`}
          >
            <PlayCircle size={26} strokeWidth={currentView === ViewState.MEMES ? 3 : 2} />
          </button>

          <button 
            onClick={() => setView(ViewState.CREATE)}
            className="flex flex-col items-center justify-center w-full h-full -mt-6"
          >
            <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg shadow-yellow-900/20 text-black transition-all active:scale-90 border-4 border-black">
              <PlusSquare size={28} strokeWidth={2.5} />
            </div>
          </button>

          <button 
            onClick={() => setView(ViewState.PROFILE)}
            className={`flex flex-col items-center justify-center w-full h-full transition-colors ${currentView === ViewState.PROFILE ? 'text-yellow-400' : 'hover:text-zinc-300'}`}
          >
            <User size={26} strokeWidth={currentView === ViewState.PROFILE ? 3 : 2} />
          </button>
        </div>
      </nav>
    </div>
  );
};
