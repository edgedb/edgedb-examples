type SSEOptions = EventSourceInit & {
  payload?: string;
};

declare module "sse.js" {
  class SSE extends EventSource {
    constructor(url: string | URL, sseOptions?: SSEOptions);
    stream(): void;
  }
}
