const next = require('next');
const routes = require('./routes');
const express = require('express');
const LRUCache = require('lru-cache');

const port = parseInt(process.env.PORT, 10) || 3000;
const compression = require('compression');
const bodyParser = require('body-parser');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });

const ssrCache = new LRUCache({
    maxAge: 1000 * 60 * 60 * 3, // 3 hours
    max: 100,
});

function getCacheKey(req) {
    return `${req.url}`;
}

function renderAndCache(req, res, pagePath, queryParams) {
    const key = getCacheKey(req);

    // If we have a page in the cache, let's serve it
    if (!dev && ssrCache.has(key)) {
        res.setHeader('x-cache', `HIT ${key}`);
        res.send(ssrCache.get(key));
        return;
    }

    // If not let's render the page into HTML
    app.renderToHTML(req, res, pagePath, queryParams)
        .then(html => {
            // Let's cache this page
            res.setHeader('x-cache', `MISS ${key}`);
            ssrCache.set(key, html);
            res.send(html);
        })
        .catch(err => {
            app.renderError(err, req, res, pagePath, queryParams);
        });
}

const handler = routes.getRequestHandler(app, ({ req, res, route, query }) => {
    renderAndCache(req, res, route.page, query);
});

function redirect(req, res, next) {
    if (req.headers.host.slice(0, 4) === 'www.') {
        const newHost = req.headers.host.slice(4);
        return res.redirect(
            301,
            req.protocol + '://' + newHost + req.originalUrl
        );
    }
    next();
}

app.prepare().then(() => {
    const server = express();
    server.set('trust proxy', true);
    server.use(redirect);
    server.use(compression());
    server.use(bodyParser.json());

    // Allow contentful to hook into this and clear cache when published
    server.all('/clear-cache', (req, res) => {
        res.json({ result: 'Cached Cleared', keys: ssrCache.keys() });
        ssrCache.reset();
    });

    server.get('*', (req, res) => {
        return handler(req, res);
    });

    /* eslint-disable no-console */
    server.listen(port, err => {
        if (err) throw err;
        console.log(`Server ready on http://localhost:${port}`);
    });
});
