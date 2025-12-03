
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Feed } from './components/Feed';
import { CreatePost } from './components/CreatePost';
import { EditProfile } from './components/EditProfile';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Auth } from './components/Auth';
import { MemesFeed } from './components/MemesFeed';
import { Search } from './components/Search';
import { Post, ViewState, User, Comment, Meme, Language } from './types';
import { ArrowLeft, Send, BadgeCheck, ShoppingBag, Settings, Gem, MapPin, Phone, Shield, LogOut, MessageSquare, UserPlus, Check, Calendar as CalendarIcon, Cookie, Ban, Globe, ChevronDown } from 'lucide-react';
import { db } from './services/mockDb';
import { translations } from './utils/translations';

// Helper to render badges
const renderBadge = (tier?: string, size = 16) => {
  switch (tier) {
    case 'gold':
      return <BadgeCheck size={size} className="text-yellow-400 fill-yellow-900/40" />;
    case 'diamond':
      return <Gem size={size} className="text-red-500 fill-red-900/40" />;
    case 'blue':
      return <BadgeCheck size={size} className="text-blue-400 fill-blue-900/40" />;
    default:
      return null;
  }
};

const formatCount = (num?: number) => {
  if (!num) return '0';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toLocaleString();
};

// Cookie Consent Component
const CookieConsent = ({ lang }: { lang: Language }) => {
    const [accepted, setAccepted] = useState(true);
    const t = translations[lang];

    useEffect(() => {
        const hasAccepted = localStorage.getItem('kamaWingaCookies');
        if (!hasAccepted) {
            setAccepted(false);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('kamaWingaCookies', 'true');
        setAccepted(true);
    };

    if (accepted) return null;

    return (
        <div className="fixed bottom-20 left-4 right-4 bg-zinc-900 border border-yellow-400/30 p-4 rounded-lg shadow-2xl z-50 flex items-center justify-between gap-4 animate-in slide-in-from-bottom-10 fade-in duration-500">
            <div className="flex items-center gap-3">
                <div className="bg-yellow-400/10 p-2 rounded-full">
                   <Cookie size={20} className="text-yellow-400" />
                </div>
                <p className="text-xs text-white font-medium">{t.cookiesMsg}</p>
            </div>
            <button 
                onClick={handleAccept}
                className="bg-yellow-400 text-black text-xs font-bold px-4 py-2 rounded-md uppercase tracking-wide hover:bg-yellow-300 transition-colors"
            >
                {t.accept}
            </button>
        </div>
    );
};

// Generic Profile Component (Used for "Me" and "Others")
interface ProfileViewProps {
  user: User;
  currentUser?: User;
  isOwnProfile: boolean;
  onEditProfile?: () => void;
  onOpenAdmin?: () => void;
  onLogout?: () => void;
  onBack?: () => void;
  onFollowToggle?: () => void;
  onBlockToggle?: () => void;
  lang: Language;
  setLang?: (lang: Language) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ 
  user, 
  currentUser,
  isOwnProfile, 
  onEditProfile, 
  onOpenAdmin, 
  onLogout, 
  onBack, 
  onFollowToggle,
  onBlockToggle,
  lang,
  setLang
}) => {
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const t = translations[lang];

  useEffect(() => {
    setUserPosts(db.getUserPosts(user.id));
    if (currentUser && !isOwnProfile) {
        setIsFollowing(db.isFollowing(currentUser.id, user.id));
        setIsBlocked(currentUser.blockedUsers.includes(user.id));
    }
  }, [user.id, currentUser, isOwnProfile, user.followers]); // user.followers in dep array ensures UI update on follow/unfollow

  const languages = [
      { code: 'sw', label: 'Kiswahili 🇹🇿' },
      { code: 'en', label: 'English 🇺🇸' }
  ];

  return (
    <div className="bg-black min-h-[80vh] pb-24 text-white font-sans">
      {/* Header for other profiles */}
      {!isOwnProfile && (
        <div className="sticky top-0 bg-black/95 z-20 p-4 border-b border-zinc-900 flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-zinc-800 rounded-md text-zinc-400">
            <ArrowLeft size={24} />
          </button>
          <span className="font-bold text-lg text-white uppercase tracking-tight">@{user.username || user.name}</span>
        </div>
      )}

      <div className="p-6">
        {isOwnProfile && (
          <div className="flex justify-end mb-2">
            <button onClick={onLogout} className="p-2 bg-zinc-900 text-red-500 rounded-md hover:bg-zinc-800 border border-zinc-800" title="Log Out">
              <LogOut size={20} />
            </button>
          </div>
        )}
        
        <div className="flex flex-col items-center mb-8 relative">
          <img src={user.avatar} alt={user.name} className={`w-28 h-28 rounded-full object-cover border-4 border-black ring-2 ring-zinc-800 mb-4 shadow-sm z-10 bg-zinc-900 ${isBlocked ? 'grayscale opacity-50' : ''}`} />
          
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-white text-center">{user.name}</h2>
            {renderBadge(user.verificationTier, 24)}
          </div>
          {user.username && <p className="text-zinc-500 text-sm mb-1 font-medium">@{user.username}</p>}
          
          {user.verificationTier && (
            <div className={`mt-3 px-3 py-1 rounded-sm text-[10px] uppercase font-bold tracking-wider border flex items-center gap-1 
              ${user.verificationTier === 'diamond' ? 'bg-red-900/20 text-red-400 border-red-900/40' : 
                user.verificationTier === 'gold' ? 'bg-yellow-900/20 text-yellow-400 border-yellow-900/40' : 
                'bg-blue-900/20 text-blue-400 border-blue-900/40'}`}>
              {renderBadge(user.verificationTier, 12)} {user.verificationTier.toUpperCase()}
            </div>
          )}

          {/* Bio Section */}
          {user.bio && !isBlocked && (
            <p className="text-center text-zinc-300 text-sm mt-4 max-w-xs leading-relaxed font-medium">
              {user.bio}
            </p>
          )}

          {isBlocked && (
             <div className="mt-4 px-4 py-2 bg-red-900/20 border border-red-900/50 rounded-md text-red-500 text-xs font-bold uppercase tracking-wide flex items-center gap-2">
                 <Ban size={14} /> {t.userBlocked}
             </div>
          )}

          {/* Details (Location & Phone) */}
          {!isBlocked && (
            <div className="flex flex-wrap justify-center gap-3 mt-4">
                {user.location && (
                <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-zinc-400 bg-zinc-900 px-3 py-1.5 rounded-md border border-zinc-800">
                    <MapPin size={12} /> {user.location}
                </div>
                )}
                {user.phoneNumber && (
                <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-zinc-400 bg-zinc-900 px-3 py-1.5 rounded-md border border-zinc-800">
                    <Phone size={12} /> {user.phoneNumber}
                </div>
                )}
                {user.joinedDate && (
                <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-zinc-400 bg-zinc-900 px-3 py-1.5 rounded-md border border-zinc-800">
                    <CalendarIcon size={12} /> Joined {user.joinedDate}
                </div>
                )}
            </div>
          )}
          
          {/* Stats Grid - Financial Data Style */}
          {!isBlocked && (
            <div className="grid grid-cols-4 gap-0 mt-8 w-full border-y border-zinc-800 divide-x divide-zinc-800 bg-zinc-900/20">
                <div className="text-center py-4">
                <span className="block text-xl font-extrabold text-white">{userPosts.length}</span>
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">{t.posts}</span>
                </div>
                <div className="text-center py-4">
                <span className="block text-xl font-extrabold text-white">{formatCount(user.followers)}</span>
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">{t.followers}</span>
                </div>
                <div className="text-center py-4">
                <span className="block text-xl font-extrabold text-white">{formatCount(user.following)}</span>
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">{t.following}</span>
                </div>
                <div className="text-center py-4">
                <span className="block text-xl font-extrabold text-white">82</span>
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Found</span>
                </div>
            </div>
          )}
        </div>

        {/* Buttons Section */}
        <div className="space-y-3 mt-6">
          {isOwnProfile ? (
            <>
               {user.role === 'admin' && (
                  <button 
                    onClick={onOpenAdmin}
                    className="w-full flex items-center gap-3 p-4 bg-zinc-900 text-white rounded-xl border border-zinc-800 hover:bg-zinc-800 transition-colors group"
                  >
                    <div className="text-zinc-400 group-hover:text-yellow-400 transition-colors"><Shield size={24} /></div>
                    <div className="text-left">
                      <span className="block font-bold text-sm uppercase">{t.adminPanel}</span>
                    </div>
                  </button>
                )}

                <button className="w-full flex items-center gap-3 p-4 bg-zinc-900 border border-zinc-800 rounded-xl hover:bg-zinc-800 transition-colors group">
                  <div className="text-zinc-400 group-hover:text-yellow-400 transition-colors"><ShoppingBag size={24} /></div>
                  <div className="text-left">
                    <span className="block font-bold text-sm uppercase text-white">{t.myShop}</span>
                  </div>
                </button>
                
                <button 
                  onClick={onEditProfile}
                  className="w-full flex items-center gap-3 p-4 bg-zinc-900 rounded-xl hover:bg-zinc-800 transition-colors border border-zinc-800 group"
                >
                  <div className="text-zinc-400 group-hover:text-white"><Settings size={24} /></div>
                  <div className="text-left">
                    <span className="block font-bold text-sm uppercase text-white">{t.editProfile}</span>
                  </div>
                </button>

                {/* Language Selector in Profile */}
                <div className="relative group w-full mt-4 border-t border-zinc-800 pt-4">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">{t.switchLang}</label>
                    <div className="relative">
                        <Globe size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <select 
                            value={lang} 
                            onChange={(e) => setLang && setLang(e.target.value as Language)}
                            className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm font-bold appearance-none cursor-pointer hover:bg-zinc-800 focus:outline-none focus:border-yellow-400 transition-colors"
                        >
                            {languages.map(l => (
                                <option key={l.code} value={l.code}>{l.label}</option>
                            ))}
                        </select>
                        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                    </div>
                </div>
            </>
          ) : (
            <div className="space-y-4">
                {!isBlocked && (
                    <div className="flex gap-3">
                    <button 
                        onClick={onFollowToggle}
                        className={`flex-1 font-bold py-3.5 rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 border uppercase tracking-wide text-xs
                            ${isFollowing 
                                ? 'bg-zinc-900 text-zinc-400 border-zinc-800' 
                                : 'bg-yellow-400 text-black border-yellow-400 hover:bg-yellow-300'
                            }`}
                    >
                        {isFollowing ? (
                            <>
                                <Check size={18} /> {t.unfollow}
                            </>
                        ) : (
                            <>
                                <UserPlus size={18} /> {t.follow}
                            </>
                        )}
                    </button>
                    <button className="flex-1 bg-zinc-900 text-white border border-zinc-800 font-bold py-3.5 rounded-xl active:scale-[0.98] transition-transform flex items-center justify-center gap-2 hover:bg-zinc-800 uppercase tracking-wide text-xs">
                        <MessageSquare size={18} /> {t.message}
                    </button>
                    </div>
                )}
                
                {/* Block Button */}
                <button 
                    onClick={onBlockToggle}
                    className={`w-full py-3 rounded-xl font-bold uppercase tracking-wide text-xs flex items-center justify-center gap-2 border transition-colors
                    ${isBlocked 
                        ? 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white' 
                        : 'bg-transparent text-red-500 border-red-900/30 hover:bg-red-900/10'
                    }`}
                >
                    <Ban size={16} /> {isBlocked ? t.unblock : t.block}
                </button>
            </div>
          )}
        </div>

        {/* User's Posts Grid (Mini Feed) */}
        {!isBlocked ? (
            <div className="mt-8">
            <h3 className="font-bold text-zinc-400 mb-4 text-xs uppercase tracking-widest">{t.posts}</h3>
            <div className="grid grid-cols-3 gap-1">
                {userPosts.length > 0 ? (
                    userPosts.map(p => (
                        <div key={p.id} className="aspect-[4/5] bg-zinc-900 relative overflow-hidden rounded-sm border border-zinc-800 hover:border-zinc-600 transition-colors">
                        {p.image ? (
                            <img src={p.image} className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity" />
                        ) : p.video ? (
                            <video src={p.video} className="w-full h-full object-cover opacity-90" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-zinc-600 p-2 text-center bg-zinc-900 font-bold uppercase">
                                {p.title}
                            </div>
                        )}
                        </div>
                    ))
                ) : (
                    <div className="col-span-3 py-12 text-center text-zinc-600 text-sm bg-zinc-900/50 rounded-md border border-zinc-900 border-dashed uppercase font-bold tracking-wide">
                        Empty
                    </div>
                )}
            </div>
            </div>
        ) : (
            <div className="mt-12 text-center text-zinc-600 text-sm uppercase font-bold tracking-wide">
                {t.blockedMsg}
            </div>
        )}

        {/* Footer Copyright */}
        <div className="mt-12 mb-4 text-center">
            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
                &copy; {t.rightsReserved} {t.by} Kama Winga 2025
            </p>
        </div>
      </div>
    </div>
  );
};

// Post Detail View
const PostDetailView = ({ post, onBack, onAddComment, onUserClick, lang }: { post: Post, onBack: () => void, onAddComment: (text: string) => void, onUserClick: (user: User) => void, lang: Language }) => {
  const [commentText, setCommentText] = useState('');
  const t = translations[lang];

  const handleSend = () => {
    if (commentText.trim()) {
      onAddComment(commentText);
      setCommentText('');
    }
  };

  return (
    <div className="bg-black min-h-screen pb-24 text-white font-sans">
      <div className="sticky top-0 bg-black/95 backdrop-blur-sm z-20 p-4 border-b border-zinc-900 flex items-center gap-3">
        <button onClick={onBack} className="p-2 hover:bg-zinc-800 rounded-md text-zinc-400">
          <ArrowLeft size={24} />
        </button>
        <h3 className="font-bold uppercase tracking-wide text-sm">{t.post}</h3>
      </div>
      
      <div className="p-0">
         {/* Media Full Width */}
        {post.image ? (
          <img src={post.image} className="w-full aspect-[4/5] object-cover mb-4 border-b border-zinc-900" />
        ) : post.video ? (
          <video src={post.video} className="w-full aspect-[4/5] object-cover mb-4 border-b border-zinc-900" controls />
        ) : null}

        <div className="px-4">
             {/* Author */}
            <div className="flex items-center gap-3 mb-4 cursor-pointer" onClick={() => onUserClick(post.author)}>
            <img src={post.author.avatar} className="w-10 h-10 rounded-full border border-zinc-800 object-cover" />
            <div>
                <h4 className="font-bold flex items-center gap-1 text-white text-sm hover:text-yellow-400 transition-colors">
                {post.author.name}
                {renderBadge(post.author.verificationTier, 14)}
                </h4>
                <span className="text-xs text-zinc-500 font-medium">{post.timestamp} • {post.location}</span>
            </div>
            </div>

            <h2 className="text-lg font-bold mb-2 text-white">{post.title}</h2>
            <p className="text-zinc-300 mb-6 leading-relaxed text-sm font-medium">{post.description}</p>

            {/* Comments Section */}
            <div className="border-t border-zinc-900 pt-6">
            <h4 className="font-bold text-zinc-400 mb-4 flex items-center gap-2 text-xs uppercase tracking-widest">
                {t.comments} <span className="bg-zinc-900 text-white px-2 py-0.5 rounded-sm border border-zinc-800">{post.comments.length}</span>
            </h4>
            
            <div className="space-y-4 mb-20">
                {post.comments.length === 0 ? (
                <p className="text-center text-zinc-600 py-8 text-sm uppercase font-bold tracking-wide">No comments yet</p>
                ) : (
                post.comments.map(comment => (
                    <div key={comment.id} className="flex gap-3">
                    <div onClick={() => onUserClick(comment.user)}>
                        <img src={comment.user.avatar} className="w-9 h-9 rounded-full flex-shrink-0 border border-zinc-800 object-cover" />
                    </div>
                    <div className="bg-zinc-900/50 p-3 rounded-xl flex-1 border border-zinc-900">
                        <div className="flex justify-between items-start mb-1">
                        <span 
                            className="font-bold text-xs flex items-center gap-1 text-white hover:text-yellow-400 cursor-pointer"
                            onClick={() => onUserClick(comment.user)}
                        >
                            {comment.user.name}
                            {renderBadge(comment.user.verificationTier, 12)}
                        </span>
                        <span className="text-[10px] text-zinc-600 font-medium">{comment.timestamp}</span>
                        </div>
                        <p className="text-sm text-zinc-300">{comment.text}</p>
                    </div>
                    </div>
                ))
                )}
            </div>
            </div>
        </div>
      </div>

      {/* Input */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-md border-t border-zinc-900 p-3 pb-8 max-w-md mx-auto">
        <div className="flex items-center gap-2">
          <input 
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="flex-1 bg-zinc-900 rounded-full px-5 py-3 focus:outline-none focus:ring-1 focus:ring-yellow-400 text-sm text-white placeholder-zinc-500 border border-zinc-800 font-medium"
            placeholder={t.writeComment}
          />
          <button 
            onClick={handleSend}
            disabled={!commentText.trim()}
            className="p-3 bg-yellow-400 text-black rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-yellow-300 transition-colors font-bold shadow-lg shadow-yellow-900/20"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export function App() {
  const [view, setView] = useState<ViewState>(ViewState.FEED);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [memes, setMemes] = useState<Meme[]>([]);
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<User | null>(null);
  
  // App Config State
  const [appLogo, setAppLogo] = useState(db.getAppConfig().logo);

  // Initialize Language from LocalStorage or default to 'sw'
  const [lang, setLang] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('kamaWingaLang');
        // Simple check to ensure type safety, in a real app check against available keys
        if (saved) return saved as Language;
    }
    return 'sw';
  });

  // Save language preference whenever it changes
  useEffect(() => {
    localStorage.setItem('kamaWingaLang', lang);
  }, [lang]);

  // Initialize data from DB
  useEffect(() => {
    // Only fetch posts, do not auto-login
    if (currentUser) {
        setPosts(db.getPosts(currentUser.id));
    } else {
        setPosts(db.getPosts());
    }
    setMemes(db.getMemes());
  }, [currentUser, view]); // Re-fetch when view changes to update filtered blocked posts

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setView(ViewState.FEED);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView(ViewState.FEED);
  };
  
  const handleLogoUpdate = (newLogo: string) => {
    setAppLogo(newLogo);
  };

  const handleCreatePost = (data: any) => {
    if (!currentUser) return;
    
    const newPost: Post = {
      id: Date.now().toString(),
      author: currentUser,
      image: data.image,
      video: data.video,
      title: data.title,
      description: data.description,
      location: data.location,
      tags: data.tags,
      likes: 0,
      reposts: 0,
      crushes: 0,
      comments: [],
      timestamp: 'Just now',
      status: 'open'
    };
    
    db.createPost(newPost);
    setPosts(db.getPosts(currentUser.id));
    setView(ViewState.FEED);
  };

  const handlePostClick = (post: Post) => {
    setActivePostId(post.id);
    setView(ViewState.DETAIL);
  };

  const handleUserClick = (user: User) => {
    // If clicking own profile in feed, go to main profile view
    if (currentUser && user.id === currentUser.id) {
        setView(ViewState.PROFILE);
    } else {
        setSelectedProfile(user);
        setView(ViewState.USER_PROFILE);
    }
  };

  const handleAddComment = (text: string) => {
    if (!activePostId || !currentUser) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      user: currentUser,
      text,
      timestamp: 'Just now'
    };

    db.addComment(activePostId, newComment);
    setPosts(db.getPosts(currentUser.id));
  };

  const handleUpdateProfile = (updatedUser: User) => {
    const saved = db.updateUser(updatedUser);
    setCurrentUser(saved);
    setView(ViewState.PROFILE);
  };

  const handleFollowToggle = () => {
    if (!currentUser || !selectedProfile) return;

    const isFollowing = db.isFollowing(currentUser.id, selectedProfile.id);
    let updatedTargetProfile;

    if (isFollowing) {
        updatedTargetProfile = db.unfollowUser(currentUser.id, selectedProfile.id);
    } else {
        updatedTargetProfile = db.followUser(currentUser.id, selectedProfile.id);
    }

    // IMPORTANT: Update the view of the person we are looking at (shows new follower count)
    setSelectedProfile(updatedTargetProfile);
    
    // IMPORTANT: Sync my own state (my 'following' count changed)
    const freshMe = db.getUserById(currentUser.id);
    if (freshMe) {
        setCurrentUser(freshMe);
    }
  };

  const handleBlockToggle = () => {
    if (!currentUser || !selectedProfile) return;
    const isBlocked = currentUser.blockedUsers.includes(selectedProfile.id);
    
    let updatedTargetProfile;
    if (isBlocked) {
        updatedTargetProfile = db.unblockUser(currentUser.id, selectedProfile.id);
    } else {
        updatedTargetProfile = db.blockUser(currentUser.id, selectedProfile.id);
    }
    
    // Refresh Current User (Block list changed)
    const freshMe = db.getUserById(currentUser.id);
    if (freshMe) setCurrentUser(freshMe);
    
    // Refresh Target (Follower count might have changed due to block logic)
    setSelectedProfile(updatedTargetProfile);
  };

  // Auth Guard
  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto shadow-none min-h-screen bg-black relative border-x border-zinc-800">
        <Auth onLoginSuccess={handleLoginSuccess} lang={lang} setLang={setLang} logo={appLogo} />
        <CookieConsent lang={lang} />
      </div>
    );
  }

  // Render Logic
  const renderContent = () => {
    switch (view) {
      case ViewState.ADMIN_DASHBOARD:
        return <AdminDashboard currentUser={currentUser} onExit={() => setView(ViewState.PROFILE)} onUpdateLogo={handleLogoUpdate} />;
      case ViewState.CREATE:
        return <CreatePost onCancel={() => setView(ViewState.FEED)} onSubmit={handleCreatePost} lang={lang} />;
      case ViewState.EDIT_PROFILE:
        return <EditProfile user={currentUser} onSave={handleUpdateProfile} onCancel={() => setView(ViewState.PROFILE)} />;
      case ViewState.PROFILE:
        return <ProfileView 
          user={currentUser}
          isOwnProfile={true}
          onEditProfile={() => setView(ViewState.EDIT_PROFILE)} 
          onOpenAdmin={() => setView(ViewState.ADMIN_DASHBOARD)}
          onLogout={handleLogout}
          lang={lang}
          setLang={setLang}
        />;
      case ViewState.USER_PROFILE:
        if (!selectedProfile) return <div>User not found</div>;
        return <ProfileView 
           user={selectedProfile}
           currentUser={currentUser}
           isOwnProfile={selectedProfile.id === currentUser.id}
           onBack={() => setView(ViewState.FEED)}
           onFollowToggle={handleFollowToggle}
           onBlockToggle={handleBlockToggle}
           lang={lang}
        />;
      case ViewState.MEMES:
        return <MemesFeed memes={memes} />;
      case ViewState.SEARCH:
        return <Search 
            onBack={() => setView(ViewState.FEED)} 
            onUserClick={handleUserClick} 
            onPostClick={handlePostClick} 
            lang={lang} 
        />;
      case ViewState.DETAIL:
        const post = posts.find(p => p.id === activePostId);
        if (!post) return <div onClick={() => setView(ViewState.FEED)}>Post not found</div>;
        return <PostDetailView post={post} onBack={() => setView(ViewState.FEED)} onAddComment={handleAddComment} onUserClick={handleUserClick} lang={lang} />;
      case ViewState.FEED:
      default:
        return <Feed posts={posts} currentUser={currentUser} onPostClick={handlePostClick} onUserClick={handleUserClick} lang={lang} />;
    }
  };

  // Full Screen Views (No Bottom Nav)
  if (view === ViewState.DETAIL || view === ViewState.EDIT_PROFILE || view === ViewState.ADMIN_DASHBOARD || view === ViewState.USER_PROFILE || view === ViewState.SEARCH) {
    return (
        <div className="max-w-md mx-auto shadow-none min-h-screen bg-black relative border-x border-zinc-800">
           <div className={view === ViewState.ADMIN_DASHBOARD ? "w-full h-full" : ""}>
              {renderContent()}
           </div>
           <CookieConsent lang={lang} />
        </div>
    );
  }

  return (
    <Layout currentView={view} setView={setView} lang={lang} logo={appLogo}>
      {renderContent()}
      <CookieConsent lang={lang} />
    </Layout>
  );
}