import { useEffect } from 'react';

function useIntersection(ref, callback, options, dependencies) {
    useEffect(() => {
        if (ref.current == null) {
            return;
        }

        const observer = new IntersectionObserver(([entry]) => {
            if (typeof callback === 'function') {
                callback(entry.isIntersecting, entry);
            }
        }, options);

        observer.observe(ref.current);

        return () => {
            observer.unobserve(ref.current);
        };
    }, dependencies);
}

export default useIntersection;
