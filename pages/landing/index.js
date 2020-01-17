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
                <h1>Carousel Infinite Throw: No Snap</h1>
                <CarouselInfiniteThrow snap={false} />
                <h1>Carousel Infinite Throw: AutoPan</h1>
                <CarouselInfiniteThrow autoPan />
                <h1>Carousel Infinite Throw: Auto Pan No Snap</h1>
                <CarouselInfiniteThrow
                    snap={false}
                    autoPan
                    autoPanResetTimer={4}
                />
                <h1>Carousel Infinite Throw: Auto Pan Reverse Fast</h1>
                <CarouselInfiniteThrow
                    autoPan
                    autoPanDuration={2}
                    autoPanReverse
                />
                <h1>Carousel Infinite 3D</h1>
                <CarouselInfinite3D />
            </main>
        );
    }
}

export default Landing;
