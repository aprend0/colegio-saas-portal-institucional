
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Building2, Plus, Search, LayoutDashboard, School, UserCog, Settings, LogOut, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Colegios() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [colegios, setColegios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [creando, setCreando] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [activeNav, setActiveNav] = useState('colegios');

  const bg = '#1a1d23';
  const bgSidebar = '#13161b';
  const bgCard = '#20242c';
  const border = '#2a2e38';
  const textPrimary = '#f1f5f9';
  const textSecondary = '#94a3b8';
  const textMuted = '#64748b';
  const accentLight = '#818cf8';

  const navItems = [
    { id:'dashboard', icon:LayoutDashboard, label:'Panel general', path:'/super-admin/dashboard' },
    { id:'colegios', icon:School, label:'Colegios', path:'/super-admin/colegios' },
    { id:'admins', icon:UserCog, label:'Administradores', path:'/super-admin/admins' },
    { id:'ajustes', icon:Settings, label:'Ajustes', path:'#' },
  ];

  useEffect(() => { cargarColegios(); }, []);

  const cargarColegios = async () => {
    try {
      const res = await api.get('/colegio');
      setColegios(res.data);
    } catch(e){ console.error(e); }
    finally { setLoading(false); }
  };

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoNombre.trim()) return;
    setCreando(true);
    try {
      await api.post('/colegio', { nombre: nuevoNombre });
      setNuevoNombre('');
      cargarColegios();
    } catch(e){ console.error(e); }
    finally { setCreando(false); }
  };

  const handleEstado = async (id: number, activo: boolean) => {
    try {
      await api.patch(`/colegio/${id}/estado`, { activo: !activo });
      cargarColegios();
    } catch(e){ console.error(e); }
  };

  const colegiosFiltrados = colegios.filter(c =>
    c.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="min-h-screen flex" style={{background:bg}}>

      {/* Sidebar */}
      <aside className="w-56 flex flex-col min-h-screen fixed left-0 top-0"
        style={{background:bgSidebar, borderRight:`1px solid ${border}`}}>
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
        <nav className="flex-1 p-4 space-y-1">
          <p className="text-xs font-semibold uppercase tracking-widest px-3 mb-3" style={{color:textMuted}}>Principal</p>
          {navItems.map(item => {
            const active = activeNav === item.id;
            return (
              <button key={item.id} onClick={() => { setActiveNav(item.id); navigate(item.path); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all"
                style={{
                  background: active ? 'rgba(99,102,241,0.12)' : 'transparent',
                  color: active ? accentLight : textSecondary,
                  fontWeight: active ? 600 : 400,
                  border: active ? '1px solid rgba(99,102,241,0.25)' : '1px solid transparent',
                }}>
                <item.icon size={16}/>{item.label}
              </button>
            );
          })}
        </nav>
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
            <button onClick={() => { logout(); navigate('/login'); }} style={{color:textMuted}} className="hover:text-white transition">
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
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/super-admin/dashboard')} style={{color:textMuted}} className="hover:text-white transition">
              <ChevronLeft size={18}/>
            </button>
            <div>
              <p className="text-xs" style={{color:textMuted}}>Panel / <span style={{color:textSecondary}}>Colegios</span></p>
              <h1 className="font-bold text-base" style={{color:textPrimary}}>Directorio de colegios</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Buscador */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{color:textMuted}}/>
              <input
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                placeholder="Buscar colegio..."
                className="pl-9 pr-4 py-2 rounded-xl text-sm focus:outline-none transition"
                style={{background:bgCard, border:`1px solid ${border}`, color:textPrimary, width:200}}
              />
            </div>
          </div>
        </header>

        <div className="p-8">

          {/* Formulario crear */}
          <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}
            className="rounded-2xl p-6 mb-8" style={{background:bgCard, border:`1px solid ${border}`}}>
            <h2 className="font-bold text-sm mb-4" style={{color:textPrimary}}>Registrar nuevo colegio</h2>
            <form onSubmit={handleCrear} className="flex gap-3">
              <div className="relative flex-1">
                <Building2 size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{color:textMuted}}/>
                <input
                  type="text"
                  value={nuevoNombre}
                  onChange={e => setNuevoNombre(e.target.value)}
                  placeholder="Nombre del colegio"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none transition"
                  style={{background:bg, border:`1px solid ${border}`, color:textPrimary}}
                />
              </div>
              <button type="submit" disabled={creando}
                className="flex items-center gap-2 text-white text-sm font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition disabled:opacity-50"
                style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow:'0 4px 14px rgba(99,102,241,0.3)'}}>
                <Plus size={15}/> {creando ? 'Creando...' : 'Crear colegio'}
              </button>
            </form>
          </motion.div>

          {/* Stats rápidas */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              {label:'Total registrados', value:colegios.length, color:'#6366f1'},
              {label:'Colegios activos', value:colegios.filter(c=>c.activo).length, color:'#10b981'},
              {label:'Colegios inactivos', value:colegios.filter(c=>!c.activo).length, color:'#ef4444'},
            ].map((s,i) => (
              <div key={i} className="rounded-2xl p-5" style={{background:bgCard, border:`1px solid ${border}`}}>
                <p className="text-xs font-semibold mb-2" style={{color:textSecondary}}>{s.label}</p>
                <p className="text-3xl font-black" style={{color:s.color}}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Tabla */}
          <div className="rounded-2xl" style={{background:bgCard, border:`1px solid ${border}`}}>
            <div className="p-6 flex items-center justify-between" style={{borderBottom:`1px solid ${border}`}}>
              <div>
                <h3 className="font-bold text-sm" style={{color:textPrimary}}>Instituciones registradas</h3>
                <p className="text-xs mt-1" style={{color:textSecondary}}>{colegiosFiltrados.length} instituciones en la plataforma</p>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-7 h-7 border-2 border-t-transparent rounded-full animate-spin"
                  style={{borderColor:'#6366f1',borderTopColor:'transparent'}}></div>
              </div>
            ) : colegiosFiltrados.length === 0 ? (
              <div className="text-center py-20">
                <Building2 size={40} className="mx-auto mb-3" style={{color:border}}/>
                <p className="text-sm" style={{color:textSecondary}}>
                  {busqueda ? 'No se encontraron colegios' : 'No hay colegios registrados'}
                </p>
              </div>
            ) : (
              <div>
                {/* Header tabla */}
                <div className="grid grid-cols-4 px-6 py-3 text-xs font-semibold uppercase tracking-widest"
                  style={{color:textMuted, borderBottom:`1px solid ${border}`}}>
                  <span>Institución</span>
                  <span>Administradores</span>
                  <span>Estado</span>
                  <span>Acciones</span>
                </div>

                {colegiosFiltrados.map((c:any, i:number) => (
                  <motion.div key={c.id}
                    initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} transition={{delay:i*0.04}}
                    className="grid grid-cols-4 px-6 py-4 items-center transition-all"
                    style={{borderBottom: i<colegiosFiltrados.length-1?`1px solid ${border}`:'none'}}
                    onMouseEnter={e => (e.currentTarget.style.background='rgba(255,255,255,0.02)')}
                    onMouseLeave={e => (e.currentTarget.style.background='transparent')}>

                    {/* Nombre */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-black flex-shrink-0"
                        style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)'}}>
                        {c.nombre.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold" style={{color:textPrimary}}>{c.nombre}</p>
                        <p className="text-xs" style={{color:textMuted}}>ID #{c.id}</p>
                      </div>
                    </div>

                    {/* Admins */}
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{background:'rgba(99,102,241,0.1)'}}>
                        <UserCog size={12} style={{color:'#6366f1'}}/>
                      </div>
                      <span className="text-sm" style={{color:textSecondary}}>{c.admin?.length||0} admin{(c.admin?.length||0)!==1?'s':''}</span>
                    </div>

                    {/* Estado */}
                    <span className="px-3 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 w-fit"
                      style={{
                        background: c.activo?'rgba(16,185,129,0.1)':'rgba(239,68,68,0.1)',
                        color: c.activo?'#34d399':'#f87171',
                        border:`1px solid ${c.activo?'rgba(16,185,129,0.2)':'rgba(239,68,68,0.2)'}`
                      }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{background:c.activo?'#34d399':'#f87171'}}></span>
                      {c.activo?'Activo':'Inactivo'}
                    </span>

                    {/* Acciones */}
                    <button
                      onClick={() => handleEstado(c.id, c.activo)}
                      className="text-xs font-semibold px-4 py-2 rounded-lg transition hover:opacity-80 w-fit"
                      style={{
                        background: c.activo?'rgba(239,68,68,0.1)':'rgba(16,185,129,0.1)',
                        color: c.activo?'#f87171':'#34d399',
                        border:`1px solid ${c.activo?'rgba(239,68,68,0.2)':'rgba(16,185,129,0.2)'}`
                      }}>
                      {c.activo?'Desactivar':'Activar'}
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
