import React from 'react';
import styles from './Navbar.module.scss';
import cx from 'classnames';

import { overlayPics } from './mockImgs';

const Navbar = ({
    currentSlide,
    slideArr,
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

export default Navbar;
