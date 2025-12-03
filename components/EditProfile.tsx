import React, { useState, useRef } from 'react';
import { User } from '../types';
import { ArrowLeft, Camera, Save, Phone, MapPin, User as UserIcon, AlignLeft, AtSign } from 'lucide-react';

interface EditProfileProps {
  user: User;
  onSave: (updatedUser: User) => void;
  onCancel: () => void;
}

export const EditProfile: React.FC<EditProfileProps> = ({ user, onSave, onCancel }) => {
  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username || '');
  const [bio, setBio] = useState(user.bio || '');
  const [location, setLocation] = useState(user.location || '');
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || '');
  const [avatar, setAvatar] = useState(user.avatar);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSave({
      ...user,
      name,
      username,
      bio,
      location,
      phoneNumber,
      avatar
    });
  };

  return (
    <div className="bg-black min-h-screen pb-safe text-white font-sans">
      {/* Header */}
      <div className="sticky top-0 bg-black/95 backdrop-blur-sm z-20 px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onCancel} className="p-2 -ml-2 hover:bg-zinc-800 rounded-md text-zinc-400">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-lg font-bold text-white uppercase tracking-wide">Edit Profile</h2>
        </div>
        <button 
          onClick={handleSave}
          className="text-black font-bold text-xs uppercase tracking-wide px-4 py-1.5 bg-yellow-400 rounded-sm hover:bg-yellow-300 transition-colors"
        >
          Hifadhi
        </button>
      </div>

      <div className="p-6">
        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <img 
              src={avatar} 
              alt={name} 
              className="w-28 h-28 rounded-full object-cover border-4 border-zinc-900 shadow-sm bg-zinc-900"
            />
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="text-white" size={24} />
            </div>
            <div className="absolute bottom-1 right-1 bg-zinc-800 p-2 rounded-full shadow-md border border-zinc-700">
              <Camera className="text-yellow-400" size={16} />
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange} 
            />
          </div>
          <p className="mt-3 text-xs font-bold uppercase tracking-wide text-yellow-500">Badili Picha</p>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1">
              <UserIcon size={12} /> Jina Kamili
            </label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-400 text-white font-medium"
              placeholder="Jina lako"
            />
          </div>

          {/* Username */}
          <div className="space-y-2">
             <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1">
              <AtSign size={12} /> Username
            </label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-400 text-white font-medium"
              placeholder="username (bila @)"
            />
          </div>

          {/* Bio */}
          <div className="space-y-2">
             <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1">
              <AlignLeft size={12} /> Kuhusu (Bio)
            </label>
            <textarea 
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-400 text-white resize-none h-24 font-medium"
              placeholder="Elezea biashara yako au wewe ni nani..."
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
             <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1">
              <MapPin size={12} /> Eneo / Mkoa
            </label>
            <input 
              type="text" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-400 text-white font-medium"
              placeholder="Mfano: Kariakoo, Dar es Salaam"
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
             <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1">
              <Phone size={12} /> Namba ya Simu
            </label>
            <input 
              type="tel" 
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-400 text-white font-medium"
              placeholder="+255 7..."
            />
            <p className="text-[10px] text-zinc-600">Namba hii itaonekana kwa wateja wanaotaka kuwasiliana nawe.</p>
          </div>
        </div>
      </div>
    </div>
  );
};