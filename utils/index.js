export const createThrottledEvent = (type, name, obj) => {
    obj = obj || window;
    let running = false;
    const func = () => {
        if (running) {
            return;
        }
        running = true;
        requestAnimationFrame(() => {
            obj.dispatchEvent(new CustomEvent(name));
            running = false;
        });
    };
    obj.addEventListener(type, func);
};

// Returns true if it gets a screen bigger than given breakpoint
// breakpoint accepts either string or number
export function isMinScreenSize(breakpoint = 'tablet') {
    if (typeof window === 'undefined') return;

    const width = window.innerWidth;
    const breakpoints = {
        tablet: 720,
        tabletLandscape: 1024,
        desktop: 1120,
        largeDesktop: 1600,
    };

    if (typeof breakpoint === 'number') {
        return width >= breakpoint;
    }

    return width >= breakpoints[breakpoint];
}

// Real modulo
export function modulo(a, b) {
    return ((a % b) + b) % b;
}

// Get the nearest scrollable ancestor element
export function getScrollParent(node) {
    if (!node) {
        return null;
    }

    const isElement = node instanceof HTMLElement;
    const overflowY = isElement && window.getComputedStyle(node).overflowY;
    const isScrollable = overflowY !== 'visible' && overflowY !== 'hidden';

    if (isScrollable && node.scrollHeight >= node.clientHeight) {
        return node;
    }

    return getScrollParent(node.parentNode) || document.body;
}

// Get distance (iterations) between two array items (aka shortest path)
export function getShortestDistance(from, to, array) {
    if (from === to) {
        return 0;
    }
    const internal =
        Math.max(from, to) - Math.min(from, to) < array.length / 2
            ? true
            : false;
    if ((internal && from < to) || (!internal && from > to)) {
        return 1;
    } else {
        return -1;
    }
}

export function isTouchDevice() {
    if (typeof window !== 'undefined' && !!('ontouchstart' in window)) {
        return true;
    }
    return false;
}

export function getGridColumnWidth() {
    const style = getComputedStyle(document.body);
    const gridGap = parseInt(style.getPropertyValue('--grid-gap'), 10);
    const gridMargin = parseInt(style.getPropertyValue('--grid-margin'), 10);
    const gridColumns = parseInt(style.getPropertyValue('--grid-columns'), 10);
    return (
        (window.innerWidth - gridGap * (gridColumns - 1) - gridMargin * 2) /
        gridColumns
    );
}

export const pageView = (url, trackingId) => {
    window.gtag('config', trackingId, {
        page_path: url,
    });
};

/*
 * Tween to target using Zeno's Paradox
 * If distance between _val & _target is very small, return _target
 */
export function zTween(_val, _target, _ratio) {
    return Math.abs(_target - _val) < 1e-5
        ? _target
        : _val + (_target - _val) * Math.min(_ratio, 1.0);
}

// Javascript modulo bugfix
export function mod(n, m) {
    return ((n % m) + m) % m;
}

// Random integer from <low, high> interval
export function randInt(low, high) {
    return low + Math.floor(Math.random() * (high - low + 1));
}

// Fisher-Yates Shuffle
export function shuffle(array) {
    let m = array.length,
        i;

    // While there remain elements to shuffle
    while (m) {
        // Pick a remaining element
        i = ~~(Math.random() * m--);

        // And swap it with the current element.
        [array[m], array[i]] = [array[i], array[m]];
    }

    return array;
}

export function detectTouch(cb) {
    // Idea: https://stackoverflow.com/a/30303898/167378

    var lastTouchTime = 0;
    var isTouch = true;

    function mouseDetected() {
        // filter emulated events coming from touch events
        if (Date.now() - lastTouchTime < 500) {
            return;
        }
        if (isTouch) {
            isTouch = false;
            cb(false);
        }
    }

    function touchDetected() {
        lastTouchTime = Date.now();
        if (!isTouch) {
            isTouch = true;
            cb(true);
        }
    }

    document.addEventListener('touchstart', touchDetected, true);
    document.addEventListener('mousemove', mouseDetected, true);

    cb(isTouch);
}

export function preloadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = resolve;
        img.onerror = reject;
        if (img.complete && img.naturalWidth && img.naturalHeight) {
            resolve();
        }
    });
}

// Various Utils for ThreeJS Calcs

export function roundToThousandths(number) {
    return Math.round(1000 * number) / 1000;
}

export function clampZeroToOne(number) {
    if (number < 0) {
        return 0;
    }
    if (number >= 1) {
        return 1;
    } else {
        return number;
    }
}

export function isValidImage(img) {
    return img && img.file && img.file.url;
}
