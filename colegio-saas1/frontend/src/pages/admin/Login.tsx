import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Eye, EyeOff, Mail, Lock, Globe, Shield, School } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/auth/login/admin', { email, password });
      const { access_token, rol, colegioId, nombre } = response.data;
      login({ token: access_token, rol, colegioId, nombre });
      navigate('/admin/dashboard');
    } catch {
      setError('Credenciales incorrectas. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans">

      {/* Panel izquierdo */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden flex-col items-center justify-center"
        style={{ background: 'linear-gradient(145deg, #04041a 0%, #080828 20%, #0e0845 40%, #180c60 60%, #0d3d2a 80%, #0a4a32 100%)' }}>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-96 h-96 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #10b981 0%, transparent 70%)' }}></div>
        </div>

        {/* Puntos */}
        <div className="absolute top-8 right-16 w-3 h-3 rounded-full" style={{background:'#34d399',boxShadow:'0 0 12px #34d399',opacity:0.9}}></div>
        <div className="absolute top-20 right-40 w-2 h-2 rounded-full" style={{background:'#6ee7b7',opacity:0.6}}></div>
        <div className="absolute top-36 right-24 w-3 h-3 rounded-full" style={{background:'#a7f3d0',opacity:0.5}}></div>
        <div className="absolute bottom-48 right-20 w-2 h-2 rounded-full" style={{background:'#34d399',opacity:0.6}}></div>
        <div className="absolute bottom-28 left-32 w-3 h-3 rounded-full" style={{background:'#6366f1',opacity:0.5}}></div>

        {/* Ondas */}
        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 900 500" preserveAspectRatio="none">
          <defs>
            <linearGradient id="w1" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#059669" stopOpacity="1"/>
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.8"/>
            </linearGradient>
            <linearGradient id="w2" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#047857" stopOpacity="0.9"/>
              <stop offset="100%" stopColor="#059669" stopOpacity="0.7"/>
            </linearGradient>
            <linearGradient id="w3" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#065f46" stopOpacity="1"/>
              <stop offset="100%" stopColor="#047857" stopOpacity="0.9"/>
            </linearGradient>
          </defs>
          <path d="M0,240 C80,180 160,280 280,220 C400,160 480,260 600,200 C720,140 800,240 900,190 L900,500 L0,500 Z" fill="url(#w1)"/>
          <path d="M0,300 C100,250 200,340 360,280 C500,225 620,310 780,260 C860,235 900,270 900,260 L900,500 L0,500 Z" fill="url(#w2)"/>
          <path d="M0,380 C120,340 240,400 420,360 C580,325 700,385 900,350 L900,500 L0,500 Z" fill="url(#w3)"/>
        </svg>

        {/* Contenido */}
        <div className="relative z-10 flex flex-col items-center text-center px-16">
          <div className="mb-10">
            <svg width="110" height="110" viewBox="0 0 110 110">
              <defs>
                <linearGradient id="hexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6ee7b7"/>
                  <stop offset="50%" stopColor="#34d399"/>
                  <stop offset="100%" stopColor="#10b981"/>
                </linearGradient>
              </defs>
              <polygon points="55,5 100,30 100,80 55,105 10,80 10,30" fill="none" stroke="url(#hexGrad)" strokeWidth="2.5" opacity="0.9"/>
              <polygon points="55,18 88,36 88,74 55,92 22,74 22,36" fill="url(#hexGrad)" opacity="0.15"/>
              <text x="55" y="62" textAnchor="middle" fill="url(#hexGrad)" fontSize="22" fontWeight="700" fontFamily="Arial">CA</text>
            </svg>
          </div>
          <h2 className="text-white text-5xl font-bold mb-5 tracking-tight">Panel Colegio 🏫</h2>
          <p className="text-green-200 text-lg leading-relaxed" style={{opacity:0.7}}>
            Gestiona el contenido<br/>de tu institución educativa.
          </p>

          {/* Features */}
          <div className="mt-10 space-y-3 text-left w-full max-w-xs">
            {['Publicar comunicados y noticias', 'Gestionar eventos institucionales', 'Personalizar tu página web'].map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{background:'rgba(52,211,153,0.2)', border:'1px solid rgba(52,211,153,0.4)'}}>
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-green-100 text-sm" style={{opacity:0.8}}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Panel derecho */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col min-h-screen">
        <div className="flex justify-between items-center p-7">
          <button onClick={() => navigate('/login')} className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 transition">
            ← Super Admin
          </button>
          <button className="flex items-center gap-2 border border-gray-200 rounded-full px-5 py-2.5 text-sm text-gray-500 hover:bg-gray-50 transition shadow-sm">
            <Globe size={14} className="text-gray-400"/> Español <span className="text-xs">∨</span>
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center px-12 pb-16">
          <div className="w-full max-w-md">

            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:'rgba(16,185,129,0.1)'}}>
                <School size={20} style={{color:'#10b981'}}/>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Panel del colegio</h1>
                <p className="text-gray-400 text-sm">Ingresa tus credenciales de administrador.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Correo electrónico</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{color:'#9ca3af'}}/>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="admin@micolegio.com" required
                    className="w-full border border-gray-200 rounded-2xl pl-11 pr-5 py-4 text-gray-800 placeholder-gray-300 text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition hover:border-gray-300"/>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Contraseña</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{color:'#9ca3af'}}/>
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••••" required
                    className="w-full border border-gray-200 rounded-2xl pl-11 pr-12 py-4 text-gray-800 placeholder-gray-300 text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition hover:border-gray-300"/>
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                    {showPassword ? <EyeOff size={17}/> : <Eye size={17}/>}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 rounded-2xl px-4 py-3.5 flex items-center gap-3">
                  <span className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 text-red-500 text-xs font-bold">!</span>
                  <p className="text-red-500 text-sm">{error}</p>
                </div>
              )}

              <button type="submit" disabled={loading}
                className="w-full text-white font-semibold rounded-2xl py-4 text-sm flex items-center justify-center gap-2 transition hover:opacity-90 disabled:opacity-50"
                style={{background:'linear-gradient(135deg,#059669,#10b981)', boxShadow:'0 8px 24px rgba(16,185,129,0.3)'}}>
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Iniciando sesión...
                  </div>
                ) : 'Acceder al panel →'}
              </button>
            </form>

            <div className="flex items-center justify-center gap-2 mt-8 text-gray-400 text-xs">
              <Shield size={13} className="text-gray-300"/>
              <span>Acceso exclusivo para administradores de colegios.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
