import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Draggable from 'gsap/Draggable';
import TweenLite, { Power1 } from 'gsap/TweenLite';
import ThrowPropsPlugin from 'utils/gsap/ThrowPropsPlugin';

import useResize from 'hooks/useResize';

import styles from './CarouselInfiniteSimple.scss';

// eslint-disable-next-line
const plugin = ThrowPropsPlugin;

const CarouselInfiniteSimple = props => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const container = useRef(null);
    const track = useRef(null);
    const proxy = useRef(null);
    const proxytrigger = useRef(null);

    let slideWidth = 0;
    let slideCount = 0;
    let trackWidth = 0;

    let draggable = null;

    useEffect(() => {
        slideWidth = track.current.firstChild.clientWidth;
        slideCount = track.current.children.length / 2;
        trackWidth = slideWidth * slideCount;
        setDraggable();
    }, []);

    useResize(() => {
        setDraggable();
    });

    const setDraggable = () => {
        if (!track.current) {
            return;
        }

        draggable = Draggable.create(proxy.current, {
            type: 'x',
            trigger: proxytrigger.current,
            onDrag: onDrag,
            onThrowUpdate: onDrag,
            throwProps: true,
            zIndexBoost: false,
            snap: {
                x: function(endValue) {
                    return Math.round(endValue / slideWidth) * slideWidth;
                },
            },
        });
    };

    const determineCurrent = () => {
        // guess current slide
        const trackPos = track.current._gsTransform.x / slideWidth;
        let guessSlide = Math.abs(Math.round(trackPos));

        // at the loop guess the 0 or last slide
        if (
            guessSlide - 1 < slideCount &&
            Math.round(guessSlide - 1 + 0.5) >= slideCount
        ) {
            guessSlide = 0;
        }

        setCurrentSlide(guessSlide);
    };

    const onDrag = () => {
        let destX = proxy.current._gsTransform.x % trackWidth;

        if (destX > 0) {
            destX = destX - trackWidth;
        }

        TweenLite.set(track.current, {
            x: destX,
            ease: Power1.easeOut,
        });

        determineCurrent();
    };

    const renderSlide = (item, i) => {
        return (
            <div className={styles.slide} key={i}>
                {item.image && (
                    <div
                        className={styles.image}
                        style={{
                            backgroundImage: `url(${item.image})`,
                        }}
                    />
                )}
                {item.caption && (
                    <div className={styles.caption}>{item.caption}</div>
                )}
                <div className={styles.slideNumber}>{i}</div>
            </div>
        );
    };

    const renderCaptionAside = () => {
        return (
            <div className={styles.captionAside}>
                {props.slidesData.map((item, i) => {
                    return (
                        <React.Fragment key={i}>
                            {item.caption && i === currentSlide && (
                                <div className={styles.captionAsideInner}>
                                    {i}: {item.caption}
                                </div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        );
    };

    return (
        <div className={styles.container} ref={container}>
            <div className={styles.proxytrigger} ref={proxytrigger}>
                <div className={styles.track} ref={track}>
                    {props.slidesData.map((item, i) => {
                        return renderSlide(item, i);
                    })}
                    {/* Render Clone */}
                    {props.slidesData.map((item, i) => {
                        return renderSlide(item, i);
                    })}
                </div>
                <div className={styles.proxy} ref={proxy}></div>
            </div>
            {renderCaptionAside()}
        </div>
    );
};

CarouselInfiniteSimple.propTypes = {
    slidesData: PropTypes.arrayOf(PropTypes.object),
};

CarouselInfiniteSimple.defaultProps = {
    slidesData: [
        {
            caption:
                "I'm sorry Summer, your opinion means very little to me. Don't be trippin dog we got you. Aw, geez. Nice, Mrs Pancakes. Real nice.",
            image: 'https://www.placecage.com/500/400',
        },
        {
            caption:
                "Your failures are your own, old man! I say, follow throooough! Ooh, your little flappy doodles are twitching. Does that mean you're aroused, or did you just get a signal that one of your buddies found a grape? Then let me GET to know you! Don't even trip about your pants, dawg. We got an extra pair right here.",
            image: 'https://www.placecage.com/c/500/400',
        },
        {
            caption:
                "Thanks Noob Noob, this guy gets it. Summer, next time we're hiding in a chlorkian echo nest, can you do me a favour and turn your ringer off?! Are these pills supposed to wake me up or something? I just wanna die!",
            image: 'https://www.placecage.com/g/500/400',
        },
        {
            caption:
                "We're gonna nine eleven this bitch unless Morty gets better math grades! Dont mind those stare goblins. It's called carpe diem Morty. Look it up. Morty! The principal and I have discussed it, a-a-and we're both insecure enough to agree to a three-way!",
            image: 'https://www.placecage.com/gif/500/400',
        },
        {
            caption:
                "Awww, it's you guys! Your failures are your own, old man! I say, follow throooough! It's a figure of speech, Morty! They're bureaucrats! I don't respect them. Just keep shooting, Morty! You have no idea what prison is like here! And that's why I always say 'Shumshumschilpiddydah!'",
            image: 'https://www.placecage.com/500/400',
        },
        {
            caption:
                "Let’s be post-apocalyptic scavengerrrrsss! They're not infinite universes left in sync with the show. Nice one, Ms Pancakes. You have to turn them on Morty! The shoes need to be turned on!",
            image: 'https://www.placecage.com/c/500/400',
        },
        {
            caption:
                "Wow, so your origin is what? You fell into a vat of redundancy? I'm a bit of a stickler Meeseeks, what about your short game? Awww, it's you guys! They're not infinite universes left in sync with the show.",
            image: 'https://www.placecage.com/g/500/400',
        },
        {
            caption:
                " Snuffles want to be understood. Snuffles need to be understood. Your failures are your own, old man! I say, follow throooough! Meeseeks don't usually have to exist for this long. It's gettin' weeeiiird.",
            image: 'https://www.placecage.com/gif/500/400',
        },
    ],
};

export default CarouselInfiniteSimple;
