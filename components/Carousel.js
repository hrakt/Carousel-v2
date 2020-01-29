import React, { useState, useEffect } from 'react';
import styles from './Carousel.module.scss';
import Slider from './Slider';
import Navbar from './Navbar';
import cx from 'classnames';

import { overlayPics } from './mockImgs';

const Carousel = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [direction, setDirection] = useState(null);
    const [shifting, setShifting] = useState(false);
    const [slideLength, setSlideLength] = useState(null);
    const [isAnimating, setIsAnimating] = useState(false);

    const track = React.createRef();

    const slideArr = [0, 1, 2, 3, 4, 5];
    const upperLimit = slideArr.length - 1;

    useEffect(() => {
        const node = track.current;
        const style = window.getComputedStyle(node);
        const childrenCount = node.children.length;
        const trackLength = Number(style.width.replace('px', ''));
        setSlideLength(trackLength / childrenCount);
    });

    useEffect(() => {
        document.addEventListener('keydown', handleArrows, false);

        return () => {
            document.removeEventListener('keydown', handleArrows, false);
        };
    });

    const handleArrows = event => {
        if (!isAnimating) {
            if (event.keyCode === 39) {
                handleClick(1);
            } else if (event.keyCode === 37) {
                handleClick(-1);
            }
        }
    };

    const handleClick = direction => {
        setIsAnimating(true);
        let newSlideNumber = currentSlide + direction;
        setShifting(true);

        setCurrentSlide(newSlideNumber);
        setDirection(direction);
    };

    const resetSlide = () => {
        console.log(currentSlide, 'currentslide');
        console.log(upperLimit, 'upperLimit');
        setIsAnimating(false);
        if (currentSlide === upperLimit + 1) {
            setShifting(false);
            setCurrentSlide(0);
        }
        if (currentSlide === -upperLimit - 1) {
            setShifting(false);
            setCurrentSlide(0);
        }
    };

    const cloneSlides = () => {
        let children = [];
        overlayPics.map((item, index) => {
            // console.log(item.file.url);

            children.push(
                <div
                    key={index}
                    className={styles.box}
                    style={{
                        backgroundImage: `url(${item.file.url})`,
                    }}
                />
            );
        });

        return children;
    };

    const className = cx(styles.track, {
        [styles.shifting]: shifting,
    });

    return (
        <div className={styles.mainContainer}>
            <div>
                <div>CurrentSlide:{currentSlide}</div>
                <div>Direction:{direction}</div>
            </div>
            <div className={styles.bottomContainer}>
                <Slider {...{ handleClick, isAnimating }} previous />
                <div className={styles.bigContainer}>
                    <div
                        className={className}
                        style={{
                            transform: `translateX(${(currentSlide +
                                upperLimit +
                                1) *
                                -slideLength}px)`,
                        }}
                        ref={track}
                        onTransitionEnd={resetSlide}
                    >
                        {cloneSlides()}
                        {overlayPics.map((item, index) => {
                            console.log(item.file.url);
                            return (
                                <div
                                    key={index}
                                    className={styles.box}
                                    style={{
                                        backgroundImage: `url(${item.file.url})`,
                                    }}
                                />
                            );
                        })}
                        {cloneSlides()}
                    </div>
                </div>
                <Slider {...{ handleClick, isAnimating }} next />
            </div>
            <Navbar
                {...{
                    currentSlide,
                    slideArr,
                    setCurrentSlide,
                    setIsAnimating,
                    setShifting,
                }}
            />
        </div>
    );
};

export default Carousel;
