import { useState, useEffect } from 'react';

const useMediaQuery = (query, defaultValue = false) => {
    const [matches, setMatches] = useState(defaultValue);

    useEffect(() => {
        let performingCleanup = false;

        const mediaQueryList = window.matchMedia(query);
        setMatches(!!mediaQueryList.matches);

        const handleChange = () => {
            if (performingCleanup) {
                return;
            }
            setMatches(!!mediaQueryList.matches);
        };

        mediaQueryList.addListener(handleChange);

        return () => {
            performingCleanup = true;
            mediaQueryList.removeListener(handleChange);
        };
    }, [query]);

    return matches;
};

export default useMediaQuery;
