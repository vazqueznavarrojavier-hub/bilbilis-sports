import React, { useMemo, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, NavLink, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import './styles.css'

const sports = [
  { id: 'football', label: 'Fútbol', icon: '⚽' },
  { id: 'padel', label: 'Pádel', icon: '🎾' },
  { id: 'tennis', label: 'Tenis', icon: '🎾' },
  { id: 'running', label: 'Running', icon: '🏃' },
  { id: 'cycling', label: 'Ciclismo', icon: '🚴' },
  { id: 'basketball', label: 'Baloncesto', icon: '🏀' },
  { id: 'motorsport', label: 'Motor', icon: '🏎️' },
]

const seedEvents = [
  { id: 'cal-1', title: 'Torneo local de pádel', sport: 'padel', scope: 'local', date: '2026-09-26', time: '10:00', venue: 'Instalaciones deportivas de Calatayud', competition: 'Agenda local', featured: true, demo: true, description: 'Evento de demostración para visualizar la agenda local.' },
  { id: 'cal-2', title: 'Jornada de fútbol local', sport: 'football', scope: 'local', date: '2026-09-27', time: '17:30', venue: 'Calatayud', competition: 'Agenda local', featured: true, demo: true, description: 'Evento de demostración para visualizar la ficha y el calendario.' },
  { id: 'cal-3', title: 'Quedada ciclista', sport: 'cycling', scope: 'local', date: '2026-10-03', time: '09:00', venue: 'Salida desde Calatayud', competition: 'Ciclismo', featured: false, demo: true, description: 'Evento de demostración.' },
  { id: 'int-1', title: 'Partido internacional destacado', sport: 'football', scope: 'international', date: '2026-09-26', time: '21:00', venue: 'Europa', competition: 'Fútbol internacional', featured: true, demo: true, description: 'Evento de demostración. En producción estos eventos llegarán desde una fuente deportiva.' },
  { id: 'int-2', title: 'Gran premio — clasificación', sport: 'motorsport', scope: 'international', date: '2026-09-26', time: '16:00', venue: 'Circuito internacional', competition: 'Motor', featured: true, demo: true, description: 'Evento de demostración.' },
  { id: 'int-3', title: 'Final de tenis destacada', sport: 'tennis', scope: 'international', date: '2026-09-27', time: '16:00', venue: 'Circuito ATP/WTA', competition: 'Tenis', featured: true, demo: true, description: 'Evento de demostración.' },
  { id: 'int-4', title: 'Etapa ciclista destacada', sport: 'cycling', scope: 'international', date: '2026-10-04', time: '13:30', venue: 'Europa', competition: 'Ciclismo internacional', featured: false, demo: true, description: 'Evento de demostración.' },
]

const readCustomEvents = () => {
  try { return JSON.parse(localStorage.getItem('bilbilis-sports-events') || '[]') } catch { return [] }
}
const saveCustomEvents = events => localStorage.setItem('bilbilis-sports-events', JSON.stringify(events))
const pad = value => String(value).padStart(2, '0')
const dateKey = date => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
const todayKey = () => dateKey(new Date())
const addDays = (date, amount) => { const next = new Date(date); next.setDate(next.getDate() + amount); return next }
const eventKey = event => `${event.date}T${event.time || '00:00'}`
const currentEventKey = () => { const now = new Date(); return `${dateKey(now)}T${pad(now.getHours())}:${pad(now.getMinutes())}` }
const isUpcoming = event => eventKey(event) >= currentEventKey()
const sortEvents = events => [...events].sort((a, b) => eventKey(a).localeCompare(eventKey(b)))
const formatDate = date => new Intl.DateTimeFormat('es-ES', { weekday: 'short', day: 'numeric', month: 'short' }).format(new Date(`${date}T12:00:00`))
const sportMeta = id => sports.find(s => s.id === id) || { icon: '🏅', label: 'Deporte' }
const normalize = value => (value || '').toLocaleLowerCase('es-ES').normalize('NFD').replace(/[\u0300-\u036f]/g, '')

function getWeekend() {
  const now = new Date()
  const day = now.getDay()
  let saturday
  if (day === 6) saturday = new Date(now)
  else if (day === 0) saturday = addDays(now, -1)
  else saturday = addDays(now, 6 - day)
  const sunday = addDays(saturday, 1)
  const month = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(sunday).toUpperCase()
  return { saturday: dateKey(saturday), sunday: dateKey(sunday), label: `${saturday.getDate()}–${sunday.getDate()} ${month}` }
}

function Shell({ children }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)
  return <div className="app-shell">
    <header className="site-header">
      <NavLink to="/" className="brand" onClick={closeMenu}><span className="brand-mark">BS</span><span><strong>BÍLBILIS</strong><em>SPORTS</em></span></NavLink>
      <nav className="desktop-nav">
        <NavLink to="/calatayud">Calatayud</NavLink>
        <NavLink to="/internacional">Internacional</NavLink>
        <NavLink to="/calendario">Calendario</NavLink>
        <NavLink to="/fin-de-semana">Fin de semana</NavLink>
      </nav>
      <NavLink className="admin-link desktop-admin" to="/admin">Admin</NavLink>
      <button className="menu-toggle" type="button" aria-label="Abrir menú" aria-expanded={menuOpen} onClick={() => setMenuOpen(value => !value)}>
        <span></span><span></span><span></span>
      </button>
      {menuOpen && <div className="mobile-menu">
        <NavLink to="/calatayud" onClick={closeMenu}>Calatayud</NavLink>
        <NavLink to="/internacional" onClick={closeMenu}>Internacional</NavLink>
        <NavLink to="/calendario" onClick={closeMenu}>Calendario</NavLink>
        <NavLink to="/fin-de-semana" onClick={closeMenu}>Fin de semana</NavLink>
        <NavLink to="/admin" onClick={closeMenu}>Admin</NavLink>
      </div>}
    </header>
    <main>{children}</main>
    <footer><span>Bílbilis Sports</span><span>Calatayud · Aragón</span><span>Agenda deportiva en construcción</span></footer>
  </div>
}

function ScopePill({ scope }) {
  return <span className={`scope-pill ${scope}`}>{scope === 'local' ? 'CALATAYUD' : 'INTERNACIONAL'}</span>
}

function EventCard({ event, compact = false }) {
  const s = sportMeta(event.sport)
  return <NavLink to={`/evento/${event.id}`} className={`event-card ${compact ? 'compact' : ''}`}>
    <div className="event-icon">{s.icon}</div>
    <div className="event-main">
      <div className="event-top"><ScopePill scope={event.scope}/><span>{s.label}</span>{event.demo && <span className="demo-pill">DEMO</span>}</div>
      <h3>{event.title}</h3>
      <div className="event-meta"><strong>{formatDate(event.date)}</strong><span>{event.time}</span><span>{event.venue}</span></div>
    </div>
    <span className="arrow">→</span>
  </NavLink>
}

function Home({ allEvents }) {
  const upcoming = sortEvents(allEvents.filter(isUpcoming))
  const featured = upcoming.filter(event => event.featured).slice(0, 4)
  const next = featured[0] || upcoming[0]
  return <>
    <section className="hero">
      <div className="hero-copy"><span className="eyebrow">CALATAYUD + DEPORTE MUNDIAL</span><h1>Tu deporte.<br/><span>Todo en juego.</span></h1><p>Una agenda única para descubrir qué se juega en Calatayud y cuáles son los grandes eventos deportivos que merece la pena seguir.</p><div className="hero-actions"><NavLink className="btn primary" to="/calatayud">Explorar Calatayud</NavLink><NavLink className="btn ghost" to="/internacional">Ver internacional</NavLink></div></div>
      <div className="hero-panel"><span className="live-kicker">PRÓXIMO DESTACADO</span>{next ? <><div className="big-sport">{sportMeta(next.sport).icon}</div><div className="hero-pills"><ScopePill scope={next.scope}/>{next.demo && <span className="demo-pill">DEMO</span>}</div><h2>{next.title}</h2><div className="hero-event-time"><strong>{formatDate(next.date)}</strong><span>{next.time}</span></div><NavLink to={`/evento/${next.id}`}>Ver evento →</NavLink></> : <div className="hero-empty"><div className="big-sport">🏟️</div><h2>Preparando la próxima agenda</h2><p>En cuanto haya nuevos eventos aparecerán aquí.</p></div>}</div>
    </section>
    <section className="section split-intro">
      <NavLink to="/calatayud" className="scope-card local-card"><span>🏠</span><small>DEPORTE LOCAL</small><h2>Calatayud</h2><p>Partidos, torneos, carreras, rutas y actividades deportivas de la ciudad y su entorno.</p><b>Entrar →</b></NavLink>
      <NavLink to="/internacional" className="scope-card world-card"><span>🌍</span><small>GRANDES EVENTOS</small><h2>Internacional</h2><p>Una selección de lo imprescindible en fútbol, tenis, motor, ciclismo y baloncesto.</p><b>Entrar →</b></NavLink>
    </section>
    <section className="section sports-strip"><div className="section-head"><div><span className="eyebrow">DEPORTE</span><h2>Explora por modalidad</h2></div></div><div className="sport-grid">{sports.map(s => <NavLink key={s.id} to={`/calatayud?deporte=${s.id}`}><span>{s.icon}</span><strong>{s.label}</strong></NavLink>)}</div></section>
    <section className="section"><div className="section-head"><div><span className="eyebrow">AGENDA</span><h2>Lo próximo</h2></div><NavLink to="/calendario">Ver calendario completo →</NavLink></div><div className="event-list">{featured.map(e => <EventCard event={e} key={e.id}/>)}{!featured.length && <Empty message="Todavía no hay eventos destacados próximos."/>}</div></section>
    <section className="section weekend-banner"><div><span className="eyebrow">PLAN RÁPIDO</span><h2>¿Qué hay este fin de semana?</h2><p>Una vista rápida para decidir qué ver, dónde ir y a qué hora empieza cada evento.</p></div><NavLink className="btn primary" to="/fin-de-semana">Abrir fin de semana</NavLink></section>
  </>
}

function Listing({ title, subtitle, scope, allEvents }) {
  const [sport, setSport] = useState('all')
  const [query, setQuery] = useState('')
  const [showPast, setShowPast] = useState(false)
  const filtered = sortEvents(allEvents.filter(event => {
    const matchesScope = event.scope === scope
    const matchesSport = sport === 'all' || event.sport === sport
    const haystack = normalize(`${event.title} ${event.competition} ${event.venue}`)
    const matchesQuery = !query.trim() || haystack.includes(normalize(query.trim()))
    const matchesDate = showPast || isUpcoming(event)
    return matchesScope && matchesSport && matchesQuery && matchesDate
  }))
  return <section className="section page-top">
    <div className="page-heading"><span className="eyebrow">{scope === 'local' ? 'DEPORTE LOCAL' : 'GRANDES EVENTOS'}</span><h1>{title}</h1><p>{subtitle}</p></div>
    <div className="search-row"><label className="search-box"><span>⌕</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar evento, competición o lugar…"/></label><button className={`past-toggle ${showPast ? 'active' : ''}`} onClick={() => setShowPast(value => !value)}>{showPast ? 'Ocultar pasados' : 'Ver pasados'}</button></div>
    <div className="filters"><button className={sport === 'all' ? 'active' : ''} onClick={() => setSport('all')}>Todos</button>{sports.map(s => <button key={s.id} className={sport === s.id ? 'active' : ''} onClick={() => setSport(s.id)}>{s.icon} {s.label}</button>)}</div>
    <div className="result-count">{filtered.length} eventos</div><div className="event-list">{filtered.map(e => <EventCard key={e.id} event={e}/>)}{!filtered.length && <Empty/>}</div>
  </section>
}

function Calendar({ allEvents }) {
  const future = useMemo(() => sortEvents(allEvents.filter(isUpcoming)), [allEvents])
  const groups = useMemo(() => future.reduce((acc, event) => { (acc[event.date] ||= []).push(event); return acc }, {}), [future])
  return <section className="section page-top"><div className="page-heading"><span className="eyebrow">TODO EL DEPORTE</span><h1>Calendario</h1><p>Calatayud e internacional reunidos en una sola agenda. Solo se muestran eventos próximos.</p></div><div className="calendar-groups">{Object.entries(groups).map(([date,events]) => <div className="calendar-day" key={date}><div className="date-block"><strong>{new Date(`${date}T12:00`).getDate()}</strong><span>{new Intl.DateTimeFormat('es-ES',{month:'short'}).format(new Date(`${date}T12:00`))}</span></div><div>{events.map(e => <EventCard compact key={e.id} event={e}/>)}</div></div>)}{!future.length && <Empty message="No hay próximos eventos todavía."/>}</div></section>
}

function Weekend({ allEvents }) {
  const range = getWeekend()
  const weekend = sortEvents(allEvents.filter(e => [range.saturday, range.sunday].includes(e.date)))
  const local = weekend.filter(e => e.scope === 'local')
  const international = weekend.filter(e => e.scope === 'international')
  return <section className="section page-top"><div className="page-heading"><span className="eyebrow">{range.label}</span><h1>Este fin de semana</h1><p>Dos agendas, una sola vista. Las fechas se actualizan automáticamente cada semana.</p></div><div className="weekend-columns"><div><h2>🏠 En Calatayud</h2>{local.map(e => <EventCard compact key={e.id} event={e}/>)}{!local.length && <Empty message="No hay eventos locales cargados para este fin de semana."/>}</div><div><h2>🌍 En el mundo</h2>{international.map(e => <EventCard compact key={e.id} event={e}/>)}{!international.length && <Empty message="No hay eventos internacionales cargados para este fin de semana."/>}</div></div></section>
}

function EventDetail({ allEvents }) {
  const { id } = useParams()
  const event = allEvents.find(item => item.id === id)
  if (!event) return <section className="section page-top"><Empty message="No hemos encontrado este evento."/></section>
  const s = sportMeta(event.sport)
  return <section className="section page-top"><NavLink className="back" to={event.scope === 'local' ? '/calatayud' : '/internacional'}>← Volver</NavLink><div className="detail-hero"><div className="detail-icon">{s.icon}</div><div><div className="event-top"><ScopePill scope={event.scope}/><span>{s.label}</span><span>{event.competition}</span>{event.demo && <span className="demo-pill">DEMO</span>}</div><h1>{event.title}</h1><p>{event.description}</p></div></div><div className="detail-grid"><div><small>FECHA</small><strong>{formatDate(event.date)}</strong></div><div><small>HORA</small><strong>{event.time}</strong></div><div><small>LUGAR</small><strong>{event.venue}</strong></div><div><small>ÁMBITO</small><strong>{event.scope === 'local' ? 'Calatayud' : 'Internacional'}</strong></div></div></section>
}

function Admin({ customEvents, setCustomEvents }) {
  const navigate = useNavigate()
  const tomorrow = dateKey(addDays(new Date(), 1))
  const [form,setForm] = useState({ title:'', sport:'football', scope:'local', date:tomorrow, time:'18:00', venue:'Calatayud', competition:'Agenda local', description:'' })
  const submit = ev => { ev.preventDefault(); const item = { ...form, id:`custom-${Date.now()}`, featured:false, demo:false }; const next = [...customEvents,item]; setCustomEvents(next); saveCustomEvents(next); navigate(`/evento/${item.id}`) }
  return <section className="section page-top"><div className="page-heading"><span className="eyebrow">GESTIÓN LOCAL</span><h1>Nuevo evento</h1><p>Esta versión sigue guardando eventos únicamente en este navegador. Supabase y autenticación llegarán en la siguiente fase.</p></div><div className="admin-warning">🔒 Este panel es todavía una maqueta local. No publica datos para otros usuarios.</div><form onSubmit={submit} className="admin-form"><label><span>Nombre del evento</span><input required value={form.title} onChange={e => setForm({...form,title:e.target.value})}/></label><div className="form-row"><label><span>Ámbito</span><select value={form.scope} onChange={e => setForm({...form,scope:e.target.value})}><option value="local">Calatayud</option><option value="international">Internacional</option></select></label><label><span>Deporte</span><select value={form.sport} onChange={e => setForm({...form,sport:e.target.value})}>{sports.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}</select></label></div><div className="form-row"><label><span>Fecha</span><input type="date" min={todayKey()} value={form.date} onChange={e => setForm({...form,date:e.target.value})}/></label><label><span>Hora</span><input type="time" value={form.time} onChange={e => setForm({...form,time:e.target.value})}/></label></div><label><span>Lugar</span><input value={form.venue} onChange={e => setForm({...form,venue:e.target.value})}/></label><label><span>Competición</span><input value={form.competition} onChange={e => setForm({...form,competition:e.target.value})}/></label><label><span>Descripción</span><textarea rows="4" value={form.description} onChange={e => setForm({...form,description:e.target.value})}/></label><button className="btn primary" type="submit">Guardar evento en este navegador</button></form></section>
}

function Empty({ message = 'Prueba otro deporte, cambia la búsqueda o añade un evento.' }){ return <div className="empty"><span>🏟️</span><h3>No hay eventos para mostrar</h3><p>{message}</p></div> }
function NotFound(){ return <section className="section page-top"><div className="page-heading"><span className="eyebrow">404</span><h1>Página no encontrada</h1><p>La ruta que buscas no existe.</p><NavLink className="btn primary" to="/">Volver al inicio</NavLink></div></section> }

function App(){
  const [customEvents,setCustomEvents] = useState(() => readCustomEvents())
  const allEvents = [...seedEvents,...customEvents]
  return <Shell><Routes><Route path="/" element={<Home allEvents={allEvents}/>}/><Route path="/calatayud" element={<Listing title="Calatayud" subtitle="Todo lo que se juega cerca de ti: fútbol, pádel, tenis, running, ciclismo, baloncesto y más." scope="local" allEvents={allEvents}/>}/><Route path="/internacional" element={<Listing title="Internacional" subtitle="No todo el deporte. Solo lo que merece estar en tu agenda." scope="international" allEvents={allEvents}/>}/><Route path="/calendario" element={<Calendar allEvents={allEvents}/>}/><Route path="/fin-de-semana" element={<Weekend allEvents={allEvents}/>}/><Route path="/evento/:id" element={<EventDetail allEvents={allEvents}/>}/><Route path="/admin" element={<Admin customEvents={customEvents} setCustomEvents={setCustomEvents}/>}/><Route path="*" element={<NotFound/>}/></Routes></Shell>
}

ReactDOM.createRoot(document.getElementById('root')).render(<BrowserRouter><App/></BrowserRouter>)