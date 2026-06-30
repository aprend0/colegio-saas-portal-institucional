import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Props {
  children: React.ReactNode;
  contenidoCounts?: { comunicados: number; noticias: number; eventos: number };
}

export default function AdminLayout({ children, contenidoCounts }: Props) {
  const { logout, usuario } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [horaActual, setHoraActual] = useState(new Date());

  const BG_SIDEBAR = '#080f20';
  const BORDER = 'rgba(255,255,255,0.07)';
  const TEXT = '#e2e8f0';
  const TEXT_MUTED = '#64748b';
  const CYAN = '#22d3ee';
  const BG_CARD = '#0d1b2e';

  useEffect(() => {
    const timer = setInterval(() => setHoraActual(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const navPrincipal = [
    { id:'dashboard', icon:'dashboard', label:'Dashboard', color:'#38bdf8', path:'/admin/dashboard' },
    { id:'comunicados', icon:'campaign', label:'Comunicados', color:'#818cf8', path:'/admin/contenido?tipo=comunicado', badge: contenidoCounts?.comunicados },
    { id:'noticias', icon:'newspaper', label:'Noticias y Prensa', color:'#f472b6', path:'/admin/contenido?tipo=noticia', badge: contenidoCounts?.noticias },
    { id:'calendario', icon:'calendar_month', label:'Calendario Escolar', color:'#34d399', path:'/admin/contenido?tipo=evento', badge: contenidoCounts?.eventos },
    { id:'galeria', icon:'photo_library', label:'Galería Fotográfica', color:'#fb923c', path:'/admin/galeria' },
  ];

  const navGestion = [
    { id:'personalizacion', icon:'palette', label:'Personalización', color:'#f59e0b', path:'/admin/personalizacion' },
  ];

  const getActiveNav = () => {
    if (location.pathname === '/admin/dashboard') return 'dashboard';
    if (location.pathname === '/admin/galeria') return 'galeria';
    if (location.pathname === '/admin/personalizacion') return 'personalizacion';
    if (location.pathname === '/admin/contenido') {
      const tipo = new URLSearchParams(location.search).get('tipo') || 'comunicado';
      if (tipo === 'noticia') return 'noticias';
      if (tipo === 'evento') return 'calendario';
      return 'comunicados';
    }
    return 'dashboard';
  };

  const formatHora = (d: Date) => d.toLocaleTimeString('es-PE', {hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:true}).toUpperCase();
  const formatFecha = (d: Date) => d.toLocaleDateString('es-PE', {weekday:'long', day:'numeric', month:'long', year:'numeric'}).toUpperCase();

  const activeNav = getActiveNav();

  return (
    <div className="min-h-screen flex" style={{background:'#060f1e', color:TEXT, fontFamily:"'Plus Jakarta Sans', sans-serif"}}>

      {/* Sidebar */}
      <aside className="w-[260px] flex flex-col min-h-screen fixed left-0 top-0"
        style={{background:BG_SIDEBAR, borderRight:`1px solid ${BORDER}`}}>

        {/* Logo */}
        <div className="p-5 pb-4" style={{borderBottom:`1px solid ${BORDER}`}}>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{background:'linear-gradient(135deg,#1e40af,#0ea5e9)'}}>
              <span className="material-symbols-outlined text-white text-xl">school</span>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{color:'#475569'}}>Consola Escolar</p>
              <h1 className="font-black text-base" style={{color:TEXT}}>EduWeb Perú</h1>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <p className="text-xs font-black uppercase tracking-widest px-4 py-2" style={{color:'#334155'}}>Módulos Principales</p>
          {navPrincipal.map(item => {
            const active = activeNav === item.id;
            return (
              <a key={item.id} onClick={() => navigate(item.path)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-150"
                style={{
                  background: active ? `${item.color}15` : 'transparent',
                  border: active ? `1px solid ${item.color}30` : '1px solid transparent',
                }}>
                <span className="material-symbols-outlined text-xl" style={{color: active ? item.color : '#475569'}}>{item.icon}</span>
                <span className="text-sm flex-1" style={{fontWeight: active ? 700 : 400, color: active ? TEXT : '#94a3b8'}}>{item.label}</span>
                {item.badge && item.badge > 0 ? (
                  <span className="text-xs px-1.5 py-0.5 rounded-full font-bold"
                    style={{background:`${item.color}20`, color:item.color}}>
                    {item.badge}
                  </span>
                ) : null}
              </a>
            );
          })}

          <p className="text-xs font-black uppercase tracking-widest px-4 py-2 mt-3" style={{color:'#334155'}}>Gestión Interna</p>
          {navGestion.map(item => {
            const active = activeNav === item.id;
            return (
              <a key={item.id} onClick={() => navigate(item.path)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all"
                style={{
                  background: active ? `${item.color}15` : 'transparent',
                  border: active ? `1px solid ${item.color}30` : '1px solid transparent',
                }}>
                <span className="material-symbols-outlined text-xl" style={{color: active ? item.color : '#475569'}}>{item.icon}</span>
                <span className="text-sm font-medium" style={{color: active ? TEXT : '#94a3b8'}}>{item.label}</span>
              </a>
            );
          })}
        </nav>

        {/* Operador */}
        <div className="p-4" style={{borderTop:`1px solid ${BORDER}`}}>
          <p className="text-xs font-black uppercase tracking-widest px-4 mb-2" style={{color:'#334155'}}>Simular Operador</p>
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
            style={{background:BG_CARD, border:`1px solid ${BORDER}`}}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{background:'linear-gradient(135deg,#1e40af,#0ea5e9)'}}>
              {(usuario?.nombre||'A').charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate" style={{color:TEXT}}>{usuario?.nombre||'Admin'}</p>
              <p className="text-xs" style={{color:TEXT_MUTED}}>Administrador</p>
            </div>
            <button onClick={() => { logout(); navigate('/admin/login'); }}
              className="hover:opacity-70 transition-opacity" style={{color:TEXT_MUTED}}>
              <span className="material-symbols-outlined text-base">logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 ml-[260px] flex flex-col">

        {/* Header */}
        <header className="sticky top-0 z-40 h-16 flex items-center justify-between px-6"
          style={{background:'rgba(6,15,30,0.97)', backdropFilter:'blur(20px)', borderBottom:`1px solid ${BORDER}`}}>

          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{background:'linear-gradient(135deg,#1e40af,#0ea5e9)'}}>
              <span className="material-symbols-outlined text-white text-lg">school</span>
            </div>
            <div>
              <h2 className="font-black text-sm leading-tight" style={{color:TEXT}}>Unidad Educativa EduWeb Perú</h2>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{background:'#22c55e'}}></span>
                <p className="text-[10px]" style={{color:TEXT_MUTED}}>Canal Académico Oficial • MINEDU Perú</p>
              </div>
            </div>
          </div>

          <div className="relative mx-6" style={{width:'320px'}}>
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-lg" style={{color:TEXT_MUTED}}>search</span>
            <input placeholder="Buscar comunicados, eventos..."
              className="w-full rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none"
              style={{background:BG_CARD, border:`1px solid ${BORDER}`, color:TEXT}}/>
          </div>

          <div className="flex items-center gap-5 flex-shrink-0">
            <div className="text-right">
              <p className="text-lg font-black tabular-nums" style={{color:CYAN}}>{formatHora(horaActual)}</p>
              <p className="text-[9px] font-semibold" style={{color:TEXT_MUTED}}>{formatFecha(horaActual)}</p>
            </div>
            <div className="flex items-center gap-2.5 pl-5" style={{borderLeft:`1px solid ${BORDER}`}}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm"
                style={{background:'linear-gradient(135deg,#1e40af,#0ea5e9)'}}>
                {(usuario?.nombre||'A').charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-bold" style={{color:TEXT}}>{usuario?.nombre||'Admin'}</p>
                <p className="text-[10px] font-bold uppercase" style={{color:'#0ea5e9'}}>Administrador</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
