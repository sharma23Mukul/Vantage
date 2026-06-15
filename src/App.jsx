import AppShell from './app';

function App() {
  return (
    <AppShell>
      <main className="relative">
        <section className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-5xl font-bold tracking-tight mb-sp-3">
              Dimension
            </h1>
            <p className="text-text-secondary text-lg max-w-md mx-auto">
              Interactive 3D product showcase
            </p>
          </div>
        </section>
      </main>
    </AppShell>
  );
}

export default App;
