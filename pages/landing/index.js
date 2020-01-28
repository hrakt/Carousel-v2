import React, { Component } from 'react';

import Carousel from '../../components/Carousel';

import styles from './Landing.scss';

class Landing extends Component {
    render() {
        return (
            <main className={styles.landing}>
                <h1>Carousel Infinite </h1>
                <Carousel />



            </main>
        );
    }
}

export default Landing;
