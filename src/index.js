export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    // Serve static assets from the public directory
    return env.ASSETS.fetch(request);
  }
};
