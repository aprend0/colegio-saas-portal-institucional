import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import LayoutPublico from './components/LayoutPublico';

export default function NoticiasPage() {
  const { colegioId } = useParams();
  const [contenido, setContenido] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/contenido/publico/${colegioId}`)
      .then(r => setContenido(r.data.filter((c:any) => c.tipo === 'noticia')))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [colegioId]);

  return (
    <LayoutPublico>
      {(colegio) => {
        const PRIMARY = colegio?.colorPrimario || '#92462F';
        const fontDisplay = "'Fraunces', Georgia, serif";
        return (
          <div style={{padding:'64px 0', minHeight:'80vh', background:'#FAFAF8'}}>
            <div style={{maxWidth:'1280px', margin:'0 auto', padding:'0 24px'}}>
              <div style={{marginBottom:'48px'}}>
                <div style={{display:'inline-flex', alignItems:'center', gap:'8px', padding:'6px 16px', borderRadius:'999px', marginBottom:'16px', background:`${PRIMARY}12`, color:PRIMARY, fontSize:'12px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.12em'}}>
                  <span className="material-symbols-outlined" style={{fontSize:'16px'}}>newspaper</span>
                  Noticias
                </div>
                <h1 style={{fontFamily:fontDisplay, fontSize:'clamp(32px,5vw,52px)', fontWeight:700, color:'#333', lineHeight:1.1}}>
                  Lo último de nuestra{' '}
                  <span style={{color:PRIMARY, fontStyle:'italic'}}>comunidad</span>
                </h1>
              </div>
              {loading ? (
                <div style={{display:'flex', justifyContent:'center', padding:'80px 0'}}>
                  <div style={{width:'40px', height:'40px', border:`2px solid ${PRIMARY}`, borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.8s linear infinite'}}/>
                  <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                </div>
              ) : contenido.length === 0 ? (
                <div style={{textAlign:'center', padding:'80px', borderRadius:'24px', background:'white', border:'1px solid rgba(0,0,0,0.06)'}}>
                  <span className="material-symbols-outlined" style={{fontSize:'64px', color:'rgba(0,0,0,0.08)', display:'block', marginBottom:'16px'}}>newspaper</span>
                  <p style={{color:'#7a6a5a'}}>No hay noticias publicadas aún.</p>
                </div>
              ) : (
                <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'24px'}}>
                  {contenido.map((c:any) => (
                    <article key={c.id} style={{borderRadius:'24px', overflow:'hidden', background:'white', border:'1px solid rgba(0,0,0,0.06)', boxShadow:'0 4px 20px rgba(0,0,0,0.06)', display:'flex', flexDirection:'column', transition:'all 0.3s'}}
                      onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 12px 40px rgba(0,0,0,0.1)'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 4px 20px rgba(0,0,0,0.06)'; }}>
                      <div style={{height:'4px', background:`linear-gradient(to right, ${PRIMARY}, ${PRIMARY}80)`}}/>
                      <div style={{aspectRatio:'16/10', background:`${PRIMARY}08`, display:'flex', alignItems:'center', justifyContent:'center'}}>
                        <span className="material-symbols-outlined" style={{fontSize:'56px', color:`${PRIMARY}25`}}>newspaper</span>
                      </div>
                      <div style={{padding:'24px', flex:1, display:'flex', flexDirection:'column'}}>
                        <div style={{fontSize:'12px', color:'#7a6a5a', marginBottom:'8px', display:'flex', alignItems:'center', gap:'6px'}}>
                          <span className="material-symbols-outlined" style={{fontSize:'14px'}}>calendar_today</span>
                          {new Date(c.createdAt).toLocaleDateString('es-PE',{day:'numeric',month:'long',year:'numeric'})}
                        </div>
                        <h3 style={{fontFamily:fontDisplay, fontSize:'20px', fontWeight:600, color:'#333', lineHeight:1.3, marginBottom:'8px'}}>{c.titulo}</h3>
                        <p style={{fontSize:'14px', color:'#7a6a5a', lineHeight:1.6, flex:1, marginBottom:'16px'}}>{c.descripcion}</p>
                        <button style={{display:'flex', alignItems:'center', gap:'4px', background:'none', border:'none', cursor:'pointer', color:PRIMARY, fontWeight:700, fontSize:'14px', padding:0}}>
                          Leer más <span className="material-symbols-outlined" style={{fontSize:'18px'}}>arrow_forward</span>
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
