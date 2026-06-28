import { ProductViewer } from '../../widgets/productViewer';

export default function ShowcasePage() {
  return (
    <div className='page-showcase text-text-primary overflow-x-hidden'>
      {/* Header */}
      <header className="fixed top-0 left-0 w-full px-sp-4 md:px-sp-6 py-sp-3 md:py-sp-4 z-50 flex justify-between items-center pointer-events-none">
        <h1 className="font-oswald font-black text-2xl md:text-3xl uppercase italic tracking-tighter pointer-events-auto text-text-primary">
          Dimension
        </h1>
        <span className="subheading-editorial pointer-events-auto text-text-secondary text-xs md:text-sm">
          3D Experience
        </span>
      </header>
      
      {/* 3D Background */}
      <ProductViewer />
      
      {/* Scrollable Content Layers */}
      <main className="relative z-30 pointer-events-none">
        {/* Hero Section */}
        <section className="h-screen flex items-end p-sp-4 md:p-sp-8 pb-24 md:pb-32">
          <div className="pointer-events-auto">
            <p className="subheading-editorial text-accent mb-sp-2 md:mb-sp-3">Featured Product</p>
            <h2 className="heading-brutal text-6xl md:text-8xl text-text-primary mb-sp-3 md:mb-sp-4 -skew-y-2">
              The<br />Duck
            </h2>
            <div className="bg-white/40 backdrop-blur-md border border-white/20 rounded-2xl p-sp-4 md:p-sp-5 max-w-[280px] md:max-w-sm shadow-md">
              <p className="text-sm md:text-base text-text-secondary leading-relaxed">
                Scroll down to explore the features of this 3D masterpiece.
              </p>
            </div>
          </div>
        </section>
        
        {/* Feature Section */}
        <section className="h-screen flex items-center justify-end p-sp-4 md:p-sp-8">
          <div className="pointer-events-auto text-right">
            <p className="subheading-editorial text-accent-warm mb-sp-2 md:mb-sp-3">Form & Function</p>
            <h2 className="heading-brutal text-5xl md:text-7xl text-text-primary mb-sp-3 md:mb-sp-4 skew-y-1">
              Sleek<br />Design
            </h2>
            <div className="bg-white/40 backdrop-blur-md border border-white/20 rounded-2xl p-sp-4 md:p-sp-5 max-w-[280px] md:max-w-sm ml-auto shadow-md">
              <p className="text-sm md:text-base text-text-secondary leading-relaxed">
                Notice the aerodynamic shape and smooth curves, crafted for perfect buoyancy.
              </p>
            </div>
          </div>
        </section>

        {/* Color Section */}
        <section className="h-screen flex items-center p-sp-4 md:p-sp-8">
          <div className="pointer-events-auto">
            <p className="subheading-editorial text-accent mb-sp-2 md:mb-sp-3">Material</p>
            <h2 className="heading-brutal text-5xl md:text-7xl text-text-primary mb-sp-3 md:mb-sp-4 -skew-y-1">
              Classic<br />Yellow
            </h2>
            <div className="bg-white/40 backdrop-blur-md border border-white/20 rounded-2xl p-sp-4 md:p-sp-5 max-w-[280px] md:max-w-sm shadow-md">
              <p className="text-sm md:text-base text-text-secondary leading-relaxed">
                A timeless aesthetic that brings joy to any bathtub environment.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
