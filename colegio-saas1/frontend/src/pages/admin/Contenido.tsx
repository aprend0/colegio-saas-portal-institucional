import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { motion } from 'framer-motion';
import AdminLayout from '../../components/AdminLayout';
import SelectorGaleriaModal from '../../components/SelectorGaleriaModal'; // Importamos el componente modal

export default function Contenido() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { usuario } = useAuth();
  const [contenido, setContenido] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroTipo, setFiltroTipo] = useState('comunicado');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [creando, setCreando] = useState(false);
  
  // Estado para controlar si estamos editando un elemento existente
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [form, setForm] = useState({ titulo:'', descripcion:'', tipo:'comunicado' });
  
  // Estados para el manejo de archivos binarios (imágenes/documentos)
  const [archivo, setArchivo] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // NUEVOS ESTADOS: Para el manejo de selección desde la Galería Fotográfica
  const [mostrarSelectorGaleria, setMostrarSelectorGaleria] = useState(false);
  const [imagenGaleriaRuta, setImagenGaleriaRuta] = useState<string>(''); // Guarda la ruta string del backend
  const [previewUrl, setPreviewUrl] = useState<string>(''); // Guarda la URL completa para renderizar la miniatura

  const BORDER = 'rgba(255,255,255,0.07)';
  const TEXT = '#e2e8f0';
  const TEXT_MUTED = '#64748b';
  const BG_CARD = '#0d1b2e';
  const BG_CARD2 = '#0a1525';

  const tipoConfig: any = {
    comunicado: { color:'#818cf8', icon:'campaign', label:'Comunicado' },
    noticia: { color:'#f472b6', icon:'newspaper', label:'Noticia' },
    evento: { color:'#34d399', icon:'calendar_month', label:'Evento' },
  };

  const tituloPagina: any = {
    comunicado: { title:'Gestión de Comunicados', desc:'Canal prioritario de avisos para estudiantes, padres y profesores.' },
    noticia: { title:'Noticias y Prensa', desc:'Publica boletines informativos y logros de la comunidad educativa.' },
    evento: { title:'Calendario Escolar', desc:'Planifica y organiza los eventos y actividades institucionales.' },
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tipo = params.get('tipo') || 'comunicado';
    setFiltroTipo(tipo);
  }, [location.search]);

  useEffect(() => { cargar(); }, [usuario]);

  const cargar = async () => {
    try {
      if (usuario?.colegioId) {
        const res = await api.get(`/contenido/colegio/${usuario.colegioId}`);
        setContenido(res.data);
      }
    } catch(e){ console.error(e); }
    finally { setLoading(false); }
  };

  // Capturar el archivo seleccionado localmente por el usuario
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setArchivo(file);
      setImagenGaleriaRuta(''); // Si sube un archivo nuevo, limpiamos la selección de la galería anterior
      setPreviewUrl(URL.createObjectURL(file)); // Generamos preview temporal local
    }
  };

  // Capturar la imagen seleccionada desde el modal de la galería fotográfica
  const handleSelectImagenDesdeGaleria = (urlCompleta: string, rutaCorta: string) => {
    setImagenGaleriaRuta(rutaCorta); // Ej: /uploads/galeria/imagen.jpg
    setPreviewUrl(urlCompleta);      // Ej: http://localhost:3000/uploads/galeria/imagen.jpg
    setArchivo(null);                 // Si elige de galería, limpiamos cualquier archivo físico cargado previamente
  };

  // Enviar formulario (Soporta tanto creación como edición adaptando el Content-Type automáticamente)
  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreando(true);
    try {
      // 1. Preparamos los datos
      const formData = new FormData();
      formData.append('titulo', form.titulo);
      formData.append('descripcion', form.descripcion);
      formData.append('tipo', form.tipo);
      if (usuario?.colegioId) formData.append('colegioId', usuario.colegioId.toString());
      
      // 2. Si hay un archivo nuevo, lo adjuntamos
      if (archivo) {
        formData.append('file', archivo);
      } 
      // 3. Si no hay archivo nuevo, pero sí hay una imagen vinculada, la enviamos como campo de texto
      else if (imagenGaleriaRuta) {
        formData.append('imagen', imagenGaleriaRuta);
      }

      // 4. USAMOS PATCH EN LUGAR DE PUT para evitar el error de método
      if (editandoId) {
        // Al usar PATCH, enviamos el FormData. Asegúrate de que en NestJS el método sea @Patch(':id')
        await api.patch(`/contenido/${editandoId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/contenido', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      limpiarFormulario();
      setMostrarModal(false);
      cargar();
    } catch(e: any){ 
      console.error('Error al guardar:', e);
      alert(`Error al guardar: ${e.response?.data?.message || 'Error desconocido'}`);
    } finally { 
      setCreando(false); 
    }
  };

  const limpiarFormulario = () => {
    setForm({ titulo:'', descripcion:'', tipo: filtroTipo });
    setArchivo(null);
    setImagenGaleriaRuta('');
    setPreviewUrl('');
    setEditandoId(null);
  };

  // Activa la interfaz de edición inyectando los datos actuales en el modal
  const handleEditar = (item: any) => {
    setEditandoId(item.id);
    setForm({
      titulo: item.titulo,
      descripcion: item.descripcion,
      tipo: item.tipo
    });
    
    // Si la publicación ya cuenta con una imagen guardada
    if (item.imagen) {
      setImagenGaleriaRuta(item.imagen);
      const API_URL = 'http://localhost:3000';
      const urlCompleta = item.imagen.startsWith('/') ? `${API_URL}${item.imagen}` : `${API_URL}/${item.imagen}`;
      setPreviewUrl(urlCompleta);
    } else {
      setImagenGaleriaRuta('');
      setPreviewUrl('');
    }
    setArchivo(null); 
    setMostrarModal(true);
  };

  // NUEVA FUNCIÓN: Inactivar (Soft Delete cambiando estado)
  const handleInactivar = async (id: number) => {
    if (window.confirm('¿Está seguro de que desea inactivar esta publicación? Pasará al panel de inactivos.')) {
      try {
        await api.patch(`/contenido/${id}/eliminar`);
        cargar();
      } catch(e){ console.error(e); }
    }
  };

  // FUNCIÓN CORREGIDA: Eliminar Definitivo (Borrado físico)
  const handleEliminar = async (id: number) => {
    if (window.confirm('¡ADVERTENCIA! ¿Está seguro de que desea ELIMINAR PERMANENTEMENTE esta publicación? Esta acción no se puede deshacer.')) {
      try {
        await api.delete(`/contenido/${id}`);
        cargar();
      } catch(e){ 
        console.error(e);
        alert('Error al intentar eliminar permanentemente el registro de la base de datos.');
      }
    }
  };

  const comunicados = contenido.filter(c => c.tipo === 'comunicado');
  const noticias = contenido.filter(c => c.tipo === 'noticia');
  const eventos = contenido.filter(c => c.tipo === 'evento');
  const contenidoFiltrado = contenido.filter(c => c.tipo === filtroTipo);
  const tc = tipoConfig[filtroTipo];
  const tp = tituloPagina[filtroTipo];

  return (
    <AdminLayout contenidoCounts={{comunicados:comunicados.length, noticias:noticias.length, eventos:eventos.length}}>
      <div className="space-y-6">

        {/* Page Title */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-3xl" style={{color:tc.color}}>{tc.icon}</span>
            <div>
              <h2 className="text-2xl font-black" style={{color:TEXT}}>{tp.title}</h2>
              <p className="text-sm" style={{color:TEXT_MUTED}}>{tp.desc}</p>
            </div>
          </div>
          <button onClick={() => { limpiarFormulario(); setForm({titulo:'', descripcion:'', tipo:filtroTipo}); setMostrarModal(true); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white transition-all hover:opacity-90"
            style={{background:'linear-gradient(135deg,#1e40af,#0ea5e9)', boxShadow:'0 4px 15px rgba(14,165,233,0.3)'}}>
            <span className="material-symbols-outlined text-xl">add_circle</span>
            Nuevo {tc.label}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            {icon:'send', label:'PUBLICADOS', value:contenidoFiltrado.filter(c=>c.activo).length, color:'#22d3ee'},
            {icon:'draft', label:'INACTIVOS', value:contenidoFiltrado.filter(c=>!c.activo).length, color:'#818cf8'},
            {icon:'schedule', label:'TOTAL', value:contenidoFiltrado.length, color:'#f59e0b'},
            {icon:'visibility', label:'ALCANCE PROM.', value:'85%', color:'#34d399'},
          ].map((s,i) => (
            <div key={i} className="rounded-2xl p-5"
              style={{background:BG_CARD, border:`1px solid ${BORDER}`}}>
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-lg" style={{color:s.color}}>{s.icon}</span>
                <span className="text-xs font-bold uppercase tracking-wider" style={{color:TEXT_MUTED}}>{s.label}</span>
              </div>
              <p className="text-3xl font-black" style={{color:TEXT}}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Tabla */}
        <div className="rounded-2xl overflow-hidden" style={{background:BG_CARD2, border:`1px solid ${BORDER}`}}>

          {/* Filtros */}
          <div className="px-6 py-4 flex items-center justify-between" style={{borderBottom:`1px solid ${BORDER}`}}>
            <div className="flex gap-2">
              {['comunicado','noticia','evento'].map(tipo => {
                const t = tipoConfig[tipo];
                const active = filtroTipo === tipo;
                return (
                  <button key={tipo} onClick={() => setFiltroTipo(tipo)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all"
                    style={{
                      background: active ? `${t.color}18` : 'transparent',
                      color: active ? t.color : TEXT_MUTED,
                      border: active ? `1px solid ${t.color}35` : `1px solid ${BORDER}`,
                    }}>
                    <span className="material-symbols-outlined text-base">{t.icon}</span>
                    {t.label}s
                  </button>
                );
              })}
            </div>
          </div>

          {/* Lista */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
                style={{borderColor:'#0ea5e9', borderTopColor:'transparent'}}></div>
            </div>
          ) : contenidoFiltrado.length === 0 ? (
            <div className="text-center py-20">
              <span className="material-symbols-outlined text-6xl block mb-4" style={{color:'#1e293b'}}>{tc.icon}</span>
              <p className="text-base font-semibold mb-1" style={{color:TEXT_MUTED}}>No hay {tc.label.toLowerCase()}s aún</p>
              <button onClick={() => { limpiarFormulario(); setForm({titulo:'', descripcion:'', tipo:filtroTipo}); setMostrarModal(true); }}
                className="mt-3 px-5 py-2.5 rounded-xl text-sm font-bold text-white"
                style={{background:'linear-gradient(135deg,#1e40af,#0ea5e9)'}}>
                + Crear {tc.label}
              </button>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: BORDER }}>
              {contenidoFiltrado.map((c:any, i:number) => (
                <motion.div key={c.id} initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} transition={{delay:i*0.04}}
                  className="flex items-start gap-5 px-6 py-5 transition-all"
                  onMouseEnter={e => (e.currentTarget.style.background=BG_CARD)}
                  onMouseLeave={e => (e.currentTarget.style.background='transparent')}>
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{background:`${tc.color}12`, border:`1px solid ${tc.color}25`}}>
                    <span className="material-symbols-outlined text-2xl" style={{color:tc.color}}>{tc.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-bold text-base" style={{color:TEXT}}>{c.titulo}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase"
                        style={{
                          background:c.activo?'#22c55e18':'#64748b18',
                          color:c.activo?'#22c55e':'#64748b',
                          border:`1px solid ${c.activo?'#22c55e30':'#64748b30'}`
                        }}>
                        {c.activo ? 'PUBLICADO' : 'INACTIVO'}
                      </span>
                    </div>
                    <p className="text-sm line-clamp-2 mb-3" style={{color:TEXT_MUTED}}>{c.descripcion}</p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-sm" style={{color:TEXT_MUTED}}>schedule</span>
                        <span className="text-xs" style={{color:TEXT_MUTED}}>
                          {new Date(c.createdAt).toLocaleDateString('es-PE',{day:'numeric',month:'short',year:'numeric'})}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-sm" style={{color:TEXT_MUTED}}>group</span>
                        <span className="text-xs font-semibold" style={{color:'#0ea5e9'}}>Comunidad Educativa</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <p className="text-xs font-bold uppercase tracking-wider" style={{color:TEXT_MUTED}}>RECEPCIÓN</p>
                    <p className="text-lg font-black" style={{color:tc.color}}>85%</p>
                    <div className="w-24 h-1.5 rounded-full overflow-hidden" style={{background:'#1e293b'}}>
                      <div className="h-full rounded-full" style={{width:'85%', background:`linear-gradient(to right,${tc.color},#0ea5e9)`}}></div>
                    </div>
                  </div>
                  
                  {/* BOTONES DE ACCIÓN CONFIGURADOS */}
                  <div className="flex flex-col gap-2 flex-shrink-0 ml-4">
                    <button onClick={() => handleEditar(c)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-80"
                      style={{background:'#0ea5e915', color:'#0ea5e9', border:'1px solid #0ea5e925'}}>
                      <span className="material-symbols-outlined text-base">edit</span>Editar
                    </button>
                    
                    {/* Botón Inactivar (Reemplaza la lógica visual del anterior eliminar) */}
                    <button onClick={() => handleInactivar(c.id)}
                      disabled={!c.activo}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{background:'#eab30815', color:'#eab308', border:'1px solid #eab30825'}}>
                      <span className="material-symbols-outlined text-base">power_off</span>Inactivar
                    </button>

                    {/* Nuevo Botón Eliminar Definitivo */}
                    <button onClick={() => handleEliminar(c.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-80"
                      style={{background:'#ef444415', color:'#ef4444', border:'1px solid #ef444425'}}>
                      <span className="material-symbols-outlined text-base">delete_forever</span>Eliminar
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {contenidoFiltrado.length > 0 && (
            <div className="px-6 py-4 flex items-center justify-between" style={{borderTop:`1px solid ${BORDER}`}}>
              <p className="text-xs" style={{color:TEXT_MUTED}}>Mostrando {contenidoFiltrado.length} de {contenido.length} publicaciones</p>
              <button className="px-3 py-1 rounded-lg text-sm font-bold"
                style={{background:`${tc.color}15`, color:tc.color, border:`1px solid ${tc.color}25`}}>1</button>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Creación / Edición */}
      {mostrarModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0" style={{background:'rgba(6,15,30,0.85)', backdropFilter:'blur(8px)'}}
            onClick={() => setMostrarModal(false)}></div>
          <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}}
            className="relative w-full max-w-2xl rounded-3xl shadow-2xl"
            style={{background:'#0d1b2e', border:`1px solid ${BORDER}`}}>
            <div className="p-6 flex items-center justify-between" style={{borderBottom:`1px solid ${BORDER}`}}>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-2xl" style={{color:tc.color}}>{tc.icon}</span>
                <h3 className="text-xl font-black" style={{color:TEXT}}>
                  {editandoId ? `Editar ${tc.label}` : `Nuevo ${tc.label}`}
                </h3>
              </div>
              <button onClick={() => setMostrarModal(false)} style={{color:TEXT_MUTED}}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleGuardar} className="p-6 space-y-5">
              <div>
                <label className="text-sm font-bold mb-3 block" style={{color:TEXT_MUTED}}>Tipo de publicación</label>
                <div className="grid grid-cols-3 gap-3">
                  {['comunicado','noticia','evento'].map(tipo => {
                    const t = tipoConfig[tipo];
                    const active = form.tipo === tipo;
                    return (
                      <button key={tipo} type="button" onClick={() => setForm({...form, tipo})}
                        className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all"
                        style={{
                          background: active ? `${t.color}18` : BG_CARD,
                          color: active ? t.color : TEXT_MUTED,
                          border:`1px solid ${active ? t.color+'35' : BORDER}`,
                        }}>
                        <span className="material-symbols-outlined text-base">{t.icon}</span>
                        {t.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="text-sm font-bold mb-2 block" style={{color:TEXT_MUTED}}>Título</label>
                <input type="text" value={form.titulo} onChange={e => setForm({...form, titulo:e.target.value})}
                  placeholder="Ej. Inicio de Matrícula 2026" required
                  className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none"
                  style={{background:BG_CARD, border:`1px solid ${BORDER}`, color:TEXT}}/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold mb-2 block" style={{color:TEXT_MUTED}}>Público objetivo</label>
                  <div className="relative">
                    <select className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none appearance-none"
                      style={{background:BG_CARD, border:`1px solid ${BORDER}`, color:TEXT}}>
                      <option>Todos los destinatarios</option>
                      <option>Solo Estudiantes</option>
                      <option>Solo Profesores</option>
                      <option>Solo Padres</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-3 pointer-events-none" style={{color:TEXT_MUTED}}>expand_more</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-bold mb-2 block" style={{color:TEXT_MUTED}}>Programar envío</label>
                  <input type="datetime-local" className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none"
                    style={{background:BG_CARD, border:`1px solid ${BORDER}`, color:TEXT}}/>
                </div>
              </div>
              <div>
                <label className="text-sm font-bold mb-2 block" style={{color:TEXT_MUTED}}>Contenido</label>
                <div className="rounded-xl overflow-hidden" style={{border:`1px solid ${BORDER}`}}>
                  <div className="flex gap-1 p-2" style={{background:BG_CARD, borderBottom:`1px solid ${BORDER}`}}>
                    {['format_bold','format_italic','format_list_bulleted','attach_file','image'].map(icon => (
                      <button key={icon} type="button" className="p-1.5 rounded" style={{color:TEXT_MUTED}}>
                        <span className="material-symbols-outlined text-sm">{icon}</span>
                      </button>
                    ))}
                  </div>
                  <textarea value={form.descripcion} onChange={e => setForm({...form, descripcion:e.target.value})}
                    placeholder="Escriba el mensaje aquí..." rows={5} required
                    className="w-full bg-transparent border-none p-4 text-sm focus:outline-none resize-none"
                    style={{color:TEXT, background:BG_CARD2}}/>
                </div>
              </div>

              {/* CONTROLES DE IMAGEN REMODELADOS (HÍBRIDO) */}
              <div>
                <label className="text-sm font-bold mb-2 block" style={{color:TEXT_MUTED}}>Imagen de la publicación</label>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <button
                    type="button"
                    onClick={() => setMostrarSelectorGaleria(true)}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all text-white"
                    style={{ background: '#0a1525', border: `1px solid ${BORDER}` }}
                  >
                    <span className="material-symbols-outlined text-lg" style={{ color: '#fb923c' }}>photo_library</span>
                    Elegir de Galería
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all text-white"
                    style={{ background: '#0a1525', border: `1px solid ${BORDER}` }}
                  >
                    <span className="material-symbols-outlined text-lg" style={{ color: '#0ea5e9' }}>computer</span>
                    Subir de Escritorio
                  </button>
                </div>

                {/* Input File Oculto para Carga Local */}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  style={{ display: 'none' }} 
                  accept="image/*" 
                />

                {/* Zona Visual de Estado de la Imagen Adjunta / Vinculada */}
                {previewUrl && (
                  <div className="flex items-center gap-4 p-4 rounded-xl"
                    style={{ background: `${tc.color}15`, border: `1px dashed ${tc.color}40` }}>
                    <img src={previewUrl} alt="Preview" className="w-16 h-12 object-cover rounded-lg" style={{ border: `1px solid ${BORDER}` }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate" style={{ color: tc.color }}>
                        {archivo ? '¡Archivo Cargado Desde Escritorio!' : '¡Imagen Vinculada Desde Galería!'}
                      </p>
                      <p className="text-xs text-ellipsis overflow-hidden whitespace-nowrap" style={{ color: TEXT_MUTED }}>
                        {archivo ? `${archivo.name} (${(archivo.size / 1024 / 1024).toFixed(2)} MB)` : imagenGaleriaRuta}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setArchivo(null); setImagenGaleriaRuta(''); setPreviewUrl(''); }}
                      className="text-red-400 hover:text-red-500 transition-colors"
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-2" style={{borderTop:`1px solid ${BORDER}`}}>
                <button type="button" onClick={() => setMostrarModal(false)}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold"
                  style={{color:TEXT_MUTED, border:`1px solid ${BORDER}`}}>
                  Cancelar
                </button>
                <button type="submit" disabled={creando}
                  className="px-6 py-2.5 rounded-xl text-sm font-black text-white disabled:opacity-50"
                  style={{background:'linear-gradient(135deg,#1e40af,#0ea5e9)'}}>
                  {creando ? 'Procesando...' : editandoId ? 'Guardar Cambios' : 'Publicar Ahora'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Renderizado Condicional de Nuestro Selector de Galería Fotográfica */}
      <SelectorGaleriaModal
        isOpen={mostrarSelectorGaleria}
        onClose={() => setMostrarSelectorGaleria(false)}
        onSelectImagen={handleSelectImagenDesdeGaleria}
      />
    </AdminLayout>
  );
}
