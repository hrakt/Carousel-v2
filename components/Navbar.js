import React from 'react';
import PropTypes from 'prop-types';
import styles from './Navbar.module.scss';
import cx from 'classnames';

import { overlayPics } from './mockImgs';

const Navbar = ({
    currentSlide,
    setCurrentSlide,
    setIsAnimating,
    setShifting,
}) => {
    const handleSwitch = index => {
        setCurrentSlide(index);
        setIsAnimating(true);
        setShifting(true);
    };

    currentSlide < 0
        ? (currentSlide = overlayPics.length + currentSlide)
        : null;
    return (
        <div className={styles.mainContainer}>
            {overlayPics.map((item, index) => (
                <div
                    key={index}
                    onClick={() => handleSwitch(index)}
                    className={cx(styles.tick, {
                        [styles.tick__selected]: currentSlide === index,
                    })}
                />
            ))}
        </div>
    );
};

Navbar.propTypes = {
    currentSlide: PropTypes.number,
    setCurrentSlide: PropTypes.func,
    setIsAnimating: PropTypes.func,
    setShifting: PropTypes.func,
};

export default Navbar;
