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
  { id: 'cal-1', title: 'Torneo local de pádel', sport: 'padel', scope: 'local', date: '2026-09-26', time: '10:00', venue: 'Instalaciones deportivas de Calatayud', competition: 'Agenda local', featured: true, description: 'Evento de demostración para visualizar la agenda local.' },
  { id: 'cal-2', title: 'Jornada de fútbol local', sport: 'football', scope: 'local', date: '2026-09-27', time: '17:30', venue: 'Calatayud', competition: 'Agenda local', featured: true, description: 'Evento de demostración para visualizar la ficha y el calendario.' },
  { id: 'cal-3', title: 'Quedada ciclista', sport: 'cycling', scope: 'local', date: '2026-10-03', time: '09:00', venue: 'Salida desde Calatayud', competition: 'Ciclismo', featured: false, description: 'Evento de demostración.' },
  { id: 'int-1', title: 'Partido internacional destacado', sport: 'football', scope: 'international', date: '2026-09-26', time: '21:00', venue: 'Europa', competition: 'Fútbol internacional', featured: true, description: 'Marcador de demostración. En producción estos eventos llegarán desde una fuente deportiva.' },
  { id: 'int-2', title: 'Gran premio — clasificación', sport: 'motorsport', scope: 'international', date: '2026-09-26', time: '16:00', venue: 'Circuito internacional', competition: 'Motor', featured: true, description: 'Evento de demostración.' },
  { id: 'int-3', title: 'Final de tenis destacada', sport: 'tennis', scope: 'international', date: '2026-09-27', time: '16:00', venue: 'Circuito ATP/WTA', competition: 'Tenis', featured: true, description: 'Evento de demostración.' },
  { id: 'int-4', title: 'Etapa ciclista destacada', sport: 'cycling', scope: 'international', date: '2026-10-04', time: '13:30', venue: 'Europa', competition: 'Ciclismo internacional', featured: false, description: 'Evento de demostración.' },
]

const readCustomEvents = () => {
  try { return JSON.parse(localStorage.getItem('bilbilis-sports-events') || '[]') } catch { return [] }
}
const saveCustomEvents = events => localStorage.setItem('bilbilis-sports-events', JSON.stringify(events))
const formatDate = date => new Intl.DateTimeFormat('es-ES', { weekday: 'short', day: 'numeric', month: 'short' }).format(new Date(`${date}T12:00:00`))
const sportMeta = id => sports.find(s => s.id === id) || { icon: '🏅', label: 'Deporte' }

function Shell({ children }) {
  return <div className="app-shell">
    <header className="site-header">
      <NavLink to="/" className="brand"><span className="brand-mark">BS</span><span><strong>BÍLBILIS</strong><em>SPORTS</em></span></NavLink>
      <nav>
        <NavLink to="/calatayud">Calatayud</NavLink>
        <NavLink to="/internacional">Internacional</NavLink>
        <NavLink to="/calendario">Calendario</NavLink>
        <NavLink to="/fin-de-semana">Fin de semana</NavLink>
      </nav>
      <NavLink className="admin-link" to="/admin">Admin</NavLink>
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
      <div className="event-top"><ScopePill scope={event.scope} /><span>{s.label}</span></div>
      <h3>{event.title}</h3>
      <div className="event-meta"><strong>{formatDate(event.date)}</strong><span>{event.time}</span><span>{event.venue}</span></div>
    </div>
    <span className="arrow">→</span>
  </NavLink>
}

function Home({ allEvents }) {
  const featured = allEvents.filter(e => e.featured).slice(0, 4)
  const next = [...featured].sort((a,b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))[0]
  return <>
    <section className="hero">
      <div className="hero-copy"><span className="eyebrow">CALATAYUD + DEPORTE MUNDIAL</span><h1>Tu deporte.<br/><span>Todo en juego.</span></h1><p>Una agenda única para descubrir qué se juega en Calatayud y cuáles son los grandes eventos deportivos que merece la pena seguir.</p><div className="hero-actions"><NavLink className="btn primary" to="/calatayud">Explorar Calatayud</NavLink><NavLink className="btn ghost" to="/internacional">Ver internacional</NavLink></div></div>
      <div className="hero-panel"><span className="live-kicker">PRÓXIMO DESTACADO</span>{next && <><div className="big-sport">{sportMeta(next.sport).icon}</div><ScopePill scope={next.scope}/><h2>{next.title}</h2><div className="hero-event-time"><strong>{formatDate(next.date)}</strong><span>{next.time}</span></div><NavLink to={`/evento/${next.id}`}>Ver evento →</NavLink></>}</div>
    </section>
    <section className="section split-intro">
      <NavLink to="/calatayud" className="scope-card local-card"><span>🏠</span><small>DEPORTE LOCAL</small><h2>Calatayud</h2><p>Partidos, torneos, carreras, rutas y actividades deportivas de la ciudad y su entorno.</p><b>Entrar →</b></NavLink>
      <NavLink to="/internacional" className="scope-card world-card"><span>🌍</span><small>GRANDES EVENTOS</small><h2>Internacional</h2><p>Una selección de lo imprescindible en fútbol, tenis, motor, ciclismo y baloncesto.</p><b>Entrar →</b></NavLink>
    </section>
    <section className="section"><div className="section-head"><div><span className="eyebrow">AGENDA</span><h2>Lo próximo</h2></div><NavLink to="/calendario">Ver calendario completo →</NavLink></div><div className="event-list">{featured.map(e => <EventCard event={e} key={e.id}/>)}</div></section>
    <section className="section weekend-banner"><div><span className="eyebrow">PLAN RÁPIDO</span><h2>¿Qué hay este fin de semana?</h2><p>Una vista rápida para decidir qué ver, dónde ir y a qué hora empieza cada evento.</p></div><NavLink className="btn primary" to="/fin-de-semana">Abrir fin de semana</NavLink></section>
  </>
}

function Listing({ title, subtitle, scope, allEvents }) {
  const [sport, setSport] = useState('all')
  const filtered = allEvents.filter(e => e.scope === scope && (sport === 'all' || e.sport === sport)).sort((a,b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))
  return <section className="section page-top"><div className="page-heading"><span className="eyebrow">{scope === 'local' ? 'DEPORTE LOCAL' : 'GRANDES EVENTOS'}</span><h1>{title}</h1><p>{subtitle}</p></div><div className="filters"><button className={sport === 'all' ? 'active' : ''} onClick={() => setSport('all')}>Todos</button>{sports.map(s => <button key={s.id} className={sport === s.id ? 'active' : ''} onClick={() => setSport(s.id)}>{s.icon} {s.label}</button>)}</div><div className="result-count">{filtered.length} eventos</div><div className="event-list">{filtered.map(e => <EventCard key={e.id} event={e}/>)}{!filtered.length && <Empty/>}</div></section>
}

function Calendar({ allEvents }) {
  const groups = useMemo(() => [...allEvents].sort((a,b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`)).reduce((acc,e) => { (acc[e.date] ||= []).push(e); return acc }, {}), [allEvents])
  return <section className="section page-top"><div className="page-heading"><span className="eyebrow">TODO EL DEPORTE</span><h1>Calendario</h1><p>Calatayud e internacional reunidos en una sola agenda.</p></div><div className="calendar-groups">{Object.entries(groups).map(([date,events]) => <div className="calendar-day" key={date}><div className="date-block"><strong>{new Date(`${date}T12:00`).getDate()}</strong><span>{new Intl.DateTimeFormat('es-ES',{month:'short'}).format(new Date(`${date}T12:00`))}</span></div><div>{events.map(e => <EventCard compact key={e.id} event={e}/>)}</div></div>)}</div></section>
}

function Weekend({ allEvents }) {
  const weekend = allEvents.filter(e => ['2026-09-26','2026-09-27'].includes(e.date))
  return <section className="section page-top"><div className="page-heading"><span className="eyebrow">26–27 SEPTIEMBRE</span><h1>Este fin de semana</h1><p>Dos agendas, una sola vista.</p></div><div className="weekend-columns"><div><h2>🏠 En Calatayud</h2>{weekend.filter(e => e.scope === 'local').map(e => <EventCard compact key={e.id} event={e}/>)}</div><div><h2>🌍 En el mundo</h2>{weekend.filter(e => e.scope === 'international').map(e => <EventCard compact key={e.id} event={e}/>)}</div></div></section>
}

function EventDetail({ allEvents }) {
  const { id } = useParams(); const e = allEvents.find(x => x.id === id)
  if (!e) return <section className="section page-top"><Empty/></section>
  const s = sportMeta(e.sport)
  return <section className="section page-top"><NavLink className="back" to={e.scope === 'local' ? '/calatayud' : '/internacional'}>← Volver</NavLink><div className="detail-hero"><div className="detail-icon">{s.icon}</div><div><div className="event-top"><ScopePill scope={e.scope}/><span>{s.label}</span><span>{e.competition}</span></div><h1>{e.title}</h1><p>{e.description}</p></div></div><div className="detail-grid"><div><small>FECHA</small><strong>{formatDate(e.date)}</strong></div><div><small>HORA</small><strong>{e.time}</strong></div><div><small>LUGAR</small><strong>{e.venue}</strong></div><div><small>ÁMBITO</small><strong>{e.scope === 'local' ? 'Calatayud' : 'Internacional'}</strong></div></div></section>
}

function Admin({ customEvents, setCustomEvents }) {
  const navigate = useNavigate()
  const [form,setForm] = useState({ title:'', sport:'football', scope:'local', date:'2026-09-28', time:'18:00', venue:'Calatayud', competition:'Agenda local', description:'' })
  const submit = ev => { ev.preventDefault(); const item = { ...form, id:`custom-${Date.now()}`, featured:false }; const next = [...customEvents,item]; setCustomEvents(next); saveCustomEvents(next); navigate(`/evento/${item.id}`) }
  return <section className="section page-top"><div className="page-heading"><span className="eyebrow">GESTIÓN LOCAL</span><h1>Nuevo evento</h1><p>Primera versión del panel. Por ahora guarda los eventos en este navegador.</p></div><form onSubmit={submit} className="admin-form"><label><span>Nombre del evento</span><input required value={form.title} onChange={e => setForm({...form,title:e.target.value})}/></label><div className="form-row"><label><span>Ámbito</span><select value={form.scope} onChange={e => setForm({...form,scope:e.target.value})}><option value="local">Calatayud</option><option value="international">Internacional</option></select></label><label><span>Deporte</span><select value={form.sport} onChange={e => setForm({...form,sport:e.target.value})}>{sports.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}</select></label></div><div className="form-row"><label><span>Fecha</span><input type="date" value={form.date} onChange={e => setForm({...form,date:e.target.value})}/></label><label><span>Hora</span><input type="time" value={form.time} onChange={e => setForm({...form,time:e.target.value})}/></label></div><label><span>Lugar</span><input value={form.venue} onChange={e => setForm({...form,venue:e.target.value})}/></label><label><span>Competición</span><input value={form.competition} onChange={e => setForm({...form,competition:e.target.value})}/></label><label><span>Descripción</span><textarea rows="4" value={form.description} onChange={e => setForm({...form,description:e.target.value})}/></label><button className="btn primary" type="submit">Publicar evento de prueba</button></form></section>
}

function Empty(){ return <div className="empty"><span>🏟️</span><h3>No hay eventos en este filtro</h3><p>Prueba otro deporte o añade uno desde administración.</p></div> }

function App(){
  const [customEvents,setCustomEvents] = useState(() => readCustomEvents())
  const allEvents = [...seedEvents,...customEvents]
  return <Shell><Routes><Route path="/" element={<Home allEvents={allEvents}/>}/><Route path="/calatayud" element={<Listing title="Calatayud" subtitle="Todo lo que se juega cerca de ti: fútbol, pádel, tenis, running, ciclismo, baloncesto y más." scope="local" allEvents={allEvents}/>}/><Route path="/internacional" element={<Listing title="Internacional" subtitle="No todo el deporte. Solo lo que merece estar en tu agenda." scope="international" allEvents={allEvents}/>}/><Route path="/calendario" element={<Calendar allEvents={allEvents}/>}/><Route path="/fin-de-semana" element={<Weekend allEvents={allEvents}/>}/><Route path="/evento/:id" element={<EventDetail allEvents={allEvents}/>}/><Route path="/admin" element={<Admin customEvents={customEvents} setCustomEvents={setCustomEvents}/>}/></Routes></Shell>
}

ReactDOM.createRoot(document.getElementById('root')).render(<BrowserRouter><App/></BrowserRouter>)
