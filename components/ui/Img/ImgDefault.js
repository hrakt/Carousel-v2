import React from 'react';
import PropTypes from 'prop-types';

import './Img.scss';

const ImgDefault = ({ fit, ...props }) => {
    if (fit) {
        return (
            <div
                style={{
                    backgroundImage: `url(${props.src})`,
                    backgroundSize: fit,
                }}
                title={props.alt}
                className={props.className}
            />
        );
    }

    return <img {...props} />;
};

ImgDefault.propTypes = {
    alt: PropTypes.string,
    fit: PropTypes.string,
    src: PropTypes.string.isRequired,
    className: PropTypes.string,
};

export default ImgDefault;
