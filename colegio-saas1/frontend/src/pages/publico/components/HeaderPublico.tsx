import { useState, useEffect } from 'react';

interface Props {
  colegio: any;
  navItems: { label: string; href: string }[];
  onNavClick: (href: string) => void;
}

export default function HeaderPublico({ colegio, navItems, onNavClick }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);

  const PRIMARY = colegio?.colorPrimario || '#92462F';
  const fontDisplay = "'Fraunces', Georgia, serif";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header style={{
      position:'fixed', top:0, left:0, right:0, zIndex:50,
      transition:'all 0.3s',
      background: scrolled ? 'rgba(250,250,248,0.90)' : 'rgba(250,250,248,0.45)',
      backdropFilter:'blur(14px)',
      borderBottom: scrolled ? '1px solid rgba(0,0,0,0.08)' : 'none',
      boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.07)' : 'none',
    }}>
      <div style={{maxWidth:'1280px', margin:'0 auto', padding:'0 24px'}}>
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', height:'80px', gap:'16px'}}>

          {/* Logo */}
          <a href="#inicio" onClick={e => { e.preventDefault(); onNavClick('#inicio'); }}
            style={{display:'flex', alignItems:'center', gap:'12px', textDecoration:'none'}}>
            {colegio?.logo ? (
              <img src={colegio.logo} alt={colegio.nombre}
                style={{width:'48px', height:'48px', borderRadius:'50%', objectFit:'cover', border:'2px solid rgba(255,255,255,0.8)'}}/>
            ) : (
              <div style={{
                width:'48px', height:'48px', borderRadius:'50%',
                background:`linear-gradient(135deg, ${PRIMARY}, ${PRIMARY}cc)`,
                display:'flex', alignItems:'center', justifyContent:'center',
                boxShadow:`0 4px 12px ${PRIMARY}40`,
                border:'2px solid rgba(255,255,255,0.8)',
              }}>
                <span className="material-symbols-outlined" style={{color:'white', fontSize:'22px'}}>school</span>
              </div>
            )}
            <div>
              <div style={{fontSize:'11px', textTransform:'uppercase', letterSpacing:'0.18em', color:'#7a6a5a', fontWeight:600}}>
                {colegio?.ugel || 'I.E.'}
              </div>
              <div style={{fontFamily:fontDisplay, fontSize:'16px', fontWeight:600, color:'#333'}}>
                {colegio?.nombre || 'Institución Educativa'}
              </div>
            </div>
          </a>

          {/* Nav desktop */}
          <nav style={{display:'flex', alignItems:'center', gap:'4px'}}>
            {navItems.map(n => (
              <a key={n.href} href={n.href}
                onClick={e => { e.preventDefault(); onNavClick(n.href); setMenuAbierto(false); }}
                style={{
                  padding:'8px 16px', fontSize:'14px', fontWeight:500,
                  color:'#333', textDecoration:'none', borderRadius:'999px',
                  transition:'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background=`${PRIMARY}12`; e.currentTarget.style.color=PRIMARY; }}
                onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#333'; }}>
                {n.label}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
            <a href="/admin/login"
              style={{
                display:'flex', alignItems:'center', gap:'8px',
                padding:'10px 20px', borderRadius:'999px',
                background:PRIMARY, color:'white',
                fontSize:'14px', fontWeight:700, textDecoration:'none',
                boxShadow:`0 4px 16px ${PRIMARY}40`,
              }}>
              <span className="material-symbols-outlined" style={{fontSize:'18px'}}>newspaper</span>
              Asistencia
            </a>
            <button onClick={() => setMenuAbierto(!menuAbierto)}
              style={{padding:'8px', border:'none', background:'transparent', cursor:'pointer', display:'none'}}
              className="mobile-btn">
              <span className="material-symbols-outlined" style={{fontSize:'24px', color:'#333'}}>
                {menuAbierto ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuAbierto && (
        <div style={{padding:'0 24px 16px', borderTop:'1px solid rgba(0,0,0,0.06)', background:'rgba(250,250,248,0.97)'}}>
          {navItems.map(n => (
            <a key={n.href} href={n.href}
              onClick={e => { e.preventDefault(); onNavClick(n.href); setMenuAbierto(false); }}
              style={{
                display:'flex', alignItems:'center', justifyContent:'space-between',
                padding:'12px', borderRadius:'12px', textDecoration:'none',
                color:'#333', fontSize:'14px', fontWeight:500,
              }}>
              {n.label}
              <span className="material-symbols-outlined" style={{fontSize:'16px', color:'#7a6a5a'}}>chevron_right</span>
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
