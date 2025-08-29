import { WaterPass, UnrealBloomPass, FilmPass, LUTPass } from 'three-stdlib';
import { Object3DNode } from '@react-three/fiber';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      waterPass: Object3DNode<WaterPass, typeof WaterPass>;
      unrealBloomPass: Object3DNode<UnrealBloomPass, typeof UnrealBloomPass>;
      filmPass: Object3DNode<FilmPass, typeof FilmPass>;
      lUTPass: Object3DNode<LUTPass, typeof LUTPass>;
    }
  }
}
