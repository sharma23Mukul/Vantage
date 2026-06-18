import { ProductViewer } from '../../widgets/productViewer';

export default function ShowcasePage() {
  return (
    <div className='page-showcase bg-void min-h-screen text-text-primary'>
      <header className="absolute top-0 left-0 w-full p-sp-6 z-10 flex justify-between items-center pointer-events-none">
        <h1 className="text-2xl font-bold font-syne pointer-events-auto">Dimension</h1>
      </header>
      <main>
        <ProductViewer />
      </main>
    </div>
  );
}
