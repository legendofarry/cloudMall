import { useFBX, useAnimations } from "@react-three/drei";
import { useEffect, useRef } from "react";

export default function VoodooModel(props) {
  const group = useRef();

  // ✅ IMPORTANT: NO /public in the path
  const model = useFBX("/AmongUs.fbx");

  const { animations } = model;
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (!actions || animations.length === 0) return;

    const action = actions[animations[0].name];
    action.reset().play();

    return () => action.stop();
  }, [actions, animations]);

  return (
    <primitive
      ref={group}
      object={model}
      scale={0.01}
      position={[0, -1, 0]}
      {...props}
    />
  );
}
