import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import LayoutPublico from './components/LayoutPublico';

// URL Base del Backend NestJS para resolver las imágenes locales
const API_URL = 'http://localhost:3000';

export default function PaginaPublica() {
  const { colegioId } = useParams();
  const [contenido, setContenido] = useState<any[]>([]);
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [totalSlides, setTotalSlides] = useState(3); // Por defecto 3 por los SLIDES_DEFAULT

  useEffect(() => {
    api.get(`/contenido/publico/${colegioId}`)
       .then(r => setContenido(r.data))
       .catch(console.error);
  }, [colegioId]);

  // Efecto para cambiar de imagen automáticamente cada 5 segundos
  useEffect(() => {
    if (totalSlides <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);
    return () => clearInterval(interval);
  }, [totalSlides]);

  const comunicados = contenido.filter(c => c.tipo === 'comunicado');
  const noticias = contenido.filter(c => c.tipo === 'noticia');
  const eventos = contenido.filter(c => c.tipo === 'evento');

  return (
    <LayoutPublico>
      {(colegio) => {
        const PRIMARY = colegio?.colorPrimario || '#92462F';
        const fontDisplay = "'Fraunces', Georgia, serif";
        
        const SLIDES_DEFAULT = [
          'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1400&q=80',
          'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1400&q=80',
          'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1400&q=80',
        ];
        
        const SLIDES = (colegio?.imagenesFondo && colegio.imagenesFondo.trim())
          ? colegio.imagenesFondo.split('\n').map((s: string) => s.trim()).filter(Boolean)
          : SLIDES_DEFAULT;

        // Sincronizamos la cantidad de imágenes con el backend de manera segura sin romper React
        if (SLIDES.length !== totalSlides) {
          setTotalSlides(SLIDES.length);
        }

        // Obtener la URL correcta del slide actual (local o externa)
        const activeSlide = SLIDES[currentSlide] || SLIDES[0];
        const srcFinal = activeSlide?.startsWith('http') 
          ? activeSlide 
          : `${API_URL}${activeSlide}`;

        return (
          <>
            {/* 1. SECCIÓN HERO (Carrusel de Imágenes y Textos principales) */}
            <section style={{
              position: 'relative', 
              minHeight: 'calc(100vh - 80px)', 
              display: 'flex', 
              alignItems: 'center', 
              overflow: 'hidden'
            }}>
              {/* Imagen de Fondo con Transición */}
              <img 
                src={srcFinal} 
                alt="Fondo Institucional" 
                style={{
                  position: 'absolute', 
                  inset: 0, 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  transition: 'all 0.8s ease-in-out'
                }}
              />
              <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(245,237,224,0.96) 0%, rgba(245,237,224,0.78) 28%, rgba(245,237,224,0.32) 60%, transparent 100%)'}}/>
              
              <div style={{position: 'relative', maxWidth: '1280px', margin: '0 auto', padding: '60px 24px', width: '100%', zIndex: 2}}>
                <div style={{maxWidth: '580px'}}>
                  <div style={{display: 'inline-flex', alignItems: 'center', gap: '12px', borderRadius: '999px', padding: '6px 16px 6px 6px', background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(8px)', border: `1px solid ${PRIMARY}18`, marginBottom: '28px'}}>
                    <div style={{width: '28px', height: '28px', borderRadius: '50%', background: PRIMARY, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      <span className="material-symbols-outlined" style={{color: 'white', fontSize: '16px'}}>school</span>
                    </div>
                    <span style={{fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: PRIMARY}}>
                      {colegio?.ugel || 'UGEL — Institución Educativa'}
                    </span>
                  </div>
                  <h1 style={{fontFamily: fontDisplay, fontSize: 'clamp(36px, 5vw, 58px)', fontWeight: 600, lineHeight: 1.05, color: '#333', marginBottom: '20px'}}>
                    {colegio?.nombre || 'Institución'}<br/>
                    <span style={{color: PRIMARY, fontStyle: 'italic'}}>Educativa Oficial</span>
                  </h1>
                  <p style={{fontSize: '18px', lineHeight: 1.7, color: 'rgba(51,51,51,0.82)', marginBottom: '32px', maxWidth: '480px'}}>
                    <em style={{color: PRIMARY, fontStyle: 'normal', fontWeight: 600}}>{colegio?.slogan || 'Educando con amor y libertad.'}</em>{' '}
                    {colegio?.descripcion || 'Formamos estudiantes íntegros, creativos y comprometidos con su comunidad.'}
                  </p>
                  <div style={{display: 'flex', flexWrap: 'wrap', gap: '12px'}}>
                    <a href={`/colegio/${colegioId}/noticias`}
                      style={{display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 24px', borderRadius: '999px', background: PRIMARY, color: 'white', fontSize: '15px', fontWeight: 700, textDecoration: 'none', boxShadow: `0 6px 24px ${PRIMARY}40`}}>
                      <span className="material-symbols-outlined" style={{fontSize: '18px'}}>newspaper</span>
                      Ver Noticias
                      <span className="material-symbols-outlined" style={{fontSize: '18px'}}>arrow_forward</span>
                    </a>
                    <a href={`/colegio/${colegioId}/contacto`}
                      style={{display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 24px', borderRadius: '999px', background: 'rgba(255,255,255,0.85)', color: '#333', fontSize: '15px', fontWeight: 700, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.9)'}}>
                      <span className="material-symbols-outlined" style={{fontSize: '18px'}}>phone</span>
                      Contáctanos
                    </a>
                  </div>
                </div>
              </div>

              {/* Indicadores Visuales del Carrusel (Puntitos) */}
              {SLIDES.length > 1 && (
                <div style={{
                  position: 'absolute',
                  bottom: '20px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  gap: '10px',
                  zIndex: 10
                }}>
                  {SLIDES.map((slide: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      style={{
                        width: currentSlide === index ? '24px' : '8px', 
                        height: '8px',
                        borderRadius: '999px',
                        background: currentSlide === index ? PRIMARY : 'rgba(255,255,255,0.5)',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* 2. NUEVA SECCIÓN INDEPENDIENTE: CONTENEDOR RESPONSIVO PARA STATS */}
            {/* Se posiciona de manera natural en el flujo del HTML, garantizando quedar entre el Hero y el Footer sin sobreponerse */}
            <div style={{
              background: '#fcfaf7', // Un fondo suave de transición que combina con la paleta pública
              padding: '40px 24px',
              width: '100%'
            }}>
              <div style={{
                maxWidth: '1280px',
                margin: '0 auto',
                display: 'grid',
                // En pantallas pequeñas pasa a 1 columna automáticamente (Estructura Responsiva)
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '24px',
                borderRadius: '24px',
                padding: '32px 24px',
                background: 'rgba(255, 255, 255, 0.95)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.04)',
                border: '1px solid rgba(0,0,0,0.05)',
                textAlign: 'center'
              }}>
                {[
                  { icon: 'campaign', k: `${comunicados.length}`, v: 'Comunicados' },
                  { icon: 'newspaper', k: `${noticias.length}`, v: 'Noticias' },
                  { icon: 'event', k: `${eventos.length}`, v: 'Eventos' },
                ].map((s, i, arr) => (
                  <div 
                    key={s.v} 
                    style={{
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      padding: '12px 0'
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ color: PRIMARY, fontSize: '28px', marginBottom: '8px' }}>
                      {s.icon}
                    </span>
                    <span style={{ fontFamily: fontDisplay, fontSize: '32px', fontWeight: 600, color: '#333', lineHeight: 1 }}>
                      {s.k}
                    </span>
                    <span style={{ fontSize: '13px', color: '#7a6a5a', fontWeight: 500, marginTop: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {s.v}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        );
      }}
    </LayoutPublico>
  );
}
