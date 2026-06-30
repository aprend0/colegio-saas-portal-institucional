import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import LayoutPublico from './components/LayoutPublico';

export default function ComunicadosPage() {
  const { colegioId } = useParams();
  const [contenido, setContenido] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/contenido/publico/${colegioId}`)
      .then(r => setContenido(r.data.filter((c:any) => c.tipo === 'comunicado')))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [colegioId]);

  return (
    <LayoutPublico>
      {(colegio) => {
        const PRIMARY = colegio?.colorPrimario || '#92462F';
        const fontDisplay = "'Fraunces', Georgia, serif";
        return (
          <div style={{padding:'64px 0', minHeight:'80vh', background:'white'}}>
            <div style={{maxWidth:'1280px', margin:'0 auto', padding:'0 24px'}}>
              <div style={{marginBottom:'48px'}}>
                <div style={{display:'inline-flex', alignItems:'center', gap:'8px', padding:'6px 16px', borderRadius:'999px', marginBottom:'16px', background:`${PRIMARY}12`, color:PRIMARY, fontSize:'12px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.12em'}}>
                  <span className="material-symbols-outlined" style={{fontSize:'16px'}}>campaign</span>
                  Comunicados
                </div>
                <h1 style={{fontFamily:fontDisplay, fontSize:'clamp(32px,5vw,52px)', fontWeight:700, color:'#333', lineHeight:1.1}}>
                  Comunicados{' '}
                  <span style={{color:PRIMARY, fontStyle:'italic'}}>Institucionales</span>
                </h1>
              </div>
              {loading ? (
                <div style={{display:'flex', justifyContent:'center', padding:'80px 0'}}>
                  <div style={{width:'40px', height:'40px', border:`2px solid ${PRIMARY}`, borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.8s linear infinite'}}/>
                  <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                </div>
              ) : contenido.length === 0 ? (
                <div style={{textAlign:'center', padding:'80px', borderRadius:'24px', background:'#FAFAF8', border:'1px solid rgba(0,0,0,0.06)'}}>
                  <span className="material-symbols-outlined" style={{fontSize:'64px', color:'rgba(0,0,0,0.08)', display:'block', marginBottom:'16px'}}>campaign</span>
                  <p style={{color:'#7a6a5a'}}>No hay comunicados publicados aún.</p>
                </div>
              ) : (
                <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:'24px'}}>
                  {contenido.map((c:any) => (
                    <article key={c.id} style={{borderRadius:'24px', overflow:'hidden', background:'#FAFAF8', border:'1px solid rgba(0,0,0,0.06)', boxShadow:'0 4px 20px rgba(0,0,0,0.06)', transition:'all 0.3s'}}
                      onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 12px 40px rgba(0,0,0,0.1)'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 4px 20px rgba(0,0,0,0.06)'; }}>
                      <div style={{height:'200px', background:`linear-gradient(135deg,${PRIMARY}15,${PRIMARY}05)`, display:'flex', alignItems:'center', justifyContent:'center', position:'relative'}}>
                        <span className="material-symbols-outlined" style={{fontSize:'64px', color:`${PRIMARY}30`}}>campaign</span>
                        <div style={{position:'absolute', top:'16px', left:'16px', padding:'4px 12px', borderRadius:'999px', background:PRIMARY, color:'white', fontSize:'11px', fontWeight:700}}>
                          {new Date(c.createdAt).toLocaleDateString('es-PE',{day:'numeric',month:'short'})}
                        </div>
                      </div>
                      <div style={{padding:'24px'}}>
                        <h3 style={{fontFamily:fontDisplay, fontSize:'20px', fontWeight:600, color:'#333', marginBottom:'12px', lineHeight:1.3}}>{c.titulo}</h3>
                        <p style={{fontSize:'14px', color:'#7a6a5a', lineHeight:1.6, marginBottom:'20px'}}>{c.descripcion}</p>
                        <button style={{display:'flex', alignItems:'center', gap:'4px', background:'none', border:'none', cursor:'pointer', color:PRIMARY, fontWeight:700, fontSize:'14px', padding:0}}>
                          Ver comunicado <span className="material-symbols-outlined" style={{fontSize:'18px'}}>arrow_forward</span>
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      }}
    </LayoutPublico>
  );
}
