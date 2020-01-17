import { useEffect } from 'react';

function useResize(callback) {
    useEffect(() => {
        toggleEventListener('add');

        return () => {
            toggleEventListener('remove');
        };
    });

    const toggleEventListener = method => {
        window[`${method}EventListener`]('resize', handleResize);
    };

    const handleResize = () => {
        if (typeof callback === 'function') {
            callback();
        }
    };
}

export default useResize;
