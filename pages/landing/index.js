import React, { Component } from 'react';

import CarouselInfiniteThrow from 'components/ui/CarouselInfiniteThrow';
import CarouselInfinite3D from 'components/ui/CarouselInfinite3D';

import styles from './Landing.scss';

class Landing extends Component {
    render() {
        return (
            <main className={styles.landing}>
                <h1>Carousel Infinite Throw: Default</h1>
                <CarouselInfiniteThrow />
                <h1>Carousel Infinite Throw: No Snap, 3-Up</h1>
                <CarouselInfiniteThrow snap={false} visibleSlideCount={3} />
                <h1>Carousel Infinite Throw: AutoPan, 5-Up</h1>
                <CarouselInfiniteThrow autoPan visibleSlideCount={5} />
                <h1>
                    Carousel Infinite Throw: Auto Pan Reverse, No Snap, 2-Up
                </h1>
                <CarouselInfiniteThrow
                    snap={false}
                    visibleSlideCount={2}
                    autoPan
                    autoPanReverse
                    autoPanResetTimer={4}
                />
                <h1>Carousel Infinite 3D</h1>
                <CarouselInfinite3D />
            </main>
        );
    }
}

export default Landing;
