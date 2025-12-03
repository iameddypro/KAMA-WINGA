
import { User, Post, Comment, Meme, Report } from '../types';

// Initial Mock Data
const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Juma Mpemba',
    avatar: 'https://picsum.photos/100/100',
    verificationTier: 'gold',
    username: 'jumawinga',
    bio: 'Muzaji wa bidhaa za kijanja Dar es Salaam.',
    location: 'Kariakoo, Dar',
    phoneNumber: '+255 712 345 678',
    followers: 12500,
    following: 342,
    role: 'admin',
    status: 'active',
    email: 'juma@winga.co.tz',
    password: 'password123',
    dob: '1995-05-15',
    joinedDate: '2023-01-15',
    blockedUsers: []
  },
  {
    id: 'u2',
    name: 'Aisha K',
    avatar: 'https://picsum.photos/101/101',
    verificationTier: 'blue',
    username: 'aisha_fashion',
    bio: 'Fashion enthusiast.',
    location: 'Sinza',
    followers: 850,
    following: 120,
    role: 'user',
    status: 'active',
    email: 'aisha@gmail.com',
    password: 'password123',
    dob: '1998-08-20',
    joinedDate: '2023-03-10',
    blockedUsers: []
  },
  {
    id: 'u3',
    name: 'Keko Store',
    avatar: 'https://picsum.photos/102/102',
    verificationTier: 'diamond',
    username: 'kekostore_tz',
    bio: 'Home of Electronics.',
    location: 'Keko',
    followers: 1500000,
    following: 10,
    role: 'user',
    status: 'active',
    email: 'sales@kekostore.com',
    password: 'password123',
    dob: '1990-01-01',
    joinedDate: '2022-11-05',
    blockedUsers: []
  },
  {
    id: 'u4',
    name: 'Davie M',
    avatar: 'https://picsum.photos/103/103',
    username: 'daviem',
    bio: 'New here.',
    location: 'Mbagala',
    followers: 12,
    following: 50,
    role: 'user',
    status: 'active',
    email: 'davie@yahoo.com',
    password: 'password123',
    dob: '2000-12-12',
    joinedDate: '2023-06-20',
    blockedUsers: []
  }
];

const MOCK_POSTS: Post[] = [
  {
    id: 'p1',
    author: MOCK_USERS[1], // Aisha
    image: 'https://picsum.photos/600/600',
    title: 'Nike Air Force',
    description: 'Natafuta hizi raba size 42, rangi nyeupe.',
    location: 'Sinza',
    tags: ['Viwanjo', 'Nike', 'Viatu'],
    likes: 24,
    reposts: 5,
    crushes: 2,
    comments: [
      { id: 'c1', user: MOCK_USERS[2], text: 'Ninazo dukani Keko, sh 45,000 tu.', timestamp: '2m ago' }
    ],
    timestamp: '2h ago',
    status: 'open'
  },
  {
    id: 'p2',
    author: MOCK_USERS[3], // Davie
    title: 'Wimbo Clouds FM',
    description: 'Kuna ngoma inapigwa saizi Clouds FM...',
    location: 'Dar es Salaam',
    tags: ['Music', 'BongoFlava'],
    likes: 12,
    reposts: 1,
    crushes: 0,
    comments: [],
    timestamp: '5h ago',
    status: 'open'
  }
];

const MOCK_MEMES: Meme[] = [
  {
    id: 'm1',
    author: MOCK_USERS[1],
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    caption: 'Hali halisi Kariakoo leo 😂🔥 #vibes #daressalaam',
    likes: 1204,
    shares: 45,
    comments: 12
  },
  {
    id: 'm2',
    author: MOCK_USERS[2],
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    caption: 'Mteja anapokataa kulipa 😂 #biashara',
    likes: 850,
    shares: 20,
    comments: 5
  },
  {
    id: 'm3',
    author: MOCK_USERS[3],
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    caption: 'Weekend mood 🕺🏾 #tanzania',
    likes: 3400,
    shares: 150,
    comments: 89
  }
];

// Backend Service Class
export class BackendService {
  private users: User[] = [...MOCK_USERS];
  private posts: Post[] = [...MOCK_POSTS];
  private memes: Meme[] = [...MOCK_MEMES];
  private reports: Report[] = []; // Store reports here
  
  // App Config
  private appConfig = {
    logo: localStorage.getItem('kamaWingaLogo') || '',
    name: 'Kama Winga'
  };
  
  // Track relationships: { followerId, followingId }
  private relationships: { followerId: string; followingId: string }[] = [
    { followerId: 'u2', followingId: 'u1' }, // Aisha follows Juma
    { followerId: 'u4', followingId: 'u1' }  // Davie follows Juma
  ];

  // OTP Storage (In memory)
  private otps: Map<string, string> = new Map();

  constructor() {
    // Initialize with a mock report
    this.createReport('u1', 'u4', 'p2', 'Inappropriate content (Scam)');
  }
  
  // --- App Settings ---
  getAppConfig() {
    return this.appConfig;
  }
  
  updateAppLogo(base64: string) {
    this.appConfig.logo = base64;
    localStorage.setItem('kamaWingaLogo', base64);
    return this.appConfig.logo;
  }

  // --- Auth Operations ---
  authenticate(email: string, password: string): User | null {
    const user = this.users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!user) return null;
    if (user.status === 'suspended') throw new Error('Account suspended');
    return user;
  }

  // New: Send OTP
  sendOTP(email: string): boolean {
    // Generate 6 digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    this.otps.set(email, code);
    
    // Simulate Email Sending
    console.log(`%c [Email Service] Sending from Ardbeatz5@gmail.com to ${email}`, 'color: yellow; background: black; font-weight: bold; padding: 4px;');
    console.log(`%c CODE: ${code}`, 'color: black; background: yellow; font-weight: bold; padding: 4px;');
    
    // In a real app, this would use NodeMailer/SendGrid
    return true;
  }

  // New: Verify OTP
  verifyOTP(email: string, code: string): boolean {
    const stored = this.otps.get(email);
    // For demo purposes, we can also accept '123456' as a master code
    if (code === '123456') return true;
    if (stored && stored === code) {
      this.otps.delete(email); // Invalidate after use
      return true;
    }
    return false;
  }

  registerUser(userData: Partial<User>): User {
    if (this.users.some(u => u.email === userData.email)) {
      throw new Error('Email already exists');
    }

    const newUser: User = {
      id: `u${Date.now()}`,
      name: userData.name || 'New User',
      email: userData.email!,
      password: userData.password,
      dob: userData.dob,
      avatar: 'https://ui-avatars.com/api/?name=' + (userData.name || 'User') + '&background=random',
      role: 'user',
      status: 'active',
      verificationTier: undefined,
      followers: 0,
      following: 0,
      joinedDate: new Date().toISOString().split('T')[0],
      blockedUsers: []
    };

    this.users.push(newUser);
    return newUser;
  }

  resetPassword(email: string): boolean {
    const user = this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
        // Trigger OTP flow for password reset
        return this.sendOTP(email);
    }
    return false;
  }

  // --- User Operations ---
  getUsers() {
    return this.users;
  }

  getUserById(id: string) {
    // Return a copy to ensure React detects state changes if needed
    const u = this.users.find(u => u.id === id);
    return u ? { ...u } : undefined;
  }

  updateUser(updatedUser: User) {
    this.users = this.users.map(u => u.id === updatedUser.id ? updatedUser : u);
    // Update author references in posts
    this.posts = this.posts.map(p => {
        if (p.author.id === updatedUser.id) {
            return { ...p, author: updatedUser };
        }
        return p;
    });
    return updatedUser;
  }

  // Admin: Ban/Unban
  toggleUserStatus(userId: string) {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      const newStatus = user.status === 'active' ? 'suspended' : 'active';
      this.updateUser({ ...user, status: newStatus });
    }
  }

  // Admin: Delete User Permanently
  deleteUser(userId: string) {
    this.users = this.users.filter(u => u.id !== userId);
    // Also delete their posts
    this.posts = this.posts.filter(p => p.author.id !== userId);
    // Also delete reports related to them (optional, but cleaner)
    this.reports = this.reports.filter(r => r.reportedUserId !== userId);
  }

  // Admin: Change Verification
  updateVerification(userId: string, tier: User['verificationTier']) {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      this.updateUser({ ...user, verificationTier: tier });
    }
  }

  // --- Block / Unblock Logic ---
  blockUser(blockerId: string, blockedId: string): User {
    const blocker = this.users.find(u => u.id === blockerId);
    if (blocker) {
      // Add to blocked list
      if (!blocker.blockedUsers.includes(blockedId)) {
        blocker.blockedUsers = [...blocker.blockedUsers, blockedId];
        
        // Auto-unfollow if blocking
        if (this.isFollowing(blockerId, blockedId)) {
            this.unfollowUser(blockerId, blockedId);
        }
        // Also remove if they follow you
        if (this.isFollowing(blockedId, blockerId)) {
            this.unfollowUser(blockedId, blockerId);
        }
      }
    }
    return this.getUserById(blockedId)!;
  }

  unblockUser(blockerId: string, blockedId: string): User {
    const blocker = this.users.find(u => u.id === blockerId);
    if (blocker) {
        blocker.blockedUsers = blocker.blockedUsers.filter(id => id !== blockedId);
    }
    return this.getUserById(blockedId)!;
  }

  // --- Follow / Unfollow Logic ---
  isFollowing(followerId: string, followingId: string): boolean {
    return this.relationships.some(r => r.followerId === followerId && r.followingId === followingId);
  }

  followUser(followerId: string, followingId: string): User {
    // Check if blocked
    const follower = this.users.find(u => u.id === followerId);
    const following = this.users.find(u => u.id === followingId);

    if (follower?.blockedUsers.includes(followingId)) {
        throw new Error("Cannot follow a blocked user");
    }

    // Check if already following
    if (this.isFollowing(followerId, followingId)) {
        return this.getUserById(followingId)!;
    }

    // Add relationship
    this.relationships.push({ followerId, followingId });

    // Update counts (Mutate references)
    if (follower) follower.following = (follower.following || 0) + 1;
    if (following) following.followers = (following.followers || 0) + 1;

    // Return the updated TARGET user (with new follower count)
    return this.getUserById(followingId)!;
  }

  unfollowUser(followerId: string, followingId: string): User {
    // Check if relationship exists
    if (!this.isFollowing(followerId, followingId)) {
        return this.getUserById(followingId)!;
    }

    // Remove relationship
    this.relationships = this.relationships.filter(r => !(r.followerId === followerId && r.followingId === followingId));

    // Update counts
    const follower = this.users.find(u => u.id === followerId);
    const following = this.users.find(u => u.id === followingId);

    if (follower) follower.following = Math.max(0, (follower.following || 0) - 1);
    if (following) following.followers = Math.max(0, (following.followers || 0) - 1);

    // Return the updated TARGET user
    return this.getUserById(followingId)!;
  }

  // --- Post Operations ---
  getPosts(currentUserId?: string) {
    let visiblePosts = this.posts;
    
    // Filter blocked users if logged in
    if (currentUserId) {
        const currentUser = this.users.find(u => u.id === currentUserId);
        if (currentUser) {
            visiblePosts = visiblePosts.filter(p => !currentUser.blockedUsers.includes(p.author.id));
        }
    }
    return visiblePosts;
  }
  
  getUserPosts(userId: string) {
    return this.posts.filter(p => p.author.id === userId);
  }

  createPost(post: Post) {
    this.posts = [post, ...this.posts];
    return post;
  }

  deletePost(postId: string) {
    this.posts = this.posts.filter(p => p.id !== postId);
  }

  addComment(postId: string, comment: Comment) {
    this.posts = this.posts.map(p => {
      if (p.id === postId) {
        return { ...p, comments: [...p.comments, comment] };
      }
      return p;
    });
  }

  interactWithPost(postId: string, action: 'like' | 'repost' | 'crush') {
      this.posts = this.posts.map(p => {
          if (p.id === postId) {
              if (action === 'like') return { ...p, likes: p.likes + 1 };
              if (action === 'repost') return { ...p, reposts: p.reposts + 1 };
              if (action === 'crush') return { ...p, crushes: p.crushes + 1 };
          }
          return p;
      });
  }

  // --- Memes ---
  getMemes() {
    return this.memes;
  }

  // --- Report System ---
  createReport(reporterId: string, reportedUserId: string, postId: string | undefined, reason: string) {
    const post = postId ? this.posts.find(p => p.id === postId) : undefined;
    const reportedUser = this.users.find(u => u.id === reportedUserId);

    const newReport: Report = {
      id: `rep${Date.now()}`,
      reporterId,
      reportedUserId,
      postId,
      reason,
      status: 'pending',
      timestamp: new Date().toISOString(),
      // Hydrate info for Admin UI
      postTitle: post?.title || 'Unknown Post',
      postImage: post?.image || post?.video || undefined,
      reportedUserName: reportedUser?.name || 'Unknown User'
    };

    this.reports.unshift(newReport);
    return newReport;
  }

  getReports() {
    return this.reports;
  }

  resolveReport(reportId: string, action: 'dismiss' | 'ban' | 'delete_post' | 'delete_user') {
    const report = this.reports.find(r => r.id === reportId);
    if (!report) return;

    if (action === 'ban') {
      this.toggleUserStatus(report.reportedUserId);
      report.status = 'resolved';
    } else if (action === 'delete_post' && report.postId) {
      this.deletePost(report.postId);
      report.status = 'resolved';
    } else if (action === 'delete_user') {
      this.deleteUser(report.reportedUserId);
      report.status = 'resolved';
    } else {
      report.status = 'dismissed';
    }
  }

  // --- Search Operations ---
  searchUsers(query: string): User[] {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return this.users.filter(u => 
        u.name.toLowerCase().includes(q) || 
        (u.username && u.username.toLowerCase().includes(q))
    );
  }

  searchPosts(query: string): Post[] {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return this.posts.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  // --- Stats for Dashboard ---
  getStats() {
    return {
      totalUsers: this.users.length,
      totalPosts: this.posts.length,
      verifiedUsers: this.users.filter(u => u.verificationTier).length,
      activeNow: Math.floor(Math.random() * 50) + 10,
      pendingReports: this.reports.filter(r => r.status === 'pending').length
    };
  }
}

export const db = new BackendService();