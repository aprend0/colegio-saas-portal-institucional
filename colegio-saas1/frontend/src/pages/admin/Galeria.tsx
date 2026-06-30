import { useState, useEffect, useRef } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';

export default function Galeria() {
  const [imagenes, setImagenes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [subiendo, setSubiendo] = useState(false);
  const [form, setForm] = useState({ titulo: '', categoria: 'General' });
  const [preview, setPreview] = useState<string>('');
  const [base64, setBase64] = useState<string>('');
  const [fileObjeto, setFileObjeto] = useState<File | null>(null);
  const [imagenAmpliada, setImagenAmpliada] = useState<any>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const BORDER = 'rgba(255,255,255,0.07)';
  const API_URL = 'http://localhost:3000';
  const TEXT = '#e2e8f0';
  const TEXT_MUTED = '#64748b';
  const BG_CARD = '#0d1b2e';
  const BG_INPUT = '#0a1525';
  const COLOR = '#fb923c';

  const categorias = ['General','Eventos','Académico','Deportes','Cultura','Infraestructura'];

  useEffect(() => { cargarImagenes(); }, []);

  const cargarImagenes = async () => {
    try {
      const res = await api.get('/galeria');
      setImagenes(res.data);
    } catch(e){ console.error(e); }
    finally { setLoading(false); }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen no puede superar 5MB');
      return;
    }
    
    setFileObjeto(file); 

    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setPreview(result);
      setBase64(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubir = async () => {
    if (!fileObjeto || !form.titulo) return; 
    setSubiendo(true);
    try {
      // 1. Construimos el FormData para el envío del archivo físico
      const formData = new FormData();
      formData.append('file', fileObjeto); 
      formData.append('titulo', form.titulo);
      formData.append('categoria', form.categoria);

      // 2. Realizamos la petición POST pasándole el formData completo
      await api.post('/galeria', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', 
        },
      });

      await cargarImagenes();
      setMostrarModal(false);
      setForm({ titulo: '', categoria: 'General' });
      setPreview('');
      setBase64('');
      setFileObjeto(null); // Limpiamos el archivo seleccionado
    } catch(e){ 
      console.error(e); 
      alert('Hubo un error al intentar subir la imagen.');
    } finally { 
      setSubiendo(false); 
    }
  };

  const handleEliminar = async (id: number) => {
    if (!confirm('¿Eliminar esta imagen?')) return;
    try {
      await api.patch(`/galeria/${id}/eliminar`);
      await cargarImagenes();
    } catch(e){ console.error(e); }
  };

  const categoriaColor: any = {
    General: '#64748b', Eventos: '#818cf8', Académico: '#f472b6',
    Deportes: '#fb923c', Cultura: '#34d399', Infraestructura: '#22d3ee',
  };

  return (
    <AdminLayout>
      <div style={{display:'flex', flexDirection:'column', gap:'24px'}}>

        {/* Header */}
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'16px'}}>
          <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
            <span className="material-symbols-outlined" style={{fontSize:'28px', color:COLOR}}>photo_library</span>
            <div>
              <h2 style={{fontSize:'22px', fontWeight:900, color:TEXT, margin:0}}>Galería Fotográfica</h2>
              <p style={{fontSize:'13px', color:TEXT_MUTED, margin:0}}>Gestiona las imágenes de tu institución.</p>
            </div>
          </div>
          <button onClick={() => setMostrarModal(true)}
            style={{display:'flex', alignItems:'center', gap:'8px', padding:'10px 20px', borderRadius:'12px', fontSize:'13px', fontWeight:700, color:'white', cursor:'pointer', border:'none', background:`linear-gradient(135deg,#ea580c,${COLOR})`, boxShadow:`0 4px 15px ${COLOR}30`}}>
            <span className="material-symbols-outlined" style={{fontSize:'18px'}}>add_photo_alternate</span>
            Subir Imagen
          </button>
        </div>

        {/* Stats */}
        <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px'}}>
          {[
            {icon:'photo_library', label:'Total Imágenes', value:imagenes.length, color:COLOR},
            {icon:'folder', label:'Categorías', value:new Set(imagenes.map(i=>i.categoria)).size, color:'#818cf8'},
            {icon:'event', label:'Este mes', value:imagenes.filter(i=>new Date(i.createdAt).getMonth()===new Date().getMonth()).length, color:'#34d399'},
            {icon:'visibility', label:'Públicas', value:imagenes.length, color:'#22d3ee'},
          ].map((s,i) => (
            <div key={i} style={{borderRadius:'16px', padding:'20px', background:BG_CARD, border:`1px solid ${BORDER}`}}>
              <span className="material-symbols-outlined" style={{fontSize:'24px', color:s.color, marginBottom:'8px', display:'block'}}>{s.icon}</span>
              <p style={{fontSize:'24px', fontWeight:900, color:TEXT, margin:0}}>{s.value}</p>
              <p style={{fontSize:'11px', color:TEXT_MUTED, margin:0, textTransform:'uppercase', letterSpacing:'0.1em'}}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Grid de imágenes */}
        {loading ? (
          <div style={{display:'flex', justifyContent:'center', padding:'60px'}}>
            <div style={{width:'40px', height:'40px', border:`2px solid ${COLOR}`, borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.8s linear infinite'}}/>
          </div>
        ) : imagenes.length === 0 ? (
          <div style={{textAlign:'center', padding:'80px', borderRadius:'20px', background:BG_CARD, border:`1px solid ${BORDER}`}}>
            <span className="material-symbols-outlined" style={{fontSize:'64px', color:TEXT_MUTED, display:'block', marginBottom:'16px'}}>photo_library</span>
            <p style={{color:TEXT_MUTED, fontSize:'16px', marginBottom:'8px'}}>No hay imágenes aún</p>
            <p style={{color:TEXT_MUTED, fontSize:'13px', marginBottom:'24px'}}>Sube tu primera imagen para comenzar</p>
            <button onClick={() => setMostrarModal(true)}
              style={{padding:'10px 24px', borderRadius:'12px', background:COLOR, color:'white', border:'none', cursor:'pointer', fontSize:'14px', fontWeight:700}}>
              Subir primera imagen
            </button>
          </div>
        ) : (
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:'16px'}}>
            {imagenes.map((img:any) => (
              <div key={img.id}
                style={{borderRadius:'16px', overflow:'hidden', background:BG_CARD, border:`1px solid ${BORDER}`, transition:'all 0.3s', cursor:'pointer'}}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow=`0 12px 40px rgba(0,0,0,0.3)`; }}
                onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='none'; }}>
                {/* Imagen */}
                <div style={{position:'relative', aspectRatio:'4/3', overflow:'hidden'}}
                  onClick={() => setImagenAmpliada(img)}>
                  <img src={img.imagen && img.imagen.startsWith('/') ? `${API_URL}${img.imagen}` : `${API_URL}/${img.imagen}`} alt={img.titulo}
                    style={{width:'100%', height:'100%', objectFit:'cover', transition:'transform 0.3s'}}
                    onMouseEnter={e => e.currentTarget.style.transform='scale(1.05)'}
                    onMouseLeave={e => e.currentTarget.style.transform='none'}/>
                  <div style={{position:'absolute', top:'8px', left:'8px', padding:'3px 10px', borderRadius:'999px', fontSize:'10px', fontWeight:700, background:categoriaColor[img.categoria]||'#64748b', color:'white'}}>
                    {img.categoria}
                  </div>
                  <button onClick={e => { e.stopPropagation(); handleEliminar(img.id); }}
                    style={{position:'absolute', top:'8px', right:'8px', width:'28px', height:'28px', borderRadius:'50%', background:'rgba(239,68,68,0.9)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', opacity:0, transition:'opacity 0.2s'}}
                    onMouseEnter={e => e.currentTarget.style.opacity='1'}
                    onMouseLeave={e => e.currentTarget.style.opacity='0'}
                    className="delete-btn">
                    <span className="material-symbols-outlined" style={{fontSize:'14px', color:'white'}}>delete</span>
                  </button>
                </div>
                {/* Info */}
                <div style={{padding:'12px'}}>
                  <p style={{fontSize:'13px', fontWeight:700, color:TEXT, margin:'0 0 4px'}}>{img.titulo}</p>
                  <p style={{fontSize:'11px', color:TEXT_MUTED, margin:0}}>
                    {new Date(img.createdAt).toLocaleDateString('es-PE',{day:'numeric',month:'short',year:'numeric'})}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal subir imagen */}
      {mostrarModal && (
        <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100, padding:'20px'}}>
          <div style={{background:'#0d1b2e', borderRadius:'20px', padding:'32px', width:'100%', maxWidth:'480px', border:`1px solid ${BORDER}`}}>
            <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'24px'}}>
              <h3 style={{fontSize:'18px', fontWeight:700, color:TEXT, margin:0}}>Subir Imagen</h3>
              <button onClick={() => { setMostrarModal(false); setPreview(''); setBase64(''); setFileObjeto(null); }}
                style={{background:'transparent', border:'none', cursor:'pointer', color:TEXT_MUTED}}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Área de subida */}
            <div onClick={() => fileRef.current?.click()}
              style={{
                border:`2px dashed ${preview ? COLOR : BORDER}`, borderRadius:'16px',
                padding:'32px', textAlign:'center', cursor:'pointer', marginBottom:'20px',
                background: preview ? `${COLOR}08` : 'transparent', transition:'all 0.2s',
                overflow:'hidden', position:'relative',
              }}>
              {preview ? (
                <img src={preview} alt="preview" style={{width:'100%', maxHeight:'200px', objectFit:'contain', borderRadius:'8px'}}/>
              ) : (
                <>
                  <span className="material-symbols-outlined" style={{fontSize:'48px', color:TEXT_MUTED, display:'block', marginBottom:'12px'}}>add_photo_alternate</span>
                  <p style={{color:TEXT_MUTED, fontSize:'14px', margin:0}}>Click para seleccionar imagen</p>
                  <p style={{color:TEXT_MUTED, fontSize:'12px', margin:'4px 0 0'}}>JPG, PNG, WEBP — máx. 5MB</p>
                </>
              )}
              <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{display:'none'}}/>
            </div>

            {/* Campos */}
            <div style={{display:'flex', flexDirection:'column', gap:'16px', marginBottom:'24px'}}>
              <div>
                <label style={{display:'block', fontSize:'12px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:TEXT_MUTED, marginBottom:'8px'}}>Título</label>
                <input value={form.titulo} onChange={e => setForm({...form, titulo: e.target.value})}
                  placeholder="Ej. Día del Logro 2026"
                  style={{width:'100%', padding:'12px 16px', borderRadius:'12px', background:BG_INPUT, border:`1px solid ${BORDER}`, color:TEXT, fontSize:'14px', outline:'none', boxSizing:'border-box'}}/>
              </div>
              <div>
                <label style={{display:'block', fontSize:'12px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:TEXT_MUTED, marginBottom:'8px'}}>Categoría</label>
                <select value={form.categoria} onChange={e => setForm({...form, categoria: e.target.value})}
                  style={{width:'100%', padding:'12px 16px', borderRadius:'12px', background:BG_INPUT, border:`1px solid ${BORDER}`, color:TEXT, fontSize:'14px', outline:'none', boxSizing:'border-box'}}>
                  {categorias.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div style={{display:'flex', gap:'12px'}}>
              <button onClick={() => { setMostrarModal(false); setPreview(''); setBase64(''); setFileObjeto(null); }}
                style={{flex:1, padding:'12px', borderRadius:'12px', background:'transparent', border:`1px solid ${BORDER}`, color:TEXT_MUTED, cursor:'pointer', fontSize:'14px', fontWeight:600}}>
                Cancelar
              </button>
              <button onClick={handleSubir} disabled={!fileObjeto || !form.titulo || subiendo}
                style={{flex:2, padding:'12px', borderRadius:'12px', background:fileObjeto&&form.titulo?`linear-gradient(135deg,#ea580c,${COLOR})`:'rgba(255,255,255,0.05)', color:fileObjeto&&form.titulo?'white':TEXT_MUTED, border:'none', cursor:fileObjeto&&form.titulo?'pointer':'not-allowed', fontSize:'14px', fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', gap:'8px'}}>
                {subiendo ? (
                  <><div style={{width:'14px', height:'14px', border:'2px solid white', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.8s linear infinite'}}/> Subiendo...</>
                ) : (
                  <><span className="material-symbols-outlined" style={{fontSize:'18px'}}>cloud_upload</span> Subir Imagen</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal imagen ampliada */}
      {imagenAmpliada && (
        <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.9)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100, padding:'20px'}}
          onClick={() => setImagenAmpliada(null)}>
          <div style={{maxWidth:'800px', width:'100%'}} onClick={e => e.stopPropagation()}>
            <img src={imagenAmpliada.imagen && imagenAmpliada.imagen.startsWith('/') ? `${API_URL}${imagenAmpliada.imagen}` : `${API_URL}/${imagenAmpliada.imagen}`} alt={imagenAmpliada.titulo}
              style={{width:'100%', borderRadius:'16px', objectFit:'contain', maxHeight:'80vh'}}/>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'16px'}}>
              <div>
                <p style={{color:TEXT, fontWeight:700, margin:0}}>{imagenAmpliada.titulo}</p>
                <p style={{color:TEXT_MUTED, fontSize:'13px', margin:0}}>{imagenAmpliada.categoria}</p>
              </div>
              <button onClick={() => setImagenAmpliada(null)}
                style={{padding:'8px 20px', borderRadius:'12px', background:'rgba(255,255,255,0.1)', border:'none', cursor:'pointer', color:TEXT, fontSize:'14px'}}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .delete-btn { opacity: 0 !important; }
        div:hover > div > .delete-btn { opacity: 1 !important; }
      `}</style>
    </AdminLayout>
  );
}
