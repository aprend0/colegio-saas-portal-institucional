
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Users, Plus, Search, LayoutDashboard, School, UserCog, Settings, LogOut, ChevronLeft, Mail, Lock, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Admins() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [admins, setAdmins] = useState<any[]>([]);
  const [colegios, setColegios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [activeNav, setActiveNav] = useState('admins');
  const [mostrarForm, setMostrarForm] = useState(false);
  const [creando, setCreando] = useState(false);
  const [form, setForm] = useState({ nombre:'', email:'', password:'', colegioId:'' });

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

  useEffect(() => { cargarDatos(); }, []);

  const cargarDatos = async () => {
    try {
      const [r1, r2] = await Promise.all([api.get('/super-admin/admins'), api.get('/colegio')]);
      setAdmins(r1.data);
      setColegios(r2.data);
    } catch(e){ console.error(e); }
    finally { setLoading(false); }
  };

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreando(true);
    try {
      await api.post('/super-admin/admin', { ...form, colegioId: Number(form.colegioId) });
      setForm({ nombre:'', email:'', password:'', colegioId:'' });
      setMostrarForm(false);
      cargarDatos();
    } catch(e){ console.error(e); }
    finally { setCreando(false); }
  };

  const handleEstado = async (id: number, activo: boolean) => {
    try {
      await api.patch(`/super-admin/admin/${id}/estado`, { activo: !activo });
      cargarDatos();
    } catch(e){ console.error(e); }
  };

  const adminsFiltrados = admins.filter(a =>
    a.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    a.email.toLowerCase().includes(busqueda.toLowerCase())
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
              <p className="text-xs" style={{color:textMuted}}>Panel / <span style={{color:textSecondary}}>Administradores</span></p>
              <h1 className="font-bold text-base" style={{color:textPrimary}}>Gestión de administradores</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{color:textMuted}}/>
              <input value={busqueda} onChange={e => setBusqueda(e.target.value)}
                placeholder="Buscar administrador..."
                className="pl-9 pr-4 py-2 rounded-xl text-sm focus:outline-none transition"
                style={{background:bgCard, border:`1px solid ${border}`, color:textPrimary, width:220}}/>
            </div>
            <button onClick={() => setMostrarForm(!mostrarForm)}
              className="flex items-center gap-2 text-white text-xs font-semibold px-4 py-2 rounded-xl hover:opacity-90 transition"
              style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow:'0 4px 14px rgba(99,102,241,0.3)'}}>
              <Plus size={14}/> Nuevo admin
            </button>
          </div>
        </header>

        <div className="p-8">

          {/* Formulario */}
          {mostrarForm && (
            <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}}
              className="rounded-2xl p-6 mb-8" style={{background:bgCard, border:`1px solid ${border}`}}>
              <h2 className="font-bold text-sm mb-5" style={{color:textPrimary}}>Crear nuevo administrador</h2>
              <form onSubmit={handleCrear} className="grid grid-cols-2 gap-4">

                {/* Nombre */}
                <div>
                  <label className="text-xs font-semibold mb-2 block" style={{color:textSecondary}}>Nombre completo</label>
                  <div className="relative">
                    <UserCog size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{color:textMuted}}/>
                    <input type="text" value={form.nombre} onChange={e => setForm({...form, nombre:e.target.value})}
                      placeholder="Juan Pérez" required
                      className="w-full pl-9 pr-4 py-3 rounded-xl text-sm focus:outline-none transition"
                      style={{background:bg, border:`1px solid ${border}`, color:textPrimary}}/>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="text-xs font-semibold mb-2 block" style={{color:textSecondary}}>Correo electrónico</label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{color:textMuted}}/>
                    <input type="email" value={form.email} onChange={e => setForm({...form, email:e.target.value})}
                      placeholder="admin@colegio.com" required
                      className="w-full pl-9 pr-4 py-3 rounded-xl text-sm focus:outline-none transition"
                      style={{background:bg, border:`1px solid ${border}`, color:textPrimary}}/>
                  </div>
                </div>

                {/* Contraseña */}
                <div>
                  <label className="text-xs font-semibold mb-2 block" style={{color:textSecondary}}>Contraseña</label>
                  <div className="relative">
                    <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{color:textMuted}}/>
                    <input type="password" value={form.password} onChange={e => setForm({...form, password:e.target.value})}
                      placeholder="••••••••" required
                      className="w-full pl-9 pr-4 py-3 rounded-xl text-sm focus:outline-none transition"
                      style={{background:bg, border:`1px solid ${border}`, color:textPrimary}}/>
                  </div>
                </div>

                {/* Colegio */}
                <div>
                  <label className="text-xs font-semibold mb-2 block" style={{color:textSecondary}}>Colegio asignado</label>
                  <div className="relative">
                    <Building2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{color:textMuted}}/>
                    <select value={form.colegioId} onChange={e => setForm({...form, colegioId:e.target.value})} required
                      className="w-full pl-9 pr-4 py-3 rounded-xl text-sm focus:outline-none transition appearance-none"
                      style={{background:bg, border:`1px solid ${border}`, color:form.colegioId?textPrimary:textMuted}}>
                      <option value="">Seleccionar colegio</option>
                      {colegios.map((c:any) => (
                        <option key={c.id} value={c.id}>{c.nombre}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Botones */}
                <div className="col-span-2 flex gap-3 justify-end mt-2">
                  <button type="button" onClick={() => setMostrarForm(false)}
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold transition hover:opacity-80"
                    style={{background:'transparent', border:`1px solid ${border}`, color:textSecondary}}>
                    Cancelar
                  </button>
                  <button type="submit" disabled={creando}
                    className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
                    style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow:'0 4px 14px rgba(99,102,241,0.3)'}}>
                    {creando ? 'Creando...' : 'Crear administrador'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              {label:'Total admins', value:admins.length, color:'#6366f1'},
              {label:'Activos', value:admins.filter(a=>a.activo).length, color:'#10b981'},
              {label:'Inactivos', value:admins.filter(a=>!a.activo).length, color:'#ef4444'},
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
                <h3 className="font-bold text-sm" style={{color:textPrimary}}>Administradores registrados</h3>
                <p className="text-xs mt-1" style={{color:textSecondary}}>{adminsFiltrados.length} administradores en la plataforma</p>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-7 h-7 border-2 border-t-transparent rounded-full animate-spin"
                  style={{borderColor:'#6366f1',borderTopColor:'transparent'}}></div>
              </div>
            ) : adminsFiltrados.length === 0 ? (
              <div className="text-center py-20">
                <Users size={40} className="mx-auto mb-3" style={{color:border}}/>
                <p className="text-sm" style={{color:textSecondary}}>
                  {busqueda ? 'No se encontraron administradores' : 'No hay administradores registrados'}
                </p>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-4 px-6 py-3 text-xs font-semibold uppercase tracking-widest"
                  style={{color:textMuted, borderBottom:`1px solid ${border}`}}>
                  <span>Administrador</span><span>Colegio</span><span>Estado</span><span>Acciones</span>
                </div>
                {adminsFiltrados.map((a:any, i:number) => (
                  <motion.div key={a.id}
                    initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} transition={{delay:i*0.04}}
                    className="grid grid-cols-4 px-6 py-4 items-center transition-all"
                    style={{borderBottom:i<adminsFiltrados.length-1?`1px solid ${border}`:'none'}}
                    onMouseEnter={e => (e.currentTarget.style.background='rgba(255,255,255,0.02)')}
                    onMouseLeave={e => (e.currentTarget.style.background='transparent')}>

                    {/* Admin info */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-black flex-shrink-0"
                        style={{background:'linear-gradient(135deg,#8b5cf6,#6366f1)'}}>
                        {a.nombre.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold" style={{color:textPrimary}}>{a.nombre}</p>
                        <p className="text-xs" style={{color:textMuted}}>{a.email}</p>
                      </div>
                    </div>

                    {/* Colegio */}
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{background:'rgba(99,102,241,0.1)'}}>
                        <School size={12} style={{color:'#6366f1'}}/>
                      </div>
                      <span className="text-sm" style={{color:textSecondary}}>{a.colegio?.nombre || '—'}</span>
                    </div>

                    {/* Estado */}
                    <span className="px-3 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 w-fit"
                      style={{
                        background: a.activo?'rgba(16,185,129,0.1)':'rgba(239,68,68,0.1)',
                        color: a.activo?'#34d399':'#f87171',
                        border:`1px solid ${a.activo?'rgba(16,185,129,0.2)':'rgba(239,68,68,0.2)'}`
                      }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{background:a.activo?'#34d399':'#f87171'}}></span>
                      {a.activo?'Activo':'Inactivo'}
                    </span>

                    {/* Acción */}
                    <button onClick={() => handleEstado(a.id, a.activo)}
                      className="text-xs font-semibold px-4 py-2 rounded-lg transition hover:opacity-80 w-fit"
                      style={{
                        background: a.activo?'rgba(239,68,68,0.1)':'rgba(16,185,129,0.1)',
                        color: a.activo?'#f87171':'#34d399',
                        border:`1px solid ${a.activo?'rgba(239,68,68,0.2)':'rgba(16,185,129,0.2)'}`
                      }}>
                      {a.activo?'Desactivar':'Activar'}
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
