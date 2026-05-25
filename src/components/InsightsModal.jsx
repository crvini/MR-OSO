import { useEffect, useRef, useState } from 'react';
import {
  Sparkles,
  X,
  RefreshCw,
  Send,
  Zap,
  Loader2,
  Bot,
  User as UserIcon,
  Lightbulb,
} from 'lucide-react';
import {
  getInitialAnalysis,
  askQuestion,
  isDemoMode,
  setDemoMode,
  clearCache,
} from '../services/aiInsights';

const ff = "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif";

export default function InsightsModal({ open, onClose }) {
  const [demo, setDemo] = useState(isDemoMode());
  const [messages, setMessages] = useState([]); // {role: 'assistant'|'user', content}
  const [suggested, setSuggested] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [source, setSource] = useState(null);
  const scrollRef = useRef(null);

  const reset = () => {
    setMessages([]);
    setSuggested([]);
    setInput('');
    setError(null);
    setSource(null);
  };

  const loadInitial = async (forceFresh = false) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getInitialAnalysis({ forceFresh });
      setMessages([{ role: 'assistant', content: result.reply }]);
      setSuggested(result.preguntasSugeridas || []);
      setSource(result.source);
    } catch (e) {
      if (e.code === 'no_api_key') {
        setError(
          'Falta configurar la API key de IA en el servidor. Activa Modo Demo para ver el resultado sin consumirla.',
        );
      } else {
        setError(e.message || 'Error generando análisis');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && messages.length === 0 && !loading && !error) {
      loadInitial(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // autoscroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const send = async (text) => {
    const q = (text ?? input).trim();
    if (!q || loading) return;

    const next = [...messages, { role: 'user', content: q }];
    setMessages(next);
    setInput('');
    setSuggested([]);
    setLoading(true);
    setError(null);

    try {
      const result = await askQuestion(next);
      setMessages([...next, { role: 'assistant', content: result.reply }]);
      setSuggested(result.preguntasSugeridas || []);
      setSource(result.source);
    } catch (e) {
      if (e.code === 'no_api_key') {
        setError(
          'Falta configurar la API key de IA para chat libre. Activa Modo Demo o pídele al admin que la configure.',
        );
      } else {
        setError(e.message || 'Error procesando la pregunta');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  const sourceLabel =
    source === 'demo'
      ? { icon: Zap, label: 'Modo Demo', color: '#F59E0B' }
      : source === 'cache'
        ? { icon: Sparkles, label: 'Cache local', color: '#10B981' }
        : source === 'api'
          ? { icon: Bot, label: 'IA en vivo', color: '#dc2626' }
          : null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.78)',
        backdropFilter: 'blur(6px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: ff,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '780px',
          height: 'min(720px, calc(100vh - 40px))',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(180deg, #181818 0%, #111111 100%)',
          border: '1px solid #2e2e2e',
          borderRadius: '18px',
          boxShadow: '0 30px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(220,38,38,0.08)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px 18px',
            borderBottom: '1px solid #2e2e2e',
            background:
              'linear-gradient(135deg, rgba(220,38,38,0.18) 0%, rgba(220,38,38,0.04) 60%, transparent 100%)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 11,
                background: 'linear-gradient(135deg, #dc2626 0%, #7f1d1d 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 6px 18px rgba(220,38,38,0.45)',
              }}
            >
              <Sparkles size={20} color="#fff" />
            </div>
            <div style={{ flex: 1 }}>
              <h2
                style={{
                  margin: 0,
                  fontSize: 20,
                  fontWeight: 700,
                  color: '#fff',
                  letterSpacing: '-0.01em',
                }}
              >
                Asesor IA de Mr. Oso
              </h2>
              <p style={{ margin: '2px 0 0', fontSize: 12.5, color: '#9ca3af' }}>
                Análisis y preguntas sobre tu negocio
              </p>
            </div>
            <button
              onClick={onClose}
              style={iconBtnStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#9ca3af';
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              }}
            >
              <X size={17} />
            </button>
          </div>

          {/* Toolbar */}
          <div
            style={{
              marginTop: 14,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <label
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 7,
                  padding: '5px 11px',
                  borderRadius: 999,
                  background: demo ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${demo ? '#F59E0B' : '#2e2e2e'}`,
                  color: demo ? '#F59E0B' : '#9ca3af',
                  fontSize: 11.5,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  checked={demo}
                  onChange={(e) => {
                    setDemoMode(e.target.checked);
                    setDemo(e.target.checked);
                    reset();
                    setTimeout(() => loadInitial(false), 30);
                  }}
                  style={{ accentColor: '#F59E0B' }}
                />
                Modo Demo
              </label>
              {sourceLabel && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    padding: '5px 11px',
                    borderRadius: 999,
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid #2e2e2e',
                    fontSize: 11.5,
                    color: sourceLabel.color,
                    fontWeight: 600,
                  }}
                >
                  <sourceLabel.icon size={12} />
                  {sourceLabel.label}
                </span>
              )}
            </div>
            <button
              onClick={() => {
                clearCache();
                reset();
                loadInitial(true);
              }}
              disabled={loading}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                background: 'transparent',
                border: '1px solid #dc2626',
                borderRadius: 8,
                color: '#dc2626',
                fontSize: 11.5,
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.5 : 1,
              }}
            >
              <RefreshCw size={12} />
              Reiniciar
            </button>
          </div>
        </div>

        {/* Messages */}
        <div
          ref={scrollRef}
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          {messages.map((m, i) => (
            <MessageBubble key={i} role={m.role} content={m.content} />
          ))}

          {loading && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                color: '#9ca3af',
                fontSize: 13,
                padding: '8px 4px',
              }}
            >
              <Loader2
                size={16}
                color="#dc2626"
                style={{ animation: 'spin 1s linear infinite' }}
              />
              Pensando…
              <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
            </div>
          )}

          {error && !loading && (
            <div
              style={{
                padding: '14px 16px',
                background: 'rgba(220,38,38,0.08)',
                border: '1px solid rgba(220,38,38,0.4)',
                borderRadius: 10,
                color: '#fca5a5',
                fontSize: 13.5,
                lineHeight: 1.55,
              }}
            >
              <p style={{ margin: 0, fontWeight: 600, color: '#fff', marginBottom: 4 }}>
                Error
              </p>
              {error}
            </div>
          )}

          {/* Preguntas sugeridas */}
          {suggested.length > 0 && !loading && (
            <div style={{ marginTop: 4 }}>
              <p
                style={{
                  margin: '0 0 8px',
                  fontSize: 10.5,
                  fontWeight: 700,
                  color: '#6b7280',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                }}
              >
                <Lightbulb size={12} color="#dc2626" />
                Preguntas sugeridas
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {suggested.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => send(q)}
                    style={{
                      textAlign: 'left',
                      padding: '10px 14px',
                      background: 'rgba(220,38,38,0.06)',
                      border: '1px solid rgba(220,38,38,0.3)',
                      borderRadius: 10,
                      color: '#fca5a5',
                      fontSize: 13.5,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      fontFamily: ff,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(220,38,38,0.15)';
                      e.currentTarget.style.color = '#fff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(220,38,38,0.06)';
                      e.currentTarget.style.color = '#fca5a5';
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div
          style={{
            padding: '14px 18px 16px',
            borderTop: '1px solid #2e2e2e',
            background: '#0d0d0d',
          }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Pregunta sobre tu negocio…"
              rows={1}
              disabled={loading}
              style={{
                flex: 1,
                resize: 'none',
                background: '#1a1a1a',
                border: '1px solid #2e2e2e',
                borderRadius: 10,
                padding: '10px 14px',
                color: '#fff',
                fontSize: 14,
                fontFamily: ff,
                outline: 'none',
                minHeight: 40,
                maxHeight: 120,
                lineHeight: 1.4,
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#dc2626')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#2e2e2e')}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              style={{
                width: 42,
                height: 42,
                borderRadius: 10,
                background: input.trim() && !loading
                  ? 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)'
                  : '#2e2e2e',
                border: 'none',
                color: '#fff',
                cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'all 0.15s',
                boxShadow: input.trim() && !loading
                  ? '0 4px 14px rgba(220,38,38,0.4)'
                  : 'none',
              }}
            >
              <Send size={16} />
            </button>
          </form>
          <p
            style={{
              margin: '8px 0 0',
              fontSize: 10.5,
              color: '#6b7280',
              textAlign: 'center',
            }}
          >
            Solo responde sobre tu negocio. Enter para enviar · Shift+Enter para salto de línea.
          </p>
        </div>
      </div>
    </div>
  );
}

const iconBtnStyle = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid #2e2e2e',
  color: '#9ca3af',
  width: 34,
  height: 34,
  borderRadius: 9,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

function MessageBubble({ role, content }) {
  const isUser = role === 'user';
  return (
    <div
      style={{
        display: 'flex',
        gap: 10,
        alignItems: 'flex-start',
        flexDirection: isUser ? 'row-reverse' : 'row',
      }}
    >
      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: 8,
          background: isUser
            ? 'rgba(255,255,255,0.08)'
            : 'linear-gradient(135deg, #dc2626 0%, #7f1d1d 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          color: '#fff',
          boxShadow: isUser ? 'none' : '0 4px 12px rgba(220,38,38,0.35)',
        }}
      >
        {isUser ? <UserIcon size={15} /> : <Bot size={15} />}
      </div>
      <div
        style={{
          maxWidth: '80%',
          padding: '11px 14px',
          background: isUser ? '#1f1f1f' : '#0f0f0f',
          border: `1px solid ${isUser ? '#2e2e2e' : 'rgba(220,38,38,0.2)'}`,
          borderRadius: 12,
          color: '#e5e7eb',
          fontSize: 14,
          lineHeight: 1.55,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {content}
      </div>
    </div>
  );
}
