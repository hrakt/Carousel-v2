import React, { Component } from 'react';

import CarouselInfiniteThrow from 'components/ui/CarouselInfiniteThrow';
import CarouselInfinite3D from 'components/ui/CarouselInfinite3D';

import styles from './Landing.scss';

class Landing extends Component {
    render() {
        return (
            <main className={styles.landing}>
                <h1>Carousel Infinite Throw: Center, 5-Up</h1>
                <CarouselInfiniteThrow center visibleSlideCount={5} />
                <h1>
                    Carousel Infinite Throw: Auto Pan Reverse, No Snap, 2-Up
                </h1>
                <h1>Carousel Infinite 3D</h1>
                <CarouselInfinite3D />
            </main>
        );
    }
}

export default Landing;
