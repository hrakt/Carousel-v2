import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useFrame } from 'react-three-fiber';
import { Color } from 'three';
import PropTypes from 'prop-types';

import GradientMaterial from './shaders/GradientMaterial';

const BoxGradient = props => {
    // This reference will give us direct access to the mesh
    const mesh = useRef();

    // Set up state for the hovered and active state
    const [hovered, setHover] = useState(false);
    const [active, setActive] = useState(false);

    // Rotate mesh every frame, this is outside of React without overhead
    useFrame(() => (mesh.current.rotation.x = mesh.current.rotation.y += 0.01));

    const [gradientMaterial] = useMemo(() => {
        const colorA = props.colorA;
        const colorB = props.colorB;

        const gradientMaterial = new GradientMaterial({
            colorA: colorA,
            colorB: colorB,
        });
        return [gradientMaterial];
    }, []);

    useEffect(() => {
        mesh.current.material = gradientMaterial;
    }, []);

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
            <meshStandardMaterial attach="material" />
        </mesh>
    );
};

BoxGradient.propTypes = {
    colorA: PropTypes.object,
    colorB: PropTypes.object,
};

BoxGradient.defaultProps = {
    colorA: new Color(0x74ebd5),
    colorB: new Color(0xacb6e5),
};

export default BoxGradient;
