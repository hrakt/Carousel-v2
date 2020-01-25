import React, { useRef } from 'react';
import lerp from 'lerp';

import { useFrame } from 'react-three-fiber';

const Intro = () => {
    const ref = useRef();
    useFrame(
        () =>
            (ref.current.material.opacity = lerp(
                ref.current.material.opacity,
                0,
                0.025
            ))
    );
    return (
        <mesh ref={ref} position={[0, 0, 200]} scale={[100, 100, 1]}>
            <planeBufferGeometry attach="geometry" />
            <meshBasicMaterial attach="material" color="#000" transparent />
        </mesh>
    );
};

export default Intro;
