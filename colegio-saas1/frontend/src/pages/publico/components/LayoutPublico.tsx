import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../../../services/api';

interface Props {
  children: (colegio: any) => React.ReactNode;
}

export default function LayoutPublico({ children }: Props) {
  const { colegioId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [colegio, setColegio] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await api.get(`/colegio/publico/${colegioId}`);
        setColegio(res.data);
      } catch(e){ console.error(e); }
      finally { setLoading(false); }
    };
    cargar();
  }, [colegioId]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const PRIMARY = colegio?.colorPrimario || '#92462F';
  const BG = colegio?.colorFondo || '#FAFAF8';
  const NAVBAR_BG = colegio?.colorNavbar || '#FAFAF8';
  const TEXT_COLOR = colegio?.colorTexto || '#333333';
  const FOOTER_BG = colegio?.colorFooter || '#333333';
  const fontDisplay = "'Fraunces', Georgia, serif";

  const navItems = [
    { label:'Inicio', path:`/colegio/${colegioId}` },
    { label:'Nosotros', path:`/colegio/${colegioId}/nosotros` },
    { label:'Noticias', path:`/colegio/${colegioId}/noticias` },
    { label:'Comunicados', path:`/colegio/${colegioId}/comunicados` },
    { label:'Contacto', path:`/colegio/${colegioId}/contacto` },
  ];

  const isActive = (path: string) => location.pathname === path;

  if (loading) return (
    <div style={{minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#FAFAF8'}}>
      <div style={{width:'40px', height:'40px', border:`3px solid #92462F`, borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.8s linear infinite'}}/>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{fontFamily:"'Inter', system-ui, sans-serif", background:BG, color:TEXT_COLOR, minHeight:'100vh'}}>

      {/* Header */}
      <header style={{
        position:'fixed', top:0, left:0, right:0, zIndex:50,
        transition:'all 0.3s',
        background: scrolled ? `${NAVBAR_BG}ee` : `${NAVBAR_BG}60`,
        backdropFilter:'blur(14px)',
        borderBottom: scrolled ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(0,0,0,0.04)',
        boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.07)' : 'none',
      }}>
        <div style={{maxWidth:'1280px', margin:'0 auto', padding:'0 24px'}}>
          <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', height:'80px'}}>

            {/* Logo */}
            <button onClick={() => navigate(`/colegio/${colegioId}`)}
              style={{display:'flex', alignItems:'center', gap:'12px', background:'none', border:'none', cursor:'pointer'}}>
              {colegio?.logo ? (
                <img src={colegio.logo} alt={colegio.nombre}
                  style={{width:'48px', height:'48px', borderRadius:'50%', objectFit:'cover'}}/>
              ) : (
                <div style={{
                  width:'48px', height:'48px', borderRadius:'50%',
                  background:`linear-gradient(135deg, ${PRIMARY}, ${PRIMARY}cc)`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  boxShadow:`0 4px 12px ${PRIMARY}40`,
                }}>
                  <span className="material-symbols-outlined" style={{color:'white', fontSize:'22px'}}>school</span>
                </div>
              )}
              <div style={{textAlign:'left'}}>
                <div style={{fontSize:'11px', textTransform:'uppercase', letterSpacing:'0.18em', color:'#7a6a5a', fontWeight:600}}>
                  {colegio?.ugel || 'I.E.'}
                </div>
                <div style={{fontFamily:fontDisplay, fontSize:'16px', fontWeight:600, color:TEXT_COLOR}}>
                  {colegio?.nombre || 'Institución Educativa'}
                </div>
              </div>
            </button>

            {/* Nav desktop */}
            <nav style={{display:'flex', alignItems:'center', gap:'4px'}}>
              {navItems.map(n => (
                <button key={n.path} onClick={() => navigate(n.path)}
                  style={{
                    padding:'8px 16px', fontSize:'14px',
                    fontWeight: isActive(n.path) ? 700 : 500,
                    color: isActive(n.path) ? PRIMARY : TEXT_COLOR,
                    background: isActive(n.path) ? `${PRIMARY}12` : 'transparent',
                    border:'none', borderRadius:'999px', cursor:'pointer', transition:'all 0.2s',
                  }}
                  onMouseEnter={e => { if(!isActive(n.path)){ e.currentTarget.style.background=`${PRIMARY}10`; e.currentTarget.style.color=PRIMARY; }}}
                  onMouseLeave={e => { if(!isActive(n.path)){ e.currentTarget.style.background='transparent'; e.currentTarget.style.color=TEXT_COLOR; }}}>
                  {n.label}
                </button>
              ))}
            </nav>

            {/* CTA */}
            <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
              <button onClick={() => navigate('/admin/login')}
                style={{
                  display:'flex', alignItems:'center', gap:'8px',
                  padding:'10px 20px', borderRadius:'999px',
                  background:PRIMARY, color:'white',
                  fontSize:'14px', fontWeight:700, border:'none', cursor:'pointer',
                  boxShadow:`0 4px 16px ${PRIMARY}40`,
                }}>
                <span className="material-symbols-outlined" style={{fontSize:'18px'}}>newspaper</span>
                Asistencia
              </button>
              <button onClick={() => setMenuAbierto(!menuAbierto)}
                style={{padding:'8px', border:'none', background:'transparent', cursor:'pointer'}}>
                <span className="material-symbols-outlined" style={{fontSize:'24px', color:TEXT_COLOR}}>
                  {menuAbierto ? 'close' : 'menu'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {menuAbierto && (
          <div style={{padding:'8px 24px 16px', borderTop:'1px solid rgba(0,0,0,0.06)', background:`${NAVBAR_BG}f7`}}>
            {navItems.map(n => (
              <button key={n.path} onClick={() => { navigate(n.path); setMenuAbierto(false); }}
                style={{
                  display:'flex', alignItems:'center', justifyContent:'space-between',
                  width:'100%', padding:'12px', borderRadius:'12px',
                  background: isActive(n.path) ? `${PRIMARY}10` : 'transparent',
                  color: isActive(n.path) ? PRIMARY : TEXT_COLOR,
                  border:'none', cursor:'pointer', fontSize:'14px',
                  fontWeight: isActive(n.path) ? 700 : 500,
                }}>
                {n.label}
                <span className="material-symbols-outlined" style={{fontSize:'16px', color:'#7a6a5a'}}>chevron_right</span>
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Content */}
      <main style={{paddingTop:'80px'}}>
        {children(colegio)}
      </main>

      {/* Footer */}
      <footer style={{background:FOOTER_BG, color:'rgba(255,255,255,0.8)'}}>
        <div style={{maxWidth:'1280px', margin:'0 auto', padding:'48px 24px 0', display:'grid', gridTemplateColumns:'2fr 1fr 1fr', gap:'48px'}}>
          <div>
            <div style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'16px'}}>
              <div style={{width:'40px', height:'40px', borderRadius:'50%', background:PRIMARY, display:'flex', alignItems:'center', justifyContent:'center'}}>
                <span className="material-symbols-outlined" style={{color:'white', fontSize:'20px'}}>school</span>
              </div>
              <div style={{fontFamily:fontDisplay, fontSize:'16px', fontWeight:600, color:'white'}}>
                {colegio?.nombre || 'Institución Educativa'}
              </div>
            </div>
            <p style={{fontSize:'14px', color:'rgba(255,255,255,0.6)', lineHeight:1.7, maxWidth:'320px'}}>
              {colegio?.slogan || 'Educando con amor y libertad.'} UGEL — Lima Metropolitana.
            </p>
          </div>
          <div>
            <p style={{fontSize:'11px', textTransform:'uppercase', letterSpacing:'0.18em', color:'rgba(255,255,255,0.4)', fontWeight:700, marginBottom:'16px'}}>
              Navegación
            </p>
            <ul style={{listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:'8px'}}>
              {navItems.map(n => (
                <li key={n.path}>
                  <button onClick={() => navigate(n.path)}
                    style={{background:'none', border:'none', cursor:'pointer', fontSize:'14px', color:'rgba(255,255,255,0.7)', padding:0}}>
                    {n.label}
                  </button>
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
        <div style={{maxWidth:'1280px', margin:'0 auto', padding:'20px 24px', marginTop:'32px', borderTop:'1px solid rgba(255,255,255,0.08)', display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:'8px'}}>
          <span style={{fontSize:'13px', color:'rgba(255,255,255,0.4)'}}>© {new Date().getFullYear()} {colegio?.nombre || 'Institución Educativa'}</span>
          <span style={{fontSize:'13px', color:'rgba(255,255,255,0.4)'}}>Powered by Colegio SaaS</span>
        </div>
      </footer>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
