import { useEffect, useMemo, useState } from 'react';
import api from '../../services/api';
import './PanelColegioRescue.css';

const colegioId = 1;

type Tab =
  | 'inicio'
  | 'perfil'
  | 'noticias'
  | 'pagos'
  | 'comunicados'
  | 'agenda'
  | 'reportes';

type Comunicado = {
  id: number | string;
  tipo: string;
  titulo: string;
  descripcion: string;
  imagen?: string;
  prioridad?: 'ALTA' | 'MEDIA' | 'NORMAL';
  fecha?: string;
  audiencia?: string;
};

type AgendaItem = {
  id: number | string;
  titulo: string;
  descripcion: string;
  fecha: string;
  hora: string;
  tipo: string;
  lugar: string;
};

const imagenesEducativas = [
  'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
];

const comunicadosBase: Comunicado[] = [
  {
    id: 'base-1',
    tipo: 'COMUNICADO',
    titulo: 'Semana de evaluaciones parciales',
    descripcion:
      'Se informa a las familias que la próxima semana inicia el periodo de evaluaciones. Recomendamos revisar horarios, materiales y acompañar el estudio en casa.',
    imagen: imagenesEducativas[2],
    prioridad: 'ALTA',
    audiencia: 'Familias y estudiantes',
    fecha: new Date().toISOString(),
  },
  {
    id: 'base-2',
    tipo: 'EVENTO',
    titulo: 'Reunión general de padres de familia',
    descripcion:
      'La reunión institucional se realizará en el patio principal. Se tratarán temas académicos, asistencia, pagos y actividades del mes.',
    imagen: imagenesEducativas[1],
    prioridad: 'MEDIA',
    audiencia: 'Padres de familia',
    fecha: new Date().toISOString(),
  },
  {
    id: 'base-3',
    tipo: 'NOTICIA',
    titulo: 'Feria académica institucional',
    descripcion:
      'Nuestros estudiantes presentaron proyectos de ciencia, lectura, tecnología y emprendimiento durante la feria institucional.',
    imagen: imagenesEducativas[0],
    prioridad: 'NORMAL',
    audiencia: 'Comunidad educativa',
    fecha: new Date().toISOString(),
  },
];

const agendaBase: AgendaItem[] = [
  {
    id: 'agenda-1',
    titulo: 'Reunión de coordinación docente',
    descripcion: 'Revisión de avance curricular, incidencias y planificación semanal.',
    fecha: proximaFecha(2),
    hora: '15:30',
    tipo: 'Académico',
    lugar: 'Sala de profesores',
  },
  {
    id: 'agenda-2',
    titulo: 'Semana de parciales',
    descripcion: 'Evaluaciones por curso y revisión de criterios de calificación.',
    fecha: proximaFecha(5),
    hora: '08:00',
    tipo: 'Evaluación',
    lugar: 'Aulas asignadas',
  },
  {
    id: 'agenda-3',
    titulo: 'Actividad institucional',
    descripcion: 'Jornada de integración, participación estudiantil y comunicación con familias.',
    fecha: proximaFecha(12),
    hora: '10:00',
    tipo: 'Evento',
    lugar: 'Patio principal',
  },
];

const horariosBase = [
  { dia: 'Lunes', hora: '08:00 - 09:30', curso: 'Matemática', aula: 'Aula 1A' },
  { dia: 'Martes', hora: '09:40 - 11:10', curso: 'Comunicación', aula: 'Aula 1A' },
  { dia: 'Miércoles', hora: '11:20 - 12:50', curso: 'Ciencia y Tecnología', aula: 'Lab. Ciencias' },
  { dia: 'Jueves', hora: '08:00 - 09:30', curso: 'Historia', aula: 'Aula 1A' },
  { dia: 'Viernes', hora: '10:00 - 11:30', curso: 'Tutoría', aula: 'Aula 1A' },
];

function googleNewsUrl(query: string) {
  return `https://news.google.com/search?q=${encodeURIComponent(query)}&hl=es-419&gl=PE&ceid=PE:es-419`;
}

const fallbackNews = [
  {
    title: 'Estrategias para fortalecer la convivencia escolar',
    source: 'Radar Educativo',
    description:
      'La convivencia escolar mejora cuando docentes, familias y estudiantes comparten normas claras y canales de comunicación activos.',
    image: imagenesEducativas[0],
    link: googleNewsUrl('convivencia escolar colegios familias estudiantes'),
    pubDate: new Date().toISOString(),
  },
  {
    title: 'Lectura, tecnología y proyectos como motores de aprendizaje',
    source: 'Comunidad Educativa',
    description:
      'Las experiencias prácticas y el trabajo colaborativo fortalecen competencias académicas y socioemocionales.',
    image: imagenesEducativas[4],
    link: googleNewsUrl('proyectos escolares lectura tecnologia aprendizaje colegios'),
    pubDate: new Date().toISOString(),
  },
  {
    title: 'Planificación escolar para evaluaciones y actividades',
    source: 'Gestión Escolar',
    description:
      'Una agenda ordenada ayuda a reducir inasistencias, mejorar la comunicación y dar seguimiento al rendimiento.',
    image: imagenesEducativas[2],
    link: googleNewsUrl('planificacion escolar evaluaciones actividades colegios'),
    pubDate: new Date().toISOString(),
  },
];

const menu: { key: Tab; label: string }[] = [
  { key: 'inicio', label: 'Inicio' },
  { key: 'perfil', label: 'Perfil institucional' },
  { key: 'noticias', label: 'Noticias educativas' },
  { key: 'pagos', label: 'Pagos' },
  { key: 'comunicados', label: 'Comunicados' },
  { key: 'agenda', label: 'Agenda escolar' },
  { key: 'reportes', label: 'Reportes' },
];

export default function PanelColegioRescue() {
  const [activeTab, setActiveTab] = useState<Tab>('inicio');
  const [dashboard, setDashboard] = useState<any>(null);
  const [noticias, setNoticias] = useState<any[]>(fallbackNews);
  const [pagos, setPagos] = useState<any[]>([]);
  const [comunicados, setComunicados] = useState<Comunicado[]>(comunicadosBase);
  const [agenda, setAgenda] = useState<AgendaItem[]>(agendaBase);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  const [selectedComunicado, setSelectedComunicado] = useState<Comunicado | null>(null);
  const [showComunicadoModal, setShowComunicadoModal] = useState(false);
  const [showAgendaModal, setShowAgendaModal] = useState(false);
  const [showWelcome, setShowWelcome] = useState(() => !localStorage.getItem('colegio_portal_welcome_closed'));
  const [searchPago, setSearchPago] = useState('');
  const [estadoPago, setEstadoPago] = useState('');
  const [draftComunicado, setDraftComunicado] = useState<Comunicado>({
    id: '',
    tipo: 'COMUNICADO',
    titulo: '',
    descripcion: '',
    prioridad: 'NORMAL',
    audiencia: 'Familias',
    imagen: imagenesEducativas[1],
  });
  const [draftAgenda, setDraftAgenda] = useState<AgendaItem>({
    id: '',
    titulo: '',
    descripcion: '',
    fecha: proximaFecha(1),
    hora: '08:00',
    tipo: 'Académico',
    lugar: 'Colegio',
  });

  useEffect(() => {
    cargarTodo();
    cargarLocales();
  }, []);

  const cargarLocales = () => {
    const agendaLocal = localStorage.getItem('colegio_agenda_local');
    const comunicadosLocal = localStorage.getItem('colegio_comunicados_local');

    if (agendaLocal) {
      try {
        setAgenda([...JSON.parse(agendaLocal), ...agendaBase]);
      } catch {
        setAgenda(agendaBase);
      }
    }

    if (comunicadosLocal) {
      try {
        setComunicados([...JSON.parse(comunicadosLocal), ...comunicadosBase]);
      } catch {
        setComunicados(comunicadosBase);
      }
    }
  };

  const cargarTodo = async () => {
    setLoading(true);

    try {
      const dash = await api.get(`/panel-colegio/${colegioId}/dashboard`);
      setDashboard(dash.data);

      const remotos = normalizarComunicados(dash.data?.ultimosComunicados || []);
      if (remotos.length > 0) {
        setComunicados(mergeComunicados(remotos, getComunicadosLocales(), comunicadosBase));
      }
    } catch (error) {
      console.error('Error cargando dashboard', error);
    }

    try {
      const pagosResponse = await api.get(`/panel-colegio/${colegioId}/pagos`);
      setPagos(Array.isArray(pagosResponse.data) ? pagosResponse.data : []);
    } catch (error) {
      console.error('Error cargando pagos', error);
      setPagos([]);
    }

    try {
      const news = await api.get(
        '/noticias-educacion?q=educacion colegios estudiantes docentes calendario escolar convivencia lectura Peru',
      );
      const lista = Array.isArray(news.data?.noticias) ? news.data.noticias : [];

      if (lista.length > 0) {
        setNoticias(
          lista.map((item: any, index: number) => ({
            ...item,
            image: item.image || imagenesEducativas[index % imagenesEducativas.length],
            link: item.link || googleNewsUrl(item.title || 'noticias educativas colegios'),
          })),
        );
      } else {
        setNoticias(fallbackNews);
      }
    } catch (error) {
      console.error('Error cargando noticias', error);
      setNoticias(fallbackNews);
    }

    setLoading(false);
  };

  const cards = dashboard?.cards || {};
  const pagosPendientes = pagos.filter((pago) => pago.estado === 'PENDIENTE');
  const montoPendiente = pagosPendientes.reduce((sum, pago) => sum + Number(pago.monto || 0), 0);

  const pagosFiltrados = useMemo(() => {
    return pagos.filter((pago) => {
      const texto = `${pago.concepto || ''} ${pago.estado || ''} ${pago.estudiante?.nombres || ''} ${pago.estudiante?.apellidos || ''}`.toLowerCase();
      const coincideTexto = texto.includes(searchPago.toLowerCase());
      const coincideEstado = estadoPago ? pago.estado === estadoPago : true;
      return coincideTexto && coincideEstado;
    });
  }, [pagos, searchPago, estadoPago]);

  const alertas = crearAlertas(cards, pagosPendientes.length, agenda, comunicados);

  const abrirNoticia = (item: any) => {
    const url = item?.link || googleNewsUrl(item?.title || 'noticias educativas');
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const marcarPagado = async (pago: any) => {
    const ok = window.confirm('¿Confirmar este pago como PAGADO?');
    if (!ok) return;

    try {
      await api.patch(`/pagos/${pago.id}/pagado`, {
        fechaPago: new Date().toISOString(),
        metodoPago: 'EFECTIVO',
        comprobante: `PANEL-${pago.id}`,
        observacion: 'Pago confirmado desde Colegio SaaS',
      });
      setToast('Pago confirmado correctamente.');
      await cargarTodo();
    } catch (error) {
      console.error('Error marcando pago', error);
      alert('No se pudo marcar como pagado.');
    }
  };

  const copiarRecordatorioPago = async (pago?: any) => {
    const texto = pago
      ? `Estimadas familias, recordamos regularizar el pago de ${pago.concepto} por S/ ${Number(pago.monto || 0).toFixed(2)}. Gracias por su compromiso con la institución.`
      : `Estimadas familias, recordamos revisar los pagos pendientes en el panel institucional. Mantenerlos al día permite una mejor organización académica y administrativa.`;

    try {
      await navigator.clipboard.writeText(texto);
      setToast('Recordatorio copiado al portapapeles.');
    } catch {
      setToast(texto);
    }
  };

  const abrirNuevoComunicado = (tema?: string) => {
    const sugerido = generarComunicado(tema || 'general', cards);
    setDraftComunicado({
      id: '',
      tipo: sugerido.tipo,
      titulo: sugerido.titulo,
      descripcion: sugerido.descripcion,
      prioridad: sugerido.prioridad,
      audiencia: sugerido.audiencia,
      imagen: sugerido.imagen,
      fecha: new Date().toISOString(),
    });
    setShowComunicadoModal(true);
  };

  const guardarComunicado = async () => {
    const nuevo: Comunicado = {
      ...draftComunicado,
      id: `local-${Date.now()}`,
      fecha: new Date().toISOString(),
      imagen: draftComunicado.imagen || imagenesEducativas[0],
    };

    try {
      await api.post('/contenido', {
        tipo: nuevo.tipo,
        titulo: nuevo.titulo,
        descripcion: nuevo.descripcion,
        imagen: nuevo.imagen || '',
        colegioId,
      });
      setToast('Comunicado publicado en el backend.');
      await cargarTodo();
    } catch (error) {
      const locales = [nuevo, ...getComunicadosLocales()];
      localStorage.setItem('colegio_comunicados_local', JSON.stringify(locales));
      setComunicados(mergeComunicados(locales, comunicados, []));
      setToast('Comunicado guardado localmente. Para publicarlo en backend, inicia sesión con token válido.');
    }

    setShowComunicadoModal(false);
  };

  const guardarEventoAgenda = () => {
    const nuevo = {
      ...draftAgenda,
      id: `agenda-${Date.now()}`,
    };

    const locales = [nuevo, ...getAgendaLocal()];
    localStorage.setItem('colegio_agenda_local', JSON.stringify(locales));
    setAgenda([nuevo, ...agenda]);
    setShowAgendaModal(false);
    setToast('Evento agregado a la agenda.');
  };

  const exportarCSV = () => {
    const filas = [
      ['Indicador', 'Valor'],
      ['Estudiantes', cards.estudiantes || 0],
      ['Docentes', cards.docentes || 0],
      ['Cursos', cards.cursos || 0],
      ['Promedio', Number(cards.promedioNotas || 0).toFixed(1)],
      ['Pagos pagados', cards.pagosPagados || 0],
      ['Pagos pendientes', cards.pagosPendientes || pagosPendientes.length],
      ['Monto pagado', Number(cards.montoPagado || 0).toFixed(2)],
      ['Monto pendiente', Number(cards.montoPendiente || montoPendiente).toFixed(2)],
    ];
    descargarArchivo('reporte-colegio-saas.csv', filas.map((row) => row.join(',')).join('\n'));
    setToast('Reporte CSV generado.');
  };

  const cerrarBienvenida = () => {
    localStorage.setItem('colegio_portal_welcome_closed', '1');
    setShowWelcome(false);
  };

  return (
    <div className="rescue-page">
      <aside className="rescue-sidebar">
        <div className="rescue-brand">
          <div className="rescue-logo">CS</div>
          <div>
            <h2>Colegio SaaS</h2>
            <p>Portal institucional</p>
          </div>
        </div>

        <nav className="rescue-menu">
          {menu.map((item) => (
            <button
              key={item.key}
              className={activeTab === item.key ? 'active' : ''}
              onClick={() => setActiveTab(item.key)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="rescue-user">
          <b>Admin Colegio</b>
          <span>Gestión académica</span>
        </div>
      </aside>

      <main className="rescue-main">
        <header className="rescue-header">
          <div>
            <span>Hoy · Portal educativo</span>
            <h1>Colegio SaaS</h1>
            <p>Noticias, datos institucionales, pagos, comunicados, agenda y reportes en una vista viva.</p>
          </div>

          <div className="header-actions">
            <button className="secondary-btn" onClick={() => abrirNuevoComunicado('comunicado institucional')}>
              + Comunicado
            </button>
            <button onClick={cargarTodo}>{loading ? 'Actualizando...' : 'Actualizar'}</button>
          </div>
        </header>

        {toast && (
          <div className="toast">
            <span>{toast}</span>
            <button onClick={() => setToast('')}>×</button>
          </div>
        )}

        {activeTab === 'inicio' && (
          <>
            <NewsHero noticias={noticias} abrirNoticia={abrirNoticia} />

            <PortalApps setActiveTab={setActiveTab} abrirNuevoComunicado={abrirNuevoComunicado} />

            <section className="rescue-grid">
              <Card title="Estudiantes" value={cards.estudiantes || 0} text="Activos en plataforma" icon="🎓" />
              <Card title="Docentes" value={cards.docentes || 0} text="Equipo académico" icon="👩‍🏫" />
              <Card title="Promedio" value={Number(cards.promedioNotas || 0).toFixed(1)} text="Rendimiento general" icon="⭐" />
              <Card title="Pendiente" value={`S/ ${Number(cards.montoPendiente || montoPendiente).toFixed(2)}`} text="Por regularizar" icon="💳" />
            </section>

            <section className="portal-split">
              <DatosBasicos cards={cards} />
              <Notificaciones alertas={alertas} setActiveTab={setActiveTab} />
            </section>

            <section className="home-split">
              <HorarioPanel horarios={horariosBase} />
              <AgendaMini agenda={agenda} setActiveTab={setActiveTab} />
            </section>

            <ComunicadosMini comunicados={comunicados} setActiveTab={setActiveTab} setSelectedComunicado={setSelectedComunicado} />
          </>
        )}

        {activeTab === 'perfil' && <PerfilView cards={cards} horarios={horariosBase} alertas={alertas} />}

        {activeTab === 'noticias' && <NoticiasView noticias={noticias} abrirNoticia={abrirNoticia} />}

        {activeTab === 'pagos' && (
          <PagosView
            pagos={pagosFiltrados}
            totalPagos={pagos.length}
            searchPago={searchPago}
            setSearchPago={setSearchPago}
            estadoPago={estadoPago}
            setEstadoPago={setEstadoPago}
            marcarPagado={marcarPagado}
            copiarRecordatorioPago={copiarRecordatorioPago}
          />
        )}

        {activeTab === 'comunicados' && (
          <ComunicadosView
            comunicados={comunicados}
            abrirNuevoComunicado={abrirNuevoComunicado}
            setSelectedComunicado={setSelectedComunicado}
          />
        )}

        {activeTab === 'agenda' && (
          <AgendaView agenda={agenda} setShowAgendaModal={setShowAgendaModal} setDraftAgenda={setDraftAgenda} />
        )}

        {activeTab === 'reportes' && (
          <ReportesView cards={cards} pagos={pagos} comunicados={comunicados} agenda={agenda} exportarCSV={exportarCSV} />
        )}
      </main>

      {showWelcome && (
        <WelcomeModal
          noticias={noticias}
          agenda={agenda}
          pagosPendientes={pagosPendientes.length}
          comunicados={comunicados}
          onClose={cerrarBienvenida}
          onGo={setActiveTab}
        />
      )}

      {selectedComunicado && (
        <ComunicadoModal
          comunicado={selectedComunicado}
          onClose={() => setSelectedComunicado(null)}
          abrirNuevoComunicado={abrirNuevoComunicado}
        />
      )}

      {showComunicadoModal && (
        <NuevoComunicadoModal
          draft={draftComunicado}
          setDraft={setDraftComunicado}
          onClose={() => setShowComunicadoModal(false)}
          onSave={guardarComunicado}
        />
      )}

      {showAgendaModal && (
        <NuevoAgendaModal
          draft={draftAgenda}
          setDraft={setDraftAgenda}
          onClose={() => setShowAgendaModal(false)}
          onSave={guardarEventoAgenda}
        />
      )}
    </div>
  );
}

function NewsHero({ noticias, abrirNoticia }: any) {
  const principal = noticias[0] || fallbackNews[0];
  const secundarias = noticias.slice(1, 4);

  return (
    <section className="rescue-hero-news">
      <button className="rescue-main-news" onClick={() => abrirNoticia(principal)}>
        <img src={principal.image || imagenesEducativas[0]} alt="Noticia educativa" onError={(e) => (e.currentTarget.src = imagenesEducativas[0])} />
        <div>
          <span>{principal.source || 'Radar Educativo'}</span>
          <h2>{limpiar(principal.title)}</h2>
          <p>{limpiar(principal.description)}</p>
          <small>{fecha(principal.pubDate)} · Leer noticia</small>
        </div>
      </button>

      <div className="rescue-side-news">
        {secundarias.map((item: any, index: number) => (
          <button key={`${item.title}-${index}`} onClick={() => abrirNoticia(item)}>
            <img src={item.image || imagenesEducativas[index % imagenesEducativas.length]} alt="Noticia educativa" onError={(e) => (e.currentTarget.src = imagenesEducativas[index % imagenesEducativas.length])} />
            <div>
              <strong>{limpiar(item.title)}</strong>
              <span>{item.source || 'Fuente educativa'} · {fecha(item.pubDate)}</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

function PortalApps({ setActiveTab, abrirNuevoComunicado }: any) {
  const apps = [
    { icon: '📅', title: 'Calendario', text: 'Agenda escolar', action: () => setActiveTab('agenda') },
    { icon: '💳', title: 'Pagos', text: 'Estado financiero', action: () => setActiveTab('pagos') },
    { icon: '📣', title: 'Comunicados', text: 'Avisos institucionales', action: () => setActiveTab('comunicados') },
    { icon: '📝', title: 'Nuevo aviso', text: 'Publicación rápida', action: () => abrirNuevoComunicado('aviso rápido') },
    { icon: '📰', title: 'Noticias', text: 'Actualidad educativa', action: () => setActiveTab('noticias') },
    { icon: '📊', title: 'Reportes', text: 'Indicadores', action: () => setActiveTab('reportes') },
    { icon: '🏫', title: 'Perfil', text: 'Datos básicos', action: () => setActiveTab('perfil') },
    { icon: '🎒', title: 'Horario', text: 'Clases de la semana', action: () => setActiveTab('perfil') },
  ];

  return (
    <section className="portal-apps">
      {apps.map((app) => (
        <button key={app.title} onClick={app.action}>
          <b>{app.icon}</b>
          <span>{app.title}</span>
          <small>{app.text}</small>
        </button>
      ))}
    </section>
  );
}

function DatosBasicos({ cards }: any) {
  return (
    <section className="datos-basicos">
      <div className="profile-avatar">
        <div>CS</div>
        <b></b>
      </div>

      <h2>Colegio SaaS</h2>
      <p>Código institucional: 2026-001</p>

      <div className="profile-icons">
        <span>📅</span>
        <span>📧</span>
        <span>📁</span>
        <span>📊</span>
        <span>🔔</span>
      </div>

      <div className="basic-list">
        <p><b>Estado:</b> Activo</p>
        <p><b>Gestión:</b> Académica y administrativa</p>
        <p><b>Estudiantes:</b> {cards.estudiantes || 0}</p>
        <p><b>Docentes:</b> {cards.docentes || 0}</p>
      </div>
    </section>
  );
}

function Notificaciones({ alertas, setActiveTab }: any) {
  return (
    <section className="notificaciones-panel">
      <div className="mini-title">
        <div>
          <span>Acción obligatoria</span>
          <h3>Notificaciones importantes</h3>
        </div>
      </div>

      <div className="notification-list">
        {alertas.map((alerta: any) => (
          <button key={alerta.titulo} onClick={() => setActiveTab(alerta.tab)}>
            <b>{alerta.icono}</b>
            <div>
              <strong>{alerta.titulo}</strong>
              <span>{alerta.detalle}</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

function HorarioPanel({ horarios }: any) {
  return (
    <section className="mini-panel">
      <div className="mini-title">
        <div>
          <span>Horario</span>
          <h3>Mi horario semanal</h3>
        </div>
      </div>

      <div className="schedule-strip">
        {['L', 'M', 'M', 'J', 'V'].map((dia, index) => (
          <div className={index === 0 ? 'active' : ''} key={`${dia}-${index}`}>
            <b>{dia}</b>
            <span>{29 + index}</span>
          </div>
        ))}
      </div>

      <div className="horario-list">
        {horarios.slice(0, 3).map((item: any) => (
          <article key={`${item.dia}-${item.curso}`}>
            <b>{item.hora}</b>
            <div>
              <strong>{item.curso}</strong>
              <span>{item.dia} · {item.aula}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function PerfilView({ cards, horarios, alertas }: any) {
  return (
    <section className="perfil-grid">
      <DatosBasicos cards={cards} />
      <HorarioPanel horarios={horarios} />
      <Notificaciones alertas={alertas} setActiveTab={() => {}} />
    </section>
  );
}

function NoticiasView({ noticias, abrirNoticia }: any) {
  return (
    <section className="rescue-panel">
      <div className="rescue-panel-title">
        <span>Noticias educativas</span>
        <h2>Actualidad para la comunidad escolar</h2>
        <p>Haz clic en una noticia para abrir la fuente o una búsqueda educativa relacionada.</p>
      </div>

      <div className="rescue-news-grid">
        {noticias.map((item: any, index: number) => (
          <button key={`${item.title}-${index}`} onClick={() => abrirNoticia(item)}>
            <img src={item.image || imagenesEducativas[index % imagenesEducativas.length]} alt="Noticia educativa" onError={(e) => (e.currentTarget.src = imagenesEducativas[index % imagenesEducativas.length])} />
            <div>
              <span>{item.source || 'Educación'}</span>
              <h3>{limpiar(item.title)}</h3>
              <p>{limpiar(item.description)}</p>
              <small>{fecha(item.pubDate)} · Leer</small>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

function PagosView({
  pagos,
  totalPagos,
  searchPago,
  setSearchPago,
  estadoPago,
  setEstadoPago,
  marcarPagado,
  copiarRecordatorioPago,
}: any) {
  return (
    <section className="rescue-panel">
      <div className="rescue-panel-title with-actions">
        <div>
          <span>Finanzas</span>
          <h2>Gestión de pagos</h2>
          <p>{pagos.length} de {totalPagos} registros encontrados.</p>
        </div>
        <button className="secondary-btn" onClick={() => copiarRecordatorioPago()}>
          Copiar recordatorio general
        </button>
      </div>

      <div className="filter-bar">
        <input value={searchPago} onChange={(e) => setSearchPago(e.target.value)} placeholder="Buscar por estudiante, concepto o estado..." />
        <select value={estadoPago} onChange={(e) => setEstadoPago(e.target.value)}>
          <option value="">Todos los estados</option>
          <option value="PENDIENTE">Pendiente</option>
          <option value="PAGADO">Pagado</option>
        </select>
      </div>

      <div className="rescue-table-wrap">
        <table className="rescue-table">
          <thead>
            <tr>
              <th>Concepto</th>
              <th>Estudiante</th>
              <th>Monto</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {pagos.map((pago: any) => (
              <tr key={pago.id}>
                <td>{pago.concepto}</td>
                <td>{pago.estudiante?.nombres} {pago.estudiante?.apellidos}</td>
                <td>S/ {Number(pago.monto || 0).toFixed(2)}</td>
                <td>
                  <span className={`pill ${pago.estado === 'PAGADO' ? 'paid' : 'pending'}`}>
                    {pago.estado}
                  </span>
                </td>
                <td>
                  <div className="table-actions">
                    {pago.estado === 'PENDIENTE' ? (
                      <button className="small-action" onClick={() => marcarPagado(pago)}>
                        Marcar pagado
                      </button>
                    ) : (
                      <span className="pill paid">Confirmado</span>
                    )}
                    <button className="small-action ghost" onClick={() => copiarRecordatorioPago(pago)}>
                      Copiar aviso
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ComunicadosView({ comunicados, abrirNuevoComunicado, setSelectedComunicado }: any) {
  return (
    <section className="rescue-panel">
      <div className="rescue-panel-title with-actions">
        <div>
          <span>Comunicación</span>
          <h2>Comunicados institucionales</h2>
          <p>Información viva para padres, estudiantes y docentes.</p>
        </div>
        <div className="panel-actions">
          <button className="secondary-btn" onClick={() => abrirNuevoComunicado('fiestas patrias')}>Fiestas Patrias</button>
          <button onClick={() => abrirNuevoComunicado('general')}>+ Nuevo</button>
        </div>
      </div>

      <div className="rescue-comunicados-grid alive">
        {comunicados.map((item: Comunicado, index: number) => (
          <article key={item.id} onClick={() => setSelectedComunicado(item)}>
            <img src={item.imagen || imagenesEducativas[index % imagenesEducativas.length]} alt="Comunicado" onError={(e) => (e.currentTarget.src = imagenesEducativas[index % imagenesEducativas.length])} />
            <div>
              <div className="card-topline">
                <span>{item.tipo}</span>
                <b className={`priority ${(item.prioridad || 'NORMAL').toLowerCase()}`}>{item.prioridad || 'NORMAL'}</b>
              </div>
              <h3>{limpiar(item.titulo)}</h3>
              <p>{limpiar(item.descripcion)}</p>
              <small>{item.audiencia || 'Comunidad educativa'} · Ver detalle</small>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function AgendaView({ agenda, setShowAgendaModal, setDraftAgenda }: any) {
  return (
    <section className="rescue-panel">
      <div className="rescue-panel-title with-actions">
        <div>
          <span>Agenda escolar</span>
          <h2>Calendario institucional</h2>
          <p>Actividades, evaluaciones, reuniones y recordatorios importantes.</p>
        </div>
        <button
          onClick={() => {
            setDraftAgenda({
              id: '',
              titulo: '',
              descripcion: '',
              fecha: proximaFecha(1),
              hora: '08:00',
              tipo: 'Académico',
              lugar: 'Colegio',
            });
            setShowAgendaModal(true);
          }}
        >
          + Agendar
        </button>
      </div>

      <div className="agenda-timeline">
        {agenda.map((item: AgendaItem) => (
          <article key={item.id}>
            <div className="agenda-date">
              <b>{new Date(item.fecha).getDate()}</b>
              <span>{new Date(item.fecha).toLocaleDateString('es-PE', { month: 'short' })}</span>
            </div>
            <div>
              <span>{item.tipo} · {item.hora}</span>
              <h3>{item.titulo}</h3>
              <p>{item.descripcion}</p>
              <small>{item.lugar}</small>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ReportesView({ cards, pagos, comunicados, agenda, exportarCSV }: any) {
  const pagados = pagos.filter((p: any) => p.estado === 'PAGADO').length;
  const pendientes = pagos.filter((p: any) => p.estado === 'PENDIENTE').length;
  const total = Math.max(pagos.length, 1);
  const avancePagos = Math.round((pagados / total) * 100);
  const actividad = Math.min(100, comunicados.length * 18 + agenda.length * 8);

  return (
    <section className="rescue-panel">
      <div className="rescue-panel-title with-actions">
        <div>
          <span>Reportes</span>
          <h2>Resumen ejecutivo</h2>
          <p>Indicadores para presentar avance académico, financiero y comunicacional.</p>
        </div>
        <div className="panel-actions">
          <button className="secondary-btn" onClick={() => window.print()}>Imprimir</button>
          <button onClick={exportarCSV}>Exportar CSV</button>
        </div>
      </div>

      <div className="report-grid">
        <ReportCard title="Rendimiento" value={Number(cards.promedioNotas || 0).toFixed(1)} label="Promedio académico" percent={Math.min(100, Number(cards.promedioNotas || 0) * 5)} />
        <ReportCard title="Pagos" value={`${avancePagos}%`} label={`${pagados} pagados / ${pendientes} pendientes`} percent={avancePagos} />
        <ReportCard title="Comunicación" value={comunicados.length} label="Comunicados activos" percent={Math.min(100, comunicados.length * 20)} />
        <ReportCard title="Agenda" value={agenda.length} label="Eventos registrados" percent={actividad} />
      </div>

      <div className="executive-note">
        <h3>Lectura rápida para dirección</h3>
        <p>
          El portal muestra actividad académica y administrativa activa. Se recomienda priorizar pagos pendientes,
          reforzar comunicados importantes y mantener la agenda escolar actualizada para mejorar la comunicación con familias.
        </p>
      </div>
    </section>
  );
}

function ReportCard({ title, value, label, percent }: any) {
  return (
    <article className="report-card">
      <span>{title}</span>
      <h3>{value}</h3>
      <p>{label}</p>
      <div className="bar"><div style={{ width: `${percent}%` }}></div></div>
    </article>
  );
}

function AgendaMini({ agenda, setActiveTab }: any) {
  return (
    <section className="mini-panel">
      <div className="mini-title">
        <div>
          <span>Agenda</span>
          <h3>Próximas actividades</h3>
        </div>
        <button onClick={() => setActiveTab('agenda')}>Ver todo</button>
      </div>

      {agenda.slice(0, 3).map((item: AgendaItem) => (
        <div className="mini-row" key={item.id}>
          <b>{new Date(item.fecha).getDate()}</b>
          <div>
            <strong>{item.titulo}</strong>
            <span>{item.tipo} · {item.hora}</span>
          </div>
        </div>
      ))}
    </section>
  );
}

function ComunicadosMini({ comunicados, setActiveTab, setSelectedComunicado }: any) {
  return (
    <section className="mini-panel full">
      <div className="mini-title">
        <div>
          <span>Comunicación</span>
          <h3>Comunicados destacados</h3>
        </div>
        <button onClick={() => setActiveTab('comunicados')}>Ver todo</button>
      </div>

      <div className="mini-comunicados-grid">
        {comunicados.slice(0, 3).map((item: Comunicado) => (
          <button className="mini-comunicado" key={item.id} onClick={() => setSelectedComunicado(item)}>
            <img src={item.imagen || imagenesEducativas[0]} alt="Comunicado" />
            <div>
              <strong>{item.titulo}</strong>
              <span>{item.tipo} · {item.prioridad || 'NORMAL'}</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

function WelcomeModal({ noticias, agenda, pagosPendientes, comunicados, onClose, onGo }: any) {
  const noticia = noticias[0] || fallbackNews[0];
  const evento = agenda[0];
  const comunicado = comunicados[0];

  return (
    <div className="modal-backdrop welcome-backdrop">
      <article className="welcome-modal">
        <button className="modal-x" onClick={onClose}>×</button>

        <div className="welcome-topbar">
          <span>Noticias institucionales</span>
        </div>

        <div className="welcome-banner">
          <img src={comunicado?.imagen || noticia.image || imagenesEducativas[0]} alt="Bienvenida" />
          <div>
            <span>Bienvenido de nuevo</span>
            <h2>{comunicado?.titulo || 'Tu colegio tiene novedades'}</h2>
            <p>{comunicado?.descripcion || 'Revisa noticias educativas, pagos pendientes, agenda institucional y comunicados prioritarios.'}</p>
          </div>
        </div>

        <div className="welcome-grid">
          <button onClick={() => { onGo('noticias'); onClose(); }}>
            <b>Noticias</b>
            <span>{limpiar(noticia.title)}</span>
          </button>
          <button onClick={() => { onGo('agenda'); onClose(); }}>
            <b>Agenda</b>
            <span>{evento ? `${evento.titulo} · ${fecha(evento.fecha)}` : 'No hay eventos próximos'}</span>
          </button>
          <button onClick={() => { onGo('pagos'); onClose(); }}>
            <b>Pagos</b>
            <span>{pagosPendientes} pendiente(s) por revisar</span>
          </button>
          <button onClick={() => { onGo('comunicados'); onClose(); }}>
            <b>Comunicados</b>
            <span>Ver avisos institucionales</span>
          </button>
        </div>

        <div className="welcome-dots">
          <b></b>
          <b></b>
          <b></b>
        </div>
      </article>
    </div>
  );
}

function Card({ title, value, text, icon }: any) {
  return (
    <div className="rescue-card">
      <div className="card-icon">{icon}</div>
      <span>{title}</span>
      <h3>{value}</h3>
      <p>{text}</p>
    </div>
  );
}

function ComunicadoModal({ comunicado, onClose, abrirNuevoComunicado }: any) {
  return (
    <div className="modal-backdrop">
      <article className="detail-modal">
        <button className="modal-x" onClick={onClose}>×</button>
        <img src={comunicado.imagen || imagenesEducativas[0]} alt="Comunicado" />
        <div className="detail-body">
          <span>{comunicado.tipo}</span>
          <h2>{comunicado.titulo}</h2>
          <p>{comunicado.descripcion}</p>
          <div className="detail-meta">
            <b>Prioridad: {comunicado.prioridad || 'NORMAL'}</b>
            <b>Audiencia: {comunicado.audiencia || 'Comunidad educativa'}</b>
          </div>
          <button onClick={() => abrirNuevoComunicado(comunicado.titulo)}>Crear aviso relacionado</button>
        </div>
      </article>
    </div>
  );
}

function NuevoComunicadoModal({ draft, setDraft, onClose, onSave }: any) {
  return (
    <div className="modal-backdrop">
      <article className="form-modal">
        <button className="modal-x" onClick={onClose}>×</button>
        <span>Nuevo comunicado</span>
        <h2>Publicación institucional</h2>

        <div className="modal-form">
          <label>
            Tipo
            <select value={draft.tipo} onChange={(e) => setDraft({ ...draft, tipo: e.target.value })}>
              <option>COMUNICADO</option>
              <option>EVENTO</option>
              <option>NOTICIA</option>
              <option>URGENTE</option>
            </select>
          </label>

          <label>
            Prioridad
            <select value={draft.prioridad} onChange={(e) => setDraft({ ...draft, prioridad: e.target.value })}>
              <option>NORMAL</option>
              <option>MEDIA</option>
              <option>ALTA</option>
            </select>
          </label>

          <label className="full">
            Título
            <input value={draft.titulo} onChange={(e) => setDraft({ ...draft, titulo: e.target.value })} />
          </label>

          <label className="full">
            Descripción
            <textarea value={draft.descripcion} onChange={(e) => setDraft({ ...draft, descripcion: e.target.value })} />
          </label>

          <label>
            Audiencia
            <input value={draft.audiencia || ''} onChange={(e) => setDraft({ ...draft, audiencia: e.target.value })} />
          </label>

          <label>
            Imagen URL
            <input value={draft.imagen || ''} onChange={(e) => setDraft({ ...draft, imagen: e.target.value })} />
          </label>
        </div>

        <div className="modal-actions">
          <button className="secondary-btn" onClick={onClose}>Cancelar</button>
          <button onClick={onSave}>Guardar</button>
        </div>
      </article>
    </div>
  );
}

function NuevoAgendaModal({ draft, setDraft, onClose, onSave }: any) {
  return (
    <div className="modal-backdrop">
      <article className="form-modal">
        <button className="modal-x" onClick={onClose}>×</button>
        <span>Agenda escolar</span>
        <h2>Nuevo evento</h2>

        <div className="modal-form">
          <label className="full">
            Título
            <input value={draft.titulo} onChange={(e) => setDraft({ ...draft, titulo: e.target.value })} />
          </label>

          <label>
            Fecha
            <input type="date" value={draft.fecha} onChange={(e) => setDraft({ ...draft, fecha: e.target.value })} />
          </label>

          <label>
            Hora
            <input type="time" value={draft.hora} onChange={(e) => setDraft({ ...draft, hora: e.target.value })} />
          </label>

          <label>
            Tipo
            <select value={draft.tipo} onChange={(e) => setDraft({ ...draft, tipo: e.target.value })}>
              <option>Académico</option>
              <option>Evaluación</option>
              <option>Evento</option>
              <option>Reunión</option>
              <option>Administrativo</option>
            </select>
          </label>

          <label>
            Lugar
            <input value={draft.lugar} onChange={(e) => setDraft({ ...draft, lugar: e.target.value })} />
          </label>

          <label className="full">
            Descripción
            <textarea value={draft.descripcion} onChange={(e) => setDraft({ ...draft, descripcion: e.target.value })} />
          </label>
        </div>

        <div className="modal-actions">
          <button className="secondary-btn" onClick={onClose}>Cancelar</button>
          <button onClick={onSave}>Guardar evento</button>
        </div>
      </article>
    </div>
  );
}

function crearAlertas(cards: any, pagosPendientes: number, agenda: AgendaItem[], comunicados: Comunicado[]) {
  return [
    {
      icono: '💳',
      titulo: 'Pagos por revisar',
      detalle: `${pagosPendientes || cards?.pagosPendientes || 0} pendiente(s) requieren seguimiento.`,
      tab: 'pagos',
    },
    {
      icono: '📅',
      titulo: 'Actividad próxima',
      detalle: agenda[0] ? `${agenda[0].titulo} · ${fecha(agenda[0].fecha)}` : 'No hay eventos próximos.',
      tab: 'agenda',
    },
    {
      icono: '📣',
      titulo: 'Comunicado prioritario',
      detalle: comunicados[0]?.titulo || 'Publica un aviso institucional.',
      tab: 'comunicados',
    },
    {
      icono: '📊',
      titulo: 'Reporte ejecutivo',
      detalle: `Promedio académico: ${Number(cards?.promedioNotas || 0).toFixed(1)}`,
      tab: 'reportes',
    },
  ];
}

function generarComunicado(tema: string, cards: any) {
  const t = tema.toLowerCase();

  if (t.includes('fiestas') || t.includes('patrias')) {
    return {
      tipo: 'COMUNICADO',
      titulo: 'Actividades por Fiestas Patrias',
      descripcion:
        'Estimadas familias, informamos que se realizarán actividades institucionales por Fiestas Patrias. Se recomienda revisar el horario especial, uniforme correspondiente, participación por grados y acompañar los ensayos programados.',
      prioridad: 'ALTA' as const,
      audiencia: 'Familias y estudiantes',
      imagen: imagenesEducativas[0],
    };
  }

  if (t.includes('pago')) {
    return {
      tipo: 'COMUNICADO',
      titulo: 'Recordatorio de pagos escolares',
      descripcion:
        `Estimadas familias, recordamos revisar los pagos pendientes en el panel institucional. Actualmente existen ${cards?.pagosPendientes || 0} registro(s) por regularizar. Agradecemos su compromiso con la institución.`,
      prioridad: 'MEDIA' as const,
      audiencia: 'Padres de familia',
      imagen: imagenesEducativas[1],
    };
  }

  if (t.includes('parcial') || t.includes('evaluacion') || t.includes('evaluación')) {
    return {
      tipo: 'COMUNICADO',
      titulo: 'Inicio de evaluaciones parciales',
      descripcion:
        'Se comunica a las familias que inicia la semana de evaluaciones parciales. Recomendamos revisar el cronograma por curso, preparar materiales y acompañar a los estudiantes en sus hábitos de estudio.',
      prioridad: 'ALTA' as const,
      audiencia: 'Familias y estudiantes',
      imagen: imagenesEducativas[2],
    };
  }

  return {
    tipo: 'COMUNICADO',
    titulo: 'Información institucional importante',
    descripcion:
      'Estimadas familias, compartimos información relevante para la organización académica de la semana. Les recomendamos revisar horarios, comunicados, pagos pendientes y actividades programadas.',
    prioridad: 'NORMAL' as const,
    audiencia: 'Comunidad educativa',
    imagen: imagenesEducativas[4],
  };
}

function normalizarComunicados(items: any[]): Comunicado[] {
  return items.map((item, index) => ({
    id: item.id,
    tipo: item.tipo || 'COMUNICADO',
    titulo: limpiar(item.titulo || 'Comunicado institucional'),
    descripcion: limpiar(item.descripcion || 'Información institucional relevante.'),
    imagen: item.imagen || imagenesEducativas[index % imagenesEducativas.length],
    prioridad: index === 0 ? 'ALTA' : 'NORMAL',
    fecha: item.createdAt || new Date().toISOString(),
    audiencia: 'Comunidad educativa',
  }));
}

function mergeComunicados(...listas: Comunicado[][]) {
  const map = new Map<string, Comunicado>();

  listas.flat().forEach((item) => {
    const key = `${item.titulo}-${item.descripcion}`.toLowerCase();
    if (!map.has(key)) map.set(key, item);
  });

  return Array.from(map.values());
}

function getComunicadosLocales() {
  try {
    return JSON.parse(localStorage.getItem('colegio_comunicados_local') || '[]');
  } catch {
    return [];
  }
}

function getAgendaLocal() {
  try {
    return JSON.parse(localStorage.getItem('colegio_agenda_local') || '[]');
  } catch {
    return [];
  }
}

function descargarArchivo(nombre: string, contenido: string) {
  const blob = new Blob([contenido], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = nombre;
  link.click();
  URL.revokeObjectURL(url);
}

function limpiar(value?: string) {
  return String(value || '')
    .replace(/Ã¡/g, 'á')
    .replace(/Ã©/g, 'é')
    .replace(/Ã­/g, 'í')
    .replace(/Ã³/g, 'ó')
    .replace(/Ãº/g, 'ú')
    .replace(/Ã±/g, 'ñ')
    .replace(/a�o/g, 'año')
    .replace(/A�o/g, 'Año')
    .replace(/ni�o/g, 'niño')
    .replace(/Ni�o/g, 'Niño')
    .replace(/�/g, 'ñ');
}

function fecha(value?: string) {
  const date = value ? new Date(value) : new Date();

  if (Number.isNaN(date.getTime())) return 'Reciente';

  return date.toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function proximaFecha(dias: number) {
  const date = new Date();
  date.setDate(date.getDate() + dias);
  return date.toISOString().slice(0, 10);
}
