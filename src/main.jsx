import React, { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  Activity, ArrowDownRight, ArrowRight, ArrowUpRight, Bell, BookOpen,
  Bot, Check, CheckCircle2, ChevronDown, ChevronRight, CircleHelp,
  Clock3, Command, Database, Download, FileCheck2, FileSearch, FileText,
  Filter, GraduationCap, LayoutDashboard, LockKeyhole, Menu, MessageSquare,
  MoreHorizontal, Network, Plus, Search, Send, Settings, ShieldCheck,
  Sparkles, Users, X, Zap, PanelLeftClose, PanelLeftOpen, RefreshCw,
  Server, ChartNoAxesCombined, CalendarDays, ClipboardList, CircleDot,
  Eye, Terminal, BrainCircuit, DatabaseZap
} from 'lucide-react'
import './styles.css'

const sources = [
  { id:'logbook', name:'Digital Logbook', type:'Operational database', engine:'PostgreSQL', status:'Connected', records:'18,492', updated:'2 min ago', icon:BookOpen, color:'teal', desc:'Student placements, competencies, supervisor assessments and training progress.' },
  { id:'lms', name:'Learning Management System', type:'Learning platform', engine:'PostgreSQL', status:'Connected', records:'42,816', updated:'5 min ago', icon:GraduationCap, color:'blue', desc:'Courses, weekend classes, enrolments, attendance and learning activity.' },
  { id:'sis', name:'Legacy Student Information', type:'Legacy application', engine:'MySQL', status:'Demo source', records:'9,240', updated:'Sample data', icon:Users, color:'violet', desc:'Historical student profiles, cohorts and programme information.' },
  { id:'membership', name:'Membership Registry', type:'Institutional database', engine:'SQL Server', status:'Demo source', records:'6,735', updated:'Sample data', icon:ShieldCheck, color:'amber', desc:'Professional profiles, membership categories, status and renewal history.' },
  { id:'archive', name:'Document Archive', type:'Document repository', engine:'Files + vector index', status:'Demo source', records:'2,108', updated:'Sample data', icon:FileText, color:'rose', desc:'Policies, handbooks, circulars, guidelines and archived reports.' },
  { id:'finance', name:'Finance & Payments', type:'Legacy application', engine:'Oracle', status:'Not connected', records:'—', updated:'Awaiting access', icon:Database, color:'slate', desc:'Illustrative placeholder for a future authorized integration.' },
]

const promptList = [
  { icon:Users, title:'Student training overview', prompt:'Give me an overview of students currently undergoing professional training, including logbook completion and supervisor assessment status.' },
  { icon:CalendarDays, title:'Weekend class participation', prompt:'Summarize weekend class attendance and participation over the last 8 weeks, highlighting trends and gaps.' },
  { icon:ClipboardList, title:'Outstanding assessments', prompt:'Which students have outstanding supervisor assessments? Group the results by training centre.' },
  { icon:ChartNoAxesCombined, title:'Institutional performance', prompt:'Prepare an institutional performance summary using student progression, logbook activity and LMS participation.' },
]

const answerData = {
  title: 'Professional training overview',
  summary: 'There are 1,284 students currently marked as active in professional training across the demonstration dataset. 78% have updated their logbooks within the last 30 days. 146 students have at least one outstanding supervisor assessment.',
  metrics: [
    { label:'Active trainees', value:'1,284', delta:'+6.2%', tone:'good' },
    { label:'Recently active logbooks', value:'78%', delta:'1,002 students', tone:'good' },
    { label:'Outstanding assessments', value:'146', delta:'11.4% of active', tone:'warn' },
  ],
  findings: [
    { title:'Logbook activity', text:'1,002 active trainees have recorded an update in the last 30 days. 282 have not.', tag:'Logbook', tone:'teal' },
    { title:'Supervisor assessments', text:'146 trainees have one or more assessment items awaiting supervisor review.', tag:'Logbook', tone:'amber' },
    { title:'Cross-system match', text:'1,196 of the 1,284 active trainees were matched to an LMS learner profile. 88 require identity reconciliation.', tag:'Logbook + LMS', tone:'violet' },
  ]
}

function App(){
  const [page,setPage] = useState('Overview')
  const [collapsed,setCollapsed] = useState(false)
  const [mobileNav,setMobileNav] = useState(false)
  const [query,setQuery] = useState('')
  const [chatStarted,setChatStarted] = useState(false)
  const [activeTab,setActiveTab] = useState('Evidence')
  const [activeSource,setActiveSource] = useState(null)
  const [sourceFilter,setSourceFilter] = useState('All')
  const [showNotifications,setShowNotifications] = useState(false)
  const [showProfile,setShowProfile] = useState(false)
  const [toast,setToast] = useState('')
  const [history,setHistory] = useState([])
  const [selectedPrompt,setSelectedPrompt] = useState(null)

  const notify = (msg) => { setToast(msg); window.setTimeout(()=>setToast(''),2600) }
  const ask = (text) => {
    const clean = text.trim()
    if(!clean) return
    setQuery(clean); setChatStarted(true); setSelectedPrompt(null)
    setHistory(h=>[{q:clean, time:'Just now'},...h])
    setPage('Ask Intelligence')
  }
  const nav = (p) => { setPage(p); setMobileNav(false); if(p!=='Ask Intelligence') setChatStarted(false) }

  const filteredSources = useMemo(()=>sources.filter(s=>sourceFilter==='All'||s.status===sourceFilter),[sourceFilter])

  return <div className="app-shell">
    <aside className={`sidebar ${collapsed?'collapsed':''} ${mobileNav?'mobile-open':''}`}>
      <div className="brand">
        <div className="brand-mark"><BrainCircuit size={21}/></div>
        {!collapsed && <div className="brand-copy"><strong>WACP <span>INTELLIGENCE</span></strong><small>Institutional intelligence</small></div>}
        <button className="icon-btn collapse-btn" onClick={()=>setCollapsed(!collapsed)} title="Collapse sidebar">{collapsed?<PanelLeftOpen size={17}/>:<PanelLeftClose size={17}/>}</button>
      </div>
      <div className="workspace-label">{!collapsed && 'WORKSPACE'}</div>
      <nav className="nav-list">
        <NavItem icon={LayoutDashboard} label="Overview" active={page==='Overview'} collapsed={collapsed} onClick={()=>nav('Overview')}/>
        <NavItem icon={MessageSquare} label="Ask Intelligence" active={page==='Ask Intelligence'} collapsed={collapsed} onClick={()=>nav('Ask Intelligence')} badge="AI"/>
        <NavItem icon={Network} label="Data sources" active={page==='Data sources'} collapsed={collapsed} onClick={()=>nav('Data sources')}/>
        <NavItem icon={Activity} label="Activity & audit" active={page==='Activity & audit'} collapsed={collapsed} onClick={()=>nav('Activity & audit')}/>
      </nav>
      <div className="workspace-label second">{!collapsed && 'MANAGE'}</div>
      <nav className="nav-list">
        <NavItem icon={Settings} label="Settings" active={page==='Settings'} collapsed={collapsed} onClick={()=>nav('Settings')}/>
      </nav>
      <div className="sidebar-bottom">
        <div className="environment-card">
          <div className="env-icon"><ShieldCheck size={16}/></div>
          {!collapsed && <div><strong>Demo environment</strong><small>Synthetic data · Read only</small></div>}
          {!collapsed && <span className="live-dot"/>}
        </div>
        {!collapsed && <div className="sidebar-foot">WACP Intelligence <span>v0.1.0 · Prototype</span></div>}
      </div>
    </aside>

    {mobileNav && <div className="mobile-scrim" onClick={()=>setMobileNav(false)}/>}
    <main className="main-area">
      <header className="topbar">
        <div className="top-left">
          <button className="icon-btn mobile-menu" onClick={()=>setMobileNav(true)}><Menu size={19}/></button>
          <div className="breadcrumbs"><span>Workspace</span><ChevronRight size={14}/><strong>{page}</strong></div>
        </div>
        <div className="top-actions">
          <div className="env-pill"><span className="live-dot"/> Demo environment</div>
          <div className="top-pop-wrap">
            <button className="icon-btn notification-btn" onClick={()=>setShowNotifications(!showNotifications)}><Bell size={18}/><i/></button>
            {showNotifications && <div className="popover notification-pop"><strong>Notifications</strong><p><span className="notice-dot teal-dot"/> 2 source connectors are using demonstration data.</p><p><span className="notice-dot amber-dot"/> Finance source is awaiting authorization.</p></div>}
          </div>
          <div className="top-pop-wrap">
            <button className="profile-btn" onClick={()=>setShowProfile(!showProfile)}><div className="avatar">AO</div><span>Admin Operator</span><ChevronDown size={14}/></button>
            {showProfile && <div className="popover profile-pop"><strong>Admin Operator</strong><small>Institutional administrator</small><button onClick={()=>{setShowProfile(false);nav('Settings')}}>Workspace settings</button></div>}
          </div>
        </div>
      </header>

      <div className="page-content">
        {page==='Overview' && <Overview onAsk={ask} onNavigate={nav} notify={notify}/>}
        {page==='Ask Intelligence' && <ChatPage query={query} setQuery={setQuery} chatStarted={chatStarted} setChatStarted={setChatStarted} ask={ask} activeTab={activeTab} setActiveTab={setActiveTab} notify={notify}/>}
        {page==='Data sources' && <SourcesPage sources={filteredSources} allSources={sources} filter={sourceFilter} setFilter={setSourceFilter} activeSource={activeSource} setActiveSource={setActiveSource} notify={notify}/>}
        {page==='Activity & audit' && <AuditPage history={history} notify={notify}/>}
        {page==='Settings' && <SettingsPage notify={notify}/>}
      </div>
      <footer className="global-footer"><span><span className="live-dot"/> All systems operational</span><span>Prototype interface · Data shown is illustrative</span><span>Privacy & security <LockKeyhole size={12}/></span></footer>
    </main>
    {toast && <div className="toast"><CheckCircle2 size={17}/>{toast}</div>}
  </div>
}

function NavItem({icon:Icon,label,active,collapsed,onClick,badge}){
  return <button className={`nav-item ${active?'active':''}`} onClick={onClick} title={collapsed?label:undefined}>
    <Icon size={18}/>{!collapsed && <><span>{label}</span>{badge&&<em>{badge}</em>}</>}
  </button>
}

function PageHeading({eyebrow,title,description,action}){
  return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>{action}</div>
}

function Overview({onAsk,onNavigate,notify}){
  const [range,setRange]=useState('Last 30 days')
  return <>
    <PageHeading eyebrow="INSTITUTIONAL OVERVIEW" title="Good morning, Admin." description="A connected view of your institutional information landscape."
      action={<button className="btn btn-secondary" onClick={()=>notify('Overview report prepared for this demo.')}><Download size={15}/> Export overview</button>}/>
    <div className="hero-panel">
      <div className="hero-content">
        <div className="hero-kicker"><Sparkles size={14}/> YOUR INTELLIGENCE WORKSPACE</div>
        <h2>Ask your institution<br/><span>anything.</span></h2>
        <p>Explore information across connected systems, uncover operational insights and get answers grounded in source records.</p>
        <button className="btn btn-primary" onClick={()=>onNavigate('Ask Intelligence')}>Ask Intelligence <ArrowRight size={16}/></button>
      </div>
      <div className="hero-visual">
        <div className="orb orb-one"/><div className="orb orb-two"/><div className="orb-core"><BrainCircuit size={42}/></div>
        <div className="orbit-node node-a"><Database size={17}/></div><div className="orbit-node node-b"><BookOpen size={17}/></div><div className="orbit-node node-c"><GraduationCap size={17}/></div><div className="orbit-node node-d"><FileText size={17}/></div>
        <div className="visual-caption"><span className="live-dot"/> Intelligence layer active</div>
      </div>
    </div>

    <div className="section-row"><div><h3>Institutional data landscape</h3><p>Sources available to the intelligence layer</p></div><button className="text-btn" onClick={()=>onNavigate('Data sources')}>Manage sources <ArrowRight size={14}/></button></div>
    <div className="stat-grid">
      <StatCard icon={Network} label="Data sources" value="6" meta="2 connected · 3 demo · 1 pending" tone="teal"/>
      <StatCard icon={Database} label="Indexed records" value="79.3K" meta="Across available demo sources" tone="blue"/>
      <StatCard icon={Zap} label="Queries this month" value="1,248" meta={<><ArrowUpRight size={13}/> 18.6% vs. previous month</>} tone="violet"/>
      <StatCard icon={ShieldCheck} label="Evidence coverage" value="98.4%" meta="Responses with traceable sources" tone="amber"/>
    </div>

    <div className="content-grid">
      <section className="panel source-panel">
        <div className="panel-head"><div><h3>Connected sources</h3><p>Connection status and latest synchronization</p></div><button className="more-btn" onClick={()=>onNavigate('Data sources')}><MoreHorizontal size={18}/></button></div>
        <div className="source-list">
          {sources.slice(0,4).map(s=><SourceRow key={s.id} source={s}/>)}
        </div>
        <button className="panel-link" onClick={()=>onNavigate('Data sources')}>View all data sources <ArrowRight size={14}/></button>
      </section>
      <section className="panel activity-panel">
        <div className="panel-head"><div><h3>Recent intelligence activity</h3><p>Latest queries and system events</p></div><button className="more-btn" onClick={()=>onNavigate('Activity & audit')}><MoreHorizontal size={18}/></button></div>
        <div className="activity-list">
          <ActivityRow icon={MessageSquare} title="Student training overview" detail="Admin Operator · 3 sources queried" time="10:42 AM" tone="teal"/>
          <ActivityRow icon={FileSearch} title="Weekend class attendance report" detail="Academic Coordinator · 2 sources queried" time="Yesterday" tone="blue"/>
          <ActivityRow icon={RefreshCw} title="Logbook source synchronized" detail="Digital Logbook · 1,284 records checked" time="Yesterday" tone="violet"/>
          <ActivityRow icon={ShieldCheck} title="Access policy evaluated" detail="Admin Operator · Read-only permission" time="Nov 19" tone="amber"/>
        </div>
        <button className="panel-link" onClick={()=>onNavigate('Activity & audit')}>View activity log <ArrowRight size={14}/></button>
      </section>
    </div>

    <div className="bottom-callout">
      <div className="callout-icon"><MessageSquare size={20}/></div>
      <div><strong>Start with a question</strong><p>Ask across logbook, learning and institutional records in one place.</p></div>
      <button className="btn btn-dark" onClick={()=>onNavigate('Ask Intelligence')}>Open AI workspace <ArrowRight size={15}/></button>
    </div>
  </>
}

function StatCard({icon:Icon,label,value,meta,tone}){
  return <div className="stat-card"><div className={`stat-icon ${tone}`}><Icon size={18}/></div><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-meta">{meta}</div></div>
}
function SourceRow({source:s}){
  const Icon=s.icon
  return <div className="source-row"><div className={`source-icon ${s.color}`}><Icon size={17}/></div><div className="source-info"><strong>{s.name}</strong><small>{s.engine} · {s.records} records</small></div><div className="source-right"><span className={`status ${s.status==='Connected'?'connected':s.status==='Demo source'?'demo':'pending'}`}><i/>{s.status}</span><small>{s.updated}</small></div></div>
}
function ActivityRow({icon:Icon,title,detail,time,tone}){
  return <div className="activity-row"><div className={`activity-icon ${tone}`}><Icon size={15}/></div><div className="activity-info"><strong>{title}</strong><small>{detail}</small></div><time>{time}</time></div>
}

function ChatPage({query,setQuery,chatStarted,setChatStarted,ask,activeTab,setActiveTab,notify}){
  const [showSources,setShowSources]=useState(true)
  const [showTrace,setShowTrace]=useState(false)
  const [followup,setFollowup]=useState('')
  const send = (e)=>{e?.preventDefault();if(query.trim()){setChatStarted(true);notify('Demo response generated from sample institutional data.')}} 
  const currentQuestion = query || promptList[0].prompt
  return <>
    <PageHeading eyebrow="AI WORKSPACE" title="Ask Intelligence" description="Ask questions across institutional systems in natural language."
      action={<div className="secure-label"><LockKeyhole size={14}/> Read-only session</div>}/>
    <div className="chat-layout">
      <div className="chat-main">
        {!chatStarted ? <div className="chat-welcome">
          <div className="welcome-orb"><BrainCircuit size={30}/></div>
          <div className="eyebrow">WACP INTELLIGENCE</div>
          <h2>Your institution,<br/><span>within reach.</span></h2>
          <p>Ask a question. I'll find relevant information across your connected systems and show you exactly where the answer came from.</p>
          <div className="prompt-grid">{promptList.map((p,i)=>{const Icon=p.icon;return <button className="prompt-card" key={i} onClick={()=>ask(p.prompt)}><div className="prompt-icon"><Icon size={17}/></div><strong>{p.title}</strong><p>{p.prompt}</p><ArrowUpRight size={15} className="prompt-arrow"/></button>})}</div>
        </div> : <div className="conversation">
          <div className="message user-message"><div className="avatar small-avatar">AO</div><div><div className="message-label">YOU <span>Just now</span></div><p>{currentQuestion}</p></div></div>
          <div className="assistant-message">
            <div className="assistant-avatar"><BrainCircuit size={17}/></div>
            <div className="assistant-body">
              <div className="message-label">WACP INTELLIGENCE <span className="response-status"><i/> Answer generated</span></div>
              <h3>{answerData.title}</h3>
              <p className="answer-summary">{answerData.summary}</p>
              <div className="answer-metrics">{answerData.metrics.map(m=><div className="answer-metric" key={m.label}><small>{m.label}</small><strong>{m.value}</strong><span className={m.tone}>{m.delta}</span></div>)}</div>
              <h4>Key findings</h4>
              <div className="finding-list">{answerData.findings.map(f=><div className="finding" key={f.title}><div className="finding-check"><Check size={14}/></div><div><strong>{f.title}</strong><p>{f.text}</p></div><span className={`tag ${f.tone}`}>{f.tag}</span></div>)}</div>
              <div className="answer-foot"><span><ShieldCheck size={14}/> Grounded in 3 source systems</span><span><Clock3 size={13}/> 1.8s · Demo execution</span></div>
            </div>
          </div>
          <div className="inspector">
            <div className="inspector-tabs">{['Evidence','Execution trace','Sources'].map(t=><button key={t} className={activeTab===t?'selected':''} onClick={()=>setActiveTab(t)}>{t}{t==='Evidence'&&<span className="tab-count">6</span>}</button>)}</div>
            {activeTab==='Evidence'&&<div className="evidence-content">
              <div className="evidence-head"><div><strong>Supporting records</strong><p>Sample records supporting this answer</p></div><button className="text-btn" onClick={()=>notify('Evidence export prepared for demo.')}><Download size={14}/> Export</button></div>
              <div className="evidence-table-wrap"><table><thead><tr><th>Record</th><th>Source</th><th>Evidence</th><th>Updated</th></tr></thead><tbody>
                <tr><td><strong>STU-2024-0812</strong><small>Student profile</small></td><td><span className="mini-source teal-bg">Logbook</span></td><td>Active training · 12 entries</td><td>2 days ago</td></tr>
                <tr><td><strong>STU-2024-0921</strong><small>Student profile</small></td><td><span className="mini-source teal-bg">Logbook</span></td><td>Assessment pending</td><td>4 days ago</td></tr>
                <tr><td><strong>STU-2023-0448</strong><small>Learner profile</small></td><td><span className="mini-source blue-bg">LMS</span></td><td>Matched learner · 84% attendance</td><td>Yesterday</td></tr>
                <tr><td><strong>STU-2024-1106</strong><small>Student profile</small></td><td><span className="mini-source teal-bg">Logbook</span></td><td>No update in 42 days</td><td>42 days ago</td></tr>
              </tbody></table></div>
              <div className="evidence-note"><CircleHelp size={14}/> Illustrative records only. Real deployments will display source identifiers and retrieval timestamps.</div>
            </div>}
            {activeTab==='Execution trace'&&<div className="trace-content">
              <div className="trace-summary"><span><CheckCircle2 size={15}/> Execution completed</span><span>1.8 seconds</span></div>
              <TraceStep n="01" title="Intent classification" detail="institutional.student_training_overview" time="0.12s" status="Complete"/>
              <TraceStep n="02" title="Source selection" detail="Digital Logbook · LMS · Legacy SIS" time="0.08s" status="Complete"/>
              <TraceStep n="03" title="Structured retrieval" detail="3 read-only queries · 2,480 rows scanned" time="0.91s" status="Complete"/>
              <TraceStep n="04" title="Entity reconciliation" detail="Student identifiers normalized and matched" time="0.34s" status="Complete"/>
              <TraceStep n="05" title="Answer synthesis" detail="Metrics calculated and evidence attached" time="0.35s" status="Complete"/>
              <div className="sql-preview"><div><Terminal size={14}/> QUERY PREVIEW <span>READ ONLY</span></div><code>SELECT student_id, last_logbook_entry, assessment_status<br/>FROM training_overview<br/>WHERE training_status = 'active';</code></div>
            </div>}
            {activeTab==='Sources'&&<div className="sources-used">{sources.slice(0,3).map(s=><div className="used-source" key={s.id}><div className={`source-icon ${s.color}`}><s.icon size={16}/></div><div><strong>{s.name}</strong><small>{s.engine} · Read-only connector</small></div><span className="status connected"><i/> Queried</span></div>)}</div>}
          </div>
          <div className="followup-row"><span>Suggested follow-up</span><button onClick={()=>ask('Show me the 20 students with the oldest outstanding supervisor assessments.')}>Show students with oldest outstanding assessments <ArrowRight size={13}/></button></div>
        </div>}
        <form className="chat-composer" onSubmit={send}>
          <textarea value={query} onChange={e=>setQuery(e.target.value)} placeholder="Ask a question about your institutional data..." rows="2" onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send()}}}/>
          <div className="composer-bottom"><div className="composer-hints"><span><LockKeyhole size={12}/> Read-only access</span><span><Database size={12}/> 5 available sources</span></div><button className="send-btn" type="submit" disabled={!query.trim()}><Send size={16}/></button></div>
        </form>
        <div className="chat-disclaimer">AI-generated responses should be verified against source records. This demonstration uses synthetic data.</div>
      </div>
      <aside className="chat-sidebar">
        <div className="side-card">
          <div className="side-card-head"><strong><Network size={15}/> Available sources</strong><button className="icon-btn" onClick={()=>setShowSources(!showSources)}>{showSources?<ChevronDown size={16}/>:<ChevronRight size={16}/>}</button></div>
          {showSources&&<div className="available-list">{sources.filter(s=>s.status!=='Not connected').map(s=><div className="available-source" key={s.id}><span className={`tiny-source ${s.color}`}><s.icon size={13}/></span><div><strong>{s.name}</strong><small>{s.records} records</small></div><i className="live-dot"/></div>)}</div>}
          <button className="side-link" onClick={()=>notify('Source management is available in Data sources.')}>Manage connections <ArrowRight size={13}/></button>
        </div>
        <div className="side-card">
          <strong><ShieldCheck size={15}/> Security context</strong>
          <div className="security-item"><span>Session role</span><strong>Administrator</strong></div>
          <div className="security-item"><span>Data access</span><strong>Read only</strong></div>
          <div className="security-item"><span>Audit logging</span><strong className="good-text"><CheckCircle2 size={13}/> Enabled</strong></div>
          <div className="security-item"><span>Environment</span><strong>Demo</strong></div>
        </div>
        <div className="side-card help-card"><div className="help-icon"><Sparkles size={17}/></div><strong>Better questions, better answers.</strong><p>Be specific about the time period, population or outcome you're investigating.</p><button className="side-link" onClick={()=>notify('Prompt guide opened in this demo.')}>View prompt guide <ArrowRight size={13}/></button></div>
      </aside>
    </div>
  </>
}
function TraceStep({n,title,detail,time,status}){
  return <div className="trace-step"><div className="trace-number">{n}</div><div className="trace-main"><strong>{title}</strong><small>{detail}</small></div><span className="trace-time">{time}</span><span className="trace-check"><Check size={12}/></span></div>
}

function SourcesPage({sources,allSources,filter,setFilter,activeSource,setActiveSource,notify}){
  const [search,setSearch]=useState('')
  const visible=sources.filter(s=>s.name.toLowerCase().includes(search.toLowerCase()))
  return <>
    <PageHeading eyebrow="CONNECTORS & INTEGRATIONS" title="Data sources" description="A unified registry of institutional systems available to the intelligence layer."
      action={<button className="btn btn-primary" onClick={()=>notify('Connector setup wizard is a planned capability.')}><Plus size={16}/> Add data source</button>}/>
    <div className="source-summary-grid"><div className="mini-stat"><span>Connected</span><strong>2</strong><small>Live demo connectors</small></div><div className="mini-stat"><span>Demo sources</span><strong>3</strong><small>Simulated source profiles</small></div><div className="mini-stat"><span>Awaiting access</span><strong>1</strong><small>Not yet authorized</small></div><div className="mini-stat"><span>Records available</span><strong>79.3K</strong><small>Illustrative dataset</small></div></div>
    <div className="toolbar"><div className="search-field"><Search size={16}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search data sources..."/></div><div className="filter-pills">{['All','Connected','Demo source','Not connected'].map(f=><button className={filter===f?'active':''} key={f} onClick={()=>setFilter(f)}>{f}</button>)}</div></div>
    <div className="source-cards">{visible.map(s=>{const Icon=s.icon;return <div className={`source-card ${activeSource===s.id?'chosen':''}`} key={s.id} onClick={()=>setActiveSource(activeSource===s.id?null:s.id)}><div className="source-card-top"><div className={`source-icon large ${s.color}`}><Icon size={21}/></div><span className={`status ${s.status==='Connected'?'connected':s.status==='Demo source'?'demo':'pending'}`}><i/>{s.status}</span><button className="more-btn" onClick={e=>{e.stopPropagation();notify(`${s.name} options opened.`)}}><MoreHorizontal size={18}/></button></div><h3>{s.name}</h3><p>{s.desc}</p><div className="source-card-meta"><span><Database size={13}/>{s.engine}</span><span><FileText size={13}/>{s.records} records</span></div><div className="source-card-foot"><span>Last sync: {s.updated}</span><button onClick={e=>{e.stopPropagation();setActiveSource(s.id)}}>View details <ArrowRight size={13}/></button></div>
      {activeSource===s.id&&<div className="source-detail"><div><span>Source type</span><strong>{s.type}</strong></div><div><span>Connection mode</span><strong>{s.status==='Connected'?'Read-only connector':'Illustrative / planned'}</strong></div><div><span>Permissions</span><strong>SELECT / READ</strong></div><button className="btn btn-secondary full-btn" onClick={e=>{e.stopPropagation();notify('Connection test completed in demo mode.')}}><RefreshCw size={14}/> Test connection</button></div>}
    </div>})}</div>
    <div className="integration-note"><div className="note-icon"><CircleHelp size={18}/></div><div><strong>Designed for heterogeneous environments</strong><p>Connectors can be added for SQL databases, REST APIs, legacy applications, document stores and file-based archives. Each integration is permission-scoped and independently auditable.</p></div></div>
  </>
}

function AuditPage({history,notify}){
  const entries=[
    {time:'Today, 10:42:18',actor:'Admin Operator',action:'Natural language query',detail:'Student training overview',sources:'Logbook · LMS · Legacy SIS',status:'Completed'},
    {time:'Today, 10:38:02',actor:'System',action:'Source health check',detail:'Digital Logbook connector',sources:'PostgreSQL',status:'Completed'},
    {time:'Yesterday, 16:21:44',actor:'Academic Coordinator',action:'Natural language query',detail:'Weekend class attendance report',sources:'LMS · Legacy SIS',status:'Completed'},
    {time:'Yesterday, 14:05:11',actor:'System',action:'Index synchronization',detail:'Document Archive',sources:'Document repository',status:'Completed'},
    {time:'Nov 19, 09:12:31',actor:'Admin Operator',action:'Permission evaluation',detail:'Read-only administrator role',sources:'Policy engine',status:'Allowed'},
    ...history.map(h=>({time:h.time,actor:'Admin Operator',action:'Natural language query',detail:h.q,sources:'Demo sources',status:'Completed'}))
  ]
  return <>
    <PageHeading eyebrow="GOVERNANCE & OBSERVABILITY" title="Activity & audit" description="A traceable record of intelligence queries, connector activity and access decisions."
      action={<button className="btn btn-secondary" onClick={()=>notify('Audit log export prepared for demo.')}><Download size={15}/> Export audit log</button>}/>
    <div className="audit-banner"><div className="audit-banner-icon"><ShieldCheck size={22}/></div><div><strong>Audit trail is enabled</strong><p>Each demonstration query records its actor, intent, source systems, execution outcome and timestamp.</p></div><span className="status connected"><i/> Active</span></div>
    <div className="audit-stats"><StatCard icon={Activity} label="Events recorded" value="2,481" meta="Last 30 days" tone="teal"/><StatCard icon={MessageSquare} label="Intelligence queries" value="1,248" meta="Across all roles" tone="blue"/><StatCard icon={ShieldCheck} label="Access decisions" value="1,233" meta="All policy evaluated" tone="violet"/><StatCard icon={AlertCircleIcon} label="Blocked actions" value="0" meta="No denied actions in demo" tone="amber"/></div>
    <div className="panel audit-table-panel"><div className="panel-head"><div><h3>Event log</h3><p>Recent system activity</p></div><button className="filter-btn" onClick={()=>notify('Filters are illustrative in this prototype.')}><Filter size={14}/> Filters</button></div><div className="table-scroll"><table className="audit-table"><thead><tr><th>Timestamp</th><th>Actor</th><th>Event</th><th>Sources / context</th><th>Status</th></tr></thead><tbody>{entries.map((e,i)=><tr key={i}><td>{e.time}</td><td><strong>{e.actor}</strong></td><td><strong>{e.action}</strong><small>{e.detail}</small></td><td>{e.sources}</td><td><span className="status connected"><i/>{e.status}</span></td></tr>)}</tbody></table></div></div>
  </>
}
function AlertCircleIcon({size=18}){return <CircleDot size={size}/>}

function SettingsPage({notify}){
  const [toggles,setToggles]=useState({evidence:true,audit:true,readonly:true,confirm:true})
  const toggle=(k)=>setToggles(t=>({...t,[k]:!t[k]}))
  const rows=[
    ['evidence','Require evidence for factual answers','Answers should include source references and retrieved records.'],
    ['audit','Log all intelligence activity','Record user, query, sources accessed and execution outcomes.'],
    ['readonly','Enforce read-only data access','Prevent the intelligence layer from modifying source systems.'],
    ['confirm','Require approval for agent actions','Human approval before any future write operation or workflow trigger.']
  ]
  return <>
    <PageHeading eyebrow="WORKSPACE CONFIGURATION" title="Settings" description="Configure the governance principles for the intelligence workspace."/>
    <div className="settings-layout">
      <div className="panel settings-panel"><div className="panel-head"><div><h3>Security & governance</h3><p>Controls for responsible institutional intelligence</p></div><span className="status connected"><i/> Policy active</span></div>
        {rows.map(([key,title,desc])=><div className="setting-row" key={key}><div><strong>{title}</strong><p>{desc}</p></div><button className={`switch ${toggles[key]?'on':''}`} onClick={()=>toggle(key)} aria-label={`Toggle ${title}`}><i/></button></div>)}
      </div>
      <div className="panel settings-panel"><div className="panel-head"><div><h3>Workspace information</h3><p>Current prototype environment</p></div></div>
        <div className="info-row"><span>Workspace</span><strong>WACP Intelligence</strong></div><div className="info-row"><span>Environment</span><strong>Demonstration</strong></div><div className="info-row"><span>Version</span><strong>0.1.0</strong></div><div className="info-row"><span>Data classification</span><strong>Synthetic sample data</strong></div><div className="info-row"><span>AI provider</span><strong>Not configured</strong></div>
        <div className="settings-warning"><ShieldCheck size={17}/><p>Production deployment requires institutional authorization, identity integration, security review and approved data-processing arrangements.</p></div>
      </div>
    </div>
    <div className="settings-actions"><button className="btn btn-primary" onClick={()=>notify('Settings saved for this browser session.')}>Save configuration <Check size={15}/></button></div>
  </>
}

createRoot(document.getElementById('root')).render(<App/>)
