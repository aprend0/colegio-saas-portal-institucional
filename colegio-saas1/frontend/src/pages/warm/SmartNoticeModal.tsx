import { useEffect, useMemo, useState } from 'react';
import './SmartNoticeModal.css';

type SmartNoticeModalProps = {
  colegioNombre?: string;
  comunicados?: any[];
};

type Notice = {
  id: string;
  categoria: string;
  titulo: string;
  subtitulo: string;
  mensaje: string;
  accion: string;
  decoracion: string;
};

export default function SmartNoticeModal({
  colegioNombre = 'Mi Colegio de Prueba',
  comunicados = [],
}: SmartNoticeModalProps) {
  const [visible, setVisible] = useState(false);

  const notice = useMemo(() => {
    return generarNotificacion(colegioNombre, comunicados);
  }, [colegioNombre, comunicados]);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const key = `smart_notice_closed_${today}_${notice.id}`;
    const wasClosed = localStorage.getItem(key);

    if (!wasClosed) {
      const timer = setTimeout(() => {
        setVisible(true);
      }, 900);

      return () => clearTimeout(timer);
    }
  }, [notice.id]);

  const cerrar = () => {
    const today = new Date().toISOString().slice(0, 10);
    const key = `smart_notice_closed_${today}_${notice.id}`;
    localStorage.setItem(key, 'true');
    setVisible(false);
  };

  const cerrarSoloAhora = () => {
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="smart-notice-backdrop">
      <div className="smart-notice-card">
        <button className="smart-notice-close" onClick={cerrar}>
          ×
        </button>

        <div className="smart-notice-top">
          <div>
            <span>{notice.categoria}</span>
            <h2>{notice.titulo}</h2>
            <p>{notice.subtitulo}</p>
          </div>

          <div className="smart-notice-badge">
            IA
          </div>
        </div>

        <div className="smart-notice-visual">
          <div className="smart-orb orb-one"></div>
          <div className="smart-orb orb-two"></div>
          <div className="smart-ribbon">
            {notice.decoracion}
          </div>
        </div>

        <div className="smart-notice-body">
          <p>{notice.mensaje}</p>
        </div>

        <div className="smart-notice-actions">
          <button className="smart-secondary-btn" onClick={cerrarSoloAhora}>
            Ver después
          </button>

          <button className="smart-primary-btn" onClick={cerrar}>
            {notice.accion}
          </button>
        </div>

        <div className="smart-notice-foot">
          Notificación generada automáticamente para mantener informada a la comunidad educativa.
        </div>
      </div>
    </div>
  );
}

function generarNotificacion(colegioNombre: string, comunicados: any[]): Notice {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();

  const comunicadoReciente = comunicados?.[0];

  const base: Notice[] = [
    {
      id: 'bienvenida-institucional',
      categoria: 'Bienvenida',
      titulo: `Bienvenido a ${colegioNombre}`,
      subtitulo: 'Tu panel está listo para gestionar la jornada educativa.',
      mensaje:
        'Revisa estudiantes, pagos, asistencias, horarios y comunicados desde una vista clara. Hoy es un buen día para mantener la información actualizada.',
      accion: 'Entendido',
      decoracion: 'Panel activo',
    },
    {
      id: 'semana-parciales',
      categoria: 'Aviso académico',
      titulo: 'Semana de evaluaciones cerca',
      subtitulo: 'Organización académica recomendada.',
      mensaje:
        'Se recomienda revisar horarios, cursos y registro de notas. Mantener las evaluaciones actualizadas ayuda a tener reportes más claros para docentes y familias.',
      accion: 'Revisar luego',
      decoracion: 'Parciales',
    },
    {
      id: 'pagos-pendientes',
      categoria: 'Gestión financiera',
      titulo: 'Recordatorio de pagos',
      subtitulo: 'Mantén el control de pensiones y matrículas.',
      mensaje:
        'El sistema detecta movimiento financiero reciente. Puedes revisar pagos pendientes, marcar pagos confirmados o registrar nuevos conceptos desde el módulo de pagos.',
      accion: 'Entendido',
      decoracion: 'Finanzas',
    },
    {
      id: 'horarios-dia',
      categoria: 'Agenda escolar',
      titulo: 'Horarios actualizados',
      subtitulo: 'Una buena planificación evita cruces.',
      mensaje:
        'Recuerda verificar los horarios de secciones y cursos. Un horario claro mejora la asistencia, la comunicación docente y el seguimiento académico.',
      accion: 'Listo',
      decoracion: 'Horario',
    },
    {
      id: 'dia-nino',
      categoria: 'Actividad institucional',
      titulo: 'Preparando actividades especiales',
      subtitulo: 'Celebraciones que fortalecen la comunidad.',
      mensaje:
        'Puedes usar comunicados para informar actividades por el Día del Niño, jornadas recreativas, concursos, presentaciones o campañas internas del colegio.',
      accion: 'Perfecto',
      decoracion: 'Celebración',
    },
  ];

  if (month === 7) {
    base.unshift({
      id: 'fiestas-patrias',
      categoria: 'Comunicado especial',
      titulo: 'Fiestas Patrias se acercan',
      subtitulo: 'Celebremos nuestra identidad con organización.',
      mensaje:
        'Se recomienda publicar comunicados sobre actuaciones, horarios especiales, uso de uniforme, ensayos, decoración de aulas y participación de padres de familia.',
      accion: 'Viva el Perú',
      decoracion: 'Fiestas Patrias',
    });
  }

  if (month === 8) {
    base.unshift({
      id: 'dia-del-nino-agosto',
      categoria: 'Comunidad educativa',
      titulo: 'Mes del niño',
      subtitulo: 'Una oportunidad para crear experiencias memorables.',
      mensaje:
        'Puedes informar actividades recreativas, concursos, shows, campañas de integración y mensajes positivos para estudiantes y familias.',
      accion: 'Entendido',
      decoracion: 'Día del Niño',
    });
  }

  if (comunicadoReciente) {
    base.unshift({
      id: `comunicado-${comunicadoReciente.id}`,
      categoria: comunicadoReciente.tipo || 'Comunicado',
      titulo: comunicadoReciente.titulo || 'Nuevo comunicado institucional',
      subtitulo: 'Hay información reciente para la comunidad educativa.',
      mensaje:
        comunicadoReciente.descripcion ||
        'Revisa el módulo de comunicados para mantener informados a estudiantes y familias.',
      accion: 'Enterado',
      decoracion: 'Nuevo aviso',
    });
  }

  const seed =
    now.getFullYear() +
    now.getMonth() * 13 +
    now.getDate() * 7 +
    now.getHours() * 3 +
    Math.floor(Math.random() * 100);

  const index = seed % base.length;

  return base[index];
}
