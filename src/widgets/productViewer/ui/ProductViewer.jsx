import { ModelViewer } from '../../../features/modelLoader';
import { ScrollCamera } from '../../../features/scrollCamera';

export function ProductViewer() {
  return (
    <section className="fixed top-0 left-0 w-full h-screen -z-10 pointer-events-none">
      <ModelViewer url="/models/Duck.glb" enableControls={false}>
        <ScrollCamera />
      </ModelViewer>
    </section>
  );
}
