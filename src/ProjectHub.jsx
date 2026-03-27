import { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronRight, CheckCircle, Users, Layers, BarChart3, Shield, Target, Zap, ArrowRight, Calendar, GitFork, Palette, Monitor, Eye, EyeOff } from "lucide-react";

// ─── Animated Counter ───
function Counter({ end, duration = 1200, suffix = "", prefix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        let start = 0;
        const step = end / (duration / 16);
        const timer = setInterval(() => {
          start += step;
          if (start >= end) { setCount(end); clearInterval(timer); }
          else setCount(Math.floor(start));
        }, 16);
      }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end, duration]);
  return <span ref={ref}>{prefix}{count}{suffix}</span>;
}

// ─── Expandable Section ───
function Expandable({ title, children, defaultOpen = false, badge = null }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden mb-3">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left">
        <div className="flex items-center gap-2">
          {open ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
          <span className="font-semibold text-sm text-gray-800">{title}</span>
          {badge && <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">{badge}</span>}
        </div>
        <span className="text-xs text-gray-400">{open ? "collapse" : "expand"}</span>
      </button>
      {open && <div className="px-4 py-3 text-sm text-gray-700 leading-relaxed border-t border-gray-100">{children}</div>}
    </div>
  );
}

// ─── Risk Row ───
function RiskRow({ num, risk, likelihood, impact, mitigation }) {
  const lColor = { Low: "bg-green-100 text-green-800", Medium: "bg-yellow-100 text-yellow-800", High: "bg-red-100 text-red-800", Critical: "bg-red-200 text-red-900" };
  return (
    <div className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-0">
      <span className="text-xs text-gray-400 font-mono mt-0.5 w-4">{num}</span>
      <div className="flex-1">
        <p className="text-sm text-gray-800">{risk}</p>
        <p className="text-xs text-gray-500 mt-1">{mitigation}</p>
      </div>
      <div className="flex gap-1.5 shrink-0">
        <span className={`text-xs px-1.5 py-0.5 rounded ${lColor[likelihood]}`}>{likelihood}</span>
        <span className={`text-xs px-1.5 py-0.5 rounded ${lColor[impact]}`}>{impact}</span>
      </div>
    </div>
  );
}


// ─── Sprint Column ───
function SprintCol({ label, dates, items, note }) {
  const typeColors = {
    dev1: "border-l-blue-400 bg-blue-50", dev2: "border-l-violet-400 bg-violet-50",
    advisory: "border-l-yellow-400 bg-yellow-50", ux: "border-l-emerald-400 bg-emerald-50",
    process: "border-l-green-400 bg-green-50", patterns: "border-l-pink-400 bg-pink-50",
    validation: "border-l-red-300 bg-red-50", admin: "border-l-orange-400 bg-orange-50",
    release: "border-l-gray-800 bg-gray-800 text-white"
  };
  return (
    <div className="min-w-[160px]">
      <div className="text-center mb-2">
        <p className="font-bold text-xs text-gray-800">{label}</p>
        <p className="text-xs text-gray-400">{dates}</p>
        {note && <p className="text-xs text-amber-600 mt-0.5">{note}</p>}
      </div>
      <div className="space-y-1">
        {items.map((t, i) => (
          <div key={i} className={`text-xs px-2 py-1.5 rounded border-l-3 ${typeColors[t.type] || "bg-gray-50 border-l-gray-300"}`} style={{ borderLeftWidth: "3px" }}>
            <p className={`font-semibold ${t.type === "release" ? "text-white" : ""}`}>{t.title}</p>
            {t.size && <span className={`text-xs ${t.type === "release" ? "text-gray-300" : "text-gray-400"}`}>{t.size}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN APP ───
export default function ProjectHub() {
  const [activeNav, setActiveNav] = useState("overview");
  const [teamView, setTeamView] = useState(false);
  const sectionRefs = useRef({});

  const scrollTo = (id) => {
    setActiveNav(id);
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const navItems = [
    { id: "overview", label: "Overview", icon: Target },
    { id: "board", label: "Sprint Board", icon: Calendar },
    { id: "workstreams", label: "Workstreams", icon: Layers },
    { id: "risks", label: "Risks", icon: Shield },
    { id: "case", label: "Business Case", icon: BarChart3 },
  ];

  const ref = (id) => (el) => { sectionRefs.current[id] = el; };

  // ─── Sprint Board Data ───
  const sprintData = {
    v2: [
      { label: "Flex Week", dates: "Mar 24–28", note: "Setup week", items: [
        { title: "Fork CUIC repo", size: "1d", who: "Devs + Alexey", type: "dev1" },
        { title: "Validate fork + CI/CD", size: "2d", who: "Dev 1", type: "dev1" },
        { title: "Set up Storybook", size: "1d", who: "Dev 2", type: "dev2" },
        { title: "Jira + Slack + specs", size: "1d", who: "Brenna", type: "process" },
        { title: "QA checklist", size: "0.5d", who: "Ilya + Frank", type: "validation" },
      ]},
      { label: "Sprint 1", dates: "Mar 31 – Apr 11", items: [
        { title: "SCSS → CSS custom properties", size: "3d", who: "Devs", type: "dev1" },
        { title: "Tier 1: Button, Input, Dropdown, Listbox, Slider", size: "3.75d", who: "Dev 1", type: "dev1" },
        { title: "Tier 1: Checkbox, Radio, Toggle, Link, Label", size: "1.25d", who: "Dev 2", type: "dev2" },
        { title: "Tier 2 begins: Badge, Card, Chip...", size: "2.75d", who: "Dev 2", type: "dev2" },
        { title: "Pattern doc gap analysis", size: "2d", who: "Solange", type: "patterns" },
      ]},
      { label: "Sprint 2", dates: "Apr 14–25", items: [
        { title: "Tier 2 remaining: Snackbar, Toast...", size: "2.5d", who: "Dev 1", type: "dev1" },
        { title: "Tier 3: Tabs, Nav, Side Panel...", size: "3.5d", who: "Dev 1", type: "dev1" },
        { title: "Tier 3: Breadcrumb, Pagination...", size: "2.75d", who: "Dev 2", type: "dev2" },
        { title: "Design QA: Tier 1", size: "2d", who: "Ilya + Sonia", type: "validation" },
        { title: "Alexey review: Tier 1+2", size: "0.5d", who: "Alexey", type: "advisory" },
        { title: "Publish 0.1.0-alpha", size: "0.5d", who: "Dev 1", type: "release" },
      ]},
      { label: "Sprint 3", dates: "Apr 28 – May 9", items: [
        { title: "Tier 4: Dialog, Popup, Scrim", size: "2d", who: "Dev 1", type: "dev1" },
        { title: "Tier 4: Stepper, Wizard, Color Picker", size: "4d", who: "Dev 2", type: "dev2" },
        { title: "Design QA: Tier 2+3", size: "3d", who: "Ilya + Sonia", type: "validation" },
        { title: "A11y audit: Tier 1+2", size: "3d", who: "Frank", type: "validation" },
        { title: "Publish 0.2.0-beta (all 39)", size: "0.5d", who: "Dev 1", type: "release" },
      ]},
      { label: "Sprint 4", dates: "May 12–23", items: [
        { title: "Build Tailwind v4 preset", size: "2d", who: "Dev 1", type: "dev1" },
        { title: "Design QA: Tier 4", size: "2d", who: "Ilya", type: "validation" },
        { title: "A11y audit: Tier 3+4", size: "3d", who: "Frank", type: "validation" },
        { title: "Fix accumulated QA issues", size: "2d", who: "Devs", type: "dev1" },
        { title: "Pattern docs: complete draft", size: "3d", who: "Solange", type: "patterns" },
      ]},
      { label: "Sprint 5", dates: "May 26 – Jun 6", items: [
        { title: "Component docs (API ref)", size: "5d", who: "Frank", type: "admin" },
        { title: "Pattern docs finalized", size: "2d", who: "Solange", type: "patterns" },
      ]},
      { label: "Sprint 6", dates: "Jun 9–20", items: [
        { title: "Component docs complete", size: "3d", who: "Frank", type: "admin" },
        { title: "Getting started guide", size: "2d", who: "Frank", type: "admin" },
        { title: "Upgrade guide (CUIC → V2)", size: "2d", who: "Frank", type: "admin" },
        { title: "Publish 1.0.0-rc", size: "0.5d", who: "Dev 1", type: "release" },
      ]},
      { label: "Sprint 7", dates: "Jun 23–30", items: [
        { title: "Final QA", size: "2d", who: "All", type: "validation" },
        { title: "Bug fixes from RC", size: "1d", who: "Devs", type: "dev1" },
        { title: "Governance model", size: "1d", who: "Brenna", type: "admin" },
        { title: "Publish V2.0.0", size: "0.5d", who: "Team", type: "release" },
        { title: "Launch demo to org", size: "0.5d", who: "Brenna", type: "release" },
      ]},
    ],
    meff: [
      { label: "Flex", items: [] },
      { label: "S1", items: [{ title: "DS focus — no MEFF yet", size: "", who: "", type: "none" }] },
      { label: "S2", items: [
        { title: "Reskin specs: page-by-page visual pass", size: "3d", who: "Ilya", type: "ux" },
      ]},
      { label: "S3", items: [
        { title: "P0 specs complete", size: "2d", who: "Ilya", type: "ux" },
        { title: "Easy swaps: buttons, inputs, cards", size: "1d", who: "Dev 1", type: "dev1" },
        { title: "Easy swaps: alerts, chips, tags", size: "1d", who: "Dev 2", type: "dev2" },
      ]},
      { label: "S4", items: [
        { title: "P1 specs complete", size: "2d", who: "Ilya", type: "ux" },
        { title: "Heavy reskin: P0 pages", size: "5d", who: "Dev 1", type: "dev1" },
        { title: "Heavy reskin: P0 pages", size: "5d", who: "Dev 2", type: "dev2" },
        { title: "Reskin QA: P0", size: "2d", who: "Ilya + Sonia", type: "validation" },
      ]},
      { label: "S5", items: [
        { title: "Heavy reskin: P1 pages", size: "7d", who: "Dev 1", type: "dev1" },
        { title: "Heavy reskin: P1 pages", size: "7d", who: "Dev 2", type: "dev2" },
        { title: "Reskin QA: P1", size: "2d", who: "Ilya + Sonia", type: "validation" },
      ]},
      { label: "S6", items: [
        { title: "P2 pages + edge cases", size: "4d", who: "Dev 1", type: "dev1" },
        { title: "P2 pages + edge cases", size: "4d", who: "Dev 2", type: "dev2" },
        { title: "Full product QA", size: "2d", who: "Ilya + Sonia", type: "validation" },
      ]},
      { label: "S7", items: [
        { title: "Final visual polish", size: "2d", who: "Devs", type: "dev1" },
        { title: "Final reskin sign-off", size: "1d", who: "Ilya", type: "validation" },
        { title: "MEFF live — reskinned", size: "—", who: "Team", type: "release" },
      ]},
    ],
    datavis: [
      { label: "Flex", items: [
        { title: "Audit Highcharts + AG Grid usage", size: "1d", who: "Solange", type: "patterns" },
      ]},
      { label: "S1", items: [
        { title: "Data vis color palette", size: "3d", who: "Ilya", type: "ux" },
        { title: "Chart type inventory", size: "2d", who: "Solange", type: "patterns" },
        { title: "A11y requirements", size: "1d", who: "Frank", type: "validation" },
      ]},
      { label: "S2", items: [
        { title: "Finalize palette + OKLCH tokens", size: "2d", who: "Ilya", type: "ux" },
        { title: "Highcharts theme config", size: "3d", who: "Solange", type: "patterns" },
        { title: "AG Grid theme CSS", size: "2d", who: "Solange", type: "patterns" },
      ]},
      { label: "S3", items: [
        { title: "Validate themes vs real data", size: "3d", who: "Solange + Ilya", type: "validation" },
        { title: "Chart pattern guidelines", size: "2d", who: "Solange", type: "patterns" },
        { title: "A11y review: palette contrast", size: "1d", who: "Frank", type: "validation" },
      ]},
      { label: "S4", items: [
        { title: "AI metadata: chart selection schema", size: "3d", who: "Solange", type: "patterns" },
        { title: "Theme refinements", size: "2d", who: "Solange + Ilya", type: "patterns" },
      ]},
      { label: "S5", items: [
        { title: "AI metadata: chart config templates", size: "3d", who: "Solange", type: "patterns" },
        { title: "AI metadata: AG Grid templates", size: "2d", who: "Solange", type: "patterns" },
        { title: "Data vis pattern docs", size: "2d", who: "Solange", type: "admin" },
      ]},
      { label: "S6", items: [
        { title: "Cross-product validation", size: "2d", who: "Solange + Devs", type: "validation" },
        { title: "Data vis docs complete", size: "2d", who: "Solange", type: "admin" },
        { title: "Themes published", size: "0.5d", who: "Solange + Dev 1", type: "release" },
      ]},
      { label: "S7", items: [
        { title: "AI validation: correct configs", size: "2d", who: "Solange", type: "validation" },
        { title: "Data vis unified + AI-readable", size: "—", who: "Team", type: "release" },
      ]},
    ],
  };

  // ─── LEGEND ───
  const legend = [
    { label: "DEV 1", color: "bg-blue-100 border-blue-400" },
    { label: "DEV 2", color: "bg-violet-100 border-violet-400" },
    { label: "Advisory", color: "bg-yellow-100 border-yellow-400" },
    { label: "UX Work", color: "bg-emerald-100 border-emerald-400" },
    { label: "Process", color: "bg-green-100 border-green-400" },
    { label: "Patterns", color: "bg-pink-100 border-pink-400" },
    { label: "Validation", color: "bg-red-100 border-red-300" },
    { label: "Admin", color: "bg-orange-100 border-orange-400" },
    { label: "Release", color: "bg-gray-800 border-gray-800 text-white" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ─── HERO ─── */}
      <div className="bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-indigo-500 flex items-center justify-center">
              <Layers size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Design System V2</h1>
              <p className="text-indigo-300 text-sm">NielsenIQ · Q2 2026</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button onClick={() => setTeamView(!teamView)} className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-white/10 hover:bg-white/20 transition-colors">
                {teamView ? <Eye size={14} /> : <EyeOff size={14} />}
                {teamView ? "Team View" : "Exec View"}
              </button>
            </div>
          </div>

          <p className="text-gray-300 text-sm mt-4 max-w-3xl leading-relaxed">
            Fork CUIC into a separate package. Upgrade 39 components to V2 designs. Restyle MEFF to look great. Unify data vis across all products. Ship by June 30.
          </p>

          {/* STAT CARDS */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-8">
            {[
              { n: 39, s: "", label: "Components", sub: "AI-assisted restyle", icon: Layers },
              { n: 3, s: "", label: "Workstreams", sub: "DS · MEFF · Data Vis", icon: GitFork },
              { n: 7, s: "", label: "Sprints", sub: "Apr 1 → Jun 30", icon: Calendar },
              { n: 14, s: "wk", label: "Timeline", sub: "Flex + 7 sprints", icon: Users },
              { n: 23, s: "d", label: "Dev-Days", sub: "All 39 done by Sprint 3", icon: Zap },
            ].map((s, i) => (
              <div key={i} className="bg-white/5 backdrop-blur rounded-xl p-4 border border-white/10 hover:border-indigo-400/40 transition-colors">
                <s.icon size={16} className="text-indigo-400 mb-2" />
                <p className="text-2xl font-bold">
                  <Counter end={s.n} suffix={s.s} />
                </p>
                <p className="text-xs text-gray-300 font-medium">{s.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── STICKY NAV ─── */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <nav className="flex gap-1 overflow-x-auto py-2">
            {navItems.map((n) => (
              <button key={n.id} onClick={() => scrollTo(n.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${activeNav === n.id ? "bg-indigo-100 text-indigo-700" : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"}`}>
                <n.icon size={14} />
                {n.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-12">

        {/* ═══════ OVERVIEW ═══════ */}
        <section ref={ref("overview")}>
          <h2 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2"><Target size={18} className="text-indigo-500" /> The Big Picture</h2>
          <p className="text-sm text-gray-500 mb-6">What we're doing, why, and how</p>

          {/* Three workstream cards */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-blue-200 p-5 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center"><GitFork size={16} className="text-blue-600" /></div>
                <h3 className="font-bold text-sm text-gray-900">V2 DS Library</h3>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">Fork CUIC. Restyle 39 components to V2 specs. Replace SCSS with CSS custom properties. Ship optional Tailwind preset. All done by Sprint 3.</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">~23 dev-days</span>
                <span className="text-xs text-gray-400">Sprints 1–3</span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-amber-200 p-5 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center"><Monitor size={16} className="text-amber-600" /></div>
                <h3 className="font-bold text-sm text-gray-900">MEFF Reskin</h3>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">Product was built fast with Claude — not componentized, hardcoded styles. Systematic component swap + style cleanup. P0/P1/P2 priority system.</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-medium">~38–40 dev-days</span>
                <span className="text-xs text-gray-400">Sprints 3–7</span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-purple-200 p-5 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center"><Palette size={16} className="text-purple-600" /></div>
                <h3 className="font-bold text-sm text-gray-900">Data Vis Unification</h3>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">Unify Highcharts + AG Grid under DS tokens. Full color palette. AI-readable metadata so LLMs generate correct chart configs automatically.</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-medium">~25 days</span>
                <span className="text-xs text-gray-400">Design + patterns</span>
              </div>
            </div>
          </div>

          {/* Timeline bar */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
            <h3 className="font-bold text-sm text-gray-900 mb-3">Quarter at a Glance</h3>
            <div className="relative">
              <div className="flex items-center gap-0">
                {["Flex\nMar 24", "S1\nMar 31", "S2\nApr 14", "S3\nApr 28", "S4\nMay 12", "S5\nMay 26", "S6\nJun 9", "S7\nJun 23"].map((s, i) => (
                  <div key={i} className="flex-1 text-center">
                    <div className={`h-8 rounded ${i <= 2 ? "bg-blue-400" : i === 3 ? "bg-indigo-400" : "bg-amber-400"} mx-0.5 flex items-center justify-center`}>
                      <span className="text-white text-xs font-bold">{s.split("\n")[0]}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{s.split("\n")[1]}</p>
                  </div>
                ))}
              </div>
              <div className="flex mt-2 text-xs text-gray-500">
                <div className="flex-[3] text-center"><span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Components (39)</span></div>
                <div className="flex-[1] text-center"><span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">Beta</span></div>
                <div className="flex-[4] text-center"><span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">MEFF Heavy Reskin + Docs + Ship</span></div>
              </div>
            </div>
          </div>

          {/* Expandable detail sections */}
          {teamView && (
            <div className="space-y-0">
              <Expandable title="Why are we doing this?" badge="Context">
                <p className="mb-2">The CUIC design system team reports into Discover. All prioritization and capacity is controlled by Discover's needs. Tokens won't be in the common repo until September 2026.</p>
                <p className="mb-2">Every non-Discover team is forced to wait or build custom implementations — restarting the fragmentation cycle the design system was created to prevent.</p>
                <p>This project eliminates that delay. Fork CUIC, upgrade to V2, ship by end of Q2. <strong>6+ months ahead of the current timeline.</strong></p>
              </Expandable>
              <Expandable title="Why fork instead of build from scratch?" badge="Architecture">
                <p className="mb-2"><strong>Fork gives us:</strong> Working component base on day one. All existing APIs preserved by default — no compatibility work. Developer time goes to upgrading the design, not rebuilding working code.</p>
                <p className="mb-2"><strong>CUIC stays untouched:</strong> Discover keeps running on it as-is. The fork lives independently. Other teams adopt V2 when ready — it's a package swap.</p>
                <p><strong>CUIC tech lead is a partner:</strong> Their feedback shaped the approach. Keep APIs stable, don't make the system technology-dependent. The original repo stays untouched, and they advise on architecture.</p>
              </Expandable>
              <Expandable title="Why optional Tailwind?" badge="Architecture">
                <p className="mb-2">MEFF developers want Tailwind's utility classes. Other teams shouldn't be forced into it.</p>
                <p>The core V2 library works standalone with CSS custom properties. A companion Tailwind v4 preset maps all design tokens to Tailwind utilities — install it if you want it, skip it if you don't.</p>
              </Expandable>
              <Expandable title="What ships by June 30?" badge="Scope">
                <ul className="space-y-1">
                  <li>• 39 Angular components restyled to V2 design specs</li>
                  <li>• CSS custom property token system (color, spacing, typography, elevation, motion)</li>
                  <li>• Sub-brand architecture (MEFF as first brand)</li>
                  <li>• Optional Tailwind v4 preset package</li>
                  <li>• MEFF product reskinned and running on V2</li>
                  <li>• Highcharts + AG Grid unified themes published</li>
                  <li>• AI-readable data vis metadata</li>
                  <li>• Component + pattern documentation</li>
                  <li>• Contribution process + governance model</li>
                </ul>
              </Expandable>
              <Expandable title="Component list (all 39)" badge="39 components">
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold text-xs text-gray-500 uppercase tracking-wide mb-1">Tier 1: Primitives & Inputs (10) — ~5 dev-days</p>
                    <p>Button, Text Input, Checkbox, Radio Button, Toggle, Dropdown, Link, Form Element Label, Listbox, Slider</p>
                  </div>
                  <div>
                    <p className="font-semibold text-xs text-gray-500 uppercase tracking-wide mb-1">Tier 2: Feedback & Display (13) — ~5.25 dev-days</p>
                    <p>Badge, Callout, Card, Chip, Tag, Tooltip, Divider, Spinner, Snackbar, Toast, Avatar, Tile, Data Summary</p>
                  </div>
                  <div>
                    <p className="font-semibold text-xs text-gray-500 uppercase tracking-wide mb-1">Tier 3: Navigation & Layout (10) — ~6.5 dev-days</p>
                    <p>Tabs, Breadcrumb, Navigation, Side Panel, Page Headers, Footer, Pagination, Accordion, Segment, Option Bar</p>
                  </div>
                  <div>
                    <p className="font-semibold text-xs text-gray-500 uppercase tracking-wide mb-1">Tier 4: Overlays & Complex (6) — ~6 dev-days</p>
                    <p>Dialog, Popup, Scrim, Stepper, Wizard, Color Picker</p>
                  </div>
                  <p className="text-xs text-gray-400 mt-2 italic">No table component — all teams use AG Grid. AI-assisted restyling of existing CUIC code = ~0.6 dev-days avg per component.</p>
                </div>
              </Expandable>
            </div>
          )}
        </section>

        {/* ═══════ SPRINT BOARD ═══════ */}
        <section ref={ref("board")}>
          <h2 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2"><Calendar size={18} className="text-indigo-500" /> Sprint Board</h2>
          <p className="text-sm text-gray-500 mb-4">Flex Week + 7 Sprints · 3 Swimlanes · Color = work type</p>

          {/* Legend */}
          <div className="flex flex-wrap gap-2 mb-4">
            {legend.map((l, i) => (
              <span key={i} className={`text-xs px-2 py-1 rounded border-l-3 ${l.color}`} style={{ borderLeftWidth: "3px" }}>{l.label}</span>
            ))}
          </div>

          {/* V2 DS Library */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">V2 DS Library</span>
              <span className="text-xs text-gray-400">39 components · All done by Sprint 3</span>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {sprintData.v2.map((s, i) => <SprintCol key={i} {...s} />)}
            </div>
          </div>

          {/* MEFF Reskin */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">MEFF Reskin</span>
              <span className="text-xs text-gray-400">Easy swaps Sprint 3 → Heavy reskin Sprints 4–7</span>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {sprintData.meff.map((s, i) => <SprintCol key={i} label={s.label} dates="" items={s.items} />)}
            </div>
          </div>

          {/* Data Vis */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold">Data Vis Unification</span>
              <span className="text-xs text-gray-400">Highcharts + AG Grid · Design + patterns lead</span>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {sprintData.datavis.map((s, i) => <SprintCol key={i} label={s.label} dates="" items={s.items} />)}
            </div>
          </div>
        </section>

        {/* ═══════ WORKSTREAMS (DETAIL) ═══════ */}
        <section ref={ref("workstreams")}>
          <h2 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2"><Layers size={18} className="text-indigo-500" /> Workstream Detail</h2>
          <p className="text-sm text-gray-500 mb-4">Expand any section for full sprint-level deliverables</p>

          <Expandable title="V2 DS Library — Sprint-by-Sprint Deliverables" badge="39 components" defaultOpen={teamView}>
            <div className="space-y-4">
              {[
                { s: "Flex Week (Mar 24–28)", g: "Fork live. Build validated. Tooling ready.", items: "Fork CUIC repo · Validate fork + CI/CD · Package name + registry · Storybook setup · SCSS variable inventory · Jira + Slack + specs · QA checklist · Claude prompting conventions" },
                { s: "Sprint 1 (Mar 31 – Apr 11)", g: "Token system in place. Tier 1 complete. Tier 2 underway.", items: "SCSS → CSS custom properties refactor (3d) · Tier 1 restyle: 10 components (5d total) · Begin Tier 2: 8 components · Pattern doc gap analysis" },
                { s: "Sprint 2 (Apr 14–25)", g: "Tiers 1–2 QA'd. Tier 3 in progress. Alpha published.", items: "Finish Tier 2 remaining · Tier 3 restyle: 10 components · Design QA: Tier 1 · CUIC tech lead review · Pattern docs · Publish 0.1.0-alpha" },
                { s: "Sprint 3 (Apr 28 – May 9)", g: "ALL 39 components done. Beta published.", items: "Tier 4: 6 components (Dialog, Popup, Scrim, Stepper, Wizard, Color Picker) · Design QA: Tier 2+3 · A11y audit: Tier 1+2 · Sub-brand override test · Publish 0.2.0-beta" },
                { s: "Sprint 4 (May 12–23)", g: "Tailwind preset published. All QA caught up.", items: "Build Tailwind v4 preset · Design QA: Tier 4 · A11y audit: Tier 3+4 · Fix accumulated QA issues · Pattern docs complete draft" },
                { s: "Sprint 5–6 (May 26 – Jun 20)", g: "Documentation complete. RC published.", items: "Component docs (API ref, examples) · Pattern docs finalized · Getting started guide · Upgrade guide (CUIC → V2) · Publish 1.0.0-rc" },
                { s: "Sprint 7 (Jun 23–30)", g: "V2 shipped.", items: "Final QA · Bug fixes · Performance audit · Governance model · Contribution process · Publish V2.0.0 · Launch demo" },
              ].map((sp, i) => (
                <div key={i} className="border-l-2 border-blue-200 pl-3">
                  <p className="font-semibold text-sm text-gray-800">{sp.s}</p>
                  <p className="text-xs text-indigo-600 mb-1">{sp.g}</p>
                  <p className="text-xs text-gray-500">{sp.items}</p>
                </div>
              ))}
            </div>
          </Expandable>

          <Expandable title="MEFF Reskin — Sprint-by-Sprint Deliverables" badge="~38–40 dev-days" defaultOpen={teamView}>
            <div className="space-y-3">
              <p className="text-sm text-gray-600 mb-2">MEFF was built rapidly with Claude Code — functional but not componentized, hardcoded styles. This workstream is a reskin + cleanup, not a redesign. UX and information architecture are fine.</p>
              <div className="border-l-2 border-amber-200 pl-3">
                <p className="font-semibold text-xs text-gray-500 uppercase">Priority system</p>
                <p className="text-xs text-gray-600"><strong>P0:</strong> Must look right at launch (main dashboard, navigation, most-used workflows)</p>
                <p className="text-xs text-gray-600"><strong>P1:</strong> Should look right (secondary pages, settings, less-used features)</p>
                <p className="text-xs text-gray-600"><strong>P2:</strong> Can polish in Q3 (admin pages, edge-case views)</p>
              </div>
              {[
                { s: "Sprint 2–3", items: "Page-by-page reskin specs produced (P0/P1/P2). Easy swaps begin Sprint 3: buttons, inputs, cards, alerts, badges → V2 components." },
                { s: "Sprint 4", items: "Heavy reskin P0 pages — systematic component swap + style cleanup. ~5 dev-days each. Design QA on P0 pages." },
                { s: "Sprint 5", items: "Heavy reskin P1 pages — ~7 dev-days each. Design QA on P1 pages. Fix integration issues." },
                { s: "Sprint 6", items: "P2 pages (stretch) + fix P0/P1 edge cases. Full product walkthrough QA." },
                { s: "Sprint 7", items: "Final visual polish. Reskin sign-off. MEFF live — reskinned & clean." },
              ].map((sp, i) => (
                <div key={i} className="border-l-2 border-amber-200 pl-3">
                  <p className="font-semibold text-sm text-gray-800">{sp.s}</p>
                  <p className="text-xs text-gray-500">{sp.items}</p>
                </div>
              ))}
            </div>
          </Expandable>

          <Expandable title="Data Vis Unification — Sprint-by-Sprint Deliverables" badge="Highcharts + AG Grid" defaultOpen={teamView}>
            <div className="space-y-3">
              <p className="text-sm text-gray-600 mb-2">Every NIQ product visualizes data using Highcharts (charts) and AG Grid (tables). Each product configures them independently — different palettes, styling, no shared patterns, nothing AI-readable. This workstream themes and documents what already exists.</p>
              <div className="border-l-2 border-purple-200 pl-3 mb-3">
                <p className="font-semibold text-xs text-gray-500 uppercase">Color palette</p>
                <p className="text-xs text-gray-600"><strong>Categorical:</strong> 12 colors for unrelated categories. Colorblind-safe.</p>
                <p className="text-xs text-gray-600"><strong>Sequential:</strong> 5 scales (1 per brand color). Light → dark for heatmaps/density.</p>
                <p className="text-xs text-gray-600"><strong>Divergent:</strong> 3 scales. Two-hue with neutral midpoint for variance/change.</p>
              </div>
              {[
                { s: "Flex – Sprint 1", items: "Audit current usage. Data vis color palette (OKLCH, colorblind-safe). Chart type inventory. A11y requirements." },
                { s: "Sprint 2", items: "Finalize palette + define OKLCH tokens (--ds-chart-*). Highcharts base theme config (JSON). AG Grid theme CSS." },
                { s: "Sprint 3", items: "Validate themes against real product data. Chart pattern guidelines (data type → chart type → config). A11y review: palette contrast." },
                { s: "Sprint 4", items: "AI metadata: chart selection schema (input data → chart type → config). Theme refinements from validation." },
                { s: "Sprint 5", items: "AI metadata: chart + AG Grid config templates. Data vis pattern docs." },
                { s: "Sprint 6–7", items: "Cross-product validation. Data vis docs complete. Themes published. AI validation: LLM generates correct chart configs." },
              ].map((sp, i) => (
                <div key={i} className="border-l-2 border-purple-200 pl-3">
                  <p className="font-semibold text-sm text-gray-800">{sp.s}</p>
                  <p className="text-xs text-gray-500">{sp.items}</p>
                </div>
              ))}
            </div>
          </Expandable>
        </section>

        {/* ═══════ RISKS ═══════ */}
        <section ref={ref("risks")}>
          <h2 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2"><Shield size={18} className="text-indigo-500" /> Risk Register</h2>
          <p className="text-sm text-gray-500 mb-4">9 tracked risks with mitigations</p>

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex gap-3 mb-3 text-xs text-gray-400">
              <span className="flex-1">Risk</span>
              <span className="w-20 text-right">Likelihood / Impact</span>
            </div>
            <RiskRow num={1} risk="CUIC fork has hidden build dependencies" likelihood="Low" impact="High" mitigation="Validate fork builds independently Day 1–2. CUIC tech lead supports. Escalate immediately if broken." />
            <RiskRow num={2} risk="SCSS → CSS custom property refactoring harder than estimated" likelihood="Medium" impact="Medium" mitigation="Spike first components early. AI assists with mechanical conversion. Adjust estimates by Sprint 2." />
            <RiskRow num={3} risk="MEFF reskin takes longer due to messy codebase" likelihood="High" impact="Medium" mitigation="Start easy swaps Sprint 3 to gauge actual effort. P2 can slip to Q3." />
            <RiskRow num={4} risk="MEFF integration reveals component gaps" likelihood="Medium" impact="Medium" mitigation="Alpha/beta testing from Sprint 3. Budget Sprint 6 for fixes." />
            <RiskRow num={5} risk="AI-generated code quality inconsistent" likelihood="Medium" impact="Medium" mitigation="Every PR human-reviewed. Design QA every tier. Weekly quality spot-check." />
            <RiskRow num={6} risk="A dev pulled for product work" likelihood="Low" impact="Critical" mitigation="PM's 100% commitment. Escalate immediately if allocation threatened." />
            <RiskRow num={7} risk="Code review becomes bottleneck" likelihood="Medium" impact="High" mitigation="24-hour review SLA. Distribute across both devs." />
            <RiskRow num={8} risk="Team burnout under compressed timeline" likelihood="Medium" impact="High" mitigation="Monitor morale. Release valves defined. P2 and AI metadata can slip." />
            <RiskRow num={9} risk="Fork diverges from CUIC over time" likelihood="Low" impact="Low" mitigation="Acceptable — V2 is independent evolution. Document significant divergences." />
          </div>

          {teamView && (
            <div className="mt-4">
              <Expandable title="Release valves — what to cut if behind" badge="Contingency">
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold text-sm text-gray-800 mb-1">DS Library</p>
                    <p className="text-xs text-gray-600">End Sprint 2: Defer Color Picker (saves 1.5d) or Wizard (saves 1.5d)</p>
                    <p className="text-xs text-gray-600">End Sprint 3: Cut AI metadata to Q3. Reduce to ~35 components.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-800 mb-1">MEFF Reskin</p>
                    <p className="text-xs text-gray-600">End Sprint 5: P2 pages slip to Q3 (saves ~3–4 dev-days)</p>
                    <p className="text-xs text-gray-600">End Sprint 6: Ship "good enough" on lower-priority views</p>
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-800 mb-1">Data Vis</p>
                    <p className="text-xs text-gray-600">End Sprint 3: Defer AG Grid theme to Q3 (saves ~5 days)</p>
                    <p className="text-xs text-gray-600">End Sprint 4: AI metadata slips to Q3 (saves ~8 days)</p>
                  </div>
                  <p className="text-xs font-semibold text-gray-700 mt-2">Non-negotiable: Tier 1–3 components (33 of 39) + sub-brand + MEFF P0 reskinned + docs + data vis palette + Highcharts theme.</p>
                </div>
              </Expandable>
            </div>
          )}
        </section>

        {/* ═══════ BUSINESS CASE ═══════ */}
        <section ref={ref("case")}>
          <h2 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2"><BarChart3 size={18} className="text-indigo-500" /> Business Case</h2>
          <p className="text-sm text-gray-500 mb-4">Why this investment pays off</p>

          {/* ROI cards */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 p-5">
              <h3 className="font-bold text-sm text-green-800 mb-3 flex items-center gap-2"><Zap size={16} /> What We Get</h3>
              <div className="space-y-2">
                {[
                  ["6+ months accelerated", "Modern DS available end of Q2 vs. basic tokenized library in September"],
                  ["Eliminated duplication", "Discover doesn't need PI3 capacity for tokens — recovers 4–8 weeks dev time"],
                  ["Reduced refactoring debt", "MEFF alone has 3–6 weeks of future migration effort avoided"],
                  ["AI velocity multiplier", "Machine-readable DS means consistent, on-brand AI-generated UI"],
                  ["Multi-product scalability", "Sub-brand support = every product shares infra, keeps distinct identity"],
                ].map(([t, d], i) => (
                  <div key={i} className="flex gap-2">
                    <CheckCircle size={14} className="text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-green-900">{t}</p>
                      <p className="text-xs text-green-700">{d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-5">
              <h3 className="font-bold text-sm text-blue-800 mb-3 flex items-center gap-2"><Target size={16} /> What It Costs</h3>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <ArrowRight size={14} className="text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-blue-900">2 MEFF devs for 1 quarter</p>
                    <p className="text-xs text-blue-700">Existing headcount, not new hires</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <ArrowRight size={14} className="text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-blue-900">UX team partial allocation</p>
                    <p className="text-xs text-blue-700">UX design system team partial allocation</p>
                  </div>
                </div>
                <div className="mt-3 p-3 bg-white/60 rounded-lg">
                  <p className="text-xs font-bold text-blue-800 uppercase tracking-wide mb-1">Not asking for</p>
                  <p className="text-xs text-blue-700">No new headcount. No additional budget. No changes to Discover's plan. No changes to CUIC's repo. No breaking changes for any team.</p>
                </div>
              </div>
            </div>
          </div>

          {teamView && (
            <div className="space-y-0">
              <Expandable title="Alternatives considered" badge="Decision log">
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <span className="text-red-500 text-xs font-bold shrink-0 mt-0.5">REJECTED</span>
                    <div>
                      <p className="text-sm font-semibold">Wait for Discover's timeline</p>
                      <p className="text-xs text-gray-500">6 months of continued fragmentation. MEFF launches with debt.</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-red-500 text-xs font-bold shrink-0 mt-0.5">REJECTED</span>
                    <div>
                      <p className="text-sm font-semibold">Build from scratch</p>
                      <p className="text-xs text-gray-500">Rebuilds working components. Must manually ensure API compatibility. Harder political story.</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-red-500 text-xs font-bold shrink-0 mt-0.5">NOT VIABLE</span>
                    <div>
                      <p className="text-sm font-semibold">Request additional CUIC headcount</p>
                      <p className="text-xs text-gray-500">Headcount requests take months. Doesn't address structural bottleneck.</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-green-600 text-xs font-bold shrink-0 mt-0.5">CHOSEN</span>
                    <div>
                      <p className="text-sm font-semibold">Fork CUIC, upgrade to V2, add optional Tailwind</p>
                      <p className="text-xs text-gray-500">Working base from day one. APIs preserved. Tailwind is optional. Alexey is a collaborator. Best speed + compatibility + adoption path.</p>
                    </div>
                  </div>
                </div>
              </Expandable>
              <Expandable title="Success criteria checklist" badge="Definition of Done">
                <div className="space-y-1">
                  {[
                    "CUIC repo forked and published as separate npm package",
                    "39 components restyled to V2 specs (design QA passed)",
                    "CSS custom property token system with complete coverage",
                    "SCSS variables replaced across all components",
                    "Sub-brand architecture functional (MEFF running distinct brand)",
                    "Tailwind v4 preset published",
                    "MEFF consuming V2 package in production/staging",
                    "Highcharts + AG Grid themes published with DS tokens",
                    "AI-readable data vis metadata validated",
                    "Component + pattern documentation published",
                    "Contribution process documented",
                    "A11y audit passed (WCAG 2.1 AA) for Tier 1–3",
                    "Upgrade guide for CUIC → V2",
                  ].map((c, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded border border-gray-300 shrink-0" />
                      <span className="text-xs text-gray-700">{c}</span>
                    </div>
                  ))}
                </div>
              </Expandable>
              <Expandable title="What happens after Q2" badge="Roadmap">
                <div className="space-y-2">
                  <p><strong>Q3 2026:</strong> MEFF P2 completion if slipped. Other teams adopt V2 (package swap). Data vis themes rolled out to other products. AI metadata expanded.</p>
                  <p><strong>Q4 2026:</strong> Other team adoption. Full AI consumption patterns published. Design system positioned as strategic asset.</p>
                  <p><strong>2027:</strong> Governance matured. Contribution process active. Central team potentially formalized.</p>
                </div>
              </Expandable>
            </div>
          )}
        </section>

        {/* ─── Footer ─── */}
        <div className="text-center py-8 border-t border-gray-200">
          <p className="text-xs text-gray-400">Design System V2 Project Hub · Last updated March 26, 2026 · Brenna Stevens, NielsenIQ</p>
          <p className="text-xs text-gray-300 mt-1">Toggle {teamView ? "Exec" : "Team"} View using the button in the header for {teamView ? "the quick overview" : "full project detail"}</p>
        </div>
      </div>
    </div>
  );
}
