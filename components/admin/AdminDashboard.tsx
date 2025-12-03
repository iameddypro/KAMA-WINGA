
import React, { useState, useEffect, useRef } from 'react';
import { User, Post, Report } from '../../types';
import { db } from '../../services/mockDb';
import { 
  LayoutDashboard, Users, FileText, Ban, CheckCircle, 
  Trash2, Shield, Search, ArrowLeft, BadgeCheck, Flag, AlertTriangle, Settings, Upload, Save
} from 'lucide-react';

interface AdminDashboardProps {
  currentUser: User;
  onExit: () => void;
  onUpdateLogo?: (newLogo: string) => void;
}

type AdminView = 'OVERVIEW' | 'USERS' | 'POSTS' | 'REPORTS' | 'SETTINGS';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ currentUser, onExit, onUpdateLogo }) => {
  const [currentView, setCurrentView] = useState<AdminView>('OVERVIEW');
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalPosts: 0, verifiedUsers: 0, activeNow: 0, pendingReports: 0 });
  const [appLogo, setAppLogo] = useState(db.getAppConfig().logo);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Refresh data
  const refreshData = () => {
    setUsers(db.getUsers());
    setPosts(db.getPosts());
    setReports(db.getReports());
    setStats(db.getStats());
  };

  useEffect(() => {
    refreshData();
  }, []);

  // --- Handlers ---
  const handleToggleBan = (userId: string) => {
    if (confirm('Are you sure you want to change this user status?')) {
      db.toggleUserStatus(userId);
      refreshData();
    }
  };

  const handleDeleteUser = (userId: string) => {
      if (confirm('DANGER: This will permanently delete the user and all their data. Continue?')) {
          db.deleteUser(userId);
          refreshData();
      }
  };

  const handleVerify = (userId: string, tier: User['verificationTier']) => {
    db.updateVerification(userId, tier);
    refreshData();
  };

  const handleDeletePost = (postId: string) => {
    if (confirm('Permanently delete this post?')) {
      db.deletePost(postId);
      refreshData();
    }
  };

  const resolveReport = (reportId: string, action: 'dismiss' | 'ban' | 'delete_post' | 'delete_user') => {
      db.resolveReport(reportId, action);
      refreshData();
  };
  
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setAppLogo(base64);
        db.updateAppLogo(base64);
        if (onUpdateLogo) onUpdateLogo(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  // --- Sub-components ---
  
  const SidebarItem = ({ view, icon: Icon, label, alertCount }: { view: AdminView, icon: any, label: string, alertCount?: number }) => (
    <button 
      onClick={() => setCurrentView(view)}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-md transition-colors text-sm font-bold uppercase tracking-wide ${currentView === view ? 'bg-yellow-400 text-black' : 'text-zinc-500 hover:bg-zinc-900 hover:text-white'}`}
    >
      <div className="flex items-center gap-3">
        <Icon size={18} />
        <span>{label}</span>
      </div>
      {alertCount && alertCount > 0 ? (
          <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">{alertCount}</span>
      ) : null}
    </button>
  );

  const StatCard = ({ label, value, icon: Icon, color }: any) => (
    <div className="bg-zinc-900 p-5 rounded-md border border-zinc-800 flex items-center justify-between">
      <div>
        <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mb-1">{label}</p>
        <h3 className="text-2xl font-bold text-white font-mono">{value}</h3>
      </div>
      <div className={`p-2 rounded-sm ${color} bg-opacity-20`}>
        <Icon size={20} className={color.replace('bg-', 'text-')} />
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-black text-white font-sans">
      {/* Sidebar - Hidden on mobile usually, but visible here for admin context */}
      <aside className="w-64 bg-black border-r border-zinc-800 hidden md:flex flex-col p-4">
        <div className="flex items-center gap-3 mb-8 px-2">
           {appLogo ? (
             <img src={appLogo} alt="Logo" className="h-8 w-auto object-contain" />
           ) : (
             <div className="w-8 h-8 bg-yellow-400 rounded-sm flex items-center justify-center text-black font-extrabold">A</div>
           )}
           <h1 className="font-bold text-white text-lg tracking-tight">Admin Panel</h1>
        </div>

        <nav className="space-y-1 flex-1">
          <SidebarItem view="OVERVIEW" icon={LayoutDashboard} label="Overview" />
          <SidebarItem view="REPORTS" icon={Flag} label="Reports" alertCount={stats.pendingReports} />
          <SidebarItem view="USERS" icon={Users} label="Users & Sellers" />
          <SidebarItem view="POSTS" icon={FileText} label="Content" />
          <SidebarItem view="SETTINGS" icon={Settings} label="Settings" />
        </nav>

        <div className="pt-4 border-t border-zinc-800">
          <div className="flex items-center gap-3 px-3 py-2 bg-zinc-900 rounded-md mb-3 border border-zinc-800">
            <img src={currentUser.avatar} className="w-8 h-8 rounded-full border border-zinc-700" />
            <div className="overflow-hidden">
               <p className="text-sm font-bold truncate text-white">{currentUser.name}</p>
               <p className="text-[10px] text-yellow-500 uppercase font-bold">Super Admin</p>
            </div>
          </div>
          <button onClick={onExit} className="w-full flex items-center gap-2 text-zinc-500 hover:text-white px-3 py-2 text-xs font-bold uppercase tracking-wide transition-colors">
            <ArrowLeft size={14} /> Exit to App
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-black">
        <header className="bg-black border-b border-zinc-800 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="md:hidden flex items-center gap-2">
             <button onClick={onExit}><ArrowLeft className="text-zinc-400" /></button>
             <span className="font-bold uppercase tracking-wide">Admin</span>
          </div>
          <h2 className="text-lg font-bold text-white hidden md:block uppercase tracking-wide">
            {currentView}
          </h2>
          <div className="flex items-center gap-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 flex items-center gap-2 text-zinc-500 text-sm w-48">
               <Search size={14} />
               <input placeholder="SEARCH..." className="bg-transparent focus:outline-none w-full text-white placeholder-zinc-600 text-xs font-bold" />
            </div>
          </div>
        </header>

        <div className="p-6">
          {currentView === 'OVERVIEW' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Total Users" value={stats.totalUsers} icon={Users} color="text-blue-500" />
                <StatCard label="Verified Sellers" value={stats.verifiedUsers} icon={BadgeCheck} color="text-yellow-500" />
                <StatCard label="Active Reports" value={stats.pendingReports} icon={AlertTriangle} color="text-red-500" />
                <StatCard label="Active Now" value={stats.activeNow} icon={Shield} color="text-green-500" />
              </div>

              <div className="bg-zinc-900 p-6 rounded-md border border-zinc-800">
                <h3 className="font-bold text-sm uppercase tracking-wide text-zinc-400 mb-4">System Status</h3>
                <div className="flex gap-4">
                  <span className="px-3 py-1 bg-green-900/20 text-green-500 border border-green-900/30 rounded-sm text-[10px] font-bold uppercase flex items-center gap-1"><CheckCircle size={12} /> Database Connected</span>
                  <span className="px-3 py-1 bg-green-900/20 text-green-500 border border-green-900/30 rounded-sm text-[10px] font-bold uppercase flex items-center gap-1"><CheckCircle size={12} /> Redis Cache OK</span>
                </div>
              </div>
            </div>
          )}
          
          {currentView === 'SETTINGS' && (
              <div className="max-w-2xl bg-zinc-900 border border-zinc-800 rounded-md p-6">
                 <h3 className="font-bold text-lg text-white mb-6 uppercase tracking-wide border-b border-zinc-800 pb-2">Branding & Logo</h3>
                 
                 <div className="flex flex-col gap-6">
                    <div className="flex items-start gap-6">
                        <div className="w-32 h-32 bg-black border-2 border-dashed border-zinc-700 rounded-md flex items-center justify-center relative">
                            {appLogo ? (
                                <img src={appLogo} alt="Current Logo" className="max-w-full max-h-full object-contain p-2" />
                            ) : (
                                <span className="text-zinc-600 text-xs font-bold">No Logo</span>
                            )}
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-white text-sm uppercase mb-2">Upload Website Logo</h4>
                            <p className="text-xs text-zinc-500 mb-4">Upload a transparent PNG for best results. This logo will appear on the login screen, header, and admin panel.</p>
                            
                            <input 
                                type="file" 
                                ref={fileInputRef}
                                onChange={handleLogoUpload}
                                className="hidden" 
                                accept="image/png, image/jpeg, image/svg+xml"
                            />
                            
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-sm text-xs font-bold uppercase flex items-center gap-2 transition-colors border border-zinc-700"
                            >
                                <Upload size={14} /> Choose File
                            </button>
                        </div>
                    </div>
                    
                    <div className="flex justify-end pt-4 border-t border-zinc-800">
                        <button className="bg-yellow-400 hover:bg-yellow-300 text-black px-6 py-2 rounded-sm text-xs font-bold uppercase flex items-center gap-2">
                            <Save size={14} /> Save Changes
                        </button>
                    </div>
                 </div>
              </div>
          )}

          {currentView === 'REPORTS' && (
             <div className="space-y-4">
                {reports.length === 0 ? (
                    <div className="text-zinc-500 text-center py-12 bg-zinc-900 border border-zinc-800 border-dashed rounded-md uppercase font-bold">No Reports Found</div>
                ) : (
                    reports.map(report => (
                        <div key={report.id} className={`p-4 rounded-md border border-zinc-800 flex flex-col md:flex-row gap-4 ${report.status === 'pending' ? 'bg-zinc-900' : 'bg-zinc-950 opacity-60'}`}>
                           <div className="flex-1">
                               <div className="flex items-center gap-2 mb-2">
                                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-sm ${report.status === 'pending' ? 'bg-red-900/20 text-red-500' : 'bg-zinc-800 text-zinc-500'}`}>{report.status}</span>
                                  <span className="text-zinc-500 text-xs">{new Date(report.timestamp).toLocaleDateString()}</span>
                               </div>
                               <h3 className="text-white font-bold text-sm mb-1">Reason: <span className="text-red-400">{report.reason}</span></h3>
                               <p className="text-zinc-400 text-xs">Reported User: <span className="text-white font-bold">{report.reportedUserName}</span></p>
                               {report.postTitle && <p className="text-zinc-400 text-xs">Post: "{report.postTitle}"</p>}
                           </div>
                           
                           {report.status === 'pending' && (
                               <div className="flex gap-2 items-center">
                                    <button onClick={() => resolveReport(report.id, 'dismiss')} className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold uppercase rounded-sm">Dismiss</button>
                                    {report.postId && (
                                        <button onClick={() => resolveReport(report.id, 'delete_post')} className="px-3 py-2 bg-red-900/20 hover:bg-red-900/40 border border-red-900/30 text-red-400 text-xs font-bold uppercase rounded-sm">Delete Post</button>
                                    )}
                                    <button onClick={() => resolveReport(report.id, 'ban')} className="px-3 py-2 bg-red-900/20 hover:bg-red-900/40 border border-red-900/30 text-red-400 text-xs font-bold uppercase rounded-sm">Ban User</button>
                                    <button onClick={() => resolveReport(report.id, 'delete_user')} className="px-3 py-2 bg-red-600 hover:bg-red-700 text-black text-xs font-bold uppercase rounded-sm">Delete Account</button>
                               </div>
                           )}
                        </div>
                    ))
                )}
             </div>
          )}

          {currentView === 'USERS' && (
            <div className="bg-zinc-900 rounded-md border border-zinc-800 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-black border-b border-zinc-800">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">User</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Role / Tier</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {users.map(user => (
                    <tr key={user.id} className="hover:bg-zinc-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={user.avatar} className="w-8 h-8 rounded-full border border-zinc-700" />
                          <div>
                            <div className="font-bold text-white text-sm">{user.name}</div>
                            <div className="text-xs text-zinc-500 font-mono">@{user.username || user.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-sm bg-zinc-800 text-zinc-400 block w-fit uppercase">{user.role || 'user'}</span>
                          {user.verificationTier && (
                             <span className={`text-[10px] font-bold flex items-center gap-1 uppercase 
                               ${user.verificationTier === 'diamond' ? 'text-red-500' : user.verificationTier === 'gold' ? 'text-yellow-500' : 'text-blue-500'}`}>
                               <BadgeCheck size={10} /> {user.verificationTier}
                             </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wide ${user.status === 'suspended' ? 'bg-red-900/20 text-red-500' : 'bg-green-900/20 text-green-500'}`}>
                          {user.status || 'active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                           {/* Verification Dropdown Sim */}
                           <div className="group relative">
                              <button className="p-1.5 hover:bg-zinc-800 rounded text-zinc-500"><BadgeCheck size={16} /></button>
                              <div className="absolute right-0 top-full mt-1 bg-zinc-900 shadow-xl rounded-md p-2 border border-zinc-700 z-50 hidden group-hover:block w-32">
                                <button onClick={() => handleVerify(user.id, 'blue')} className="w-full text-left px-3 py-2 hover:bg-zinc-800 text-xs text-blue-500 font-bold uppercase">Blue Badge</button>
                                <button onClick={() => handleVerify(user.id, 'gold')} className="w-full text-left px-3 py-2 hover:bg-zinc-800 text-xs text-yellow-500 font-bold uppercase">Gold Badge</button>
                                <button onClick={() => handleVerify(user.id, 'diamond')} className="w-full text-left px-3 py-2 hover:bg-zinc-800 text-xs text-red-500 font-bold uppercase">Diamond</button>
                                <button onClick={() => handleVerify(user.id, undefined)} className="w-full text-left px-3 py-2 hover:bg-zinc-800 text-xs text-zinc-500 font-bold uppercase">Remove</button>
                              </div>
                           </div>
                           <button 
                            onClick={() => handleToggleBan(user.id)}
                            className="p-1.5 hover:bg-red-900/20 text-red-500 rounded transition-colors" 
                            title={user.status === 'suspended' ? "Activate" : "Ban"}
                           >
                              <Ban size={16} />
                           </button>
                           <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-1.5 hover:bg-red-900/20 text-red-500 rounded transition-colors"
                            title="Delete Account"
                           >
                              <Trash2 size={16} />
                           </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {currentView === 'POSTS' && (
             <div className="grid gap-3">
               {posts.map(post => (
                 <div key={post.id} className="bg-zinc-900 p-4 rounded-md border border-zinc-800 flex gap-4 hover:border-zinc-600 transition-colors">
                    <img src={post.image || 'https://via.placeholder.com/150'} className="w-20 h-20 rounded-sm object-cover bg-black border border-zinc-800" />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                         <div>
                            <h4 className="font-bold text-white text-sm uppercase">{post.title}</h4>
                            <p className="text-xs text-zinc-500 mb-2">by <span className="text-zinc-300">{post.author.name}</span></p>
                         </div>
                         <button onClick={() => handleDeletePost(post.id)} className="text-red-500 hover:bg-red-900/10 p-2 rounded-sm text-[10px] font-bold uppercase flex items-center gap-1 transition-colors">
                            <Trash2 size={14} /> Delete
                         </button>
                      </div>
                      <p className="text-sm text-zinc-400 line-clamp-2">{post.description}</p>
                      <div className="flex gap-2 mt-2">
                        {post.tags.map(t => <span key={t} className="text-[10px] bg-black border border-zinc-800 px-2 py-0.5 rounded-sm text-zinc-500 uppercase font-bold">#{t}</span>)}
                      </div>
                    </div>
                 </div>
               ))}
             </div>
          )}
        </div>
      </main>
    </div>
  );
};
