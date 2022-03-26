const { createProxyMiddleware } = require("http-proxy-middleware");

// NOTE: Set your proxy with .env (use .env.sample)
// otherwise it will fallback to localserver:8000

// backround link on manual proxy config:
// https://create-react-app.dev/docs/proxying-api-requests-in-development/#configuring-the-proxy-manually

backendserver = process.env.REACT_APP_BACKEND;
if (
  process.env.REACT_APP_BACKEND == null ||
  process.env.REACT_APP_BACKEND == ""
) {
  backendserver = "http://localhost:8000";
}

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: backendserver,
      changeOrigin: true,
    })
  );
};
