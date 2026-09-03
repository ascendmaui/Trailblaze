import React, { useEffect, useRef, useState } from 'react';
import { ClerkProvider, SignIn, SignUp, useClerk, useSession, useUser } from '@clerk/clerk-react';
import { createRoot } from 'react-dom/client';
import { setSupabaseAccessTokenProvider, supabase } from './lib/supabase';
import './styles.css';

const A = '/assets/';
const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_YXB0LWJlZGJ1Zy02MDAwLmNsZXJrLmFjY291bnRzLmRldiQ';
const executiveExperienceKey = 'trailblaze_executive_experience_complete';

function Icon({ name, size = 24 }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };
  const paths = {
    shield: <><path d="M12 3 20 6v5c0 5.2-3.4 8.6-8 10-4.6-1.4-8-4.8-8-10V6l8-3Z"/><path d="m8 12 2.2 2.2L16 8.8"/></>,
    hammer: <><path d="m14.5 5.5 4 4"/><path d="m12 8 4 4"/><path d="m3 21 8.8-8.8"/><path d="m5 11 3-3 5 5-3 3z"/><path d="m15 4 2-2 5 5-2 2z"/></>,
    home: <><path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></>,
    tree: <><path d="M12 22V8"/><path d="m12 2-5 8h3l-4 6h5l-2 4h6l-2-4h5l-4-6h3z"/></>,
    users: <><circle cx="9" cy="8" r="3"/><path d="M3 20c.4-3.6 2.3-5.5 6-5.5s5.6 1.9 6 5.5"/><path d="M16 5.5a3 3 0 0 1 0 5.8M17 14.7c2.4.5 3.7 2.2 4 5.3"/></>,
    phone: <><path d="M6.5 3.5 9 3l2 5-2.4 1.6a15 15 0 0 0 5.3 5.3l1.6-2.4 5 2-.5 2.5a2 2 0 0 1-2.3 1.6C10.6 17.2 6.8 13.4 4.9 5.8A2 2 0 0 1 6.5 3.5Z"/></>,
    arrow: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
    chevron: <path d="m9 18 6-6-6-6"/>,
    clipboard: <><rect x="6" y="4" width="12" height="17" rx="2"/><path d="M9 4.5V3h6v1.5M9 9h6M9 13h6M9 17h3"/></>,
    wallet: <><path d="M4 6h15a2 2 0 0 1 2 2v10H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h13"/><path d="M16 13h5"/><circle cx="16" cy="13" r=".7"/></>,
    bell: <><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z"/><path d="M10 21h4"/></>,
    chart: <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></>,
    lock: <><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>,
    search: <><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></>,
    filter: <path d="M4 5h16l-6 7v6l-4 2v-8L4 5Z"/>,
    check: <path d="m5 12 4 4L19 6"/>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    user: <><circle cx="12" cy="8" r="3.5"/><path d="M4 21c.6-4 3.2-6 8-6s7.4 2 8 6"/></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></>,
    map: <><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z"/><path d="M9 3v15M15 6v15"/></>,
    star: <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9z"/>,
    info: <><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></>,
    download: <><path d="M12 3v12M7 10l5 5 5-5M4 21h16"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18M8 14h3M8 17h5"/></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16"/></>,
    eye: <><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="2.5"/></>,
    send: <><path d="m21 3-7.5 18-3.5-7-7-3.5z"/><path d="M10 14 21 3"/></>,
    key: <><circle cx="8" cy="15" r="4"/><path d="m11 12 8-8M16 5l3 3M14 7l3 3"/></>,
    bubble: <><path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.8 8.8 0 0 1-4-.9L4 20l1.4-3.4A7.3 7.3 0 0 1 4.5 12 7.5 7.5 0 0 1 12 4.5a7.5 7.5 0 0 1 8 7Z"/></>,
    briefcase: <><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v2h4v-2"/></>,
  };
  return <svg {...common}>{paths[name] || paths.chevron}</svg>;
}

function Mark({ inverse = false }) {
  return <span className={`mark ${inverse ? 'mark-inverse' : ''}`}><Icon name="home" size={25} /></span>;
}

function Brand({ inverse = false }) {
  return <a className={`brand ${inverse ? 'brand-inverse' : ''}`} href="/" onClick={(e) => { e.preventDefault(); go('/'); }}><Mark inverse={inverse} /><span><strong>TRAILBLAZE</strong><small>CONSTRUCTION</small></span></a>;
}

function go(path) { window.history.pushState({}, '', path); window.dispatchEvent(new PopStateEvent('popstate')); window.scrollTo({ top: 0, behavior: 'smooth' }); }

const nav = [['Home', '/'], ['About', '/about'], ['Services', '/services'], ['Our Work', '/work'], ['Reviews', '/reviews'], ['Careers', '/careers'], ['Contact', '/contact']];

const roleLabel = (role) => role === 'platform_admin' ? 'Developer Admin' : role === 'owner' ? 'Owner' : role === 'manager' ? 'Manager' : role === 'applicant' ? 'Applicant' : 'Employee';
const prettyStatus = (status = '') => status.replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
const money = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(amount || 0));
const dateTime = (value) => value ? new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) : 'No due date';

const experienceProfile = {
  companyName: 'Trailblaze Construction',
  productName: 'Trailblaze OS',
  preferredName: 'Brooks',
  partnerName: 'Partner name pending',
  infrastructureClaim: 'Connected to configurable frontier AI infrastructure for this private demonstration.',
  guardrail: 'Customer-facing AI only answers public service, quote, scheduling, and project-intake questions.',
};

const executiveScenes = [
  { key: 'initializing', label: 'SYSTEM ONLINE', title: 'Trailblaze AI is coming online.', copy: 'Audio, visual systems, and presentation controls are active.', duration: 5200 },
  { key: 'identity', label: 'IDENTITY CONFIRMED', title: 'Hello, Brooks.', copy: 'Welcome to your interactive Trailblaze OS experience.', duration: 5400, speak: 'Hello, Brooks. Welcome to your interactive Trailblaze OS experience.' },
  { key: 'intelligence', label: 'INTELLIGENCE LAYER ACTIVE', title: 'One intelligence layer for the company.', copy: experienceProfile.infrastructureClaim, duration: 6400 },
  { key: 'capabilities', label: 'CAPABILITIES ACTIVATING', title: 'I can listen, speak, reason, qualify, schedule, and coordinate.', copy: 'Each subsystem connects customer conversations to jobs, owners, employees, and next steps.', duration: 7000 },
  { key: 'companyGraph', label: 'COMPANY GRAPH', title: 'A company is hundreds of moving pieces.', copy: 'Leads, jobs, estimates, employees, documents, reviews, payments, and decisions become one connected operating system.', duration: 7000 },
  { key: 'futureFilm', label: '24 MONTHS FROM TODAY', title: 'Beginning simulation.', copy: 'A realistic preview of Trailblaze operating at scale: leads answered, jobs coordinated, teams onboarded, and leadership in control.', duration: 7200 },
  { key: 'handoff', label: 'LIVE PRODUCT READY', title: 'This was not a commercial. It was a preview.', copy: 'The cinematic layer can now hand you into the actual Trailblaze OS.', duration: 6800 },
];

const demoActions = [
  { key: 'incomingCall', icon: 'phone', title: 'Incoming customer call', result: 'Trailblaze AI answers, qualifies the remodel request, captures contact details, creates a CRM lead, proposes two appointment windows, and notifies the owner queue.' },
  { key: 'jobApproval', icon: 'clipboard', title: 'Approved project workflow', result: 'The project moves to approved, next actions are created, staff are assigned, schedule reminders are generated, and the customer update is prepared.' },
  { key: 'onboarding', icon: 'users', title: 'New hire onboarding', result: 'Employee profile, paperwork, training, policy acknowledgment, manager assignment, and access tasks are generated as a checklist.' },
  { key: 'customerStatus', icon: 'bubble', title: 'Safe customer update', result: 'Trailblaze AI identifies the customer project and shares only approved customer-facing status while protecting internal notes and financial data.' },
];

function readPendingApplication() {
  if (typeof window === 'undefined') return null;
  try { return JSON.parse(window.localStorage.getItem('trailblaze_pending_application') || 'null'); } catch { return null; }
}

async function getClerkProfile(user) {
  if (!user) return null;
  const pending = readPendingApplication();
  await supabase.rpc('sync_clerk_profile', { p_application_id: pending?.id || null, p_interview_token: pending?.token || null });
  const { data, error } = await supabase.from('profiles').select('*').eq('clerk_user_id', user.id).single();
  if (error || !data?.active) return null;
  return { ...data, name: data.full_name || user.primaryEmailAddress?.emailAddress || 'Trailblaze user', label: roleLabel(data.role) };
}

function SiteHeader({ active = '/', overlay = false }) {
  return <header className={`site-header ${overlay ? 'site-header-overlay' : ''}`}>
    <Brand inverse={overlay} />
    <nav>{nav.map(([label, href]) => <a key={href} className={active === href ? 'active' : ''} href={href} onClick={(e) => { e.preventDefault(); go(href); }}>{label}</a>)}</nav>
    <div className="header-actions"><a className="demo-link" href="/login" onClick={(e) => { e.preventDefault(); go('/login'); }}>Client portal</a><a className="phone-link" href="tel:8649828394"><Icon name="phone" size={17} /> 864-982-8394</a></div>
  </header>;
}

function Footer() {
  return <footer className="footer">
    <div className="footer-main wrap">
      <div><Brand /><p>Your one-stop shop for new builds, renovations, and turnkey home repairs across Upstate South Carolina.</p><div className="socials"><span>f</span><span>◎</span><span>G</span></div></div>
      <div><h4>QUICK LINKS</h4>{nav.map(([label, href]) => <a key={href} href={href} onClick={(e) => { e.preventDefault(); go(href); }}>{label}</a>)}<a href="/login" onClick={(e) => { e.preventDefault(); go('/login'); }}>Owner portal</a></div>
      <div><h4>SERVICES</h4><a href="/services">New Builds</a><a href="/services">Renovations</a><a href="/services">Due Diligence Repairs</a><a href="/services">Turnkey Solutions</a></div>
      <div><h4>CONTACT US</h4><a href="tel:8649828394"><Icon name="phone" size={16} /> 864-982-8394</a><a href="mailto:hkirk@trailblazeconstruction.com"><Icon name="mail" size={16} /> hkirk@trailblazeconstruction.com</a><p className="contact-address">Downtown Greenville, SC<br />Simpsonville, SC</p><button className="btn btn-dark" onClick={() => go('/contact')}>GET DIRECTIONS</button></div>
    </div>
    <div className="footer-bottom wrap"><span>© 2024 Trailblaze Construction. All rights reserved.</span><span>Privacy Policy　|　 Terms of Service</span></div>
  </footer>;
}

function TrustBand({ title = 'READY TO START YOUR PROJECT?', sub = "Let's build something great together." }) {
  return <section className="trust-band"><div className="trust-side"><Icon name="shield" size={36} /><span>LICENSED & INSURED</span></div><div><h2>{title}</h2><p>{sub}</p><button className="btn btn-light" onClick={() => go('/contact')}>GET A FREE QUOTE <Icon name="arrow" size={17} /></button></div><div className="trust-side"><Icon name="hammer" size={36} /><span>QUALITY CRAFTSMANSHIP</span></div></section>;
}

function createExperienceAudio() {
  if (typeof window === 'undefined') return null;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  const context = new AudioContextClass();
  const master = context.createGain();
  master.gain.value = 0.08;
  master.connect(context.destination);
  const ambient = context.createOscillator();
  const ambientGain = context.createGain();
  ambient.type = 'sine';
  ambient.frequency.value = 48;
  ambientGain.gain.value = 0.18;
  ambient.connect(ambientGain);
  ambientGain.connect(master);
  ambient.start();
  let stopped = false;
  return {
    context,
    master,
    startup() {
      const now = context.currentTime;
      const osc = context.createOscillator();
      const gain = context.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(62, now);
      osc.frequency.exponentialRampToValueAtTime(94, now + 0.9);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.36, now + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
      osc.connect(gain);
      gain.connect(master);
      osc.start(now);
      osc.stop(now + 1.25);
    },
    mute(isMuted) { master.gain.setTargetAtTime(isMuted ? 0 : 0.08, context.currentTime, 0.08); },
    stop() {
      if (stopped) return;
      stopped = true;
      ambient.stop();
      context.close();
    },
  };
}

function ExecutiveExperience({ onComplete }) {
  const [phase, setPhase] = useState('idle');
  const [sceneIndex, setSceneIndex] = useState(0);
  const [muted, setMuted] = useState(false);
  const [captions, setCaptions] = useState(true);
  const [demo, setDemo] = useState(demoActions[0]);
  const [question, setQuestion] = useState('');
  const [aiReply, setAiReply] = useState('Ask me what happens when a customer calls, how onboarding works, or how the owner dashboard changes.');
  const audioRef = useRef(null);
  const scene = executiveScenes[sceneIndex];
  const progress = Math.round(((sceneIndex + (phase === 'choice' || phase === 'interactiveAI' ? 1 : 0)) / executiveScenes.length) * 100);

  useEffect(() => {
    if (audioRef.current) audioRef.current.mute(muted);
  }, [muted]);

  useEffect(() => {
    if (phase !== 'playing') return undefined;
    if (scene.speak && !muted && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(scene.speak);
      const voice = window.speechSynthesis.getVoices().find((item) => /samantha|victoria|zira|ava|female/i.test(item.name));
      if (voice) utterance.voice = voice;
      utterance.rate = 0.88;
      utterance.pitch = 1.02;
      window.speechSynthesis.speak(utterance);
    }
    const timer = window.setTimeout(() => {
      if (sceneIndex < executiveScenes.length - 1) setSceneIndex((value) => value + 1);
      else setPhase('choice');
    }, scene.duration);
    return () => window.clearTimeout(timer);
  }, [phase, sceneIndex, scene, muted]);

  useEffect(() => () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    audioRef.current?.stop();
  }, []);

  async function initialize() {
    const audio = createExperienceAudio();
    audioRef.current = audio;
    if (audio?.context?.state === 'suspended') await audio.context.resume();
    audio?.startup();
    setPhase('playing');
    setSceneIndex(0);
  }

  function finish(target = '/') {
    window.localStorage.setItem(executiveExperienceKey, 'true');
    audioRef.current?.stop();
    audioRef.current = null;
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    onComplete?.();
    if (target) go(target);
  }

  function replay() {
    window.localStorage.removeItem(executiveExperienceKey);
    setPhase('idle');
    setSceneIndex(0);
  }

  function runTool(action) {
    setDemo(action);
    setAiReply(`Running demo: ${action.title}. ${action.result}`);
  }

  function ask(event) {
    event.preventDefault();
    const text = question.toLowerCase();
    const action = text.includes('onboard') || text.includes('employee') ? demoActions[2] : text.includes('job') || text.includes('project') ? demoActions[1] : text.includes('status') || text.includes('customer') ? demoActions[3] : demoActions[0];
    runTool(action);
    setQuestion('');
  }

  if (phase === 'idle') {
    return <div className="executive-underlay"><div className="executive-start"><Brand inverse /><span>Executive Experience Ready</span><h1>TRAILBLAZE AI</h1><p>Prepared for {experienceProfile.preferredName}. The live {experienceProfile.productName} is loaded underneath.</p><div className="executive-start-actions"><button className="btn btn-light" onClick={initialize}>INITIALIZE <Icon name="arrow" size={17} /></button><button className="skip-experience" onClick={() => finish(null)}>Skip Experience</button></div></div></div>;
  }

  return <div className={`executive-underlay executive-${phase} executive-scene-${scene?.key || 'choice'}`}>
    <div className="experience-controls"><button onClick={() => setMuted(!muted)}>{muted ? 'Unmute' : 'Mute'}</button><button onClick={() => setCaptions(!captions)}>{captions ? 'Hide captions' : 'Captions'}</button><button onClick={() => finish(null)}>Exit</button></div>
    {phase === 'playing' && <div className="experience-stage">
      <div className="particle-field">{Array.from({ length: 36 }).map((_, index) => <span key={index} style={{ '--i': index }} />)}</div>
      <div className="system-status"><span>{scene.label}</span><div><i style={{ width: `${progress}%` }} /></div></div>
      <div className="experience-core"><div className="core-ring"><Mark inverse /></div><h1>{scene.title}</h1>{captions && <p>{scene.copy}</p>}</div>
      {scene.key === 'companyGraph' && <div className="company-graph">{['LEADS','CUSTOMERS','JOBS','SCHEDULE','EMPLOYEES','PAYMENTS','REVIEWS','ANALYTICS'].map((node) => <span key={node}>{node}</span>)}</div>}
      {scene.key === 'futureFilm' && <div className="future-film-strip"><div>AI RECEPTIONIST</div><div>JOB WORKFLOW</div><div>ONBOARDING</div><div>OWNER VISIBILITY</div></div>}
    </div>}
    {phase === 'choice' && <div className="experience-choice"><span>TRAILBLAZE OS READY</span><h1>What you just watched was a preview.</h1><p>This system was designed around Trailblaze. Now the presentation can become the working product.</p><div><button className="btn btn-light" onClick={() => finish('/login')}>EXPLORE TRAILBLAZE OS</button><button className="btn btn-outline-light" onClick={() => setPhase('interactiveAI')}>TALK TO TRAILBLAZE AI</button><button className="btn btn-outline-light" onClick={() => { runTool(demoActions[0]); setPhase('interactiveAI'); }}>SHOW ME WHAT YOU CAN DO</button></div><button className="skip-experience" onClick={replay}>Replay from start</button></div>}
    {phase === 'interactiveAI' && <div className="experience-live-ai">
      <div className="live-ai-main"><span>LIVE AI DEMO MODE</span><h1>Trailblaze AI can answer and act.</h1><p>{aiReply}</p><form onSubmit={ask}><input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask: what happens when someone calls?" /><button className="btn btn-light">Ask AI</button></form><div className="tool-row">{demoActions.map((action) => <button key={action.key} className={demo.key === action.key ? 'selected' : ''} onClick={() => runTool(action)}><Icon name={action.icon} size={21} />{action.title}</button>)}</div><button className="btn btn-brown" onClick={() => finish('/login')}>Enter the live OS</button></div>
      <div className="demo-os-panel"><div className="demo-os-top"><Brand /><span>Simulation Sandbox</span></div><div className="demo-workflow-card"><div className="icon-box"><Icon name={demo.icon} size={28} /></div><div><strong>{demo.title}</strong><p>{demo.result}</p></div></div><div className="demo-flow"><span className="done">Detected</span><span className="done">Qualified</span><span className="done">Created</span><span>Owner review</span></div><p className="guardrail-note"><Icon name="shield" size={16} /> {experienceProfile.guardrail}</p></div>
    </div>}
  </div>;
}

function Hero({ active, kicker, title, copy, children }) {
  return <section className="public-hero"><div className="hero-image"><SiteHeader active={active} overlay /><div className="wrap hero-copy"><span className="eyebrow">{kicker}</span><h1>{title}</h1>{copy && <p>{copy}</p>}{children}</div></div></section>;
}

function ServiceCard({ icon, title, copy }) { return <article className="service-card"><div className="icon-disc"><Icon name={icon} size={32} /></div><h3>{title}</h3><p>{copy}</p><button className="text-link" onClick={() => go('/services')}>LEARN MORE <Icon name="arrow" size={16} /></button></article>; }
function ProjectCard({ image, title, type, copy }) { return <article className="project-card"><img src={`${A}${image}`} alt="" /><div className="project-card-copy"><h3>{title}</h3><span className="project-type"><Icon name={type === 'RENOVATION' ? 'hammer' : type === 'TURNKEY SOLUTION' ? 'key' : 'home'} size={14} /> {type}</span><p>{copy}</p><button className="text-link" onClick={() => go('/work')}>VIEW PROJECT <Icon name="arrow" size={16} /></button></div></article>; }

function Home() {
  const [aiOpen, setAiOpen] = useState(false);
  const [showExecutive, setShowExecutive] = useState(() => typeof window !== 'undefined' && window.localStorage.getItem(executiveExperienceKey) !== 'true');
  return <><Hero active="/" kicker="" title={<>BUILT ON<br />EXPERIENCE.<br /><em>DRIVEN BY INTEGRITY.</em></>} copy="Trailblaze Construction is your trusted partner for new builds, renovations, and due diligence repairs across Upstate South Carolina."><div className="hero-actions"><button className="btn btn-brown" onClick={() => go('/contact')}>GET A FREE QUOTE <Icon name="arrow" size={17} /></button><button className="btn btn-outline-light" onClick={() => go('/work')}>VIEW OUR WORK</button><button className="btn btn-outline-light" onClick={() => setAiOpen(true)}>TRAILBLAZE AI <Icon name="bubble" size={16} /></button></div><div className="hero-proof"><span>Licensed & insured</span><span>Owner portal</span><span>Field crew workflow</span></div></Hero>{showExecutive && <ExecutiveExperience onComplete={() => setShowExecutive(false)} />}{aiOpen && <TrailblazeAI onClose={() => setAiOpen(false)} />}<section className="services-section wrap"><div className="section-heading"><span>—　OUR SERVICES　—</span><h2>COMPLETE SOLUTIONS. QUALITY RESULTS.</h2><p>From concept to completion, we handle every detail so you can enjoy a seamless building experience.</p></div><div className="service-grid"><ServiceCard icon="home" title="NEW BUILDS" copy="Custom homes built with precision, quality materials, and attention to detail." /><ServiceCard icon="hammer" title="RENOVATIONS" copy="Transform your space with expert craftsmanship and modern solutions." /><ServiceCard icon="clipboard" title="DUE DILIGENCE REPAIRS" copy="Detailed inspections and repairs to protect your investment." /><ServiceCard icon="key" title="TURNKEY SOLUTIONS" copy="End-to-end project management for a stress-free building experience." /></div><button className="btn btn-dark centered" onClick={() => go('/services')}>VIEW ALL SERVICES</button></section><PortalStrip onReplay={() => { window.localStorage.removeItem(executiveExperienceKey); setShowExecutive(true); }} /><AboutSplit /><ProjectsPreview /><TrustBand /><Footer /></>;
}

function TrailblazeAI({ onClose }) {
  const seed = [{ from: 'ai', text: "Hi, I'm the Trailblaze assistant. I can help with project questions, quote requests, appointment timing, or getting you routed to the right person." }];
  const [messages, setMessages] = useState(seed);
  const [draft, setDraft] = useState('');
  const [lead, setLead] = useState({ fullName: '', phone: '', email: '', projectType: '', appointmentWindow: '', callRoute: 'Owner / estimate request' });
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const safeTopics = ['quote', 'estimate', 'appointment', 'schedule', 'call', 'renovation', 'new build', 'repair', 'due diligence', 'project', 'service', 'home', 'construction', 'kitchen', 'bath', 'deck', 'addition', 'timeline', 'budget'];
  const blockedTopics = ['password', 'admin', 'payroll', 'bank', 'tax id', 'social security', 'database', 'supabase', 'clerk', 'vercel', 'api key', 'employee file', 'private', 'internal'];
  function updateLead(key, value) { setLead({ ...lead, [key]: value }); }
  function speak(text) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = window.speechSynthesis.getVoices().find((item) => /female|samantha|victoria|zira|ava/i.test(item.name)) || null;
    if (voice) utterance.voice = voice;
    utterance.rate = 0.96; utterance.pitch = 1.08;
    window.speechSynthesis.speak(utterance);
  }
  function answer(input) {
    const text = input.toLowerCase();
    if (blockedTopics.some((term) => text.includes(term))) return "I can help with customer project questions, quotes, appointments, and routing calls. I can't discuss private company systems, accounts, employees, or internal records.";
    if (!safeTopics.some((term) => text.includes(term))) return "I can help with Trailblaze services, project planning, quote requests, appointment scheduling, and getting your call to the right person. What kind of project are you thinking about?";
    if (text.includes('appointment') || text.includes('schedule')) return "Absolutely. Tell me the best day and time window, plus your name, phone, and email, and I'll put that appointment request in the Trailblaze team queue.";
    if (text.includes('quote') || text.includes('estimate') || text.includes('budget')) return "For a useful estimate, Trailblaze usually needs the project type, location, rough scope, photos if available, and timing. I can collect that now and send it to the owner dashboard.";
    if (text.includes('call')) return "I can route the request as an estimate, active project question, service question, or urgent follow-up. For now, I can also open a direct call to 864-982-8394.";
    return "That sounds like something Trailblaze can help with. Share the project type, location, timing, and what you want built or repaired, and I'll turn it into a clean request for the team.";
  }
  function send(event) {
    event.preventDefault();
    if (!draft.trim()) return;
    const userMessage = { from: 'user', text: draft.trim() };
    const aiMessage = { from: 'ai', text: answer(draft.trim()) };
    setMessages([...messages, userMessage, aiMessage]);
    setDraft('');
    speak(aiMessage.text);
  }
  async function submitLead(event) {
    event.preventDefault(); setBusy(true); setStatus('');
    const message = messages.map((item) => `${item.from === 'ai' ? 'Trailblaze AI' : 'Prospect'}: ${item.text}`).join('\n');
    const { error } = await supabase.functions.invoke('apply-contact', { body: { ...lead, message, source: 'trailblaze_ai', transcript: messages, website: '' } });
    setBusy(false);
    if (error) { setStatus('I could not send this into the live queue yet. Please call 864-982-8394.'); return; }
    setStatus('Sent. A Trailblaze team member can review this lead and follow up.');
  }
  return <div className="ai-overlay" role="dialog" aria-modal="true" aria-label="Trailblaze AI assistant"><div className="ai-panel"><div className="ai-head"><div><span className="eyebrow dark">TRAILBLAZE AI</span><h2>Talk to the project assistant.</h2><p>Customer questions, quote requests, appointments, and call routing only.</p></div><button onClick={onClose} aria-label="Close">×</button></div><div className="ai-chat">{messages.map((item, index) => <div key={`${item.from}-${index}`} className={`ai-message ${item.from}`}>{item.text}</div>)}</div><form className="ai-compose" onSubmit={send}><input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Ask about a quote, appointment, or project..." /><button className="btn btn-dark"><Icon name="send" size={15} /> Send</button></form><form className="ai-lead-form" onSubmit={submitLead}><div className="form-row"><input value={lead.fullName} onChange={(event) => updateLead('fullName', event.target.value)} placeholder="Name *" required /><input value={lead.phone} onChange={(event) => updateLead('phone', event.target.value)} placeholder="Phone *" required /></div><input value={lead.email} onChange={(event) => updateLead('email', event.target.value)} type="email" placeholder="Email *" required /><div className="form-row"><select value={lead.projectType} onChange={(event) => updateLead('projectType', event.target.value)} required><option value="">Project type *</option><option>New Build</option><option>Renovation</option><option>Due Diligence Repair</option><option>General Question</option></select><input value={lead.appointmentWindow} onChange={(event) => updateLead('appointmentWindow', event.target.value)} placeholder="Preferred appointment window" /></div><select value={lead.callRoute} onChange={(event) => updateLead('callRoute', event.target.value)}><option>Owner / estimate request</option><option>Project manager / active project</option><option>Office / scheduling</option><option>Urgent follow-up</option></select><div className="ai-actions"><button className="btn btn-dark" disabled={busy}>{busy ? 'SENDING...' : 'SEND TO TEAM QUEUE'} <Icon name="arrow" size={15} /></button><a className="btn btn-outline-dark" href="tel:8649828394"><Icon name="phone" size={15} /> CALL NOW</a></div>{status && <p className={status.startsWith('Sent') ? 'form-success' : 'form-error'}>{status}</p>}</form></div></div>;
}

function PortalStrip({ onReplay }) { return <section className="demo-strip wrap"><div><span>OPERATIONS PORTAL</span><h2>Website plus operating portal in one walkthrough.</h2><p>Sign in to manage the owner dashboard, employee field view, jobs, payouts, team, notifications, and settings.</p></div><div className="portal-actions"><button className="btn btn-outline-dark" onClick={onReplay}>REPLAY EXECUTIVE EXPERIENCE</button><button className="btn btn-dark" onClick={() => go('/login')}>OPEN PORTAL <Icon name="arrow" size={16} /></button></div></section>; }

function AboutSplit() { return <section className="about-split"><div className="about-copy"><span className="eyebrow dark">ABOUT US</span><h2>FAMILY OWNED.<br />BUILT ON INTEGRITY.</h2><p>Trailblaze Construction is a locally owned, women-led company proudly serving Upstate South Carolina. We believe in honest relationships, clear communication, and doing the right thing — every time.</p><ul><li><Icon name="check" size={15} /> Licensed & Insured</li><li><Icon name="hammer" size={15} /> Quality Craftsmanship</li><li><Icon name="users" size={15} /> Honest Communication</li><li><Icon name="tree" size={15} /> Built on Experience</li></ul><button className="btn btn-dark" onClick={() => go('/about')}>LEARN MORE ABOUT US</button></div><div className="about-photo"><img src={`${A}about.jpg`} alt="Trailblaze builder at a new home" /><div className="women-card"><Icon name="tree" size={27} /><h3>WOMEN IN CONSTRUCTION</h3><p>Proudly women-led and committed to excellence in every build.</p><button className="btn btn-outline-light" onClick={() => go('/about')}>OUR STORY</button></div></div></section>; }
function ProjectsPreview() { const projects = [['project-farmhouse.jpg','MODERN FARMHOUSE','NEW BUILD'],['project-kitchen.jpg','KITCHEN RENOVATION','RENOVATION'],['project-retreat.jpg','CRAFTSMAN RETREAT','NEW BUILD'],['project-bath.jpg','BATHROOM REMODEL','RENOVATION']]; return <section className="projects-preview wrap"><div className="section-heading"><span>—　OUR WORK　—</span><h2>BUILT WITH PRIDE. MADE TO LAST.</h2></div><div className="project-grid preview-grid">{projects.map(([image,title,type]) => <ProjectCard key={title} image={image} title={title} type={type} copy="Crafted with quality materials and thoughtful design." />)}</div><button className="btn btn-dark centered" onClick={() => go('/work')}>VIEW MORE PROJECTS</button></section>; }

function InteriorHero({ active, kicker, title, copy }) { return <Hero active={active} kicker={kicker} title={title} copy={copy} />; }

function About() { return <><InteriorHero active="/about" kicker="ABOUT US" title={<>WHO WE ARE.<br />HOW WE BUILD.</>} copy="Trailblaze Construction is a women-led, family owned company proudly serving Upstate South Carolina with honesty, quality craftsmanship, and integrity in every build." /><Values /><section className="story-split"><img src={`${A}about.jpg`} alt="Trailblaze builder on a home site" /><div><span className="eyebrow dark">OUR STORY　—</span><h2>A STRONG FOUNDATION<br />BUILT ON FAMILY.</h2><p>Trailblaze Construction was founded on a simple belief: treat every home like it's our own. As a women-led and family owned company, we bring a personal touch to every project — from the first conversation to the final walkthrough.</p><p>We specialize in new builds, renovations, due diligence repairs, and turnkey solutions, working with homeowners, real estate agents, and investors across the Upstate.</p><button className="btn btn-dark">MEET THE TEAM</button></div></section><Process /><TrustBand title="LET'S BUILD SOMETHING GREAT TOGETHER." sub="Ready to bring your vision to life?" /><Footer /></>; }
function Values() { const values = [['shield','INTEGRITY',"We do what's right, even when no one is watching."],['hammer','CRAFTSMANSHIP','Quality work and attention to detail in every project.'],['home','QUALITY','We use the right materials and proven building practices.'],['tree','ADVENTURE','We embrace challenges and love creating spaces for life.'],['users','COMMUNITY','Proudly serving our neighbors and building lasting relationships.']]; return <section className="values wrap"><div className="section-heading"><span>—　OUR VALUES　—</span></div><div className="value-grid">{values.map(([icon,title,copy]) => <div key={title}><div className="icon-disc"><Icon name={icon} size={31} /></div><h3>{title}</h3><p>{copy}</p></div>)}</div></section>; }
function Process() { const steps = [['1','bubble','CONSULT','We listen to your vision and understand your needs.'],['2','clipboard','PLAN','We create a detailed plan and transparent estimate.'],['3','hammer','BUILD','Our team gets to work with quality craftsmanship and clear communication.'],['4','clipboard','REVIEW','We walk through every detail to ensure complete satisfaction.'],['5','home','ENJOY','Enjoy your new space knowing it was built to last.']]; return <section className="process wrap"><div className="section-heading"><span>—　OUR PROCESS　—</span></div><div className="process-grid">{steps.map(([n,icon,title,copy]) => <div key={n} className="process-step"><strong>{n}</strong><div className="icon-disc"><Icon name={icon} size={26} /></div><h3>{title}</h3><p>{copy}</p></div>)}</div></section>; }

function Services() { const services = [['home','NEW BUILDS','From custom homes to additions, we build spaces that feel like you.'],['hammer','RENOVATIONS','Thoughtful renovations with the planning and precision your home deserves.'],['clipboard','DUE DILIGENCE REPAIRS','Clear inspections and repair scopes that help protect your investment.'],['key','TURNKEY SOLUTIONS','One experienced partner from first conversation through final walkthrough.']]; return <><InteriorHero active="/services" kicker="OUR SERVICES" title={<>COMPLETE SOLUTIONS.<br />QUALITY RESULTS.</>} copy="Everything you need to build, renovate, and care for your home across Upstate South Carolina." /><section className="services-detail wrap"><div className="service-grid service-grid-large">{services.map(([icon,title,copy]) => <ServiceCard key={title} icon={icon} title={title} copy={copy} />)}</div></section><TrustBand /><Footer /></>; }

function Work() { const cards = [['project-farmhouse.jpg','MODERN FARMHOUSE','NEW BUILD','Custom 2,850 sq ft home built with quality materials and timeless design.'],['project-kitchen.jpg','KITCHEN RENOVATION','RENOVATION','Complete kitchen transformation with custom cabinetry, stone countertops, and modern finishes.'],['project-retreat.jpg','CRAFTSMAN RETREAT','NEW BUILD','Warm, inviting craftsman home designed for family living and entertaining.'],['project-bath.jpg','BATHROOM REMODEL','RENOVATION','Spa-inspired bathroom with luxury finishes and thoughtful details.'],['project-outdoor.jpg','OUTDOOR LIVING SPACE','RENOVATION','Custom deck and covered patio designed for year-round enjoyment.'],['project-commercial.jpg','COMMERCIAL BUILD-OUT','TURNKEY SOLUTION','Full-service commercial build-out from concept to completion.']]; return <><InteriorHero active="/work" kicker="OUR WORK" title={<>BUILT WITH PRIDE.<br />MADE TO LAST.</>} copy="Explore a selection of our recent projects. Every build is a reflection of our commitment to quality, integrity, and detail." /><section className="work-content wrap"><div className="work-tabs"><button className="selected">ALL PROJECTS</button><button><Icon name="home" size={17} /> NEW BUILDS</button><button><Icon name="hammer" size={17} /> RENOVATIONS</button><button><Icon name="clipboard" size={17} /> DUE DILIGENCE REPAIRS</button><button><Icon name="key" size={17} /> TURNKEY SOLUTIONS</button></div><div className="project-grid">{cards.map(([image,title,type,copy]) => <ProjectCard key={title} image={image} title={title} type={type} copy={copy} />)}</div><button className="btn btn-dark centered">VIEW MORE PROJECTS</button></section><ReviewSnapshot /><TrustBand /><Footer /></>; }
function ReviewSnapshot() { return <section className="review-snapshot wrap"><div className="section-heading"><span>—　WHAT OUR CLIENTS SAY　—</span><h2>REAL PEOPLE. REAL RESULTS.</h2></div><div className="testimonial-grid"><Testimonial name="JESSICA M." city="Greenville, SC" copy="Trailblaze Construction built our dream home from the ground up. The process was smooth, the team was professional, and the results speak for themselves." /><Testimonial name="MARK R." city="Simpsonville, SC" copy="We hired Trailblaze for a due diligence repair before closing on an investment property. They were thorough, honest, and delivered exactly what they promised." /><Testimonial name="AMY T." city="Taylors, SC" copy="Professional, communicative, and detail-oriented. I wouldn't trust anyone else with our renovation projects." /></div><button className="btn btn-dark centered" onClick={() => go('/reviews')}>READ MORE REVIEWS</button></section>; }
function Testimonial({ name, city, copy }) { return <article className="testimonial"><div className="stars">★★★★★</div><p>“　{copy}</p><strong>— {name}</strong><small>{city}</small></article>; }

function Reviews() { return <><InteriorHero active="/reviews" kicker="REVIEWS" title={<>REAL PEOPLE.<br />REAL RESULTS.</>} copy="We take pride in every project and every relationship. See what our clients have to say about working with Trailblaze Construction." /><section className="ratings wrap"><div className="overall"><span>OVERALL RATING</span><strong>5.0</strong><div className="stars">★★★★★</div><p>Based on 41 reviews</p></div><div className="rating-cats">{[['shield','QUALITY','5.0'],['hammer','CRAFTSMANSHIP','5.0'],['home','COMMUNICATION','5.0'],['clock','TIMELINESS','5.0'],['users','VALUE','4.9']].map(([icon,title,score]) => <div key={title}><Icon name={icon} size={38} /><strong>{title}</strong><b>{score}</b><span className="stars">★★★★★</span></div>)}</div><button className="btn btn-dark centered">WRITE A REVIEW <Icon name="send" size={16} /></button></section><section className="reviews-full wrap"><div className="section-heading"><span>—　WHAT OUR CLIENTS ARE SAYING　—</span></div><div className="testimonial-grid six">{[['JESSICA M.','Greenville, SC','Trailblaze Construction built our dream home from the ground up. The process was smooth, the team was professional, and the results speak for themselves.'],['MARK R.','Simpsonville, SC','We hired Trailblaze for a due diligence repair before closing on an investment property. They were thorough, honest, and delivered exactly what they promised.'],['AMY T.','Taylors, SC','From the first consultation to the final walkthrough, the communication was excellent. They stayed on schedule and the craftsmanship is top notch.'],['SARAH & DANIEL P.','Greenville, SC','Trailblaze helped us completely renovate our kitchen and living area. The team was friendly, respectful, and incredibly detail oriented.'],['JAMES G.','Mauldin, SC','Professional, reliable, and the quality of work is outstanding. We have worked with several contractors in the past and Trailblaze is by far the best.'],['BRIAN K.','Travelers Rest, SC','They turned our outdoor space into a beautiful retreat. The deck and covered patio exceeded our expectations.']].map(([name,city,copy]) => <Testimonial key={name} name={name} city={city} copy={copy} />)}</div></section><TrustBand title="TRUSTED. LOCAL. COMMITTED." sub="Proudly serving Upstate South Carolina with honesty, quality craftsmanship, and a commitment to doing it right." /><Footer /></>; }

function Contact() {
  const [sent, setSent] = useState(false); const [error, setError] = useState(''); const [sending, setSending] = useState(false);
  async function submit(event) {
    event.preventDefault(); setError(''); setSending(true);
    const fields = new FormData(event.currentTarget);
    const { error: requestError } = await supabase.functions.invoke('apply-contact', { body: { fullName: fields.get('fullName'), phone: fields.get('phone'), email: fields.get('email'), projectType: fields.get('projectType'), message: fields.get('message'), website: fields.get('website') } });
    setSending(false); if (requestError) { setError('We could not send your message. Please call us at 864-982-8394.'); return; } setSent(true);
  }
  return <><InteriorHero active="/contact" kicker="" title="CONTACT US." copy="Have a project in mind? We'd love to hear about it. Reach out today for a free quote or consultation." /><section className="contact-grid"><div className="contact-form"><span className="eyebrow dark">SEND US A MESSAGE　—</span><h2>SEND US A MESSAGE</h2><p>Fill out the form below and we'll get back to you as soon as possible.</p>{sent ? <div className="success"><Icon name="check" size={35} /><h3>Thanks for reaching out.</h3><p>Your message is in the Trailblaze team queue.</p></div> : <form onSubmit={submit}><div className="form-row"><input name="fullName" placeholder="Full Name *" required /><input name="phone" placeholder="Phone Number *" required /></div><input name="email" placeholder="Email Address *" type="email" required /><select name="projectType" defaultValue=""><option value="" disabled>Project Type</option><option>New Build</option><option>Renovation</option><option>Due Diligence Repair</option></select><textarea name="message" placeholder="Tell us about your project *" required /><input className="honeypot" name="website" tabIndex="-1" autoComplete="off" aria-hidden="true" /><button className="btn btn-dark" disabled={sending}>{sending ? 'SENDING...' : 'SEND MESSAGE'} <Icon name="arrow" size={16} /></button>{error && <p className="form-error">{error}</p>}</form>}</div><div className="contact-info"><span className="eyebrow dark">CONTACT INFORMATION　—</span><h2>CONTACT INFORMATION</h2><p>We're here to answer your questions and help bring your vision to life.</p><div className="info-list"><div><Icon name="phone" size={23} /><p><strong>864-982-8394</strong><small>Give us a call</small></p></div><div><Icon name="mail" size={23} /><p><strong>hkirk@trailblazeconstruction.com</strong><small>Send us an email</small></p></div><div><Icon name="map" size={23} /><p><strong>Downtown Greenville, SC<br />Simpsonville, SC</strong><small>Serving Upstate South Carolina</small></p></div><div><Icon name="clock" size={23} /><p><strong>MONDAY - FRIDAY</strong><small>8:00 AM - 5:00 PM</small></p></div></div><div className="consult-card"><Icon name="calendar" size={30} /><div><strong>SCHEDULE A CONSULTATION</strong><p>Let's discuss your project in detail.</p><button className="btn btn-dark" onClick={() => window.location.href = 'tel:8649828394'}>CALL TO BOOK <Icon name="phone" size={15} /></button></div></div></div></section><section className="map-section"><div className="map-card"><Icon name="tree" size={31} /><h3>PROUDLY SERVING<br />UPSTATE SOUTH CAROLINA</h3><p>From Greenville to the surrounding communities, we're ready to bring your project to life.</p><p>✓ Greenville, SC<br />✓ Simpsonville, SC<br />✓ Taylors, SC<br />✓ Mauldin, SC<br />✓ Travelers Rest, SC</p></div><Icon name="map" size={80} /></section><TrustBand title="READY TO BUILD SOMETHING GREAT?" sub="Let's work together to create something you'll be proud of for years to come." /><Footer /></>;
}

function Careers() {
  const [step, setStep] = useState('apply');
  const [form, setForm] = useState({ name:'', email:'', phone:'', role:'Field Carpenter', years:'3', availability:'Immediate', experience:'', why:'' });
  const [result, setResult] = useState(null);
  const [application, setApplication] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [voiceState, setVoiceState] = useState('idle');
  const [transcript, setTranscript] = useState('');
  const [consent, setConsent] = useState(false);
  const [accountMessage, setAccountMessage] = useState('');
  const wsRef = useRef(null); const audioRef = useRef(null); const streamRef = useRef(null); const processorRef = useRef(null); const transcriptByTurn = useRef(new Map()); const transcriptRef = useRef(''); const nextPlaybackTime = useRef(0);
  function update(key, value) { setForm({ ...form, [key]: value }); }
  const mergeTranscript = () => { const next = [...transcriptByTurn.current.values()].join('\n\n').trim(); transcriptRef.current = next; setTranscript(next); return next; };
  const stopVoice = () => { try { wsRef.current?.close(); } catch {} wsRef.current = null; try { processorRef.current?.disconnect(); } catch {} processorRef.current = null; try { streamRef.current?.getTracks().forEach((track) => track.stop()); } catch {} streamRef.current = null; try { audioRef.current?.close(); } catch {} audioRef.current = null; };
  const pcm16 = (input, inputRate) => { const targetRate = 24000; const ratio = inputRate / targetRate; const length = Math.max(1, Math.round(input.length / ratio)); const output = new Int16Array(length); for (let index = 0; index < length; index += 1) { const source = Math.min(input.length - 1, Math.round(index * ratio)); const sample = Math.max(-1, Math.min(1, input[source])); output[index] = sample < 0 ? sample * 0x8000 : sample * 0x7fff; } return output.buffer; };
  const playPcm = async (chunk) => { const context = audioRef.current; if (!context || !chunk?.byteLength) return; const samples = new Int16Array(chunk); const buffer = context.createBuffer(1, samples.length, 24000); const channel = buffer.getChannelData(0); for (let index = 0; index < samples.length; index += 1) channel[index] = samples[index] / 0x8000; const source = context.createBufferSource(); source.buffer = buffer; source.connect(context.destination); const at = Math.max(context.currentTime + 0.025, nextPlaybackTime.current); source.start(at); nextPlaybackTime.current = at + buffer.duration; };
  async function submitApplication(e) {
    e.preventDefault(); setError(''); setBusy(true);
    const { data, error: submitError } = await supabase.functions.invoke('submit-application', { body: { fullName: form.name, email: form.email, phone: form.phone, roleAppliedFor: form.role, yearsExperience: form.years, availability: form.availability, experience: form.experience, motivation: form.why, website: '' } });
    setBusy(false); if (submitError || !data?.applicationId || !data?.interviewToken) { setError('We could not submit your application. Please call us at 864-982-8394.'); return; }
    setApplication({ id: data.applicationId, token: data.interviewToken }); setStep('interview');
  }
  async function startVoice() {
    if (!application || !consent) return; setError(''); setBusy(true); setVoiceState('connecting'); transcriptByTurn.current = new Map(); transcriptRef.current = ''; setTranscript('');
    const { data, error: startError } = await supabase.functions.invoke('start-xai-interview', { body: { applicationId: application.id, interviewToken: application.token } });
    if (startError || !data?.token) { setBusy(false); setVoiceState('idle'); setError(data?.error || 'We could not start the voice interviewer. Please try again.'); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } });
      const context = new AudioContext({ sampleRate: 24000 }); const source = context.createMediaStreamSource(stream); const processor = context.createScriptProcessor(4096, 1, 1);
      streamRef.current = stream; audioRef.current = context; processorRef.current = processor; source.connect(processor); processor.connect(context.destination); await context.resume();
      const prompt = `You are Trailblaze Construction's voice interviewer. Interview ${data.candidate.firstName} for the ${data.candidate.role} role. Start with a brief disclosure: you are an AI interviewer and their job-related responses will be reviewed by a Trailblaze owner; do not ask for protected personal information. Then ask one clear question at a time about relevant construction or operations experience, jobsite safety, quality, communication with clients and teammates, reliability, problem solving, and availability. Adapt follow-ups to their answers. Keep the conversation warm, practical, and focused. Aim for about six questions. When they say they are finished, thank them and say their application will be reviewed. Never make a hiring decision or promise employment.`;
      const socket = new WebSocket('wss://api.x.ai/v1/realtime?model=grok-voice-latest', [`xai-client-secret.${data.token}`]); wsRef.current = socket; socket.binaryType = 'arraybuffer';
      processor.onaudioprocess = (event) => { if (socket.readyState === WebSocket.OPEN) socket.send(pcm16(event.inputBuffer.getChannelData(0), context.sampleRate)); };
      socket.onopen = () => { socket.send(JSON.stringify({ type: 'session.update', session: { voice: 'eve', instructions: prompt, turn_detection: { type: 'server_vad', silence_duration_ms: 900, prefix_padding_ms: 350 }, audio: { input: { format: { type: 'audio/pcm', rate: 24000 }, transport: 'binary', transcription: { model: 'grok-transcribe', language_hint: 'en-US', keyterms: ['Trailblaze', 'construction', 'jobsite', 'carpenter'] } }, output: { format: { type: 'audio/pcm', rate: 24000 }, transport: 'binary' } } } })); socket.send(JSON.stringify({ type: 'response.create' })); setBusy(false); setVoiceState('listening'); };
      socket.onmessage = async (event) => { if (event.data instanceof ArrayBuffer) { await playPcm(event.data); return; } if (event.data instanceof Blob) { await playPcm(await event.data.arrayBuffer()); return; } try { const message = JSON.parse(event.data); if (message.type === 'conversation.item.input_audio_transcription.updated' && message.transcript) { transcriptByTurn.current.set(message.item_id || String(transcriptByTurn.current.size), message.transcript); mergeTranscript(); } if (message.type === 'response.created') setVoiceState('speaking'); if (message.type === 'response.done') setVoiceState('listening'); if (message.type === 'error') { setError(message.error?.message || 'The voice interview was interrupted.'); setVoiceState('ready'); } } catch {} };
      socket.onerror = () => { setError('The voice connection could not be established. Please try again.'); setBusy(false); setVoiceState('idle'); stopVoice(); };
      socket.onclose = () => { if (voiceState !== 'ready') setVoiceState('ready'); };
    } catch (voiceError) { console.error(voiceError); stopVoice(); setBusy(false); setVoiceState('idle'); setError('Microphone access is required for the voice interview. Please allow it and try again.'); }
  }
  async function finishInterview() {
    const finalTranscript = mergeTranscript(); stopVoice(); if (finalTranscript.length < 80) { setError('We need a little more interview audio before sending it to the hiring team.'); setVoiceState('idle'); return; }
    setBusy(true); setError(''); const { data, error: completeError } = await supabase.functions.invoke('complete-xai-interview', { body: { applicationId: application.id, interviewToken: application.token, transcript: finalTranscript } }); setBusy(false);
    if (completeError || !data?.assessment) { setError(data?.error || 'We could not submit the interview. Please try again.'); setVoiceState('ready'); return; }
    setResult(data.assessment); window.localStorage.setItem('trailblaze_pending_application', JSON.stringify({ id: application.id, token: application.token, email: form.email, name: form.name, phone: form.phone })); setStep('result');
  }
  async function createApplicantAccount(event) {
    event.preventDefault(); setError(''); setAccountMessage('');
    window.localStorage.setItem('trailblaze_pending_application', JSON.stringify({ id: application.id, token: application.token, email: form.email, name: form.name, phone: form.phone }));
    go('/login?mode=signup');
  }
  useEffect(() => () => stopVoice(), []);
  return <><InteriorHero active="/careers" kicker="CAREERS" title={<>JOIN THE CREW.<br />SHOW US HOW YOU WORK.</>} copy="Apply for a Trailblaze role and share how you work. Your application is sent directly to the owner dashboard." /><section className="careers-layout wrap"><div className="career-card"><span className="eyebrow dark">OPEN ROLES</span><h2>Hiring for field and operations roles.</h2><div className="role-list">{['Field Carpenter','Project Manager','Field Assistant','Office Coordinator'].map((role) => <button key={role} className={form.role === role ? 'selected' : ''} onClick={() => update('role', role)}><Icon name={role.includes('Office') ? 'briefcase' : role.includes('Manager') ? 'clipboard' : 'hammer'} size={24} /><span><strong>{role}</strong><small>{role === 'Office Coordinator' ? 'Scheduling, client updates, documentation' : 'Jobsites, updates, quality, communication'}</small></span></button>)}</div><div className="ai-process"><div><Icon name="clipboard" size={18} /> Apply</div><div><Icon name="bubble" size={18} /> xAI voice interview</div><div><Icon name="chart" size={18} /> Owner scorecard</div><div><Icon name="shield" size={18} /> Onboarding</div></div></div><div className="career-panel">{step === 'apply' && <form onSubmit={submitApplication} className="career-form"><span className="eyebrow dark">APPLICATION</span><h2>Apply for {form.role}</h2><div className="form-row"><input value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Full name *" required /><input value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="Phone number *" required /></div><input value={form.email} onChange={(e) => update('email', e.target.value)} type="email" placeholder="Email address *" required /><div className="form-row"><select value={form.years} onChange={(e) => update('years', e.target.value)}><option value="0">Under 1 year</option><option value="1">1-2 years</option><option value="3">3-5 years</option><option value="6">6+ years</option></select><input value={form.availability} onChange={(e) => update('availability', e.target.value)} placeholder="Availability" /></div><textarea value={form.experience} onChange={(e) => update('experience', e.target.value)} placeholder="Relevant experience *" required /><textarea value={form.why} onChange={(e) => update('why', e.target.value)} placeholder="Why do you want to work with Trailblaze? *" required /><button className="btn btn-dark full" disabled={busy}>{busy ? 'SAVING...' : 'CONTINUE'} <Icon name="arrow" size={16} /></button>{error && <p className="form-error">{error}</p>}</form>}{step === 'interview' && <div className="career-form ai-interview"><span className="eyebrow dark">AI VOICE INTERVIEW</span><h2>Talk with our hiring assistant.</h2><p>This conversation takes about 8-10 minutes. Your job-related answers are transcribed, scored by xAI, and sent to the Trailblaze owner dashboard for human review.</p><label className="consent-check"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} /> <span>I understand this is an AI-assisted interview and consent to the processing of my interview responses for this application.</span></label><div className={`voice-status ${voiceState}`}><span className="voice-pulse" /><strong>{voiceState === 'connecting' ? 'Connecting to interviewer' : voiceState === 'speaking' ? 'Interviewer is speaking' : voiceState === 'listening' ? 'Listening - speak naturally' : voiceState === 'ready' ? 'Interview paused' : 'Ready when you are'}</strong><small>{transcript ? `${transcript.length} characters captured` : 'Microphone access is required.'}</small></div>{voiceState === 'idle' || voiceState === 'ready' ? <button className="btn btn-dark full" disabled={!consent || busy} onClick={startVoice}>{busy ? 'CONNECTING...' : voiceState === 'ready' ? 'RESUME INTERVIEW' : 'START VOICE INTERVIEW'} <Icon name="bubble" size={16} /></button> : <button className="btn btn-light full" onClick={() => { stopVoice(); setVoiceState('ready'); }}>PAUSE INTERVIEW</button>}<button className="btn btn-dark full" disabled={busy || transcript.length < 80} onClick={finishInterview}>{busy ? 'SENDING...' : 'FINISH & SEND TO HIRING TEAM'} <Icon name="send" size={16} /></button>{error && <p className="form-error">{error}</p>}</div>}{step === 'result' && result && <div className="interview-result"><span className="eyebrow dark">INTERVIEW COMPLETE</span><div className="score-circle">{result.score}</div><h2>{result.verdict}</h2><p>{result.summary}</p><div className="score-lists"><div><strong>What went well</strong>{(result.strengths || ['Your application and interview were received.']).map((item) => <span key={item}><Icon name="check" size={15} /> {item}</span>)}</div><div><strong>Next steps</strong><span><Icon name="info" size={15} /> A Trailblaze owner reviews your application and AI scorecard.</span><span><Icon name="info" size={15} /> Create a Clerk applicant account to receive application updates.</span><span><Icon name="info" size={15} /> If selected, the next stage is owner follow-up and onboarding.</span></div></div><form className="applicant-account-form" onSubmit={createApplicantAccount}><h3>Continue this application</h3><p>Create a secure Clerk account so you can check status updates and receive next steps.</p><input value={form.email} readOnly aria-label="Applicant email" /><button className="btn btn-dark full">CREATE ACCOUNT & CONTINUE <Icon name="arrow" size={16} /></button>{accountMessage && <p className="form-success">{accountMessage}</p>}{error && <p className="form-error">{error}</p>}</form></div>}</div></section><TrustBand title="BUILD A STRONGER CREW." sub="Your application goes directly to the Trailblaze hiring workspace." /><Footer /></>;
}

function Login() {
  const mode = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('mode') === 'signup' ? 'signup' : 'signin';
  const appearance = { variables: { colorPrimary: '#5a3e24', colorText: '#2e2b28', colorBackground: '#fffdf8', borderRadius: '10px', fontFamily: 'Montserrat, Arial, sans-serif' }, elements: { cardBox: 'clerk-card-box', card: 'clerk-card', headerTitle: 'clerk-title', formButtonPrimary: 'clerk-primary' } };
  return <div className="login-page"><div className="login-trees"></div><div className="login-inner clerk-login"><Brand /><h1>{mode === 'signin' ? 'Welcome back' : 'Activate your access'}</h1><p>{mode === 'signin' ? 'Sign in with Clerk to access the Trailblaze operations portal.' : 'Create your secure Trailblaze account.'}</p>{!clerkPublishableKey ? <div className="config-warning"><Icon name="key" size={24} /><strong>Clerk is not configured yet.</strong><span>Add VITE_CLERK_PUBLISHABLE_KEY in Vercel and connect Clerk to Supabase to activate production login.</span></div> : mode === 'signin' ? <SignIn routing="virtual" signUpUrl="/login?mode=signup" fallbackRedirectUrl="/app/overview" forceRedirectUrl="/app/overview" appearance={appearance} /> : <SignUp routing="virtual" signInUrl="/login" fallbackRedirectUrl="/app/overview" forceRedirectUrl="/app/overview" appearance={appearance} />}<div className="secure-login-note"><Icon name="shield" size={17} /> John is provisioned as platform admin. Heather is provisioned as owner.</div></div></div>;
}

const ownerNav = [['overview','Business','chart'],['jobs','All jobs','clipboard'],['hiring','Hiring','briefcase'],['payouts','Payouts','wallet'],['team','Team','users'],['notifications','Alerts','bell']];
const developerNav = [['overview','Business','chart'],['jobs','All jobs','clipboard'],['hiring','Hiring','briefcase'],['payouts','Payouts','wallet'],['team','Team','users'],['developer','Developer','key'],['notifications','Alerts','bell']];
const employeeNav = [['employee','Today','briefcase'],['tasks','Tasks','clipboard'],['schedule','Schedule','calendar'],['time','Time','clock'],['notifications','Alerts','bell']];
const applicantNav = [['application','Application','clipboard'],['notifications','Updates','bell']];
function AppShell({ active, children, session }) {
  const { signOut: clerkSignOut } = useClerk();
  const current = session;
  const links = current.role === 'applicant' ? applicantNav : current.role === 'employee' ? employeeNav : current.role === 'platform_admin' ? developerNav : ownerNav;
  async function signOut() { setSupabaseAccessTokenProvider(null); await clerkSignOut(); go('/login'); }
  return <div className="app-shell"><header className="app-header"><Brand /><span className="role-pill">{current.label}</span><button className="logout" onClick={signOut} aria-label="Sign out"><Icon name="arrow" size={22} /></button></header><main className="app-main"><div className="review-banner"><div><Icon name="shield" size={22} /><span><strong>Secure Trailblaze access</strong><small>Your view is based on your live company role. New records appear here as the team creates them.</small></span></div></div>{children}</main><nav className="app-nav">{links.map(([id,label,icon]) => <button key={id} className={active === id ? 'active' : ''} onClick={() => go(`/app/${id}`)}><Icon name={icon} size={27} /><span>{label}</span></button>)}<button className={active === 'settings' ? 'active' : ''} onClick={() => go('/app/settings')}><Icon name="menu" size={27} /><span>Settings</span></button></nav></div>;
}
function AppIntro({ title, copy, action, onAction }) { return <div className="app-intro"><div><h1>{title}</h1><p>{copy}</p></div>{action && <button className="btn btn-dark" onClick={onAction}><Icon name="plus" size={17} /> {action}</button>}</div>; }
function useLiveData(key, load) {
  const [state, setState] = useState({ loading: true, data: [], error: '' });
  // Callers pass a fresh loader; the key is the intentional reload contract.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { let active = true; load().then((result) => { if (active) setState({ loading: false, data: result.data || [], error: result.error?.message || '' }); }); return () => { active = false; }; }, [key]);
  return state;
}
function EmptyState({ title, copy }) { return <div className="empty-state"><Icon name="info" size={28} /><strong>{title}</strong><span>{copy}</span></div>; }
function AppOverview({ session }) {
  const [refresh, setRefresh] = useState(0); const jobs = useLiveData(`overview-jobs-${refresh}`, () => supabase.from('jobs').select('id,status').neq('status', 'completed')); const applications = useLiveData(`overview-applications-${refresh}`, () => supabase.from('career_applications').select('id', { count: 'exact' }).in('status', ['submitted', 'interview_ready', 'interview_complete', 'reviewing'])); const held = useLiveData(`overview-payouts-${refresh}`, () => supabase.from('payouts').select('amount').eq('status', 'held'));
  const heldTotal = held.data.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  return <AppShell active="overview" session={session}><div className="app-cover"><div className="app-cover-top"><Brand inverse /><span className="role-pill">{session.label}</span></div><div className="app-profile"><div className="avatar-mark"><Mark /></div><div><strong>{session.name}</strong><span>{session.email}</span></div></div></div><section className="app-content"><span className="eyebrow dark">OVERVIEW</span><h1>Welcome back, {session.name.split(' ')[0]}.</h1><p className="app-lede">Your live Trailblaze operations workspace.</p><div className="overview-cards"><MetricCard icon="clipboard" label="OPEN JOBS" value={jobs.loading ? '...' : String(jobs.data.length)} sub="Live company job board" /><MetricCard icon="briefcase" label="APPLICANTS" value={applications.loading ? '...' : String(applications.data.length)} sub="Awaiting a hiring decision" accent /><MetricCard icon="wallet" label="PAYOUTS HELD" value={held.loading ? '...' : money(heldTotal)} sub="Awaiting verification" /></div><CandidateInbox compact refresh={refresh} /><div className="integrity-card"><Icon name="shield" size={38} /><div><strong>BUILT ON INTEGRITY</strong><p>Quality work, clear communication, and honest building every time.</p></div><button className="btn btn-outline-light" onClick={() => { setRefresh(refresh + 1); go('/app/jobs'); }}>VIEW JOBS <Icon name="arrow" size={16} /></button></div></section></AppShell>;
}
function MetricCard({ icon, label, value, sub, accent, assistant }) { return <div className={`metric-card ${accent ? 'accent' : ''}`}><div className="icon-box"><Icon name={icon} size={31} /></div><div><span>{label}</span><strong>{value}</strong><small>{sub}</small></div>{assistant && <button className="assistant"><Icon name="info" size={18} /> Ask the company<br />assistant</button>}{!assistant && <Icon name="chevron" size={25} />}</div>; }
function CandidateInbox({ compact = false, refresh = 0 }) {
  const [selected, setSelected] = useState(0);
  const [localRefresh, setLocalRefresh] = useState(0);
  const [hireRole, setHireRole] = useState('employee');
  const [message, setMessage] = useState('');
  const { data: candidates, loading, error } = useLiveData(`candidates-${refresh}-${localRefresh}`, () => supabase.from('career_applications').select('*, interview_assessments(*)').order('created_at', { ascending: false }));
  const list = compact ? candidates.slice(0, 2) : candidates;
  const current = list[selected] || list[0];
  const assessment = current?.interview_assessments?.[0];
  async function updateCandidate(status) {
    if (!current) return;
    setMessage('');
    const { error: updateError } = await supabase.from('career_applications').update({ status }).eq('id', current.id);
    setMessage(updateError ? updateError.message : `Candidate moved to ${prettyStatus(status)}.`);
    if (!updateError) setLocalRefresh((value) => value + 1);
  }
  async function hireCandidate() {
    if (!current) return;
    setMessage('');
    const { error: hireError } = await supabase.rpc('hire_applicant', { p_application_id: current.id, p_role: hireRole });
    setMessage(hireError ? hireError.message : `Hired as ${roleLabel(hireRole)} and onboarding started.`);
    if (!hireError) setLocalRefresh((value) => value + 1);
  }
  return <section className={`candidate-inbox ${compact ? 'compact' : ''}`}><div className="candidate-head"><div><span className="eyebrow dark">HIRING</span><h2>{compact ? 'Latest applicants' : 'Applicant scorecards'}</h2><p>Applications, xAI scorecards, owner decisions, and onboarding all land here.</p></div><button className="btn btn-dark" onClick={() => go('/careers')}>OPEN CAREERS PAGE</button></div>{message && <p className={message.includes('permission') || message.includes('needs') || message.includes('Only') ? 'form-error' : 'form-success'}>{message}</p>}{loading ? <EmptyState title="Loading applications" copy="Fetching the latest hiring records." /> : error ? <EmptyState title="Could not load applicants" copy={error} /> : !list.length ? <EmptyState title="No applications yet" copy="New career applications will appear here automatically." /> : <div className="candidate-grid"><div className="candidate-list">{list.map((candidate, index) => { const itemAssessment = candidate.interview_assessments?.[0]; return <button key={candidate.id} className={candidate.id === current?.id ? 'selected' : ''} onClick={() => setSelected(index)}><span className="score-badge">{itemAssessment?.score ?? '—'}</span><span><strong>{candidate.full_name}</strong><small>{candidate.role_applied_for} · {prettyStatus(candidate.status)}</small></span><b>{itemAssessment?.verdict || 'Review'}</b></button>; })}</div><div className="candidate-detail"><div className="score-circle small">{assessment?.score ?? '—'}</div><h3>{current.full_name}</h3><span>{current.role_applied_for} · {current.availability || 'Availability not provided'}</span><p>{assessment?.summary || 'Application received. The interview assessment will appear after the candidate completes it.'}</p><div className="score-lists"><div><strong>Strengths</strong>{(assessment?.strengths || ['Awaiting AI interview']).map((item) => <span key={item}><Icon name="check" size={15} /> {item}</span>)}</div><div><strong>Owner follow-up</strong>{(assessment?.risks || ['Review experience and availability.']).map((item) => <span key={item}><Icon name="info" size={15} /> {item}</span>)}</div></div><div className="hire-row"><select value={hireRole} onChange={(event) => setHireRole(event.target.value)}><option value="employee">Employee access</option><option value="manager">Manager access</option></select><button onClick={hireCandidate}>Hire & start onboarding</button></div><div className="candidate-actions"><button onClick={() => updateCandidate('interview_requested')}>Request interview</button><button onClick={() => updateCandidate('offer_sent')}>Send offer</button><button onClick={() => updateCandidate('declined')}>Decline</button></div></div></div>}</section>;
}
function AppHiring({ session }) { return <AppShell active="hiring" session={session}><section className="app-content hiring-page"><AppIntro title="Hiring" copy={<>Applications, interview assessments,<br />and owner decisions in one place.</>} action="View careers page" onAction={() => go('/careers')} /><CandidateInbox /><div className="onboarding-flow"><span className="eyebrow dark">ONBOARDING</span><h2>Hiring pipeline</h2><div><span><Icon name="clipboard" size={22} /> Application</span><span><Icon name="bubble" size={22} /> AI interview</span><span><Icon name="chart" size={22} /> Owner scorecard</span><span><Icon name="shield" size={22} /> Hire & onboard</span></div></div></section></AppShell>; }
function AppJobs({ session }) {
  const [filter, setFilter] = useState('all'); const [refresh, setRefresh] = useState(0); const [adding, setAdding] = useState(false); const [formError, setFormError] = useState(''); const [formMessage, setFormMessage] = useState('');
  const { data: jobs, loading, error } = useLiveData(`jobs-${filter}-${refresh}`, () => { let query = supabase.from('jobs').select('*').order('due_at', { ascending: true, nullsFirst: false }); if (filter !== 'all') query = query.eq('status', filter); return query; });
  const { data: team } = useLiveData('job-team', () => supabase.from('profiles').select('id, full_name, role').in('role', ['manager', 'employee']).eq('active', true).order('full_name'));
  async function createJob(event) {
    event.preventDefault(); setFormError(''); setFormMessage('');
    const fields = new FormData(event.currentTarget);
    const assigneeIds = fields.getAll('assignees');
    const payload = { p_title: fields.get('title'), p_address: fields.get('address'), p_client_name: fields.get('clientName') || null, p_due_at: fields.get('dueAt') || null, p_status: fields.get('status') || 'scheduled', p_priority: fields.get('priority') || 'normal', p_notes: fields.get('notes') || null, p_payout_amount: Number(fields.get('payout') || 0), p_assignee_ids: assigneeIds };
    const { error: workflowError } = await supabase.rpc('post_job_with_workflow', payload);
    if (workflowError) {
      const { error: insertError } = await supabase.from('jobs').insert({ title: payload.p_title, address: payload.p_address, client_name: payload.p_client_name, notes: payload.p_notes, due_at: payload.p_due_at, payout_amount: payload.p_payout_amount, created_by: session.id, status: payload.p_status, priority: payload.p_priority });
      if (insertError) { setFormError(workflowError.message || insertError.message); return; }
      setFormMessage('Job posted. The full alert workflow will activate after the workflow migration is approved live.');
    } else {
      setFormMessage('Job posted, assigned team members notified, and payout hold created.');
    }
    setAdding(false); setRefresh(refresh + 1);
  }
  const tabs = [['all', 'All'], ['draft', 'Draft'], ['scheduled', 'Scheduled'], ['in_progress', 'In progress'], ['awaiting_verification', 'Awaiting verification'], ['completed', 'Completed']];
  return <AppShell active="jobs" session={session}><section className="app-content jobs-page"><AppIntro title="All jobs" copy={<>Every live job record in the company,<br />newest schedule first.</>} action={session.role === 'employee' ? null : 'Post a job'} onAction={() => setAdding(!adding)} />{formError && <p className="form-error">{formError}</p>}{formMessage && <p className="form-success">{formMessage}</p>}{adding && <form className="inline-form job-post-form" onSubmit={createJob}><div className="form-row"><input name="title" placeholder="Job title *" required /><input name="clientName" placeholder="Client name" /></div><input name="address" placeholder="Job address *" required /><div className="form-row"><input name="dueAt" type="datetime-local" /><select name="status" defaultValue="scheduled"><option value="scheduled">Scheduled</option><option value="in_progress">In progress</option><option value="awaiting_verification">Awaiting verification</option></select></div><div className="form-row"><select name="priority" defaultValue="normal"><option value="low">Low priority</option><option value="normal">Normal priority</option><option value="medium">Medium priority</option><option value="high">High priority</option><option value="urgent">Urgent priority</option></select><input name="payout" type="number" min="0" step="0.01" placeholder="Payout amount" /></div><div className="assignee-picker"><strong>Alert and assign team members</strong>{team.length ? team.map((member) => <label key={member.id}><input type="checkbox" name="assignees" value={member.id} /> {member.full_name} <span>{roleLabel(member.role)}</span></label>) : <small>No active employees or managers found yet.</small>}</div><textarea name="notes" placeholder="Scope, notes, materials, and client expectations" /><button className="btn btn-dark">POST JOB & ALERT TEAM</button></form>}<div className="app-tabs">{tabs.map(([value, label]) => <button key={value} className={filter === value ? 'selected' : ''} onClick={() => setFilter(value)}>{label}</button>)}</div><div className="list-heading"><h2>{filter === 'all' ? 'Company job board' : prettyStatus(filter)}</h2><span>{loading ? '...' : jobs.length}</span></div>{loading ? <EmptyState title="Loading jobs" copy="Fetching the live job board." /> : error ? <EmptyState title="Could not load jobs" copy={error} /> : !jobs.length ? <EmptyState title="No jobs yet" copy="Create the first job to start the operational board." /> : jobs.map((job) => <JobCard key={job.id} job={job} />)}</section></AppShell>;
}
function JobCard({ job, compact = false }) { return <article className={`job-card ${compact ? 'compact' : ''}`}><div className="job-top"><div className="icon-box"><Icon name={job.status === 'completed' ? 'check' : job.status === 'scheduled' ? 'calendar' : 'clipboard'} size={30} /></div><div><span className="job-meta">{job.reference_code} · {dateTime(job.due_at)}</span><h3>{job.title}</h3><p><Icon name="map" size={18} /> {job.address}</p>{!compact && job.notes && <p><Icon name="info" size={18} /> {job.notes}</p>}</div><span className={`status ${job.status === 'awaiting_verification' || job.status === 'scheduled' ? 'pending' : ''}`}>{prettyStatus(job.status)}</span></div><div className="job-bottom"><strong>{money(job.payout_amount)}</strong></div></article>; }
function AppPayouts({ session }) { const [exported, setExported] = useState(false); const { data: payouts, loading, error } = useLiveData('payouts', () => supabase.from('payouts').select('*, jobs(reference_code,title,address)').order('created_at', { ascending: false })); const total = (status) => payouts.filter((item) => item.status === status).reduce((sum, item) => sum + Number(item.amount || 0), 0); return <AppShell active="payouts" session={session}><section className="app-content payouts-page"><AppIntro title="Payouts" copy={<>Every payout is created and held.<br />Verification is the only thing that clears one.</>} action="Export" onAction={() => setExported(true)} />{exported && <div className="toast-note"><Icon name="download" size={19} /> Payout report prepared.</div>}<div className="payout-metrics"><MetricCard icon="lock" label="HELD" value={loading ? '...' : money(total('held'))} sub="Job not verified yet" /><MetricCard icon="shield" label="ELIGIBLE" value={loading ? '...' : money(total('eligible'))} sub="Verified, cleared to send" /><MetricCard icon="wallet" label="PAID" value={loading ? '...' : money(total('paid'))} sub="Sent" /></div><div className="notice"><Icon name="info" size={23} /><p><strong>Operational status</strong><span>Payouts are recorded here. Bank transfers are enabled only after the company connects a payment provider.</span></p></div><h2 className="app-section-title">Payout history</h2><div className="app-tabs payout-tabs"><button className="selected">All</button><button>Held</button><button>Eligible</button><button>Paid</button></div><div className="payout-list">{loading ? <EmptyState title="Loading payouts" copy="Fetching payout records." /> : error ? <EmptyState title="Could not load payouts" copy={error} /> : !payouts.length ? <EmptyState title="No payouts yet" copy="Payouts will appear here when jobs are created and assigned." /> : payouts.map((item) => <div className="payout-row" key={item.id}><div className="icon-box"><Icon name="wallet" size={27} /></div><div><strong>{item.jobs?.title || 'Payout record'}</strong><span>{item.jobs?.reference_code || 'Unassigned job'} · {item.note || 'No note added'}</span></div><div><span className={`status ${item.status === 'held' ? 'pending' : ''}`}>{prettyStatus(item.status)}</span><b>{money(item.amount)}</b></div><Icon name="chevron" size={21} /></div>)}</div><div className="assistant-card"><Icon name="info" size={31} /><div><strong>Have a question about payouts?</strong><span>The assistant can answer questions about holds, verification, and payout status.</span></div><button className="btn btn-dark" onClick={() => setExported(true)}>Ask assistant</button></div></section></AppShell>; }
function AppTeam({ session }) {
  const [showInvite, setShowInvite] = useState(false); const [refresh, setRefresh] = useState(0); const [message, setMessage] = useState('');
  const membersState = useLiveData(`members-${refresh}`, () => supabase.from('profiles').select('*').order('created_at', { ascending: false }));
  const invitesState = useLiveData(`invites-${refresh}`, () => supabase.from('invitations').select('*').order('created_at', { ascending: false }));
  const onboardingState = useLiveData(`onboarding-${refresh}`, () => supabase.from('onboarding_checklists').select('*, onboarding_tasks(*), profiles(full_name,email), invitations(full_name,email)').order('created_at', { ascending: false }));
  const members = membersState.data;
  const invites = invitesState.data;
  const activeMembers = members.filter((member) => member.active);
  async function invite(event) {
    event.preventDefault(); setMessage('');
    const fields = new FormData(event.currentTarget);
    const { error } = await supabase.rpc('create_team_invitation', { p_email: fields.get('email'), p_full_name: fields.get('fullName'), p_phone: fields.get('phone') || '', p_role: fields.get('role') });
    setMessage(error ? error.message : 'Invite created and onboarding checklist prepared.');
    if (!error) { setShowInvite(false); setRefresh((value) => value + 1); }
  }
  return <AppShell active="team" session={session}><section className="app-content team-page"><AppIntro title="Team" copy={<>Manage your crew, project managers,<br />and field team access.</>} action={session.role === 'employee' || session.role === 'applicant' ? null : 'Onboard someone'} onAction={() => setShowInvite(!showInvite)} />{message && <p className={message.includes('Only') || message.includes('permission') ? 'form-error' : 'form-success'}>{message}</p>}{showInvite && <form className="inline-form onboarding-invite" onSubmit={invite}><div className="form-row"><input name="fullName" placeholder="Full name *" required /><input name="email" type="email" placeholder="Email *" required /></div><div className="form-row"><input name="phone" placeholder="Phone" /><select name="role" defaultValue="employee"><option value="employee">Employee</option><option value="manager">Manager</option></select></div><button className="btn btn-dark">CREATE INVITE & ONBOARDING</button></form>}<div className="team-stats"><Stat icon="users" n={String(members.length)} label="Team members" sub="Total roster" /><Stat icon="check" n={String(activeMembers.length)} label="Active" sub="Currently active" /><Stat icon="clock" n={String(invites.filter((item) => !item.accepted_at).length)} label="Pending" sub="Awaiting signup" /><Stat icon="clipboard" n={String(onboardingState.data.length)} label="Onboarding" sub="Open checklists" /></div><div className="member-list">{membersState.loading ? <EmptyState title="Loading team" copy="Fetching live team members." /> : membersState.error ? <EmptyState title="Could not load team" copy={membersState.error} /> : !members.length ? <EmptyState title="No team members yet" copy="Invite Heather, managers, or employees to begin." /> : members.map((member) => <div className="member-row" key={member.id}><div className="person-avatar">{(member.full_name || member.email || 'TB').split(' ').map(x => x[0]).join('').slice(0,2).toUpperCase()}</div><div><strong>{member.full_name || member.email}</strong><span>{member.email}</span><small>Joined {dateTime(member.created_at)}</small></div><div><span className="role-badge">{roleLabel(member.role)}</span><small className={member.active ? 'active-text' : 'pending-text'}>● {member.active ? 'Active' : 'Inactive'}</small></div><b>⋮</b></div>)}</div><div className="onboarding-flow live-onboarding"><span className="eyebrow dark">ONBOARDING</span><h2>Employee onboarding workflow</h2>{onboardingState.loading ? <EmptyState title="Loading onboarding" copy="Checking onboarding checklists." /> : !onboardingState.data.length ? <EmptyState title="No onboarding checklists" copy="Create an invite or hire an applicant to start onboarding." /> : onboardingState.data.map((checklist) => { const tasks = [...(checklist.onboarding_tasks || [])].sort((a, b) => a.sort_order - b.sort_order); const complete = tasks.filter((task) => task.completed_at).length; return <div className="onboarding-card" key={checklist.id}><strong>{checklist.profiles?.full_name || checklist.invitations?.full_name || 'Pending team member'} <span>{complete}/{tasks.length} complete</span></strong><div>{tasks.map((task) => <span key={task.id} className={task.completed_at ? 'done' : ''}><Icon name={task.completed_at ? 'check' : 'clock'} size={16} /> {task.title}</span>)}</div></div>; })}</div><div className="secure-card"><Icon name="shield" size={32} /><div><strong>Secure access. Right people only.</strong><p>Heather can assign operational roles. Developer settings stay available only to platform admin access.</p></div><button className="btn btn-outline-dark" onClick={() => go('/app/settings')}>Open permissions</button></div></section></AppShell>;
}
function Stat({ icon, n, label, sub }) { return <div><Icon name={icon} size={27} /><strong>{n}</strong><span>{label}</span><small>{sub}</small></div>; }
function AppNotifications({ session }) {
  const [filter, setFilter] = useState('all'); const [refresh, setRefresh] = useState(0);
  const { data: items, loading, error } = useLiveData(`notifications-${filter}-${refresh}`, () => { let query = supabase.from('notifications').select('*').order('created_at', { ascending: false }).limit(50); if (filter !== 'all') query = query.eq('category', filter); return query; });
  const unread = items.filter((item) => !item.read_at).length;
  async function markAllRead() {
    const ids = items.filter((item) => !item.read_at).map((item) => item.id);
    if (!ids.length) return;
    await supabase.from('notifications').update({ read_at: new Date().toISOString() }).in('id', ids);
    setRefresh((value) => value + 1);
  }
  return <AppShell active="notifications" session={session}><section className="app-content notifications-page"><AppIntro title="Notifications" copy={<>Live in-app alerts for jobs, hiring,<br />team onboarding, payouts, and AI leads.</>} action={unread ? `Mark ${unread} read` : 'Settings'} onAction={unread ? markAllRead : () => go('/app/settings')} /><div className="app-tabs notification-tabs">{[['all','All'],['job','Jobs'],['payout','Payouts'],['team','Team'],['hiring','Hiring'],['system','System']].map(([value,label]) => <button key={value} className={filter === value ? 'selected' : ''} onClick={() => setFilter(value)}>{label}</button>)}</div><h2 className="app-section-title">{filter === 'all' ? 'All alerts' : prettyStatus(filter)}</h2><div className="notification-list">{loading ? <EmptyState title="Loading notifications" copy="Fetching live alerts." /> : error ? <EmptyState title="Could not load alerts" copy={error} /> : !items.length ? <EmptyState title="No alerts yet" copy="Workflow alerts will appear here as jobs, applicants, and leads move." /> : items.map((item) => <NotificationRow key={item.id} item={item} />)}</div><div className="loop-card"><div className="icon-box"><Icon name="shield" size={29} /></div><div><strong>Stay in the loop</strong><p>Important updates about your jobs, payouts, team, hiring, and AI lead intake all land in one place.</p></div><button className="btn btn-outline-dark" onClick={() => go('/app/settings')}>Learn more</button></div></section></AppShell>;
}
function NotificationRow({ item }) { const icon = item.category === 'job' ? 'clipboard' : item.category === 'payout' ? 'wallet' : item.category === 'team' ? 'users' : item.category === 'hiring' ? 'briefcase' : 'shield'; const color = item.category === 'system' ? 'blue' : item.category === 'team' ? 'orange' : 'green'; return <div className={`notification-row ${item.read_at ? 'read' : ''}`}><div className="icon-box"><Icon name={icon} size={29} /></div><i className={`dot ${color}`}></i><div><strong>{item.title}</strong><p>{item.body}</p></div><span>{dateTime(item.created_at)}</span><Icon name="chevron" size={19} /></div>; }
function AppSettings({ session }) {
  const [refresh, setRefresh] = useState(0); const [message, setMessage] = useState('');
  const workflows = useLiveData(`workflows-${refresh}`, () => supabase.from('workflow_settings').select('*').order('label'));
  const permissions = useLiveData(`permissions-${refresh}`, () => supabase.from('role_permissions').select('*').order('role'));
  const roles = useLiveData(`job-roles-${refresh}`, () => supabase.from('job_role_templates').select('*').order('title'));
  const platform = useLiveData(`platform-${refresh}`, () => supabase.from('platform_settings').select('*').order('key'));
  async function toggleWorkflow(item) {
    setMessage('');
    const { error } = await supabase.from('workflow_settings').update({ enabled: !item.enabled, updated_by: session.id }).eq('key', item.key);
    setMessage(error ? error.message : `${item.label} ${item.enabled ? 'paused' : 'enabled'}.`);
    if (!error) setRefresh((value) => value + 1);
  }
  async function toggleRole(item) {
    setMessage('');
    const { error } = await supabase.from('job_role_templates').update({ active: !item.active, updated_by: session.id }).eq('id', item.id);
    setMessage(error ? error.message : `${item.title} ${item.active ? 'hidden from careers' : 'shown on careers'}.`);
    if (!error) setRefresh((value) => value + 1);
  }
  return <AppShell active="settings" session={session}><section className="app-content settings-page"><AppIntro title="Settings" copy={`Manage ${session.name}'s account, company workflows, and permissions.`} />{message && <p className={message.includes('permission') || message.includes('not') ? 'form-error' : 'form-success'}>{message}</p>}<div className="settings-group"><h2>ACCOUNT</h2><div><button className="setting-row"><div className="icon-box"><Icon name="user" size={27} /></div><span><strong>Profile & personal info</strong><small>{session.email}</small></span><Icon name="chevron" size={19} /></button><button className="setting-row"><div className="icon-box"><Icon name="lock" size={27} /></div><span><strong>Login & security</strong><small>Managed securely through Clerk authentication.</small></span><Icon name="chevron" size={19} /></button></div></div><div className="settings-group"><h2>WORKFLOWS</h2><div>{workflows.loading ? <EmptyState title="Loading workflows" copy="Fetching workflow settings." /> : workflows.error ? <EmptyState title="Workflow settings need migration" copy={workflows.error} /> : workflows.data.map((item) => <button className="setting-row workflow-toggle" key={item.key} onClick={() => toggleWorkflow(item)}><div className="icon-box"><Icon name={item.key.includes('job') ? 'clipboard' : item.key.includes('onboarding') ? 'users' : item.key.includes('lead') ? 'bubble' : 'shield'} size={27} /></div><span><strong>{item.label}</strong><em>{item.enabled ? 'Enabled' : 'Paused'}</em><small>{item.description}</small></span><b className={item.enabled ? 'available' : 'pending-text'}>{item.enabled ? 'On' : 'Off'}</b></button>)}</div></div><div className="settings-group"><h2>ROLE PERMISSIONS</h2><div>{permissions.loading ? <EmptyState title="Loading permissions" copy="Checking role permission sets." /> : permissions.error ? <EmptyState title="Could not load permissions" copy={permissions.error} /> : permissions.data.filter((item) => session.role === 'platform_admin' || item.role !== 'platform_admin').map((item) => <div className="setting-row permission-row" key={item.role}><div className="icon-box"><Icon name={item.role === 'platform_admin' ? 'key' : item.role === 'owner' ? 'shield' : item.role === 'manager' ? 'clipboard' : item.role === 'applicant' ? 'user' : 'hammer'} size={27} /></div><span><strong>{roleLabel(item.role)}</strong><small>{item.description}</small><small>{(item.permissions || []).join(' / ')}</small></span></div>)}</div></div><div className="settings-group"><h2>CAREERS ROLES</h2><div>{roles.loading ? <EmptyState title="Loading roles" copy="Fetching careers role templates." /> : roles.error ? <EmptyState title="Could not load roles" copy={roles.error} /> : roles.data.map((item) => <button className="setting-row" key={item.id} onClick={() => toggleRole(item)}><div className="icon-box"><Icon name={item.access_role === 'manager' ? 'clipboard' : 'hammer'} size={27} /></div><span><strong>{item.title}</strong><em>{roleLabel(item.access_role)}</em><small>{item.description}</small></span><b className={item.active ? 'available' : 'pending-text'}>{item.active ? 'Live' : 'Hidden'}</b></button>)}</div></div>{session.role === 'platform_admin' && <div className="settings-group developer-settings"><h2>DEVELOPER WEBMASTER</h2><div>{platform.loading ? <EmptyState title="Loading platform settings" copy="Checking system configuration." /> : platform.error ? <EmptyState title="Could not load platform settings" copy={platform.error} /> : platform.data.map((item) => <div className="setting-row permission-row" key={item.key}><div className="icon-box"><Icon name="key" size={27} /></div><span><strong>{prettyStatus(item.key)}</strong><small>{JSON.stringify(item.value)}</small></span></div>)}</div></div>}</section></AppShell>;
}

function DeveloperDashboard({ session }) {
  const profiles = useLiveData('developer-profiles', () => supabase.from('profiles').select('id, email, role, active, clerk_user_id').order('created_at', { ascending: false }));
  const settings = useLiveData('developer-settings', () => supabase.from('platform_settings').select('*').order('key'));
  const workflows = useLiveData('developer-workflows', () => supabase.from('workflow_settings').select('*').order('key'));
  return <AppShell active="developer" session={session}><section className="app-content developer-page"><AppIntro title="Developer webmaster" copy="Platform-level configuration for authentication, role access, workflow health, and integrations." /><div className="overview-cards"><MetricCard icon="key" label="ADMIN EMAIL" value="John" sub="johnmatveyev@gmail.com" accent /><MetricCard icon="shield" label="AUTH PROVIDER" value="Clerk" sub={clerkPublishableKey ? 'Publishable key detected' : 'Vercel key missing'} /><MetricCard icon="bubble" label="AI ROUTING" value="xAI" sub="Hiring voice and public lead intake" /></div><div className="settings-group"><h2>ACCESS MAP</h2><div>{profiles.loading ? <EmptyState title="Loading access" copy="Fetching live users." /> : profiles.data.map((profile) => <div className="setting-row permission-row" key={profile.id}><div className="icon-box"><Icon name={profile.role === 'platform_admin' ? 'key' : 'user'} size={27} /></div><span><strong>{profile.email}</strong><small>{roleLabel(profile.role)} · {profile.active ? 'active' : 'inactive'} · {profile.clerk_user_id ? 'Clerk linked' : 'not linked yet'}</small></span></div>)}</div></div><div className="settings-group"><h2>SYSTEM CONFIGURATION</h2><div>{settings.data.map((item) => <div className="setting-row permission-row" key={item.key}><div className="icon-box"><Icon name="shield" size={27} /></div><span><strong>{prettyStatus(item.key)}</strong><small>{JSON.stringify(item.value)}</small></span></div>)}</div></div><div className="settings-group"><h2>WORKFLOW HEALTH</h2><div>{workflows.data.map((item) => <div className="setting-row permission-row" key={item.key}><div className="icon-box"><Icon name={item.enabled ? 'check' : 'clock'} size={27} /></div><span><strong>{item.label || item.key}</strong><small>{item.enabled ? 'Enabled' : 'Paused'} · {item.description || 'Workflow setting'}</small></span></div>)}</div></div></section></AppShell>;
}

function EmployeeDashboard({ session }) {
  const [checkedIn, setCheckedIn] = useState(false);
  const assigned = useLiveData(`employee-jobs-${session.id}`, () => supabase.from('job_assignments').select('jobs(*)').eq('user_id', session.id));
  const jobs = assigned.data.map((row) => row.jobs).filter(Boolean).filter((job) => job.status !== 'completed' && job.status !== 'cancelled');
  return <AppShell active="employee" session={session}><section className="app-content employee-page"><div className="employee-hero"><div><span className="eyebrow">FIELD DASHBOARD</span><h1>Good morning, {session.name.split(' ')[0]}.</h1><p>You have {jobs.length} active jobs and your onboarding checklist in the task tab.</p></div><button className={`btn ${checkedIn ? 'btn-outline-light' : 'btn-light'}`} onClick={() => setCheckedIn(!checkedIn)}>{checkedIn ? 'Clocked in' : 'Clock in'}</button></div><div className="overview-cards employee-metrics"><MetricCard icon="clipboard" label="TODAY'S JOBS" value={assigned.loading ? '...' : String(jobs.length)} sub="Assigned to you" /><MetricCard icon="clock" label="HOURS" value={checkedIn ? 'Running' : '0.0'} sub={checkedIn ? 'Time card active' : 'Not clocked in'} /><MetricCard icon="shield" label="VERIFY DUE" value={String(jobs.filter((job) => job.status === 'awaiting_verification').length)} sub="Needs photos" /></div><h2 className="app-section-title">Next up</h2>{assigned.loading ? <EmptyState title="Loading assigned jobs" copy="Checking your job board." /> : assigned.error ? <EmptyState title="Could not load jobs" copy={assigned.error} /> : !jobs.length ? <EmptyState title="No assigned jobs yet" copy="New assignments will appear here after the owner posts a job." /> : jobs.map((job) => <EmployeeJob key={job.id} job={job} session={session} />)}<div className="secure-card"><Icon name="send" size={32} /><div><strong>Send field update</strong><p>Employees can submit notes and completion status from their assigned jobs.</p></div><button className="btn btn-dark" onClick={() => go('/app/tasks')}>Open tasks</button></div></section></AppShell>;
}

function EmployeeJob({ job, session }) {
  const [state, setState] = useState(job.status);
  async function update(status) {
    setState(status);
    await supabase.from('job_updates').insert({ job_id: job.id, author_id: session.id, kind: 'status', body: `Employee updated job status to ${prettyStatus(status)}.`, status });
    await supabase.from('jobs').update({ status }).eq('id', job.id);
  }
  return <article className="employee-job"><div className="employee-job-head"><div className="icon-box"><Icon name="briefcase" size={28} /></div><div><span>{job.reference_code} · {dateTime(job.due_at)}</span><h3>{job.title}</h3><p>{job.address}</p></div><b className={`status ${state === 'scheduled' ? 'pending' : ''}`}>{prettyStatus(state)}</b></div><p>{job.notes || 'No field notes yet.'}</p><div className="employee-actions"><button onClick={() => update('in_progress')}>Start</button><button onClick={() => update('awaiting_verification')}>Submit update</button><button onClick={() => update('completed')}>Mark complete</button></div></article>;
}

function EmployeeTasks({ session }) {
  const [refresh, setRefresh] = useState(0);
  const { data: checklists, loading, error } = useLiveData(`employee-onboarding-${session.id}-${refresh}`, () => supabase.from('onboarding_checklists').select('*, onboarding_tasks(*)').eq('profile_id', session.id).order('created_at', { ascending: false }));
  async function complete(task) { await supabase.rpc('complete_onboarding_task', { p_task_id: task.id }); setRefresh((value) => value + 1); }
  return <AppShell active="tasks" session={session}><section className="app-content"><AppIntro title="Tasks" copy="Your onboarding checklist and field work tasks." /><div className="task-list">{loading ? <EmptyState title="Loading tasks" copy="Fetching onboarding tasks." /> : error ? <EmptyState title="Could not load tasks" copy={error} /> : !checklists.length ? <EmptyState title="No onboarding tasks" copy="Onboarding tasks appear after an owner invites or hires you." /> : checklists.flatMap((checklist) => [...(checklist.onboarding_tasks || [])].sort((a, b) => a.sort_order - b.sort_order)).map((task) => <button key={task.id} className={task.completed_at ? 'done' : ''} onClick={() => !task.completed_at && complete(task)}><Icon name={task.completed_at ? 'check' : 'clipboard'} size={22} /><span><strong>{task.title}</strong><small>{task.description}</small></span></button>)}</div></section></AppShell>;
}

function EmployeeSchedule({ session }) {
  const assigned = useLiveData(`employee-schedule-${session.id}`, () => supabase.from('job_assignments').select('jobs(*)').eq('user_id', session.id));
  const jobs = assigned.data.map((row) => row.jobs).filter(Boolean).sort((a, b) => new Date(a.due_at || 0) - new Date(b.due_at || 0));
  return <AppShell active="schedule" session={session}><section className="app-content"><AppIntro title="Schedule" copy="Daily field schedule with route-ready job details." /><div className="schedule-list">{assigned.loading ? <EmptyState title="Loading schedule" copy="Checking assigned work." /> : !jobs.length ? <EmptyState title="No scheduled work" copy="Assigned jobs with due dates will appear here." /> : jobs.map((job) => <div key={job.id} className="schedule-row"><strong>{dateTime(job.due_at)}</strong><div><h3>{job.title}</h3><p>{job.address}</p></div><span className="status">{prettyStatus(job.priority)}</span></div>)}</div></section></AppShell>;
}

function EmployeeTime({ session }) {
  const [clocked, setClocked] = useState(false); const [entryId, setEntryId] = useState(null); const [refresh, setRefresh] = useState(0);
  const entries = useLiveData(`time-${session.id}-${refresh}`, () => supabase.from('time_entries').select('*').eq('user_id', session.id).order('clocked_in_at', { ascending: false }).limit(8));
  async function toggleClock() {
    if (!clocked) {
      const { data } = await supabase.from('time_entries').insert({ user_id: session.id, notes: 'Clocked in from employee dashboard.' }).select('id').single();
      setEntryId(data?.id || null); setClocked(true);
    } else {
      if (entryId) await supabase.from('time_entries').update({ clocked_out_at: new Date().toISOString() }).eq('id', entryId);
      setEntryId(null); setClocked(false); setRefresh((value) => value + 1);
    }
  }
  return <AppShell active="time" session={session}><section className="app-content"><AppIntro title="Time card" copy="Time tracking for employee hours and job costing." /><div className="time-card"><Icon name="clock" size={44} /><span>{clocked ? 'Clocked in' : 'Ready to clock in'}</span><strong>{clocked ? 'Running' : '00:00:00'}</strong><button className="btn btn-dark" onClick={toggleClock}>{clocked ? 'Clock out' : 'Clock in'}</button></div><div className="payout-list">{entries.loading ? <EmptyState title="Loading time" copy="Fetching time entries." /> : !entries.data.length ? <EmptyState title="No time entries" copy="Clock in to create your first time record." /> : entries.data.map((entry) => <div className="payout-row" key={entry.id}><div className="icon-box"><Icon name="calendar" size={25} /></div><div><strong>{dateTime(entry.clocked_in_at)}</strong><span>{entry.notes || 'Time entry'}</span></div><div><b>{entry.clocked_out_at ? 'Closed' : 'Open'}</b></div></div>)}</div></section></AppShell>;
}

function ApplicantPortal({ session }) {
  const { data: applications, loading, error } = useLiveData(`applicant-${session.id}`, () => supabase.from('career_applications').select('*, interview_assessments(*)').order('created_at', { ascending: false }));
  const application = applications[0]; const assessment = application?.interview_assessments?.[0];
  return <AppShell active="application" session={session}><section className="app-content applicant-page"><AppIntro title="Application status" copy="Track your Trailblaze application and next steps from one place." /><div className="applicant-status-card">{loading ? <EmptyState title="Loading application" copy="Checking your latest status." /> : error ? <EmptyState title="Could not load application" copy={error} /> : !application ? <EmptyState title="No application linked" copy="Apply from the careers page or contact Trailblaze if this looks wrong." /> : <><span className="eyebrow dark">{prettyStatus(application.status)}</span><h2>{application.role_applied_for}</h2><p>Submitted as {application.full_name}. The Trailblaze owner team can now review your application, interview notes, and hiring scorecard.</p><div className="applicant-timeline"><span className="done"><Icon name="check" size={16} /> Application submitted</span><span className={assessment ? 'done' : ''}><Icon name={assessment ? 'check' : 'clock'} size={16} /> AI interview scorecard</span><span><Icon name="user" size={16} /> Owner review</span><span><Icon name="shield" size={16} /> Hiring decision and onboarding</span></div>{assessment && <div className="candidate-detail applicant-score"><div className="score-circle small">{assessment.score}</div><h3>{assessment.verdict}</h3><p>{assessment.summary}</p></div>}</>}</div><div className="secure-card"><Icon name="bell" size={32} /><div><strong>Updates will appear here</strong><p>When the owner changes your status, requests next steps, or starts onboarding, this dashboard is the place to check.</p></div><button className="btn btn-outline-dark" onClick={() => go('/contact')}>Contact Trailblaze</button></div></section></AppShell>;
}

function AppRouter({ path, session }) { if (session.role === 'applicant') return <ApplicantPortal session={session} />; const page = path.split('/')[2] || (session.role === 'employee' ? 'employee' : 'overview'); if (page === 'jobs') return <AppJobs session={session} />; if (page === 'hiring') return <AppHiring session={session} />; if (page === 'payouts') return <AppPayouts session={session} />; if (page === 'team') return <AppTeam session={session} />; if (page === 'notifications') return <AppNotifications session={session} />; if (page === 'settings') return <AppSettings session={session} />; if (page === 'developer' && session.role === 'platform_admin') return <DeveloperDashboard session={session} />; if (page === 'employee') return <EmployeeDashboard session={session} />; if (page === 'tasks') return <EmployeeTasks session={session} />; if (page === 'schedule') return <EmployeeSchedule session={session} />; if (page === 'time') return <EmployeeTime session={session} />; return <AppOverview session={session} />;
}
function PublicRouter({ path }) { if (path === '/about') return <About />; if (path === '/services') return <Services />; if (path === '/work') return <Work />; if (path === '/reviews') return <Reviews />; if (path === '/careers') return <Careers />; if (path === '/contact') return <Contact />; return <Home />; }
function ClerkApp() {
  const [path, setPath] = useState(typeof window === 'undefined' ? '/' : window.location.pathname);
  const [session, setSession] = useState(null);
  const [authError, setAuthError] = useState('');
  const [authReady, setAuthReady] = useState(false);
  const { isLoaded, isSignedIn, user } = useUser();
  const { session: clerkSession } = useSession();
  useEffect(() => {
    setSupabaseAccessTokenProvider(async () => clerkSession ? clerkSession.getToken() : null);
  }, [clerkSession]);
  useEffect(() => {
    const syncSession = async () => {
      if (!isLoaded) return;
      if (!isSignedIn || !user) { setSession(null); setAuthReady(true); return; }
      try {
        const profile = await getClerkProfile(user);
        setSession(profile);
        setAuthError(profile ? '' : 'This account does not have active Trailblaze access yet.');
      } catch (error) {
        setSession(null);
        setAuthError(error?.message || 'This account does not have active Trailblaze access yet.');
      }
      setAuthReady(true);
    };
    const handler = () => { setPath(window.location.pathname); syncSession(); };
    syncSession();
    window.addEventListener('popstate', handler);
    return () => {
      window.removeEventListener('popstate', handler);
    };
  }, [isLoaded, isSignedIn, user]);
  if (path === '/login') return <Login />;
  if (path.startsWith('/app')) {
    if (!authReady) return <div className="login-page"><div className="login-inner"><Brand /><p>Loading secure workspace...</p></div></div>;
    if (!session) return <div><Login />{authError && <div className="floating-auth-error">{authError}</div>}</div>;
    return <AppRouter path={path} session={session} />;
  }
  return <PublicRouter path={path} />;
}

function PublicOnlyApp() {
  const [path, setPath] = useState(typeof window === 'undefined' ? '/' : window.location.pathname);
  useEffect(() => { const handler = () => setPath(window.location.pathname); window.addEventListener('popstate', handler); return () => window.removeEventListener('popstate', handler); }, []);
  if (path === '/login' || path.startsWith('/app')) return <Login />;
  return <PublicRouter path={path} />;
}

function App() {
  if (!clerkPublishableKey) return <PublicOnlyApp />;
  return <ClerkProvider publishableKey={clerkPublishableKey} afterSignOutUrl="/login"><ClerkApp /></ClerkProvider>;
}

const rootElement = typeof document !== 'undefined' ? document.getElementById('root') : null;
if (rootElement) {
  createRoot(rootElement).render(<App />);
}

export default App;
