import { useState } from 'react';

interface Props {
  contenido: any[];
  loading: boolean;
  colegio: any;
}

export default function PublicacionesPublico({ contenido, loading, colegio }: Props) {
  const [filtro, setFiltro] = useState('todos');

  const PRIMARY = colegio?.colorPrimario || '#92462F';
  const PRIMARY_SOFT = `${PRIMARY}12`;
  const fontDisplay = "'Fraunces', Georgia, serif";

  const tipoColor: any = {
    comunicado: PRIMARY,
    noticia: '#1d4ed8',
    evento: '#15803d',
  };

  const tipoIcon: any = {
    comunicado: 'campaign',
    noticia: 'newspaper',
    evento: 'calendar_month',
  };

  const contenidoFiltrado = filtro === 'todos' ? contenido : contenido.filter(c => c.tipo === filtro);

  return (
    <section id="noticias" style={{padding:'96px 0', background:'#FAFAF8'}}>
      <div style={{maxWidth:'1280px', margin:'0 auto', padding:'0 24px'}}>

        {/* Header */}
        <div style={{display:'flex', flexWrap:'wrap', alignItems:'flex-end', justifyContent:'space-between', gap:'24px', marginBottom:'48px'}}>
          <div style={{maxWidth:'560px'}}>
            <div style={{
              display:'inline-flex', alignItems:'center', gap:'8px',
              padding:'6px 16px', borderRadius:'999px', marginBottom:'16px',
              background:PRIMARY_SOFT, color:PRIMARY,
              fontSize:'12px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.12em',
            }}>
              <span className="material-symbols-outlined" style={{fontSize:'16px'}}>newspaper</span>
              Noticias y comunicados
            </div>
            <h2 style={{fontFamily:fontDisplay, fontSize:'clamp(28px,4vw,44px)', fontWeight:700, color:'#333', lineHeight:1.1}}>
              Lo último de nuestra{' '}
              <span style={{color:PRIMARY, fontStyle:'italic'}}>comunidad</span>
            </h2>
          </div>
          {/* Filtros */}
          <div style={{display:'flex', gap:'8px', flexWrap:'wrap'}}>
            {['todos','comunicado','noticia','evento'].map(tipo => (
              <button key={tipo} onClick={() => setFiltro(tipo)}
                style={{
                  padding:'8px 18px', borderRadius:'999px',
                  fontSize:'13px', fontWeight:600, cursor:'pointer',
                  transition:'all 0.2s', textTransform:'capitalize',
                  background: filtro===tipo ? PRIMARY : 'transparent',
                  color: filtro===tipo ? 'white' : '#7a6a5a',
                  border:`1px solid ${filtro===tipo ? PRIMARY : 'rgba(0,0,0,0.08)'}`,
                }}>
                {tipo === 'todos' ? 'Todos' : tipo+'s'}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{display:'flex', justifyContent:'center', padding:'80px 0'}}>
            <div style={{width:'40px', height:'40px', border:`2px solid ${PRIMARY}`, borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.8s linear infinite'}}/>
          </div>
        ) : contenidoFiltrado.length === 0 ? (
          <div style={{textAlign:'center', padding:'80px 24px', borderRadius:'24px', background:'white', border:'1px solid rgba(0,0,0,0.08)'}}>
            <span className="material-symbols-outlined" style={{fontSize:'64px', color:'rgba(0,0,0,0.08)', display:'block', marginBottom:'16px'}}>inbox</span>
            <p style={{color:'#7a6a5a', fontSize:'16px'}}>No hay publicaciones disponibles aún.</p>
          </div>
        ) : (
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'24px'}}>
            {contenidoFiltrado.map((c:any) => {
              const tc = tipoColor[c.tipo] || PRIMARY;
              return (
                <article key={c.id}
                  style={{
                    borderRadius:'24px', overflow:'hidden', background:'white',
                    border:'1px solid rgba(0,0,0,0.06)',
                    boxShadow:'0 4px 20px rgba(0,0,0,0.06)',
                    display:'flex', flexDirection:'column', transition:'all 0.3s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 12px 40px rgba(0,0,0,0.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 4px 20px rgba(0,0,0,0.06)'; }}>
                  {/* Top color strip */}
                  <div style={{height:'4px', background:`linear-gradient(to right, ${tc}, ${tc}80)`}}/>
                  {/* Imagen placeholder */}
                  <div style={{
                    aspectRatio:'16/10', background:`linear-gradient(135deg,${tc}10,${tc}04)`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                  }}>
                    <span className="material-symbols-outlined" style={{fontSize:'56px', color:`${tc}25`}}>{tipoIcon[c.tipo]}</span>
                  </div>
                  <div style={{padding:'24px', flex:1, display:'flex', flexDirection:'column'}}>
                    <div style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'8px', color:'#7a6a5a', fontSize:'12px'}}>
                      <span className="material-symbols-outlined" style={{fontSize:'14px'}}>calendar_today</span>
                      {new Date(c.createdAt).toLocaleDateString('es-PE',{day:'numeric',month:'long',year:'numeric'})}
                    </div>
                    <h3 style={{fontFamily:fontDisplay, fontSize:'18px', fontWeight:600, color:'#333', lineHeight:1.3, marginBottom:'8px', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden'}}>{c.titulo}</h3>
                    <p style={{fontSize:'14px', color:'#7a6a5a', lineHeight:1.6, flex:1, marginBottom:'16px', display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden'}}>{c.descripcion}</p>
                    <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', paddingTop:'12px', borderTop:'1px solid rgba(0,0,0,0.06)'}}>
                      <span style={{
                        fontSize:'11px', fontWeight:700, padding:'4px 10px', borderRadius:'999px',
                        background:`${tc}12`, color:tc, textTransform:'capitalize',
                      }}>{c.tipo}</span>
                      <button style={{
                        display:'flex', alignItems:'center', gap:'4px',
                        background:'none', border:'none', cursor:'pointer',
                        color:tc, fontWeight:700, fontSize:'13px', padding:0,
                      }}>
                        Leer más
                        <span className="material-symbols-outlined" style={{fontSize:'16px'}}>arrow_forward</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </section>
  );
}
