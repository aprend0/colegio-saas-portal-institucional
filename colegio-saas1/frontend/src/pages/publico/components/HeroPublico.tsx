import { useState, useEffect } from 'react';

interface Props {
  colegio: any;
  stats: { icon: string; k: string; v: string }[];
  onVerNoticias: () => void;
  onContacto: () => void;
}

const API_URL = 'http://localhost:3000';

export default function HeroPublico({ colegio, stats, onVerNoticias, onContacto }: Props) {
  const [slideActual, setSlideActual] = useState(0);

  const PRIMARY = colegio?.colorPrimario || '#92462F';
  const fontDisplay = "'Fraunces', Georgia, serif";

  // Cargar dinámicamente las imágenes guardadas en el colegio o usar las por defecto si no hay
  const SLIDES_DEFAULT = [
    'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1400&q=80',
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1400&q=80',
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1400&q=80',
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1400&q=80',
  ];

  const SLIDES = (colegio?.imagenesFondo && colegio.imagenesFondo.trim())
    ? colegio.imagenesFondo.split('\n').map((s: string) => s.trim()).filter(Boolean)
    : SLIDES_DEFAULT;

  useEffect(() => {
    if (SLIDES.length <= 1) return;
    const t = setInterval(() => setSlideActual(i => (i + 1) % SLIDES.length), 4000);
    return () => clearInterval(t);
  }, [SLIDES.length]);

  return (
    // CORRECCIÓN: overflow cambiado a 'visible' y padding-bottom extra para que la tarjeta no se corte abajo
    <section id="inicio" style={{ position: 'relative', minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', overflow: 'visible', paddingBottom: '90px' }}>
      
      {/* Slides */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        {SLIDES.map((src, i) => {
          // Validar si es una URL local del backend o de internet
          const srcFinal = src.startsWith('http') ? src : `${API_URL}${src}`;
          return (
            <img key={i} src={srcFinal} alt=""
              style={{
                position: 'absolute', inset: 0, width: '100%', height: '100%',
                objectFit: 'cover', transition: 'opacity 1.5s ease',
                opacity: i === slideActual ? 1 : 0,
              }} 
            />
          );
        })}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, rgba(245,237,224,0.96) 0%, rgba(245,237,224,0.78) 28%, rgba(245,237,224,0.32) 60%, transparent 100%)',
        }} />
      </div>

      {/* Content */}
      <div style={{ position: 'relative', maxWidth: '1280px', margin: '0 auto', padding: '80px 24px 0px', width: '100%', zIndex: 3 }}>
        <div style={{ maxWidth: '580px' }}>

          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '12px',
            borderRadius: '999px', padding: '6px 16px 6px 6px',
            background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(8px)',
            border: `1px solid ${PRIMARY}18`, marginBottom: '28px',
          }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '50%',
              background: PRIMARY, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span className="material-symbols-outlined" style={{ color: 'white', fontSize: '16px' }}>school</span>
            </div>
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: PRIMARY }}>
              {colegio?.ugel || 'UGEL — Institución Educativa'}
            </span>
          </div>

          {/* Title */}
          <h1 style={{
            fontFamily: fontDisplay,
            fontSize: 'clamp(36px, 5vw, 58px)',
            fontWeight: 600, lineHeight: 1.05,
            color: '#333', marginBottom: '20px', letterSpacing: '-0.01em',
          }}>
            {colegio?.nombre || 'Institución'}<br />
            <span style={{ color: PRIMARY, fontStyle: 'italic' }}>Educativa Oficial</span>
          </h1>

          <p style={{ fontSize: '18px', lineHeight: 1.7, color: 'rgba(51,51,51,0.82)', marginBottom: '32px', maxWidth: '480px' }}>
            <em style={{ color: PRIMARY, fontStyle: 'normal', fontWeight: 600 }}>
              {colegio?.slogan || 'Educando con amor y libertad.'}
            </em>{' '}
            {colegio?.descripcion || 'Formamos estudiantes íntegros, creativos y comprometidos con su comunidad.'}
          </p>

          {/* Buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            <button onClick={onVerNoticias}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '14px 24px', borderRadius: '999px',
                background: PRIMARY, color: 'white',
                fontSize: '15px', fontWeight: 700, border: 'none', cursor: 'pointer',
                boxShadow: `0 6px 24px ${PRIMARY}40`,
              }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>newspaper</span>
              Ver Noticias
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
            </button>
            <button onClick={onContacto}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '14px 24px', borderRadius: '999px',
                background: 'rgba(255,255,255,0.85)', color: '#333',
                fontSize: '15px', fontWeight: 700,
                border: '1px solid rgba(255,255,255,0.9)', cursor: 'pointer',
              }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>phone</span>
              Contáctanos
            </button>
          </div>
        </div>
      </div>

      {/* CORRECCIÓN: Stats extraído fuera del div informativo izquierdo y posicionado de forma absoluta al fondo */}
      <div style={{
        position: 'absolute',
        bottom: '-45px', 
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 48px)',
        maxWidth: '1200px',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        borderRadius: '24px',
        padding: '24px 16px',
        background: 'rgba(255, 255, 255, 0.94)',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
        border: '1px solid rgba(255,255,255,0.8)',
        zIndex: 10,
        textAlign: 'center'
      }}>
        {stats.map((s, i, arr) => (
          <div key={s.v} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            borderRight: i < arr.length - 1 ? '1px solid rgba(0,0,0,0.08)' : 'none',
          }}>
            <span className="material-symbols-outlined" style={{ color: PRIMARY, fontSize: '24px', marginBottom: '6px' }}>{s.icon}</span>
            <span style={{ fontFamily: fontDisplay, fontSize: '28px', fontWeight: 700, color: '#333', lineHeight: 1 }}>{s.k}</span>
            <span style={{ fontSize: '13px', fontWeight: 500, color: '#7a6a5a', marginTop: '4px' }}>{s.v}</span>
          </div>
        ))}
      </div>

      {/* Dots (Subidos ligeramente para que no colisionen con el bloque flotante) */}
      <div style={{ position: 'absolute', bottom: '65px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px', zIndex: 4 }}>
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => setSlideActual(i)}
            style={{
              height: '6px', borderRadius: '999px', border: 'none', cursor: 'pointer',
              transition: 'all 0.3s',
              width: i === slideActual ? '32px' : '6px',
              background: i === slideActual ? 'white' : 'rgba(255,255,255,0.5)',
            }} />
        ))}
      </div>
    </section>
  );
}
