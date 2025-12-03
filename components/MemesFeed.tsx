
import React, { useState, useRef, useEffect } from 'react';
import { Meme } from '../types';
import { Heart, MessageCircle, Share2, Plus, Music } from 'lucide-react';

interface MemesFeedProps {
  memes: Meme[];
}

export const MemesFeed: React.FC<MemesFeedProps> = ({ memes }) => {
  return (
    <div className="h-[calc(100vh-64px)] w-full bg-black overflow-y-scroll snap-y snap-mandatory no-scrollbar">
      {memes.map((meme) => (
        <MemeItem key={meme.id} meme={meme} />
      ))}
    </div>
  );
};

const MemeItem = ({ meme }: { meme: Meme }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    // Autoplay when in view logic usually goes here with IntersectionObserver
    // For simplicity, we just set it up to be clickable
    if(videoRef.current) {
        videoRef.current.loop = true;
    }
  }, []);

  // Custom Starfish for Memes too, or stick to Heart? 
  // User asked for "likes love icon to starfish" generally. I'll swap it here too.
  const StarfishIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill={isLiked ? "#EAB308" : "none"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6.4-4.8-6.4 4.8 2.4-7.2-6-4.8h7.6z" />
    </svg>
  );

  return (
    <div className="w-full h-full snap-start relative bg-zinc-900 border-b border-zinc-800">
      {/* Video */}
      <video
        ref={videoRef}
        src={meme.videoUrl}
        className="w-full h-full object-cover"
        onClick={togglePlay}
        playsInline
      />
      
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-black/40 rounded-full p-4 border border-white/20 backdrop-blur-sm">
             <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[20px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
          </div>
        </div>
      )}

      {/* Side Actions - MOVED TO LEFT SIDE */}
      <div className="absolute left-3 bottom-24 flex flex-col items-center gap-6 z-10">
        <div className="relative group cursor-pointer">
            <img src={meme.author.avatar} className="w-12 h-12 rounded-full border-2 border-white object-cover" />
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-yellow-400 rounded-full p-0.5">
                <Plus size={12} className="text-black font-bold" strokeWidth={3} />
            </div>
        </div>

        <button onClick={() => setIsLiked(!isLiked)} className="flex flex-col items-center gap-1">
          <StarfishIcon className={`w-[30px] h-[30px] transition-transform active:scale-75 ${isLiked ? 'text-yellow-400' : 'text-white drop-shadow-lg'}`} />
          <span className="text-white text-xs font-bold drop-shadow-md">{meme.likes + (isLiked ? 1 : 0)}</span>
        </button>

        <button className="flex flex-col items-center gap-1">
          <MessageCircle size={30} className="text-white drop-shadow-lg" strokeWidth={1.5} />
          <span className="text-white text-xs font-bold drop-shadow-md">{meme.comments}</span>
        </button>

        <button className="flex flex-col items-center gap-1">
          <Share2 size={30} className="text-white drop-shadow-lg" strokeWidth={1.5} />
          <span className="text-white text-xs font-bold drop-shadow-md">{meme.shares}</span>
        </button>
      </div>

      {/* Bottom Info - Adjusted padding since buttons are on left */}
      <div className="absolute left-16 right-0 bottom-0 p-4 pb-8 bg-gradient-to-t from-black/90 to-transparent">
        <h3 className="text-white font-bold text-lg mb-1 drop-shadow-md">@{meme.author.username}</h3>
        <p className="text-zinc-200 text-sm mb-3 line-clamp-2 drop-shadow-md font-medium">{meme.caption}</p>
        <div className="flex items-center gap-2 text-white/80 text-xs">
            <div className="animate-spin-slow">
                 <Music size={14} />
            </div>
            <span className="font-bold">Original Sound - {meme.author.name}</span>
        </div>
      </div>
    </div>
  );
};
