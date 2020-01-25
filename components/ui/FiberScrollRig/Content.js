import React from 'react';
import PropTypes from 'prop-types';
import { useBlock } from './Blocks';

import Plane from './Plane';

const Content = ({ children, image, aspectRatio }) => {
    const { contentMaxWidth } = useBlock();

    return (
        <group position={[0, 0, 0]}>
            <Plane
                scale={[contentMaxWidth, contentMaxWidth / aspectRatio, 1]}
                color="#bfe2ca"
                map={image}
            />
            {children}
        </group>
    );
};
Content.propTypes = {
    children: PropTypes.node,
    image: PropTypes.object,
    aspectRatio: PropTypes.number,
};
export default Content;
