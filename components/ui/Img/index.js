// @flow
import React from 'react';
import PropTypes from 'prop-types';

import ImgDefault from './ImgDefault';
import ImgPreload from './ImgPreload';

const Img = ({ preload, ...props }) => {
    return preload ? <ImgPreload {...props} /> : <ImgDefault {...props} />;
};

Img.propTypes = {
    alt: PropTypes.string,
    fit: PropTypes.string,
    preload: PropTypes.bool,
    src: PropTypes.string,
};

Img.defaultProps = {
    alt: '',
    fit: null,
    preload: false,
    src: '',
};

export default Img;
