import { useEffect, useMemo, useState } from 'react';
import api from '../../services/api';
import './EduIntelligencePanel.css';

type Message = {
  role: 'bot' | 'user';
  text: string;
};

export default function EduIntelligencePanel({ data, cards }: any) {
  const [noticias, setNoticias] = useState<any[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'bot',
      text: 'Hola, soy tu asistente educativo. Puedo ayudarte con comunicados, pagos, horarios, parciales, actividades y noticias educativas.',
    },
  ]);

  useEffect(() => {
    cargarNoticias();
  }, []);

  const cargarNoticias = async () => {
    try {
      setLoadingNews(true);
      const response = await api.get('/noticias-educacion?q=educacion Peru colegios estudiantes tecnologia educativa');
      setNoticias(response.data?.noticias || []);
    } catch (error) {
      console.error('Error cargando noticias educativas', error);
      setNoticias([]);
    } finally {
      setLoadingNews(false);
    }
  };

  const radar = useMemo(() => {
    return generarRadar(cards, noticias);
  }, [cards, noticias]);

  const preguntar = (texto?: string) => {
    const pregunta = (texto || input).trim();
    if (!pregunta) return;

    const respuesta = responderIA(pregunta, data, cards, noticias);

    setMessages((prev) => [
      ...prev,
      { role: 'user', text: pregunta },
      { role: 'bot', text: respuesta },
    ]);

    setInput('');
  };

  return (
    <section className="edu-ai-section">
      <div className="edu-ai-header">
        <div>
          <span>Radar educativo IA</span>
          <h2>Noticias, alertas y asistente del colegio</h2>
          <p>
            Un panel vivo con informacion educativa, recomendaciones y respuestas utiles para la gestion escolar.
          </p>
        </div>

        <button onClick={cargarNoticias}>Actualizar noticias</button>
      </div>

      <div className="edu-ai-grid">
        <article className="edu-radar-card">
          <div className="edu-radar-badge">IA</div>
          <span>{radar.categoria}</span>
          <h3>{radar.titulo}</h3>
          <p>{radar.mensaje}</p>

          <div className="edu-radar-actions">
            <button onClick={() => preguntar('Que debo revisar hoy')}>Revisar hoy</button>
            <button onClick={() => preguntar('Ideas para comunicado')}>Crear comunicado</button>
          </div>
        </article>

        <article className="edu-news-card">
          <div className="edu-panel-title">
            <div>
              <span>Noticias educativas</span>
              <h3>Actualidad en educacion</h3>
            </div>
            <small>{loadingNews ? 'Cargando...' : `${noticias.length} noticias`}</small>
          </div>

          <div className="edu-news-list">
            {loadingNews && (
              <>
                <div className="edu-news-skeleton"></div>
                <div className="edu-news-skeleton"></div>
                <div className="edu-news-skeleton"></div>
              </>
            )}

            {!loadingNews && noticias.length === 0 && (
              <p className="edu-empty">
                No se pudieron cargar noticias en vivo. Verifica que el backend tenga el modulo noticias-educacion activo.
              </p>
            )}

            {!loadingNews &&
              noticias.slice(0, 5).map((item, index) => (
                <button
                  className="edu-news-item"
                  key={`${item.title}-${index}`}
                  onClick={() => item.link && window.open(item.link, '_blank')}
                >
                  <div>
                    <strong>{limpiarTexto(item.title)}</strong>
                    <span>{item.source || 'Fuente educativa'} · {formatearFecha(item.pubDate)}</span>
                  </div>
                  <b>Leer</b>
                </button>
              ))}
          </div>
        </article>

        <article className="edu-chat-card">
          <div className="edu-panel-title">
            <div>
              <span>Chatbot academico</span>
              <h3>Asistente del colegio</h3>
            </div>
            <div className="edu-chat-dot"></div>
          </div>

          <div className="edu-chat-messages">
            {messages.slice(-5).map((msg, index) => (
              <div className={`edu-message ${msg.role}`} key={index}>
                {msg.text}
              </div>
            ))}
          </div>

          <div className="edu-quick-prompts">
            <button onClick={() => preguntar('Que debo revisar hoy')}>Hoy</button>
            <button onClick={() => preguntar('Ideas para fiestas patrias')}>Fiestas Patrias</button>
            <button onClick={() => preguntar('Ideas para parciales')}>Parciales</button>
            <button onClick={() => preguntar('Resumen de pagos')}>Pagos</button>
          </div>

          <div className="edu-chat-input">
            <input
              value={input}
              placeholder="Pregunta algo del colegio..."
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') preguntar();
              }}
            />
            <button onClick={() => preguntar()}>Enviar</button>
          </div>
        </article>
      </div>
    </section>
  );
}

function generarRadar(cards: any, noticias: any[]) {
  const month = new Date().getMonth() + 1;

  if (month === 7) {
    return {
      categoria: 'Calendario escolar',
      titulo: 'Fiestas Patrias cerca',
      mensaje:
        'Recomendacion IA: publica un comunicado con horarios de ensayo, uniforme, participacion por grados y programacion de actividades patrioticas.',
    };
  }

  if (month === 8) {
    return {
      categoria: 'Comunidad educativa',
      titulo: 'Mes del nino',
      mensaje:
        'Recomendacion IA: prepara actividades por aulas, juegos, concursos, compartir saludable y comunicacion anticipada para padres.',
    };
  }

  if ((cards?.pagosPendientes || 0) > 0) {
    return {
      categoria: 'Finanzas',
      titulo: 'Pagos pendientes por revisar',
      mensaje:
        `Tienes ${cards?.pagosPendientes || 0} pago(s) pendiente(s). Puedes enviar recordatorios amables y registrar comprobantes desde pagos.`,
    };
  }

  if (noticias.length > 0) {
    return {
      categoria: 'Actualidad educativa',
      titulo: 'Noticias nuevas para analizar',
      mensaje:
        'La IA recomienda convertir noticias educativas relevantes en comunicados internos para padres, docentes y estudiantes.',
    };
  }

  return {
    categoria: 'Gestion diaria',
    titulo: 'Panel listo para trabajar',
    mensaje:
      'Revisa asistencias, horarios, pagos y comunicados. Mantener la informacion actualizada mejora la comunicacion escolar.',
  };
}

function responderIA(pregunta: string, data: any, cards: any, noticias: any[]) {
  const q = pregunta.toLowerCase();

  if (q.includes('pago')) {
    return `Resumen financiero: ${cards?.pagosPendientes || 0} pendiente(s), ${cards?.pagosPagados || 0} pagado(s), S/ ${Number(cards?.montoPagado || 0).toFixed(2)} recaudados y S/ ${Number(cards?.montoPendiente || 0).toFixed(2)} pendientes.`;
  }

  if (q.includes('fiestas') || q.includes('patrias')) {
    return 'Idea: publicar comunicado de Fiestas Patrias con fecha central, uniforme, ingreso, ensayos, participacion por grado y recomendaciones para padres.';
  }

  if (q.includes('parcial') || q.includes('examen') || q.includes('evaluacion')) {
    return 'Para parciales: publica horario de evaluaciones, criterios de calificacion, fechas de recuperacion y recomendaciones de estudio.';
  }

  if (q.includes('comunicado')) {
    return 'Comunicado sugerido: Estimadas familias, les recordamos revisar horarios, pagos pendientes y actividades academicas de la semana desde el panel institucional.';
  }

  if (q.includes('noticia')) {
    const top = noticias.slice(0, 2).map((n) => `- ${limpiarTexto(n.title)}`).join(' ');
    return top || 'Aun no hay noticias cargadas. Presiona Actualizar noticias.';
  }

  return `Hoy te recomiendo revisar pagos pendientes, asistencias recientes, horarios de la semana y comunicados de ${data?.colegio?.nombre || 'tu colegio'}.`;
}

function limpiarTexto(value?: string) {
  return String(value || '')
    .replace(/Ã¡/g, 'a')
    .replace(/Ã©/g, 'e')
    .replace(/Ã­/g, 'i')
    .replace(/Ã³/g, 'o')
    .replace(/Ãº/g, 'u')
    .replace(/Ã±/g, 'n')
    .replace(/�/g, 'n');
}

function formatearFecha(value?: string) {
  if (!value) return 'Reciente';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return 'Reciente';

  return date.toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}
