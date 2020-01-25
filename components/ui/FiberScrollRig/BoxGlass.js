import React, { useMemo, useRef, useState } from 'react';
import { useThree, useFrame } from 'react-three-fiber';
import { WebGLRenderTarget } from 'three';

import BackfaceMaterial from './shaders/BackfaceMaterial';
import RefractionMaterial from './shaders/RefractionMaterial';

const BoxGlass = props => {
    // This reference will give us direct access to the mesh
    const mesh = useRef();

    // Set up state for the hovered and active state
    const [hovered, setHover] = useState(false);
    const [active, setActive] = useState(false);

    // Rotate mesh every frame, this is outside of React without overhead
    useFrame(() => (mesh.current.rotation.x = mesh.current.rotation.y += 0.01));

    const { size, gl, scene, camera } = useThree();

    const ratio = gl.getPixelRatio();

    const [
        envFbo,
        backfaceFbo,
        backfaceMaterial,
        refractionMaterial,
    ] = useMemo(() => {
        const envFbo = new WebGLRenderTarget(
            size.width * ratio,
            size.height * ratio
        );
        const backfaceFbo = new WebGLRenderTarget(
            size.width * ratio,
            size.height * ratio
        );
        const backfaceMaterial = new BackfaceMaterial();
        const refractionMaterial = new RefractionMaterial({
            envMap: envFbo.texture,
            backfaceMap: backfaceFbo.texture,
            resolution: [size.width * ratio, size.height * ratio],
        });
        return [envFbo, backfaceFbo, backfaceMaterial, refractionMaterial];
    }, [size, ratio]);

    useFrame(() => {
        gl.autoClear = false;
        camera.layers.set(0);
        gl.setRenderTarget(envFbo);
        gl.clearColor();
        gl.render(scene, camera);
        gl.clearDepth();
        camera.layers.set(1);
        mesh.current.material = backfaceMaterial;
        gl.setRenderTarget(backfaceFbo);
        gl.clearDepth();
        gl.render(scene, camera);
        camera.layers.set(0);
        gl.setRenderTarget(null);
        gl.render(scene, camera);
        gl.clearDepth();
        camera.layers.set(1);
        mesh.current.material = refractionMaterial;
        gl.render(scene, camera);
    }, 1);

    return (
        <mesh
            {...props}
            ref={mesh}
            scale={active || hovered ? [1.5, 1.5, 1.5] : [1, 1, 1]}
            onClick={() => setActive(!active)}
            onPointerOver={() => setHover(true)}
            onPointerOut={() => setHover(false)}
        >
            <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
            {/* <meshStandardMaterial attach="material" /> */}
        </mesh>
    );
};

export default BoxGlass;
