import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import AdminLayout from '../../components/AdminLayout';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const [contenido, setContenido] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState<any>(null);
  const [eliminando, setEliminando] = useState<any>(null);
  const [formEdit, setFormEdit] = useState({titulo:'', descripcion:'', tipo:'', activo:true});

  const BG_CARD = '#0d1b2e';
  const BG_CARD2 = '#0a1525';
  const BORDER = 'rgba(255,255,255,0.07)';
  const TEXT = '#e2e8f0';
  const TEXT_MUTED = '#64748b';
  const CYAN = '#22d3ee';

  const cargarDatos = async () => {
    try {
      if (usuario?.colegioId) {
        const res = await api.get(`/contenido/colegio/${usuario.colegioId}`);
        setContenido(res.data);
      }
    } catch(e){ console.error(e); }
    finally { setLoading(false); }
  };

  const handleEditar = (c: any) => {
    setEditando(c);
    setFormEdit({ titulo: c.titulo, descripcion: c.descripcion, tipo: c.tipo, activo: c.activo });
  };

  const handleGuardarEdit = async () => {
    try {
      await api.patch(`/contenido/${editando.id}`, formEdit);
      setEditando(null);
      cargarDatos();
    } catch(e){ console.error(e); }
  };

  const handleEliminar = async () => {
    if (eliminando.activo) {
      alert('No puedes eliminar una publicación activa. Primero cámbiala a Inactivo.');
      setEliminando(null);
      return;
    }
    try {
      await api.delete(`/contenido/${eliminando.id}`);
      setEliminando(null);
      cargarDatos();
    } catch(e){ console.error(e); }
  };

  useEffect(() => { cargarDatos(); }, [usuario]);

  const comunicados = contenido.filter(c => c.tipo === 'comunicado');
  const noticias = contenido.filter(c => c.tipo === 'noticia');
  const eventos = contenido.filter(c => c.tipo === 'evento');
  const recientes = [...contenido].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0,5);

  const tipoColor: any = { comunicado:'#818cf8', noticia:'#f472b6', evento:'#34d399' };
  const tipoIcon: any = { comunicado:'campaign', noticia:'newspaper', evento:'calendar_month' };

  return (
    <AdminLayout>
      <div className="space-y-6">

        {/* Header */}
        <div>
          <h2 style={{fontSize:'22px', fontWeight:900, color:TEXT, margin:0}}>Dashboard</h2>
          <p style={{fontSize:'13px', color:TEXT_MUTED, margin:0}}>Resumen de tu institución educativa</p>
        </div>

        {/* Stats */}
        <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px'}}>
          {[
            {icon:'campaign', label:'COMUNICADOS', value:comunicados.length, color:'#818cf8'},
            {icon:'newspaper', label:'NOTICIAS E INFORMES', value:noticias.length, color:'#f472b6'},
            {icon:'calendar_month', label:'EVENTOS EN AGENDA', value:eventos.length, color:'#34d399'},
            {icon:'manage_accounts', label:'GESTORES AUTORIZADOS', value:1, color:CYAN},
          ].map((s,i) => (
            <div key={i} style={{borderRadius:'16px', padding:'20px', background:BG_CARD, border:`1px solid ${BORDER}`}}>
              <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'12px'}}>
                <span style={{fontSize:'11px', fontWeight:700, color:TEXT_MUTED, textTransform:'uppercase', letterSpacing:'0.1em'}}>{s.label}</span>
                <span className="material-symbols-outlined" style={{fontSize:'22px', color:s.color}}>{s.icon}</span>
              </div>
              <p style={{fontSize:'32px', fontWeight:900, color:TEXT, margin:0}}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Publicaciones recientes */}
        <div style={{borderRadius:'16px', background:BG_CARD, border:`1px solid ${BORDER}`}}>
          <div style={{padding:'20px 24px', borderBottom:`1px solid ${BORDER}`, display:'flex', alignItems:'center', justifyContent:'space-between'}}>
            <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
              <span className="material-symbols-outlined" style={{fontSize:'20px', color:CYAN}}>article</span>
              <div>
                <h3 style={{fontSize:'15px', fontWeight:700, color:TEXT, margin:0}}>Publicaciones Recientes</h3>
                <p style={{fontSize:'12px', color:TEXT_MUTED, margin:0}}>Gestiona el contenido institucional</p>
              </div>
            </div>
            <button onClick={() => navigate('/admin/contenido')}
              style={{display:'flex', alignItems:'center', gap:'6px', padding:'8px 16px', borderRadius:'10px', background:`${CYAN}15`, border:`1px solid ${CYAN}30`, color:CYAN, fontSize:'12px', fontWeight:700, cursor:'pointer'}}>
              <span className="material-symbols-outlined" style={{fontSize:'16px'}}>add</span>
              Nueva Publicación
            </button>
          </div>

          {loading ? (
            <div style={{padding:'40px', textAlign:'center'}}>
              <div style={{width:'32px', height:'32px', border:`2px solid ${CYAN}`, borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto'}}/>
            </div>
          ) : recientes.length === 0 ? (
            <div style={{padding:'40px', textAlign:'center', color:TEXT_MUTED}}>No hay publicaciones aún.</div>
          ) : (
            <>
              {/* Header tabla */}
              <div style={{display:'grid', gridTemplateColumns:'1fr 120px 120px 100px 80px', gap:'12px', padding:'10px 24px', borderBottom:`1px solid ${BORDER}`}}>
                {['Título','Tipo','Fecha','Estado','Acción'].map(h => (
                  <span key={h} style={{fontSize:'11px', fontWeight:700, color:TEXT_MUTED, textTransform:'uppercase', letterSpacing:'0.08em'}}>{h}</span>
                ))}
              </div>
              {recientes.map((c:any) => (
                <div key={c.id} style={{display:'grid', gridTemplateColumns:'1fr 120px 120px 100px 80px', gap:'12px', padding:'14px 24px', borderBottom:`1px solid ${BORDER}`, alignItems:'center'}}>
                  <div style={{display:'flex', alignItems:'center', gap:'10px', minWidth:0}}>
                    <div style={{width:'32px', height:'32px', borderRadius:'8px', background:`${tipoColor[c.tipo]}15`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}>
                      <span className="material-symbols-outlined" style={{fontSize:'16px', color:tipoColor[c.tipo]}}>{tipoIcon[c.tipo]}</span>
                    </div>
                    <div style={{minWidth:0}}>
                      <p style={{fontSize:'13px', fontWeight:700, color:TEXT, margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{c.titulo}</p>
                      <p style={{fontSize:'11px', color:TEXT_MUTED, margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{c.descripcion}</p>
                    </div>
                  </div>
                  <span style={{fontSize:'11px', fontWeight:700, padding:'4px 10px', borderRadius:'999px', background:`${tipoColor[c.tipo]}15`, color:tipoColor[c.tipo], textTransform:'capitalize', width:'fit-content'}}>{c.tipo}</span>
                  <span style={{fontSize:'12px', color:TEXT_MUTED}}>{new Date(c.createdAt).toLocaleDateString('es-PE')}</span>
                  <span style={{display:'inline-flex', alignItems:'center', gap:'6px', fontSize:'11px', fontWeight:700, padding:'4px 10px', borderRadius:'999px', background:c.activo?'#22c55e15':'rgba(255,255,255,0.05)', color:c.activo?'#22c55e':TEXT_MUTED, border:`1px solid ${c.activo?'#22c55e30':BORDER}`}}>
                    <span style={{width:'6px', height:'6px', borderRadius:'50%', background:c.activo?'#22c55e':TEXT_MUTED, display:'inline-block'}}/>
                    {c.activo?'Publicado':'Inactivo'}
                  </span>
                  <div style={{display:'flex', alignItems:'center', gap:'4px'}}>
                    <button onClick={() => handleEditar(c)} style={{padding:'6px', borderRadius:'8px', background:'#0ea5e915', border:'none', cursor:'pointer', color:'#0ea5e9', display:'flex', alignItems:'center'}}>
                      <span className="material-symbols-outlined" style={{fontSize:'16px'}}>edit</span>
                    </button>
                    <button onClick={() => setEliminando(c)} style={{padding:'6px', borderRadius:'8px', background:'#ef444415', border:'none', cursor:'pointer', color:'#ef4444', display:'flex', alignItems:'center'}}>
                      <span className="material-symbols-outlined" style={{fontSize:'16px'}}>delete</span>
                    </button>
                  </div>
                </div>
              ))}
              <div style={{padding:'12px 24px', display:'flex', justifyContent:'flex-end'}}>
                <button onClick={() => navigate('/admin/contenido')} style={{fontSize:'12px', fontWeight:700, color:CYAN, background:'none', border:'none', cursor:'pointer'}}>
                  Ver todas las publicaciones →
                </button>
              </div>
            </>
          )}
        </div>

        {/* Accesos rápidos */}
        <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px'}}>
          {[
            {icon:'campaign', label:'Crear Comunicado', color:'#818cf8', path:'/admin/contenido?tipo=comunicado'},
            {icon:'newspaper', label:'Publicar Noticia', color:'#f472b6', path:'/admin/contenido?tipo=noticia'},
            {icon:'event', label:'Nuevo Evento', color:'#34d399', path:'/admin/contenido?tipo=evento'},
            {icon:'photo_library', label:'Subir Imagen', color:'#fb923c', path:'/admin/galeria'},
          ].map((a,i) => (
            <button key={i} onClick={() => navigate(a.path)}
              style={{padding:'20px', borderRadius:'16px', background:BG_CARD2, border:`1px solid ${BORDER}`, cursor:'pointer', textAlign:'center', transition:'all 0.2s'}}
              onMouseEnter={e => { e.currentTarget.style.background=`${a.color}10`; e.currentTarget.style.borderColor=`${a.color}40`; }}
              onMouseLeave={e => { e.currentTarget.style.background=BG_CARD2; e.currentTarget.style.borderColor=BORDER; }}>
              <span className="material-symbols-outlined" style={{fontSize:'28px', color:a.color, display:'block', marginBottom:'8px'}}>{a.icon}</span>
              <span style={{fontSize:'13px', fontWeight:600, color:TEXT}}>{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Modal Editar */}
      {editando && (
        <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100, padding:'20px'}}>
          <div style={{background:'#0d1b2e', borderRadius:'20px', padding:'32px', width:'100%', maxWidth:'480px', border:`1px solid ${BORDER}`}}>
            <h3 style={{fontSize:'18px', fontWeight:700, color:TEXT, marginBottom:'24px'}}>Editar Publicación</h3>
            <div style={{display:'flex', flexDirection:'column', gap:'16px', marginBottom:'24px'}}>
              <div>
                <label style={{display:'block', fontSize:'12px', fontWeight:700, color:TEXT_MUTED, marginBottom:'8px', textTransform:'uppercase'}}>Título</label>
                <input value={formEdit.titulo} onChange={e => setFormEdit({...formEdit, titulo:e.target.value})}
                  style={{width:'100%', padding:'12px 16px', borderRadius:'12px', background:BG_CARD2, border:`1px solid ${BORDER}`, color:TEXT, fontSize:'14px', outline:'none', boxSizing:'border-box'}}/>
              </div>
              <div>
                <label style={{display:'block', fontSize:'12px', fontWeight:700, color:TEXT_MUTED, marginBottom:'8px', textTransform:'uppercase'}}>Descripción</label>
                <textarea value={formEdit.descripcion} onChange={e => setFormEdit({...formEdit, descripcion:e.target.value})} rows={3}
                  style={{width:'100%', padding:'12px 16px', borderRadius:'12px', background:BG_CARD2, border:`1px solid ${BORDER}`, color:TEXT, fontSize:'14px', outline:'none', resize:'vertical', boxSizing:'border-box'}}/>
              </div>
              <div>
                <label style={{display:'block', fontSize:'12px', fontWeight:700, color:TEXT_MUTED, marginBottom:'8px', textTransform:'uppercase'}}>Tipo</label>
                <select value={formEdit.tipo} onChange={e => setFormEdit({...formEdit, tipo:e.target.value})}
                  style={{width:'100%', padding:'12px 16px', borderRadius:'12px', background:BG_CARD2, border:`1px solid ${BORDER}`, color:TEXT, fontSize:'14px', outline:'none'}}>
                  <option value="comunicado">Comunicado</option>
                  <option value="noticia">Noticia</option>
                  <option value="evento">Evento</option>
                </select>
              </div>
              <div>
                <label style={{display:'block', fontSize:'12px', fontWeight:700, color:TEXT_MUTED, marginBottom:'8px', textTransform:'uppercase'}}>Estado</label>
                <select value={formEdit.activo?'1':'0'} onChange={e => setFormEdit({...formEdit, activo:e.target.value==='1'})}
                  style={{width:'100%', padding:'12px 16px', borderRadius:'12px', background:BG_CARD2, border:`1px solid ${BORDER}`, color:TEXT, fontSize:'14px', outline:'none'}}>
                  <option value="1">Publicado</option>
                  <option value="0">Inactivo</option>
                </select>
              </div>
            </div>
            <div style={{display:'flex', gap:'12px'}}>
              <button onClick={() => setEditando(null)}
                style={{flex:1, padding:'12px', borderRadius:'12px', background:'transparent', border:`1px solid ${BORDER}`, color:TEXT_MUTED, cursor:'pointer', fontSize:'14px', fontWeight:600}}>
                Cancelar
              </button>
              <button onClick={handleGuardarEdit}
                style={{flex:2, padding:'12px', borderRadius:'12px', background:'linear-gradient(135deg,#1e40af,#0ea5e9)', color:'white', border:'none', cursor:'pointer', fontSize:'14px', fontWeight:700}}>
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Eliminar */}
      {eliminando && (
        <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100, padding:'20px'}}>
          <div style={{background:'#0d1b2e', borderRadius:'20px', padding:'32px', width:'100%', maxWidth:'420px', border:`1px solid ${BORDER}`, textAlign:'center'}}>
            <span className="material-symbols-outlined" style={{fontSize:'48px', color:'#ef4444', display:'block', marginBottom:'16px'}}>delete_forever</span>
            <h3 style={{fontSize:'18px', fontWeight:700, color:TEXT, marginBottom:'8px'}}>¿Eliminar publicación?</h3>
            <p style={{fontSize:'14px', color:TEXT_MUTED, marginBottom:'8px'}}>"{eliminando.titulo}"</p>
            {eliminando.activo ? (
              <p style={{fontSize:'13px', color:'#f59e0b', marginBottom:'24px', padding:'10px', borderRadius:'10px', background:'#f59e0b15'}}>
                ⚠️ Esta publicación está activa. Cámbiala a Inactivo antes de eliminarla.
              </p>
            ) : (
              <p style={{fontSize:'13px', color:TEXT_MUTED, marginBottom:'24px'}}>Esta publicación será eliminada permanentemente.</p>
            )}
            <div style={{display:'flex', gap:'12px'}}>
              <button onClick={() => setEliminando(null)}
                style={{flex:1, padding:'12px', borderRadius:'12px', background:'transparent', border:`1px solid ${BORDER}`, color:TEXT_MUTED, cursor:'pointer', fontSize:'14px', fontWeight:600}}>
                Cancelar
              </button>
              <button onClick={handleEliminar}
                disabled={eliminando.activo}
                style={{flex:2, padding:'12px', borderRadius:'12px', background: eliminando.activo ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg,#dc2626,#ef4444)', color: eliminando.activo ? '#64748b' : 'white', border:'none', cursor: eliminando.activo ? 'not-allowed' : 'pointer', fontSize:'14px', fontWeight:700}}>
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </AdminLayout>
  );
}
