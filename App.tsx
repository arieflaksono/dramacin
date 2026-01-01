import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ContentRow } from './components/ContentRow';
import { VideoPlayer } from './components/VideoPlayer';
import { AIAssistant } from './components/AIAssistant';
import { getCategories } from './constants';
import { Drama } from './types';
import { fetchDramas, searchDramas } from './services/dramaService';
import { PlayCircle } from 'lucide-react';

function App() {
  const [dramas, setDramas] = useState<Drama[]>([]);
  const [selectedDrama, setSelectedDrama] = useState<Drama | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  
  // Search State
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchResults, setSearchResults] = useState<Drama[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const loadDramas = async () => {
      setIsLoading(true);
      try {
        const data = await fetchDramas();
        setDramas(data);
        if (data.length > 0 && data[0].id === '1' && data[0].title === "The CEO's Secret Vow") {
            setIsUsingFallback(true);
        } else {
            setIsUsingFallback(false);
        }
      } catch (e) {
        console.error("Error loading dramas:", e);
        setDramas([]); 
      } finally {
        setIsLoading(false);
      }
    };
    loadDramas();
  }, []);

  const featuredDrama = dramas.length > 0 ? dramas[0] : null;
  const categories = getCategories(dramas);

  const handlePlay = (drama: Drama) => {
    setSelectedDrama(drama);
    setIsPlaying(true);
  };

  const handleClosePlayer = () => {
    setIsPlaying(false);
    setSelectedDrama(null);
  };

  const handleSearch = async (query: string) => {
      setIsSearchMode(true);
      setIsSearching(true);
      try {
          const results = await searchDramas(query);
          setSearchResults(results);
      } catch (e) {
          console.error(e);
      } finally {
          setIsSearching(false);
      }
  };

  const handleHome = () => {
      setIsSearchMode(false);
      setSearchResults([]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-600"></div>
          <p className="text-gray-400 text-sm animate-pulse">Loading dramas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 font-sans text-white selection:bg-brand-600 selection:text-white">
      <Navbar onSearch={handleSearch} onHome={handleHome} />

      {/* Main Content */}
      <main className="relative z-0 pb-20">
        {isUsingFallback && (
            <div className="bg-orange-600/80 text-white text-xs text-center py-1 absolute top-16 z-40 w-full backdrop-blur-md">
                Using offline mode (API unavailable)
            </div>
        )}

        {isSearchMode ? (
            <div className="pt-24 px-4 md:px-12 min-h-screen">
                 <h2 className="text-2xl font-bold mb-6 text-white">Search Results</h2>
                 {isSearching ? (
                     <div className="flex justify-center py-20">
                         <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-600"></div>
                     </div>
                 ) : searchResults.length > 0 ? (
                     <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                         {searchResults.map(drama => (
                             <div key={drama.id} onClick={() => handlePlay(drama)} className="cursor-pointer group relative">
                                 <div className={`relative rounded-md overflow-hidden bg-dark-800 ${drama.isVertical ? 'aspect-[2/3]' : 'aspect-video'}`}>
                                     <img src={drama.thumbnailUrl} alt={drama.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                         <PlayCircle className="h-12 w-12 text-white" />
                                     </div>
                                 </div>
                                 <h3 className="mt-2 text-sm font-medium text-gray-200 truncate">{drama.title}</h3>
                                 <span className="text-xs text-gray-500">{drama.year} • {drama.genre[0]}</span>
                             </div>
                         ))}
                     </div>
                 ) : (
                     <div className="text-center py-20 text-gray-500">
                         <p>No titles found matching your search.</p>
                     </div>
                 )}
            </div>
        ) : (
            <>
                {featuredDrama ? (
                  <Hero 
                    drama={featuredDrama} 
                    onPlay={() => handlePlay(featuredDrama)} 
                  />
                ) : (
                    <div className="h-[50vh] flex items-center justify-center">
                        <p className="text-gray-400">No dramas found.</p>
                    </div>
                )}
                
                <div className="relative z-10 -mt-24 md:-mt-32 space-y-4">
                  {categories.map((category) => (
                    <ContentRow 
                      key={category.id}
                      title={category.name}
                      dramas={category.dramas}
                      onDramaSelect={(drama) => handlePlay(drama)}
                    />
                  ))}
                </div>
            </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-black py-12 px-4 border-t border-dark-800">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-sm text-gray-400">
           <div className="space-y-4">
             <h4 className="font-bold text-white">DramaBox</h4>
             <p>Watch premium short dramas anytime, anywhere.</p>
           </div>
           <div className="flex flex-col space-y-2">
             <span className="text-white font-semibold">Browse</span>
             <a href="#" className="hover:underline">Trending</a>
             <a href="#" className="hover:underline">New Releases</a>
             <a href="#" className="hover:underline">Originals</a>
           </div>
           <div className="flex flex-col space-y-2">
             <span className="text-white font-semibold">Support</span>
             <a href="#" className="hover:underline">Help Center</a>
             <a href="#" className="hover:underline">Terms of Use</a>
             <a href="#" className="hover:underline">Privacy</a>
           </div>
           <div className="flex flex-col space-y-2">
             <span className="text-white font-semibold">Social</span>
             <a href="#" className="hover:underline">Facebook</a>
             <a href="#" className="hover:underline">Instagram</a>
             <a href="#" className="hover:underline">Twitter</a>
           </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 text-center text-xs text-gray-500">
          &copy; 2024 DramaBox Clone. All rights reserved. Powered by Google Gemini.
        </div>
      </footer>

      {/* Interactive Elements */}
      <AIAssistant />
      
      {isPlaying && selectedDrama && (
        <VideoPlayer 
          title={selectedDrama.title} 
          onClose={handleClosePlayer} 
        />
      )}
    </div>
  );
}

export default App;