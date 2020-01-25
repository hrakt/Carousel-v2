import React, { useEffect } from 'react';

import useScroll from 'hooks/useScroll';

import FiberScrollRig from 'components/ui/FiberScrollRig';

import styles from './Fiber.scss';
import config from 'components/ui/FiberScrollRig/config';

const FiberView = () => {
    useScroll(e => {
        config.top.current = e.target.scrollY;
    });

    // on refresh native browser scroll position is honored
    useEffect(() => {
        config.top.current = window.scrollY;
    }, []);

    return (
        <main className={styles.fiber}>
            <FiberScrollRig />
        </main>
    );
};

export default FiberView;
