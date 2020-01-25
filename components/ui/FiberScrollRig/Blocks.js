import React, { createContext, useRef, useContext } from 'react';
import PropTypes from 'prop-types';

import { useFrame, useThree } from 'react-three-fiber';
import lerp from 'lerp';

import config from './config';

const OffsetContext = createContext(0);

const Block = ({ children, offset, factor, ...props }) => {
    const { offset: parentOffset, sectionHeight } = useBlock();
    const ref = useRef();
    offset = offset !== undefined ? offset : parentOffset;
    useFrame(() => {
        const curY = ref.current.position.y;
        const curTop = config.top.current;
        ref.current.position.y = lerp(
            curY,
            (curTop / config.zoom) * factor,
            0.1
        );
    });
    return (
        <OffsetContext.Provider value={offset}>
            <group
                {...props}
                position={[0, -sectionHeight * offset * factor, 0]}
            >
                <group ref={ref}>{children}</group>
            </group>
        </OffsetContext.Provider>
    );
};

Block.propTypes = {
    children: PropTypes.node,
    offset: PropTypes.number,
    factor: PropTypes.number,
};

const useBlock = () => {
    const { sections, pages, zoom } = config;
    const { size, viewport } = useThree();
    // console.log('useThree:', size, viewport);
    const offset = useContext(OffsetContext);
    const viewportWidth = viewport.width;
    const viewportHeight = viewport.height;
    const canvasWidth = viewportWidth / zoom;
    const canvasHeight = viewportHeight / zoom;
    const mobile = size.width < 700;
    const margin = canvasWidth * (mobile ? 0.2 : 0.1);
    const contentMaxWidth = canvasWidth * (mobile ? 0.8 : 0.6);
    const sectionHeight = canvasHeight * ((pages - 1) / (sections - 1));
    const offsetFactor = (offset + 1.0) / sections;
    return {
        viewport,
        offset,
        viewportWidth,
        viewportHeight,
        canvasWidth,
        canvasHeight,
        mobile,
        margin,
        contentMaxWidth,
        sectionHeight,
        offsetFactor,
    };
};

export { Block, useBlock };
