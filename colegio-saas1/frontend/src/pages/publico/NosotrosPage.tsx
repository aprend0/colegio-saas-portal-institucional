import LayoutPublico from './components/LayoutPublico';

export default function NosotrosPage() {
  return (
    <LayoutPublico>
      {(colegio) => {
        const PRIMARY = colegio?.colorPrimario || '#92462F';
        const fontDisplay = "'Fraunces', Georgia, serif";
        const items = [
          {icon:'book', title:'Misión', desc:'Brindar formación integral con valores, ciencia y tecnología, desarrollando competencias que permitan a nuestros estudiantes desenvolverse con autonomía.'},
          {icon:'auto_awesome', title:'Visión', desc:'Ser al 2030 una institución educativa líder, reconocida por la excelencia académica y la formación de ciudadanos íntegros.'},
          {icon:'favorite', title:'Valores', desc:'Respeto, responsabilidad, honestidad, solidaridad y amor por el aprendizaje son los pilares que guían nuestra convivencia.'},
          {icon:'history_edu', title:'Historia', desc:'Más de 40 años formando generaciones comprometidas con su comunidad desde inicial hasta secundaria.'},
        ];
        return (
          <div style={{padding:'64px 0', background:'white', minHeight:'80vh'}}>
            <div style={{maxWidth:'1280px', margin:'0 auto', padding:'0 24px'}}>
              <div style={{marginBottom:'48px'}}>
                <div style={{display:'inline-flex', alignItems:'center', gap:'8px', padding:'6px 16px', borderRadius:'999px', marginBottom:'16px', background:`${PRIMARY}12`, color:PRIMARY, fontSize:'12px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.12em'}}>
                  Nuestra identidad
                </div>
                <h1 style={{fontFamily:fontDisplay, fontSize:'clamp(32px,5vw,52px)', fontWeight:700, color:'#333', lineHeight:1.1, marginBottom:'16px'}}>
                  Más que un colegio, una{' '}
                  <span style={{color:PRIMARY, fontStyle:'italic'}}>familia</span> que educa.
                </h1>
                <p style={{fontSize:'18px', color:'#7a6a5a', lineHeight:1.7, maxWidth:'640px'}}>
                  {colegio?.descripcion || 'Formamos estudiantes íntegros con valores, ciencia y tecnología, desarrollando competencias para un mundo en constante cambio.'}
                </p>
              </div>
              <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'24px'}}>
                {items.map((item,i) => (
                  <div key={i} style={{padding:'32px', borderRadius:'24px', background:'#FAFAF8', border:'1px solid rgba(0,0,0,0.06)', boxShadow:'0 2px 12px rgba(0,0,0,0.04)'}}>
                    <div style={{width:'52px', height:'52px', borderRadius:'16px', background:`${PRIMARY}12`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'16px'}}>
                      <span className="material-symbols-outlined" style={{color:PRIMARY, fontSize:'28px'}}>{item.icon}</span>
                    </div>
                    <h3 style={{fontFamily:fontDisplay, fontSize:'22px', fontWeight:600, color:'#333', marginBottom:'12px'}}>{item.title}</h3>
                    <p style={{fontSize:'15px', color:'#7a6a5a', lineHeight:1.7}}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }}
    </LayoutPublico>
  );
}
