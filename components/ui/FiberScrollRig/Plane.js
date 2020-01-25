import React, { useRef } from 'react';
import { useFrame } from 'react-three-fiber';
import lerp from 'lerp';
import PropTypes from 'prop-types';

import { useBlock } from './Blocks';

import config from './config';
import './CustomMaterial';

function Plane({ color = 'white', map, ...props }) {
    const { viewportHeight, offsetFactor } = useBlock();
    const material = useRef();
    let last = config.top.current;

    useFrame(() => {
        const { blocks, top } = config;
        material.current.scale = lerp(
            material.current.scale,
            offsetFactor - top.current / ((blocks.length - 1) * viewportHeight),
            0.1
        );
        material.current.shift = lerp(
            material.current.shift,
            (top.current - last) / 150,
            0.1
        );
        last = top.current;
    });

    return (
        <mesh {...props}>
            <planeBufferGeometry attach="geometry" args={[1, 1, 32, 32]} />
            <customMaterial
                ref={material}
                attach="material"
                color={color}
                map={map}
            />
        </mesh>
    );
}

Plane.propTypes = {
    color: PropTypes.string,
    map: PropTypes.object,
};

export default Plane;
