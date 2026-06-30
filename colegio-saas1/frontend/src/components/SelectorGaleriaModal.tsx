import { useState, useEffect } from 'react';
import api from '../services/api'; // Ajusta la ruta relativa según corresponda

interface SelectorGaleriaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImagen: (urlCompleta: string, rutaCorta: string) => void;
}

export default function SelectorGaleriaModal({ isOpen, onClose, onSelectImagen }: SelectorGaleriaModalProps) {
  const [imagenes, setImagenes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Reutilizamos tus mismas constantes de diseño para mantener la estética intacta
  const BORDER = 'rgba(255,255,255,0.07)';
  const API_URL = 'http://localhost:3000';
  const TEXT = '#e2e8f0';
  const TEXT_MUTED = '#64748b';
  const BG_CARD = '#0d1b2e';
  const COLOR = '#fb923c';

  useEffect(() => {
    if (isOpen) {
      cargarImagenes();
    }
  }, [isOpen]);

  const cargarImagenes = async () => {
    try {
      setLoading(true);
      const res = await api.get('/galeria');
      setImagenes(res.data);
    } catch (e) {
      console.error("Error al cargar imágenes en el selector:", e);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 200, padding: '20px'
    }}>
      <div style={{
        background: '#0a1525', borderRadius: '20px', padding: '28px',
        width: '100%', maxWidth: '640px', border: `1px solid ${BORDER}`,
        display: 'flex', flexDirection: 'column', maxHeight: '85vh'
      }}>
        
        {/* Cabecera */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="material-symbols-outlined" style={{ color: COLOR }}>photo_library</span>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: TEXT, margin: 0 }}>Seleccionar desde Galería</h3>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: TEXT_MUTED }}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Cuerpo con Scroll */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px', marginBottom: '16px' }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
              <div style={{ width: '30px', height: '30px', border: `2px solid ${COLOR}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spinSelector 0.8s linear infinite' }} />
            </div>
          ) : imagenes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: TEXT_MUTED }}>
              <span className="material-symbols-outlined" style={{ fontSize: '48px', marginBottom: '8px', display: 'block' }}>wb_sunny</span>
              <p style={{ margin: 0 }}>No hay imágenes almacenadas en la galería institucional.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px' }}>
              {imagenes.map((img: any) => {
                // Construcción exacta de tu URL original
                const urlCompleta = img.imagen && img.imagen.startsWith('/') 
                  ? `${API_URL}${img.imagen}` 
                  : `${API_URL}/${img.imagen}`;

                return (
                  <div
                    key={img.id}
                    onClick={() => {
                      onSelectImagen(urlCompleta, img.imagen);
                      onClose();
                    }}
                    style={{
                      background: BG_CARD, borderRadius: '12px', border: `1px solid ${BORDER}`,
                      overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = COLOR; e.currentTarget.style.transform = 'scale(1.02)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.transform = 'none'; }}
                  >
                    <div style={{ aspectRatio: '4/3', overflow: 'hidden', background: '#000' }}>
                      <img src={urlCompleta} alt={img.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ padding: '8px' }}>
                      <p style={{ fontSize: '11px', fontWeight: 700, color: TEXT, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {img.titulo}
                      </p>
                      <p style={{ fontSize: '9px', color: TEXT_MUTED, margin: '2px 0 0' }}>{img.categoria}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <style>{`
          @keyframes spinSelector { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    </div>
  );
}
