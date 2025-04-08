const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        createProxyMiddleware('/api',{
            target: 'http://localhost:5249',
            changeOrigin: true,
        })
    );

    app.use(
        createProxyMiddleware('/api/hubs/checklists', {
            target: 'ws://localhost:5249',
            ws: true,
            changeOrigin: true,
        })
    );
};