
import React, { useState } from 'react';
import { db } from '../services/mockDb';
import { User, Language } from '../types';
import { User as UserIcon, Lock, Mail, Calendar, ArrowRight, ArrowLeft, Globe, ShieldCheck, CheckSquare, Square, ChevronDown, FileText, X } from 'lucide-react';
import { translations } from '../utils/translations';

interface AuthProps {
  onLoginSuccess: (user: User) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  logo?: string;
}

type AuthMode = 'LOGIN' | 'SIGNUP' | 'FORGOT_PASSWORD' | 'OTP_VERIFICATION';

export const Auth: React.FC<AuthProps> = ({ onLoginSuccess, lang, setLang, logo }) => {
  const [mode, setMode] = useState<AuthMode>('LOGIN');
  const [prevMode, setPrevMode] = useState<AuthMode>('LOGIN'); // To know where we came from for OTP
  const t = translations[lang];
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dob, setDob] = useState('');
  const [otp, setOtp] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const calculateAge = (birthDateString: string) => {
    const today = new Date();
    const birthDate = new Date(birthDateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      try {
        const user = db.authenticate(email, password);
        if (user) {
          onLoginSuccess(user);
        } else {
          setError(lang === 'sw' ? 'Barua pepe au nenosiri sio sahihi.' : 'Invalid email or password.');
        }
      } catch (err: any) {
        setError(err.message);
      }
      setIsLoading(false);
    }, 800);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!name || !email || !password || !dob) {
      setError(t.fillAll);
      return;
    }

    if (password !== confirmPassword) {
      setError(t.passMismatch);
      return;
    }

    if (!termsAccepted) {
      setError(t.termsError);
      return;
    }

    const age = calculateAge(dob);
    if (age < 18) {
      setError(t.ageError);
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
        // Send OTP instead of creating immediately
        const sent = db.sendOTP(email);
        if (sent) {
            setPrevMode('SIGNUP');
            setMode('OTP_VERIFICATION');
            // Log to console for demo
            console.log("OTP Sent (Check Console)");
        }
        setIsLoading(false);
    }, 1000);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsLoading(true);

    setTimeout(() => {
      const sent = db.resetPassword(email);
      if (sent) {
        setPrevMode('FORGOT_PASSWORD');
        setMode('OTP_VERIFICATION');
      } else {
        setError(lang === 'sw' ? 'Barua pepe haipo.' : 'Email not found.');
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
        const isValid = db.verifyOTP(email, otp);
        if (isValid) {
            if (prevMode === 'SIGNUP') {
                // Now actually create the user
                try {
                    const newUser = db.registerUser({ name, email, password, dob });
                    onLoginSuccess(newUser);
                } catch (err: any) {
                    setError(err.message);
                }
            } else if (prevMode === 'FORGOT_PASSWORD') {
                setSuccessMsg(lang === 'sw' ? 'Nenosiri limebadilishwa!' : 'Password reset successful!');
                setMode('LOGIN');
            }
        } else {
            setError(lang === 'sw' ? 'Koodi sio sahihi.' : 'Invalid Code.');
        }
        setIsLoading(false);
    }, 1000);
  };

  const languages = [
      { code: 'sw', label: 'Kiswahili 🇹🇿' },
      { code: 'en', label: 'English 🇺🇸' },
      { code: 'fr', label: 'Français 🇫🇷' },
      { code: 'zh', label: '中文 🇨🇳' },
      { code: 'ko', label: '한국어 🇰🇷' },
      { code: 'de', label: 'Deutsch 🇩🇪' },
      { code: 'pt', label: 'Português 🇧🇷' },
      { code: 'tw', label: '繁體中文 🇹🇼' },
      { code: 'ru', label: 'Русский 🇷🇺' }
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-between p-6 relative overflow-hidden font-sans">
      
      {/* Terms Modal */}
      {showTermsModal && (
         <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-zinc-900 border border-yellow-400/50 w-full max-w-sm rounded-lg overflow-hidden shadow-2xl flex flex-col max-h-[80vh]">
               <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-yellow-400">
                  <h3 className="font-bold text-black uppercase tracking-wide flex items-center gap-2">
                     <FileText size={18} /> {t.termsTitle}
                  </h3>
                  <button onClick={() => setShowTermsModal(false)}><X size={20} className="text-black" /></button>
               </div>
               <div className="p-6 overflow-y-auto text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
                  {t.termsBody}
               </div>
               <div className="p-4 border-t border-zinc-800 bg-black">
                  <button 
                     onClick={() => setShowTermsModal(false)}
                     className="w-full bg-yellow-400 text-black font-bold py-3 rounded-md uppercase tracking-wide hover:bg-yellow-300"
                  >
                     {t.close}
                  </button>
               </div>
            </div>
         </div>
      )}

      {/* Language Selector Dropdown */}
      <div className="absolute top-6 right-6 z-50">
         <div className="relative group">
            <select 
               value={lang} 
               onChange={(e) => setLang(e.target.value as Language)}
               className="appearance-none bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-bold py-2 pl-3 pr-8 rounded-md focus:outline-none focus:border-yellow-400 cursor-pointer hover:bg-zinc-800 transition-colors w-32"
            >
               {languages.map(l => (
                  <option key={l.code} value={l.code}>{l.label}</option>
               ))}
            </select>
            <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
         </div>
      </div>

      <div className="w-full max-w-sm z-10 flex-1 flex flex-col justify-center">
        {/* Logo/Branding */}
        <div className="flex flex-col items-center mb-10">
          {logo ? (
              <img src={logo} alt={t.appName} className="w-24 h-24 object-contain mb-4 animate-in zoom-in duration-500" />
          ) : (
            <div className="w-16 h-16 bg-yellow-400 rounded-lg flex items-center justify-center text-black font-extrabold text-2xl mb-4 shadow-lg shadow-yellow-900/20">
                KW
            </div>
          )}
          <h1 className="text-3xl font-bold text-white tracking-tight mb-1">
            {t.appName}
          </h1>
          <p className="text-zinc-500 text-sm font-medium tracking-wide uppercase">{t.tagline}</p>
        </div>

        {/* Error / Success Messages */}
        {error && (
          <div className="bg-red-500/10 text-red-400 p-3 rounded-md text-sm text-center mb-6 border border-red-500/20 font-medium animate-in fade-in zoom-in duration-200">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="bg-green-500/10 text-green-400 p-3 rounded-md text-sm text-center mb-6 border border-green-500/20 font-medium animate-in fade-in zoom-in duration-200">
            {successMsg}
          </div>
        )}

        {/* --- LOGIN FORM --- */}
        {mode === 'LOGIN' && (
          <form onSubmit={handleLogin} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="relative group">
              <Mail className="absolute left-3 top-3.5 text-zinc-500 group-focus-within:text-yellow-400 transition-colors" size={18} />
              <input 
                type="email" 
                placeholder={t.email} 
                className="w-full pl-10 p-3.5 bg-zinc-900 border border-zinc-800 rounded-md focus:ring-1 focus:ring-yellow-400 focus:border-yellow-400 focus:outline-none text-white placeholder-zinc-600 font-medium transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative group">
              <Lock className="absolute left-3 top-3.5 text-zinc-500 group-focus-within:text-yellow-400 transition-colors" size={18} />
              <input 
                type="password" 
                placeholder={t.password} 
                className="w-full pl-10 p-3.5 bg-zinc-900 border border-zinc-800 rounded-md focus:ring-1 focus:ring-yellow-400 focus:border-yellow-400 focus:outline-none text-white placeholder-zinc-600 font-medium transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <div className="flex justify-end pt-1">
              <button 
                type="button" 
                onClick={() => { setMode('FORGOT_PASSWORD'); setError(''); }}
                className="text-xs text-zinc-400 hover:text-white transition-colors font-medium"
              >
                {t.forgotPass}
              </button>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-yellow-400 text-black p-3.5 rounded-md font-bold text-sm uppercase tracking-wide hover:bg-yellow-300 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
            >
              {isLoading ? '...' : t.login} <ArrowRight size={18} />
            </button>

            <div className="text-center mt-8 border-t border-zinc-900 pt-6">
              <p className="text-sm text-zinc-500">
                {t.noAccount}{' '}
                <button type="button" onClick={() => { setMode('SIGNUP'); setError(''); }} className="text-yellow-400 font-bold hover:underline">
                  {t.signup}
                </button>
              </p>
            </div>
          </form>
        )}

        {/* --- SIGN UP FORM --- */}
        {mode === 'SIGNUP' && (
          <form onSubmit={handleSignup} className="space-y-3 animate-in fade-in slide-in-from-right-8 duration-300">
            <div className="relative group">
              <UserIcon className="absolute left-3 top-3.5 text-zinc-500 group-focus-within:text-yellow-400 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder={t.name}
                className="w-full pl-10 p-3.5 bg-zinc-900 border border-zinc-800 rounded-md focus:ring-1 focus:ring-yellow-400 focus:border-yellow-400 focus:outline-none text-white placeholder-zinc-600 font-medium"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            
            <div className="relative group">
              <Mail className="absolute left-3 top-3.5 text-zinc-500 group-focus-within:text-yellow-400 transition-colors" size={18} />
              <input 
                type="email" 
                placeholder={t.email} 
                className="w-full pl-10 p-3.5 bg-zinc-900 border border-zinc-800 rounded-md focus:ring-1 focus:ring-yellow-400 focus:border-yellow-400 focus:outline-none text-white placeholder-zinc-600 font-medium"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative group">
              <Calendar className="absolute left-3 top-3.5 text-zinc-500 group-focus-within:text-yellow-400 transition-colors" size={18} />
              <input 
                type="date" 
                className="w-full pl-10 p-3.5 bg-zinc-900 border border-zinc-800 rounded-md focus:ring-1 focus:ring-yellow-400 focus:border-yellow-400 focus:outline-none text-white font-medium appearance-none placeholder-zinc-600"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                required
              />
              <p className="text-[10px] text-zinc-500 mt-1 ml-1">{t.ageError}</p>
            </div>

            <div className="relative group">
              <Lock className="absolute left-3 top-3.5 text-zinc-500 group-focus-within:text-yellow-400 transition-colors" size={18} />
              <input 
                type="password" 
                placeholder={t.password} 
                className="w-full pl-10 p-3.5 bg-zinc-900 border border-zinc-800 rounded-md focus:ring-1 focus:ring-yellow-400 focus:border-yellow-400 focus:outline-none text-white placeholder-zinc-600 font-medium"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-3 top-3.5 text-zinc-500 group-focus-within:text-yellow-400 transition-colors" size={18} />
              <input 
                type="password" 
                placeholder={t.confirmPassword} 
                className="w-full pl-10 p-3.5 bg-zinc-900 border border-zinc-800 rounded-md focus:ring-1 focus:ring-yellow-400 focus:border-yellow-400 focus:outline-none text-white placeholder-zinc-600 font-medium"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className="flex items-center justify-between py-2">
                <div 
                className="flex items-center gap-3 cursor-pointer" 
                onClick={() => setTermsAccepted(!termsAccepted)}
                >
                    {termsAccepted ? (
                        <CheckSquare size={20} className="text-yellow-400 shrink-0" />
                    ) : (
                        <Square size={20} className="text-zinc-600 shrink-0" />
                    )}
                    <span className={`text-xs ${termsAccepted ? 'text-white' : 'text-zinc-500'}`}>
                        {t.terms}
                    </span>
                </div>
                <button 
                   type="button" 
                   onClick={() => setShowTermsModal(true)}
                   className="text-xs font-bold text-yellow-400 hover:text-yellow-300 underline"
                >
                    {t.termsRead}
                </button>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-yellow-400 text-black p-3.5 rounded-md font-bold text-sm uppercase tracking-wide hover:bg-yellow-300 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
            >
              {isLoading ? '...' : t.createAccount}
            </button>

            <div className="text-center mt-6 border-t border-zinc-900 pt-4">
              <p className="text-sm text-zinc-500">
                {t.haveAccount}{' '}
                <button type="button" onClick={() => { setMode('LOGIN'); setError(''); }} className="text-yellow-400 font-bold hover:underline">
                  {t.login}
                </button>
              </p>
            </div>
          </form>
        )}

        {/* --- FORGOT PASSWORD --- */}
        {mode === 'FORGOT_PASSWORD' && (
          <form onSubmit={handleForgotPassword} className="space-y-6 animate-in fade-in slide-in-from-left-8 duration-300">
            <div className="text-center mb-2">
              <h2 className="font-bold text-lg text-white">{t.forgotPass}</h2>
              <p className="text-sm text-zinc-500">{t.sendReset}</p>
            </div>

            <div className="relative group">
              <Mail className="absolute left-3 top-3.5 text-zinc-500 group-focus-within:text-yellow-400 transition-colors" size={18} />
              <input 
                type="email" 
                placeholder={t.email} 
                className="w-full pl-10 p-3.5 bg-zinc-900 border border-zinc-800 rounded-md focus:ring-1 focus:ring-yellow-400 focus:border-yellow-400 focus:outline-none text-white placeholder-zinc-600 font-medium"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-zinc-800 text-white p-3.5 rounded-md font-bold text-sm uppercase tracking-wide hover:bg-zinc-700 active:scale-[0.98] transition-all"
            >
              {isLoading ? '...' : t.sendReset}
            </button>

            <div className="text-center">
              <button 
                type="button" 
                onClick={() => { setMode('LOGIN'); setError(''); setSuccessMsg(''); }} 
                className="flex items-center justify-center gap-1 mx-auto text-sm text-zinc-500 hover:text-white transition-colors"
              >
                <ArrowLeft size={14} /> {t.backToLogin}
              </button>
            </div>
          </form>
        )}

        {/* --- OTP VERIFICATION --- */}
        {mode === 'OTP_VERIFICATION' && (
           <form onSubmit={handleVerifyOTP} className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
                <div className="text-center mb-4">
                    <ShieldCheck className="mx-auto text-yellow-400 mb-4" size={48} />
                    <h2 className="font-bold text-lg text-white uppercase tracking-wide">{t.verify}</h2>
                    <p className="text-sm text-zinc-400 mt-2">
                        {t.otpSent} <span className="text-white font-bold">{email}</span>
                    </p>
                    <p className="text-xs text-yellow-500/80 font-mono mt-1 font-bold">{t.emailFrom}</p>
                    <div className="text-[10px] text-zinc-600 mt-4 bg-zinc-900 inline-block px-2 py-1 rounded">
                         (Demo: Enter <b>123456</b>)
                    </div>
                </div>

                <div className="relative group">
                    <input 
                        type="text" 
                        placeholder={t.otpLabel} 
                        className="w-full text-center p-4 bg-zinc-900 border-2 border-zinc-800 rounded-lg focus:border-yellow-400 focus:outline-none text-white text-2xl tracking-[0.5em] font-mono"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-yellow-400 text-black p-3.5 rounded-md font-bold text-sm uppercase tracking-wide hover:bg-yellow-300 active:scale-[0.98] transition-all"
                >
                    {isLoading ? '...' : t.verify}
                </button>
                
                <div className="text-center">
                   <button 
                     type="button" 
                     onClick={() => setMode(prevMode)} 
                     className="text-sm text-zinc-500 hover:text-white"
                   >
                     Cancel
                   </button>
                </div>
           </form>
        )}
      </div>

      {/* Footer Copyright */}
      <div className="mt-8 text-center opacity-60">
        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
            &copy; {t.rightsReserved} {t.by} Kama Winga 2025
        </p>
      </div>
    </div>
  );
};
