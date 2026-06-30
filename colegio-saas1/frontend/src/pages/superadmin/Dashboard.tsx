import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Building2, Users, TrendingUp, LogOut, School, UserCog, Settings, LayoutDashboard, Plus, Bell, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

const chartData = [
  {mes:'E',v:0},{mes:'F',v:0},{mes:'M',v:0},{mes:'A',v:0},
  {mes:'M',v:0},{mes:'J',v:0},{mes:'J',v:0},{mes:'A',v:0},
  {mes:'S',v:0},{mes:'O',v:0},{mes:'N',v:0},{mes:'D',v:0},
];

export default function SuperAdminDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [colegios, setColegios] = useState<any[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState('dashboard');

  useEffect(() => {
    const cargar = async () => {
      try {
        const [r1, r2] = await Promise.all([api.get('/colegio'), api.get('/super-admin/admins')]);
        setColegios(r1.data);
        setAdmins(r2.data);
        chartData[new Date().getMonth()].v = r1.data.length;
      } catch(e){ console.error(e); }
      finally { setLoading(false); }
    };
    cargar();
  }, []);

  const colegiosActivos = colegios.filter((c:any) => c.activo).length;

  const navItems = [
    { id:'dashboard', icon:LayoutDashboard, label:'Panel general', path:'/super-admin/dashboard' },
    { id:'colegios', icon:School, label:'Colegios', path:'/super-admin/colegios' },
    { id:'admins', icon:UserCog, label:'Administradores', path:'/super-admin/admins' },
    { id:'ajustes', icon:Settings, label:'Ajustes', path:'#' },
  ];

  // Paleta de colores neutral oscuro profesional
  const bg = '#1a1d23';
  const bgSidebar = '#13161b';
  const bgCard = '#20242c';
  const border = '#2a2e38';
  const textPrimary = '#f1f5f9';
  const textSecondary = '#94a3b8';
  const textMuted = '#64748b';
  const accent = '#6366f1';
  const accentLight = '#818cf8';

  return (
    <div className="min-h-screen flex" style={{background:bg, fontFamily:'Inter, system-ui, sans-serif'}}>

      {/* Sidebar */}
      <aside className="w-56 flex flex-col min-h-screen fixed left-0 top-0"
        style={{background:bgSidebar, borderRight:`1px solid ${border}`}}>

        {/* Logo */}
        <div className="p-5" style={{borderBottom:`1px solid ${border}`}}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)'}}>
              <span className="text-white text-xs font-bold">CS</span>
            </div>
            <div>
              <p className="text-sm font-bold" style={{color:textPrimary}}>Colegio SaaS</p>
              <p className="text-xs font-semibold" style={{color:accentLight}}>SUPER ADMIN</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          <p className="text-xs font-semibold uppercase tracking-widest px-3 mb-3" style={{color:textMuted}}>Principal</p>
          {navItems.map(item => {
            const active = activeNav === item.id;
            return (
              <button key={item.id}
                onClick={() => { setActiveNav(item.id); navigate(item.path); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all"
                style={{
                  background: active ? 'rgba(99,102,241,0.12)' : 'transparent',
                  color: active ? accentLight : textSecondary,
                  fontWeight: active ? 600 : 400,
                  border: active ? `1px solid rgba(99,102,241,0.25)` : '1px solid transparent',
                }}>
                <item.icon size={16}/>
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Usuario */}
        <div className="p-4" style={{borderTop:`1px solid ${border}`}}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)'}}>SA</div>
              <div>
                <p className="text-xs font-semibold" style={{color:textPrimary}}>Super Admin</p>
                <p className="text-xs" style={{color:textMuted}}>root@saas.com</p>
              </div>
            </div>
            <button onClick={() => { logout(); navigate('/login'); }}
              className="hover:text-white transition" style={{color:textMuted}}>
              <LogOut size={14}/>
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 ml-56">

        {/* Header */}
        <header className="px-8 py-4 flex items-center justify-between sticky top-0 z-10"
          style={{background:bgSidebar, borderBottom:`1px solid ${border}`}}>
          <h1 className="font-bold text-base" style={{color:textPrimary}}>Panel general</h1>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-lg transition" style={{color:textMuted}}>
              <Bell size={17}/>
            </button>
            <button onClick={() => navigate('/super-admin/colegios')}
              className="flex items-center gap-2 text-white text-xs font-semibold px-4 py-2 rounded-xl hover:opacity-90 transition"
              style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow:'0 4px 14px rgba(99,102,241,0.35)'}}>
              <Plus size={14}/> Nuevo colegio
            </button>
          </div>
        </header>

        <div className="p-8">

          {/* Saludo */}
          <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className="mb-8">
            <p className="text-xs font-medium mb-1" style={{color:textMuted}}>
              HOY · {new Date().toLocaleDateString('es-PE',{day:'numeric',month:'short',year:'numeric'}).toUpperCase()}
            </p>
            <h2 className="text-3xl font-black mb-1" style={{color:textPrimary}}>Buen día, Admin.</h2>
            <p className="text-sm" style={{color:textSecondary}}>
              {loading ? 'Cargando...' : colegios.length === 0
                ? 'No hay colegios registrados aún.'
                : `Tienes ${colegios.length} colegio${colegios.length>1?'s':''} en la plataforma.`}
            </p>
          </motion.div>

          {loading ? (
            <div className="flex items-center justify-center py-32">
              <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
                style={{borderColor:accent, borderTopColor:'transparent'}}></div>
            </div>
          ) : (
            <>
              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  {label:'TOTAL COLEGIOS', value:colegios.length, sub:'+0 este mes', icon:Building2, color:'#6366f1'},
                  {label:'ACTIVOS', value:colegiosActivos, sub:`${colegios.length>0?Math.round(colegiosActivos/colegios.length*100):0}% online`, icon:TrendingUp, color:'#10b981'},
                  {label:'ADMINISTRADORES', value:admins.length, sub:'+0 hoy', icon:Users, color:'#8b5cf6'},
                  {label:'CRECIMIENTO', value:'0%', sub:'vs. mes anterior', icon:ArrowUpRight, color:'#f59e0b'},
                ].map((s,i) => (
                  <motion.div key={i} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}}
                    className="rounded-2xl p-5" style={{background:bgCard, border:`1px solid ${border}`}}>
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-xs font-semibold uppercase tracking-wider" style={{color:textSecondary}}>{s.label}</p>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{background:`${s.color}18`}}>
                        <s.icon size={15} style={{color:s.color}}/>
                      </div>
                    </div>
                    <p className="text-4xl font-black mb-1" style={{color:textPrimary}}>{s.value}</p>
                    <p className="text-xs" style={{color:textSecondary}}>{s.sub}</p>
                  </motion.div>
                ))}
              </div>

              {/* Gráfica + Actividad */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

                {/* Gráfica */}
                <div className="lg:col-span-2 rounded-2xl p-6" style={{background:bgCard, border:`1px solid ${border}`}}>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="font-bold text-sm" style={{color:textPrimary}}>Evolución de la red</h3>
                      <p className="text-xs mt-1" style={{color:textSecondary}}>Colegios registrados en los últimos 12 meses</p>
                    </div>
                    <div className="flex gap-1">
                      {['1A','6M','12M'].map(p => (
                        <button key={p} className="text-xs px-3 py-1 rounded-lg font-medium transition"
                          style={{
                            background: p==='12M' ? 'rgba(99,102,241,0.15)' : 'transparent',
                            color: p==='12M' ? accentLight : textMuted,
                            border: p==='12M' ? `1px solid rgba(99,102,241,0.3)` : '1px solid transparent'
                          }}>
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="mes" tick={{fill:textMuted, fontSize:11}} axisLine={false} tickLine={false}/>
                      <YAxis tick={{fill:textMuted, fontSize:11}} axisLine={false} tickLine={false}/>
                      <Tooltip contentStyle={{background:bgCard, border:`1px solid ${border}`, borderRadius:12, color:textPrimary, fontSize:12}}/>
                      <Area type="monotone" dataKey="v" stroke="#6366f1" strokeWidth={2.5} fill="url(#cg)"/>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Actividad */}
                <div className="rounded-2xl p-6" style={{background:bgCard, border:`1px solid ${border}`}}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-sm" style={{color:textPrimary}}>Actividad reciente</h3>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                  {colegios.length===0 && admins.length===0 ? (
                    <div className="text-center py-12">
                      <p className="text-xs" style={{color:textMuted}}>Sin actividad aún</p>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {colegios.slice(0,3).map((c:any,i:number) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{background:'#6366f1'}}></div>
                          <div>
                            <p className="text-xs font-semibold" style={{color:textPrimary}}>{c.nombre} registrado</p>
                            <p className="text-xs mt-0.5" style={{color:textSecondary}}>Colegio nuevo · activo</p>
                          </div>
                        </div>
                      ))}
                      {admins.slice(0,2).map((a:any,i:number) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{background:'#8b5cf6'}}></div>
                          <div>
                            <p className="text-xs font-semibold" style={{color:textPrimary}}>Admin asignado</p>
                            <p className="text-xs mt-0.5" style={{color:textSecondary}}>{a.nombre} · {a.colegio?.nombre}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Tabla colegios */}
              <div className="rounded-2xl" style={{background:bgCard, border:`1px solid ${border}`}}>
                <div className="p-6 flex items-center justify-between" style={{borderBottom:`1px solid ${border}`}}>
                  <h3 className="font-bold text-sm" style={{color:textPrimary}}>Colegios recientes</h3>
                  <button onClick={() => navigate('/super-admin/colegios')}
                    className="text-xs font-semibold hover:opacity-80 transition" style={{color:accentLight}}>
                    Ver todos →
                  </button>
                </div>

                {colegios.length===0 ? (
                  <div className="text-center py-16">
                    <Building2 size={36} className="mx-auto mb-3" style={{color:border}}/>
                    <p className="text-sm mb-1" style={{color:textSecondary}}>No hay colegios registrados</p>
                    <button onClick={() => navigate('/super-admin/colegios')}
                      className="text-xs font-semibold mt-2" style={{color:accentLight}}>
                      + Registrar primer colegio
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="grid grid-cols-4 px-6 py-3 text-xs font-semibold uppercase tracking-widest"
                      style={{color:textMuted, borderBottom:`1px solid ${border}`}}>
                      <span>Institución</span><span>Admins</span><span>Estado</span><span>Acciones</span>
                    </div>
                    {colegios.slice(0,6).map((c:any,i:number) => (
                      <div key={c.id} className="grid grid-cols-4 px-6 py-4 items-center transition-all"
                        style={{
                          borderBottom: i<colegios.length-1 ? `1px solid ${border}` : 'none',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background='rgba(255,255,255,0.03)')}
                        onMouseLeave={e => (e.currentTarget.style.background='transparent')}>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-black flex-shrink-0"
                            style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)'}}>
                            {c.nombre.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-semibold" style={{color:textPrimary}}>{c.nombre}</span>
                        </div>
                        <span className="text-sm" style={{color:textSecondary}}>{c.admin?.length||0} →</span>
                        <span>
                          <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{
                            background: c.activo ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                            color: c.activo ? '#34d399' : '#f87171',
                            border: `1px solid ${c.activo?'rgba(16,185,129,0.25)':'rgba(239,68,68,0.25)'}`
                          }}>
                            ● {c.activo?'Activo':'Inactivo'}
                          </span>
                        </span>
                        <button className="text-lg font-bold transition hover:text-white" style={{color:textMuted}}>···</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
