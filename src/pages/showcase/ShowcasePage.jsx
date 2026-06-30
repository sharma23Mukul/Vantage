import { ProductViewer } from '../../widgets/productViewer';

export default function ShowcasePage() {
  return (
    <div className="page-showcase text-text-primary overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full px-sp-4 md:px-sp-6 py-sp-3 md:py-sp-4 z-50 flex justify-between items-center pointer-events-none">
        <h1 className="font-oswald font-black text-2xl md:text-3xl uppercase italic tracking-tighter pointer-events-auto text-text-primary">
          MKL
        </h1>
        <span className="subheading-editorial pointer-events-auto text-text-secondary text-xs md:text-sm">
          Portfolio '25
        </span>
      </header>

      {/* 3D Brain Background */}
      <ProductViewer />

      {/* Scrollable Content Layers — 7 sections × 100vh = 700vh total scroll */}
      <main className="relative z-30 pointer-events-none">
        {/* 1. Hero Section */}
        <section id="section-hero" className="h-screen flex items-end p-sp-4 md:p-sp-8 pb-24 md:pb-32">
          <div className="pointer-events-auto">
            <p className="subheading-editorial text-accent mb-sp-2 md:mb-sp-3">
              Hello, I'm
            </p>
            <h2 className="heading-brutal text-6xl md:text-8xl text-text-primary mb-sp-3 md:mb-sp-4 -skew-y-2">
              Mukul<br />Sharma
            </h2>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-sp-4 md:p-sp-5 max-w-[300px] md:max-w-sm shadow-md">
              <p className="text-sm md:text-base text-text-secondary leading-relaxed">
                Creative developer. Scroll to explore the regions of my brain —
                each one maps to a real skill.
              </p>
              <p className="text-xs text-accent mt-sp-2 font-medium">
                Click any brain region to learn more ↗
              </p>
            </div>
          </div>
        </section>

        {/* 2. Prefrontal Cortex — Planning & Logic */}
        <section id="section-prefrontal" className="h-screen flex items-center justify-end p-sp-4 md:p-sp-8">
          <div className="pointer-events-auto text-right">
            <p className="subheading-editorial text-accent mb-sp-2 md:mb-sp-3">
              Prefrontal Cortex
            </p>
            <h2 className="heading-brutal text-5xl md:text-7xl text-text-primary mb-sp-3 md:mb-sp-4 skew-y-1">
              System<br />Architect
            </h2>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-sp-4 md:p-sp-5 max-w-[280px] md:max-w-sm ml-auto shadow-md">
              <p className="text-sm md:text-base text-text-secondary leading-relaxed">
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
            <p className="subheading-editorial text-accent-warm mb-sp-2 md:mb-sp-3">
              Parietal Lobe
            </p>
            <h2 className="heading-brutal text-5xl md:text-7xl text-text-primary mb-sp-3 md:mb-sp-4 -skew-y-1">
              Technical<br />Engineer
            </h2>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-sp-4 md:p-sp-5 max-w-[280px] md:max-w-sm shadow-md">
              <p className="text-sm md:text-base text-text-secondary leading-relaxed">
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
            <p className="subheading-editorial text-accent mb-sp-2 md:mb-sp-3">
              Occipital Lobe
            </p>
            <h2 className="heading-brutal text-5xl md:text-7xl text-text-primary mb-sp-3 md:mb-sp-4 skew-y-1">
              Design<br />&amp; Craft
            </h2>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-sp-4 md:p-sp-5 max-w-[280px] md:max-w-sm ml-auto shadow-md">
              <p className="text-sm md:text-base text-text-secondary leading-relaxed">
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
            <p className="subheading-editorial text-accent-warm mb-sp-2 md:mb-sp-3">
              Temporal Lobe
            </p>
            <h2 className="heading-brutal text-5xl md:text-7xl text-text-primary mb-sp-3 md:mb-sp-4 -skew-y-2">
              Comm<br />&amp; Learn
            </h2>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-sp-4 md:p-sp-5 max-w-[280px] md:max-w-sm shadow-md">
              <p className="text-sm md:text-base text-text-secondary leading-relaxed">
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
            <p className="subheading-editorial text-accent mb-sp-2 md:mb-sp-3">
              Cerebellum
            </p>
            <h2 className="heading-brutal text-5xl md:text-7xl text-text-primary mb-sp-3 md:mb-sp-4 skew-y-1">
              Precision<br />&amp; Detail
            </h2>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-sp-4 md:p-sp-5 max-w-[280px] md:max-w-sm ml-auto shadow-md">
              <p className="text-sm md:text-base text-text-secondary leading-relaxed">
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
            <p className="subheading-editorial text-accent mb-sp-2 md:mb-sp-3">
              Interested?
            </p>
            <h2 className="heading-brutal text-5xl md:text-7xl text-text-primary mb-sp-3 md:mb-sp-4 -skew-y-1">
              Let's<br />Create
            </h2>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-sp-4 md:p-sp-5 max-w-[280px] md:max-w-sm shadow-md">
              <p className="text-sm md:text-base text-text-secondary leading-relaxed mb-sp-3">
                Always open to exciting projects and collaborations.
              </p>
              <a
                href="https://github.com/sharma23Mukul"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#4fc3f7] text-[#0a0a12] px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-accent/90 transition-colors shadow-sm"
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
