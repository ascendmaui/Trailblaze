import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const A = '/assets/';

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

const demoUsers = {
  owner: {
    role: 'owner',
    label: 'Owner',
    name: 'Heather B. Kirk',
    email: 'owner@trailblaze.demo',
    password: 'trailblaze',
    phone: '(864) 982-8394',
  },
  employee: {
    role: 'employee',
    label: 'Employee',
    name: 'Dale Whitmire',
    email: 'employee@trailblaze.demo',
    password: 'trailblaze',
    phone: '(864) 555-0142',
  },
};

const demoJobs = [
  { id: 'TB-1044', title: 'Punch list — Augusta Rd remodel', address: '2214 Augusta St, Greenville, SC', owner: 'Marcus Ellery', due: 'Today, 2:30 PM', status: 'Awaiting verify', payout: '$110.00', assignee: 'Dale Whitmire', priority: 'High', notes: 'Check trim package, cabinet toe-kicks, and final paint touch-ups.' },
  { id: 'TB-1042', title: 'Due diligence repair punch — 108 Rosewood', address: '108 Rosewood Ln, Simpsonville, SC', owner: 'Petra Lang', due: 'Tomorrow, 9:00 AM', status: 'In progress', payout: '$275.00', assignee: 'Dale Whitmire', priority: 'Medium', notes: 'Repair loose handrail, crawlspace vapor barrier, and exterior caulk gaps.' },
  { id: 'TB-1041', title: 'New build — The Ridge Lot 27', address: '27 Ridge View Dr, Travelers Rest, SC', owner: 'Dale Whitmire', due: 'Fri, 8:00 AM', status: 'Scheduled', payout: '$4,850.00', assignee: 'Marcus Ellery', priority: 'Normal', notes: 'Framing walk-through before electrical rough-in.' },
  { id: 'TB-1040', title: 'Kitchen renovation — Parker residence', address: '15 Oak Terrace, Taylors, SC', owner: 'Heather B. Kirk', due: 'Completed Aug 20', status: 'Completed', payout: '$1,850.00', assignee: 'Dale Whitmire', priority: 'Normal', notes: 'Final photos and review request sent.' },
];

const payouts = [
  { job: 'TB-1044', title: 'Punch list — Augusta Rd remodel', amount: '$110.00', status: 'Held', note: 'Waiting on owner verification.' },
  { job: 'TB-1042', title: 'Due diligence repair punch — 108 Rosewood', amount: '$275.00', status: 'Paid', note: 'Sent today at 9:10 AM.' },
  { job: 'TB-1040', title: 'Kitchen renovation — Parker residence', amount: '$1,850.00', status: 'Paid', note: 'Completed Aug 20.' },
];

const seedCandidates = [
  { id: 'CAN-204', name: 'Marcus Riley', role: 'Field Carpenter', phone: '(864) 555-0188', email: 'marcus.riley@example.com', experience: '6 years residential framing and punch-list work', availability: 'Available in 2 weeks', score: 91, verdict: 'Strong fit', status: 'AI screened', summary: 'Practical field experience, safety-minded answers, and strong communication. Recommended for owner interview.', strengths: ['Residential renovation experience', 'Clear jobsite communication', 'Understands punch-list accountability'], risks: ['Needs confirmation on weekly travel range'] },
  { id: 'CAN-203', name: 'Nina Caldwell', role: 'Office Coordinator', phone: '(864) 555-0117', email: 'nina.caldwell@example.com', experience: '3 years scheduling subcontractors and customer updates', availability: 'Immediate', score: 84, verdict: 'Good fit', status: 'Review next', summary: 'Good admin fit with strong scheduling background. Would help tighten client updates and job documentation.', strengths: ['Scheduling', 'Customer follow-up', 'Organized documentation'], risks: ['Limited construction estimating experience'] },
];

function readCandidates() {
  if (typeof window === 'undefined') return seedCandidates;
  try {
    const stored = JSON.parse(window.localStorage.getItem('trailblaze-demo-candidates'));
    return stored && stored.length ? stored : seedCandidates;
  } catch {
    return seedCandidates;
  }
}

function saveCandidate(candidate) {
  const next = [candidate, ...readCandidates().filter((item) => item.id !== candidate.id)];
  window.localStorage.setItem('trailblaze-demo-candidates', JSON.stringify(next));
  window.dispatchEvent(new Event('trailblaze-candidates'));
}

function scoreInterview(form, answers) {
  const text = `${form.experience} ${form.why} ${answers.join(' ')}`.toLowerCase();
  const hits = ['safety','communication','clean','schedule','quality','customer','detail','team','tools','finish','reliable','honest','photo','update'].filter((word) => text.includes(word)).length;
  const base = 62 + Math.min(hits * 3, 27);
  const experienceBoost = Number.parseInt(form.years || '0', 10) >= 3 ? 6 : 0;
  const score = Math.min(98, base + experienceBoost);
  return {
    score,
    verdict: score >= 88 ? 'Strong fit' : score >= 76 ? 'Good fit' : score >= 65 ? 'Maybe' : 'Not ready',
    strengths: [
      text.includes('safety') ? 'Safety awareness came through clearly' : 'Understands jobsite expectations',
      text.includes('communication') || text.includes('update') ? 'Strong communication habits' : 'Can follow structured field processes',
      text.includes('quality') || text.includes('detail') ? 'Quality and detail focused' : 'Willing to learn Trailblaze standards',
    ],
    risks: score >= 80 ? ['Owner should verify references and availability'] : ['Needs deeper owner interview before moving forward'],
    summary: score >= 88 ? 'Candidate looks like a strong Trailblaze fit based on experience, communication, and field judgment.' : score >= 76 ? 'Candidate looks promising and should move to an owner review call.' : 'Candidate may fit later, but the owner should clarify experience, reliability, and jobsite standards first.',
  };
}

function readSession() {
  if (typeof window === 'undefined') return null;
  try { return JSON.parse(window.localStorage.getItem('trailblaze-demo-session')); } catch { return null; }
}

function writeSession(user) {
  window.localStorage.setItem('trailblaze-demo-session', JSON.stringify(user));
  window.dispatchEvent(new Event('trailblaze-session'));
}

function clearSession() {
  window.localStorage.removeItem('trailblaze-demo-session');
  window.dispatchEvent(new Event('trailblaze-session'));
}

function SiteHeader({ active = '/', overlay = false }) {
  return <header className={`site-header ${overlay ? 'site-header-overlay' : ''}`}>
    <Brand inverse={overlay} />
    <nav>{nav.map(([label, href]) => <a key={href} className={active === href ? 'active' : ''} href={href} onClick={(e) => { e.preventDefault(); go(href); }}>{label}</a>)}</nav>
    <div className="header-actions"><a className="demo-link" href="/login" onClick={(e) => { e.preventDefault(); go('/login'); }}>Client demo</a><a className="phone-link" href="tel:8649828394"><Icon name="phone" size={17} /> 864-982-8394</a></div>
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

function Hero({ active, kicker, title, copy, children }) {
  return <section className="public-hero"><div className="hero-image"><SiteHeader active={active} overlay /><div className="wrap hero-copy"><span className="eyebrow">{kicker}</span><h1>{title}</h1>{copy && <p>{copy}</p>}{children}</div></div></section>;
}

function ServiceCard({ icon, title, copy }) { return <article className="service-card"><div className="icon-disc"><Icon name={icon} size={32} /></div><h3>{title}</h3><p>{copy}</p><button className="text-link" onClick={() => go('/services')}>LEARN MORE <Icon name="arrow" size={16} /></button></article>; }
function ProjectCard({ image, title, type, copy }) { return <article className="project-card"><img src={`${A}${image}`} alt="" /><div className="project-card-copy"><h3>{title}</h3><span className="project-type"><Icon name={type === 'RENOVATION' ? 'hammer' : type === 'TURNKEY SOLUTION' ? 'key' : 'home'} size={14} /> {type}</span><p>{copy}</p><button className="text-link" onClick={() => go('/work')}>VIEW PROJECT <Icon name="arrow" size={16} /></button></div></article>; }

function Home() {
  return <><Hero active="/" kicker="" title={<>BUILT ON<br />EXPERIENCE.<br /><em>DRIVEN BY INTEGRITY.</em></>} copy="Trailblaze Construction is your trusted partner for new builds, renovations, and due diligence repairs across Upstate South Carolina."><div className="hero-actions"><button className="btn btn-brown" onClick={() => go('/contact')}>GET A FREE QUOTE <Icon name="arrow" size={17} /></button><button className="btn btn-outline-light" onClick={() => go('/work')}>VIEW OUR WORK</button><button className="btn btn-outline-light" onClick={() => go('/login')}>OPEN CLIENT DEMO</button></div><div className="hero-proof"><span>Licensed & insured</span><span>Owner portal demo</span><span>Field crew workflow</span></div></Hero><section className="services-section wrap"><div className="section-heading"><span>—　OUR SERVICES　—</span><h2>COMPLETE SOLUTIONS. QUALITY RESULTS.</h2><p>From concept to completion, we handle every detail so you can enjoy a seamless building experience.</p></div><div className="service-grid"><ServiceCard icon="home" title="NEW BUILDS" copy="Custom homes built with precision, quality materials, and attention to detail." /><ServiceCard icon="hammer" title="RENOVATIONS" copy="Transform your space with expert craftsmanship and modern solutions." /><ServiceCard icon="clipboard" title="DUE DILIGENCE REPAIRS" copy="Detailed inspections and repairs to protect your investment." /><ServiceCard icon="key" title="TURNKEY SOLUTIONS" copy="End-to-end project management for a stress-free building experience." /></div><button className="btn btn-dark centered" onClick={() => go('/services')}>VIEW ALL SERVICES</button></section><DemoStrip /><AboutSplit /><ProjectsPreview /><TrustBand /><Footer /></>;
}

function DemoStrip() { return <section className="demo-strip wrap"><div><span>CLIENT REVIEW DEMO</span><h2>Website plus operating portal in one walkthrough.</h2><p>Use the demo login to review the owner dashboard, employee field view, jobs, payouts, team, notifications, and settings.</p></div><button className="btn btn-dark" onClick={() => go('/login')}>OPEN DEMO LOGIN <Icon name="arrow" size={16} /></button></section>; }

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

function Contact() { const [sent,setSent] = useState(false); return <><InteriorHero active="/contact" kicker="" title="CONTACT US." copy="Have a project in mind? We'd love to hear about it. Reach out today for a free quote or consultation." /><section className="contact-grid"><div className="contact-form"><span className="eyebrow dark">SEND US A MESSAGE　—</span><h2>SEND US A MESSAGE</h2><p>Fill out the form below and we'll get back to you as soon as possible.</p>{sent ? <div className="success"><Icon name="check" size={35} /><h3>Thanks for reaching out.</h3><p>We'll be in touch soon.</p></div> : <form onSubmit={(e) => {e.preventDefault(); setSent(true);}}><div className="form-row"><input placeholder="Full Name *" required /><input placeholder="Phone Number *" required /></div><input placeholder="Email Address *" type="email" required /><select defaultValue=""><option value="" disabled>Project Type</option><option>New Build</option><option>Renovation</option><option>Due Diligence Repair</option></select><textarea placeholder="Tell us about your project *" required /><button className="btn btn-dark">SEND MESSAGE <Icon name="arrow" size={16} /></button></form>}</div><div className="contact-info"><span className="eyebrow dark">CONTACT INFORMATION　—</span><h2>CONTACT INFORMATION</h2><p>We're here to answer your questions and help bring your vision to life.</p><div className="info-list"><div><Icon name="phone" size={23} /><p><strong>864-982-8394</strong><small>Give us a call</small></p></div><div><Icon name="mail" size={23} /><p><strong>hkirk@trailblazeconstruction.com</strong><small>Send us an email</small></p></div><div><Icon name="map" size={23} /><p><strong>Downtown Greenville, SC<br />Simpsonville, SC</strong><small>Serving Upstate South Carolina</small></p></div><div><Icon name="clock" size={23} /><p><strong>MONDAY - FRIDAY</strong><small>8:00 AM - 5:00 PM</small></p></div></div><div className="consult-card"><Icon name="calendar" size={30} /><div><strong>SCHEDULE A CONSULTATION</strong><p>Let's discuss your project in detail.</p><button className="btn btn-dark">BOOK A TIME <Icon name="arrow" size={15} /></button></div></div></div></section><section className="map-section"><div className="map-card"><Icon name="tree" size={31} /><h3>PROUDLY SERVING<br />UPSTATE SOUTH CAROLINA</h3><p>From Greenville to the surrounding communities, we're ready to bring your project to life.</p><p>✓ Greenville, SC<br />✓ Simpsonville, SC<br />✓ Taylors, SC<br />✓ Mauldin, SC<br />✓ Travelers Rest, SC</p></div><Icon name="map" size={80} /></section><TrustBand title="READY TO BUILD SOMETHING GREAT?" sub="Let's work together to create something you'll be proud of for years to come." /><Footer /></>; }

function Careers() {
  const questions = [
    'Tell us about the kind of construction work you are strongest at.',
    'A homeowner is frustrated about a delay. How would you handle the conversation?',
    'What does a clean, safe jobsite look like at the end of your day?',
  ];
  const [step, setStep] = useState('apply');
  const [form, setForm] = useState({ name:'', email:'', phone:'', role:'Field Carpenter', years:'3', availability:'Immediate', experience:'', why:'' });
  const [answers, setAnswers] = useState(['','','']);
  const [result, setResult] = useState(null);
  function update(key, value) { setForm({ ...form, [key]: value }); }
  function submitApplication(e) { e.preventDefault(); setStep('interview'); }
  function finishInterview(e) {
    e.preventDefault();
    const ai = scoreInterview(form, answers);
    const candidate = { id:`CAN-${Math.floor(300 + Math.random() * 600)}`, ...form, experience:`${form.years} years · ${form.experience}`, score:ai.score, verdict:ai.verdict, status:'AI screened', summary:ai.summary, strengths:ai.strengths, risks:ai.risks };
    saveCandidate(candidate);
    setResult(candidate);
    setStep('result');
  }
  return <><InteriorHero active="/careers" kicker="CAREERS" title={<>JOIN THE CREW.<br />SHOW US HOW YOU WORK.</>} copy="Apply for a Trailblaze role, complete a short AI interview, and give the owner a clear hiring score and summary." /><section className="careers-layout wrap"><div className="career-card"><span className="eyebrow dark">OPEN ROLES</span><h2>Hiring for field and operations roles.</h2><div className="role-list">{['Field Carpenter','Project Manager','Field Assistant','Office Coordinator'].map((role) => <button key={role} className={form.role === role ? 'selected' : ''} onClick={() => update('role', role)}><Icon name={role.includes('Office') ? 'briefcase' : role.includes('Manager') ? 'clipboard' : 'hammer'} size={24} /><span><strong>{role}</strong><small>{role === 'Office Coordinator' ? 'Scheduling, client updates, documentation' : 'Jobsites, updates, quality, communication'}</small></span></button>)}</div><div className="ai-process"><div><Icon name="clipboard" size={24} /><span>Apply</span></div><div><Icon name="bubble" size={24} /><span>AI interview</span></div><div><Icon name="chart" size={24} /><span>Owner scorecard</span></div></div></div><div className="career-panel">{step === 'apply' && <form onSubmit={submitApplication} className="career-form"><span className="eyebrow dark">STEP 1</span><h2>Apply for {form.role}</h2><div className="form-row"><input value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Full name *" required /><input value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="Phone number *" required /></div><input value={form.email} onChange={(e) => update('email', e.target.value)} type="email" placeholder="Email address *" required /><div className="form-row"><select value={form.years} onChange={(e) => update('years', e.target.value)}><option value="0">Under 1 year</option><option value="1">1-2 years</option><option value="3">3-5 years</option><option value="6">6+ years</option></select><input value={form.availability} onChange={(e) => update('availability', e.target.value)} placeholder="Availability" /></div><textarea value={form.experience} onChange={(e) => update('experience', e.target.value)} placeholder="Relevant experience *" required /><textarea value={form.why} onChange={(e) => update('why', e.target.value)} placeholder="Why do you want to work with Trailblaze? *" required /><button className="btn btn-dark full">START AI INTERVIEW <Icon name="arrow" size={16} /></button></form>}{step === 'interview' && <form onSubmit={finishInterview} className="career-form ai-interview"><span className="eyebrow dark">STEP 2</span><h2>AI interview</h2><p>The demo interviewer asks three practical questions and turns the answers into an owner scorecard.</p>{questions.map((question, index) => <label key={question}>{question}<textarea value={answers[index]} onChange={(e) => { const next = [...answers]; next[index] = e.target.value; setAnswers(next); }} placeholder="Type the candidate's answer..." required /></label>)}<button className="btn btn-dark full">GENERATE OWNER FEEDBACK <Icon name="chart" size={16} /></button></form>}{step === 'result' && result && <div className="interview-result"><span className="eyebrow dark">AI SCORECARD SENT</span><div className="score-circle">{result.score}</div><h2>{result.verdict}</h2><p>{result.summary}</p><div className="score-lists"><div><strong>Strengths</strong>{result.strengths.map((item) => <span key={item}><Icon name="check" size={15} /> {item}</span>)}</div><div><strong>Owner follow-up</strong>{result.risks.map((item) => <span key={item}><Icon name="info" size={15} /> {item}</span>)}</div></div><button className="btn btn-dark full" onClick={() => { writeSession(demoUsers.owner); go('/app/hiring'); }}>VIEW IN OWNER DASHBOARD</button></div>}</div></section><TrustBand title="BUILD A STRONGER CREW." sub="Applicants can move from apply to AI interview to owner review in one clean flow." /><Footer /></>;
}

function Login() {
  const [role, setRole] = useState('owner');
  const [email, setEmail] = useState(demoUsers.owner.email);
  const [password, setPassword] = useState(demoUsers.owner.password);
  const [error, setError] = useState('');
  const selected = demoUsers[role];

  function selectRole(nextRole) {
    const next = demoUsers[nextRole];
    setRole(nextRole);
    setEmail(next.email);
    setPassword(next.password);
    setError('');
  }

  function submit(e) {
    e.preventDefault();
    const match = Object.values(demoUsers).find((user) => user.email.toLowerCase() === email.toLowerCase() && user.password === password);
    if (!match) {
      setError('Use one of the demo accounts shown below.');
      return;
    }
    writeSession(match);
    go(match.role === 'owner' ? '/app/overview' : '/app/employee');
  }

  return <div className="login-page"><div className="login-trees"></div><div className="login-inner"><Brand /><h1>Welcome back</h1><p>Sign in to access your Trailblaze OS demo.</p><div className="demo-login-panel"><span>Demo access</span><div><button className={role === 'owner' ? 'selected' : ''} onClick={() => selectRole('owner')}>Owner dashboard</button><button className={role === 'employee' ? 'selected' : ''} onClick={() => selectRole('employee')}>Employee dashboard</button></div><small>{selected.email} / {selected.password}</small></div><form onSubmit={submit}><label>Email address<div className="input-wrap"><Icon name="mail" size={22} /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" required /></div></label><label>Password<div className="input-wrap"><Icon name="lock" size={22} /><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required /><Icon name="eye" size={22} /></div></label>{error && <p className="form-error">{error}</p>}<div className="remember"><span><input type="checkbox" defaultChecked /> Remember me</span><button type="button" className="link-button">Forgot password?</button></div><button className="btn btn-dark full">Sign in as {selected.label}</button><div className="or"><span></span>client demo<span></span></div><button type="button" className="social-button" onClick={() => selectRole('owner')}><Icon name="shield" size={22} /> Fill owner login</button><button type="button" className="social-button" onClick={() => selectRole('employee')}><Icon name="briefcase" size={22} /> Fill employee login</button></form><p className="signup">Need client access? <button className="link-button" onClick={() => selectRole('owner')}>Use demo account</button></p></div></div>;
}

const ownerNav = [['overview','Business','chart'],['jobs','All jobs','clipboard'],['hiring','Hiring','briefcase'],['payouts','Payouts','wallet'],['team','Team','users'],['notifications','Alerts','bell']];
const employeeNav = [['employee','Today','briefcase'],['tasks','Tasks','clipboard'],['schedule','Schedule','calendar'],['time','Time','clock'],['notifications','Alerts','bell']];
function AppShell({ active, children, session }) {
  const current = session || demoUsers.owner;
  const links = current.role === 'employee' ? employeeNav : ownerNav;
  return <div className="app-shell"><header className="app-header"><Brand /><span className="role-pill">{current.label}</span><button className="switch-demo" onClick={() => { const next = current.role === 'owner' ? demoUsers.employee : demoUsers.owner; writeSession(next); go(next.role === 'owner' ? '/app/overview' : '/app/employee'); }}>{current.role === 'owner' ? 'View employee' : 'View owner'}</button><button className="logout" onClick={() => { clearSession(); go('/login'); }} aria-label="Sign out"><Icon name="arrow" size={22} /></button></header><main className="app-main"><div className="review-banner"><div><Icon name="shield" size={22} /><span><strong>Client review mode</strong><small>Demo data only. Login, role switching, filters, checklists, and time-card actions are active for walkthrough.</small></span></div><button onClick={() => { const next = current.role === 'owner' ? demoUsers.employee : demoUsers.owner; writeSession(next); go(next.role === 'owner' ? '/app/overview' : '/app/employee'); }}>{current.role === 'owner' ? 'Try employee view' : 'Try owner view'}</button></div>{children}</main><nav className="app-nav">{links.map(([id,label,icon]) => <button key={id} className={active === id ? 'active' : ''} onClick={() => go(`/app/${id}`)}><Icon name={icon} size={27} /><span>{label}</span></button>)}<button className={active === 'settings' ? 'active' : ''} onClick={() => go('/app/settings')}><Icon name="menu" size={27} /><span>Settings</span></button></nav></div>;
}
function AppIntro({ title, copy, action, onAction }) { return <div className="app-intro"><div><h1>{title}</h1><p>{copy}</p></div>{action && <button className="btn btn-dark" onClick={onAction}><Icon name="plus" size={17} /> {action}</button>}</div>; }
function AppOverview({ session }) { return <AppShell active="overview" session={session}><div className="app-cover"><div className="app-cover-top"><Brand inverse /><span className="role-pill">{session.label}</span></div><div className="app-profile"><div className="avatar-mark"><Mark /></div><div><strong>{session.name}</strong><span>{session.email}</span></div></div></div><section className="app-content"><span className="eyebrow dark">OVERVIEW</span><h1>Welcome back, {session.name.split(' ')[0]}.</h1><p className="app-lede">Here's what's happening with Trailblaze Construction.</p><div className="overview-cards"><MetricCard icon="clipboard" label="JOBS ON THE BOARD" value="4" sub="3 still open" /><MetricCard icon="briefcase" label="AI APPLICANTS" value={String(readCandidates().length)} sub="Screened for owner review" accent /><MetricCard icon="wallet" label="PAYOUTS HELD" value="$110.00" sub="$2,125.00 paid to date" assistant /></div><CandidateInbox compact /><div className="integrity-card"><Icon name="shield" size={38} /><div><strong>BUILT ON INTEGRITY</strong><p>Quality work, clear communication, and honest building — every time.</p></div><button className="btn btn-outline-light" onClick={() => go('/app/jobs')}>VIEW MY JOBS <Icon name="arrow" size={16} /></button></div></section></AppShell>; }
function MetricCard({ icon, label, value, sub, accent, assistant }) { return <div className={`metric-card ${accent ? 'accent' : ''}`}><div className="icon-box"><Icon name={icon} size={31} /></div><div><span>{label}</span><strong>{value}</strong><small>{sub}</small></div>{assistant && <button className="assistant"><Icon name="info" size={18} /> Ask the company<br />assistant</button>}{!assistant && <Icon name="chevron" size={25} />}</div>; }
function CandidateInbox({ compact = false }) {
  const [candidates, setCandidates] = useState(readCandidates);
  const [selected, setSelected] = useState(0);
  useEffect(() => {
    const sync = () => setCandidates(readCandidates());
    window.addEventListener('trailblaze-candidates', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('trailblaze-candidates', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);
  const list = compact ? candidates.slice(0, 2) : candidates;
  const current = candidates[selected] || candidates[0];
  return <section className={`candidate-inbox ${compact ? 'compact' : ''}`}><div className="candidate-head"><div><span className="eyebrow dark">AI HIRING</span><h2>{compact ? 'Latest AI-screened applicants' : 'Applicant scorecards'}</h2><p>Applications and AI interview summaries land here for owner review.</p></div><button className="btn btn-dark" onClick={() => go('/careers')}>OPEN CAREERS PAGE</button></div><div className="candidate-grid"><div className="candidate-list">{list.map((candidate, index) => <button key={candidate.id} className={candidate.id === current?.id ? 'selected' : ''} onClick={() => setSelected(index)}><span className="score-badge">{candidate.score}</span><span><strong>{candidate.name}</strong><small>{candidate.role} · {candidate.status}</small></span><b>{candidate.verdict}</b></button>)}</div>{current && <div className="candidate-detail"><div className="score-circle small">{current.score}</div><h3>{current.name}</h3><span>{current.role} · {current.availability}</span><p>{current.summary}</p><div className="score-lists"><div><strong>Strengths</strong>{current.strengths.map((item) => <span key={item}><Icon name="check" size={15} /> {item}</span>)}</div><div><strong>Owner follow-up</strong>{current.risks.map((item) => <span key={item}><Icon name="info" size={15} /> {item}</span>)}</div></div><div className="candidate-actions"><button>Schedule call</button><button>Send offer</button><button>Start onboarding</button></div></div>}</div></section>;
}
function AppHiring({ session }) { return <AppShell active="hiring" session={session}><section className="app-content hiring-page"><AppIntro title="Hiring" copy={<>AI-screened applicants, owner feedback,<br />and onboarding decisions in one place.</>} action="View careers page" onAction={() => go('/careers')} /><CandidateInbox /><div className="onboarding-flow"><span className="eyebrow dark">ONBOARDING</span><h2>Hiring pipeline</h2><div><span><Icon name="clipboard" size={22} /> Application</span><span><Icon name="bubble" size={22} /> AI interview</span><span><Icon name="chart" size={22} /> Owner scorecard</span><span><Icon name="shield" size={22} /> Hire & onboard</span></div></div></section></AppShell>; }
function AppJobs({ session }) {
  const [filter, setFilter] = useState('All');
  const [message, setMessage] = useState('');
  const shown = filter === 'All' ? demoJobs : demoJobs.filter((job) => job.status === filter);
  return <AppShell active="jobs" session={session}><section className="app-content jobs-page"><AppIntro title="All jobs" copy={<>Every job record in the company,<br />newest schedule first.</>} action="Post a job" onAction={() => setMessage('Demo job created and routed to the owner approval queue.')} />{message && <div className="toast-note"><Icon name="check" size={19} /> {message}</div>}<div className="app-tabs">{['All','Awaiting verify','In progress','Scheduled','Completed'].map((tab) => <button key={tab} className={filter === tab ? 'selected' : ''} onClick={() => setFilter(tab)}>{tab}</button>)}</div><div className="list-heading"><h2>{filter === 'All' ? 'Company job board' : filter}</h2><span>{shown.length}</span></div>{shown.map((job) => <JobCard key={job.id} job={job} />)}</section></AppShell>;
}
function JobCard({ job, compact = false }) { return <article className={`job-card ${compact ? 'compact' : ''}`}><div className="job-top"><div className="icon-box"><Icon name={job.status === 'Completed' ? 'check' : job.status === 'Scheduled' ? 'calendar' : 'clipboard'} size={30} /></div><div><span className="job-meta">{job.id} · {job.due}</span><h3>{job.title}</h3><p><Icon name="map" size={18} /> {job.address}</p><p><Icon name="user" size={18} /> {job.owner} · {job.assignee}</p>{!compact && <p><Icon name="info" size={18} /> {job.notes}</p>}</div><span className={`status ${job.status === 'Awaiting verify' || job.status === 'Scheduled' ? 'pending' : ''}`}>{job.status}</span></div><div className="job-bottom"><strong>{job.payout}</strong><button>Open <Icon name="arrow" size={17} /></button></div></article>; }
function AppPayouts({ session }) { const [exported, setExported] = useState(false); return <AppShell active="payouts" session={session}><section className="app-content payouts-page"><AppIntro title="Payouts" copy={<>Every payout is created and held.<br />Verification is the only thing that clears one.</>} action="Export" onAction={() => setExported(true)} />{exported && <div className="toast-note"><Icon name="download" size={19} /> Demo payout report prepared.</div>}<div className="payout-metrics"><MetricCard icon="lock" label="HELD" value="$110.00" sub="Job not verified yet" /><MetricCard icon="shield" label="ELIGIBLE" value="$0.00" sub="Verified, cleared to send" /><MetricCard icon="wallet" label="PAID" value="$2,125.00" sub="Sent" /></div><div className="notice"><Icon name="info" size={23} /><p><strong>Demo mode</strong><span>Transfers are simulated for client review. No money moves until Stripe or bank payouts are connected.</span></p></div><h2 className="app-section-title">Payout history</h2><div className="app-tabs payout-tabs"><button className="selected">All</button><button>Held</button><button>Eligible</button><button>Paid</button></div><div className="payout-list">{payouts.map((item) => <div className="payout-row" key={item.job}><div className="icon-box"><Icon name="wallet" size={27} /></div><div><strong>{item.title}</strong><span>{item.job} · {item.note}</span></div><div><span className={`status ${item.status === 'Held' ? 'pending' : ''}`}>{item.status}</span><b>{item.amount}</b></div><Icon name="chevron" size={21} /></div>)}</div><div className="assistant-card"><Icon name="info" size={31} /><div><strong>Have a question about payouts?</strong><span>The assistant can answer demo questions about holds, verification, and payout status.</span></div><button className="btn btn-dark" onClick={() => setExported(true)}>Ask assistant</button></div></section></AppShell>; }
function AppTeam({ session }) { const [invited, setInvited] = useState(false); const members = [['Heather B. Kirk','hkirk@trailblazeconstruction.com','(864) 982-8394  ·  Joined Aug 2, 2024','Owner','Active'],['Dale Whitmire','pm@trailblazeconstruction.com','(864) 555-0142  ·  Joined Aug 2, 2024','Project Manager','Active'],['Marcus Ellery','runner@trailblazeconstruction.com','(864) 420-7788  ·  Joined Aug 5, 2024','Field Assistant','Active'],['Petra Lang','buyer@trailblazeconstruction.com','(864) 901-3321  ·  Invited Aug 30, 2024',"Buyer's Agent",'Pending']]; return <AppShell active="team" session={session}><section className="app-content team-page"><AppIntro title="Team" copy={<>Manage your crew, project managers,<br />and field team access.</>} action="Onboard someone" onAction={() => setInvited(true)} />{invited && <div className="toast-note"><Icon name="send" size={19} /> Demo invite queued for the next team member.</div>}<div className="team-stats"><Stat icon="users" n="4" label="Team members" sub="Total on roster" /><Stat icon="check" n="3" label="Active" sub="Currently active" /><Stat icon="clock" n="1" label="Pending" sub="Awaiting invite" /><Stat icon="users" n="0" label="Inactive" sub="Not active" /></div><div className="search-row"><div className="search-input"><Icon name="search" size={22} /><input placeholder="Search team members..." /></div><button className="role-filter"><Icon name="filter" size={18} /> All roles <Icon name="chevron" size={17} /></button></div><div className="member-list">{members.map(([name,email,meta,role,status]) => <div className="member-row" key={name}><div className="person-avatar">{name === 'Petra Lang' ? 'PL' : name.split(' ').map(x => x[0]).join('')}</div><div><strong>{name}</strong><span>{email}</span><small>{meta}</small></div><div><span className="role-badge">{role}</span><small className={status === 'Pending' ? 'pending-text' : 'active-text'}>●　{status}</small></div><b>⋮</b></div>)}</div><div className="secure-card"><Icon name="shield" size={32} /><div><strong>Secure access. Right people only.</strong><p>Team members can only access what they need to do their job. You're in control.</p></div><button className="btn btn-outline-dark">Learn more</button></div></section></AppShell>; }
function Stat({ icon, n, label, sub }) { return <div><Icon name={icon} size={27} /><strong>{n}</strong><span>{label}</span><small>{sub}</small></div>; }
function AppNotifications({ session }) { const items = [['clipboard','New job submitted','Trim package to Augusta Rd remodel has been submitted and is awaiting admin verification.','6:08 AM','green'],['wallet','Payout sent','Payment of $275.00 for Due diligence repair punch — 108 Rosewood has been sent.','9:10 AM','green'],['users','Team member invited','Petra Lang has been invited to join as Buyer’s Agent.','9:42 AM','orange'],['home','Job status updated','New build — The Ridge Lot 27 status changed to In progress.','3:24 PM','green'],['hammer','Job completed','Kitchen renovation — Parker residence has been marked as Completed.','11:15 AM','green'],['shield','System update','Your account permissions were updated.','8:30 AM','blue']]; return <AppShell active="notifications" session={session}><section className="app-content notifications-page"><AppIntro title="Notifications" copy={<>Delivered in-app. Device push turns on once an<br />Expo access token is configured.</>} action="Settings" onAction={() => go('/app/settings')} /><div className="app-tabs notification-tabs"><button className="selected">All</button><button>Jobs</button><button>Payouts</button><button>Team</button><button>System</button></div><h2 className="app-section-title">Today</h2><div className="notification-list">{items.slice(0,3).map((item) => <NotificationRow key={item[1]} item={item} />)}</div><h2 className="app-section-title">Yesterday</h2><div className="notification-list">{items.slice(3).map((item) => <NotificationRow key={item[1]} item={item} />)}</div><div className="loop-card"><div className="icon-box"><Icon name="shield" size={29} /></div><div><strong>Stay in the loop</strong><p>Important updates about your jobs, payouts, team, and system — all in one place.</p></div><button className="btn btn-outline-dark">Learn more</button></div></section></AppShell>; }
function NotificationRow({ item }) { return <div className="notification-row"><div className="icon-box"><Icon name={item[0]} size={29} /></div><i className={`dot ${item[4]}`}></i><div><strong>{item[1]}</strong><p>{item[2]}</p></div><span>{item[3]}</span><Icon name="chevron" size={19} /></div>; }
function AppSettings({ session }) { const groups = [['ACCOUNT',[['user','Profile & personal info','Update your name, email, phone, and avatar.'],['lock','Login & security','Change password and manage security.'],['bell','Notifications','Manage in-app and email notifications.'],['phone','Mobile app access','Manage your mobile devices and sessions.']]],['PAYOUTS & FINANCE',[['home','Banking & payout info','Set up or update your bank account for payouts.','Verified'],['clipboard','Payout preferences','Choose payout method and schedule.'],['clock','Payout history','View all transactions and payout status.'],['chart','Earnings summary','See earnings, fees, and tax summary.']]],['LEGAL & TAX',[['shield','Legal documents','View and manage contracts and legal files.'],['clipboard','Tax documents','Upload and manage your tax documents.'],['briefcase','1099 tax forms','Access and download your 1099 forms.','Available']]]]; return <AppShell active="settings" session={session}><section className="app-content settings-page"><AppIntro title="Settings" copy={`Manage ${session.name}'s account, company, and preferences.`} />{groups.map(([heading,items]) => <div className="settings-group" key={heading}><h2>{heading}</h2><div>{items.map(([icon,title,copy,badge]) => <button className="setting-row" key={title}><div className="icon-box"><Icon name={icon} size={27} /></div><span><strong>{title}</strong>{badge && <em>{badge}</em>}<small>{copy}</small></span>{badge === 'Available' && <b className="available">Available</b>}<Icon name="chevron" size={19} /></button>)}</div></div>)}</section></AppShell>; }

function EmployeeDashboard({ session }) {
  const [checkedIn, setCheckedIn] = useState(false);
  const today = demoJobs.filter((job) => job.assignee === 'Dale Whitmire' && job.status !== 'Completed');
  return <AppShell active="employee" session={session}><section className="app-content employee-page"><div className="employee-hero"><div><span className="eyebrow">FIELD DASHBOARD</span><h1>Good morning, {session.name.split(' ')[0]}.</h1><p>You have {today.length} active jobs and one verification due today.</p></div><button className={`btn ${checkedIn ? 'btn-outline-light' : 'btn-light'}`} onClick={() => setCheckedIn(!checkedIn)}>{checkedIn ? 'Clocked in · 8:02 AM' : 'Clock in'}</button></div><div className="overview-cards employee-metrics"><MetricCard icon="clipboard" label="TODAY'S JOBS" value={String(today.length)} sub="Assigned to you" /><MetricCard icon="clock" label="HOURS" value={checkedIn ? '3.4' : '0.0'} sub={checkedIn ? 'Running time card' : 'Not clocked in'} /><MetricCard icon="shield" label="VERIFY DUE" value="1" sub="Needs photos" /></div><h2 className="app-section-title">Next up</h2>{today.map((job) => <EmployeeJob key={job.id} job={job} />)}<div className="secure-card"><Icon name="send" size={32} /><div><strong>Send field update</strong><p>Use this demo action to show how employees would submit notes, photos, and completion status.</p></div><button className="btn btn-dark" onClick={() => go('/app/tasks')}>Open tasks</button></div></section></AppShell>;
}

function EmployeeJob({ job }) {
  const [state, setState] = useState(job.status);
  return <article className="employee-job"><div className="employee-job-head"><div className="icon-box"><Icon name="briefcase" size={28} /></div><div><span>{job.id} · {job.due}</span><h3>{job.title}</h3><p>{job.address}</p></div><b className={`status ${state === 'Submitted' || state === 'Scheduled' ? 'pending' : ''}`}>{state}</b></div><p>{job.notes}</p><div className="employee-actions"><button onClick={() => setState('In progress')}>Start</button><button onClick={() => setState('Submitted')}>Submit update</button><button onClick={() => setState('Completed')}>Mark complete</button></div></article>;
}

function EmployeeTasks({ session }) {
  const [done, setDone] = useState(['Final trim photos']);
  const tasks = ['Final trim photos', 'Upload receipt', 'Client sign-off', 'Verify punch list'];
  return <AppShell active="tasks" session={session}><section className="app-content"><AppIntro title="Tasks" copy="A field-ready checklist for the jobs assigned to you." action="Add note" onAction={() => setDone([...new Set([...done, 'Crew note added'])])} /><div className="task-list">{tasks.map((task) => <button key={task} className={done.includes(task) ? 'done' : ''} onClick={() => setDone(done.includes(task) ? done.filter((item) => item !== task) : [...done, task])}><Icon name={done.includes(task) ? 'check' : 'clipboard'} size={22} /><span><strong>{task}</strong><small>TB-1044 · Augusta Rd remodel</small></span></button>)}{done.includes('Crew note added') && <button className="done"><Icon name="check" size={22} /><span><strong>Crew note added</strong><small>Saved in demo activity feed</small></span></button>}</div></section></AppShell>;
}

function EmployeeSchedule({ session }) {
  return <AppShell active="schedule" session={session}><section className="app-content"><AppIntro title="Schedule" copy="Daily field schedule with route-ready job details." /><div className="schedule-list">{demoJobs.slice(0,3).map((job, index) => <div key={job.id} className="schedule-row"><strong>{index === 0 ? '8:00 AM' : index === 1 ? '10:30 AM' : '2:30 PM'}</strong><div><h3>{job.title}</h3><p>{job.address}</p></div><span className="status">{job.priority}</span></div>)}</div></section></AppShell>;
}

function EmployeeTime({ session }) {
  const [clocked, setClocked] = useState(false);
  return <AppShell active="time" session={session}><section className="app-content"><AppIntro title="Time card" copy="Demo time tracking for employee hours and job costing." /><div className="time-card"><Icon name="clock" size={44} /><span>{clocked ? 'Clocked in' : 'Ready to clock in'}</span><strong>{clocked ? '03:24:18' : '00:00:00'}</strong><button className="btn btn-dark" onClick={() => setClocked(!clocked)}>{clocked ? 'Clock out' : 'Clock in'}</button></div><div className="payout-list"><div className="payout-row"><div className="icon-box"><Icon name="calendar" size={25} /></div><div><strong>Today</strong><span>Augusta Rd remodel · Field work</span></div><div><b>{clocked ? '3.4 hrs' : '0 hrs'}</b></div></div><div className="payout-row"><div className="icon-box"><Icon name="calendar" size={25} /></div><div><strong>Yesterday</strong><span>Rosewood repair punch · Completed</span></div><div><b>7.5 hrs</b></div></div></div></section></AppShell>;
}

function AppRouter({ path, session }) { const page = path.split('/')[2] || (session.role === 'employee' ? 'employee' : 'overview'); if (page === 'jobs') return <AppJobs session={session} />; if (page === 'hiring') return <AppHiring session={session} />; if (page === 'payouts') return <AppPayouts session={session} />; if (page === 'team') return <AppTeam session={session} />; if (page === 'notifications') return <AppNotifications session={session} />; if (page === 'settings') return <AppSettings session={session} />; if (page === 'employee') return <EmployeeDashboard session={session} />; if (page === 'tasks') return <EmployeeTasks session={session} />; if (page === 'schedule') return <EmployeeSchedule session={session} />; if (page === 'time') return <EmployeeTime session={session} />; return <AppOverview session={session} />; }
function PublicRouter({ path }) { if (path === '/about') return <About />; if (path === '/services') return <Services />; if (path === '/work') return <Work />; if (path === '/reviews') return <Reviews />; if (path === '/careers') return <Careers />; if (path === '/contact') return <Contact />; return <Home />; }
function App() {
  const [path, setPath] = useState(typeof window === 'undefined' ? '/' : window.location.pathname);
  const [session, setSession] = useState(readSession);
  useEffect(() => {
    const handler = () => setPath(window.location.pathname);
    const syncSession = () => setSession(readSession());
    window.addEventListener('popstate', handler);
    window.addEventListener('trailblaze-session', syncSession);
    window.addEventListener('storage', syncSession);
    return () => {
      window.removeEventListener('popstate', handler);
      window.removeEventListener('trailblaze-session', syncSession);
      window.removeEventListener('storage', syncSession);
    };
  }, []);
  if (path === '/login') return <Login />;
  if (path.startsWith('/app')) {
    if (!session) return <Login />;
    return <AppRouter path={path} session={session} />;
  }
  return <PublicRouter path={path} />;
}

const rootElement = typeof document !== 'undefined' ? document.getElementById('root') : null;
if (rootElement) {
  createRoot(rootElement).render(<App />);
}

export default App;
