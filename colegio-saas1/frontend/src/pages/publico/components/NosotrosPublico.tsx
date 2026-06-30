interface Props {
  colegio: any;
}

export default function NosotrosPublico({ colegio }: Props) {
  const PRIMARY = colegio?.colorPrimario || '#92462F';
  const PRIMARY_SOFT = `${PRIMARY}12`;
  const fontDisplay = "'Fraunces', Georgia, serif";

  const items = [
    { icon:'book', title:'Misión', desc:'Brindar formación integral con valores, ciencia y tecnología.' },
    { icon:'auto_awesome', title:'Visión', desc:'Ser institución líder en excelencia académica al 2030.' },
    { icon:'favorite', title:'Valores', desc:'Respeto, responsabilidad, honestidad y solidaridad.' },
    { icon:'history_edu', title:'Historia', desc:'Más de 40 años formando generaciones comprometidas.' },
  ];

  return (
    <section id="nosotros" style={{padding:'96px 0', background:'white'}}>
      <div style={{maxWidth:'1280px', margin:'0 auto', padding:'0 24px'}}>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'64px', alignItems:'center'}}>
          <div>
            <div style={{
              display:'inline-flex', alignItems:'center', gap:'8px',
              padding:'6px 16px', borderRadius:'999px', marginBottom:'20px',
              background:PRIMARY_SOFT, color:PRIMARY,
              fontSize:'12px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.12em',
            }}>
              Nuestra identidad
            </div>
            <h2 style={{fontFamily:fontDisplay, fontSize:'clamp(28px,4vw,44px)', fontWeight:700, color:'#333', lineHeight:1.1, marginBottom:'20px'}}>
              Más que un colegio, una{' '}
              <span style={{color:PRIMARY, fontStyle:'italic'}}>familia</span> que educa.
            </h2>
            <p style={{fontSize:'17px', color:'#7a6a5a', lineHeight:1.7, marginBottom:'32px'}}>
              {colegio?.descripcion || 'Formamos estudiantes íntegros con valores, ciencia y tecnología, desarrollando competencias para un mundo en constante cambio.'}
            </p>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px'}}>
              {items.map((item,i) => (
                <div key={i} style={{
                  padding:'20px', borderRadius:'16px',
                  background:'#FAFAF8', border:'1px solid rgba(0,0,0,0.06)',
                }}>
                  <span className="material-symbols-outlined" style={{color:PRIMARY, fontSize:'24px', marginBottom:'8px', display:'block'}}>{item.icon}</span>
                  <h4 style={{fontFamily:fontDisplay, fontSize:'16px', fontWeight:600, color:'#333', marginBottom:'4px'}}>{item.title}</h4>
                  <p style={{fontSize:'13px', color:'#7a6a5a', lineHeight:1.5}}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px'}}>
            {[
              'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&q=80',
              'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&q=80',
              'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&q=80',
              'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&q=80',
            ].map((src,i) => (
              <div key={i} style={{
                borderRadius:'16px', overflow:'hidden',
                aspectRatio: i===0 ? 'auto' : '1',
                gridRow: i===0 ? 'span 2' : 'auto',
              }}>
                <img src={src} alt="" style={{width:'100%', height:'100%', objectFit:'cover'}}/>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
