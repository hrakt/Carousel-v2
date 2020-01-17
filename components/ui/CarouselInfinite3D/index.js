import React from 'react';
import PropTypes from 'prop-types';

import Draggable from 'gsap/Draggable';
import TweenMax, { Back, Power1 } from 'gsap/TweenMax';
import ThrowPropsPlugin from 'utils/gsap/ThrowPropsPlugin';

import styles from './CarouselInfinite3D.scss';

// eslint-disable-next-line
const plugin = ThrowPropsPlugin;

class CarouselInfinite3D extends React.Component {
    wrapper = React.createRef();
    container = React.createRef();
    nullObject = React.createRef();

    slides = [];
    stage = null;

    slideCount = 0;
    slideWidth = 0;
    slideHeight = 0;

    currentSlide = null;
    initialSlideNumber = 0;

    componentDidMount() {
        this.stage = this.wrapper.current;
        this.initialSlideNumber = 0;

        TweenMax.set(this.nullObject.current, {
            position: 'absolute',
            x: 0,
        });

        this.setParams();

        window.removeEventListener('resize', this.handleResize);
    }

    setParams = () => {
        this.slideCount = this.props.slidesData.length;
        this.fullRotation = 360;
        this.rotationStep = this.fullRotation / this.slideCount;
        this.slideWidth = this.slides[0].offsetWidth;
        this.slideHeight = this.slides[0].offsetHeight;
        this.slideZOrigin = this.getZOrigin();

        this.createSlides();
        this.setDraggable(this.initialSlideNumber);
        this.onDrag();
    };

    handleResize = () => {
        this.setParams();
    };

    createSlides = () => {
        this.slides.map((item, i) => {
            TweenMax.set(item, {
                left: '50%',
                top: '40%',
                xPercent: -50,
                yPercent: -70,
                position: 'absolute',
                width: this.slideWidth,
                height: this.slideHeight,
                overflow: 'hidden',
                zIndex: -i,
                transformPerspective: this.props.perspective,
                transformOrigin: `50% 50% ${-this.slideZOrigin}px`,
                rotationY: i * this.rotationStep,
                z: 0,
            });
            item.initRotationX = 0;
            item.initRotationY = i * this.rotationStep;
        });
    };

    setDraggable = () => {
        Draggable.create(this.nullObject.current, {
            type: 'x',
            trigger: this.container.current,
            dragResistance: 0.97,
            throwResistance: 1000,
            maxDuration: 1,
            throwProps: true,
            onDrag: this.onDrag,
            onThrowUpdate: this.onDrag,
            onThrowComplete: this.onThrowComplete,
            ease: Back.easeOut.config(0.3),
            zIndexBoost: false,
            snap: {
                x: endValue => {
                    return (
                        Math.round(endValue / this.rotationStep) *
                        this.rotationStep
                    );
                },
            },
        });
    };

    onDrag = () => {
        var i = -1,
            destX,
            pagePos,
            destAlpha,
            destZIndex;

        destX = this.nullObject.current._gsTransform.x % this.fullRotation;

        while (++i < this.slideCount) {
            pagePos =
                (this.slides[i].initRotationY +
                    this.nullObject.current._gsTransform.x) /
                180;
            if (pagePos > 1) {
                pagePos = 2 - pagePos;
            }
            // if it's  < 0 start sending the value back up again 1, 0.9, 0.8, 0.7....0, 0.1, 0.2, 0.3, 0.4
            if (pagePos < 0) {
                pagePos = -pagePos;
            }

            destAlpha = 1 - pagePos;

            if (destAlpha < 0) {
                destAlpha = -destAlpha;
            }

            if (destAlpha > 1) {
                destAlpha = 2 - destAlpha;
            }

            destZIndex = Math.round(destAlpha * this.fullRotation);

            TweenMax.set(this.slides[i], {
                rotationY: this.slides[i].initRotationY + destX,
                ease: Power1.easeOut,
                zIndex: destZIndex,
                force3D: true,
            });
        }
    };

    onThrowComplete = () => {
        //in order to determine which item is at the front we calculate that based on the container's current rotationY divided by the rotationStep
        var itemId = -Math.round(
            this.nullObject.current._gsTransform.x / this.rotationStep
        );
        //if we've spun it in a negative rotationY (like -213) then normalise it up to a positive value
        itemId =
            itemId < 0 ? (itemId % this.slideCount) + this.slideCount : itemId;
        //if we've spun it and it lands at a value like 356 the itemId would be rounded up to 6 (but the pageContainerArray only contains items from 0-5)
        //so we normalise it down
        itemId =
            itemId > this.slideCount - 1 ? itemId % this.slideCount : itemId;

        this.currentSlide = this.slides[itemId];

        var posX = Math.round(Math.abs(this.nullObject.current._gsTransform.x));

        if (posX >= this.fullRotation) {
            TweenMax.set(this.nullObject.current, {
                x: this.fullRotation - itemId * this.rotationStep,
                onUpdate: this.onDrag,
            });
        }
    };

    getZOrigin = () => {
        var slideZOrigin = Math.round(
            this.slideWidth /
                2 /
                Math.tan(this.degreesToRadians(this.rotationStep / 2))
        );
        return slideZOrigin;
    };

    degreesToRadians = valDeg => {
        return ((2 * Math.PI) / this.fullRotation) * valDeg;
    };

    renderSlide = (item, i) => {
        return (
            <div
                className={styles.slide}
                ref={el => (this.slides[i] = el)}
                key={i}
            >
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

    render() {
        return (
            <div className={styles.wrapper} ref={this.wrapper}>
                <div className={styles.container} ref={this.container}>
                    {this.props.slidesData.map((item, i) => {
                        return this.renderSlide(item, i);
                    })}
                </div>
                <div ref={this.nullObject} />
            </div>
        );
    }
}

CarouselInfinite3D.propTypes = {
    slidesData: PropTypes.arrayOf(PropTypes.object),
    perspective: PropTypes.number,
};

CarouselInfinite3D.defaultProps = {
    slidesData: [
        {
            caption: 'text caption here',
            image: 'https://www.placecage.com/500/400',
        },
        {
            caption: 'text caption here',
            image: 'https://www.placecage.com/c/500/400',
        },
        {
            caption: 'text caption here',
            image: 'https://www.placecage.com/g/500/400',
        },
        {
            caption: 'text caption here',
            image: 'https://www.placecage.com/gif/500/400',
        },
        {
            caption: 'text caption here',
            image: 'https://www.placecage.com/500/400',
        },
        {
            caption: 'text caption here',
            image: 'https://www.placecage.com/c/500/400',
        },
        {
            caption: 'text caption here',
            image: 'https://www.placecage.com/g/500/400',
        },
        {
            caption: 'text caption here',
            image: 'https://www.placecage.com/gif/500/400',
        },
    ],
    perspective: 800,
};

export default CarouselInfinite3D;
