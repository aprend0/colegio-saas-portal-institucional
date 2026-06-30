import { useEffect, useMemo, useState } from 'react';
import api from '../../services/api';
import './PanelColegioWarm.css';
import EduIntelligencePanel from './EduIntelligencePanel';
import SmartNoticeModal from './SmartNoticeModal';

type ActiveTab =
  | 'dashboard'
  | 'estudiantes'
  | 'pagos'
  | 'notas'
  | 'asistencias'
  | 'horarios'
  | 'contenido';

type CreateTab = Exclude<ActiveTab, 'dashboard'>;

type DashboardData = {
  colegio?: {
    nombre?: string;
  };
  cards?: any;
  ultimosComunicados?: any[];
  ultimosPagos?: any[];
};

const colegioId = 1;

const menu: { key: ActiveTab; label: string }[] = [
  { key: 'dashboard', label: 'Panel general' },
  { key: 'estudiantes', label: 'Estudiantes' },
  { key: 'pagos', label: 'Pagos' },
  { key: 'notas', label: 'Notas' },
  { key: 'asistencias', label: 'Asistencias' },
  { key: 'horarios', label: 'Horarios' },
  { key: 'contenido', label: 'Comunicados' },
];

export default function PanelColegioWarm() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [createTab, setCreateTab] = useState<CreateTab>('estudiantes');
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<Record<string, any>>({});
  const [search, setSearch] = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    cargarDashboard();
  }, []);

  useEffect(() => {
    if (activeTab === 'dashboard') return;
    cargarSeccion(activeTab);
  }, [activeTab]);

  const cargarDashboard = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/panel-colegio/${colegioId}/dashboard`);
      setDashboard(response.data);
    } catch (error) {
      console.error('Error cargando dashboard', error);
    } finally {
      setLoading(false);
    }
  };

  const cargarSeccion = async (tab: ActiveTab) => {
    const endpoints: Record<string, string> = {
      estudiantes: `/panel-colegio/${colegioId}/estudiantes`,
      pagos: `/panel-colegio/${colegioId}/pagos`,
      notas: `/panel-colegio/${colegioId}/notas`,
      asistencias: `/panel-colegio/${colegioId}/asistencias`,
      horarios: `/panel-colegio/${colegioId}/horarios`,
      contenido: `/panel-colegio/${colegioId}/contenido`,
    };

    try {
      setLoading(true);
      setMessage('');
      const response = await api.get(endpoints[tab]);
      setItems(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error cargando sección', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const abrirModal = (tab?: CreateTab) => {
    const targetTab: CreateTab =
      tab || (activeTab === 'dashboard' ? 'estudiantes' : activeTab);

    setCreateTab(targetTab);
    setForm(getInitialForm(targetTab));
    setModalOpen(true);
    setMessage('');
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setForm({});
  };

  const actualizarCampo = (name: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const guardarRegistro = async () => {
    try {
      setSaving(true);
      setMessage('');

      const { endpoint, body } = buildPayload(createTab, form);

      await api.post(endpoint, body);

      setMessage('Registro creado correctamente.');
      cerrarModal();

      if (activeTab === 'dashboard') {
        await cargarDashboard();
      } else {
        await cargarSeccion(activeTab);
        await cargarDashboard();
      }
    } catch (error: any) {
      console.error('Error guardando', error);

      if (error?.response?.status === 401) {
        setMessage('No autorizado. Inicia sesión nuevamente para guardar.');
      } else {
        setMessage('No se pudo guardar. Revisa los datos obligatorios.');
      }
    } finally {
      setSaving(false);
    }
  };

  const filteredItems = useMemo(() => {
    let result = items;

    if (search.trim()) {
      const term = search.toLowerCase();
      result = result.filter((item) =>
        JSON.stringify(item).toLowerCase().includes(term),
      );
    }

    if (filterEstado && activeTab === 'pagos') {
      result = result.filter((item) => item.estado === filterEstado);
    }

    return result;
  }, [items, search, filterEstado, activeTab]);

  const cards = dashboard?.cards || {};

  return (
    <div className="warm-page">
      <aside className="warm-sidebar">
        <div className="warm-brand">
          <div className="warm-logo">CS</div>
          <div>
            <h2>Colegio SaaS</h2>
            <p>Panel institucional</p>
          </div>
        </div>

        <nav className="warm-nav">
          {menu.map((item) => (
            <button
              key={item.key}
              className={activeTab === item.key ? 'active' : ''}
              onClick={() => {
                setActiveTab(item.key);
                setSearch('');
                setFilterEstado('');
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="warm-user">
          <div className="warm-avatar">AD</div>
          <div>
            <strong>Admin Colegio</strong>
            <span>Gestión académica</span>
          </div>
        </div>
      </aside>

      <main className="warm-main">
        <header className="warm-header">
          <div>
            <span className="warm-eyebrow">Hoy · Gestión educativa</span>
            <h1>{dashboard?.colegio?.nombre || 'Mi Colegio de Prueba'}</h1>
            <p>
              Gestiona estudiantes, pagos, notas, asistencias, horarios y comunicados desde una interfaz cálida y moderna.
            </p>
          </div>

          <div className="warm-actions">
            <button
              className="ghost-btn"
              onClick={() => {
                if (activeTab === 'dashboard') cargarDashboard();
                else cargarSeccion(activeTab);
              }}
            >
              Actualizar
            </button>

            <button className="primary-btn" onClick={() => abrirModal()}>
              + Agregar
            </button>
          </div>
        </header>

        {message && <div className="warm-alert">{message}</div>}

        {loading ? (
          <div className="warm-loading-box">
            <div className="warm-loader"></div>
            <p>Cargando información...</p>
          </div>
        ) : activeTab === 'dashboard' ? (
          <DashboardView data={dashboard} cards={cards} abrirModal={abrirModal} />
        ) : (
          <SectionView
            activeTab={activeTab}
            items={filteredItems}
            search={search}
            setSearch={setSearch}
            filterEstado={filterEstado}
            setFilterEstado={setFilterEstado}
            abrirModal={abrirModal}
          />
        )}

        <SmartNoticeModal
          colegioNombre={dashboard?.colegio?.nombre}
          comunicados={dashboard?.ultimosComunicados || []}
        />

        {modalOpen && (
          <CreateModal
            createTab={createTab}
            form={form}
            saving={saving}
            onChange={actualizarCampo}
            onClose={cerrarModal}
            onSave={guardarRegistro}
          />
        )}
      </main>
    </div>
  );
}

function DashboardView({ data, cards, abrirModal }: any) {
  return (
    <>
      <section className="warm-hero">
        <div className="hero-text">
          <span>Panel inteligente</span>
          <h2>Una vista clara para dirigir mejor tu institución.</h2>
          <p>
            Controla estudiantes, pagos, notas, asistencias y comunicados desde una interfaz humana, limpia y moderna.
          </p>

          <div className="hero-quick-actions">
            <button onClick={() => abrirModal('estudiantes')}>+ Estudiante</button>
            <button onClick={() => abrirModal('pagos')}>+ Pago</button>
            <button onClick={() => abrirModal('contenido')}>+ Comunicado</button>
          </div>
        </div>

        <div className="hero-card">
          <p>Recaudado</p>
          <h3>S/ {Number(cards.montoPagado || 0).toFixed(2)}</h3>
          <span>Pendiente: S/ {Number(cards.montoPendiente || 0).toFixed(2)}</span>
        </div>
      </section>

      <EduIntelligencePanel data={data} cards={cards} />

      <section className="warm-grid">
        <MetricCard title="Estudiantes" value={cards.estudiantes || 0} detail="Activos en plataforma" icon="🎓" />
        <MetricCard title="Docentes" value={cards.docentes || 0} detail="Equipo académico" icon="👩‍🏫" />
        <MetricCard title="Cursos" value={cards.cursos || 0} detail="Cursos registrados" icon="📚" />
        <MetricCard title="Matrículas" value={cards.matriculas || 0} detail="Matrículas activas" icon="📝" />
        <MetricCard title="Promedio" value={Number(cards.promedioNotas || 0).toFixed(1)} detail="Rendimiento académico" icon="⭐" />
        <MetricCard title="Pagos pagados" value={cards.pagosPagados || 0} detail="Pensiones canceladas" icon="💳" />
      </section>

      <section className="warm-content-grid">
        <div className="warm-panel">
          <div className="panel-title">
            <div>
              <span>Académico</span>
              <h3>Asistencia general</h3>
            </div>
            <strong>{cards.asistenciasPresentes || 0} presentes</strong>
          </div>

          <div className="attendance-box">
            <div>
              <p>Presentes</p>
              <h4>{cards.asistenciasPresentes || 0}</h4>
            </div>
            <div>
              <p>Faltas</p>
              <h4>{cards.asistenciasFaltas || 0}</h4>
            </div>
          </div>

          <div className="progress-wrap">
            <div className="progress-bar">
              <div style={{ width: `${calcularPorcentaje(cards.asistenciasPresentes, cards.asistenciasFaltas)}%` }}></div>
            </div>
            <small>{calcularPorcentaje(cards.asistenciasPresentes, cards.asistenciasFaltas)}% asistencia positiva</small>
          </div>
        </div>

        <div className="warm-panel">
          <div className="panel-title">
            <div>
              <span>Finanzas</span>
              <h3>Estado de pagos</h3>
            </div>
            <strong>S/ {Number(cards.montoPagado || 0).toFixed(2)}</strong>
          </div>

          <div className="payment-list">
            {(data?.ultimosPagos || []).length === 0 && <p className="empty">Aún no hay pagos recientes.</p>}

            {(data?.ultimosPagos || []).map((pago: any) => (
              <div className="payment-item" key={pago.id}>
                <div>
                  <strong>{pago.concepto}</strong>
                  <span>{pago.estudiante?.nombres} {pago.estudiante?.apellidos}</span>
                </div>
                <b className={pago.estado === 'PAGADO' ? 'paid' : 'pending'}>
                  {pago.estado}
                </b>
              </div>
            ))}
          </div>
        </div>

        <div className="warm-panel wide">
          <div className="panel-title">
            <div>
              <span>Comunicación</span>
              <h3>Últimos comunicados</h3>
            </div>
          </div>

          <div className="notice-grid">
            {(data?.ultimosComunicados || []).length === 0 && <p className="empty">Aún no hay comunicados publicados.</p>}

            {(data?.ultimosComunicados || []).map((item: any) => (
              <article className="notice-card" key={item.id}>
                <span>{item.tipo}</span>
                <h4>{item.titulo}</h4>
                <p>{item.descripcion}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function SectionView({
  activeTab,
  items,
  search,
  setSearch,
  filterEstado,
  setFilterEstado,
  abrirModal,
}: any) {
  const titleMap: Record<string, string> = {
    estudiantes: 'Estudiantes registrados',
    pagos: 'Gestión de pagos',
    notas: 'Notas y calificaciones',
    asistencias: 'Control de asistencias',
    horarios: 'Horarios académicos',
    contenido: 'Comunicados y noticias',
  };

  return (
    <section className="data-board">
      <div className="data-board-header">
        <div>
          <span>Gestión</span>
          <h2>{titleMap[activeTab]}</h2>
          <p>{items.length} registros encontrados</p>
        </div>

        <button className="primary-btn" onClick={() => abrirModal(activeTab)}>
          + Agregar
        </button>
      </div>

      <div className="warm-toolbar">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre, curso, concepto, estado..."
        />

        {activeTab === 'pagos' && (
          <select value={filterEstado} onChange={(e) => setFilterEstado(e.target.value)}>
            <option value="">Todos los estados</option>
            <option value="PENDIENTE">Pendiente</option>
            <option value="PAGADO">Pagado</option>
          </select>
        )}
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <h3>No hay registros todavía</h3>
          <p>Presiona el botón + Agregar para crear información nueva.</p>
        </div>
      ) : (
        renderTable(activeTab, items)
      )}
    </section>
  );
}

function CreateModal({ createTab, form, saving, onChange, onClose, onSave }: any) {
  const titleMap: Record<string, string> = {
    estudiantes: 'Nuevo estudiante',
    pagos: 'Nuevo pago',
    notas: 'Nueva nota',
    asistencias: 'Nueva asistencia',
    horarios: 'Nuevo horario',
    contenido: 'Nuevo comunicado',
  };

  return (
    <div className="modal-backdrop">
      <div className="warm-modal">
        <div className="warm-modal-header">
          <div>
            <span>Crear registro</span>
            <h2>{titleMap[createTab]}</h2>
          </div>

          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="warm-form">
          {renderFormFields(createTab, form, onChange)}
        </div>

        <div className="warm-modal-actions">
          <button className="ghost-btn" onClick={onClose}>Cancelar</button>
          <button className="primary-btn" onClick={onSave} disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
}

function renderFormFields(tab: CreateTab, form: any, onChange: any) {
  if (tab === 'estudiantes') {
    return (
      <>
        <Input label="Nombres" name="nombres" value={form.nombres} onChange={onChange} />
        <Input label="Apellidos" name="apellidos" value={form.apellidos} onChange={onChange} />
        <Input label="DNI" name="dni" value={form.dni} onChange={onChange} />
        <Input label="Teléfono" name="telefono" value={form.telefono} onChange={onChange} />
        <Input label="Dirección" name="direccion" value={form.direccion} onChange={onChange} />
        <Input label="Apoderado" name="apoderado" value={form.apoderado} onChange={onChange} />
        <Input label="Teléfono apoderado" name="telefonoApoderado" value={form.telefonoApoderado} onChange={onChange} />
        <Input label="Sección ID" name="seccionId" value={form.seccionId} onChange={onChange} type="number" />
      </>
    );
  }

  if (tab === 'pagos') {
    return (
      <>
        <Input label="Concepto" name="concepto" value={form.concepto} onChange={onChange} />
        <TextArea label="Descripción" name="descripcion" value={form.descripcion} onChange={onChange} />
        <Input label="Monto" name="monto" value={form.monto} onChange={onChange} type="number" />
        <Select label="Estado" name="estado" value={form.estado} onChange={onChange} options={['PENDIENTE', 'PAGADO']} />
        <Input label="Fecha vencimiento" name="fechaVencimiento" value={form.fechaVencimiento} onChange={onChange} type="date" />
        <Input label="Estudiante ID" name="estudianteId" value={form.estudianteId} onChange={onChange} type="number" />
      </>
    );
  }

  if (tab === 'notas') {
    return (
      <>
        <Input label="Periodo" name="periodo" value={form.periodo} onChange={onChange} />
        <Input label="Competencia" name="competencia" value={form.competencia} onChange={onChange} />
        <Input label="Calificación" name="calificacion" value={form.calificacion} onChange={onChange} type="number" />
        <TextArea label="Observación" name="observacion" value={form.observacion} onChange={onChange} />
        <Input label="Estudiante ID" name="estudianteId" value={form.estudianteId} onChange={onChange} type="number" />
        <Input label="Curso ID" name="cursoId" value={form.cursoId} onChange={onChange} type="number" />
      </>
    );
  }

  if (tab === 'asistencias') {
    return (
      <>
        <Input label="Fecha" name="fecha" value={form.fecha} onChange={onChange} type="date" />
        <Select label="Estado" name="estado" value={form.estado} onChange={onChange} options={['PRESENTE', 'FALTA', 'TARDANZA', 'JUSTIFICADO']} />
        <TextArea label="Observación" name="observacion" value={form.observacion} onChange={onChange} />
        <Input label="Estudiante ID" name="estudianteId" value={form.estudianteId} onChange={onChange} type="number" />
        <Input label="Sección ID" name="seccionId" value={form.seccionId} onChange={onChange} type="number" />
        <Input label="Curso ID" name="cursoId" value={form.cursoId} onChange={onChange} type="number" />
      </>
    );
  }

  if (tab === 'horarios') {
    return (
      <>
        <Select label="Día" name="dia" value={form.dia} onChange={onChange} options={['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']} />
        <Input label="Hora inicio" name="horaInicio" value={form.horaInicio} onChange={onChange} type="time" />
        <Input label="Hora fin" name="horaFin" value={form.horaFin} onChange={onChange} type="time" />
        <Input label="Aula" name="aula" value={form.aula} onChange={onChange} />
        <Input label="Sección ID" name="seccionId" value={form.seccionId} onChange={onChange} type="number" />
        <Input label="Curso ID" name="cursoId" value={form.cursoId} onChange={onChange} type="number" />
        <Input label="Docente ID" name="docenteId" value={form.docenteId} onChange={onChange} type="number" />
      </>
    );
  }

  return (
    <>
      <Select label="Tipo" name="tipo" value={form.tipo} onChange={onChange} options={['COMUNICADO', 'EVENTO', 'NOTICIA', 'BANNER']} />
      <Input label="Título" name="titulo" value={form.titulo} onChange={onChange} />
      <TextArea label="Descripción" name="descripcion" value={form.descripcion} onChange={onChange} />
      <Input label="Imagen URL" name="imagen" value={form.imagen} onChange={onChange} />
    </>
  );
}

function Input({ label, name, value, onChange, type = 'text' }: any) {
  return (
    <label className="warm-field">
      <span>{label}</span>
      <input
        type={type}
        value={value || ''}
        onChange={(e) => onChange(name, e.target.value)}
      />
    </label>
  );
}

function TextArea({ label, name, value, onChange }: any) {
  return (
    <label className="warm-field full">
      <span>{label}</span>
      <textarea
        value={value || ''}
        onChange={(e) => onChange(name, e.target.value)}
      />
    </label>
  );
}

function Select({ label, name, value, onChange, options }: any) {
  return (
    <label className="warm-field">
      <span>{label}</span>
      <select value={value || ''} onChange={(e) => onChange(name, e.target.value)}>
        <option value="">Seleccionar</option>
        {options.map((option: string) => (
          <option value={option} key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function getInitialForm(tab: CreateTab) {
  const today = new Date().toISOString().slice(0, 10);

  const forms: Record<CreateTab, any> = {
    estudiantes: {
      nombres: '',
      apellidos: '',
      dni: '',
      telefono: '',
      direccion: '',
      apoderado: '',
      telefonoApoderado: '',
      colegioId,
      seccionId: 1,
    },
    pagos: {
      concepto: 'Pensión mensual',
      descripcion: '',
      monto: 250,
      estado: 'PENDIENTE',
      fechaVencimiento: today,
      colegioId,
      estudianteId: 1,
    },
    notas: {
      periodo: 'Bimestre 1',
      competencia: '',
      calificacion: 18,
      observacion: '',
      colegioId,
      estudianteId: 1,
      cursoId: 1,
    },
    asistencias: {
      fecha: today,
      estado: 'PRESENTE',
      observacion: '',
      colegioId,
      estudianteId: 1,
      seccionId: 1,
      cursoId: 1,
    },
    horarios: {
      dia: 'Lunes',
      horaInicio: '08:00',
      horaFin: '09:30',
      aula: 'Aula 101',
      colegioId,
      seccionId: 1,
      cursoId: 1,
      docenteId: '',
    },
    contenido: {
      tipo: 'COMUNICADO',
      titulo: '',
      descripcion: '',
      imagen: '',
      colegioId,
    },
  };

  return forms[tab];
}

function buildPayload(tab: CreateTab, form: any) {
  if (tab === 'estudiantes') {
    return {
      endpoint: '/estudiantes',
      body: {
        nombres: form.nombres,
        apellidos: form.apellidos,
        dni: form.dni || undefined,
        telefono: form.telefono || undefined,
        direccion: form.direccion || undefined,
        apoderado: form.apoderado || undefined,
        telefonoApoderado: form.telefonoApoderado || undefined,
        colegioId,
        seccionId: form.seccionId ? Number(form.seccionId) : undefined,
      },
    };
  }

  if (tab === 'pagos') {
    return {
      endpoint: '/pagos',
      body: {
        concepto: form.concepto,
        descripcion: form.descripcion || undefined,
        monto: Number(form.monto),
        estado: form.estado || 'PENDIENTE',
        fechaVencimiento: form.fechaVencimiento ? `${form.fechaVencimiento}T00:00:00.000Z` : undefined,
        colegioId,
        estudianteId: Number(form.estudianteId),
      },
    };
  }

  if (tab === 'notas') {
    return {
      endpoint: '/notas',
      body: {
        periodo: form.periodo,
        competencia: form.competencia || undefined,
        calificacion: Number(form.calificacion),
        observacion: form.observacion || undefined,
        colegioId,
        estudianteId: Number(form.estudianteId),
        cursoId: Number(form.cursoId),
      },
    };
  }

  if (tab === 'asistencias') {
    return {
      endpoint: '/asistencias',
      body: {
        fecha: form.fecha ? `${form.fecha}T08:00:00.000Z` : new Date().toISOString(),
        estado: form.estado || 'PRESENTE',
        observacion: form.observacion || undefined,
        colegioId,
        estudianteId: Number(form.estudianteId),
        seccionId: form.seccionId ? Number(form.seccionId) : undefined,
        cursoId: form.cursoId ? Number(form.cursoId) : undefined,
      },
    };
  }

  if (tab === 'horarios') {
    return {
      endpoint: '/horarios',
      body: {
        dia: form.dia,
        horaInicio: form.horaInicio,
        horaFin: form.horaFin,
        aula: form.aula || undefined,
        colegioId,
        seccionId: Number(form.seccionId),
        cursoId: Number(form.cursoId),
        docenteId: form.docenteId ? Number(form.docenteId) : undefined,
      },
    };
  }

  return {
    endpoint: '/contenido',
    body: {
      tipo: form.tipo,
      titulo: form.titulo,
      descripcion: form.descripcion,
      imagen: form.imagen || '',
      colegioId,
    },
  };
}

function renderTable(tab: ActiveTab, items: any[]) {
  if (tab === 'estudiantes') {
    return (
      <Table headers={['Estudiante', 'DNI', 'Grado', 'Sección', 'Estado']}>
        {items.map((item) => (
          <tr key={item.id}>
            <td>{item.nombres} {item.apellidos}</td>
            <td>{item.dni || '-'}</td>
            <td>{item.seccion?.grado?.nombre || '-'}</td>
            <td>{item.seccion?.nombre || '-'}</td>
            <td><span className="status paid">Activo</span></td>
          </tr>
        ))}
      </Table>
    );
  }

  if (tab === 'pagos') {
    return (
      <Table headers={['Concepto', 'Estudiante', 'Monto', 'Estado', 'Vencimiento', 'Acciones']}>
        {items.map((item) => (
          <tr key={item.id}>
            <td>{item.concepto}</td>
            <td>{item.estudiante?.nombres} {item.estudiante?.apellidos}</td>
            <td>S/ {Number(item.monto || 0).toFixed(2)}</td>
            <td><span className={`status ${item.estado === 'PAGADO' ? 'paid' : 'pending'}`}>{item.estado}</span></td>
            <td>{formatDate(item.fechaVencimiento)}</td>
<td>
  <div className="table-actions">
    {item.estado === 'PENDIENTE' ? (
      <button
        className="table-action-btn"
        onClick={async () => {
          const ok = window.confirm('¿Confirmar este pago como PAGADO?');
          if (!ok) return;

          await api.patch(`/pagos/${item.id}/pagado`, {
            fechaPago: new Date().toISOString(),
            metodoPago: 'EFECTIVO',
            comprobante: `AUTO-${item.id}`,
            observacion: 'Pago marcado desde el panel'
          });

          window.location.reload();
        }}
      >
        Marcar pagado
      </button>
    ) : (
      <span className="status paid">Confirmado</span>
    )}

    <button
      className="table-action-btn danger"
      onClick={async () => {
        const ok = window.confirm('¿Seguro que deseas anular este pago?');
        if (!ok) return;

        await api.patch(`/pagos/${item.id}/eliminar`);
        window.location.reload();
      }}
    >
      Anular
    </button>
  </div>
</td>
</tr>
        ))}
      </Table>
    );
  }

  if (tab === 'notas') {
    return (
      <Table headers={['Estudiante', 'Curso', 'Periodo', 'Nota', 'Observación']}>
        {items.map((item) => (
          <tr key={item.id}>
            <td>{item.estudiante?.nombres} {item.estudiante?.apellidos}</td>
            <td>{item.curso?.nombre}</td>
            <td>{item.periodo}</td>
            <td><strong>{item.calificacion}</strong></td>
            <td>{item.observacion || '-'}</td>
          </tr>
        ))}
      </Table>
    );
  }

  if (tab === 'asistencias') {
    return (
      <Table headers={['Fecha', 'Estudiante', 'Curso', 'Estado', 'Observación']}>
        {items.map((item) => (
          <tr key={item.id}>
            <td>{formatDate(item.fecha)}</td>
            <td>{item.estudiante?.nombres} {item.estudiante?.apellidos}</td>
            <td>{item.curso?.nombre || '-'}</td>
            <td><span className={`status ${item.estado === 'PRESENTE' ? 'paid' : 'pending'}`}>{item.estado}</span></td>
            <td>{item.observacion || '-'}</td>
          </tr>
        ))}
      </Table>
    );
  }

  if (tab === 'horarios') {
    return (
      <Table headers={['Día', 'Hora', 'Curso', 'Sección', 'Aula']}>
        {items.map((item) => (
          <tr key={item.id}>
            <td>{item.dia}</td>
            <td>{item.horaInicio} - {item.horaFin}</td>
            <td>{item.curso?.nombre}</td>
            <td>{item.seccion?.grado?.nombre} {item.seccion?.nombre}</td>
            <td>{item.aula || '-'}</td>
          </tr>
        ))}
      </Table>
    );
  }

  return (
    <div className="notice-grid">
      {items.map((item) => (
        <article className="notice-card" key={item.id}>
          <span>{item.tipo}</span>
          <h4>{item.titulo}</h4>
          <p>{item.descripcion}</p>
        </article>
      ))}
    </div>
  );
}

function Table({ headers, children }: any) {
  return (
    <div className="warm-table-wrap">
      <table className="warm-table">
        <thead>
          <tr>
            {headers.map((header: string) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

function MetricCard({ title, value, detail, icon }: any) {
  return (
    <div className="metric-card">
      <div className="metric-icon">{icon}</div>
      <p>{title}</p>
      <h3>{value}</h3>
      <span>{detail}</span>
    </div>
  );
}

function calcularPorcentaje(presentes?: number, faltas?: number) {
  const p = presentes || 0;
  const f = faltas || 0;
  const total = p + f;

  if (total === 0) return 0;

  return Math.round((p / total) * 100);
}

function formatDate(value?: string) {
  if (!value) return '-';

  return new Date(value).toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}




