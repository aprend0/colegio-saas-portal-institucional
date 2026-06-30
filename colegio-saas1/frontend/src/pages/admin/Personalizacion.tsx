import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import AdminLayout from '../../components/AdminLayout';

const SLIDES_DEFAULT = [
  'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80',
  'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80',
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
];

// URL Base del Backend NestJS para resolver las imágenes locales
const API_URL = 'http://localhost:3000';

export default function Personalizacion() {
  const { usuario } = useAuth();
  const [guardando, setGuardando] = useState(false);
  const [galeria, setGaleria] = useState<any[]>([]);
  const [mostrarGaleria, setMostrarGaleria] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [slidePreview, setSlidePreview] = useState(0);
  const [form, setForm] = useState({
    nombre: '', slogan: '', descripcion: '',
    colorPrimario: '#92462F', colorSecundario: '#BA9E7E',
    colorFondo: '#FAFAF8', colorNavbar: '#FAFAF8',
    colorTexto: '#333333', colorFooter: '#333333',
    logo: '', ugel: '', direccion: '', telefono: '', email: '',
    imagenesFondo: '',
  });

  const BORDER = 'rgba(255,255,255,0.07)';
  const TEXT = '#e2e8f0';
  const TEXT_MUTED = '#64748b';
  const BG_CARD = '#0d1b2e';
  const BG_INPUT = '#0a1525';
  const COLOR = '#f59e0b';

  useEffect(() => {
    if (usuario?.colegioId) {
      api.get('/galeria').then(res => setGaleria(res.data)).catch(console.error);
      api.get(`/colegio/publico/${usuario.colegioId}`).then(res => {
        const c = res.data;
        setForm({
          nombre: c.nombre || '', slogan: c.slogan || '',
          descripcion: c.descripcion || '',
          colorPrimario: c.colorPrimario || '#92462F',
          colorSecundario: c.colorSecundario || '#BA9E7E',
          colorFondo: c.colorFondo || '#FAFAF8',
          colorNavbar: c.colorNavbar || '#FAFAF8',
          colorTexto: c.colorTexto || '#333333',
          colorFooter: c.colorFooter || '#333333',
          logo: c.logo || '', ugel: c.ugel || '',
          direccion: c.direccion || '', telefono: c.telefono || '',
          email: c.email || '', imagenesFondo: c.imagenesFondo || '',
        });
      }).catch(console.error);
    }
  }, [usuario]);

  // Auto slide preview
  useEffect(() => {
    const slides = getSlides();
    if (slides.length <= 1) return;
    const t = setInterval(() => setSlidePreview(i => (i+1) % slides.length), 2500);
    return () => clearInterval(t);
  }, [form.imagenesFondo]);

  const getSlides = () => {
    if (!form.imagenesFondo?.trim()) return SLIDES_DEFAULT;
    return form.imagenesFondo.split('\n').map(s => s.trim()).filter(Boolean);
  };

  const handleGuardar = async () => {
    setGuardando(true);
    try {
      await api.patch(`/colegio/${usuario?.colegioId}`, form);
      setGuardado(true);
      setTimeout(() => setGuardado(false), 3000);
    } catch(e){ console.error(e); }
    finally { setGuardando(false); }
  };

  const campo = (label: string, key: keyof typeof form, placeholder: string, tipo: string = 'text') => (
    <div>
      <label style={{display:'block', fontSize:'12px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:TEXT_MUTED, marginBottom:'8px'}}>{label}</label>
      <input type={tipo} value={form[key] as string} onChange={e => setForm({...form, [key]: e.target.value})}
        placeholder={placeholder}
        style={{width:'100%', padding:'12px 16px', borderRadius:'12px', background:BG_INPUT, border:`1px solid ${BORDER}`, color:TEXT, fontSize:'14px', outline:'none', boxSizing:'border-box'}}/>
    </div>
  );

  const slides = getSlides();

  return (
    <AdminLayout>
      <div style={{display:'flex', flexDirection:'column', gap:'24px'}}>

        {/* Header */}
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'16px'}}>
          <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
            <span className="material-symbols-outlined" style={{fontSize:'28px', color:COLOR}}>palette</span>
            <div>
              <h2 style={{fontSize:'22px', fontWeight:900, color:TEXT, margin:0}}>Personalización</h2>
              <p style={{fontSize:'13px', color:TEXT_MUTED, margin:0}}>Configura la apariencia y datos de tu página web.</p>
            </div>
          </div>
          <div style={{display:'flex', gap:'12px'}}>
            <button style={{padding:'10px 20px', borderRadius:'12px', fontSize:'13px', fontWeight:600, color:TEXT_MUTED, background:'transparent', border:`1px solid ${BORDER}`, cursor:'pointer'}}>
              Descartar
            </button>
            <button onClick={handleGuardar} disabled={guardando}
              style={{display:'flex', alignItems:'center', gap:'8px', padding:'10px 20px', borderRadius:'12px', fontSize:'13px', fontWeight:700, color:'white', cursor:'pointer', border:'none', background:'linear-gradient(135deg,#b45309,#f59e0b)', opacity:guardando?0.7:1}}>
              {guardando ? (
                <><div style={{width:'14px', height:'14px', border:'2px solid white', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.8s linear infinite'}}/> Guardando...</>
              ) : guardado ? (
                <><span className="material-symbols-outlined" style={{fontSize:'16px'}}>check_circle</span> ¡Guardado!</>
              ) : (
                <><span className="material-symbols-outlined" style={{fontSize:'16px'}}>publish</span> Publicar Cambios</>
              )}
            </button>
          </div>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'24px'}}>

          {/* Columna izquierda */}
          <div style={{display:'flex', flexDirection:'column', gap:'20px'}}>

            {/* Identidad */}
            <div style={{borderRadius:'20px', padding:'24px', background:BG_CARD, border:`1px solid ${BORDER}`}}>
              <h3 style={{fontSize:'14px', fontWeight:700, color:TEXT, marginBottom:'20px', display:'flex', alignItems:'center', gap:'8px'}}>
                <span className="material-symbols-outlined" style={{fontSize:'18px', color:COLOR}}>school</span>
                Identidad del Colegio
              </h3>
              <div style={{display:'flex', flexDirection:'column', gap:'16px'}}>
                {campo('Nombre del colegio', 'nombre', 'Ej. I.E. San Martín de Porres')}
                {campo('UGEL / Código', 'ugel', 'Ej. UGEL 05 — San Juan de Lurigancho')}
                {campo('Slogan', 'slogan', 'Ej. Educando con amor y libertad')}
                <div>
                  <label style={{display:'block', fontSize:'12px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:TEXT_MUTED, marginBottom:'8px'}}>Descripción</label>
                  <textarea value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})}
                    placeholder="Descripción breve de la institución..." rows={3}
                    style={{width:'100%', padding:'12px 16px', borderRadius:'12px', background:BG_INPUT, border:`1px solid ${BORDER}`, color:TEXT, fontSize:'14px', outline:'none', resize:'vertical', boxSizing:'border-box'}}/>
                </div>
              </div>
            </div>

            {/* Logo */}
            <div style={{borderRadius:'20px', padding:'24px', background:BG_CARD, border:`1px solid ${BORDER}`}}>
              <h3 style={{fontSize:'14px', fontWeight:700, color:TEXT, marginBottom:'20px', display:'flex', alignItems:'center', gap:'8px'}}>
                <span className="material-symbols-outlined" style={{fontSize:'18px', color:COLOR}}>image</span>
                Logo Institucional
              </h3>
              <div style={{display:'flex', alignItems:'center', gap:'16px', marginBottom:'16px'}}>
                <div style={{width:'72px', height:'72px', borderRadius:'50%', flexShrink:0, background:form.logo?'transparent':`linear-gradient(135deg,${form.colorPrimario},${form.colorPrimario}cc)`, display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', border:`2px solid ${BORDER}`}}>
                  {form.logo ? <img src={form.logo} alt="Logo" style={{width:'100%', height:'100%', objectFit:'cover'}}/> : <span className="material-symbols-outlined" style={{color:'white', fontSize:'28px'}}>school</span>}
                </div>
                <div style={{flex:1}}>
                  <p style={{fontSize:'13px', color:TEXT_MUTED, marginBottom:'8px'}}>URL de la imagen del logo</p>
                  <input type="url" value={form.logo} onChange={e => setForm({...form, logo: e.target.value})}
                    placeholder="https://ejemplo.com/logo.png"
                    style={{width:'100%', padding:'10px 14px', borderRadius:'10px', background:BG_INPUT, border:`1px solid ${BORDER}`, color:TEXT, fontSize:'13px', outline:'none', boxSizing:'border-box'}}/>
                </div>
              </div>
            </div>

            {/* Imágenes de fondo */}
            <div style={{borderRadius:'20px', padding:'24px', background:BG_CARD, border:`1px solid ${BORDER}`}}>
              <h3 style={{fontSize:'14px', fontWeight:700, color:TEXT, marginBottom:'8px', display:'flex', alignItems:'center', gap:'8px'}}>
                <span className="material-symbols-outlined" style={{fontSize:'18px', color:COLOR}}>collections</span>
                Imágenes de Fondo (Slideshow)
              </h3>
              <p style={{fontSize:'12px', color:TEXT_MUTED, marginBottom:'16px'}}>
                Selecciona hasta 5 imágenes de tu galería para mostrar como carrusel en el Hero.
              </p>

              {/* Imágenes seleccionadas */}
              <div style={{display:'flex', gap:'8px', flexWrap:'wrap', marginBottom:'12px'}}>
                {getSlides().filter(s => s.trim()).slice(0,5).map((url, i) => (
                  <div key={i} style={{position:'relative', width:'72px', height:'52px', borderRadius:'10px', overflow:'hidden', border:`2px solid ${COLOR}`, flexShrink:0}}>
                    {/* CORRECCIÓN: Resuelve url relativa o externa */}
                    <img src={url.startsWith('http') ? url : `${API_URL}${url}`} alt="" style={{width:'100%', height:'100%', objectFit:'cover'}}/>
                    <button onClick={() => {
                      const slides = getSlides().filter(s => s.trim());
                      slides.splice(i, 1);
                      setForm({...form, imagenesFondo: slides.join('\n')});
                    }}
                      style={{position:'absolute', top:'2px', right:'2px', width:'18px', height:'18px', borderRadius:'50%', background:'rgba(239,68,68,0.9)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'10px', color:'white', fontWeight:'bold'}}>
                      ×
                    </button>
                  </div>
                ))}
                {getSlides().filter(s => s.trim()).length < 5 && (
                  <button onClick={() => setMostrarGaleria(!mostrarGaleria)}
                    style={{width:'72px', height:'52px', borderRadius:'10px', border:`2px dashed ${BORDER}`, background:'transparent', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'4px', color:TEXT_MUTED, fontSize:'10px'}}>
                    <span className="material-symbols-outlined" style={{fontSize:'20px'}}>add_photo_alternate</span>
                    Añadir
                  </button>
                )}
              </div>

              {/* Selector de galería */}
              {mostrarGaleria && (
                <div style={{borderRadius:'12px', border:`1px solid ${BORDER}`, overflow:'hidden'}}>
                  <div style={{padding:'10px 14px', background:'rgba(255,255,255,0.04)', borderBottom:`1px solid ${BORDER}`, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <span style={{fontSize:'12px', fontWeight:700, color:TEXT_MUTED}}>SELECCIONAR DE GALERÍA</span>
                    <button onClick={() => setMostrarGaleria(false)} style={{background:'none', border:'none', cursor:'pointer', color:TEXT_MUTED}}>
                      <span className="material-symbols-outlined" style={{fontSize:'18px'}}>close</span>
                    </button>
                  </div>
                  {galeria.length === 0 ? (
                    <div style={{padding:'24px', textAlign:'center', color:TEXT_MUTED, fontSize:'13px'}}>
                      No hay imágenes en tu galería. Sube imágenes primero.
                    </div>
                  ) : (
                    <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'8px', padding:'12px', maxHeight:'200px', overflowY:'auto'}}>
                      {galeria.map((img:any) => {
                        const slides = getSlides().filter(s => s.trim());
                        const yaSeleccionada = slides.includes(img.imagen);
                        return (
                          <button key={img.id}
                            onClick={() => {
                              if (yaSeleccionada) return;
                              if (slides.length >= 5) return;
                              const nuevas = [...slides, img.imagen];
                              setForm({...form, imagenesFondo: nuevas.join('\n')});
                            }}
                            style={{
                              position:'relative', aspectRatio:'4/3', borderRadius:'8px', overflow:'hidden',
                              border:`2px solid ${yaSeleccionada ? COLOR : 'transparent'}`,
                              cursor: yaSeleccionada ? 'default' : 'pointer', padding:0,
                            }}>
                            {/* CORRECCIÓN: Resuelve url relativa o externa de los elementos de la galería */}
                            <img src={img.imagen.startsWith('http') ? img.imagen : `${API_URL}${img.imagen}`} alt={img.titulo} style={{width:'100%', height:'100%', objectFit:'cover'}}/>
                            {yaSeleccionada && (
                              <div style={{position:'absolute', inset:0, background:'rgba(245,158,11,0.4)', display:'flex', alignItems:'center', justifyContent:'center'}}>
                                <span className="material-symbols-outlined" style={{color:'white', fontSize:'24px'}}>check_circle</span>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Colores */}
            <div style={{borderRadius:'20px', padding:'24px', background:BG_CARD, border:`1px solid ${BORDER}`}}>
              <h3 style={{fontSize:'14px', fontWeight:700, color:TEXT, marginBottom:'20px', display:'flex', alignItems:'center', gap:'8px'}}>
                <span className="material-symbols-outlined" style={{fontSize:'18px', color:COLOR}}>colorize</span>
                Colores de Marca
              </h3>
              <div style={{display:'flex', flexDirection:'column', gap:'16px'}}>
                {[
                  {label:'Color Primario', key:'colorPrimario' as const},
                  {label:'Color Secundario', key:'colorSecundario' as const},
                ].map(item => (
                  <div key={item.key}>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'8px'}}>
                      <label style={{fontSize:'12px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:TEXT_MUTED}}>{item.label}</label>
                      <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                        <div style={{width:'20px', height:'20px', borderRadius:'6px', background:form[item.key], border:`1px solid ${BORDER}`}}/>
                        <span style={{fontSize:'12px', fontFamily:'monospace', color:TEXT_MUTED}}>{form[item.key]}</span>
                      </div>
                    </div>
                    <input type="color" value={form[item.key]} onChange={e => setForm({...form, [item.key]: e.target.value})}
                      style={{width:'100%', height:'44px', borderRadius:'12px', cursor:'pointer', border:'none', background:'transparent'}}/>
                  </div>
                ))}
                <div style={{borderTop:`1px solid ${BORDER}`, paddingTop:'16px'}}>
                  <p style={{fontSize:'12px', fontWeight:700, color:TEXT_MUTED, marginBottom:'12px', textTransform:'uppercase', letterSpacing:'0.1em'}}>Colores de Página</p>
                  <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px'}}>
                    {[
                      {label:'Fondo', key:'colorFondo' as const},
                      {label:'Navbar', key:'colorNavbar' as const},
                      {label:'Texto', key:'colorTexto' as const},
                      {label:'Footer', key:'colorFooter' as const},
                    ].map(item => (
                      <div key={item.key}>
                        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'6px'}}>
                          <label style={{fontSize:'11px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:TEXT_MUTED}}>{item.label}</label>
                          <span style={{fontSize:'10px', fontFamily:'monospace', color:TEXT_MUTED}}>{form[item.key]}</span>
                        </div>
                        <input type="color" value={form[item.key]} onChange={e => setForm({...form, [item.key]: e.target.value})}
                          style={{width:'100%', height:'36px', borderRadius:'10px', cursor:'pointer', border:'none', background:'transparent'}}/>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Contacto */}
            <div style={{borderRadius:'20px', padding:'24px', background:BG_CARD, border:`1px solid ${BORDER}`}}>
              <h3 style={{fontSize:'14px', fontWeight:700, color:TEXT, marginBottom:'20px', display:'flex', alignItems:'center', gap:'8px'}}>
                <span className="material-symbols-outlined" style={{fontSize:'18px', color:COLOR}}>contact_phone</span>
                Información de Contacto
              </h3>
              <div style={{display:'flex', flexDirection:'column', gap:'16px'}}>
                {campo('Dirección', 'direccion', 'Av. Las Flores 135, Lima')}
                {campo('Teléfono', 'telefono', '(01) 388-1135')}
                {campo('Correo electrónico', 'email', 'contacto@micolegio.edu.pe', 'email')}
              </div>
            </div>
          </div>

          {/* Columna derecha — Preview */}
          <div style={{position:'sticky', top:'100px', height:'fit-content'}}>
            <div style={{borderRadius:'20px', overflow:'hidden', border:`1px solid ${BORDER}`, background:BG_CARD}}>

              {/* Toolbar */}
              <div style={{padding:'12px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:`1px solid ${BORDER}`}}>
                <div style={{display:'flex', gap:'6px'}}>
                  <div style={{width:'10px', height:'10px', borderRadius:'50%', background:'#ef4444'}}/>
                  <div style={{width:'10px', height:'10px', borderRadius:'50%', background:'#f59e0b'}}/>
                  <div style={{width:'10px', height:'10px', borderRadius:'50%', background:'#22c55e'}}/>
                </div>
                <div style={{flex:1, margin:'0 12px'}}>
                  <div style={{background:'rgba(255,255,255,0.06)', borderRadius:'8px', padding:'4px 10px', fontSize:'11px', color:TEXT_MUTED, textAlign:'center'}}>
                    colegio-saas.com/colegio/{usuario?.colegioId}
                  </div>
                </div>
                <div style={{display:'flex', alignItems:'center', gap:'6px'}}>
                  <span style={{width:'8px', height:'8px', borderRadius:'50%', background:'#22c55e', display:'inline-block'}}/>
                  <span style={{fontSize:'11px', fontWeight:700, color:'#22c55e'}}>LIVE</span>
                </div>
              </div>

              {/* Preview */}
              <div style={{overflow:'hidden'}}>

                {/* Navbar preview */}
                <div style={{padding:'8px 14px', display:'flex', alignItems:'center', justifyContent:'space-between', background:`${form.colorNavbar}ee`, borderBottom:'1px solid rgba(0,0,0,0.06)'}}>
                  <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                    <div style={{width:'24px', height:'24px', borderRadius:'50%', background:form.colorPrimario, display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden'}}>
                      {form.logo ? <img src={form.logo} alt="" style={{width:'100%', height:'100%', objectFit:'cover'}}/> : <span className="material-symbols-outlined" style={{color:'white', fontSize:'12px'}}>school</span>}
                    </div>
                    <div>
                      <div style={{fontSize:'9px', color:'#7a6a5a', fontWeight:600}}>{form.ugel || 'UGEL'}</div>
                      <div style={{fontSize:'11px', fontWeight:700, color:form.colorTexto, fontFamily:'Georgia,serif'}}>{form.nombre || 'Mi Colegio'}</div>
                    </div>
                  </div>
                  <div style={{display:'flex', gap:'8px'}}>
                    {['Inicio','Nosotros','Noticias'].map(n => (
                      <span key={n} style={{fontSize:'9px', color:form.colorTexto, opacity:0.7}}>{n}</span>
                    ))}
                  </div>
                  <div style={{padding:'4px 10px', borderRadius:'999px', background:form.colorPrimario, color:'white', fontSize:'9px', fontWeight:700}}>
                    Asistencia
                  </div>
                </div>

                {/* Hero preview con slideshow real */}
                <div style={{position:'relative', height:'200px', overflow:'hidden'}}>
                  {slides.slice(0,5).map((src, i) => (
                    /* CORRECCIÓN: Resuelve url relativa o externa de las imágenes del carrusel en la vista previa */
                    <img key={i} src={src.startsWith('http') ? src : `${API_URL}${src}`} alt=""
                      style={{position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', transition:'opacity 1s ease', opacity: i===slidePreview?1:0}}/>
                  ))}
                  {/* Gradient crema */}
                  <div style={{position:'absolute', inset:0, background:'linear-gradient(to right, rgba(245,237,224,0.95) 0%, rgba(245,237,224,0.7) 35%, transparent 70%)'}}/>
                  {/* Contenido hero */}
                  <div style={{position:'absolute', inset:0, padding:'16px', display:'flex', flexDirection:'column', justifyContent:'center', maxWidth:'60%'}}>
                    <div style={{display:'inline-flex', alignItems:'center', gap:'6px', padding:'3px 10px', borderRadius:'999px', background:`${form.colorPrimario}18`, border:`1px solid ${form.colorPrimario}20`, marginBottom:'8px', width:'fit-content'}}>
                      <span style={{fontSize:'8px', fontWeight:700, color:form.colorPrimario, textTransform:'uppercase', letterSpacing:'0.1em'}}>{form.ugel || 'UGEL — I.E.'}</span>
                    </div>
                    <h3 style={{fontFamily:'Georgia,serif', fontSize:'15px', fontWeight:700, color:form.colorTexto, lineHeight:1.1, marginBottom:'6px'}}>
                      {form.nombre || 'Mi Colegio'}<br/>
                      <span style={{color:form.colorPrimario, fontStyle:'italic'}}>Educativa Oficial</span>
                    </h3>
                    <p style={{fontSize:'9px', color:`${form.colorTexto}90`, lineHeight:1.5, marginBottom:'10px'}}>
                      <span style={{color:form.colorPrimario, fontWeight:700}}>{form.slogan || 'Tu slogan.'}</span>{' '}
                      {(form.descripcion || 'Descripción de tu institution').substring(0,60)}...
                    </p>
                    <div style={{display:'flex', gap:'6px'}}>
                      <div style={{padding:'5px 10px', borderRadius:'999px', background:form.colorPrimario, color:'white', fontSize:'9px', fontWeight:700}}>Ver Noticias →</div>
                      <div style={{padding:'5px 10px', borderRadius:'999px', background:'rgba(255,255,255,0.85)', color:form.colorTexto, fontSize:'9px', fontWeight:700}}>Contáctanos</div>
                    </div>
                  </div>
                  {/* Dots */}
                  <div style={{position:'absolute', bottom:'8px', left:'50%', transform:'translateX(-50%)', display:'flex', gap:'4px'}}>
                    {slides.slice(0,5).map((_,i) => (
                      <button key={i} onClick={() => setSlidePreview(i)}
                        style={{height:'4px', borderRadius:'999px', border:'none', cursor:'pointer', transition:'all 0.3s', width:i===slidePreview?'16px':'4px', background:i===slidePreview?'white':'rgba(255,255,255,0.5)'}}/>
                    ))}
                  </div>
                </div>

                {/* Stats preview */}
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'6px', padding:'8px 12px', background:form.colorFondo}}>
                  {[
                    {icon:'campaign', label:'Comunicados'},
                    {icon:'newspaper', label:'Noticias'},
                    {icon:'event', label:'Eventos'},
                  ].map((item,i) => (
                    <div key={i} style={{padding:'8px', borderRadius:'10px', background:'white', border:'1px solid rgba(0,0,0,0.06)', textAlign:'center', boxShadow:'0 1px 4px rgba(0,0,0,0.04)'}}>
                      <span className="material-symbols-outlined" style={{fontSize:'16px', color:form.colorPrimario, display:'block'}}>{item.icon}</span>
                      <span style={{fontSize:'9px', color:'#7a6a5a'}}>{item.label}</span>
                    </div>
                  ))}
                </div>

                {/* Footer preview */}
                <div style={{padding:'10px 14px', background:form.colorFooter, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                  <span style={{fontSize:'9px', color:'rgba(255,255,255,0.5)'}}>© 2026 {form.nombre || 'Mi Colegio'}</span>
                  <div style={{display:'flex', gap:'8px'}}>
                    <span style={{fontSize:'9px', color:'rgba(255,255,255,0.5)'}}>📍 {form.direccion?.substring(0,20) || 'Lima, Perú'}</span>
                    <span style={{fontSize:'9px', color:'rgba(255,255,255,0.5)'}}>📞 {form.telefono || '(01) 000-0000'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Link a página pública */}
            <a href={`/colegio/${usuario?.colegioId}`} target="_blank"
              style={{display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', marginTop:'16px', padding:'12px', borderRadius:'14px', background:`${COLOR}10`, border:`1px solid ${COLOR}25`, color:COLOR, fontSize:'13px', fontWeight:700, textDecoration:'none'}}>
              <span className="material-symbols-outlined" style={{fontSize:'18px'}}>open_in_new</span>
              Ver página pública del colegio
            </a>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </AdminLayout>
  );
}
