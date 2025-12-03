
import React, { useState } from 'react';
import { Post, User, Language } from '../types';
import { MessageCircle, BadgeCheck, Gem, Video, Play, Plus, TrendingUp, Flag, X, Repeat2, Heart } from 'lucide-react';
import { translations } from '../utils/translations';
import { db } from '../services/mockDb';

interface FeedProps {
  posts: Post[];
  currentUser: User;
  onPostClick: (post: Post) => void;
  onUserClick: (user: User) => void;
  lang: Language;
}

const StarfishIcon = ({ className, fill }: { className?: string, fill?: string }) => (
    <svg 
        viewBox="0 0 24 24" 
        fill={fill || "none"} 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6.4-4.8-6.4 4.8 2.4-7.2-6-4.8h7.6z" />
    </svg>
);

const PostItem = ({ post, currentUser, onPostClick, onUserClick, lang }: { post: Post, currentUser: User, onPostClick: (post: Post) => void, onUserClick: (user: User) => void, lang: Language }) => {
    const [likes, setLikes] = useState(post.likes);
    const [reposts, setReposts] = useState(post.reposts);
    const [crushes, setCrushes] = useState(post.crushes);
    const [isLiked, setIsLiked] = useState(false);
    const [isReposted, setIsReposted] = useState(false);
    const [isCrushed, setIsCrushed] = useState(false);

    const t = translations[lang];

    const handleInteraction = (type: 'like' | 'repost' | 'crush') => {
        if (type === 'like') {
            const newVal = isLiked ? likes - 1 : likes + 1;
            setLikes(newVal);
            setIsLiked(!isLiked);
            if (!isLiked) db.interactWithPost(post.id, 'like');
        } else if (type === 'repost') {
            const newVal = isReposted ? reposts - 1 : reposts + 1;
            setReposts(newVal);
            setIsReposted(!isReposted);
            if (!isReposted) db.interactWithPost(post.id, 'repost');
        } else if (type === 'crush') {
            const newVal = isCrushed ? crushes - 1 : crushes + 1;
            setCrushes(newVal);
            setIsCrushed(!isCrushed);
            if (!isCrushed) db.interactWithPost(post.id, 'crush');
        }
    };

    const renderBadge = (tier?: string) => {
        switch (tier) {
            case 'gold': return <BadgeCheck size={14} className="text-yellow-400 fill-yellow-900/40" />;
            case 'diamond': return <Gem size={14} className="text-red-500 fill-red-900/40" />;
            case 'blue': return <BadgeCheck size={14} className="text-blue-400 fill-blue-900/40" />;
            default: return null;
        }
    };

    return (
        <div className="bg-zinc-900/30 md:rounded-xl border-y md:border border-zinc-900 pb-4">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                    <div onClick={(e) => { e.stopPropagation(); onUserClick(post.author); }} className="relative">
                        <img src={post.author.avatar} alt={post.author.name} className="w-10 h-10 rounded-full object-cover border-2 border-black ring-1 ring-zinc-800" />
                    </div>
                    <div>
                        <h3
                            className="font-bold text-sm text-white flex items-center gap-1 hover:text-yellow-400 transition-colors cursor-pointer"
                            onClick={(e) => { e.stopPropagation(); onUserClick(post.author); }}
                        >
                            {post.author.name}
                            {renderBadge(post.author.verificationTier)}
                        </h3>
                        <div className="flex items-center text-[11px] text-zinc-500 font-medium">
                            <span>{post.location}</span>
                            <span className="mx-1">•</span>
                            <span>{post.timestamp}</span>
                        </div>
                    </div>
                </div>

                {/* Report Button */}
                <button
                    onClick={(e) => { e.stopPropagation(); /* Handle Report in Parent if needed, or simple alert */ }}
                    className="text-zinc-600 hover:text-red-500 p-2"
                    title={t.report}
                >
                    <Flag size={16} />
                </button>
            </div>

            {/* Content */}
            <div onClick={() => onPostClick(post)} className="cursor-pointer group relative">
                {post.video ? (
                    <div className="w-full aspect-[4/5] bg-black relative overflow-hidden">
                        <video src={post.video} className="w-full h-full object-cover opacity-90" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-14 h-14 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
                                <Play size={24} className="text-white fill-white ml-1" />
                            </div>
                        </div>
                    </div>
                ) : post.image ? (
                    <div className="w-full aspect-[4/5] bg-zinc-900 relative overflow-hidden">
                        <img src={post.image} alt={post.title} className="w-full h-full object-cover" loading="lazy" />
                        {post.status === 'found' && (
                            <div className="absolute top-4 right-4 bg-green-500 text-black text-xs font-black uppercase px-3 py-1.5 rounded-sm shadow-lg">
                                {t.found}
                            </div>
                        )}
                    </div>
                ) : null}

                <div className="px-4 mt-3">
                    <h2 className="text-white font-bold text-lg leading-tight mb-1">{post.title}</h2>
                    <p className="text-zinc-300 text-sm leading-relaxed line-clamp-2">
                        {post.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                        {post.tags.map(tag => (
                            <span key={tag} className="text-[11px] font-bold text-zinc-400 bg-zinc-900/80 px-2 py-1 rounded-md border border-zinc-800">
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between px-4 mt-4">
                <div className="flex gap-4">
                    {/* Starfish (Like) */}
                    <button 
                        onClick={() => handleInteraction('like')}
                        className="flex flex-col items-center gap-0.5 text-zinc-400 hover:text-yellow-400 transition-colors group"
                    >
                        <StarfishIcon 
                            className={`w-[26px] h-[26px] transition-all active:scale-90 ${isLiked ? 'text-yellow-400 fill-yellow-400' : ''}`} 
                        />
                        <span className="text-[10px] font-bold">{likes}</span>
                    </button>

                    {/* Comment */}
                    <button 
                        onClick={() => onPostClick(post)}
                        className="flex flex-col items-center gap-0.5 text-zinc-400 hover:text-white transition-colors group"
                    >
                        <MessageCircle size={26} strokeWidth={1.5} className="group-hover:text-white transition-all active:scale-90" />
                        <span className="text-[10px] font-bold">{post.comments.length}</span>
                    </button>

                    {/* Repost */}
                    <button 
                        onClick={() => handleInteraction('repost')}
                        className="flex flex-col items-center gap-0.5 text-zinc-400 hover:text-green-400 transition-colors group"
                    >
                        <Repeat2 size={26} strokeWidth={1.5} className={`transition-all active:scale-90 ${isReposted ? 'text-green-500' : ''}`} />
                        <span className="text-[10px] font-bold">{reposts}</span>
                    </button>

                    {/* Crush */}
                    <button 
                        onClick={() => handleInteraction('crush')}
                        className="flex flex-col items-center gap-0.5 text-zinc-400 hover:text-pink-500 transition-colors group"
                        title="Your My Crush"
                    >
                        <Heart size={26} strokeWidth={1.5} className={`transition-all active:scale-90 ${isCrushed ? 'text-pink-500 fill-pink-500' : ''}`} />
                        <span className="text-[10px] font-bold">{crushes}</span>
                    </button>
                </div>

                <button className="bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-black uppercase px-4 py-2 rounded-full shadow-lg transition-transform active:scale-95">
                    Saidiana
                </button>
            </div>
        </div>
    );
};

export const Feed: React.FC<FeedProps> = ({ posts, currentUser, onPostClick, onUserClick, lang }) => {
  const t = translations[lang];
  const [reportModalOpen, setReportModalOpen] = useState<boolean>(false);
  const [activeReportPost, setActiveReportPost] = useState<Post | null>(null);

  const submitReport = (reason: string) => {
    if (activeReportPost) {
        db.createReport(currentUser.id, activeReportPost.author.id, activeReportPost.id, reason);
        alert(t.reportSent);
        setReportModalOpen(false);
        setActiveReportPost(null);
    }
  };

  const canGoLive = currentUser.followers >= 100;

  // Filter blocked
  const visiblePosts = posts.filter(post => !currentUser.blockedUsers.includes(post.author.id));

  return (
    <div className="space-y-2 pb-24 bg-black min-h-screen relative">
      
      {/* Report Modal */}
      {reportModalOpen && activeReportPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
           <div className="bg-zinc-900 border border-red-900/50 w-full max-w-xs rounded-lg overflow-hidden shadow-2xl">
              <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-red-900/10">
                 <h3 className="font-bold text-red-500 uppercase tracking-wide flex items-center gap-2">
                    <Flag size={16} /> {t.report}
                 </h3>
                 <button onClick={() => setReportModalOpen(false)}><X size={20} className="text-zinc-400" /></button>
              </div>
              <div className="p-4 space-y-2">
                 <p className="text-xs text-zinc-400 mb-4 font-bold uppercase">{t.reportReason}</p>
                 {[t.spam, t.harassment, t.inappropriate, t.violence].map(reason => (
                    <button 
                        key={reason}
                        onClick={() => submitReport(reason)}
                        className="w-full text-left p-3 rounded-md bg-black border border-zinc-800 text-zinc-300 text-sm hover:bg-zinc-800 hover:text-white transition-colors"
                    >
                        {reason}
                    </button>
                 ))}
              </div>
           </div>
        </div>
      )}

      {/* Stories Tray */}
      <div className="pt-3 pb-4 border-b border-zinc-900">
          <div className="flex gap-3 overflow-x-auto no-scrollbar px-4">
             <button 
                className={`flex-shrink-0 relative w-[85px] h-[140px] rounded-xl overflow-hidden border border-zinc-800 flex flex-col items-center justify-end pb-3 transition-all active:scale-95 ${canGoLive ? 'bg-zinc-900' : 'bg-zinc-950 grayscale opacity-60'}`}
                disabled={!canGoLive}
                onClick={() => alert(canGoLive ? 'Starting Live...' : t.liveError)}
             >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 z-10"></div>
                <div className="absolute inset-0 flex items-center justify-center z-0">
                    <Video size={32} className="text-zinc-700" />
                </div>
                
                <div className="z-20 flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${canGoLive ? 'bg-yellow-400 text-black' : 'bg-zinc-800 text-zinc-500'}`}>
                        <Plus size={18} strokeWidth={3} />
                    </div>
                    <span className="text-[11px] font-bold text-white uppercase tracking-tight">{t.goLive}</span>
                </div>
             </button>

             {[1,2,3,4,5].map(i => (
                 <div key={i} className="flex-shrink-0 relative w-[85px] h-[140px] rounded-xl overflow-hidden border border-zinc-800 group cursor-pointer" onClick={() => alert('View Story')}>
                    <img src={`https://picsum.photos/200/350?random=${i}`} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/90"></div>
                    <div className="absolute top-2 left-2 z-20">
                        <div className="bg-yellow-400 text-black text-[9px] font-extrabold px-1.5 py-0.5 rounded-sm uppercase">
                            New
                        </div>
                    </div>
                    <div className="absolute bottom-3 left-0 right-0 text-center z-20 px-1">
                        <p className="text-[11px] font-bold text-white truncate drop-shadow-md">User {i}</p>
                    </div>
                    <div className="absolute inset-0 border-2 border-yellow-400 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                 </div>
             ))}
          </div>
      </div>

      {/* Market Trends */}
      <div className="px-4 py-2">
         <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={16} className="text-yellow-400" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Utabiri wa Soko</h3>
         </div>
         <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {[
                { q: "Bei ya iPhone 15 kushuka?", yes: 75, no: 25, vol: "2.5m" },
                { q: "Yanga vs Simba nani atashinda?", yes: 40, no: 60, vol: "10m" },
                { q: "Bei ya Mafuta itapanda mwezi ujao?", yes: 90, no: 10, vol: "500k" }
            ].map((market, idx) => (
                <div key={idx} className="flex-shrink-0 w-64 bg-zinc-900 border border-zinc-800 rounded-md p-3 hover:border-zinc-600 transition-colors cursor-pointer">
                    <div className="flex justify-between items-start mb-3">
                        <h4 className="text-sm font-bold text-white leading-tight pr-2">{market.q}</h4>
                        <span className="text-[10px] text-zinc-500 font-mono">Vol: {market.vol}</span>
                    </div>
                    <div className="flex gap-1 h-8">
                        <div className="flex-1 bg-green-900/30 rounded-sm relative overflow-hidden flex items-center px-2 border border-green-900/50 hover:bg-green-900/40 transition-colors">
                             <span className="relative z-10 text-xs font-bold text-green-400">Yes {market.yes}%</span>
                        </div>
                        <div className="flex-1 bg-red-900/30 rounded-sm relative overflow-hidden flex items-center justify-end px-2 border border-red-900/50 hover:bg-red-900/40 transition-colors">
                             <span className="relative z-10 text-xs font-bold text-red-400">No {market.no}%</span>
                        </div>
                    </div>
                </div>
            ))}
         </div>
      </div>

      {/* Feed Posts */}
      <div className="px-0 md:px-2 space-y-2">
          {visiblePosts.map((post) => (
              <PostItem 
                key={post.id} 
                post={post} 
                currentUser={currentUser} 
                onPostClick={onPostClick} 
                onUserClick={onUserClick} 
                lang={lang} 
              />
          ))}
      </div>
    </div>
  );
};
