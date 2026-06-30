interface Props {
  colegio: any;
  navItems: { label: string; href: string }[];
  onNavClick: (href: string) => void;
}

export default function FooterPublico({ colegio, navItems, onNavClick }: Props) {
  const PRIMARY = colegio?.colorPrimario || '#92462F';
  const fontDisplay = "'Fraunces', Georgia, serif";

  return (
    <footer style={{background:'#333333', color:'rgba(255,255,255,0.8)'}}>
      <div style={{maxWidth:'1280px', margin:'0 auto', padding:'64px 24px 0', display:'grid', gridTemplateColumns:'2fr 1fr 1fr', gap:'48px'}}>
        <div>
          <div style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'16px'}}>
            {colegio?.logo ? (
              <img src={colegio.logo} alt={colegio.nombre}
                style={{width:'48px', height:'48px', borderRadius:'50%', objectFit:'cover'}}/>
            ) : (
              <div style={{width:'48px', height:'48px', borderRadius:'50%', background:PRIMARY, display:'flex', alignItems:'center', justifyContent:'center'}}>
                <span className="material-symbols-outlined" style={{color:'white'}}>school</span>
              </div>
            )}
            <div>
              <div style={{fontSize:'11px', textTransform:'uppercase', letterSpacing:'0.18em', color:'rgba(255,255,255,0.4)'}}>{colegio?.ugel || 'I.E.'}</div>
              <div style={{fontFamily:fontDisplay, fontSize:'18px', fontWeight:600, color:'white'}}>{colegio?.nombre || 'Institución Educativa'}</div>
            </div>
          </div>
          <p style={{fontSize:'14px', color:'rgba(255,255,255,0.6)', lineHeight:1.7, maxWidth:'360px'}}>
            {colegio?.slogan || 'Educando con amor y libertad.'} UGEL — Lima Metropolitana.
          </p>
        </div>

        <div>
          <p style={{fontSize:'11px', textTransform:'uppercase', letterSpacing:'0.18em', color:'rgba(255,255,255,0.4)', fontWeight:700, marginBottom:'16px'}}>
            Enlaces rápidos
          </p>
          <ul style={{listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:'8px'}}>
            {navItems.map(n => (
              <li key={n.href}>
                <a href={n.href} onClick={e => { e.preventDefault(); onNavClick(n.href); }}
                  style={{fontSize:'14px', color:'rgba(255,255,255,0.7)', textDecoration:'none'}}>
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p style={{fontSize:'11px', textTransform:'uppercase', letterSpacing:'0.18em', color:'rgba(255,255,255,0.4)', fontWeight:700, marginBottom:'16px'}}>
            Contacto
          </p>
          <ul style={{listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:'12px'}}>
            {[
              {icon:'location_on', v: colegio?.direccion || 'Lima, Perú'},
              {icon:'phone', v: colegio?.telefono || '(01) 000-0000'},
              {icon:'mail', v: colegio?.email || 'contacto@institucion.edu.pe'},
            ].map((item,i) => (
              <li key={i} style={{display:'flex', gap:'8px', alignItems:'center', fontSize:'14px', color:'rgba(255,255,255,0.7)'}}>
                <span className="material-symbols-outlined" style={{fontSize:'16px'}}>{item.icon}</span>
                {item.v}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div style={{
        maxWidth:'1280px', margin:'0 auto', padding:'20px 24px',
        marginTop:'48px', borderTop:'1px solid rgba(255,255,255,0.08)',
        display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:'8px',
      }}>
        <span style={{fontSize:'13px', color:'rgba(255,255,255,0.4)'}}>
          © {new Date().getFullYear()} {colegio?.nombre || 'Institución Educativa'} — Todos los derechos reservados.
        </span>
        <span style={{fontSize:'13px', color:'rgba(255,255,255,0.4)'}}>Powered by Colegio SaaS</span>
      </div>
    </footer>
  );
}
