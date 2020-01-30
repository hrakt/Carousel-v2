import React from 'react';
import PropTypes from 'prop-types';

import styles from './Slider.module.scss';

const Slider = ({ next, previous, isAnimating, handleClick }) => {
    return (
        <div className={styles.sliderContainer}>
            {previous && (
                <div
                    className={styles.previous}
                    onClick={() => [!isAnimating && handleClick(-1)]}
                >
                    &#10094;
                </div>
            )}
            {next && (
                <div
                    className={styles.next}
                    onClick={() => [!isAnimating && handleClick(1)]}
                >
                    &#10095;
                </div>
            )}
        </div>
    );
};

Slider.propTypes = {
    next: PropTypes.bool,
    previous: PropTypes.bool,
    isAnimating: PropTypes.bool,
    handleClick: PropTypes.func,
};

export default Slider;
