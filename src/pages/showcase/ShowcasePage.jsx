import { ProductViewer } from '../../widgets/productViewer';

export default function ShowcasePage() {
  return (
    <div className='page-showcase bg-void text-text-primary overflow-x-hidden'>
      <header className="fixed top-0 left-0 w-full p-sp-6 z-10 flex justify-between items-center pointer-events-none">
        <h1 className="text-2xl font-bold font-syne pointer-events-auto text-accent">Dimension</h1>
      </header>
      
      {/* 3D Background */}
      <ProductViewer />
      
      {/* Scrollable Content Layers */}
      <main className="relative z-0">
        <section className="h-screen flex items-center p-sp-8">
          <div className="max-w-md">
            <h2 className="text-5xl font-syne font-bold mb-sp-4 text-accent">The Duck</h2>
            <p className="text-lg text-text-secondary">Scroll down to explore the features of this 3D masterpiece.</p>
          </div>
        </section>
        
        <section className="h-screen flex items-center justify-end p-sp-8">
          <div className="max-w-md text-right">
            <h2 className="text-4xl font-syne font-bold mb-sp-4">Sleek Design</h2>
            <p className="text-lg text-text-secondary">Notice the aerodynamic shape and smooth curves, crafted for perfect buoyancy.</p>
          </div>
        </section>

        <section className="h-screen flex items-center p-sp-8">
          <div className="max-w-md">
            <h2 className="text-4xl font-syne font-bold mb-sp-4">Classic Yellow</h2>
            <p className="text-lg text-text-secondary">A timeless aesthetic that brings joy to any bathtub environment.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
