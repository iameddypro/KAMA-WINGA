
import React, { useState, useEffect } from 'react';
import { User, Post, Language } from '../types';
import { db } from '../services/mockDb';
import { Search as SearchIcon, X, ArrowLeft, BadgeCheck, Gem, TrendingUp } from 'lucide-react';
import { translations } from '../utils/translations';

interface SearchProps {
  onBack: () => void;
  onUserClick: (user: User) => void;
  onPostClick: (post: Post) => void;
  lang: Language;
}

export const Search: React.FC<SearchProps> = ({ onBack, onUserClick, onPostClick, lang }) => {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'ACCOUNTS' | 'TRENDS'>('ACCOUNTS');
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const t = translations[lang];

  useEffect(() => {
    if (query.trim()) {
      setUsers(db.searchUsers(query));
      setPosts(db.searchPosts(query));
    } else {
      setUsers([]);
      setPosts([]);
    }
  }, [query]);

  const renderBadge = (tier?: string) => {
    switch (tier) {
      case 'gold': return <BadgeCheck size={14} className="text-yellow-400 fill-yellow-900/40" />;
      case 'diamond': return <Gem size={14} className="text-red-500 fill-red-900/40" />;
      case 'blue': return <BadgeCheck size={14} className="text-blue-400 fill-blue-900/40" />;
      default: return null;
    }
  };

  const trendingHashtags = ['#Kariakoo', '#SimbaVsYanga', '#BongoFleva', '#Iphone15', '#Soko', '#Biashara'];

  return (
    <div className="bg-black min-h-screen text-white font-sans animate-in fade-in duration-200">
      {/* Header */}
      <div className="sticky top-0 bg-black/95 backdrop-blur-md border-b border-zinc-900 p-3 flex items-center gap-3 z-20">
        <button onClick={onBack} className="p-2 hover:bg-zinc-900 rounded-full text-zinc-400">
          <ArrowLeft size={22} />
        </button>
        <div className="flex-1 relative">
          <SearchIcon className="absolute left-3 top-2.5 text-zinc-500" size={16} />
          <input 
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-md py-2 pl-9 pr-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-yellow-400 placeholder-zinc-600 font-bold"
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-3 top-2.5 text-zinc-500 hover:text-white">
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-900 sticky top-16 bg-black z-10">
        <button 
          onClick={() => setActiveTab('ACCOUNTS')}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-wide border-b-2 transition-colors ${activeTab === 'ACCOUNTS' ? 'border-yellow-400 text-yellow-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
        >
          {t.searchAccounts}
        </button>
        <button 
          onClick={() => setActiveTab('TRENDS')}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-wide border-b-2 transition-colors ${activeTab === 'TRENDS' ? 'border-yellow-400 text-yellow-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
        >
          {t.searchTrends}
        </button>
      </div>

      {/* Content */}
      <div className="p-0">
        {!query ? (
          <div className="p-6">
             <div className="flex items-center gap-2 mb-4 text-yellow-400">
                <TrendingUp size={18} />
                <h3 className="font-bold uppercase tracking-wide text-sm">{t.trendingNow}</h3>
             </div>
             <div className="flex flex-wrap gap-2">
                {trendingHashtags.map(tag => (
                   <button 
                     key={tag} 
                     onClick={() => { setQuery(tag.replace('#', '')); setActiveTab('TRENDS'); }}
                     className="bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-md text-zinc-300 text-xs font-bold hover:bg-zinc-800 hover:border-zinc-700"
                   >
                     {tag}
                   </button>
                ))}
             </div>
          </div>
        ) : (
          <>
            {/* Account Results */}
            {activeTab === 'ACCOUNTS' && (
              <div className="divide-y divide-zinc-900">
                 {users.length === 0 ? (
                    <div className="p-8 text-center text-zinc-500 text-sm font-bold uppercase">{t.noResults}</div>
                 ) : (
                    users.map(user => (
                       <div key={user.id} onClick={() => onUserClick(user)} className="flex items-center gap-3 p-4 hover:bg-zinc-900/50 cursor-pointer active:bg-zinc-900">
                          <img src={user.avatar} className="w-12 h-12 rounded-full border border-zinc-800 bg-zinc-900 object-cover" />
                          <div>
                             <h4 className="font-bold text-white text-sm flex items-center gap-1">
                                {user.name}
                                {renderBadge(user.verificationTier)}
                             </h4>
                             <p className="text-xs text-zinc-500 font-medium">@{user.username}</p>
                             <p className="text-[10px] text-zinc-400 mt-0.5 line-clamp-1">{user.bio}</p>
                          </div>
                       </div>
                    ))
                 )}
              </div>
            )}

            {/* Trends / Post Results */}
            {activeTab === 'TRENDS' && (
              <div className="divide-y divide-zinc-900">
                  {posts.length === 0 ? (
                    <div className="p-8 text-center text-zinc-500 text-sm font-bold uppercase">{t.noResults}</div>
                 ) : (
                    posts.map(post => (
                        <div key={post.id} onClick={() => onPostClick(post)} className="flex gap-3 p-4 hover:bg-zinc-900/50 cursor-pointer active:bg-zinc-900">
                           {post.image ? (
                               <img src={post.image} className="w-16 h-16 object-cover rounded-sm bg-zinc-900 border border-zinc-800" />
                           ) : post.video ? (
                               <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 flex items-center justify-center rounded-sm">
                                  <span className="text-[10px] uppercase font-bold text-zinc-600">Video</span>
                               </div>
                           ) : (
                               <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 flex items-center justify-center rounded-sm text-zinc-600 font-bold text-xs uppercase p-1 text-center">
                                   Text
                               </div>
                           )}
                           <div className="flex-1">
                              <h4 className="font-bold text-white text-sm line-clamp-1">{post.title}</h4>
                              <p className="text-xs text-zinc-400 line-clamp-2 mt-0.5">{post.description}</p>
                              <div className="flex gap-2 mt-2">
                                {post.tags.slice(0, 2).map(tag => (
                                    <span key={tag} className="text-[10px] text-zinc-500 font-bold uppercase">#{tag}</span>
                                ))}
                              </div>
                           </div>
                        </div>
                    ))
                 )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
