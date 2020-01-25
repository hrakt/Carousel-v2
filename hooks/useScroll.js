import { useEffect } from 'react';
import { createThrottledEvent } from 'utils';

function useScroll(callback) {
    useEffect(() => {
        createThrottledEvent('scroll', 'optimizedScroll');
        toggleEventListener('add');

        return () => {
            toggleEventListener('remove');
        };
    });

    const toggleEventListener = method => {
        window[`${method}EventListener`]('optimizedScroll', handleScroll);
    };

    const handleScroll = e => {
        if (typeof callback === 'function') {
            callback(e);
        }
    };
}

export default useScroll;
