import { ModelViewer } from '../../../features/modelLoader';

export function ProductViewer() {
  return (
    <section className="w-full h-screen">
      <ModelViewer url="/models/Duck.glb" />
    </section>
  );
}
