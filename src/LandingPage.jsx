import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Phone, Workflow, UserCheck, Clock, Check, ChevronDown, Mail,
  MapPin, ArrowRight, Sparkles, Shield, Zap, Building2, Menu, X
} from 'lucide-react'

// --- BRAND TOKENS ---------------------------------------------------------
const NAVY = '#0A1628'
const NAVY_SOFT = '#0F1F36'
const NAVY_CARD = '#132541'
const GOLD = '#C9A84C'
const GOLD_SOFT = '#E0C36A'
const WHITE = '#F5F7FA'
const MUTED = '#8FA3BF'
const BORDER = 'rgba(201, 168, 76, 0.18)'
const BORDER_SOFT = 'rgba(143, 163, 191, 0.15)'

// Placeholder — Renée swaps in her GHL webhook after deploy
const AGENCY_GHL_WEBHOOK = '{{AGENCY_GHL_WEBHOOK}}'
const BRAND = 'Xpert Web Solutions' // placeholder until rebrand finalized

// --- SHARED STYLES --------------------------------------------------------
const container = { width: '100%', maxWidth: 1180, margin: '0 auto', padding: '0 20px', boxSizing: 'border-box' }
const sectionPad = { padding: '72px 0' }
const h1 = { fontSize: 'clamp(32px, 6vw, 58px)', fontWeight: 800, color: WHITE, lineHeight: 1.08, letterSpacing: '-0.02em', margin: 0 }
const h2 = { fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 800, color: WHITE, lineHeight: 1.15, letterSpacing: '-0.015em', margin: 0 }
const sub = { fontSize: 'clamp(15px, 2vw, 18px)', color: MUTED, lineHeight: 1.6, margin: '16px 0 0' }
const eyebrow = { fontSize: 12, fontWeight: 700, color: GOLD, letterSpacing: '0.18em', textTransform: 'uppercase', margin: 0 }
const btnBase = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
  padding: '14px 22px', borderRadius: 12, fontSize: 15, fontWeight: 700,
  cursor: 'pointer', border: 'none', textDecoration: 'none',
  transition: 'transform .18s ease, box-shadow .18s ease, background .18s ease',
  fontFamily: 'inherit',
}
const btnPrimary = { ...btnBase, background: GOLD, color: NAVY, boxShadow: '0 8px 24px rgba(201,168,76,0.25)' }
const btnGhost = { ...btnBase, background: 'transparent', color: WHITE, border: `1px solid ${BORDER}` }

// --- DATA -----------------------------------------------------------------
const CAPABILITIES = [
  { icon: Phone, title: 'Voice AI Agents', body: 'Inbound and outbound voice agents that book appointments, qualify leads, and handle FAQs 24/7. ElevenLabs voices, human tone, real conversions.' },
  { icon: Workflow, title: 'Workflow Automation', body: 'The repetitive work behind your business — lead routing, follow-ups, reminders, reviews — running on autopilot across your CRM, email, and SMS.' },
  { icon: UserCheck, title: 'Lead Qualification', body: 'Every new lead gets triaged, scored, and routed to the right place automatically. You only talk to the ones ready to buy.' },
  { icon: Clock, title: 'Always-On Coverage', body: 'Answer every call, every form, every DM — even at 2am. No missed leads. No callback chaos. No revenue leaking out overnight.' },
]

const TIERS = [
  { name: 'Essentials', agents: '1–2 agents', minutes: '500 min', rate: '$0.14/min', setup: 2997, monthly: 297, highlight: false,
    features: ['1–2 voice or text agents', '500 voice minutes included', 'Basic workflow automation', 'CRM + calendar integration', '2 hours support / month'] },
  { name: 'Starter', agents: '2–3 agents', minutes: '1,000 min', rate: '$0.13/min', setup: 3997, monthly: 397, highlight: false,
    features: ['2–3 agents', '1,000 voice minutes included', 'Multi-channel automation', 'Lead scoring + routing', '2 hours support / month'] },
  { name: 'Growth', agents: '3–5 agents', minutes: '2,500 min', rate: '$0.11/min', setup: 4997, monthly: 597, highlight: true,
    features: ['3–5 agents', '2,500 voice minutes included', 'Advanced lead qualification', 'Review + reactivation flows', '2 hours support / month'] },
  { name: 'Professional', agents: '5–7 agents', minutes: '4,000 min', rate: '$0.10/min', setup: 6997, monthly: 797, highlight: false,
    features: ['5–7 agents', '4,000 voice minutes included', 'Cross-channel orchestration', 'Custom reporting', '2 hours support / month'] },
  { name: 'Scale', agents: '7–10 agents', minutes: '7,000 min', rate: '$0.09/min', setup: 8997, monthly: 997, highlight: false,
    features: ['7–10 agents', '7,000 voice minutes included', 'Priority build queue', 'Dedicated strategy check-ins', '2 hours support / month'] },
  { name: 'Custom', agents: '10+ agents', minutes: 'Custom', rate: 'Negotiated', setup: null, monthly: null, highlight: false,
    features: ['10+ agents across teams', 'Custom voice minute volume', 'Multi-location / enterprise', 'SLA + priority support', 'Negotiated hourly bank'] },
]

const FAQS = [
  { q: 'What industries do you work with?', a: 'We focus on service businesses where missed calls equal lost revenue — dental, real estate, mortgage, and trades. If you book appointments and rely on fast follow-up, we can help.' },
  { q: 'How long does setup take?', a: 'Most builds go live in 7–14 business days. The setup fee covers the full build: voice agents, workflows, CRM integration, testing, and go-live. We run a full lead-journey simulation before we switch anything on.' },
  { q: "What's included in the monthly fee?", a: 'Hosting, monitoring, AI usage up to your plan minutes, and 2 hours of support (script tweaks, small workflow changes, reporting questions). Anything beyond 2 hours is billed hourly at a pre-agreed rate.' },
  { q: 'When do things go from monthly to hourly?', a: 'Monthly covers maintenance and small adjustments. New agents, new workflows, new integrations, or big scope changes are separate projects billed at our hourly rate or as a scoped add-on.' },
  { q: 'Are you Canadian-compliance aware (CASL, PIPEDA, FSRA)?', a: 'Yes. We build every flow with Canadian consent rules in mind — CASL for email/SMS, PIPEDA for data handling, CRTC for voice, and FSRA for mortgage-specific advertising. Based in Toronto.' },
]

const INDUSTRIES = ['Dental', 'Real Estate', 'Mortgage', 'Trades', 'Other']

// --- COMPONENT ------------------------------------------------------------
export default function LandingPage () {
  const [open, setOpen] = useState(null)
  const [menu, setMenu] = useState(false)
  const [form, setForm] = useState({ name: '', business: '', email: '', phone: '', industry: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    document.body.style.fontFamily = "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    document.body.style.background = NAVY
    document.body.style.color = WHITE
    document.body.style.margin = '0'
    document.body.style.webkitFontSmoothing = 'antialiased'
  }, [])

  const update = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!form.name || !form.email || !form.phone) {
      setError('Please fill in name, email, and phone.')
      return
    }
    setSubmitting(true)
    try {
      const webhook = AGENCY_GHL_WEBHOOK
      // Only POST if the webhook placeholder has been swapped out
      if (webhook && !webhook.startsWith('{{')) {
        const res = await fetch(webhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, source: 'agency-site', submitted_at: new Date().toISOString() }),
        })
        if (!res.ok) throw new Error('Submission failed')
      } else {
        // No webhook configured yet — log locally so Renée sees the payload in console
        console.log('[lead-capture] webhook placeholder in place, payload:', form)
        await new Promise((r) => setTimeout(r, 600))
      }
      setSubmitted(true)
    } catch (err) {
      setError("We couldn't submit right now — please email poweragentsystem@gmail.com or call 416-878-4622.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ background: NAVY, color: WHITE, minHeight: '100vh', overflowX: 'hidden' }}>
      {/* NAV */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 40, background: 'rgba(10,22,40,0.82)',
        backdropFilter: 'blur(12px)', borderBottom: `1px solid ${BORDER_SOFT}`,
      }}>
        <div style={{ ...container, display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>
          <a href="#top" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_SOFT} 100%)`, display: 'grid', placeItems: 'center', color: NAVY, fontWeight: 900 }}>X</div>
            <span style={{ color: WHITE, fontWeight: 800, letterSpacing: '-0.01em' }}>{BRAND}</span>
          </a>
          <div style={{ display: 'flex', gap: 28, alignItems: 'center' }} className="nav-links">
            <a href="#capabilities" style={navLink}>What We Do</a>
            <a href="#pricing" style={navLink}>Pricing</a>
            <a href="#faq" style={navLink}>FAQ</a>
            <a href="#contact" style={{ ...btnPrimary, padding: '10px 16px', fontSize: 14 }}>Book a Call <ArrowRight size={16} /></a>
          </div>
          <button aria-label="menu" onClick={() => setMenu(!menu)} style={{ ...btnGhost, padding: '8px 10px', display: 'none' }} className="nav-burger">
            {menu ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
        {menu && (
          <div style={{ borderTop: `1px solid ${BORDER_SOFT}`, padding: 16, display: 'grid', gap: 10, background: NAVY }}>
            <a href="#capabilities" onClick={() => setMenu(false)} style={navLink}>What We Do</a>
            <a href="#pricing" onClick={() => setMenu(false)} style={navLink}>Pricing</a>
            <a href="#faq" onClick={() => setMenu(false)} style={navLink}>FAQ</a>
            <a href="#contact" onClick={() => setMenu(false)} style={{ ...btnPrimary, padding: '10px 16px', fontSize: 14 }}>Book a Call</a>
          </div>
        )}
      </nav>

      {/* HERO */}
      <header id="top" style={{ position: 'relative', paddingTop: 72, paddingBottom: 96, overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `radial-gradient(ellipse at 20% 0%, rgba(201,168,76,0.18), transparent 55%), radial-gradient(ellipse at 80% 40%, rgba(80,130,210,0.15), transparent 55%)`,
        }} />
        <div style={{ ...container, position: 'relative' }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span style={{ ...eyebrow, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px', border: `1px solid ${BORDER}`, borderRadius: 999, background: 'rgba(201,168,76,0.06)' }}>
              <Sparkles size={12} /> AI Voice Agents + Automation · Toronto
            </span>
            <h1 style={{ ...h1, marginTop: 20, maxWidth: 920 }}>
              Stop losing leads after hours.<br />
              <span style={{ color: GOLD }}>Your AI team answers every call, every time.</span>
            </h1>
            <p style={{ ...sub, maxWidth: 720 }}>
              We build done-for-you voice AI agents and end-to-end automation for service businesses — dental, real estate, mortgage, and trades. Appointments booked, leads qualified, follow-ups handled. Without adding a single person to your payroll.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
              <a href="#contact" style={btnPrimary}>Book a Discovery Call <ArrowRight size={16} /></a>
              <a href="#pricing" style={btnGhost}>See Pricing</a>
            </div>
            <div style={{ display: 'flex', gap: 20, marginTop: 36, flexWrap: 'wrap', color: MUTED, fontSize: 14 }}>
              <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}><Shield size={14} color={GOLD} /> CASL + PIPEDA aware</span>
              <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}><Zap size={14} color={GOLD} /> Live in 7–14 days</span>
              <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}><Building2 size={14} color={GOLD} /> Built in Toronto</span>
            </div>
          </motion.div>
        </div>
      </header>

      {/* CAPABILITIES */}
      <section id="capabilities" style={{ ...sectionPad, background: NAVY_SOFT, borderTop: `1px solid ${BORDER_SOFT}`, borderBottom: `1px solid ${BORDER_SOFT}` }}>
        <div style={container}>
          <p style={eyebrow}>What We Do</p>
          <h2 style={{ ...h2, marginTop: 10, maxWidth: 720 }}>Four systems that replace the tasks eating your time.</h2>
          <p style={{ ...sub, maxWidth: 680 }}>We don't sell tools. We build complete systems that run your front-office work — voice, text, CRM, and follow-up — so you stay focused on the actual work.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18, marginTop: 40 }}>
            {CAPABILITIES.map((c, i) => (
              <motion.div key={c.title}
                initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.45, delay: i * 0.05 }}
                style={{ background: NAVY_CARD, border: `1px solid ${BORDER_SOFT}`, borderRadius: 16, padding: 24 }}>
                <div style={{ width: 44, height: 44, borderRadius: 11, background: 'rgba(201,168,76,0.12)', display: 'grid', placeItems: 'center', color: GOLD, marginBottom: 16 }}>
                  <c.icon size={22} />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: WHITE, margin: '0 0 8px' }}>{c.title}</h3>
                <p style={{ fontSize: 14.5, color: MUTED, lineHeight: 1.6, margin: 0 }}>{c.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={sectionPad}>
        <div style={container}>
          <p style={eyebrow}>Pricing</p>
          <h2 style={{ ...h2, marginTop: 10 }}>One setup. One monthly. No surprises.</h2>
          <p style={{ ...sub, maxWidth: 680 }}>All tiers include your build, CRM integration, go-live testing, and 2 hours of support per month. Beyond that is billed hourly at a rate agreed up front.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18, marginTop: 36 }}>
            {TIERS.map((t) => (
              <div key={t.name} style={{
                position: 'relative',
                background: t.highlight ? `linear-gradient(180deg, rgba(201,168,76,0.08) 0%, ${NAVY_CARD} 60%)` : NAVY_CARD,
                border: t.highlight ? `1px solid ${GOLD}` : `1px solid ${BORDER_SOFT}`,
                borderRadius: 18, padding: 24, display: 'flex', flexDirection: 'column',
                boxShadow: t.highlight ? '0 20px 48px rgba(201,168,76,0.18)' : 'none',
              }}>
                {t.highlight && (
                  <span style={{
                    position: 'absolute', top: -12, right: 16,
                    background: GOLD, color: NAVY, fontSize: 11, fontWeight: 800,
                    letterSpacing: '0.12em', padding: '5px 10px', borderRadius: 999, textTransform: 'uppercase',
                  }}>Most Popular</span>
                )}
                <h3 style={{ fontSize: 20, fontWeight: 800, color: WHITE, margin: 0 }}>{t.name}</h3>
                <p style={{ fontSize: 13, color: MUTED, margin: '4px 0 18px' }}>{t.agents} · {t.minutes}</p>
                <div style={{ marginBottom: 16 }}>
                  {t.monthly !== null ? (
                    <>
                      <div style={{ fontSize: 32, fontWeight: 800, color: WHITE, lineHeight: 1 }}>
                        ${t.monthly}<span style={{ fontSize: 14, fontWeight: 500, color: MUTED }}>/mo</span>
                      </div>
                      <div style={{ fontSize: 13, color: MUTED, marginTop: 6 }}>+ ${t.setup.toLocaleString()} setup · {t.rate}</div>
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: 28, fontWeight: 800, color: WHITE, lineHeight: 1.1 }}>Let's talk</div>
                      <div style={{ fontSize: 13, color: MUTED, marginTop: 6 }}>Negotiated setup + rate</div>
                    </>
                  )}
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', display: 'grid', gap: 10, flexGrow: 1 }}>
                  {t.features.map((f) => (
                    <li key={f} style={{ display: 'flex', gap: 10, fontSize: 14, color: WHITE }}>
                      <Check size={16} color={GOLD} style={{ flexShrink: 0, marginTop: 2 }} /> <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <a href="#contact" style={{ ...(t.highlight ? btnPrimary : btnGhost), width: '100%', padding: '12px 16px', fontSize: 14 }}>
                  {t.name === 'Custom' ? 'Request a Quote' : 'Start Here'} <ArrowRight size={14} />
                </a>
              </div>
            ))}
          </div>
          <p style={{ ...sub, fontSize: 13, marginTop: 28, textAlign: 'center' }}>
            Monthly includes 2 hours of support. Anything beyond = billed hourly. New agents / new workflows = scoped add-ons.
          </p>
        </div>
      </section>

      {/* CONTACT FORM */}
      <section id="contact" style={{ ...sectionPad, background: NAVY_SOFT, borderTop: `1px solid ${BORDER_SOFT}`, borderBottom: `1px solid ${BORDER_SOFT}` }}>
        <div style={{ ...container, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.2fr)', gap: 48 }} className="contact-grid">
          <div>
            <p style={eyebrow}>Book a Call</p>
            <h2 style={{ ...h2, marginTop: 10 }}>Tell us what's eating your front office.</h2>
            <p style={{ ...sub }}>We'll reply within one business day with a short plan — no pressure, no sales script. If we're a fit, we scope it. If we're not, we'll point you in the right direction.</p>
            <div style={{ marginTop: 28, display: 'grid', gap: 14, color: MUTED, fontSize: 14 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}><Mail size={16} color={GOLD} /> poweragentsystem@gmail.com</div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}><Phone size={16} color={GOLD} /> (416) 878-4622</div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}><MapPin size={16} color={GOLD} /> Toronto, Canada</div>
            </div>
          </div>
          <div style={{ background: NAVY_CARD, border: `1px solid ${BORDER_SOFT}`, borderRadius: 18, padding: 28 }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '32px 8px' }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: 'rgba(201,168,76,0.12)', color: GOLD, display: 'grid', placeItems: 'center', margin: '0 auto 16px' }}>
                  <Check size={28} />
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: WHITE, margin: 0 }}>Got it — we'll be in touch.</h3>
                <p style={{ ...sub, marginTop: 10 }}>Expect a reply within one business day at the email you provided.</p>
              </div>
            ) : (
              <form onSubmit={submit} style={{ display: 'grid', gap: 14 }}>
                <Field label="Your name" value={form.name} onChange={update('name')} placeholder="Jane Smith" />
                <Field label="Business name" value={form.business} onChange={update('business')} placeholder="Acme Dental" />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="form-row">
                  <Field label="Email" type="email" value={form.email} onChange={update('email')} placeholder="jane@acme.com" />
                  <Field label="Phone" type="tel" value={form.phone} onChange={update('phone')} placeholder="(416) 555-0123" />
                </div>
                <div>
                  <label style={labelStyle}>What do you need help with?</label>
                  <select value={form.industry} onChange={update('industry')} style={inputStyle}>
                    <option value="" style={{ background: NAVY }}>Select an industry</option>
                    {INDUSTRIES.map((i) => <option key={i} value={i} style={{ background: NAVY }}>{i}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>A short note (optional)</label>
                  <textarea value={form.message} onChange={update('message')} rows={4}
                    placeholder="What's the biggest bottleneck right now?"
                    style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }} />
                </div>
                {error && <div style={{ color: '#ff8b8b', fontSize: 13 }}>{error}</div>}
                <button type="submit" disabled={submitting} style={{ ...btnPrimary, opacity: submitting ? 0.7 : 1 }}>
                  {submitting ? 'Sending…' : 'Send & Book a Call'} <ArrowRight size={16} />
                </button>
                <p style={{ fontSize: 12, color: MUTED, margin: 0 }}>
                  By submitting, you agree to be contacted by {BRAND} about your request. We handle data under PIPEDA + CASL.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={sectionPad}>
        <div style={{ ...container, maxWidth: 820 }}>
          <p style={eyebrow}>FAQ</p>
          <h2 style={{ ...h2, marginTop: 10 }}>Quick answers.</h2>
          <div style={{ marginTop: 28, display: 'grid', gap: 12 }}>
            {FAQS.map((item, i) => {
              const isOpen = open === i
              return (
                <div key={item.q} style={{ background: NAVY_CARD, border: `1px solid ${BORDER_SOFT}`, borderRadius: 14, overflow: 'hidden' }}>
                  <button onClick={() => setOpen(isOpen ? null : i)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '18px 22px', background: 'transparent', border: 'none', color: WHITE,
                      fontSize: 16, fontWeight: 600, textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit',
                    }}>
                    <span>{item.q}</span>
                    <ChevronDown size={18} style={{ color: GOLD, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }}>
                        <div style={{ padding: '0 22px 20px', color: MUTED, fontSize: 15, lineHeight: 1.65 }}>{item.a}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: `1px solid ${BORDER_SOFT}`, padding: '36px 0', background: NAVY }}>
        <div style={{ ...container, display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: GOLD, color: NAVY, display: 'grid', placeItems: 'center', fontWeight: 900, fontSize: 14 }}>X</div>
              <span style={{ color: WHITE, fontWeight: 700 }}>Xpert Web Solutions Inc.</span>
            </div>
            <p style={{ color: MUTED, fontSize: 13, margin: '10px 0 0' }}>Toronto, Canada · &copy; {new Date().getFullYear()} Xpert Web Solutions Inc.</p>
          </div>
          <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap', color: MUTED, fontSize: 13 }}>
            <a href="mailto:poweragentsystem@gmail.com" style={footLink}>poweragentsystem@gmail.com</a>
            <a href="tel:+14168784622" style={footLink}>(416) 878-4622</a>
          </div>
        </div>
      </footer>

      <style>{`
        html { scroll-behavior: smooth; }
        a { color: inherit; }
        input:focus, select:focus, textarea:focus { outline: none; border-color: ${GOLD} !important; box-shadow: 0 0 0 3px rgba(201,168,76,0.18); }
        a[style*="btnPrimary"]:hover, button:hover:not(:disabled) { transform: translateY(-1px); }
        @media (max-width: 860px) {
          .contact-grid { grid-template-columns: 1fr !important; gap: 28px !important; }
          .form-row { grid-template-columns: 1fr !important; }
          .nav-links { display: none !important; }
          .nav-burger { display: inline-flex !important; }
        }
      `}</style>
    </div>
  )
}

// --- SMALL BITS -----------------------------------------------------------
const navLink = { color: '#C8D3E2', textDecoration: 'none', fontSize: 14.5, fontWeight: 500 }
const footLink = { color: '#8FA3BF', textDecoration: 'none' }
const labelStyle = { display: 'block', fontSize: 12, fontWeight: 700, color: GOLD, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }
const inputStyle = {
  width: '100%', boxSizing: 'border-box',
  padding: '12px 14px', background: NAVY, color: WHITE,
  border: `1px solid ${BORDER_SOFT}`, borderRadius: 10, fontSize: 15,
  transition: 'border-color .15s ease, box-shadow .15s ease',
  fontFamily: 'inherit',
}

function Field ({ label, type = 'text', value, onChange, placeholder }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} style={inputStyle} />
    </div>
  )
}
