import React from 'react';
import PropTypes from 'prop-types';

import cx from 'classnames';

import Draggable from 'gsap/Draggable';
import TweenLite from 'gsap/TweenLite';
import TweenMax, { Linear } from 'gsap/TweenMax';
import ThrowPropsPlugin from 'utils/gsap/ThrowPropsPlugin';
import ModifiersPlugin from 'utils/gsap/ModifiersPlugin';

import styles from './CarouselInfiniteThrow.scss';

// eslint-disable-next-line
const pluginThrowProps = ThrowPropsPlugin;
// eslint-disable-next-line
const pluginModifiers = ModifiersPlugin;

class CarouselInfiniteThrow extends React.Component {
    state = {
        currentSlide: 0,
    };

    track = React.createRef();
    proxy = React.createRef();
    proxytrigger = React.createRef();

    slideWidth = 0;
    slideCount = 0;
    trackWidth = 0;
    slides = [];

    proxyTransform = 0;
    baseAnimation = null;
    slideToAnimation = null;
    timer = null;
    autoPanTimer = null;

    draggable = null;

    centerSplit = 0;

    componentDidMount() {
        this.slideCount = this.slides.length;

        this.slides.map((slide, i) => {
            TweenLite.set(slide, {
                xPercent: i * 100,
                width: `calc(100% / ${this.props.visibleSlideCount})`,
            });
        });

        // use this function to create a modifier the for xPercent animation
        const infiniteModifier = this.infiniteWrap(
            -100,
            (this.slideCount - 1) * 100
        );

        // the animation that moves the slides with the modifier that creates a loop.
        this.baseAnimation = TweenMax.to(this.slides, 1, {
            xPercent: '+=' + this.slideCount * 100,
            ease: Linear.easeNone,
            paused: true,
            repeat: -1,
            modifiers: {
                xPercent: infiniteModifier,
            },
        });

        TweenLite.set(this.proxy.current, { x: '+=0' });
        this.proxyTransform = this.proxy.current._gsTransform;
        this.slideToAnimation = TweenLite.to({}, 0.1, {});

        this.handleResize();

        if (this.props.center) {
            this.centerSplit = Math.round(this.props.visibleSlideCount / 2) - 1;
            TweenLite.set(this.proxy.current, {
                x: this.centerSplit * this.slideWidth,
            });
            this.animateSlides(0);
            this.slideToAnimation.progress(1);
        }

        this.setDraggable();

        if (this.props.autoPlay) {
            this.timer = TweenLite.delayedCall(
                this.props.autoPlayDelay,
                this.autoPlay
            );
        }

        if (this.props.autoPan) {
            this.autoPan();
        }

        window.addEventListener('resize', this.handleResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    setDraggable = () => {
        this.draggable = Draggable.create(this.proxy.current, {
            type: 'x',
            trigger: this.proxytrigger.current,
            onDrag: this.updateProgress,
            onThrowUpdate: this.updateProgress,
            onPress: this.updateDraggable,
            throwProps: true,
            zIndexBoost: false,
            snap: {
                x: this.props.snap ? this.snapX : null,
            },
        });
    };

    updateDraggable = () => {
        this.reset();
        this.draggable[0].update();
    };

    autoPanReset = () => {
        if (this.props.autoPan) {
            this.autoPanTimer && this.autoPanTimer.kill();
            this.autoPanTimer = TweenLite.delayedCall(
                this.props.autoPanResetTimer,
                this.autoPan
            );
        }
    };

    animateSlides = dir => {
        this.reset();

        const x = this.snapX(this.proxyTransform.x + dir * this.slideWidth);

        this.slideToAnimation = TweenLite.to(
            this.proxy.current,
            this.props.duration,
            {
                x: x,
                onUpdate: this.updateProgress,
            }
        );
    };

    autoPlay = () => {
        if (
            this.draggable[0].isPressed ||
            this.draggable[0].isDragging ||
            this.draggable[0].isThrowing
        ) {
            this.timer.restart(true);
        } else {
            this.animateSlides(-1);
        }
    };

    autoPan = () => {
        this.slideToAnimation = TweenMax.to(
            this.proxy.current,
            this.props.autoPanDuration,
            {
                ease: Linear.easeNone,
                x: this.props.autoPanReverse
                    ? this.proxyTransform.x + this.trackWidth
                    : this.proxyTransform.x - this.trackWidth,
                onUpdate: this.updateProgress,
                repeat: -1,
            }
        );
    };

    updateProgress = () => {
        this.determineCurrent();
        this.baseAnimation.progress(this.proxyTransform.x / this.trackWidth);
    };

    determineCurrent = () => {
        // guess current slide
        const trackPos =
            (this.proxyTransform.x % this.trackWidth) / this.slideWidth;
        let guessSlide = Math.abs(Math.round(trackPos - this.slideCount));

        // if greater than the total
        if (guessSlide > this.slideCount - 1) {
            guessSlide = guessSlide - this.slideCount;
        }

        // center is current
        if (this.props.center) {
            guessSlide = guessSlide + this.centerSplit;
        }

        if (guessSlide === this.slideCount) {
            guessSlide = 0;
        }

        if (guessSlide > this.slideCount) {
            guessSlide = Math.abs(guessSlide - this.slideCount);
        }

        if (guessSlide !== this.state.currentSlide) {
            this.setState({ currentSlide: guessSlide });
        }
    };

    handleResize = () => {
        const norm = this.proxyTransform.x / this.trackWidth || 0;

        this.slideWidth = this.track.current.firstChild.clientWidth;
        this.trackWidth = this.slideWidth * this.slideCount;

        TweenLite.set(this.proxy.current, {
            x: norm * this.trackWidth,
        });

        this.animateSlides(0);
        this.slideToAnimation.progress(1);
    };

    snapX = x => {
        return Math.round(x / this.slideWidth) * this.slideWidth;
    };

    // infinite wrapping function
    // at 0 last is -1, at last 0 is + 1
    infiniteWrap = (min, max) => {
        var r = max - min;
        return function(value) {
            var v = value - min;
            return ((r + (v % r)) % r) + min;
        };
    };

    renderSlide = (item, i) => {
        return (
            <div
                className={cx(styles.slide, {
                    [styles.currentSlide]: i === this.state.currentSlide,
                })}
                key={i}
                ref={el => (this.slides[i] = el)}
            >
                <div className={styles.outline}></div>
                {item.image && (
                    <div
                        className={styles.image}
                        style={{
                            backgroundImage: `url(${item.image})`,
                        }}
                    />
                )}
                <div className={styles.slideNumber}>{i}</div>
            </div>
        );
    };

    renderArrows = () => {
        return (
            <div className={styles.controls}>
                <div
                    className={styles.arrowButton}
                    onClick={() => {
                        this.animateSlides(1);
                    }}
                >
                    &lsaquo;
                </div>
                <div
                    className={styles.arrowButton}
                    onClick={() => {
                        this.animateSlides(-1);
                    }}
                >
                    &rsaquo;
                </div>
            </div>
        );
    };

    handleDotClick = e => {
        this.reset();

        const index = parseInt(e.currentTarget.getAttribute('data-index'), 10);
        const distance = index - this.state.currentSlide;

        const x = this.snapX(
            this.proxyTransform.x - distance * this.slideWidth
        );

        this.slideToAnimation = TweenLite.to(
            this.proxy.current,
            this.props.duration,
            {
                x: x,
                onUpdate: this.updateProgress,
            }
        );
    };

    reset = () => {
        this.props.autoPlay && this.timer.restart(true);
        this.autoPanReset();
        this.slideToAnimation.kill();
    };

    renderDots = () => {
        return (
            <div className={styles.controls}>
                {this.props.slidesData.map((item, i) => {
                    return (
                        <div
                            className={cx(styles.dot, {
                                [styles.currentDot]:
                                    this.state.currentSlide === i,
                            })}
                            key={i}
                            onClick={this.handleDotClick}
                            data-index={i}
                        >
                            <div className="sr-only">{i}</div>
                        </div>
                    );
                })}
            </div>
        );
    };

    renderCaptionAside = () => {
        return (
            <div className={styles.captionAside}>
                {this.props.slidesData.map((item, i) => {
                    return (
                        <React.Fragment key={i}>
                            {item.caption && i === this.state.currentSlide && (
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

    render() {
        return (
            <div className={styles.container}>
                <div className={styles.proxytrigger} ref={this.proxytrigger}>
                    <div className={styles.track} ref={this.track}>
                        {this.props.slidesData.map((item, i) => {
                            return this.renderSlide(item, i);
                        })}
                    </div>
                </div>
                <div className={styles.proxy} ref={this.proxy}></div>
                {this.renderArrows()}
                {this.renderDots()}
                {this.renderCaptionAside()}
            </div>
        );
    }
}

CarouselInfiniteThrow.propTypes = {
    autoPlay: PropTypes.bool,
    autoPlayDelay: PropTypes.number,
    duration: PropTypes.number,
    autoPan: PropTypes.bool,
    autoPanDuration: PropTypes.number,
    autoPanResetTimer: PropTypes.number,
    autoPanReverse: PropTypes.bool,
    snap: PropTypes.bool,
    visibleSlideCount: PropTypes.number,
    center: PropTypes.bool,
    slidesData: PropTypes.arrayOf(PropTypes.object),
};

CarouselInfiniteThrow.defaultProps = {
    autoPlay: false,
    autoPlayDelay: 2,
    duration: 0.5,
    autoPan: false,
    autoPanDuration: 20,
    autoPanResetTimer: 2,
    autoPanReverse: false,
    snap: true,
    visibleSlideCount: 1,
    center: false,
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

export default CarouselInfiniteThrow;
