import LayoutPublico from './components/LayoutPublico';

export default function ContactoPage() {
  return (
    <LayoutPublico>
      {(colegio) => {
        const PRIMARY = colegio?.colorPrimario || '#92462F';
        const fontDisplay = "'Fraunces', Georgia, serif";
        const datos = [
          {icon:'location_on', label:'Dirección', value: colegio?.direccion || 'Av. Principal s/n, Lima, Perú'},
          {icon:'phone', label:'Teléfono', value: colegio?.telefono || '(01) 000-0000'},
          {icon:'mail', label:'Correo', value: colegio?.email || 'contacto@institucion.edu.pe'},
          {icon:'schedule', label:'Horario', value:'Lun a Vie · 7:30 a.m. — 4:30 p.m.'},
        ];
        return (
          <div style={{padding:'64px 0', minHeight:'80vh', background:'#FAFAF8'}}>
            <div style={{maxWidth:'1280px', margin:'0 auto', padding:'0 24px'}}>
              <div style={{marginBottom:'48px'}}>
                <div style={{display:'inline-flex', alignItems:'center', gap:'8px', padding:'6px 16px', borderRadius:'999px', marginBottom:'16px', background:`${PRIMARY}12`, color:PRIMARY, fontSize:'12px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.12em'}}>
                  Contáctanos
                </div>
                <h1 style={{fontFamily:fontDisplay, fontSize:'clamp(32px,5vw,52px)', fontWeight:700, color:'#333', lineHeight:1.1, marginBottom:'16px'}}>
                  Estamos para{' '}
                  <span style={{color:PRIMARY, fontStyle:'italic'}}>acompañarte</span>
                </h1>
                <p style={{fontSize:'18px', color:'#7a6a5a', lineHeight:1.6, maxWidth:'560px'}}>
                  Escríbenos, llámanos o visítanos. Nos encantará conversar contigo.
                </p>
              </div>
              <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:'20px', marginBottom:'48px'}}>
                {datos.map((item,i) => (
                  <div key={i} style={{display:'flex', gap:'16px', padding:'28px', borderRadius:'20px', background:'white', border:'1px solid rgba(0,0,0,0.06)', boxShadow:'0 2px 12px rgba(0,0,0,0.05)'}}>
                    <div style={{width:'48px', height:'48px', borderRadius:'14px', background:`${PRIMARY}12`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}>
                      <span className="material-symbols-outlined" style={{color:PRIMARY, fontSize:'24px'}}>{item.icon}</span>
                    </div>
                    <div>
                      <p style={{fontSize:'11px', textTransform:'uppercase', letterSpacing:'0.18em', color:'#7a6a5a', fontWeight:700, marginBottom:'6px'}}>{item.label}</p>
                      <p style={{fontSize:'15px', color:'#333', fontWeight:500, lineHeight:1.5}}>{item.value}</p>
                    </div>
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
