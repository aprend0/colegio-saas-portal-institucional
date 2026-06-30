import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Eye, EyeOff, Mail, Lock, Globe, Shield } from 'lucide-react';

export default function SuperAdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/auth/login/super-admin', { email, password });
      const { access_token, rol } = response.data;
      login({ token: access_token, rol });
      navigate('/super-admin/dashboard');
    } catch {
      setError('Credenciales incorrectas. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans">
      <div className="hidden lg:flex w-1/2 relative overflow-hidden flex-col items-center justify-center"
        style={{ background: 'linear-gradient(145deg, #04041a 0%, #080828 20%, #0e0845 40%, #180c60 60%, #220f7a 80%, #2e1299 100%)' }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-96 h-96 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #6d28d9 0%, transparent 70%)' }}></div>
        </div>
        <div className="absolute top-8 right-16 w-3 h-3 rounded-full" style={{background:'#60a5fa',boxShadow:'0 0 12px #60a5fa',opacity:0.9}}></div>
        <div className="absolute top-20 right-40 w-2 h-2 rounded-full" style={{background:'#a78bfa',boxShadow:'0 0 8px #a78bfa',opacity:0.6}}></div>
        <div className="absolute top-36 right-24 w-3 h-3 rounded-full" style={{background:'#818cf8',boxShadow:'0 0 10px #818cf8',opacity:0.7}}></div>
        <div className="absolute top-64 left-16 w-2 h-2 rounded-full" style={{background:'#93c5fd',opacity:0.5}}></div>
        <div className="absolute bottom-48 right-20 w-2 h-2 rounded-full" style={{background:'#c4b5fd',opacity:0.6}}></div>
        <div className="absolute bottom-28 left-32 w-3 h-3 rounded-full" style={{background:'#60a5fa',opacity:0.5}}></div>
        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 900 500" preserveAspectRatio="none">
          <defs>
            <linearGradient id="w1" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#4338ca" stopOpacity="1"/>
              <stop offset="100%" stopColor="#6d28d9" stopOpacity="0.8"/>
            </linearGradient>
            <linearGradient id="w2" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3730a3" stopOpacity="0.9"/>
              <stop offset="100%" stopColor="#5b21b6" stopOpacity="0.7"/>
            </linearGradient>
            <linearGradient id="w3" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#312e81" stopOpacity="1"/>
              <stop offset="100%" stopColor="#4c1d95" stopOpacity="0.9"/>
            </linearGradient>
          </defs>
          <path d="M0,240 C80,180 160,280 280,220 C400,160 480,260 600,200 C720,140 800,240 900,190 L900,500 L0,500 Z" fill="url(#w1)"/>
          <path d="M0,300 C100,250 200,340 360,280 C500,225 620,310 780,260 C860,235 900,270 900,260 L900,500 L0,500 Z" fill="url(#w2)"/>
          <path d="M0,380 C120,340 240,400 420,360 C580,325 700,385 900,350 L900,500 L0,500 Z" fill="url(#w3)"/>
        </svg>
        <div className="relative z-10 flex flex-col items-center text-center px-16">
          <div className="mb-10 relative">
            <svg width="110" height="110" viewBox="0 0 110 110" className="relative z-10 drop-shadow-2xl">
              <defs>
                <linearGradient id="hexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#93c5fd"/>
                  <stop offset="50%" stopColor="#818cf8"/>
                  <stop offset="100%" stopColor="#a78bfa"/>
                </linearGradient>
              </defs>
              <polygon points="55,5 100,30 100,80 55,105 10,80 10,30" fill="none" stroke="url(#hexGrad)" strokeWidth="2.5" opacity="0.9"/>
              <polygon points="55,18 88,36 88,74 55,92 22,74 22,36" fill="url(#hexGrad)" opacity="0.15"/>
              <text x="55" y="62" textAnchor="middle" fill="url(#hexGrad)" fontSize="24" fontWeight="700" fontFamily="Arial, sans-serif" letterSpacing="1">CS</text>
            </svg>
          </div>
          <h2 className="text-white text-5xl font-bold mb-5 tracking-tight leading-tight">Bienvenido 👋</h2>
          <p className="text-blue-200 text-lg leading-relaxed" style={{opacity:0.7}}>Inicia sesión para continuar<br/>y accede a tu cuenta.</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 bg-white flex flex-col min-h-screen">
        <div className="flex justify-end p-7">
          <button className="flex items-center gap-2 border border-gray-200 rounded-full px-5 py-2.5 text-sm text-gray-500 hover:bg-gray-50 transition shadow-sm">
            <Globe size={14} className="text-gray-400"/>
            <span>Español</span>
            <span className="text-gray-400 text-xs">∨</span>
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center px-12 pb-16">
          <div className="w-full max-w-md">
            <div className="mb-9">
              <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">Iniciar sesión</h1>
              <p className="text-gray-400 text-base">Ingresa tus credenciales para acceder.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Correo electrónico</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{color:'#9ca3af'}}/>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ejemplo@correo.com" required
                    className="w-full border border-gray-200 rounded-2xl pl-11 pr-5 py-4 text-gray-800 placeholder-gray-300 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition-all hover:border-gray-300"/>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Contraseña</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{color:'#9ca3af'}}/>
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••••" required
                    className="w-full border border-gray-200 rounded-2xl pl-11 pr-12 py-4 text-gray-800 placeholder-gray-300 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition-all hover:border-gray-300"/>
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                    {showPassword ? <EyeOff size={17}/> : <Eye size={17}/>}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="w-4 h-4 rounded accent-indigo-600"/>
                  <span className="text-sm text-gray-600">Recordarme</span>
                </label>
                <button type="button" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition">¿Olvidaste tu contraseña?</button>
              </div>
              {error && (
                <div className="bg-red-50 border border-red-100 rounded-2xl px-4 py-3.5 flex items-center gap-3">
                  <span className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 text-red-500 text-xs font-bold">!</span>
                  <p className="text-red-500 text-sm">{error}</p>
                </div>
              )}
              <button type="submit" disabled={loading}
                className="w-full text-white font-semibold rounded-2xl py-4 text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-50 mt-2"
                style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #6d28d9 50%, #7c3aed 100%)', boxShadow: '0 8px 24px rgba(99,102,241,0.35)' }}>
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Iniciando sesión...
                  </div>
                ) : 'Iniciar sesión →'}
              </button>
            </form>
            <div className="flex items-center justify-center gap-2 mt-10 text-gray-400 text-xs">
              <Shield size={13} className="text-gray-300"/>
              <span>Tus datos están protegidos con cifrado de extremo a extremo.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
