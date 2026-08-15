import { ProductViewer } from '../../widgets/productViewer';

export default function ShowcasePage() {
  return (
    <div className="page-showcase text-ink overflow-x-hidden relative bg-bg">
      {/* Decorative Sand Circle Background */}
      <div className="fixed top-1/2 right-[-10%] md:right-[5%] -translate-y-1/2 w-[600px] h-[600px] md:w-[900px] md:h-[900px] bg-sand rounded-full z-0 pointer-events-none"></div>

      {/* Header */}
      <header className="fixed top-0 left-0 w-full px-sp-4 md:px-sp-6 py-sp-3 md:py-sp-4 z-50 flex justify-between items-center pointer-events-none border-b-[3px] border-ink bg-bg">
        <h1 className="font-oswald font-black text-2xl md:text-3xl uppercase tracking-wider pointer-events-auto text-ink">
          MS
        </h1>
        <span className="font-oswald font-bold uppercase tracking-widest pointer-events-auto text-bg-panel bg-terracotta px-3 py-1 text-xs md:text-sm border-[2px] border-terracotta shadow-sm">
          Portfolio '26
        </span>
      </header>

      {/* 3D Brain Background */}
      <ProductViewer />

      {/* Scrollable Content Layers — 7 sections × 100vh = 700vh total scroll */}
      <main className="relative z-30 pointer-events-none">
        {/* 1. Hero Section */}
        <section id="section-hero" className="h-screen flex items-end p-sp-4 md:p-sp-8 pb-24 md:pb-32">
          <div className="pointer-events-auto">
            <p className="font-oswald text-terracotta-dark font-bold tracking-[0.15em] uppercase text-sm mb-2">
              Hello, I'm
            </p>
            <h2 className="heading-brutal text-6xl md:text-8xl text-ink mb-sp-3 md:mb-sp-4">
              Mukul<br />
              <span className="text-terracotta">Sharma</span>
            </h2>
            <div className="bg-bg-panel border-[3px] border-ink rounded-sm p-sp-4 md:p-sp-5 max-w-[300px] md:max-w-sm shadow-hard">
              <p className="text-sm md:text-base text-ink-soft leading-relaxed font-medium">
                Creative developer. Scroll to explore the regions of my brain —
                each one maps to a real skill.
              </p>
              <p className="text-sm text-terracotta mt-sp-3 font-bold border-b-[2px] border-terracotta inline-block pb-0.5">
                Click any brain region to learn more ↗
              </p>
            </div>
            {/* Tags per mockup */}
            <div className="flex gap-2 mt-4 flex-wrap">
              <span className="border-[2px] border-ink bg-bg-panel text-ink px-3 py-1 font-bold text-xs uppercase tracking-wide">React Three Fiber</span>
              <span className="bg-olive text-bg-panel px-3 py-1 font-bold text-xs uppercase tracking-wide border-[2px] border-olive">GSAP</span>
              <span className="border-[2px] border-ink bg-bg-panel text-ink px-3 py-1 font-bold text-xs uppercase tracking-wide">System Design</span>
            </div>
          </div>
        </section>

        {/* 2. Prefrontal Cortex — Planning & Logic */}
        <section id="section-prefrontal" className="h-screen flex items-center justify-end p-sp-4 md:p-sp-8">
          <div className="pointer-events-auto text-right">
            <p className="font-oswald text-terracotta-dark font-bold tracking-[0.15em] uppercase text-sm mb-2">
              Prefrontal Cortex
            </p>
            <h2 className="heading-brutal text-5xl md:text-7xl text-ink mb-sp-3 md:mb-sp-4">
              System<br />Architect
            </h2>
            <div className="bg-bg-panel border-[3px] border-ink rounded-sm p-sp-4 md:p-sp-5 max-w-[280px] md:max-w-sm ml-auto shadow-hard">
              <p className="text-sm md:text-base text-ink-soft font-medium leading-relaxed">
                The part of the brain responsible for planning and complex
                reasoning. I use it to design scalable systems and make
                critical technical decisions.
              </p>
            </div>
          </div>
        </section>

        {/* 3. Parietal Lobe — Technical Engineering */}
        <section id="section-parietal" className="h-screen flex items-center p-sp-4 md:p-sp-8">
          <div className="pointer-events-auto">
            <p className="font-oswald text-terracotta-dark font-bold tracking-[0.15em] uppercase text-sm mb-2">
              Parietal Lobe
            </p>
            <h2 className="heading-brutal text-5xl md:text-7xl text-ink mb-sp-3 md:mb-sp-4">
              Technical<br />Engineer
            </h2>
            <div className="bg-bg-panel border-[3px] border-ink rounded-sm p-sp-4 md:p-sp-5 max-w-[280px] md:max-w-sm shadow-hard">
              <p className="text-sm md:text-base text-ink-soft font-medium leading-relaxed">
                Spatial reasoning and mathematical logic live here.
                React, Three.js, WebGL, GSAP — deep fluency across the
                entire modern web stack.
              </p>
            </div>
          </div>
        </section>

        {/* 4. Occipital Lobe — Design & Visual Craft */}
        <section id="section-occipital" className="h-screen flex items-center justify-end p-sp-4 md:p-sp-8">
          <div className="pointer-events-auto text-right">
            <p className="font-oswald text-terracotta-dark font-bold tracking-[0.15em] uppercase text-sm mb-2">
              Occipital Lobe
            </p>
            <h2 className="heading-brutal text-5xl md:text-7xl text-ink mb-sp-3 md:mb-sp-4">
              Design<br />&amp; Craft
            </h2>
            <div className="bg-bg-panel border-[3px] border-ink rounded-sm p-sp-4 md:p-sp-5 max-w-[280px] md:max-w-sm ml-auto shadow-hard">
              <p className="text-sm md:text-base text-ink-soft font-medium leading-relaxed">
                Where visual processing and pattern recognition happen.
                I channel it into UI/UX, micro-animations, and
                pixel-perfect interfaces.
              </p>
            </div>
          </div>
        </section>

        {/* 5. Temporal Lobe — Communication & Learning */}
        <section id="section-temporal" className="h-screen flex items-center p-sp-4 md:p-sp-8">
          <div className="pointer-events-auto">
            <p className="font-oswald text-terracotta-dark font-bold tracking-[0.15em] uppercase text-sm mb-2">
              Temporal Lobe
            </p>
            <h2 className="heading-brutal text-5xl md:text-7xl text-ink mb-sp-3 md:mb-sp-4">
              Comm<br />&amp; Learn
            </h2>
            <div className="bg-bg-panel border-[3px] border-ink rounded-sm p-sp-4 md:p-sp-5 max-w-[280px] md:max-w-sm shadow-hard">
              <p className="text-sm md:text-base text-ink-soft font-medium leading-relaxed">
                Memory and language processing. I leverage it for
                technical writing, cross-team collaboration, and
                rapidly absorbing new technologies.
              </p>
            </div>
          </div>
        </section>

        {/* 6. Cerebellum — Attention to Detail */}
        <section id="section-cerebellum" className="h-screen flex items-center justify-end p-sp-4 md:p-sp-8">
          <div className="pointer-events-auto text-right">
            <p className="font-oswald text-terracotta-dark font-bold tracking-[0.15em] uppercase text-sm mb-2">
              Cerebellum
            </p>
            <h2 className="heading-brutal text-5xl md:text-7xl text-ink mb-sp-3 md:mb-sp-4">
              Precision<br />&amp; Detail
            </h2>
            <div className="bg-bg-panel border-[3px] border-ink rounded-sm p-sp-4 md:p-sp-5 max-w-[280px] md:max-w-sm ml-auto shadow-hard">
              <p className="text-sm md:text-base text-ink-soft font-medium leading-relaxed">
                Fine motor control and precision. The part that drives
                code quality, systematic debugging, and performance
                optimization — the last 5% that matters.
              </p>
            </div>
          </div>
        </section>

        {/* 7. Contact CTA */}
        <section id="section-contact" className="h-screen flex items-end p-sp-4 md:p-sp-8 pb-24 md:pb-32">
          <div className="pointer-events-auto">
            <p className="font-oswald text-terracotta-dark font-bold tracking-[0.15em] uppercase text-sm mb-2">
              Interested?
            </p>
            <h2 className="heading-brutal text-5xl md:text-7xl text-ink mb-sp-3 md:mb-sp-4">
              Let's<br />Create
            </h2>
            <div className="bg-bg-panel border-[3px] border-ink rounded-sm p-sp-4 md:p-sp-5 max-w-[280px] md:max-w-sm shadow-hard">
              <p className="text-sm md:text-base text-ink-soft font-medium leading-relaxed mb-sp-3">
                Always open to exciting projects and collaborations.
              </p>
              <a
                href="https://github.com/sharma23Mukul"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-oswald tracking-[0.1em] uppercase text-terracotta border-[3px] border-terracotta px-5 py-2.5 hover:bg-terracotta hover:text-bg-panel hover:shadow-[4px_4px_0_var(--color-terracotta)] transition-all font-bold text-sm"
              >
                View GitHub →
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
