import React, { useState, useRef } from 'react';
import { ViewState, Language } from '../types';
import { Camera, Image as ImageIcon, Sparkles, X, MapPin, Video } from 'lucide-react';
import { analyzeItemImage } from '../services/geminiService';
import { translations } from '../utils/translations';

interface CreatePostProps {
  onCancel: () => void;
  onSubmit: (data: any) => void;
  lang: Language;
}

export const CreatePost: React.FC<CreatePostProps> = ({ onCancel, onSubmit, lang }) => {
  const [media, setMedia] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const t = translations[lang];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (mediaType === 'video') {
         // Mock Validation
         if (file.size > 10 * 1024 * 1024) { 
             setError(t.videoLimit);
             return;
         }
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setMedia(base64);
        setError('');
        
        // Auto-analyze if image
        if (mediaType === 'image') {
            handleAIAnalyze(base64);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAIAnalyze = async (base64Img: string) => {
    setIsAnalyzing(true);
    const result = await analyzeItemImage(base64Img);
    setIsAnalyzing(false);

    if (result) {
      setDescription((prev) => prev || `Natafuta ${result.title}. ${result.category}.`);
      setTags(result.tags);
      if (result.suggestedLocations.length > 0) {
        setLocation(result.suggestedLocations[0]);
      }
    }
  };

  const handleSubmit = () => {
    if (!description) return;
    
    onSubmit({
      image: mediaType === 'image' ? media : undefined,
      video: mediaType === 'video' ? media : undefined,
      description,
      location: location || 'Dar es Salaam',
      tags,
      title: tags[0] || 'Bidhaa',
    });
  };

  return (
    <div className="bg-black min-h-full p-4 animate-in slide-in-from-bottom-10 fade-in duration-300 text-white font-sans">
      <div className="flex justify-between items-center mb-6 border-b border-zinc-800 pb-4">
        <h2 className="text-lg font-bold uppercase tracking-wide">{t.post}</h2>
        <button onClick={onCancel} className="p-2 bg-zinc-900 rounded-md hover:bg-zinc-800 border border-zinc-800">
          <X size={20} className="text-zinc-400" />
        </button>
      </div>

      <div className="flex gap-4 mb-4">
         <button 
            onClick={() => { setMediaType('image'); setMedia(null); }}
            className={`flex-1 py-3 rounded-md text-xs font-bold border transition-colors flex items-center justify-center gap-2 uppercase tracking-wide ${mediaType === 'image' ? 'bg-yellow-400 text-black border-yellow-400' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'}`}
         >
            <ImageIcon size={16} /> {t.uploadImage}
         </button>
         <button 
            onClick={() => { setMediaType('video'); setMedia(null); }}
            className={`flex-1 py-3 rounded-md text-xs font-bold border transition-colors flex items-center justify-center gap-2 uppercase tracking-wide ${mediaType === 'video' ? 'bg-yellow-400 text-black border-yellow-400' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'}`}
         >
            <Video size={16} /> {t.uploadVideo}
         </button>
      </div>

      <div className="space-y-6">
        {/* Media Upload Area */}
        <div 
          onClick={() => fileInputRef.current?.click()}
          className={`aspect-video rounded-md border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors relative overflow-hidden ${media ? 'border-yellow-400' : 'border-zinc-800 bg-zinc-900 hover:border-zinc-600'}`}
        >
          {media ? (
             mediaType === 'image' ? (
                <img src={media} alt="Preview" className="w-full h-full object-cover" />
             ) : (
                <video src={media} className="w-full h-full object-cover" controls />
             )
          ) : (
            <>
              <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center shadow-sm mb-3 border border-zinc-700">
                {mediaType === 'image' ? <Camera size={32} className="text-yellow-400" /> : <Video size={32} className="text-yellow-400" />}
              </div>
              <p className="text-sm text-zinc-400 font-bold uppercase">{t.tapToCapture}</p>
              {mediaType === 'video' && <p className="text-[10px] text-zinc-600 mt-1 max-w-[200px] text-center font-mono">{t.videoLimit}</p>}
            </>
          )}
          
          {isAnalyzing && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center flex-col text-white backdrop-blur-sm">
              <Sparkles className="animate-spin mb-2 text-yellow-400" />
              <span className="text-xs font-bold uppercase tracking-widest">{t.analyzing}</span>
            </div>
          )}
          
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept={mediaType === 'image' ? "image/*" : "video/*"} 
            onChange={handleFileChange} 
          />
        </div>

        {error && (
            <div className="p-3 bg-red-900/20 text-red-400 text-xs rounded-sm border border-red-900/30 text-center font-bold">
                {error}
            </div>
        )}

        {/* AI Suggestion Badge */}
        {tags.length > 0 && (
          <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-md flex items-start gap-3">
             <div className="bg-yellow-400/10 p-1.5 rounded-sm">
               <Sparkles size={16} className="text-yellow-400" />
             </div>
             <div>
               <p className="text-xs text-yellow-500 font-bold uppercase mb-1">{t.aiSuggestion}</p>
               <div className="flex flex-wrap gap-1">
                 {tags.map(t => <span key={t} className="text-[10px] bg-black px-2 py-0.5 rounded-sm text-zinc-300 border border-zinc-800">#{t}</span>)}
               </div>
             </div>
          </div>
        )}

        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">{t.descLabel}</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t.descPlaceholder}
              className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-400 text-sm h-24 resize-none text-white placeholder-zinc-600 font-medium"
            />
          </div>

          <div>
             <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">{t.locLabel}</label>
             <div className="relative">
               <MapPin size={16} className="absolute left-3 top-3.5 text-zinc-500" />
               <input 
                  type="text" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Kariakoo, Ilala..."
                  className="w-full pl-9 p-3 bg-zinc-900 border border-zinc-800 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-400 text-sm text-white placeholder-zinc-600 font-medium"
               />
             </div>
          </div>
        </div>

        <button 
          onClick={handleSubmit}
          className="w-full bg-yellow-400 text-black font-bold py-4 rounded-md active:scale-[0.98] transition-transform flex items-center justify-center gap-2 uppercase tracking-wide text-sm hover:bg-yellow-300"
        >
          <span>{t.postNow}</span>
        </button>
      </div>
    </div>
  );
};